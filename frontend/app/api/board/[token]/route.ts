import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * GET /api/board/[token]
 * Public endpoint — no auth required.
 * Validates token, checks expiry, increments accessCount, returns board data.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params

    const link = await prisma.boardShareLink.findUnique({
      where: { token },
    })

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    if (link.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Link expired' }, { status: 404 })
    }

    // Increment access count
    await prisma.boardShareLink.update({
      where: { id: link.id },
      data: {
        accessCount: { increment: 1 },
        lastAccessedAt: new Date(),
      },
    })

    // Fetch the university user
    const user = await prisma.user.findUnique({
      where: { id: link.universityId },
    })

    if (!user) {
      return NextResponse.json({ error: 'University not found' }, { status: 404 })
    }

    const universityName = user.company || ''

    // Fetch students
    const allStudents = await prisma.user.findMany({
      where: { university: universityName, role: 'STUDENT' },
      select: { id: true },
    })
    const studentIds = allStudents.map((s) => s.id)

    // Aggregate data (same logic as authenticated board)
    if (studentIds.length === 0) {
      return NextResponse.json({
        universityName,
        placementStats: { totalStudents: 0, confirmedHired: 0, placementRate: 0 },
        skillsGapSummary: [],
        topCompanies: [],
        activationRate: 0,
      })
    }

    // Placement stats
    const confirmedPlacements = await prisma.placement.findMany({
      where: { studentId: { in: studentIds }, status: 'CONFIRMED' },
      select: { companyName: true },
    })

    const confirmedHired = confirmedPlacements.length
    const placementRate =
      studentIds.length > 0 ? Math.round((confirmedHired / studentIds.length) * 100) : 0

    // Top companies
    const companyMap = new Map<string, number>()
    for (let i = 0; i < confirmedPlacements.length; i++) {
      const company = confirmedPlacements[i].companyName
      companyMap.set(company, (companyMap.get(company) || 0) + 1)
    }
    const topCompanies = Array.from(companyMap.entries())
      .map(([company, hires]) => ({ company, hires }))
      .sort((a, b) => b.hires - a.hires)
      .slice(0, 10)

    // Skills gap summary
    let skillsGapSummary: Array<{ skill: string; gap: number }> = []
    try {
      const universitySettings = await prisma.universitySettings.findFirst({
        where: { name: universityName },
        select: { id: true },
      })

      if (universitySettings) {
        const report = await prisma.skillGapReport.findFirst({
          where: {
            universitySettingsId: universitySettings.id,
            expiresAt: { gt: new Date() },
          },
          orderBy: { generatedAt: 'desc' },
        })

        if (report && report.gaps) {
          const gaps = report.gaps as Array<{ skill: string; gap: number }>
          skillsGapSummary = Array.isArray(gaps) ? gaps.slice(0, 8) : []
        }
      }
    } catch {
      // not critical
    }

    // Activation rate
    let activationRate = 0
    try {
      const activated = await prisma.user.findMany({
        where: {
          id: { in: studentIds },
          OR: [
            { skills: { isEmpty: false } },
            { projects: { some: {} } },
          ],
        },
        select: { id: true },
      })
      activationRate =
        studentIds.length > 0 ? Math.round((activated.length / studentIds.length) * 100) : 0
    } catch {
      activationRate = 0
    }

    return NextResponse.json({
      universityName,
      placementStats: {
        totalStudents: studentIds.length,
        confirmedHired,
        placementRate,
      },
      skillsGapSummary,
      topCompanies,
      activationRate,
    })
  } catch (err: any) {
    console.error('[Public Board GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
