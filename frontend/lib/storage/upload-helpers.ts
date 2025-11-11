/**
 * Upload Helper Functions
 *
 * High-level functions for uploading files with validation and optimization.
 */

import { uploadToR2, R2_CONFIG } from './r2-client'
import {
  validateFile,
  generateUniqueFilename,
  VALIDATION_PRESETS,
  type FileValidationOptions,
} from './file-validation'
import {
  optimizeImage,
  createImageVariants,
  OPTIMIZATION_PRESETS,
} from './file-optimization'

export interface UploadOptions {
  optimize?: boolean
  createVariants?: boolean
  folder?: string
  customFilename?: string
  metadata?: Record<string, string>
}

export interface UploadResult {
  success: boolean
  url: string
  key: string
  size: number
  type: string
  variants?: {
    original: string
    large: string
    medium: string
    small: string
    thumbnail: string
  }
  error?: string
}

/**
 * Upload a file with validation and optional optimization
 */
export async function uploadFile(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  validationOptions: FileValidationOptions,
  uploadOptions: UploadOptions = {}
): Promise<UploadResult> {
  try {
    // 1. Validate file
    const validation = await validateFile(
      buffer,
      filename,
      mimeType,
      validationOptions
    )

    if (!validation.valid) {
      return {
        success: false,
        url: '',
        key: '',
        size: 0,
        type: mimeType,
        error: validation.errors.join(', '),
      }
    }

    // 2. Generate filename
    const uniqueFilename = uploadOptions.customFilename || generateUniqueFilename(filename)
    const folder = uploadOptions.folder || 'uploads'
    const key = `${folder}/${uniqueFilename}`

    // 3. Upload to R2
    const url = await uploadToR2(buffer, key, mimeType, uploadOptions.metadata)

    return {
      success: true,
      url,
      key,
      size: buffer.length,
      type: validation.detectedType || mimeType,
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    return {
      success: false,
      url: '',
      key: '',
      size: 0,
      type: mimeType,
      error: error.message || 'Upload failed',
    }
  }
}

/**
 * Upload an image with optimization and variant generation
 */
export async function uploadImage(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  try {
    // 1. Validate image
    const validation = await validateFile(
      buffer,
      filename,
      mimeType,
      VALIDATION_PRESETS.projectImage
    )

    if (!validation.valid) {
      return {
        success: false,
        url: '',
        key: '',
        size: 0,
        type: mimeType,
        error: validation.errors.join(', '),
      }
    }

    // 2. Optimize image
    let finalBuffer = buffer
    if (options.optimize !== false) {
      const optimized = await optimizeImage(buffer, OPTIMIZATION_PRESETS.projectImage)
      finalBuffer = optimized.buffer
    }

    // 3. Generate unique filename
    const uniqueFilename = options.customFilename || generateUniqueFilename(filename)
    const folder = options.folder || 'images'

    // 4. Create and upload variants if requested
    let variants: UploadResult['variants']
    if (options.createVariants) {
      const imageVariants = await createImageVariants(buffer)

      const variantUploads = await Promise.all([
        uploadToR2(imageVariants.original, `${folder}/original/${uniqueFilename}`, 'image/webp'),
        uploadToR2(imageVariants.large, `${folder}/large/${uniqueFilename}`, 'image/webp'),
        uploadToR2(imageVariants.medium, `${folder}/medium/${uniqueFilename}`, 'image/webp'),
        uploadToR2(imageVariants.small, `${folder}/small/${uniqueFilename}`, 'image/webp'),
        uploadToR2(imageVariants.thumbnail, `${folder}/thumbnail/${uniqueFilename}`, 'image/webp'),
      ])

      variants = {
        original: variantUploads[0],
        large: variantUploads[1],
        medium: variantUploads[2],
        small: variantUploads[3],
        thumbnail: variantUploads[4],
      }
    }

    // 5. Upload main image
    const key = `${folder}/${uniqueFilename}`
    const url = await uploadToR2(finalBuffer, key, 'image/webp', options.metadata)

    return {
      success: true,
      url,
      key,
      size: finalBuffer.length,
      type: 'image/webp',
      variants,
    }
  } catch (error: any) {
    console.error('Image upload error:', error)
    return {
      success: false,
      url: '',
      key: '',
      size: 0,
      type: mimeType,
      error: error.message || 'Image upload failed',
    }
  }
}

/**
 * Upload a video file
 */
export async function uploadVideo(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  try {
    // 1. Validate video
    const validation = await validateFile(
      buffer,
      filename,
      mimeType,
      VALIDATION_PRESETS.projectVideo
    )

    if (!validation.valid) {
      return {
        success: false,
        url: '',
        key: '',
        size: 0,
        type: mimeType,
        error: validation.errors.join(', '),
      }
    }

    // 2. Generate unique filename
    const uniqueFilename = options.customFilename || generateUniqueFilename(filename)
    const folder = options.folder || 'videos'
    const key = `${folder}/${uniqueFilename}`

    // 3. Upload video to R2
    const url = await uploadToR2(buffer, key, validation.detectedType || mimeType, options.metadata)

    // TODO: Generate video thumbnail using ffmpeg
    // TODO: Get video metadata (duration, dimensions, bitrate)

    return {
      success: true,
      url,
      key,
      size: buffer.length,
      type: validation.detectedType || mimeType,
    }
  } catch (error: any) {
    console.error('Video upload error:', error)
    return {
      success: false,
      url: '',
      key: '',
      size: 0,
      type: mimeType,
      error: error.message || 'Video upload failed',
    }
  }
}

/**
 * Upload a document (PDF, Word, etc.)
 */
export async function uploadDocument(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  try {
    // 1. Validate document
    const validation = await validateFile(
      buffer,
      filename,
      mimeType,
      VALIDATION_PRESETS.document
    )

    if (!validation.valid) {
      return {
        success: false,
        url: '',
        key: '',
        size: 0,
        type: mimeType,
        error: validation.errors.join(', '),
      }
    }

    // 2. Generate unique filename
    const uniqueFilename = options.customFilename || generateUniqueFilename(filename)
    const folder = options.folder || 'documents'
    const key = `${folder}/${uniqueFilename}`

    // 3. Upload document to R2
    const url = await uploadToR2(buffer, key, validation.detectedType || mimeType, options.metadata)

    return {
      success: true,
      url,
      key,
      size: buffer.length,
      type: validation.detectedType || mimeType,
    }
  } catch (error: any) {
    console.error('Document upload error:', error)
    return {
      success: false,
      url: '',
      key: '',
      size: 0,
      type: mimeType,
      error: error.message || 'Document upload failed',
    }
  }
}
