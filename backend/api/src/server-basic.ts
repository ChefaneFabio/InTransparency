import express from 'express'
import cors from 'cors'

console.log('Starting TypeScript server...')

const app = express()
const PORT = 3001

// Basic middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://intransparency.vercel.app'],
  credentials: true
}))
app.use(express.json())

// LinkedIn Integration Routes (temporarily disabled due to TypeScript errors)
// app.use('/api/linkedin', linkedinRoutes)

// Routes
app.get('/health', (_req, res) => {
  console.log('Health check requested')
  res.json({
    status: 'healthy',
    message: 'InTransparency API is running!',
    timestamp: new Date().toISOString()
  })
})

app.get('/api/auth/me', (_req, res) => {
  console.log('Auth me requested')
  res.status(401).json({ error: 'Not authenticated (demo mode)' })
})

app.post('/api/auth/login', (req, res) => {
  console.log('Login requested:', req.body.email)
  res.status(401).json({ error: 'Authentication not yet implemented' })
})

app.post('/api/auth/register', (req, res) => {
  console.log('Register requested:', req.body.email)
  res.status(501).json({ error: 'Registration not yet implemented' })
})

// Start server
console.log('About to start listening...')

app.listen(PORT, () => {
  console.log(`🚀 InTransparency API server running on http://localhost:${PORT}`)
  console.log(`💚 Health check: http://localhost:${PORT}/health`)
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/*`)
}).on('error', (err) => {
  console.error('Server error:', err)
})

console.log('TypeScript setup complete')