const config = require('../config/environment')

/**
 * Advanced rate limiting middleware with Redis support
 * Provides granular rate limiting per endpoint type
 */

class AdvancedRateLimiter {
  constructor() {
    this.storage = new Map() // In-memory fallback
    this.redis = null // Redis client will be injected
  }

  // Set Redis client for distributed rate limiting
  setRedisClient(redisClient) {
    this.redis = redisClient
  }

  // Get storage key for rate limiting
  getKey(identifier, endpoint) {
    return `rate_limit:${identifier}:${endpoint}`
  }

  // Get current timestamp in seconds
  getCurrentWindow() {
    return Math.floor(Date.now() / 1000)
  }

  // Clean expired entries from memory storage
  cleanExpiredEntries() {
    const now = this.getCurrentWindow()
    for (const [key, data] of this.storage.entries()) {
      if (data.resetTime <= now) {
        this.storage.delete(key)
      }
    }
  }

  // Get rate limit data from storage
  async getRateData(key) {
    if (this.redis) {
      try {
        const data = await this.redis.hgetall(key)
        if (data.count) {
          return {
            count: parseInt(data.count),
            resetTime: parseInt(data.resetTime)
          }
        }
      } catch (error) {
        console.error('Redis rate limit error:', error)
      }
    }

    // Fallback to memory storage
    this.cleanExpiredEntries()
    return this.storage.get(key) || null
  }

  // Set rate limit data in storage
  async setRateData(key, count, resetTime, windowMs) {
    const data = { count, resetTime }

    if (this.redis) {
      try {
        await this.redis.hmset(key, data)
        await this.redis.expire(key, Math.ceil(windowMs / 1000))
        return
      } catch (error) {
        console.error('Redis rate limit set error:', error)
      }
    }

    // Fallback to memory storage
    this.storage.set(key, data)
  }

  // Increment rate limit counter
  async incrementRate(key, resetTime, windowMs) {
    if (this.redis) {
      try {
        const count = await this.redis.hincrby(key, 'count', 1)
        await this.redis.hset(key, 'resetTime', resetTime)
        await this.redis.expire(key, Math.ceil(windowMs / 1000))
        return count
      } catch (error) {
        console.error('Redis rate limit increment error:', error)
      }
    }

    // Fallback to memory storage
    const data = this.storage.get(key) || { count: 0, resetTime }
    data.count += 1
    this.storage.set(key, data)
    return data.count
  }

  // Check if request should be rate limited
  async checkRateLimit(identifier, endpoint, maxRequests, windowMs) {
    const key = this.getKey(identifier, endpoint)
    const now = this.getCurrentWindow()
    const windowStart = now - Math.floor(windowMs / 1000)

    let rateData = await this.getRateData(key)

    // Reset if window expired
    if (!rateData || rateData.resetTime <= now) {
      const resetTime = now + Math.floor(windowMs / 1000)
      const count = await this.incrementRate(key, resetTime, windowMs)

      return {
        allowed: count <= maxRequests,
        count,
        remaining: Math.max(0, maxRequests - count),
        resetTime,
        retryAfter: count > maxRequests ? resetTime - now : 0
      }
    }

    // Increment existing counter
    const count = await this.incrementRate(key, rateData.resetTime, windowMs)

    return {
      allowed: count <= maxRequests,
      count,
      remaining: Math.max(0, maxRequests - count),
      resetTime: rateData.resetTime,
      retryAfter: count > maxRequests ? rateData.resetTime - now : 0
    }
  }
}

// Singleton instance
const rateLimiter = new AdvancedRateLimiter()

// Rate limit configurations for different endpoint types
const rateLimitConfigs = {
  // Authentication endpoints (most restrictive)
  auth: {
    login: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 per 15 minutes
    register: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour
    'forgot-password': { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour
    'reset-password': { maxRequests: 5, windowMs: 60 * 60 * 1000 }, // 5 per hour
    refresh: { maxRequests: 10, windowMs: 60 * 1000 } // 10 per minute
  },

  // API endpoints by user type
  api: {
    // General API endpoints
    default: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 per minute

    // Heavy operations
    upload: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 per minute
    search: { maxRequests: 30, windowMs: 60 * 1000 }, // 30 per minute
    analytics: { maxRequests: 20, windowMs: 60 * 1000 }, // 20 per minute

    // User management
    profile: { maxRequests: 20, windowMs: 60 * 1000 }, // 20 per minute
    settings: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 per minute

    // AI/ML endpoints (expensive operations)
    ai: { maxRequests: 5, windowMs: 60 * 1000 }, // 5 per minute
    matching: { maxRequests: 10, windowMs: 60 * 1000 } // 10 per minute
  },

  // Public endpoints (less restrictive but still limited)
  public: {
    default: { maxRequests: 200, windowMs: 60 * 1000 }, // 200 per minute
    health: { maxRequests: 1000, windowMs: 60 * 1000 }, // 1000 per minute
    static: { maxRequests: 500, windowMs: 60 * 1000 } // 500 per minute
  }
}

// Get identifier for rate limiting
function getIdentifier(req, useUserId = false) {
  if (useUserId && req.user?.id) {
    return `user:${req.user.id}`
  }

  // Use IP address with forwarded headers consideration
  const forwarded = req.headers['x-forwarded-for']
  const ip = forwarded ? forwarded.split(',')[0].trim() : req.connection.remoteAddress
  return `ip:${ip}`
}

// Determine endpoint category and type
function getEndpointConfig(req) {
  const path = req.path.toLowerCase()

  // Authentication endpoints
  if (path.startsWith('/api/auth/')) {
    const authType = path.split('/api/auth/')[1].split('/')[0]
    return {
      category: 'auth',
      type: authType,
      config: rateLimitConfigs.auth[authType] || rateLimitConfigs.auth.login
    }
  }

  // Public endpoints
  if (path === '/health' || path === '/api/health' || path.startsWith('/public/')) {
    return {
      category: 'public',
      type: 'health',
      config: rateLimitConfigs.public.health
    }
  }

  // API endpoints
  if (path.startsWith('/api/')) {
    // Determine API type based on path
    if (path.includes('/upload') || path.includes('/file')) {
      return {
        category: 'api',
        type: 'upload',
        config: rateLimitConfigs.api.upload
      }
    }

    if (path.includes('/search')) {
      return {
        category: 'api',
        type: 'search',
        config: rateLimitConfigs.api.search
      }
    }

    if (path.includes('/analytics')) {
      return {
        category: 'api',
        type: 'analytics',
        config: rateLimitConfigs.api.analytics
      }
    }

    if (path.includes('/ai') || path.includes('/matching')) {
      return {
        category: 'api',
        type: 'ai',
        config: rateLimitConfigs.api.ai
      }
    }

    if (path.includes('/profile') || path.includes('/me')) {
      return {
        category: 'api',
        type: 'profile',
        config: rateLimitConfigs.api.profile
      }
    }

    // Default API rate limit
    return {
      category: 'api',
      type: 'default',
      config: rateLimitConfigs.api.default
    }
  }

  // Default public rate limit
  return {
    category: 'public',
    type: 'default',
    config: rateLimitConfigs.public.default
  }
}

// Create rate limiting middleware
function createRateLimit(options = {}) {
  return async (req, res, next) => {
    try {
      const endpointConfig = getEndpointConfig(req)
      const identifier = getIdentifier(req, options.useUserId || req.user?.id)
      const endpoint = `${endpointConfig.category}:${endpointConfig.type}`

      const result = await rateLimiter.checkRateLimit(
        identifier,
        endpoint,
        endpointConfig.config.maxRequests,
        endpointConfig.config.windowMs
      )

      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': endpointConfig.config.maxRequests,
        'X-RateLimit-Remaining': result.remaining,
        'X-RateLimit-Reset': new Date(result.resetTime * 1000).toISOString(),
        'X-RateLimit-Window': Math.floor(endpointConfig.config.windowMs / 1000)
      })

      if (!result.allowed) {
        // Log rate limit violation
        if (config.isDevelopment()) {
          console.warn('Rate limit exceeded:', {
            identifier,
            endpoint,
            count: result.count,
            limit: endpointConfig.config.maxRequests
          })
        }

        res.set('Retry-After', result.retryAfter)
        return res.status(429).json({
          success: false,
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${result.retryAfter} seconds.`,
          retryAfter: result.retryAfter
        })
      }

      next()
    } catch (error) {
      console.error('Rate limiting error:', error)
      // Don't block requests if rate limiting fails
      next()
    }
  }
}

// Specific rate limiters for different scenarios
const authRateLimit = createRateLimit({ useUserId: false }) // Always use IP for auth
const apiRateLimit = createRateLimit({ useUserId: true })   // Use user ID when available
const publicRateLimit = createRateLimit({ useUserId: false }) // Always use IP for public

module.exports = {
  rateLimiter,
  createRateLimit,
  authRateLimit,
  apiRateLimit,
  publicRateLimit,
  rateLimitConfigs
}