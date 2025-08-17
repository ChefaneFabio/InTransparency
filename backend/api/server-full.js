const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

// Import routes
const authRoutes = require('./routes/auth')
const coursesRoutes = require('./routes/courses')
const projectsRoutes = require('./routes/projects')
const filesRoutes = require('./routes/files')

// Import database
const database = require('./database/Database')

const app = express()
const PORT = process.env.PORT || 3001

// Trust proxy (for Render deployment)
app.set('trust proxy', 1)

// Enable CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://in-transparency-9visdfu70-chefanefabios-projects.vercel.app',
    'https://in-transparency-m5krpwb5s-chefanefabios-projects.vercel.app',
    'https://in-transparency-git-main-chefanefabios-projects.vercel.app',
    'https://intransparency.vercel.app',
    process.env.FRONTEND_URL
  ].filter(url => Boolean(url)),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

// Security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff')
  res.header('X-Frame-Options', 'DENY')
  res.header('X-XSS-Protection', '1; mode=block')
  next()
})

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    message: 'InTransparency API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '2.0.0',
    features: [
      'user-authentication',
      'course-management',
      'project-management',
      'file-uploads',
      'ai-integration-ready'
    ]
  })
})

// API root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'InTransparency API v2.0',
    documentation: '/api/docs',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/me',
        logout: 'POST /api/auth/logout'
      },
      courses: {
        list: 'GET /api/courses',
        create: 'POST /api/courses',
        get: 'GET /api/courses/:id',
        update: 'PUT /api/courses/:id',
        delete: 'DELETE /api/courses/:id',
        bulk: 'POST /api/courses/bulk'
      },
      projects: {
        list: 'GET /api/projects',
        create: 'POST /api/projects',
        get: 'GET /api/projects/:id',
        update: 'PUT /api/projects/:id',
        delete: 'DELETE /api/projects/:id',
        analyze: 'POST /api/projects/:id/analyze'
      },
      files: {
        upload: 'POST /api/files/upload/:type',
        download: 'GET /api/files/download/:filename',
        parseTranscript: 'POST /api/files/parse-transcript'
      }
    }
  })
})

// Mount API routes
app.use('/api/auth', authRoutes)
app.use('/api/courses', coursesRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/files', filesRoutes)

// Serve uploaded files statically
const uploadsPath = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true })
}
app.use('/uploads', express.static(uploadsPath))

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'InTransparency API Documentation',
    version: '2.0.0',
    description: 'Complete API for the InTransparency platform - connecting students, universities, and recruiters',
    baseUrl: req.protocol + '://' + req.get('host'),
    authentication: {
      type: 'Bearer Token (JWT)',
      header: 'Authorization: Bearer <token>',
      obtain: 'POST /api/auth/login or POST /api/auth/register'
    },
    features: {
      userManagement: 'Full user registration, authentication, and profile management',
      courseTracking: 'Academic course tracking with GPA calculation',
      projectPortfolio: 'Project showcase with AI analysis capabilities',
      fileManagement: 'Upload transcripts, documents, and project files',
      searchAndDiscovery: 'Advanced search and filtering for projects and users',
      analytics: 'User performance and project analytics'
    },
    sampleUsage: {
      register: {
        endpoint: 'POST /api/auth/register',
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@university.edu',
          password: 'SecurePassword123',
          role: 'student',
          university: 'Stanford University',
          major: 'Computer Science',
          graduationYear: 2025
        }
      },
      addCourse: {
        endpoint: 'POST /api/courses',
        headers: { Authorization: 'Bearer <token>' },
        body: {
          courseCode: 'CS101',
          courseName: 'Introduction to Programming',
          semester: 'Fall',
          year: 2024,
          credits: 3,
          grade: 'A'
        }
      },
      createProject: {
        endpoint: 'POST /api/projects',
        headers: { Authorization: 'Bearer <token>' },
        body: {
          title: 'E-commerce Web Application',
          description: 'Full-stack web application built with React and Node.js',
          technologies: ['React', 'Node.js', 'MongoDB'],
          category: 'web-development',
          repositoryUrl: 'https://github.com/user/project',
          isPublic: true
        }
      }
    }
  })
})

// Database status endpoint
app.get('/api/status', (req, res) => {
  const stats = {
    totalUsers: database.users.size,
    totalCourses: database.courses.size,
    totalProjects: database.projects.size,
    serverUptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    timestamp: new Date().toISOString()
  }

  res.json({
    success: true,
    data: stats
  })
})

// Initialize demo data (for testing)
app.post('/api/init-demo', async (req, res) => {
  try {
    // Create demo student
    const demoUser = await database.createUser({
      firstName: 'Demo',
      lastName: 'Student',
      email: 'demo@student.edu',
      password: 'DemoPassword123',
      role: 'student',
      university: 'Stanford University',
      major: 'Computer Science',
      graduationYear: 2025
    })

    // Create demo courses
    const demoCourses = [
      {
        userId: demoUser.id,
        courseCode: 'CS101',
        courseName: 'Introduction to Programming',
        semester: 'Fall',
        year: 2023,
        grade: 'A',
        credits: 3,
        isCompleted: true,
        skills: ['Python', 'Problem Solving', 'Algorithms']
      },
      {
        userId: demoUser.id,
        courseCode: 'CS201',
        courseName: 'Data Structures',
        semester: 'Spring',
        year: 2024,
        grade: 'A-',
        credits: 4,
        isCompleted: true,
        skills: ['Java', 'Data Structures', 'Algorithm Analysis']
      }
    ]

    for (const courseData of demoCourses) {
      await database.createCourse(courseData)
    }

    // Create demo projects
    const demoProjects = [
      {
        userId: demoUser.id,
        title: 'Personal Portfolio Website',
        description: 'A responsive portfolio website showcasing my projects and skills',
        technologies: ['React', 'Tailwind CSS', 'Next.js'],
        category: 'web-development',
        status: 'published',
        isPublic: true,
        complexityLevel: 'Intermediate'
      },
      {
        userId: demoUser.id,
        title: 'Task Management App',
        description: 'A full-stack task management application with user authentication',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express.js'],
        category: 'web-development',
        status: 'published',
        isPublic: true,
        complexityLevel: 'Advanced'
      }
    ]

    for (const projectData of demoProjects) {
      await database.createProject(projectData)
    }

    res.json({
      success: true,
      message: 'Demo data initialized successfully',
      data: {
        user: demoUser.toJSON(),
        coursesCount: demoCourses.length,
        projectsCount: demoProjects.length
      }
    })
  } catch (error) {
    console.error('Demo data initialization error:', error.message)
    
    res.status(500).json({
      success: false,
      error: 'Failed to initialize demo data'
    })
  }
})

// Catch-all for undefined API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    suggestion: 'Check the API documentation at /api/docs'
  })
})

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Global error handler:', error)
  
  res.status(error.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
    timestamp: new Date().toISOString()
  })
})

// 404 handler for non-API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    availableEndpoints: ['/health', '/api', '/api/docs', '/api/status']
  })
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  process.exit(0)
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 InTransparency API v2.0 running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`📚 API docs: http://localhost:${PORT}/api/docs`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Set' : 'Using default (change in production)'}`)
  console.log(`💾 Database: In-memory (ready for PostgreSQL/MongoDB integration)`)
})

module.exports = app