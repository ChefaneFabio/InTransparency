import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { proxyUpload } from '@/lib/backend-proxy'
import { uploadImage } from '@/lib/storage/upload-helpers'

export const maxDuration = 30
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()

    // Try proxy to Render backend
    const proxyResponse = await proxyUpload(formData, '/api/upload/image', session.user.id, session.user.role)
    if (proxyResponse && proxyResponse.ok) {
      const data = await proxyResponse.json()
      return NextResponse.json(data)
    }

    // Fallback: direct R2 upload
    console.log('Falling back to direct R2 image upload')
    const file = formData.get('image') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const folder = (formData.get('folder') as string) || 'images'

    const result = await uploadImage(buffer, file.name, file.type, {
      folder,
      optimize: false, // Skip sharp optimization on Vercel
      metadata: {
        userId: session.user.id,
        originalName: encodeURIComponent(file.name),
        uploadedAt: new Date().toISOString(),
      },
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true, url: result.url, key: result.key, size: result.size, type: result.type })
  } catch (error: any) {
    console.error('Image upload error:', error?.message)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    maxFileSize: 10 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  })
}
