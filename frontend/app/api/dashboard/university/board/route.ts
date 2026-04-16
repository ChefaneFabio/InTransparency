import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * Shared helper: aggregate board data for a given university user.
 */
async function aggregateBoardData(universityName: string, studentIds: string[]) {
  if (studentIds.length === 0) {
    return {
      placementStats: { totalStudents: 0, confirmedHired: 0, placementRate: 0 },
      skillsGapSummary: [],
      topCompanies: [],
      activationRate: 0,
    }
  }

  // Placement stats
  const confirmedPlacements = await prisma.placement.findMany({
    where: { studentId: { in: studentIds }, status: 'CONFIRMED' },
    select: { companyName: true },
  })

  const confirmedHired = confirmedPlacements.length
  const placementRate =
    studentIds.length > 0 ? Math.round((confirmedHired / studentIds.length) * 100) : 0

  // Top hiring companies
  const companyMap = new Map<string, number>()
  for (let i = 0; i < confirmedPlacements.length; i++) {
    const company = confirmedPlacements[i].companyName
    companyMap.set(company, (companyMap.get(company) || 0) + 1)
  }
  const topCompanies = Array.from(companyMap.entries())
    .map(([company, hires]) => ({ company, hires }))
    .sort((a, b) => b.hires - a.hires)
    .slice(0, 10)

  // Skills gap summary (from cached SkillGapReport)
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
    // Skills gap not available — not critical
  }

  // Student activation rate: students who have at least one skill or project
  let activatedCount = 0
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
    activatedCount = activated.length
  } catch {
    activatedCount = 0
  }

  const activationRate =
    studentIds.length > 0 ? Math.round((activatedCount / studentIds.length) * 100) : 0

  return {
    placementStats: {
      totalStudents: studentIds.length,
      confirmedHired,
      placementRate,
    },
    skillsGapSummary,
    topCompanies,
    activationRate,
  }
}

export { aggregateBoardData }

// GET /api/dashboard/university/board
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = user.company || ''

    const allStudents = await prisma.user.findMany({
      where: { university: universityName, role: 'STUDENT' },
      select: { id: true },
    })
    const studentIds = allStudents.map((s) => s.id)

    const boardData = await aggregateBoardData(universityName, studentIds)

    // Fetch share links
    const shareLinks = await prisma.boardShareLink.findMany({
      where: { universityId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      universityName,
      ...boardData,
      shareLinks,
    })
  } catch (err: any) {
    console.error('[Board GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/dashboard/university/board — Create a share link
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const label = body.label || null
    const daysValid = body.daysValid || 30

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + daysValid)

    const link = await prisma.boardShareLink.create({
      data: {
        universityId: session.user.id,
        label,
        expiresAt,
      },
    })

    return NextResponse.json(link, { status: 201 })
  } catch (err: any) {
    console.error('[Board POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/dashboard/university/board — Revoke a share link
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { linkId } = body

    if (!linkId) {
      return NextResponse.json({ error: 'linkId required' }, { status: 400 })
    }

    // Only allow deleting own links
    const link = await prisma.boardShareLink.findFirst({
      where: { id: linkId, universityId: session.user.id },
    })

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    await prisma.boardShareLink.delete({ where: { id: linkId } })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[Board DELETE]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
