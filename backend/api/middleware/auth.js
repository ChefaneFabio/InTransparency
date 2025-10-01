const jwt = require('jsonwebtoken')
const database = require('../database/Database')

// Validate JWT_SECRET at module load time
if (!process.env.JWT_SECRET) {
  throw new Error('CRITICAL: JWT_SECRET environment variable is required. Please set it before starting the application.')
}

// Validate JWT_SECRET strength
if (process.env.JWT_SECRET.length < 32) {
  console.warn('WARNING: JWT_SECRET should be at least 32 characters for security')
}

// Authenticate JWT token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Get user from database
    const user = await database.findUserById(decoded.userId)
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token - user not found'
      })
    }

    // Add user to request object
    req.user = user
    req.userId = user.id
    
    next()
  } catch (error) {
    // Log authentication errors securely (avoid exposing sensitive details)
    if (process.env.NODE_ENV === 'development') {
      console.error('Authentication error:', error.message)
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      })
    }
    
    return res.status(500).json({
      success: false,
      error: 'Authentication failed'
    })
  }
}

// Optional authentication (for public endpoints that benefit from user context)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next()
    }

    const token = authHeader.substring(7)
    
    if (!token) {
      return next()
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await database.findUserById(decoded.userId)
    
    if (user) {
      req.user = user
      req.userId = user.id
    }
    
    next()
  } catch (error) {
    // For optional auth, continue even if token is invalid
    next()
  }
}

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      })
    }

    next()
  }
}

// Resource ownership check
const checkOwnership = (resourceType) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id
      const userId = req.userId
      
      let resource = null
      
      switch (resourceType) {
        case 'course':
          resource = await database.findCourseById(resourceId)
          break
        case 'project':
          resource = await database.findProjectById(resourceId)
          break
        default:
          return res.status(400).json({
            success: false,
            error: 'Unknown resource type'
          })
      }
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          error: `${resourceType} not found`
        })
      }
      
      // Check ownership or admin role
      if (resource.userId !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied - not resource owner'
        })
      }
      
      req.resource = resource
      next()
    } catch (error) {
      // Log ownership check errors securely
      if (process.env.NODE_ENV === 'development') {
        console.error('Ownership check error:', error.message)
      }
      return res.status(500).json({
        success: false,
        error: 'Authorization check failed'
      })
    }
  }
}

module.exports = {
  authenticate,
  optionalAuth,
  authorize,
  checkOwnership
}