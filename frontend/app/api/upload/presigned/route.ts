import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { generatePresignedUploadUrl, generatePresignedDownloadUrl } from '@/lib/storage/r2-client'
import { generateUniqueFilename } from '@/lib/storage/file-validation'

/**
 * Generate Pre-signed Upload URL API
 *
 * Generates a pre-signed URL that allows clients to upload files
 * directly to R2 without going through the server.
 *
 * Benefits:
 * - Faster uploads (direct to R2)
 * - Reduced server load
 * - Lower bandwidth costs
 *
 * POST /api/upload/presigned
 * Body: { filename, contentType, folder }
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    // 2. Parse request body
    const body = await req.json()
    const { filename, contentType, folder = 'uploads', expiresIn = 3600 } = body

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'Missing required fields: filename, contentType' },
        { status: 400 }
      )
    }

    // 3. Validate content type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { error: `Content type ${contentType} is not allowed` },
        { status: 400 }
      )
    }

    // 4. Generate unique filename and key
    const uniqueFilename = generateUniqueFilename(filename)
    const key = `${folder}/${uniqueFilename}`

    // 5. Generate pre-signed URL
    const uploadUrl = await generatePresignedUploadUrl(key, contentType, expiresIn)

    return NextResponse.json({
      uploadUrl,
      key,
      expiresIn,
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
    })
  } catch (error: any) {
    console.error('Pre-signed URL generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate upload URL' },
      { status: 500 }
    )
  }
}

/**
 * Generate Pre-signed Download URL API
 *
 * Generates a temporary URL for downloading/viewing a private file.
 *
 * GET /api/upload/presigned?key=path/to/file.pdf&type=download
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    // 2. Get parameters
    const { searchParams } = new URL(req.url)
    const key = searchParams.get('key')
    const type = searchParams.get('type') || 'download'
    const expiresIn = parseInt(searchParams.get('expiresIn') || '3600')

    if (!key) {
      return NextResponse.json(
        { error: 'Missing required parameter: key' },
        { status: 400 }
      )
    }

    // 3. Generate pre-signed download URL
    const downloadUrl = await generatePresignedDownloadUrl(key, expiresIn)

    return NextResponse.json({
      downloadUrl,
      key,
      expiresIn,
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
    })
  } catch (error: any) {
    console.error('Pre-signed download URL error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate download URL' },
      { status: 500 }
    )
  }
}
