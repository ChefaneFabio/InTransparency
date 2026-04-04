import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { proxyUpload } from '@/lib/backend-proxy'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

/**
 * POST /api/upload/video — proxy to Render backend
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()

    const response = await proxyUpload(
      formData,
      '/api/upload/video',
      session.user.id,
      session.user.role
    )

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('Video upload proxy error:', error?.message)
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/upload/video — upload limits info
 */
export async function GET() {
  return NextResponse.json({
    maxFileSize: 500 * 1024 * 1024,
    allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
  })
}
