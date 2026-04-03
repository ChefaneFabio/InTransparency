import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

/**
 * Cloudflare R2 Storage Client
 *
 * Lazy-initialized to ensure env vars are available at request time on Vercel.
 * Cloudflare R2 is S3-compatible, so we use the AWS SDK.
 */

let _r2Client: S3Client | null = null

function getR2Client(): S3Client {
  if (!_r2Client) {
    _r2Client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
    })
  }
  return _r2Client
}

function getR2Config() {
  return {
    bucketName: process.env.R2_BUCKET_NAME || 'intransparency',
    publicUrl: process.env.R2_PUBLIC_URL || '',
    maxFileSize: 100 * 1024 * 1024,
    maxVideoSize: 500 * 1024 * 1024,
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    allowedVideoTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'],
    allowedDocumentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  }
}

// Keep backward-compatible exports
export const r2Client = new Proxy({} as S3Client, {
  get(_target, prop) { return (getR2Client() as any)[prop] },
})

export const R2_CONFIG = new Proxy({} as ReturnType<typeof getR2Config>, {
  get(_target, prop) { return (getR2Config() as any)[prop] },
})

/**
 * Upload a file to R2
 */
export async function uploadToR2(
  file: Buffer,
  key: string,
  contentType: string,
  metadata?: Record<string, string>
): Promise<string> {
  const client = getR2Client()
  const config = getR2Config()

  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: key,
    Body: file,
    ContentType: contentType,
    Metadata: metadata,
  })

  await client.send(command)

  if (config.publicUrl) {
    return `${config.publicUrl}/${key}`
  }
  return `https://${config.bucketName}.r2.dev/${key}`
}

/**
 * Delete a file from R2
 */
export async function deleteFromR2(key: string): Promise<void> {
  const client = getR2Client()
  const config = getR2Config()

  const command = new DeleteObjectCommand({
    Bucket: config.bucketName,
    Key: key,
  })

  await client.send(command)
}

/**
 * Generate a pre-signed URL for direct upload from client
 */
export async function generatePresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<string> {
  const client = getR2Client()
  const config = getR2Config()

  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: key,
    ContentType: contentType,
  })

  return getSignedUrl(client, command, { expiresIn })
}

/**
 * Generate a pre-signed URL for downloading/viewing a private file
 */
export async function generatePresignedDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const client = getR2Client()
  const config = getR2Config()

  const command = new GetObjectCommand({
    Bucket: config.bucketName,
    Key: key,
  })

  return getSignedUrl(client, command, { expiresIn })
}

/**
 * Check if a file exists in R2
 */
export async function fileExistsInR2(key: string): Promise<boolean> {
  try {
    const client = getR2Client()
    const config = getR2Config()

    const command = new HeadObjectCommand({
      Bucket: config.bucketName,
      Key: key,
    })

    await client.send(command)
    return true
  } catch {
    return false
  }
}

/**
 * Get file metadata from R2
 */
export async function getFileMetadata(key: string) {
  try {
    const client = getR2Client()
    const config = getR2Config()

    const command = new HeadObjectCommand({
      Bucket: config.bucketName,
      Key: key,
    })

    const response = await client.send(command)
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
