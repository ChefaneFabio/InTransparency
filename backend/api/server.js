const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001

// Enable CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
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

// Catch-all for undefined routes
app.get('*', (req, res) => {
  res.json({
    message: 'InTransparency API',
    version: '1.0.0',
    endpoints: ['/health', '/api/health', '/api/auth/login', '/api/auth/register', '/api/projects']
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