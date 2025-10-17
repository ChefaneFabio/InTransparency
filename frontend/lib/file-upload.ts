/**
 * File Upload Utility
 *
 * This module handles file uploads to cloud storage (S3/Cloudflare R2).
 * Currently uses placeholder URLs - replace with actual cloud storage integration.
 */

export interface UploadedFile {
  url: string
  fileName: string
  fileSize: number
  mimeType: string
  thumbnail?: string
}

export interface UploadOptions {
  maxFileSize?: number // in bytes
  allowedTypes?: string[]
  generateThumbnail?: boolean
}

/**
 * Upload a file to cloud storage
 *
 * TODO: Replace with actual S3/Cloudflare R2 implementation
 *
 * Example for AWS S3:
 * ```typescript
 * import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
 *
 * const s3Client = new S3Client({
 *   region: process.env.AWS_REGION,
 *   credentials: {
 *     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
 *     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
 *   }
 * })
 *
 * const buffer = Buffer.from(await file.arrayBuffer())
 * const key = `projects/${projectId}/${Date.now()}-${file.name}`
 *
 * await s3Client.send(new PutObjectCommand({
 *   Bucket: process.env.S3_BUCKET_NAME,
 *   Key: key,
 *   Body: buffer,
 *   ContentType: file.type
 * }))
 *
 * return `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`
 * ```
 *
 * Example for Cloudflare R2:
 * ```typescript
 * const formData = new FormData()
 * formData.append('file', file)
 *
 * const response = await fetch(
 *   `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucketName}/objects/${fileName}`,
 *   {
 *     method: 'PUT',
 *     headers: {
 *       'Authorization': `Bearer ${process.env.CLOUDFLARE_R2_TOKEN}`
 *     },
 *     body: await file.arrayBuffer()
 *   }
 * )
 *
 * return `https://${bucketName}.r2.dev/${fileName}`
 * ```
 */
export async function uploadFile(
  file: File,
  projectId: string,
  options: UploadOptions = {}
): Promise<UploadedFile> {
  const {
    maxFileSize = 100 * 1024 * 1024, // 100MB default
    allowedTypes = [
      'application/pdf',
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/quicktime',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip', 'application/x-rar-compressed'
    ],
    generateThumbnail = true
  } = options

  // Validate file size
  if (file.size > maxFileSize) {
    throw new Error(`File size exceeds maximum of ${maxFileSize / 1024 / 1024}MB`)
  }

  // Validate file type
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed`)
  }

  // TODO: Replace with actual S3/Cloudflare upload
  // For now, return placeholder URL
  const timestamp = Date.now()
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const fileUrl = `https://storage.intransparency.com/projects/${projectId}/${timestamp}-${sanitizedFileName}`

  // TODO: Generate thumbnail for images/videos if needed
  let thumbnail: string | undefined
  if (generateThumbnail && file.type.startsWith('image/')) {
    thumbnail = `${fileUrl}-thumb.jpg`
  }

  return {
    url: fileUrl,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
    thumbnail
  }
}

/**
 * Upload multiple files
 */
export async function uploadMultipleFiles(
  files: File[],
  projectId: string,
  options: UploadOptions = {}
): Promise<UploadedFile[]> {
  const uploadPromises = files.map(file => uploadFile(file, projectId, options))
  return Promise.all(uploadPromises)
}

/**
 * Delete a file from cloud storage
 *
 * TODO: Replace with actual S3/Cloudflare deletion
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  // TODO: Implement actual deletion
  console.log(`Deleting file: ${fileUrl}`)

  // Example for S3:
  // const key = fileUrl.split('.com/')[1]
  // await s3Client.send(new DeleteObjectCommand({
  //   Bucket: process.env.S3_BUCKET_NAME,
  //   Key: key
  // }))
}

/**
 * Get file metadata (size, type, etc.)
 */
export function getFileMetadata(file: File) {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    extension: file.name.split('.').pop()?.toLowerCase()
  }
}

/**
 * Validate file before upload
 */
export function validateFile(file: File, options: UploadOptions = {}): { valid: boolean; error?: string } {
  const {
    maxFileSize = 100 * 1024 * 1024,
    allowedTypes = []
  } = options

  if (file.size > maxFileSize) {
    return {
      valid: false,
      error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum of ${maxFileSize / 1024 / 1024}MB`
    }
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`
    }
  }

  return { valid: true }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Get file icon based on type
 */
export function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '🖼️'
  if (mimeType.startsWith('video/')) return '🎥'
  if (mimeType === 'application/pdf') return '📄'
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊'
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📽️'
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝'
  if (mimeType.includes('zip') || mimeType.includes('rar')) return '📦'
  return '📎'
}

/**
 * Check if file is an image
 */
export function isImage(mimeType: string): boolean {
  return mimeType.startsWith('image/')
}

/**
 * Check if file is a video
 */
export function isVideo(mimeType: string): boolean {
  return mimeType.startsWith('video/')
}

/**
 * Check if file is a document
 */
export function isDocument(mimeType: string): boolean {
  return mimeType === 'application/pdf' ||
    mimeType.includes('word') ||
    mimeType.includes('excel') ||
    mimeType.includes('powerpoint')
}
