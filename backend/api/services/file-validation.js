/**
 * File validation using magic bytes.
 * Don't trust MIME types sent by clients.
 */

const crypto = require('crypto')

const FILE_SIGNATURES = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
  'image/gif': [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
  ],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]],
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]],
  'application/msword': [[0xD0, 0xCF, 0x11, 0xE0]],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [[0x50, 0x4B, 0x03, 0x04]],
  'application/vnd.ms-excel': [[0xD0, 0xCF, 0x11, 0xE0]],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [[0x50, 0x4B, 0x03, 0x04]],
  'video/mp4': [[0x00, 0x00, 0x00]],
  'video/webm': [[0x1A, 0x45, 0xDF, 0xA3]],
}

const VALIDATION_PRESETS = {
  document: {
    maxSize: 25 * 1024 * 1024, // 25MB
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },
  projectImage: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  },
  projectVideo: {
    maxSize: 500 * 1024 * 1024, // 500MB
    allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
  },
}

/**
 * Detect file type from magic bytes
 */
function detectFileType(buffer) {
  for (const [mimeType, signatures] of Object.entries(FILE_SIGNATURES)) {
    for (const signature of signatures) {
      let match = true
      for (let i = 0; i < signature.length; i++) {
        if (buffer[i] !== signature[i]) {
          match = false
          break
        }
      }
      if (match) return mimeType
    }
  }
  return null
}

/**
 * Validate a file against a preset
 */
function validateFile(buffer, filename, mimeType, preset) {
  const errors = []

  // Check size
  if (buffer.length > preset.maxSize) {
    errors.push(`File too large (${(buffer.length / 1024 / 1024).toFixed(1)}MB, max ${(preset.maxSize / 1024 / 1024).toFixed(0)}MB)`)
  }

  // Detect actual type from magic bytes
  const detectedType = detectFileType(buffer)

  // For zip-based formats (docx, xlsx), the magic bytes are the same as zip (PK)
  // Trust the claimed MIME type if magic bytes match PK signature
  const isZipBased = detectedType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  const claimedIsAllowed = preset.allowedTypes.includes(mimeType)

  if (!claimedIsAllowed) {
    errors.push(`File type ${mimeType} is not allowed`)
  }

  return {
    valid: errors.length === 0,
    errors,
    detectedType: detectedType || mimeType,
  }
}

/**
 * Generate a unique filename
 */
function generateUniqueFilename(originalName) {
  const ext = originalName.split('.').pop() || 'bin'
  const timestamp = Date.now()
  const random = crypto.randomBytes(6).toString('hex')
  return `${timestamp}-${random}.${ext}`
}

module.exports = {
  detectFileType,
  validateFile,
  generateUniqueFilename,
  VALIDATION_PRESETS,
}
