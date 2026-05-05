/**
 * Per-email account lockout — defense against credential-stuffing from
 * distributed proxy networks (where per-IP rate limiting fails).
 *
 * After N consecutive failed login attempts on the same email within
 * WINDOW_MS, that email is locked for LOCKOUT_MS. Successful login
 * clears the counter.
 *
 * Storage: in-memory Map. Acceptable for v1 since:
 *   - Failed attempts are an attack signal, not durable state.
 *   - On serverless (Vercel) the map lives per-instance; an attacker
 *     hitting different instances effectively gets N×instances tries.
 *     Vercel Fluid Compute reuses instances, so this is mitigated.
 *   - The bcrypt cost-10 + the per-IP rate limiter add latency the
 *     attacker still pays even on instance miss.
 *
 * For higher-security envs, swap the Map for Upstash Redis with the
 * same interface.
 */

const WINDOW_MS = 15 * 60 * 1000 // 15 min sliding window
const MAX_FAILED = 5 // lock after 5 consecutive fails
const LOCKOUT_MS = 15 * 60 * 1000 // lock for 15 min

interface Entry {
  fails: number
  firstFailAt: number // start of the current window
  lockedUntil?: number
}

const store = new Map<string, Entry>()

let cleanupInterval: ReturnType<typeof setInterval> | null = null
function startCleanup() {
  if (cleanupInterval) return
  cleanupInterval = setInterval(() => {
    const now = Date.now()
    Array.from(store.entries()).forEach(([k, e]) => {
      const expired =
        (e.lockedUntil && now > e.lockedUntil) ||
        (!e.lockedUntil && now - e.firstFailAt > WINDOW_MS)
      if (expired) store.delete(k)
    })
  }, 60_000)
}
startCleanup()

function key(email: string): string {
  return email.trim().toLowerCase()
}

/**
 * Call BEFORE attempting credential check. Returns lockout status.
 */
export function checkAccountLock(email: string): {
  locked: boolean
  retryAfterSec?: number
} {
  const e = store.get(key(email))
  if (!e?.lockedUntil) return { locked: false }
  const now = Date.now()
  if (now >= e.lockedUntil) {
    store.delete(key(email))
    return { locked: false }
  }
  return { locked: true, retryAfterSec: Math.ceil((e.lockedUntil - now) / 1000) }
}

/**
 * Call AFTER a failed credential check (wrong password, wrong TOTP, etc.)
 */
export function recordFailedAttempt(email: string): void {
  const k = key(email)
  const now = Date.now()
  const e = store.get(k)
  if (!e || now - e.firstFailAt > WINDOW_MS) {
    store.set(k, { fails: 1, firstFailAt: now })
    return
  }
  e.fails += 1
  if (e.fails >= MAX_FAILED) {
    e.lockedUntil = now + LOCKOUT_MS
  }
  store.set(k, e)
}

/**
 * Call AFTER a successful login — clears the counter.
 */
export function clearFailedAttempts(email: string): void {
  store.delete(key(email))
}
