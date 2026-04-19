/**
 * Simple in-memory rate limiter for API routes.
 * For production at scale, replace with Redis-backed solution (e.g. @upstash/ratelimit).
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const stores = new Map<string, Map<string, RateLimitEntry>>()

// Periodic cleanup to prevent memory leaks (every 5 minutes)
let cleanupInterval: ReturnType<typeof setInterval> | null = null

const startCleanup = () => {
  if (cleanupInterval) return
  cleanupInterval = setInterval(() => {
    const now = Date.now()
    Array.from(stores.values()).forEach((store) => {
      Array.from(store.entries()).forEach(([key, entry]) => {
        if (now > entry.resetTime) {
          store.delete(key)
        }
      })
    })
  }, 5 * 60 * 1000)
}

/**
 * Create a rate limiter for a specific endpoint.
 * @param name - Unique name for this limiter
 * @param maxRequests - Max requests per window
 * @param windowMs - Time window in milliseconds
 */
export const createRateLimit = (name: string, maxRequests: number, windowMs: number) => {
  if (!stores.has(name)) {
    stores.set(name, new Map())
  }
  startCleanup()

  return {
    /**
     * Check if a request is allowed.
     * @param key - Usually IP address or user ID
     * @returns { success: boolean, remaining: number, resetIn: number }
     */
    check: (key: string): { success: boolean; remaining: number; resetIn: number } => {
      const store = stores.get(name)!
      const now = Date.now()
      const entry = store.get(key)

      if (!entry || now > entry.resetTime) {
        store.set(key, { count: 1, resetTime: now + windowMs })
        return { success: true, remaining: maxRequests - 1, resetIn: windowMs }
      }

      if (entry.count >= maxRequests) {
        return { success: false, remaining: 0, resetIn: entry.resetTime - now }
      }

      entry.count++
      return { success: true, remaining: maxRequests - entry.count, resetIn: entry.resetTime - now }
    },
  }
}

/**
 * Extract client IP from request headers.
 */
export const getClientIp = (request: Request): string => {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return request.headers.get('x-real-ip') || 'unknown'
}

// Pre-configured limiters for common use cases
export const authLimiter = createRateLimit('auth', 10, 15 * 60 * 1000) // 10 per 15 min
export const chatLimiter = createRateLimit('chat', 30, 60 * 1000) // 30 per min
export const aiLimiter = createRateLimit('ai', 20, 60 * 1000) // 20 per min
export const uploadLimiter = createRateLimit('upload', 10, 60 * 1000) // 10 per min

// Public-endpoint limiters — protect unauthenticated surfaces
export const publicReadLimiter = createRateLimit('publicRead', 60, 60 * 1000) // 60 per min
export const credentialVerifyLimiter = createRateLimit('credVerify', 30, 60 * 1000) // 30 per min
export const directoryLimiter = createRateLimit('directory', 30, 60 * 1000) // 30 per min

/**
 * Helper: wrap a route and reject with 429 if over limit.
 */
export function enforceRateLimit(
  limiter: ReturnType<typeof createRateLimit>,
  request: Request
): Response | null {
  const ip = getClientIp(request)
  const { success, remaining, resetIn } = limiter.check(ip)
  if (!success) {
    return new Response(
      JSON.stringify({ error: 'Too many requests', retryAfterSec: Math.ceil(resetIn / 1000) }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil(resetIn / 1000)),
          'X-RateLimit-Remaining': '0',
        },
      }
    )
  }
  return null
}
