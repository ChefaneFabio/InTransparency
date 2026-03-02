import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { runAIAnalysis, buildProjectData } from '@/lib/run-ai-analysis'

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

    // Trigger analysis asynchronously
    runAIAnalysis(project.id, buildProjectData(project))
      .catch(err => console.error('AI analysis failed:', err))

    return NextResponse.json({
      success: true,
      message: 'AI analysis has been queued. Results will appear shortly.'
    })

  } catch (error) {
    console.error('Error triggering analysis:', error)
    return NextResponse.json(
      { error: 'Failed to trigger analysis' },
      { status: 500 }
    )
  }
}
