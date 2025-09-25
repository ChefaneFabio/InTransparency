const express = require('express')
const cors = require('cors')
const path = require('path')

// Import routes
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

const app = express()
const PORT = process.env.PORT || 3001

// Enable CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'https://in-transparency-9visdfu70-chefanefabios-projects.vercel.app',
    'https://in-transparency-m5krpwb5s-chefanefabios-projects.vercel.app',
    process.env.FRONTEND_URL
  ].filter(url => Boolean(url)),
  credentials: true
}))

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    message: 'InTransparency API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
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

// Mock auth endpoints for testing
app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login endpoint working',
    token: 'mock-token',
    user: { id: 1, email: 'test@example.com', role: 'student' }
  })
})

app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    message: 'Register endpoint working',
    token: 'mock-token',
    user: { id: 1, email: 'test@example.com', role: 'student' }
  })
})

// Mock projects endpoint
app.get('/api/projects', (req, res) => {
  res.json({
    success: true,
    projects: []
  })
})

// Mount new API routes
app.use('/api/universities', universitiesRoutes)
app.use('/api/jobs', jobsRoutes)
app.use('/api/companies', companiesRoutes)
app.use('/api/students', studentsRoutes)
app.use('/api/applications', applicationsRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/matching', matchingRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/data-seeding', dataSeedingRoutes)

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
  console.error('Error:', err.message)
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  })
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 InTransparency API running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})

module.exports = app