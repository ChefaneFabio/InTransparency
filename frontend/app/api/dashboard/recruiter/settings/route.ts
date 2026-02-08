import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/recruiter/settings
 * Load RecruiterSettings for current user. If none exists, return defaults.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userId = session.user.id

    const settings = await prisma.recruiterSettings.findUnique({
      where: { userId },
    })

    if (!settings) {
      // Return defaults if no settings exist yet
      // Pull company name from user profile as default
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { company: true },
      })

      return NextResponse.json({
        settings: {
          companyName: user?.company || '',
          companyWebsite: '',
          companyIndustry: '',
          companySize: '',
          companyLocation: '',
          companyDescription: '',
          notifyNewApplications: true,
          notifyMessages: true,
          notifySearchAlerts: true,
        },
      })
    }

    return NextResponse.json({
      settings: {
        companyName: settings.companyName || '',
        companyWebsite: settings.companyWebsite || '',
        companyIndustry: settings.companyIndustry || '',
        companySize: settings.companySize || '',
        companyLocation: settings.companyLocation || '',
        companyDescription: settings.companyDescription || '',
        notifyNewApplications: settings.notifyNewApplications,
        notifyMessages: settings.notifyMessages,
        notifySearchAlerts: settings.notifySearchAlerts,
      },
    })
  } catch (error) {
    console.error('Error fetching recruiter settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/dashboard/recruiter/settings
 * Create or update (upsert) RecruiterSettings
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userId = session.user.id
    const body = await req.json()

    const {
      companyName,
      companyWebsite,
      companyIndustry,
      companySize,
      companyLocation,
      companyDescription,
      notifyNewApplications,
      notifyMessages,
      notifySearchAlerts,
    } = body

    const data = {
      companyName: companyName ?? undefined,
      companyWebsite: companyWebsite ?? undefined,
      companyIndustry: companyIndustry ?? undefined,
      companySize: companySize ?? undefined,
      companyLocation: companyLocation ?? undefined,
      companyDescription: companyDescription ?? undefined,
      notifyNewApplications: notifyNewApplications ?? undefined,
      notifyMessages: notifyMessages ?? undefined,
      notifySearchAlerts: notifySearchAlerts ?? undefined,
    }

    const settings = await prisma.recruiterSettings.upsert({
      where: { userId },
      create: {
        userId,
        ...data,
      },
      update: data,
    })

    return NextResponse.json({
      settings: {
        companyName: settings.companyName || '',
        companyWebsite: settings.companyWebsite || '',
        companyIndustry: settings.companyIndustry || '',
        companySize: settings.companySize || '',
        companyLocation: settings.companyLocation || '',
        companyDescription: settings.companyDescription || '',
        notifyNewApplications: settings.notifyNewApplications,
        notifyMessages: settings.notifyMessages,
        notifySearchAlerts: settings.notifySearchAlerts,
      },
    })
  } catch (error) {
    console.error('Error updating recruiter settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
