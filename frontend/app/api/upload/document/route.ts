import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { proxyUpload } from '@/lib/backend-proxy'
import { uploadDocument } from '@/lib/storage/upload-helpers'

export const maxDuration = 30
export const dynamic = 'force-dynamic'

/**
 * POST /api/upload/document
 * Tries Render backend first, falls back to direct R2 upload.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()

    // Normalize field name
    const file = formData.get('file') as File | null
    if (file && !formData.get('document')) {
      formData.set('document', file)
      formData.delete('file')
    }

    // Try proxy to Render backend
    const proxyResponse = await proxyUpload(
      formData,
      '/api/upload/document',
      session.user.id,
      session.user.role
    )

    if (proxyResponse && proxyResponse.ok) {
      const data = await proxyResponse.json()
      return NextResponse.json(data)
    }

    // Fallback: direct R2 upload from Vercel
    console.log('Backend proxy failed or unavailable, falling back to direct R2 upload')
    const docFile = formData.get('document') as File | null
    if (!docFile) {
      return NextResponse.json({ error: 'No document file provided' }, { status: 400 })
    }

    const bytes = await docFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const folder = (formData.get('folder') as string) || 'documents'

    const result = await uploadDocument(buffer, docFile.name, docFile.type, {
      folder,
      metadata: {
        userId: session.user.id,
        originalName: encodeURIComponent(docFile.name),
        projectId: (formData.get('projectId') as string) || '',
        uploadedAt: new Date().toISOString(),
      },
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      key: result.key,
      size: result.size,
      type: result.type,
    })
  } catch (error: any) {
    console.error('Document upload error:', error?.message)
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 })
  }
}

/**
 * GET /api/upload/document — upload limits info
 */
export async function GET() {
  return NextResponse.json({
    maxFileSize: 25 * 1024 * 1024,
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  })
}
