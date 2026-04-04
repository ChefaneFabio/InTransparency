const express = require('express')
const cors = require('cors')
const path = require('path')
const config = require('./config/environment')

// Import routes
const authRoutes = require('./routes/auth')
const universitiesRoutes = require('./routes/universities')
const jobsRoutes = require('./routes/jobs')
const companiesRoutes = require('./routes/companies')
const studentsRoutes = require('./routes/students')
const applicationsRoutes = require('./routes/applications')
const searchRoutes = require('./routes/search')
const matchingRoutes = require('./routes/matching')
const usersRoutes = require('./routes/users')
const analyticsRoutes = require('./routes/analytics')
const dataSeedingRoutes = require('./routes/data-seeding')
const { authenticate } = require('./middleware/auth')
const { serviceAuth } = require('./middleware/serviceAuth')
const { preventSQLInjection, rateLimit } = require('./middleware/validation')
const { createSecurityStack } = require('./middleware/security')
const uploadRoutes = require('./routes/upload')

const app = express()
const PORT = config.getConfig().port

// Configure CORS with dynamic origin validation
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (server-to-server, mobile apps, Postman)
    if (!origin) {
      return callback(null, true)
    }

    const allowedOrigins = config.getCorsOrigins()

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else if (config.isDevelopment()) {
      // In development, log unrecognized origins but allow them
      console.warn(`⚠️  CORS: Unrecognized origin ${origin}`)
      callback(null, true)
    } else {
      // In production, reject unrecognized origins
      callback(new Error(`Origin ${origin} not allowed by CORS`))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id', 'X-User-Role'],
  maxAge: 86400 // Cache preflight requests for 24 hours
}

app.use(cors(corsOptions))

// Security middleware (apply early)
const securityStack = createSecurityStack()
securityStack.forEach(middleware => app.use(middleware))

// Middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    message: 'InTransparency API is running!',
    timestamp: new Date().toISOString(),
    environment: config.getConfig().nodeEnv
  })
})

// API routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'api',
    timestamp: new Date().toISOString()
  })
})

// Remove mock endpoints in production
if (config.isDevelopment()) {
  // Mock auth endpoints for testing (development only)
  app.post('/api/auth/login', (req, res) => {
    res.json({
      success: true,
      message: 'Login endpoint working (MOCK)',
      token: 'mock-token-dev-only',
      user: { id: 1, email: 'test@example.com', role: 'student' }
    })
  })

  app.post('/api/auth/register', (req, res) => {
    res.json({
      success: true,
      message: 'Register endpoint working (MOCK)',
      token: 'mock-token-dev-only',
      user: { id: 1, email: 'test@example.com', role: 'student' }
    })
  })

  // Mock projects endpoint
  app.get('/api/projects', (req, res) => {
    res.json({
      success: true,
      projects: [],
      message: 'Mock endpoint - development only'
    })
  })
}

// Upload health check (public, no auth)
app.get('/api/upload/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'upload',
    r2Configured: !!(process.env.R2_ENDPOINT && process.env.R2_ACCESS_KEY_ID),
    serviceKeyConfigured: !!process.env.BACKEND_SERVICE_KEY,
  })
})

// Upload routes (service-to-service auth, before JWT middleware)
app.use('/api/upload', serviceAuth, uploadRoutes)

// Mount authentication routes (public)
app.use('/api/auth', authRoutes)

// Add global middleware for protected routes
app.use('/api', preventSQLInjection)
app.use('/api', rateLimit('ip'))

// Mount protected API routes
app.use('/api/users', authenticate, usersRoutes)
app.use('/api/applications', authenticate, applicationsRoutes)
app.use('/api/matching', authenticate, matchingRoutes)
app.use('/api/analytics', authenticate, analyticsRoutes)

// Mount semi-protected routes (some endpoints public, some protected)
app.use('/api/universities', universitiesRoutes)
app.use('/api/jobs', jobsRoutes)
app.use('/api/companies', companiesRoutes)
app.use('/api/students', studentsRoutes)
app.use('/api/search', searchRoutes)

// Data seeding routes (development only)
if (config.isDevelopment()) {
  app.use('/api/data-seeding', authenticate, dataSeedingRoutes)
}

// Catch-all for undefined routes
app.get('*', (req, res) => {
  res.json({
    message: 'InTransparency API',
    version: '2.0.0',
    endpoints: [
      '/health',
      '/api/health',
      '/api/auth/login',
      '/api/auth/register',
      '/api/projects',
      '/api/universities',
      '/api/jobs',
      '/api/companies',
      '/api/students',
      '/api/applications',
      '/api/search',
      '/api/matching',
      '/api/users',
      '/api/analytics',
      '/api/data-seeding'
    ]
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  // Always log errors for debugging
  console.error('Error:', err.message, req.method, req.path)

  // Don't leak error details in production
  const message = config.isProduction()
    ? 'Internal Server Error'
    : err.message

  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: message,
    ...(config.isDevelopment() && { stack: err.stack })
  })
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 InTransparency API running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🌍 Environment: ${config.getConfig().nodeEnv}`)
  console.log(`🔒 CORS Origins: ${config.getCorsOrigins().join(', ')}`)

  // Warn about mock endpoints in development
  if (config.isDevelopment()) {
    console.log('⚠️  Warning: Mock endpoints are enabled (development mode)')
  }
})

module.exports = app