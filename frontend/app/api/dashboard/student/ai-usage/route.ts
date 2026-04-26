import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { isStudentPremium } from '@/lib/entitlements'

const FREE_AI_ANALYSIS_LIMIT = 3

/**
 * GET /api/dashboard/student/ai-usage
 *
 * Returns the AI-analysis quota state across all of the student's projects.
 * Powers the dashboard banner that nudges Premium when any project
 * approaches or hits the per-project cap.
 *
 * Premium students always return { plan: 'PREMIUM', unlimited: true } —
 * no per-project counts surfaced because there's no friction to nudge.
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userId = session.user.id

  if (await isStudentPremium(userId)) {
    return NextResponse.json({ plan: 'PREMIUM', unlimited: true })
  }

  const projects = await prisma.project.findMany({
    where: { userId },
    select: { id: true, title: true, aiAnalysisCount: true },
    orderBy: { createdAt: 'desc' },
  })

  const projectsAtCap = projects.filter(p => p.aiAnalysisCount >= FREE_AI_ANALYSIS_LIMIT)
  const projectsNearCap = projects.filter(
    p => p.aiAnalysisCount >= 2 && p.aiAnalysisCount < FREE_AI_ANALYSIS_LIMIT
  )

  // The banner needs the most-strained project to surface contextually.
  const featured = projectsAtCap[0] ?? projectsNearCap[0] ?? null

  return NextResponse.json({
    plan: 'FREE',
    unlimited: false,
    limit: FREE_AI_ANALYSIS_LIMIT,
    totalProjects: projects.length,
    projectsAtCap: projectsAtCap.length,
    projectsNearCap: projectsNearCap.length,
    featured: featured
      ? {
          projectId: featured.id,
          title: featured.title,
          analysisCount: featured.aiAnalysisCount,
          atCap: featured.aiAnalysisCount >= FREE_AI_ANALYSIS_LIMIT,
        }
      : null,
    upgradeUrl: '/dashboard/student/upgrade',
  })
}
