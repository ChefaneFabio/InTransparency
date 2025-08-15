const rateLimit = require('express-rate-limit')
const RedisStore = require('rate-limit-redis')
const Redis = require('ioredis')

// Initialize Redis client for rate limiting
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
})

// Handle Redis connection errors gracefully
redis.on('error', (err) => {
  console.warn('Redis connection error for rate limiting:', err.message)
  // Rate limiting will fall back to memory store if Redis fails
})

// Create rate limit middleware factory
const rateLimitMiddleware = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
      res.status(429).json(options.message || defaultOptions.message)
    },
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === '/health' || req.path === '/api/health'
    },
    keyGenerator: (req) => {
      // Use IP address as key, but also consider user ID if authenticated
      if (req.user && req.user.id) {
        return `${req.ip}:${req.user.id}`
      }
      return req.ip
    }
  }

  const finalOptions = { ...defaultOptions, ...options }

  // Use Redis store if available, otherwise fall back to memory store
  if (redis.status === 'ready' || redis.status === 'connecting') {
    try {
      finalOptions.store = new RedisStore({
        sendCommand: (...args) => redis.call(...args),
      })
    } catch (error) {
      console.warn('Failed to initialize Redis store for rate limiting:', error.message)
      // Will use default memory store
    }
  }

  return rateLimit(finalOptions)
}

// Predefined rate limiters for common use cases
const authRateLimit = rateLimitMiddleware({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 auth attempts per 15 minutes
  message: {
    error: 'Too many authentication attempts, please try again later'
  }
})

const apiRateLimit = rateLimitMiddleware({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 API calls per 15 minutes
  message: {
    error: 'Too many API requests, please try again later'
  }
})

const uploadRateLimit = rateLimitMiddleware({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 uploads per hour
  message: {
    error: 'Too many file uploads, please try again later'
  }
})

const passwordResetRateLimit = rateLimitMiddleware({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 password reset attempts per hour
  message: {
    error: 'Too many password reset attempts, please try again later'
  }
})

const emailVerificationRateLimit = rateLimitMiddleware({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 email verification requests per hour
  message: {
    error: 'Too many email verification requests, please try again later'
  }
})

// Strict rate limit for expensive operations
const strictRateLimit = rateLimitMiddleware({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour
  message: {
    error: 'Rate limit exceeded for this operation, please try again later'
  }
})

// Very strict rate limit for admin operations
const adminRateLimit = rateLimitMiddleware({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 100 admin operations per hour
  message: {
    error: 'Admin operation rate limit exceeded'
  }
})

module.exports = {
  rateLimitMiddleware,
  authRateLimit,
  apiRateLimit,
  uploadRateLimit,
  passwordResetRateLimit,
  emailVerificationRateLimit,
  strictRateLimit,
  adminRateLimit,
}