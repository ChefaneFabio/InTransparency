/**
 * Upload routes — handles file uploads to Cloudflare R2.
 * Receives multipart/form-data from the Vercel proxy.
 */

const express = require('express')
const multer = require('multer')
const { uploadToR2, deleteFromR2 } = require('../services/r2-client')
const { validateFile, generateUniqueFilename, VALIDATION_PRESETS } = require('../services/file-validation')

const router = express.Router()

// Use memory storage — files stay in RAM, no disk writes
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB max (videos)
})

/**
 * POST /api/upload/document
 */
router.post('/document', upload.single('document'), async (req, res) => {
  try {
    const file = req.file
    if (!file) {
      // Try alternate field name
      return res.status(400).json({ error: 'No document file provided. Use field name "document".' })
    }

    const validation = validateFile(file.buffer, file.originalname, file.mimetype, VALIDATION_PRESETS.document)
    if (!validation.valid) {
      return res.status(400).json({ error: validation.errors.join(', ') })
    }

    const uniqueFilename = generateUniqueFilename(file.originalname)
    const folder = req.body.folder || 'documents'
    const allowedFolders = ['documents', 'projects', 'theses', 'reports']
    const safeFolder = allowedFolders.includes(folder) ? folder : 'documents'
    const key = `${safeFolder}/${uniqueFilename}`

    const url = await uploadToR2(file.buffer, key, validation.detectedType || file.mimetype, {
      userId: req.userId || '',
      originalName: encodeURIComponent(file.originalname),
      projectId: req.body.projectId || '',
      uploadedAt: new Date().toISOString(),
    })

    res.json({
      success: true,
      url,
      key,
      size: file.buffer.length,
      type: validation.detectedType || file.mimetype,
    })
  } catch (error) {
    console.error('Document upload error:', error.message || error)
    res.status(500).json({ error: 'Failed to upload document' })
  }
})

/**
 * POST /api/upload/image
 */
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    const file = req.file
    if (!file) {
      return res.status(400).json({ error: 'No image file provided. Use field name "image".' })
    }

    const validation = validateFile(file.buffer, file.originalname, file.mimetype, VALIDATION_PRESETS.projectImage)
    if (!validation.valid) {
      return res.status(400).json({ error: validation.errors.join(', ') })
    }

    const uniqueFilename = generateUniqueFilename(file.originalname)
    const folder = req.body.folder || 'images'
    const allowedFolders = ['images', 'projects', 'profiles', 'avatars']
    const safeFolder = allowedFolders.includes(folder) ? folder : 'images'
    const key = `${safeFolder}/${uniqueFilename}`

    const url = await uploadToR2(file.buffer, key, validation.detectedType || file.mimetype, {
      userId: req.userId || '',
      originalName: encodeURIComponent(file.originalname),
      uploadedAt: new Date().toISOString(),
    })

    res.json({
      success: true,
      url,
      key,
      size: file.buffer.length,
      type: validation.detectedType || file.mimetype,
    })
  } catch (error) {
    console.error('Image upload error:', error.message || error)
    res.status(500).json({ error: 'Failed to upload image' })
  }
})

/**
 * POST /api/upload/video
 */
router.post('/video', upload.single('video'), async (req, res) => {
  try {
    const file = req.file
    if (!file) {
      return res.status(400).json({ error: 'No video file provided. Use field name "video".' })
    }

    const validation = validateFile(file.buffer, file.originalname, file.mimetype, VALIDATION_PRESETS.projectVideo)
    if (!validation.valid) {
      return res.status(400).json({ error: validation.errors.join(', ') })
    }

    const uniqueFilename = generateUniqueFilename(file.originalname)
    const folder = req.body.folder || 'videos'
    const key = `${folder}/${uniqueFilename}`

    const url = await uploadToR2(file.buffer, key, validation.detectedType || file.mimetype, {
      userId: req.userId || '',
      originalName: encodeURIComponent(file.originalname),
      duration: req.body.duration || '',
      uploadedAt: new Date().toISOString(),
    })

    res.json({
      success: true,
      url,
      key,
      size: file.buffer.length,
      type: validation.detectedType || file.mimetype,
    })
  } catch (error) {
    console.error('Video upload error:', error.message || error)
    res.status(500).json({ error: 'Failed to upload video' })
  }
})

/**
 * DELETE /api/upload/delete
 */
router.delete('/delete', async (req, res) => {
  try {
    const { key } = req.body
    if (!key) {
      return res.status(400).json({ error: 'File key is required' })
    }

    await deleteFromR2(key)
    res.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error.message || error)
    res.status(500).json({ error: 'Failed to delete file' })
  }
})

/**
 * GET /api/upload/health
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    r2Configured: !!(process.env.R2_ENDPOINT && process.env.R2_ACCESS_KEY_ID),
    maxFileSize: 500 * 1024 * 1024,
  })
})

module.exports = router
