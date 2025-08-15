const logger = require('../utils/logger')

// Not found middleware
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message

  // Log error
  logger.error(`Error ${statusCode}: ${message}`, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    stack: err.stack
  })

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404
    message = 'Resource not found'
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400
    message = 'Duplicate field value entered'
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(err.errors).map(val => val.message).join(', ')
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token'
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired'
  }

  // PostgreSQL errors
  if (err.code === '23505') {
    statusCode = 400
    message = 'Duplicate entry'
  }

  if (err.code === '23503') {
    statusCode = 400
    message = 'Foreign key constraint violation'
  }

  if (err.code === '42P01') {
    statusCode = 500
    message = 'Database table does not exist'
  }

  // Rate limit error
  if (err.message && err.message.includes('Rate limit')) {
    statusCode = 429
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400
    message = 'File too large'
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    statusCode = 400
    message = 'Too many files'
  }

  // Network/timeout errors
  if (err.code === 'ECONNREFUSED') {
    statusCode = 503
    message = 'Service unavailable'
  }

  if (err.code === 'ETIMEDOUT') {
    statusCode = 504
    message = 'Request timeout'
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

// Validation error handler
const validationErrorHandler = (errors) => {
  const formattedErrors = {}
  
  if (Array.isArray(errors)) {
    errors.forEach(error => {
      formattedErrors[error.param] = error.msg
    })
  } else if (typeof errors === 'object') {
    Object.keys(errors).forEach(key => {
      formattedErrors[key] = errors[key]
    })
  }
  
  return {
    success: false,
    error: 'Validation failed',
    details: formattedErrors
  }
}

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Remove powered by header
  res.removeHeader('X-Powered-By')
  
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Add CORS headers if needed
  if (process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }
  
  next()
}

// Request timeout middleware
const requestTimeout = (timeout = 30000) => (req, res, next) => {
  const timer = setTimeout(() => {
    if (!res.headersSent) {
      res.status(408).json({
        success: false,
        error: 'Request timeout'
      })
    }
  }, timeout)
  
  res.on('finish', () => {
    clearTimeout(timer)
  })
  
  res.on('close', () => {
    clearTimeout(timer)
  })
  
  next()
}

module.exports = {
  notFound,
  errorHandler,
  asyncHandler,
  validationErrorHandler,
  securityHeaders,
  requestTimeout
}