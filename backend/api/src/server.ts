import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'

import { errorHandler, notFound } from './middleware/error'
import { requestLogger } from './middleware/logger'
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const projectRoutes = require('./routes/projects')
const jobRoutes = require('./routes/jobs')
const analyticsRoutes = require('./routes/analytics')
const notificationRoutes = require('./routes/notifications')

dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

const PORT = process.env.PORT || 3001
const NODE_ENV = process.env.NODE_ENV || 'development'

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://intransparency.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

// Compression
app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === 'production' ? 100 : 1000, // limit each IP
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging
if (NODE_ENV === 'production') {
  app.use(morgan('combined'))
} else {
  app.use(morgan('dev'))
}
app.use(requestLogger)

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/notifications', notificationRoutes)

// WebSocket handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)
  
  // Handle user authentication for WebSocket
  socket.on('authenticate', (token) => {
    try {
      const jwt = require('jsonwebtoken')
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
      socket.userId = decoded.userId
      socket.join(`user_${decoded.userId}`)
      console.log(`User ${decoded.userId} authenticated via WebSocket`)
    } catch (error) {
      console.error('WebSocket authentication failed:', error.message)
      socket.emit('auth_error', 'Authentication failed')
    }
  })
  
  // Join specific rooms
  socket.on('join-room', (room) => {
    socket.join(room)
    console.log(`User ${socket.id} joined room ${room}`)
  })
  
  socket.on('leave-room', (room) => {
    socket.leave(room)
    console.log(`User ${socket.id} left room ${room}`)
  })
  
  // Handle real-time notifications
  socket.on('mark-notification-read', (notificationId) => {
    if (socket.userId) {
      // Broadcast to other sessions of the same user
      socket.to(`user_${socket.userId}`).emit('notification-read', notificationId)
    }
  })
  
  // Handle typing indicators for messages
  socket.on('typing-start', (data) => {
    socket.to(data.room).emit('user-typing', {
      userId: socket.userId,
      room: data.room
    })
  })
  
  socket.on('typing-stop', (data) => {
    socket.to(data.room).emit('user-stopped-typing', {
      userId: socket.userId,
      room: data.room
    })
  })
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// Make io available globally for other modules
global.io = io
app.set('io', io)

// Error handling
app.use(notFound)
app.use(errorHandler)

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`)
  console.log(`📊 Health check available at http://localhost:${PORT}/health`)
})