import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import {
  computeProgramGap,
  listProgramsForUniversity,
  persistMonthlySnapshot,
  getProgramTrend,
  generateCurriculumRecommendations,
} from '@/lib/skills-gap-v2'

/**
 * GET /api/dashboard/university/skills-gap-v2
 *
 * Query params:
 *   - program: degree program name (optional, null = university-wide)
 *   - withTrend: "1" to include 12-month trend snapshots
 *   - withRecs:  "1" to include AI curriculum recommendations
 *   - programs:  "1" to return available program list for the selector UI
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const universityName = user.company || user.university || ''
  if (!universityName) {
    return NextResponse.json({ error: 'University not configured' }, { status: 400 })
  }

  const { searchParams } = new URL(req.url)
  const programParam = searchParams.get('program')
  const programName = programParam && programParam !== 'ALL' ? programParam : null
  const withTrend = searchParams.get('withTrend') === '1'
  const withRecs = searchParams.get('withRecs') === '1'
  const programsOnly = searchParams.get('programs') === '1'

  if (programsOnly) {
    const programs = await listProgramsForUniversity(universityName)
    return NextResponse.json({ programs })
  }

  const report = await computeProgramGap(universityName, programName)
  const payload: any = { report }

  if (withTrend) {
    payload.trend = await getProgramTrend(universityName, programName, 12)
  }
  if (withRecs) {
    payload.recommendations = await generateCurriculumRecommendations(report)
  }

  return NextResponse.json(payload)
}

/**
 * POST /api/dashboard/university/skills-gap-v2
 * Trigger a monthly snapshot for the current month. Idempotent.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const universityName = user.company || user.university || ''
  const body = await req.json().catch(() => ({}))
  const programName = body?.program && body.program !== 'ALL' ? body.program : null

  await persistMonthlySnapshot(universityName, programName)
  return NextResponse.json({ success: true })
}
