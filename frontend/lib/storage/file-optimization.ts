/**
 * File Optimization Utilities
 *
 * Optimize images and videos before uploading to storage.
 * Reduces bandwidth and storage costs while maintaining quality.
 */

import sharp from 'sharp'

/**
 * Image optimization options
 */
export interface ImageOptimizationOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp' | 'avif'
  progressive?: boolean
  stripMetadata?: boolean
}

/**
 * Optimize image file
 */
export async function optimizeImage(
  buffer: Buffer,
  options: ImageOptimizationOptions = {}
): Promise<{ buffer: Buffer; format: string; width: number; height: number; size: number }> {
  try {
    const {
      maxWidth = 2048,
      maxHeight = 2048,
      quality = 85,
      format,
      progressive = true,
      stripMetadata = true,
    } = options

    let pipeline = sharp(buffer)

    // Strip metadata (EXIF, etc.) for privacy and smaller file size
    if (stripMetadata) {
      pipeline = pipeline.rotate() // Auto-rotate based on EXIF, then remove EXIF
    }

    // Resize if too large
    const metadata = await pipeline.metadata()
    if (
      metadata.width &&
      metadata.height &&
      (metadata.width > maxWidth || metadata.height > maxHeight)
    ) {
      pipeline = pipeline.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
    }

    // Convert format if specified, otherwise keep original or use webp
    let outputFormat = format || 'webp'
    let outputBuffer: Buffer

    switch (outputFormat) {
      case 'jpeg':
        outputBuffer = await pipeline
          .jpeg({ quality, progressive })
          .toBuffer()
        break

      case 'png':
        outputBuffer = await pipeline
          .png({ quality, progressive })
          .toBuffer()
        break

      case 'avif':
        outputBuffer = await pipeline
          .avif({ quality })
          .toBuffer()
        break

      case 'webp':
      default:
        outputBuffer = await pipeline
          .webp({ quality })
          .toBuffer()
        outputFormat = 'webp'
        break
    }

    // Get final dimensions
    const finalMetadata = await sharp(outputBuffer).metadata()

    return {
      buffer: outputBuffer,
      format: outputFormat,
      width: finalMetadata.width || 0,
      height: finalMetadata.height || 0,
      size: outputBuffer.length,
    }
  } catch (error) {
    console.error('Image optimization error:', error)
    throw new Error('Failed to optimize image')
  }
}

/**
 * Create thumbnail from image
 */
export async function createThumbnail(
  buffer: Buffer,
  width: number = 300,
  height: number = 300
): Promise<Buffer> {
  try {
    return await sharp(buffer)
      .resize(width, height, {
        fit: 'cover',
        position: 'center',
      })
      .webp({ quality: 80 })
      .toBuffer()
  } catch (error) {
    console.error('Thumbnail creation error:', error)
    throw new Error('Failed to create thumbnail')
  }
}

/**
 * Create multiple image variants (original, large, medium, small, thumbnail)
 */
export async function createImageVariants(
  buffer: Buffer
): Promise<{
  original: Buffer
  large: Buffer
  medium: Buffer
  small: Buffer
  thumbnail: Buffer
}> {
  try {
    const [original, large, medium, small, thumbnail] = await Promise.all([
      optimizeImage(buffer, { maxWidth: 4096, maxHeight: 4096, quality: 90 }),
      optimizeImage(buffer, { maxWidth: 2048, maxHeight: 2048, quality: 85 }),
      optimizeImage(buffer, { maxWidth: 1024, maxHeight: 1024, quality: 85 }),
      optimizeImage(buffer, { maxWidth: 512, maxHeight: 512, quality: 80 }),
      createThumbnail(buffer, 300, 300),
    ])

    return {
      original: original.buffer,
      large: large.buffer,
      medium: medium.buffer,
      small: small.buffer,
      thumbnail,
    }
  } catch (error) {
    console.error('Image variants creation error:', error)
    throw new Error('Failed to create image variants')
  }
}

/**
 * Extract video metadata (duration, dimensions, bitrate)
 * Note: Requires ffmpeg/ffprobe to be installed on the server
 */
export async function getVideoMetadata(filePath: string): Promise<{
  duration: number
  width: number
  height: number
  bitrate: number
  codec: string
}> {
  // This would require ffprobe. For now, return placeholder.
  // In production, use a library like fluent-ffmpeg or call ffprobe directly

  return {
    duration: 0,
    width: 1920,
    height: 1080,
    bitrate: 5000000,
    codec: 'h264',
  }
}

/**
 * Generate video thumbnail
 * Note: Requires ffmpeg to be installed on the server
 */
export async function generateVideoThumbnail(
  videoPath: string,
  timestamp: number = 1
): Promise<Buffer> {
  // This would require ffmpeg. For now, return placeholder.
  // In production, use a library like fluent-ffmpeg to extract a frame

  throw new Error('Video thumbnail generation requires ffmpeg - not implemented yet')
}

/**
 * Calculate file hash for deduplication
 */
export async function calculateFileHash(buffer: Buffer): Promise<string> {
  const crypto = await import('crypto')
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

/**
 * Compress file using gzip (for documents)
 */
export async function compressFile(buffer: Buffer): Promise<Buffer> {
  const zlib = await import('zlib')
  return new Promise((resolve, reject) => {
    zlib.gzip(buffer, { level: 9 }, (error, compressed) => {
      if (error) reject(error)
      else resolve(compressed)
    })
  })
}

/**
 * Decompress gzipped file
 */
export async function decompressFile(buffer: Buffer): Promise<Buffer> {
  const zlib = await import('zlib')
  return new Promise((resolve, reject) => {
    zlib.gunzip(buffer, (error, decompressed) => {
      if (error) reject(error)
      else resolve(decompressed)
    })
  })
}

/**
 * Optimization presets for different use cases
 */
export const OPTIMIZATION_PRESETS = {
  profilePhoto: {
    maxWidth: 512,
    maxHeight: 512,
    quality: 85,
    format: 'webp' as const,
    progressive: true,
    stripMetadata: true,
  },
  projectImage: {
    maxWidth: 2048,
    maxHeight: 2048,
    quality: 85,
    format: 'webp' as const,
    progressive: true,
    stripMetadata: false, // Keep metadata for projects
  },
  thumbnail: {
    maxWidth: 300,
    maxHeight: 300,
    quality: 80,
    format: 'webp' as const,
    progressive: false,
    stripMetadata: true,
  },
}
