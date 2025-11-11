/**
 * Storage Module - Barrel Export
 *
 * Centralized file storage management with R2, validation, and optimization.
 */

// R2 Client
export {
  r2Client,
  R2_CONFIG,
  uploadToR2,
  deleteFromR2,
  generatePresignedUploadUrl,
  generatePresignedDownloadUrl,
  fileExistsInR2,
  getFileMetadata,
} from './r2-client'

// File Validation
export {
  detectFileType,
  validateFileType,
  validateFileSize,
  validateImageDimensions,
  sanitizeFilename,
  generateUniqueFilename,
  validateFile,
  VALIDATION_PRESETS,
} from './file-validation'

export type {
  FileValidationOptions,
  FileValidationResult,
} from './file-validation'

// File Optimization
export {
  optimizeImage,
  createThumbnail,
  createImageVariants,
  getVideoMetadata,
  generateVideoThumbnail,
  calculateFileHash,
  compressFile,
  decompressFile,
  OPTIMIZATION_PRESETS,
} from './file-optimization'

export type { ImageOptimizationOptions } from './file-optimization'

// Comprehensive upload function
export { uploadFile, uploadImage, uploadVideo, uploadDocument } from './upload-helpers'

export type { UploadResult, UploadOptions } from './upload-helpers'
