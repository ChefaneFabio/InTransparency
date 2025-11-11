import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

/**
 * Cloudflare R2 Storage Client
 *
 * Cloudflare R2 is S3-compatible, so we use the AWS SDK.
 * Benefits over S3:
 * - Zero egress fees (data transfer out is free)
 * - Lower storage costs
 * - Better performance globally via Cloudflare's network
 */

// Initialize R2 client
export const r2Client = new S3Client({
  region: 'auto', // R2 uses 'auto' for region
  endpoint: process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

// Configuration
export const R2_CONFIG = {
  bucketName: process.env.R2_BUCKET_NAME || 'intransparency',
  publicUrl: process.env.R2_PUBLIC_URL || '', // Custom domain URL
  maxFileSize: 100 * 1024 * 1024, // 100MB default
  maxVideoSize: 500 * 1024 * 1024, // 500MB for videos
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  allowedVideoTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'],
  allowedDocumentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
}

/**
 * Upload a file to R2
 */
export async function uploadToR2(
  file: Buffer,
  key: string,
  contentType: string,
  metadata?: Record<string, string>
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
      Metadata: metadata,
    })

    await r2Client.send(command)

    // Return public URL
    if (R2_CONFIG.publicUrl) {
      return `${R2_CONFIG.publicUrl}/${key}`
    }

    // Fallback to R2.dev subdomain (if configured)
    return `https://${R2_CONFIG.bucketName}.r2.dev/${key}`
  } catch (error) {
    console.error('R2 upload error:', error)
    throw new Error('Failed to upload file to storage')
  }
}

/**
 * Delete a file from R2
 */
export async function deleteFromR2(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: key,
    })

    await r2Client.send(command)
  } catch (error) {
    console.error('R2 delete error:', error)
    throw new Error('Failed to delete file from storage')
  }
}

/**
 * Generate a pre-signed URL for direct upload from client
 * This allows clients to upload directly to R2 without going through your server
 */
export async function generatePresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: key,
      ContentType: contentType,
    })

    const url = await getSignedUrl(r2Client, command, { expiresIn })
    return url
  } catch (error) {
    console.error('Pre-signed URL generation error:', error)
    throw new Error('Failed to generate upload URL')
  }
}

/**
 * Generate a pre-signed URL for downloading/viewing a private file
 */
export async function generatePresignedDownloadUrl(
  key: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: key,
    })

    const url = await getSignedUrl(r2Client, command, { expiresIn })
    return url
  } catch (error) {
    console.error('Pre-signed download URL error:', error)
    throw new Error('Failed to generate download URL')
  }
}

/**
 * Check if a file exists in R2
 */
export async function fileExistsInR2(key: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: key,
    })

    await r2Client.send(command)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Get file metadata from R2
 */
export async function getFileMetadata(key: string) {
  try {
    const command = new HeadObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: key,
    })

    const response = await r2Client.send(command)
    return {
      contentType: response.ContentType,
      contentLength: response.ContentLength,
      lastModified: response.LastModified,
      metadata: response.Metadata,
      etag: response.ETag,
    }
  } catch (error) {
    console.error('Get metadata error:', error)
    return null
  }
}
