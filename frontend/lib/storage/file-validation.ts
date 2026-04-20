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
  'application/vnd.ms-powerpoint': [
    [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1], // PPT (OLE compound)
  ],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': [
    [0x50, 0x4B, 0x03, 0x04], // PPTX (ZIP format)
  ],
  'application/rtf': [
    [0x7B, 0x5C, 0x72, 0x74, 0x66], // {\rtf
  ],

  // Archives
  'application/zip': [
    [0x50, 0x4B, 0x03, 0x04], // ZIP
    [0x50, 0x4B, 0x05, 0x06], // Empty ZIP
    [0x50, 0x4B, 0x07, 0x08], // Spanned ZIP
  ],
  'application/x-rar-compressed': [
    [0x52, 0x61, 0x72, 0x21, 0x1A, 0x07], // RAR v1.5+
    [0x52, 0x61, 0x72, 0x21, 0x1A, 0x07, 0x01, 0x00], // RAR v5.0+
  ],
  'application/x-7z-compressed': [
    [0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C], // 7Z
  ],
  'application/gzip': [
    [0x1F, 0x8B], // gzip
  ],
  'application/x-tar': [
    // No reliable leading magic — usually detected via extension
  ],
}

// File extensions that are plain text (no binary signature) and should
// pass validation when magic bytes are absent. Students commonly submit
// code, notebooks, configs, and data files with these extensions.
const TEXT_EXTENSIONS: Record<string, string> = {
  txt: 'text/plain',
  md: 'text/markdown',
  csv: 'text/csv',
  tsv: 'text/tab-separated-values',
  json: 'application/json',
  jsonl: 'application/json',
  ipynb: 'application/x-ipynb+json',
  xml: 'application/xml',
  yaml: 'application/yaml',
  yml: 'application/yaml',
  toml: 'application/toml',
  tex: 'application/x-tex',
  bib: 'application/x-bibtex',
  log: 'text/plain',
  // Code
  py: 'text/x-python',
  r: 'text/x-r',
  rmd: 'text/x-r-markdown',
  js: 'application/javascript',
  ts: 'application/typescript',
  tsx: 'application/typescript',
  jsx: 'application/javascript',
  java: 'text/x-java',
  c: 'text/x-c',
  h: 'text/x-c',
  cpp: 'text/x-c++',
  cc: 'text/x-c++',
  hpp: 'text/x-c++',
  cs: 'text/x-csharp',
  go: 'text/x-go',
  rs: 'text/x-rust',
  swift: 'text/x-swift',
  kt: 'text/x-kotlin',
  php: 'application/x-php',
  rb: 'text/x-ruby',
  sql: 'application/sql',
  sh: 'application/x-sh',
  // Web
  html: 'text/html',
  htm: 'text/html',
  css: 'text/css',
  scss: 'text/x-scss',
  // Config/data
  ini: 'text/plain',
  cfg: 'text/plain',
  conf: 'text/plain',
  env: 'text/plain',
}

// Binary formats trusted by extension (no reliable magic-byte signature,
// but we're willing to accept them from authenticated users).
const BINARY_EXTENSIONS: Record<string, string> = {
  // 3D / CAD
  stl: 'model/stl',
  dxf: 'application/dxf',
  dwg: 'application/acad',
  step: 'application/step',
  stp: 'application/step',
  iges: 'model/iges',
  igs: 'model/iges',
  obj: 'model/obj',
  gltf: 'model/gltf+json',
  glb: 'model/gltf-binary',
  dae: 'model/vnd.collada+xml',
  fbx: 'application/octet-stream',
  // Design
  sketch: 'application/x-sketch',
  fig: 'application/x-figma',
  psd: 'image/vnd.adobe.photoshop',
  ai: 'application/postscript',
  indd: 'application/x-indesign',
  // Audio / media (for media-project students — not content-parsed yet)
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  flac: 'audio/flac',
  m4a: 'audio/mp4',
  ogg: 'audio/ogg',
}

export function getExtension(filename: string): string {
  const parts = filename.toLowerCase().split('.')
  return parts.length > 1 ? parts[parts.length - 1] : ''
}

export function isTextExtension(filename: string): boolean {
  return getExtension(filename) in TEXT_EXTENSIONS
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
    // Plain-text files (code, notebooks, configs) have no magic signature.
    // Allow them when (a) the extension is whitelisted AND (b) the preset
    // explicitly allows text-based types.
    const ext = getExtension(filename)
    const textMime = TEXT_EXTENSIONS[ext]
    const textAllowed =
      textMime !== undefined &&
      (options.allowedTypes.includes(textMime) ||
        options.allowedTypes.includes('text/*') ||
        options.allowedTypes.includes('text/plain'))

    // Binary formats with no reliable magic bytes (STL etc.) — trust extension
    // when explicitly allowlisted.
    const binaryMime = BINARY_EXTENSIONS[ext]
    const binaryAllowed =
      binaryMime !== undefined && options.allowedTypes.includes(binaryMime)

    if (textAllowed) {
      detectedType = textMime
    } else if (binaryAllowed) {
      detectedType = binaryMime
    } else {
      const typeValidation = validateFileType(buffer, expectedMimeType, options.allowedTypes)
      if (!typeValidation.valid) {
        errors.push(typeValidation.error!)
      }
      detectedType = typeValidation.detectedType
    }
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
      // Office documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/rtf',
      // OpenDocument (LibreOffice / OpenOffice)
      'application/vnd.oasis.opendocument.text',
      'application/vnd.oasis.opendocument.spreadsheet',
      'application/vnd.oasis.opendocument.presentation',
      // EPUB
      'application/epub+zip',
      // 3D / CAD
      'model/stl',
      'application/vnd.ms-pki.stl',
      'application/dxf',
      'image/vnd.dxf',
      'application/acad',
      'application/step',
      'model/step+zip',
      'model/iges',
      'model/obj',
      'model/gltf+json',
      'model/gltf-binary',
      'model/vnd.collada+xml',
      'application/octet-stream', // FBX and other generic binaries
      // Design
      'application/x-sketch',
      'application/x-figma',
      'image/vnd.adobe.photoshop',
      'application/postscript', // AI
      'application/x-indesign',
      // Audio
      'audio/mpeg',
      'audio/wav',
      'audio/flac',
      'audio/mp4',
      'audio/ogg',
      // Archives (for source code bundles, CAD exports, etc.)
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      'application/gzip',
      'application/x-tar',
      // Text-based project files (code, notebooks, data)
      'text/plain',
      'text/markdown',
      'text/csv',
      'text/tab-separated-values',
      'application/json',
      'application/x-ipynb+json',
      'application/xml',
      'application/yaml',
      'application/toml',
      'application/x-tex',
      'application/x-bibtex',
      'text/x-python',
      'text/x-r',
      'text/x-r-markdown',
      'application/javascript',
      'application/typescript',
      'text/x-java',
      'text/x-c',
      'text/x-c++',
      'text/x-csharp',
      'text/x-go',
      'text/x-rust',
      'text/x-swift',
      'text/x-kotlin',
      'application/x-php',
      'text/x-ruby',
      'application/sql',
      'application/x-sh',
      'text/html',
      'text/css',
      'text/x-scss',
    ],
    maxSize: 50 * 1024 * 1024, // 50MB (up from 25 — projects with data files run large)
    checkMagicBytes: true,
  },
}
