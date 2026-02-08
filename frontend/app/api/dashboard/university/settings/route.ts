import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

async function getUniversityUser(session: any) {
  if (!session?.user?.id) return null
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) return null
  return user
}

// GET /api/dashboard/university/settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const user = await getUniversityUser(session)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

    let settings = await prisma.universitySettings.findUnique({
      where: { userId: user.id },
    })

    if (!settings) {
      // Create default settings from user data
      settings = await prisma.universitySettings.create({
        data: {
          userId: user.id,
          name: user.company || '',
          shortName: '',
          email: user.email,
          city: '',
        },
      })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/dashboard/university/settings
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user = await getUniversityUser(session)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

    const body = await req.json()

    const settings = await prisma.universitySettings.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        name: body.name,
        shortName: body.shortName,
        description: body.description,
        website: body.website,
        email: body.email,
        phone: body.phone,
        address: body.address,
        city: body.city,
        region: body.region,
        logo: body.logo,
        primaryColor: body.primaryColor,
        accentColor: body.accentColor,
        customDomain: body.customDomain,
        notifyNewStudents: body.notifyNewStudents ?? true,
        notifyProjectSubmissions: body.notifyProjectSubmissions ?? true,
        notifyRecruiterActivity: body.notifyRecruiterActivity ?? true,
        notifyPlacements: body.notifyPlacements ?? true,
        showInDirectory: body.showInDirectory ?? true,
        allowStudentDiscovery: body.allowStudentDiscovery ?? true,
        shareAnalytics: body.shareAnalytics ?? false,
        requireEmailVerification: body.requireEmailVerification ?? false,
      },
      update: {
        name: body.name,
        shortName: body.shortName,
        description: body.description,
        website: body.website,
        email: body.email,
        phone: body.phone,
        address: body.address,
        city: body.city,
        region: body.region,
        logo: body.logo,
        primaryColor: body.primaryColor,
        accentColor: body.accentColor,
        customDomain: body.customDomain,
        notifyNewStudents: body.notifyNewStudents,
        notifyProjectSubmissions: body.notifyProjectSubmissions,
        notifyRecruiterActivity: body.notifyRecruiterActivity,
        notifyPlacements: body.notifyPlacements,
        showInDirectory: body.showInDirectory,
        allowStudentDiscovery: body.allowStudentDiscovery,
        shareAnalytics: body.shareAnalytics,
        requireEmailVerification: body.requireEmailVerification,
      },
    })

    // Also update the user's company name if name changed
    if (body.name && body.name !== user.company) {
      await prisma.user.update({
        where: { id: user.id },
        data: { company: body.name },
      })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
