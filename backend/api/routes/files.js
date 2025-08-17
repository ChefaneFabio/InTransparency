const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { authenticate } = require('../middleware/auth')
const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads')
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    
    cb(null, uploadPath)
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = path.extname(file.originalname)
    const filename = `${file.fieldname}-${uniqueSuffix}${extension}`
    cb(null, filename)
  }
})

const fileFilter = (req, file, cb) => {
  // Define allowed file types
  const allowedTypes = {
    'image': ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    'document': [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ],
    'archive': [
      'application/zip',
      'application/x-zip-compressed',
      'application/x-rar-compressed'
    ],
    'transcript': [
      'application/pdf',
      'image/jpeg',
      'image/png'
    ]
  }

  const fileType = req.params.type || 'document'
  const allowed = allowedTypes[fileType] || allowedTypes.document

  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`Invalid file type. Allowed types for ${fileType}: ${allowed.join(', ')}`))
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files per upload
  }
})

// Upload single file
router.post('/upload/:type', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      })
    }

    const fileInfo = {
      id: Date.now(),
      userId: req.userId,
      originalName: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      type: req.params.type,
      path: req.file.path,
      url: `/api/files/download/${req.file.filename}`,
      uploadedAt: new Date()
    }

    // In a real implementation, you would save this to the database
    // For now, we'll just return the file info

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        file: fileInfo
      }
    })
  } catch (error) {
    console.error('File upload error:', error.message)
    
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Upload multiple files
router.post('/upload-multiple/:type', authenticate, upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      })
    }

    const filesInfo = req.files.map(file => ({
      id: Date.now() + Math.random(),
      userId: req.userId,
      originalName: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      type: req.params.type,
      path: file.path,
      url: `/api/files/download/${file.filename}`,
      uploadedAt: new Date()
    }))

    res.status(201).json({
      success: true,
      message: `${filesInfo.length} files uploaded successfully`,
      data: {
        files: filesInfo
      }
    })
  } catch (error) {
    console.error('Multiple file upload error:', error.message)
    
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Download file
router.get('/download/:filename', async (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(__dirname, '../uploads', filename)
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      })
    }

    // In a real implementation, you would check file permissions here
    // For now, allow download of any file

    res.download(filePath, (err) => {
      if (err) {
        console.error('File download error:', err)
        res.status(500).json({
          success: false,
          error: 'Failed to download file'
        })
      }
    })
  } catch (error) {
    console.error('Download error:', error.message)
    
    res.status(500).json({
      success: false,
      error: 'Download failed'
    })
  }
})

// Get file info
router.get('/info/:filename', authenticate, async (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(__dirname, '../uploads', filename)
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      })
    }

    const stats = fs.statSync(filePath)
    
    const fileInfo = {
      filename: filename,
      size: stats.size,
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime,
      url: `/api/files/download/${filename}`
    }

    res.json({
      success: true,
      data: {
        file: fileInfo
      }
    })
  } catch (error) {
    console.error('Get file info error:', error.message)
    
    res.status(500).json({
      success: false,
      error: 'Failed to get file information'
    })
  }
})

// Delete file
router.delete('/:filename', authenticate, async (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(__dirname, '../uploads', filename)
    
    // In a real implementation, you would check file ownership here
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      })
    }

    fs.unlinkSync(filePath)
    
    res.json({
      success: true,
      message: 'File deleted successfully'
    })
  } catch (error) {
    console.error('Delete file error:', error.message)
    
    res.status(500).json({
      success: false,
      error: 'Failed to delete file'
    })
  }
})

// Parse transcript (placeholder for OCR/parsing functionality)
router.post('/parse-transcript', authenticate, upload.single('transcript'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No transcript file uploaded'
      })
    }

    // In a real implementation, you would use OCR or PDF parsing
    // For now, return mock parsed data
    const mockParsedData = {
      student: {
        name: req.user.firstName + ' ' + req.user.lastName,
        studentId: '12345678',
        program: 'Computer Science',
        gpa: '3.75'
      },
      courses: [
        {
          courseCode: 'CS101',
          courseName: 'Introduction to Programming',
          semester: 'Fall',
          year: 2023,
          grade: 'A',
          credits: 3
        },
        {
          courseCode: 'CS201',
          courseName: 'Data Structures',
          semester: 'Spring',
          year: 2024,
          grade: 'A-',
          credits: 4
        },
        {
          courseCode: 'CS301',
          courseName: 'Database Systems',
          semester: 'Fall',
          year: 2024,
          grade: 'B+',
          credits: 3
        }
      ]
    }

    res.json({
      success: true,
      message: 'Transcript parsed successfully',
      data: {
        file: {
          originalName: req.file.originalname,
          filename: req.file.filename,
          url: `/api/files/download/${req.file.filename}`
        },
        parsed: mockParsedData
      }
    })
  } catch (error) {
    console.error('Transcript parsing error:', error.message)
    
    res.status(500).json({
      success: false,
      error: 'Failed to parse transcript'
    })
  }
})

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 10MB.'
      })
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files. Maximum is 5 files per upload.'
      })
    }
  }
  
  res.status(400).json({
    success: false,
    error: error.message
  })
})

module.exports = router