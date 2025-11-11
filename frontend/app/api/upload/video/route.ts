import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { uploadVideo } from '@/lib/storage'
import { deleteFromR2 } from '@/lib/storage/r2-client'

/**
 * Upload Video API
 *
 * Accepts video uploads with validation.
 * Uploads to Cloudflare R2 storage.
 * Requires authentication.
 *
 * POST /api/upload/video
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    // 2. Parse form data
    const formData = await request.formData()
    const file = formData.get('video') as File | null
    const duration = formData.get('duration') as string | null
    const folder = (formData.get('folder') as string) || 'videos'

    if (!file) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      )
    }

    // 3. Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 4. Upload video with validation
    const result = await uploadVideo(
      buffer,
      file.name,
      file.type,
      {
        folder,
        metadata: {
          userId: session.user.id,
          originalName: file.name,
          duration: duration || '',
          uploadedAt: new Date().toISOString(),
        },
      }
    )

    // 5. Return result
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      key: result.key,
      filename: result.key.split('/').pop(),
      size: result.size,
      type: result.type,
      duration: duration ? parseInt(duration) : null,
    })
  } catch (error: any) {
    console.error('Error uploading video:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload video' },
      { status: 500 }
    )
  }
}

/**
 * Delete Video from R2
 *
 * DELETE /api/upload/video?key=videos/filename.mp4
 */
export async function DELETE(request: NextRequest) {
  try {
    // 1. Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    // 2. Get file key from query params
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json(
        { error: 'No file key provided' },
        { status: 400 }
      )
    }

    // 3. Delete from R2
    await deleteFromR2(key)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting video:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete video' },
      { status: 500 }
    )
  }
}

/**
 * Get upload limits
 */
export async function GET(req: NextRequest) {
  return NextResponse.json({
    maxFileSize: 500 * 1024 * 1024, // 500MB
    allowedTypes: [
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/x-msvideo',
    ],
  })
}
