import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * GET /api/university/branding?university=Politecnico+di+Milano
 * Returns university branding (colors, logo) for white-label rendering.
 * Only returns branding for INSTITUTION_ENTERPRISE universities.
 */
export async function GET(req: NextRequest) {
  try {
    const universityName = req.nextUrl.searchParams.get('university')

    if (!universityName) {
      return NextResponse.json({ branding: null })
    }

    // Find the university admin user with enterprise tier
    const universityAdmin = await prisma.user.findFirst({
      where: {
        role: 'UNIVERSITY',
        subscriptionTier: 'INSTITUTION_ENTERPRISE',
        OR: [
          { company: { contains: universityName, mode: 'insensitive' } },
          { university: { contains: universityName, mode: 'insensitive' } },
        ]
      },
      select: {
        id: true,
        universitySettings: {
          select: {
            name: true,
            shortName: true,
            logo: true,
            primaryColor: true,
            accentColor: true,
            customDomain: true,
          }
        }
      }
    })

    if (!universityAdmin?.universitySettings) {
      return NextResponse.json({ branding: null })
    }

    const settings = universityAdmin.universitySettings

    // Only return branding if at least one branding field is set
    const hasBranding = settings.primaryColor || settings.accentColor || settings.logo || settings.customDomain

    if (!hasBranding) {
      return NextResponse.json({ branding: null })
    }

    return NextResponse.json({
      branding: {
        universityName: settings.name || settings.shortName || universityName,
        logo: settings.logo,
        primaryColor: settings.primaryColor,
        accentColor: settings.accentColor,
        customDomain: settings.customDomain,
      }
    })
  } catch (error) {
    console.error('Error fetching university branding:', error)
    return NextResponse.json({ branding: null })
  }
}
