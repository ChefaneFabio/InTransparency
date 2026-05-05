/**
 * Password policy + breach check.
 *
 * Two layers:
 *   1. Local rules — minimum length 12, must contain both letter and digit.
 *      Cheap, runs on every register / change-password.
 *   2. HaveIBeenPwned k-anonymity check — submits the first 5 chars of a
 *      SHA-1 hash and gets back a list of suffixes that have appeared in
 *      breaches. The plaintext or full hash NEVER leaves our server.
 *      https://haveibeenpwned.com/API/v3#PwnedPasswords
 *
 * Both are best-effort: HIBP can be slow or down, in which case we
 * fail-open (accept the password) rather than deny a legitimate user.
 */

import crypto from 'crypto'

const MIN_LENGTH = 12
const HIBP_URL = 'https://api.pwnedpasswords.com/range/'

export interface PasswordCheckResult {
  ok: boolean
  reason?: string
  pwnedCount?: number // how many times this password has appeared in breaches
}

/**
 * Local-only rules (no network call). Use as the first gate; HIBP is
 * called separately so a slow network doesn't block the form when only
 * the local rules fail.
 */
export function checkPasswordLocal(password: string): PasswordCheckResult {
  if (typeof password !== 'string' || password.length < MIN_LENGTH) {
    return {
      ok: false,
      reason: `Password must be at least ${MIN_LENGTH} characters.`,
    }
  }
  if (password.length > 128) {
    return { ok: false, reason: 'Password is too long (max 128 characters).' }
  }
  if (!/[a-zA-Z]/.test(password)) {
    return { ok: false, reason: 'Password must include at least one letter.' }
  }
  if (!/\d/.test(password)) {
    return { ok: false, reason: 'Password must include at least one digit.' }
  }
  return { ok: true }
}

/**
 * Combined check: local rules first (fast fail), then HIBP if local passes.
 * Returns ok=false with reason on any failure.
 *
 * On HIBP outage / timeout / network error, this fail-opens: a legitimate
 * user is never blocked because of a third-party hiccup, and brute-force
 * defenders (rate limit, bcrypt cost-10, account lockout) still apply.
 */
export async function checkPassword(password: string): Promise<PasswordCheckResult> {
  const local = checkPasswordLocal(password)
  if (!local.ok) return local

  try {
    const hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase()
    const prefix = hash.slice(0, 5)
    const suffix = hash.slice(5)

    const res = await fetch(`${HIBP_URL}${prefix}`, {
      // HIBP asks for this header to identify clients
      headers: { 'Add-Padding': 'true', 'User-Agent': 'InTransparency/1.0' },
      signal: AbortSignal.timeout(2_500),
    })
    if (!res.ok) return { ok: true } // fail-open

    const text = await res.text()
    // Each line: "<HASH_SUFFIX>:<COUNT>"
    for (const line of text.split('\n')) {
      const [s, c] = line.trim().split(':')
      if (s === suffix) {
        const count = parseInt(c, 10) || 0
        // We block any password seen in breaches, even once. The HIBP
        // dataset is the lower bound — if it's been leaked, every
        // credential-stuffing toolkit has it.
        return {
          ok: false,
          reason:
            'This password has appeared in known data breaches. Choose a different one.',
          pwnedCount: count,
        }
      }
    }
    return { ok: true }
  } catch {
    // Network / timeout — accept and let other layers (rate-limit,
    // bcrypt, MFA, lockout) catch abuse.
    return { ok: true }
  }
}
