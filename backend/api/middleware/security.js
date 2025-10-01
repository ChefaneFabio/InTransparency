const config = require('../config/environment')

/**
 * Security headers middleware
 * Implements comprehensive HTTP security headers
 */

// Security headers configuration
const securityHeaders = {
  // Prevent clickjacking attacks
  'X-Frame-Options': 'DENY',

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Enable XSS protection
  'X-XSS-Protection': '1; mode=block',

  // Referrer policy for privacy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions policy (formerly feature policy)
  'Permissions-Policy': [
    'accelerometer=()',
    'camera=()',
    'geolocation=()',
    'gyroscope=()',
    'magnetometer=()',
    'microphone=()',
    'payment=()',
    'usb=()'
  ].join(', '),

  // Cross-Origin policies
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin'
}

// Content Security Policy configuration
const getCSPDirectives = () => {
  const isProduction = config.isProduction()
  const isVercelDeployment = process.env.VERCEL === '1'

  const baseDirectives = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Next.js SSR requires this
      "'unsafe-eval'", // Next.js chunk loading requires this
      'https://vercel.live',
      'https://*.vercel.app',
      'https://vitals.vercel-insights.com'
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for styled-components and CSS-in-JS
      'https://fonts.googleapis.com'
    ],
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
      'data:'
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https:',
      'https://*.amazonaws.com',
      'https://*.vercel.app',
      'https://*.vercel.com'
    ],
    'connect-src': [
      "'self'",
      'https://api.openai.com',
      'wss://ws.pusher.com',
      'https://vitals.vercel-insights.com',
      'https://*.vercel.app',
      'https://*.vercel.com'
    ],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"]
  }

  // Vercel-specific adjustments
  if (isVercelDeployment || !isProduction) {
    // Allow Vercel's build and runtime requirements
    baseDirectives['script-src'].push(
      'https://*.vercel.app',
      'https://*.vercel.com',
      "'wasm-unsafe-eval'" // For WebAssembly
    )
    baseDirectives['worker-src'] = ["'self'", 'blob:']
    baseDirectives['child-src'] = ["'self'", 'blob:']
  }

  if (!isProduction) {
    // Development additions
    baseDirectives['script-src'].push(
      'http://localhost:*',
      'ws://localhost:*',
      'webpack://*'
    )
    baseDirectives['connect-src'].push(
      'http://localhost:*',
      'ws://localhost:*',
      'wss://localhost:*'
    )
  } else {
    // Production-only directives
    baseDirectives['upgrade-insecure-requests'] = []
  }

  return baseDirectives
}

// Build CSP header value
const buildCSPHeader = () => {
  const directives = getCSPDirectives()
  return Object.entries(directives)
    .map(([key, values]) => {
      if (Array.isArray(values) && values.length === 0) {
        return key
      }
      return `${key} ${values.join(' ')}`
    })
    .join('; ')
}

// HSTS configuration for production
const getHSTSHeader = () => {
  if (config.isProduction()) {
    return 'max-age=31536000; includeSubDomains; preload'
  }
  return null
}

// Security headers middleware
const securityHeadersMiddleware = (req, res, next) => {
  // Apply standard security headers
  Object.entries(securityHeaders).forEach(([header, value]) => {
    res.setHeader(header, value)
  })

  // Apply CSP
  res.setHeader('Content-Security-Policy', buildCSPHeader())

  // Apply HSTS in production
  const hsts = getHSTSHeader()
  if (hsts) {
    res.setHeader('Strict-Transport-Security', hsts)
  }

  // Security-focused cache control
  if (req.path.includes('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
  }

  next()
}

// Remove sensitive headers
const removeSensitiveHeaders = (req, res, next) => {
  // Remove server identification
  res.removeHeader('X-Powered-By')
  res.removeHeader('Server')

  // Remove Express/Node.js version info
  if (res.getHeader('X-Powered-By')) {
    res.removeHeader('X-Powered-By')
  }

  next()
}

// Request sanitization middleware
const sanitizeRequest = (req, res, next) => {
  // Remove potentially dangerous headers
  const dangerousHeaders = [
    'x-forwarded-host',
    'x-forwarded-proto',
    'x-forwarded-port'
  ]

  dangerousHeaders.forEach(header => {
    if (req.headers[header] && !config.isProduction()) {
      // Allow in development but log
      if (config.isDevelopment()) {
        console.warn(`Dangerous header detected: ${header}`)
      }
    } else if (req.headers[header]) {
      delete req.headers[header]
    }
  })

  // Limit request size (already handled by express.json but double-check)
  const contentLength = parseInt(req.headers['content-length'] || '0')
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (contentLength > maxSize) {
    return res.status(413).json({
      success: false,
      error: 'Request entity too large'
    })
  }

  next()
}

// Security monitoring middleware
const securityMonitoring = (req, res, next) => {
  // Log suspicious patterns
  const suspiciousPatterns = [
    /\.\./,           // Path traversal
    /<script/i,       // XSS attempts
    /union.*select/i, // SQL injection
    /javascript:/i,   // JavaScript protocol
    /data:/i,         // Data URLs in unexpected places
    /vbscript:/i      // VBScript
  ]

  const checkValue = (value) => {
    if (typeof value === 'string') {
      return suspiciousPatterns.some(pattern => pattern.test(value))
    }
    return false
  }

  // Check URL, query, and body for suspicious patterns
  const suspicious = [
    req.url,
    JSON.stringify(req.query),
    JSON.stringify(req.body)
  ].some(checkValue)

  if (suspicious) {
    console.warn('Suspicious request detected:', {
      ip: req.ip,
      url: req.url,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    })

    // In production, you might want to block or rate-limit these requests
    if (config.isProduction()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request'
      })
    }
  }

  next()
}

// Create comprehensive security middleware stack
const createSecurityStack = () => {
  return [
    removeSensitiveHeaders,
    securityHeadersMiddleware,
    sanitizeRequest,
    securityMonitoring
  ]
}

module.exports = {
  securityHeadersMiddleware,
  removeSensitiveHeaders,
  sanitizeRequest,
  securityMonitoring,
  createSecurityStack,
  // Export for testing
  getCSPDirectives,
  buildCSPHeader
}