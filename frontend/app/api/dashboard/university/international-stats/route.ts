import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/university/international-stats
 * Returns international mobility statistics for the university dashboard.
 * Helps universities track and improve abroad placement rates.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await prisma.universitySettings.findUnique({
      where: { userId: session.user.id },
      select: { name: true },
    })

    const universityName = settings?.name || ''

    // Get students from this university
    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        university: universityName ? { contains: universityName, mode: 'insensitive' } : undefined,
      },
      select: {
        id: true,
        willingToRelocateAbroad: true,
        preferredLocations: true,
        languageProficiencies: {
          select: { language: true, motherTongue: true, speaking: true },
        },
      },
    })

    const studentIds = students.map(s => s.id)

    // Exchange enrollments
    const exchanges = await prisma.exchangeEnrollment.findMany({
      where: { studentId: { in: studentIds } },
      select: {
        hostCountry: true, programType: true, status: true,
        startDate: true, endDate: true,
      },
    })

    // Placements abroad
    const placements = await prisma.placement.findMany({
      where: { studentId: { in: studentIds } },
      select: { companyName: true, jobTitle: true },
    })

    // Recruiter interest from abroad
    const abroadViews = await prisma.profileView.count({
      where: {
        profileUserId: { in: studentIds },
        viewerRole: 'RECRUITER',
      },
    })

    // Compute stats
    const willingToGoAbroad = students.filter(s => s.willingToRelocateAbroad).length
    const abroadRate = students.length > 0 ? Math.round((willingToGoAbroad / students.length) * 100) : 0

    // Language distribution
    const langCounts = new Map<string, number>()
    for (const student of students) {
      for (const lp of student.languageProficiencies) {
        if (!lp.motherTongue) {
          langCounts.set(lp.language, (langCounts.get(lp.language) || 0) + 1)
        }
      }
    }
    const topLanguages = Array.from(langCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([language, count]) => ({ language, count, percentage: Math.round((count / Math.max(students.length, 1)) * 100) }))

    // Preferred countries
    const countryCounts = new Map<string, number>()
    for (const student of students) {
      for (const loc of student.preferredLocations) {
        countryCounts.set(loc, (countryCounts.get(loc) || 0) + 1)
      }
    }
    const topCountries = Array.from(countryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([country, count]) => ({ country, count }))

    // Exchange by country
    const exchangeByCountry = new Map<string, number>()
    for (const ex of exchanges) {
      if (ex.hostCountry) {
        exchangeByCountry.set(ex.hostCountry, (exchangeByCountry.get(ex.hostCountry) || 0) + 1)
      }
    }

    return NextResponse.json({
      summary: {
        totalStudents: students.length,
        willingToGoAbroad,
        abroadRate,
        totalExchanges: exchanges.length,
        activeExchanges: exchanges.filter(e => e.status === 'ACTIVE').length,
        totalAbroadPlacements: placements.length,
        recruiterInterest: abroadViews,
      },
      topLanguages,
      topPreferredCountries: topCountries,
      exchangesByCountry: Array.from(exchangeByCountry.entries())
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count),
      recommendations: [
        abroadRate < 30 ? 'Less than 30% of students are open to working abroad. Consider promoting Erasmus+ and international career events.' : null,
        topLanguages.length < 3 ? 'Language diversity is low. Consider offering more language courses or tandem programs.' : null,
        exchanges.length === 0 ? 'No exchange programs tracked yet. Connect with international partner institutions.' : null,
      ].filter(Boolean),
    })
  } catch (error) {
    console.error('International stats error:', error)
    return NextResponse.json({ summary: {}, topLanguages: [], recommendations: [] })
  }
}
