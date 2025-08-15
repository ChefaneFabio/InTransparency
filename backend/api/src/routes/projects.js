const express = require('express')
const multer = require('multer')
const projectController = require('../controllers/projectController')
const { authMiddleware } = require('../middleware/auth')
const { apiRateLimit, uploadRateLimit } = require('../middleware/rateLimit')

const router = express.Router()

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files at once
  },
  fileFilter: (req, file, cb) => {
    // Allow images and documents
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only images and documents are allowed.'), false)
    }
  }
})

// Apply rate limiting to all project routes
router.use(apiRateLimit)

// Public routes (no authentication required)
router.get('/', projectController.getProjects)
router.get('/:id', projectController.getProject)

// Protected routes (authentication required)
router.post('/', authMiddleware, projectController.createProject)
router.put('/:id', authMiddleware, projectController.updateProject)
router.delete('/:id', authMiddleware, projectController.deleteProject)

// Media upload routes
router.post('/:id/media', 
  authMiddleware, 
  uploadRateLimit, 
  upload.array('files', 5), 
  projectController.uploadMedia
)
router.delete('/:id/media/:mediaId', authMiddleware, projectController.deleteMedia)

// Like/unlike routes
router.post('/:id/like', authMiddleware, projectController.toggleLike)

// User-specific routes
router.get('/user/:userId/liked', authMiddleware, projectController.getLikedProjects)

// Error handling for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size too large. Maximum size is 10MB per file.'
      })
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files. Maximum 5 files allowed.'
      })
    }
    return res.status(400).json({
      success: false,
      error: error.message
    })
  }
  
  if (error.message === 'Invalid file type. Only images and documents are allowed.') {
    return res.status(400).json({
      success: false,
      error: error.message
    })
  }
  
  next(error)
})

module.exports = router