import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// POST /api/institutions/branding - Save widget branding configuration
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { institutionId, brandingConfig } = body

    if (!institutionId || !brandingConfig) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify user is university or admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, university: true }
    })

    if (!user || !['UNIVERSITY', 'ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // TODO: Store branding config once Institution model is added
    // For now, just return success without storing
    // When Institution model exists:
    // await prisma.institution.update({
    //   where: { id: institutionId },
    //   data: { brandingConfig: brandingConfig as any }
    // })

    // Track configuration change
    await prisma.analytics.create({
      data: {
        userId,
        eventType: 'CUSTOM',
        eventName: 'widget_config_updated',
        properties: {
          institutionId,
          config: brandingConfig
        }
      }
    }).catch(() => {}) // Non-blocking

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error saving branding config:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/institutions/branding?institutionId=xxx - Get branding configuration
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const institutionId = searchParams.get('institutionId')

    if (!institutionId) {
      return NextResponse.json({ error: 'institutionId required' }, { status: 400 })
    }

    // TODO: Fetch from Institution model once it's added
    // For now, return mock/default values
    return NextResponse.json({
      success: true,
      institution: {
        name: 'Politecnico di Milano',
        logoUrl: null,
        subscriptionTier: 'PREMIUM_EMBED',
        brandingConfig: {}
      }
    })

  } catch (error) {
    console.error('Error fetching branding config:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
