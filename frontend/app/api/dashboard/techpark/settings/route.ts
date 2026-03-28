import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/techpark/settings
 * Load TechParkSettings for current user. If none exists, return defaults.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'TECHPARK' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userId = session.user.id

    const settings = await prisma.techParkSettings.findUnique({
      where: { userId },
    })

    if (!settings) {
      return NextResponse.json({
        settings: {
          parkName: '',
          parkType: 'PRIVATE',
          description: '',
          website: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          region: '',
          logo: '',
          primaryColor: '',
          accentColor: '',
          memberCompanyCount: 0,
          focusAreas: [],
          foundedYear: null,
          notifyNewStudents: true,
          notifyRecruiterActivity: true,
          notifyPlacements: true,
          showInDirectory: true,
          allowStudentDiscovery: true,
        },
      })
    }

    return NextResponse.json({
      settings: {
        parkName: settings.parkName || '',
        parkType: settings.parkType || 'PRIVATE',
        description: settings.description || '',
        website: settings.website || '',
        email: settings.email || '',
        phone: settings.phone || '',
        address: settings.address || '',
        city: settings.city || '',
        region: settings.region || '',
        logo: settings.logo || '',
        primaryColor: settings.primaryColor || '',
        accentColor: settings.accentColor || '',
        memberCompanyCount: settings.memberCompanyCount || 0,
        focusAreas: settings.focusAreas || [],
        foundedYear: settings.foundedYear || null,
        notifyNewStudents: settings.notifyNewStudents,
        notifyRecruiterActivity: settings.notifyRecruiterActivity,
        notifyPlacements: settings.notifyPlacements,
        showInDirectory: settings.showInDirectory,
        allowStudentDiscovery: settings.allowStudentDiscovery,
      },
    })
  } catch (error) {
    console.error('Error fetching techpark settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/dashboard/techpark/settings
 * Create or update (upsert) TechParkSettings
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'TECHPARK' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userId = session.user.id
    const body = await req.json()

    const {
      parkName,
      parkType,
      description,
      website,
      email,
      phone,
      address,
      city,
      region,
      logo,
      primaryColor,
      accentColor,
      memberCompanyCount,
      focusAreas,
      foundedYear,
      notifyNewStudents,
      notifyRecruiterActivity,
      notifyPlacements,
      showInDirectory,
      allowStudentDiscovery,
    } = body

    const data: Record<string, any> = {
      parkName: parkName ?? undefined,
      description: description ?? undefined,
      website: website ?? undefined,
      email: email ?? undefined,
      phone: phone ?? undefined,
      address: address ?? undefined,
      city: city ?? undefined,
      region: region ?? undefined,
      logo: logo ?? undefined,
      primaryColor: primaryColor ?? undefined,
      accentColor: accentColor ?? undefined,
      memberCompanyCount: memberCompanyCount ?? undefined,
      focusAreas: focusAreas ?? undefined,
      foundedYear: foundedYear ?? undefined,
      notifyNewStudents: notifyNewStudents ?? undefined,
      notifyRecruiterActivity: notifyRecruiterActivity ?? undefined,
      notifyPlacements: notifyPlacements ?? undefined,
      showInDirectory: showInDirectory ?? undefined,
      allowStudentDiscovery: allowStudentDiscovery ?? undefined,
    }
    if (parkType !== undefined && ['PRIVATE', 'PUBLIC', 'MIXED'].includes(parkType)) {
      data.parkType = parkType
    }

    const settings = await prisma.techParkSettings.upsert({
      where: { userId },
      create: {
        userId,
        ...data,
      },
      update: data,
    })

    return NextResponse.json({
      settings: {
        parkName: settings.parkName || '',
        parkType: settings.parkType || 'PRIVATE',
        description: settings.description || '',
        website: settings.website || '',
        email: settings.email || '',
        phone: settings.phone || '',
        address: settings.address || '',
        city: settings.city || '',
        region: settings.region || '',
        logo: settings.logo || '',
        primaryColor: settings.primaryColor || '',
        accentColor: settings.accentColor || '',
        memberCompanyCount: settings.memberCompanyCount || 0,
        focusAreas: settings.focusAreas || [],
        foundedYear: settings.foundedYear || null,
        notifyNewStudents: settings.notifyNewStudents,
        notifyRecruiterActivity: settings.notifyRecruiterActivity,
        notifyPlacements: settings.notifyPlacements,
        showInDirectory: settings.showInDirectory,
        allowStudentDiscovery: settings.allowStudentDiscovery,
      },
    })
  } catch (error) {
    console.error('Error updating techpark settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
