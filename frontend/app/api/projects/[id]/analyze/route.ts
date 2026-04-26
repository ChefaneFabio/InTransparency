import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { runAIAnalysis, buildProjectData } from '@/lib/run-ai-analysis'
import { isStudentPremium } from '@/lib/entitlements'

// runAIAnalysis is fired-and-forgotten asynchronously, so the route itself
// returns quickly. Still set a generous duration so the gate + initial
// validation never get cut, and so any synchronous quota check has headroom.
export const maxDuration = 30

// Per-project AI analysis cap on Free tier. Marketing copy ("3 AI project
// analyses per project") becomes a real gate here. Premium = unlimited.
const FREE_AI_ANALYSIS_LIMIT = 3

// POST /api/projects/[id]/analyze - Trigger (re-)analysis for a project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const project = await prisma.project.findUnique({
      where: { id },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (project.userId !== userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Free-tier quota gate. Premium (personal sub or institution-sponsored)
    // bypasses. Returns a structured 402 the UI can react to.
    const premium = await isStudentPremium(userId)
    if (!premium && project.aiAnalysisCount >= FREE_AI_ANALYSIS_LIMIT) {
      return NextResponse.json(
        {
          error: `You've used all ${FREE_AI_ANALYSIS_LIMIT} free AI analyses on this project. Upgrade to Student Premium for unlimited analyses.`,
          code: 'AI_ANALYSIS_QUOTA_EXHAUSTED',
          projectId: project.id,
          analysisCount: project.aiAnalysisCount,
          limit: FREE_AI_ANALYSIS_LIMIT,
          upgradeUrl: '/dashboard/student/upgrade',
        },
        { status: 402 }
      )
    }

    // Trigger analysis asynchronously
    runAIAnalysis(project.id, buildProjectData(project))
      .catch(err => console.error('AI analysis failed:', err))

    return NextResponse.json({
      success: true,
      message: 'AI analysis has been queued. Results will appear shortly.',
      analysisCount: project.aiAnalysisCount + 1,
      limit: premium ? null : FREE_AI_ANALYSIS_LIMIT,
    })

  } catch (error) {
    console.error('Error triggering analysis:', error)
    return NextResponse.json(
      { error: 'Failed to trigger analysis' },
      { status: 500 }
    )
  }
}
