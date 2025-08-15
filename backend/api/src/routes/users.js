const express = require('express')
const multer = require('multer')
const userController = require('../controllers/userController')
const { authMiddleware } = require('../middleware/auth')
const { apiRateLimit, uploadRateLimit } = require('../middleware/rateLimit')

const router = express.Router()

// Configure multer for avatar uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for avatars
    files: 1
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files for avatars
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ]
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only image files are allowed for avatars.'), false)
    }
  }
})

// Apply rate limiting
router.use(apiRateLimit)

// Public routes
router.get('/search', userController.searchUsers)
router.get('/:id', userController.getProfile)
router.get('/:id/projects', userController.getUserProjects)

// Protected routes (authentication required)
router.put('/profile', authMiddleware, userController.updateProfile)
router.post('/avatar', 
  authMiddleware, 
  uploadRateLimit, 
  upload.single('avatar'), 
  userController.uploadAvatar
)

// AI-powered features
router.post('/skill-assessment', authMiddleware, userController.getSkillAssessment)
router.post('/resume-suggestions', authMiddleware, userController.getResumeSuggestions)

// Account management
router.delete('/account', authMiddleware, userController.deleteAccount)

// Error handling for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'Avatar file size too large. Maximum size is 5MB.'
      })
    }
    return res.status(400).json({
      success: false,
      error: error.message
    })
  }
  
  if (error.message === 'Invalid file type. Only image files are allowed for avatars.') {
    return res.status(400).json({
      success: false,
      error: error.message
    })
  }
  
  next(error)
})

module.exports = router