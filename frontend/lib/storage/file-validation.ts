/**
 * File Validation Utilities
 *
 * Validates file types using magic bytes (file signatures) to prevent
 * file type spoofing. Don't trust MIME types sent by clients!
 */

// File type signatures (magic bytes)
const FILE_SIGNATURES = {
  // Images
  'image/jpeg': [
    [0xFF, 0xD8, 0xFF], // JPEG
  ],
  'image/png': [
    [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], // PNG
  ],
  'image/gif': [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], // GIF89a
  ],
  'image/webp': [
    [0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x57, 0x45, 0x42, 0x50], // RIFF....WEBP
  ],
  'image/bmp': [
    [0x42, 0x4D], // BM
  ],

  // Videos
  'video/mp4': [
    [null, null, null, null, 0x66, 0x74, 0x79, 0x70], // ....ftyp
  ],
  'video/webm': [
    [0x1A, 0x45, 0xDF, 0xA3], // WebM
  ],
  'video/quicktime': [
    [null, null, null, null, 0x66, 0x74, 0x79, 0x70, 0x71, 0x74], // ....ftypqt
  ],
  'video/x-msvideo': [
    [0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x41, 0x56, 0x49, 0x20], // RIFF....AVI
  ],
  'video/x-matroska': [
    [0x1A, 0x45, 0xDF, 0xA3], // MKV (same as WebM)
  ],

  // Documents
  'application/pdf': [
    [0x25, 0x50, 0x44, 0x46, 0x2D], // %PDF-
  ],
  'application/msword': [
    [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1], // DOC
  ],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    [0x50, 0x4B, 0x03, 0x04], // DOCX (ZIP format)
  ],
  'application/vnd.ms-excel': [
    [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1], // XLS
  ],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
    [0x50, 0x4B, 0x03, 0x04], // XLSX (ZIP format)
  ],

  // Archives
  'application/zip': [
    [0x50, 0x4B, 0x03, 0x04], // ZIP
    [0x50, 0x4B, 0x05, 0x06], // Empty ZIP
    [0x50, 0x4B, 0x07, 0x08], // Spanned ZIP
  ],
  'application/x-rar-compressed': [
    [0x52, 0x61, 0x72, 0x21, 0x1A, 0x07], // RAR
  ],
  'application/x-7z-compressed': [
    [0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C], // 7Z
  ],
}

/**
 * Check if buffer matches a file signature
 */
function matchesSignature(buffer: Buffer, signature: (number | null)[]): boolean {
  if (buffer.length < signature.length) {
    return false
  }

  for (let i = 0; i < signature.length; i++) {
    if (signature[i] !== null && buffer[i] !== signature[i]) {
      return false
    }
  }

  return true
}

/**
 * Detect file type from magic bytes
 * Returns MIME type or null if unknown
 */
export function detectFileType(buffer: Buffer): string | null {
  for (const [mimeType, signatures] of Object.entries(FILE_SIGNATURES)) {
    for (const signature of signatures) {
      if (matchesSignature(buffer, signature)) {
        return mimeType
      }
    }
  }

  return null
}

/**
 * Validate file type matches expected MIME type
 * Uses magic bytes to prevent file type spoofing
 */
export function validateFileType(
  buffer: Buffer,
  expectedMimeType: string,
  allowedTypes: string[]
): { valid: boolean; detectedType: string | null; error?: string } {
  // Detect actual file type
  const detectedType = detectFileType(buffer)

  // Unknown file type
  if (!detectedType) {
    return {
      valid: false,
      detectedType: null,
      error: 'Unknown or unsupported file type',
    }
  }

  // Check if detected type is in allowed list
  if (!allowedTypes.includes(detectedType)) {
    return {
      valid: false,
      detectedType,
      error: `File type ${detectedType} is not allowed`,
    }
  }

  // Check if detected type matches expected type (with some tolerance)
  const expectedBase = expectedMimeType.split('/')[0]
  const detectedBase = detectedType.split('/')[0]

  if (expectedBase !== detectedBase) {
    return {
      valid: false,
      detectedType,
      error: `File type mismatch: expected ${expectedMimeType}, detected ${detectedType}`,
    }
  }

  return {
    valid: true,
    detectedType,
  }
}

/**
 * Validate file size
 */
export function validateFileSize(
  size: number,
  maxSize: number
): { valid: boolean; error?: string } {
  if (size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024))
    const actualSizeMB = Math.round(size / (1024 * 1024))
    return {
      valid: false,
      error: `File size (${actualSizeMB}MB) exceeds maximum allowed size (${maxSizeMB}MB)`,
    }
  }

  return { valid: true }
}

/**
 * Validate image dimensions
 */
export async function validateImageDimensions(
  buffer: Buffer,
  maxWidth: number,
  maxHeight: number
): Promise<{ valid: boolean; width?: number; height?: number; error?: string }> {
  try {
    const sharp = (await import('sharp')).default
    const metadata = await sharp(buffer).metadata()

    const width = metadata.width || 0
    const height = metadata.height || 0

    if (width > maxWidth || height > maxHeight) {
      return {
        valid: false,
        width,
        height,
        error: `Image dimensions (${width}x${height}) exceed maximum allowed (${maxWidth}x${maxHeight})`,
      }
    }

    return {
      valid: true,
      width,
      height,
    }
  } catch (error) {
    return {
      valid: false,
      error: 'Failed to read image dimensions',
    }
  }
}

/**
 * Sanitize filename to prevent directory traversal attacks
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars with underscore
    .replace(/\.{2,}/g, '_') // Prevent directory traversal (..)
    .substring(0, 255) // Limit length
}

/**
 * Generate unique filename with timestamp and UUID
 */
export function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const extension = originalFilename.split('.').pop() || 'bin'
  const sanitizedExt = sanitizeFilename(extension)

  return `${timestamp}-${random}.${sanitizedExt}`
}

/**
 * Comprehensive file validation
 */
export interface FileValidationOptions {
  allowedTypes: string[]
  maxSize: number
  maxWidth?: number
  maxHeight?: number
  checkMagicBytes?: boolean
}

export interface FileValidationResult {
  valid: boolean
  errors: string[]
  detectedType?: string | null
  size?: number
  dimensions?: { width: number; height: number }
}

export async function validateFile(
  buffer: Buffer,
  filename: string,
  expectedMimeType: string,
  options: FileValidationOptions
): Promise<FileValidationResult> {
  const errors: string[] = []
  let detectedType: string | null = null

  // 1. Validate file size
  const sizeValidation = validateFileSize(buffer.length, options.maxSize)
  if (!sizeValidation.valid) {
    errors.push(sizeValidation.error!)
  }

  // 2. Validate file type with magic bytes
  if (options.checkMagicBytes !== false) {
    const typeValidation = validateFileType(buffer, expectedMimeType, options.allowedTypes)
    if (!typeValidation.valid) {
      errors.push(typeValidation.error!)
    }
    detectedType = typeValidation.detectedType
  }

  // 3. Validate image dimensions (if image and limits specified)
  let dimensions: { width: number; height: number } | undefined
  if (
    detectedType?.startsWith('image/') &&
    options.maxWidth &&
    options.maxHeight
  ) {
    const dimValidation = await validateImageDimensions(
      buffer,
      options.maxWidth,
      options.maxHeight
    )
    if (!dimValidation.valid) {
      errors.push(dimValidation.error!)
    } else {
      dimensions = {
        width: dimValidation.width!,
        height: dimValidation.height!,
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    detectedType,
    size: buffer.length,
    dimensions,
  }
}

/**
 * Common validation presets
 */
export const VALIDATION_PRESETS = {
  profileImage: {
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 5 * 1024 * 1024, // 5MB
    maxWidth: 2048,
    maxHeight: 2048,
    checkMagicBytes: true,
  },
  projectImage: {
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxSize: 10 * 1024 * 1024, // 10MB
    maxWidth: 4096,
    maxHeight: 4096,
    checkMagicBytes: true,
  },
  projectVideo: {
    allowedTypes: [
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/x-msvideo',
    ],
    maxSize: 500 * 1024 * 1024, // 500MB
    checkMagicBytes: true,
  },
  document: {
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    maxSize: 25 * 1024 * 1024, // 25MB
    checkMagicBytes: true,
  },
}
