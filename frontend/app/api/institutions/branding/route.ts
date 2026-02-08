import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// POST /api/institutions/branding - Save widget branding configuration
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Verify user is university or admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, university: true }
    })

    if (!user || !['UNIVERSITY', 'ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { brandingConfig } = body

    if (!brandingConfig) {
      return NextResponse.json({ error: 'Missing brandingConfig' }, { status: 400 })
    }

    // Upsert into UniversitySettings
    const updateData: Record<string, any> = {}
    if (brandingConfig.primaryColor !== undefined) updateData.primaryColor = brandingConfig.primaryColor
    if (brandingConfig.accentColor !== undefined) updateData.accentColor = brandingConfig.accentColor
    if (brandingConfig.logo !== undefined) updateData.logo = brandingConfig.logo

    await prisma.universitySettings.upsert({
      where: { userId },
      create: {
        userId,
        ...updateData,
      },
      update: updateData,
    })

    // Track configuration change (non-blocking)
    await prisma.analytics.create({
      data: {
        userId,
        eventType: 'CUSTOM',
        eventName: 'widget_config_updated',
        properties: {
          config: brandingConfig
        }
      }
    }).catch(() => {})

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error saving branding config:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/institutions/branding - Get branding configuration
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await prisma.universitySettings.findUnique({
      where: { userId: session.user.id },
      select: {
        name: true,
        logo: true,
        primaryColor: true,
        accentColor: true,
      },
    })

    return NextResponse.json({
      success: true,
      settings: settings || null,
    })

  } catch (error) {
    console.error('Error fetching branding config:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
