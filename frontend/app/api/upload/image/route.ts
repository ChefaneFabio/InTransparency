import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { uploadImage } from '@/lib/storage'

/**
 * Upload Image API
 *
 * Accepts image uploads with automatic optimization and variant generation.
 * Requires authentication.
 *
 * POST /api/upload/image
 * - Validates image file
 * - Optimizes and compresses
 * - Creates variants (optional)
 * - Uploads to Cloudflare R2
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

    // 2. Parse form data
    const formData = await req.formData()
    const file = formData.get('image') as File | null
    const createVariants = formData.get('createVariants') === 'true'
    const optimize = formData.get('optimize') !== 'false' // Default true
    const folder = (formData.get('folder') as string) || 'images'

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }

    // 3. Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 4. Upload image with validation and optimization
    const result = await uploadImage(
      buffer,
      file.name,
      file.type,
      {
        optimize,
        createVariants,
        folder,
        metadata: {
          userId: session.user.id,
          originalName: file.name,
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
      size: result.size,
      type: result.type,
      variants: result.variants,
    })
  } catch (error: any) {
    console.error('Image upload API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    )
  }
}

/**
 * Get upload size limits
 */
export async function GET(req: NextRequest) {
  return NextResponse.json({
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxDimensions: {
      width: 4096,
      height: 4096,
    },
  })
}
