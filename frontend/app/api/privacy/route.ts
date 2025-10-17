import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/privacy - Get user's privacy settings
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        profilePublic: true,
        gpaPublic: true,
        // Add more privacy-related fields from schema
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Return privacy settings
    // Note: You'll need to add these fields to your Prisma schema
    const settings = {
      profilePublic: user.profilePublic,
      showGPA: user.gpaPublic,
      // Add other settings as they're added to the schema
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching privacy settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/privacy - Update user's privacy settings
export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      profilePublic,
      showGPA,
      showLocation,
      showEmail,
      showPhone,
      allowMessagesFrom,
      showLastActive,
      anonymousBrowsing,
      hideFromCompanies,
      indexInSearchEngines,
      showProjects
    } = body

    // Update user privacy settings
    await prisma.user.update({
      where: { id: userId },
      data: {
        profilePublic,
        gpaPublic: showGPA,
        // Note: You'll need to add these fields to your Prisma schema
        // showLocation,
        // showEmail,
        // showPhone,
        // allowMessagesFrom,
        // showLastActive,
        // anonymousBrowsing,
        // indexInSearchEngines,
        // showProjects
      }
    })

    // Track analytics event
    await prisma.analytics.create({
      data: {
        userId,
        eventType: 'CUSTOM',
        eventName: 'privacy_settings_updated',
        properties: {
          profilePublic,
          showGPA,
          allowMessagesFrom
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Privacy settings updated successfully'
    })
  } catch (error) {
    console.error('Error updating privacy settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
