const { authenticate, authorize, optionalAuth } = require('./auth')
const { validateInput, preventSQLInjection, rateLimit } = require('./validation')

/**
 * Middleware for securing different types of routes
 */

// Public routes - no authentication required
const publicRoute = [
  preventSQLInjection,
  rateLimit('ip')
]

// Protected routes - authentication required
const protectedRoute = [
  preventSQLInjection,
  rateLimit('user'),
  authenticate
]

// Admin only routes
const adminRoute = [
  preventSQLInjection,
  rateLimit('user'),
  authenticate,
  authorize('admin', 'super_admin')
]

// Optional authentication - user context if available
const optionalAuthRoute = [
  preventSQLInjection,
  rateLimit('ip'),
  optionalAuth
]

// Company-specific routes
const companyRoute = [
  preventSQLInjection,
  rateLimit('user'),
  authenticate,
  authorize('company', 'admin', 'super_admin')
]

// Student-specific routes
const studentRoute = [
  preventSQLInjection,
  rateLimit('user'),
  authenticate,
  authorize('student', 'admin', 'super_admin')
]

// University-specific routes
const universityRoute = [
  preventSQLInjection,
  rateLimit('user'),
  authenticate,
  authorize('university', 'admin', 'super_admin')
]

// Heavy rate limiting for sensitive operations
const sensitiveRoute = [
  preventSQLInjection,
  rateLimit('user', 3, 300000), // 3 attempts per 5 minutes
  authenticate
]

// Route security mapping for different endpoints
const routeSecurity = {
  // Authentication routes
  '/auth/login': [...publicRoute, rateLimit('ip', 5, 300000)], // 5 attempts per 5 min
  '/auth/register': [...publicRoute, rateLimit('ip', 3, 300000)], // 3 attempts per 5 min
  '/auth/forgot-password': [...publicRoute, rateLimit('ip', 3, 3600000)], // 3 per hour
  '/auth/reset-password': [...publicRoute, rateLimit('ip', 5, 3600000)],
  '/auth/verify-email': publicRoute,
  '/auth/refresh': publicRoute,
  '/auth/logout': protectedRoute,
  '/auth/me': protectedRoute,

  // User routes
  '/users': protectedRoute,
  '/users/profile': protectedRoute,
  '/users/settings': protectedRoute,
  '/users/delete': sensitiveRoute,

  // Company routes
  '/companies/profile': companyRoute,
  '/companies/jobs': companyRoute,
  '/companies/applications': companyRoute,
  '/companies/analytics': companyRoute,

  // Student routes
  '/students/profile': studentRoute,
  '/students/projects': studentRoute,
  '/students/applications': studentRoute,

  // University routes
  '/universities/profile': universityRoute,
  '/universities/students': universityRoute,
  '/universities/analytics': universityRoute,

  // Job routes
  '/jobs': optionalAuthRoute, // Public browse, auth for details
  '/jobs/create': companyRoute,
  '/jobs/update': companyRoute,
  '/jobs/delete': companyRoute,
  '/jobs/applications': companyRoute,

  // Application routes
  '/applications': protectedRoute,
  '/applications/create': studentRoute,
  '/applications/update': protectedRoute,
  '/applications/withdraw': protectedRoute,

  // Search routes
  '/search/jobs': optionalAuthRoute,
  '/search/students': companyRoute,
  '/search/companies': studentRoute,
  '/search/universities': publicRoute,

  // Matching routes
  '/matching/jobs': studentRoute,
  '/matching/candidates': companyRoute,
  '/matching/analytics': protectedRoute,

  // Analytics routes
  '/analytics/dashboard': protectedRoute,
  '/analytics/reports': adminRoute,
  '/analytics/system': adminRoute,

  // Admin routes
  '/admin/users': adminRoute,
  '/admin/reports': adminRoute,
  '/admin/system': adminRoute,
  '/admin/logs': adminRoute,

  // Public routes
  '/health': [],
  '/universities/list': publicRoute,
  '/companies/public': publicRoute,
  '/search/public': publicRoute
}

/**
 * Get security middleware for a route
 */
function getRouteSecurity(path, method = 'GET') {
  // Remove /api prefix and clean path
  const cleanPath = path.replace(/^\/api/, '').replace(/\/+/g, '/')

  // Check for exact match first
  if (routeSecurity[cleanPath]) {
    return routeSecurity[cleanPath]
  }

  // Check for pattern matches
  for (const [pattern, middleware] of Object.entries(routeSecurity)) {
    const regex = new RegExp('^' + pattern.replace(/:\w+/g, '[^/]+') + '$')
    if (regex.test(cleanPath)) {
      return middleware
    }
  }

  // Default to protected route for unknown endpoints
  console.warn(`No security configuration found for ${cleanPath}, defaulting to protected`)
  return protectedRoute
}

/**
 * Apply route-specific security middleware
 */
function applyRouteSecurity(router, routes) {
  for (const [path, handlers] of Object.entries(routes)) {
    const security = getRouteSecurity(path)

    if (Array.isArray(handlers)) {
      // Multiple handlers for different HTTP methods
      for (const [method, handler] of Object.entries(handlers)) {
        router[method.toLowerCase()](path, ...security, handler)
      }
    } else {
      // Single handler
      router.use(path, ...security, handlers)
    }
  }
}

/**
 * Middleware to check resource ownership
 */
function checkOwnership(resourceType) {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id
      const userId = req.userId

      if (!resourceId) {
        return res.status(400).json({
          success: false,
          error: 'Resource ID is required'
        })
      }

      // Admin users can access any resource
      if (req.user.role === 'admin' || req.user.role === 'super_admin') {
        return next()
      }

      // Check ownership based on resource type
      let isOwner = false

      switch (resourceType) {
        case 'project':
          // Check if user owns the project
          const project = await database.findProjectById(resourceId)
          isOwner = project && project.userId === userId
          break

        case 'application':
          // Check if user owns the application
          const application = await database.findApplicationById(resourceId)
          isOwner = application && application.userId === userId
          break

        case 'profile':
          // Users can only access their own profile
          isOwner = resourceId === userId
          break

        default:
          return res.status(400).json({
            success: false,
            error: 'Unknown resource type'
          })
      }

      if (!isOwner) {
        return res.status(403).json({
          success: false,
          error: 'Access denied - insufficient permissions'
        })
      }

      next()
    } catch (error) {
      console.error('Ownership check error:', error)
      res.status(500).json({
        success: false,
        error: 'Authorization check failed'
      })
    }
  }
}

module.exports = {
  publicRoute,
  protectedRoute,
  adminRoute,
  optionalAuthRoute,
  companyRoute,
  studentRoute,
  universityRoute,
  sensitiveRoute,
  getRouteSecurity,
  applyRouteSecurity,
  checkOwnership
}