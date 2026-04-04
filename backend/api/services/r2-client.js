/**
 * Cloudflare R2 Storage Client for the backend.
 * Uses AWS SDK v2 (already in package.json as 'aws-sdk').
 */

const AWS = require('aws-sdk')

let _s3 = null

function getS3Client() {
  if (!_s3) {
    _s3 = new AWS.S3({
      endpoint: process.env.R2_ENDPOINT,
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      region: 'auto',
      signatureVersion: 'v4',
      s3ForcePathStyle: true,
    })
  }
  return _s3
}

function getBucketName() {
  return process.env.R2_BUCKET_NAME || 'intransparency'
}

function getPublicUrl() {
  return process.env.R2_PUBLIC_URL || ''
}

/**
 * Upload a file buffer to R2
 */
async function uploadToR2(buffer, key, contentType, metadata = {}) {
  const s3 = getS3Client()

  await s3.putObject({
    Bucket: getBucketName(),
    Key: key,
    Body: buffer,
    ContentType: contentType,
    Metadata: metadata,
  }).promise()

  const publicUrl = getPublicUrl()
  if (publicUrl) {
    return `${publicUrl}/${key}`
  }
  return `https://${getBucketName()}.r2.dev/${key}`
}

/**
 * Delete a file from R2
 */
async function deleteFromR2(key) {
  const s3 = getS3Client()

  await s3.deleteObject({
    Bucket: getBucketName(),
    Key: key,
  }).promise()
}

/**
 * Generate a presigned upload URL
 */
async function generatePresignedUploadUrl(key, contentType, expiresIn = 3600) {
  const s3 = getS3Client()

  return s3.getSignedUrlPromise('putObject', {
    Bucket: getBucketName(),
    Key: key,
    ContentType: contentType,
    Expires: expiresIn,
  })
}

module.exports = {
  uploadToR2,
  deleteFromR2,
  generatePresignedUploadUrl,
  getBucketName,
  getPublicUrl,
}
