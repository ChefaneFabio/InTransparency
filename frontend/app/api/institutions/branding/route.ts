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

    // Verify user is admin of this institution
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, institutionId: true }
    })

    if (!user || user.role !== 'UNIVERSITY_ADMIN' || user.institutionId !== institutionId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Verify institution has Premium Embed subscription
    const institution = await prisma.institution.findUnique({
      where: { id: institutionId },
      select: { subscriptionTier: true }
    })

    if (!institution || !['PREMIUM_EMBED', 'ENTERPRISE_CUSTOM'].includes(institution.subscriptionTier || '')) {
      return NextResponse.json({
        error: 'Premium Embed subscription required',
        upgradeUrl: 'https://intransparency.com/pricing'
      }, { status: 403 })
    }

    // Update branding configuration
    await prisma.institution.update({
      where: { id: institutionId },
      data: {
        brandingConfig: brandingConfig as any
      }
    })

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

    const institution = await prisma.institution.findUnique({
      where: { id: institutionId },
      select: {
        name: true,
        logoUrl: true,
        subscriptionTier: true,
        brandingConfig: true
      }
    })

    if (!institution) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      institution: {
        name: institution.name,
        logoUrl: institution.logoUrl,
        subscriptionTier: institution.subscriptionTier,
        brandingConfig: institution.brandingConfig || {}
      }
    })

  } catch (error) {
    console.error('Error fetching branding config:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
