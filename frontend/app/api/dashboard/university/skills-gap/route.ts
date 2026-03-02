import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { computeSkillsGap } from '@/lib/skills-gap-analysis'

/**
 * GET /api/dashboard/university/skills-gap
 * Returns skills gap analysis for the university.
 * Uses SkillGapReport cache with 24h TTL.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'UNIVERSITY' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const settings = await prisma.universitySettings.findUnique({
      where: { userId: session.user.id },
      select: { id: true, name: true },
    })

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { university: true },
    })

    const universityName = settings?.name || user?.university
    if (!universityName) {
      return NextResponse.json({ error: 'University not configured' }, { status: 400 })
    }

    // Check cache
    const now = new Date()
    if (settings) {
      const cached = await prisma.skillGapReport.findFirst({
        where: {
          universitySettingsId: settings.id,
          expiresAt: { gt: now },
        },
        orderBy: { generatedAt: 'desc' },
      })

      if (cached) {
        return NextResponse.json({
          gaps: cached.gaps,
          strengths: cached.strengths,
          studentSkills: cached.studentSkills,
          marketDemand: cached.marketDemand,
          studentCount: cached.studentCount,
          jobCount: cached.jobCount,
          cached: true,
          generatedAt: cached.generatedAt,
        })
      }
    }

    // Compute fresh
    const result = await computeSkillsGap(universityName)

    // Store in cache (24h TTL)
    if (settings) {
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      await prisma.skillGapReport.create({
        data: {
          universitySettingsId: settings.id,
          studentSkills: result.studentSkills as any,
          marketDemand: result.marketDemand as any,
          gaps: result.gaps as any,
          strengths: result.strengths as any,
          studentCount: result.studentCount,
          jobCount: result.jobCount,
          generatedAt: now,
          expiresAt,
        },
      })
    }

    return NextResponse.json({ ...result, cached: false, generatedAt: now })
  } catch (error) {
    console.error('Skills gap error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
