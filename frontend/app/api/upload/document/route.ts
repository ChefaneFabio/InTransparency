import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { proxyUpload } from '@/lib/backend-proxy'

export const maxDuration = 30
export const dynamic = 'force-dynamic'

/**
 * POST /api/upload/document — proxy to Render backend
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()

    // Normalize field name: frontend may send 'file' instead of 'document'
    const file = formData.get('file') as File | null
    if (file && !formData.get('document')) {
      formData.set('document', file)
      formData.delete('file')
    }

    const response = await proxyUpload(
      formData,
      '/api/upload/document',
      session.user.id,
      session.user.role
    )

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('Document upload proxy error:', error?.message)
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    )
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
