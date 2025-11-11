import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { uploadDocument } from '@/lib/storage'

/**
 * Upload Document API
 *
 * Accepts document uploads (PDF, Word, Excel, etc.).
 * Uploads to Cloudflare R2 storage with validation.
 * Requires authentication.
 *
 * POST /api/upload/document
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
    const file = formData.get('document') as File | null
    const folder = (formData.get('folder') as string) || 'documents'
    const projectId = formData.get('projectId') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'No document file provided' },
        { status: 400 }
      )
    }

    // 3. Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 4. Upload document with validation
    const result = await uploadDocument(
      buffer,
      file.name,
      file.type,
      {
        folder,
        metadata: {
          userId: session.user.id,
          originalName: file.name,
          projectId: projectId || '',
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
    })
  } catch (error: any) {
    console.error('Document upload API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload document' },
      { status: 500 }
    )
  }
}

/**
 * Get upload size limits
 */
export async function GET(req: NextRequest) {
  return NextResponse.json({
    maxFileSize: 25 * 1024 * 1024, // 25MB
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  })
}
