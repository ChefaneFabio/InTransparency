const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid')
const path = require('path')

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME

class S3Service {
  // Upload file to S3
  async uploadToS3(file, folder = '') {
    try {
      // Generate unique filename
      const fileExtension = path.extname(file.originalname)
      const fileName = `${uuidv4()}${fileExtension}`
      const key = folder ? `${folder}${fileName}` : fileName

      // Set up upload parameters
      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read', // Make files publicly accessible
        Metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'intransparency-platform'
        }
      }

      // Upload to S3
      const result = await s3.upload(uploadParams).promise()

      return {
        url: result.Location,
        key: result.Key,
        bucket: result.Bucket,
        etag: result.ETag
      }
    } catch (error) {
      console.error('S3 upload error:', error)
      throw new Error('Failed to upload file to S3')
    }
  }

  // Delete file from S3
  async deleteFromS3(key) {
    try {
      const deleteParams = {
        Bucket: BUCKET_NAME,
        Key: key
      }

      await s3.deleteObject(deleteParams).promise()
      return { success: true }
    } catch (error) {
      console.error('S3 delete error:', error)
      throw new Error('Failed to delete file from S3')
    }
  }

  // Generate presigned URL for direct uploads
  async generatePresignedUploadUrl(key, contentType, expiresIn = 3600) {
    try {
      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contentType,
        ACL: 'public-read',
        Expires: expiresIn
      }

      const uploadUrl = await s3.getSignedUrlPromise('putObject', uploadParams)

      return {
        uploadUrl,
        downloadUrl: `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`,
        key,
        expiresIn
      }
    } catch (error) {
      console.error('Presigned URL generation error:', error)
      throw new Error('Failed to generate presigned upload URL')
    }
  }

  // Generate presigned URL for downloads
  async generatePresignedDownloadUrl(key, expiresIn = 3600) {
    try {
      const downloadParams = {
        Bucket: BUCKET_NAME,
        Key: key,
        Expires: expiresIn
      }

      const downloadUrl = await s3.getSignedUrlPromise('getObject', downloadParams)

      return {
        downloadUrl,
        key,
        expiresIn
      }
    } catch (error) {
      console.error('Presigned download URL generation error:', error)
      throw new Error('Failed to generate presigned download URL')
    }
  }

  // List objects in a folder
  async listObjects(prefix = '', maxKeys = 1000) {
    try {
      const listParams = {
        Bucket: BUCKET_NAME,
        Prefix: prefix,
        MaxKeys: maxKeys
      }

      const result = await s3.listObjectsV2(listParams).promise()

      return {
        objects: result.Contents,
        count: result.KeyCount,
        isTruncated: result.IsTruncated,
        nextContinuationToken: result.NextContinuationToken
      }
    } catch (error) {
      console.error('S3 list objects error:', error)
      throw new Error('Failed to list S3 objects')
    }
  }

  // Get object metadata
  async getObjectMetadata(key) {
    try {
      const headParams = {
        Bucket: BUCKET_NAME,
        Key: key
      }

      const result = await s3.headObject(headParams).promise()

      return {
        contentType: result.ContentType,
        contentLength: result.ContentLength,
        etag: result.ETag,
        lastModified: result.LastModified,
        metadata: result.Metadata
      }
    } catch (error) {
      console.error('S3 head object error:', error)
      throw new Error('Failed to get object metadata')
    }
  }

  // Copy object within S3
  async copyObject(sourceKey, destinationKey) {
    try {
      const copyParams = {
        Bucket: BUCKET_NAME,
        CopySource: `${BUCKET_NAME}/${sourceKey}`,
        Key: destinationKey
      }

      const result = await s3.copyObject(copyParams).promise()

      return {
        copySource: copyParams.CopySource,
        destinationKey,
        etag: result.CopyObjectResult.ETag
      }
    } catch (error) {
      console.error('S3 copy object error:', error)
      throw new Error('Failed to copy S3 object')
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(files, folder = '') {
    try {
      const uploadPromises = files.map(file => this.uploadToS3(file, folder))
      const results = await Promise.allSettled(uploadPromises)

      const successful = []
      const failed = []

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successful.push({
            ...result.value,
            originalName: files[index].originalname
          })
        } else {
          failed.push({
            originalName: files[index].originalname,
            error: result.reason.message
          })
        }
      })

      return { successful, failed }
    } catch (error) {
      console.error('Multiple file upload error:', error)
      throw new Error('Failed to upload multiple files')
    }
  }

  // Delete multiple files
  async deleteMultipleFiles(keys) {
    try {
      const deleteParams = {
        Bucket: BUCKET_NAME,
        Delete: {
          Objects: keys.map(key => ({ Key: key })),
          Quiet: false
        }
      }

      const result = await s3.deleteObjects(deleteParams).promise()

      return {
        deleted: result.Deleted,
        errors: result.Errors
      }
    } catch (error) {
      console.error('Multiple file delete error:', error)
      throw new Error('Failed to delete multiple files')
    }
  }

  // Check if bucket exists and is accessible
  async checkBucketAccess() {
    try {
      await s3.headBucket({ Bucket: BUCKET_NAME }).promise()
      return { accessible: true }
    } catch (error) {
      console.error('Bucket access check error:', error)
      return { accessible: false, error: error.message }
    }
  }

  // Get bucket info
  async getBucketInfo() {
    try {
      // Get bucket location
      const locationResult = await s3.getBucketLocation({ Bucket: BUCKET_NAME }).promise()
      
      // Get bucket versioning
      const versioningResult = await s3.getBucketVersioning({ Bucket: BUCKET_NAME }).promise()

      return {
        name: BUCKET_NAME,
        region: locationResult.LocationConstraint || 'us-east-1',
        versioning: versioningResult.Status || 'Disabled'
      }
    } catch (error) {
      console.error('Get bucket info error:', error)
      throw new Error('Failed to get bucket information')
    }
  }
}

// Helper functions for common file operations
const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase()
}

const isImageFile = (filename) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp']
  return imageExtensions.includes(getFileExtension(filename))
}

const isVideoFile = (filename) => {
  const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv']
  return videoExtensions.includes(getFileExtension(filename))
}

const isDocumentFile = (filename) => {
  const documentExtensions = ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.odt']
  return documentExtensions.includes(getFileExtension(filename))
}

const getFileSizeInMB = (sizeInBytes) => {
  return (sizeInBytes / (1024 * 1024)).toFixed(2)
}

// Create singleton instance
const s3Service = new S3Service()

module.exports = {
  uploadToS3: s3Service.uploadToS3.bind(s3Service),
  deleteFromS3: s3Service.deleteFromS3.bind(s3Service),
  generatePresignedUploadUrl: s3Service.generatePresignedUploadUrl.bind(s3Service),
  generatePresignedDownloadUrl: s3Service.generatePresignedDownloadUrl.bind(s3Service),
  listObjects: s3Service.listObjects.bind(s3Service),
  getObjectMetadata: s3Service.getObjectMetadata.bind(s3Service),
  copyObject: s3Service.copyObject.bind(s3Service),
  uploadMultipleFiles: s3Service.uploadMultipleFiles.bind(s3Service),
  deleteMultipleFiles: s3Service.deleteMultipleFiles.bind(s3Service),
  checkBucketAccess: s3Service.checkBucketAccess.bind(s3Service),
  getBucketInfo: s3Service.getBucketInfo.bind(s3Service),
  getFileExtension,
  isImageFile,
  isVideoFile,
  isDocumentFile,
  getFileSizeInMB
}