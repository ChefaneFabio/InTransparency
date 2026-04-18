import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { writeStageDeltas, type StageCompetencyRating } from '@/lib/skill-delta'

interface RouteContext {
  params: Promise<{ id: string }>
}

// POST /api/dashboard/university/stages/[id]/evaluation
// Records supervisor evaluation and triggers skill-delta writeback (P1).
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN' && user.role !== 'RECRUITER')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await context.params
    const body = await req.json()
    const {
      supervisorRating,
      supervisorCompetencies,
      supervisorStrengths,
      supervisorImprovements,
      supervisorWouldHire,
    } = body as {
      supervisorRating: number
      supervisorCompetencies: StageCompetencyRating[]
      supervisorStrengths?: string
      supervisorImprovements?: string
      supervisorWouldHire?: boolean
    }

    if (!supervisorRating || !Array.isArray(supervisorCompetencies)) {
      return NextResponse.json(
        { error: 'supervisorRating and supervisorCompetencies are required' },
        { status: 400 }
      )
    }

    // Authorization: university admins scope to their institution; recruiters must be the named supervisor
    const stage = await prisma.stageExperience.findUnique({ where: { id } })
    if (!stage) return NextResponse.json({ error: 'Stage not found' }, { status: 404 })

    if (user.role === 'UNIVERSITY' || user.role === 'ADMIN') {
      if (stage.universityName !== (user.company ?? '')) {
        return NextResponse.json({ error: 'Not your institution' }, { status: 403 })
      }
    } else if (user.role === 'RECRUITER') {
      const supervisorEmail = stage.supervisorEmail?.toLowerCase()
      if (!supervisorEmail || supervisorEmail !== user.email.toLowerCase()) {
        return NextResponse.json({ error: 'Only the named supervisor can evaluate' }, { status: 403 })
      }
    }

    // Persist the evaluation
    const updated = await prisma.stageExperience.update({
      where: { id },
      data: {
        supervisorCompleted: true,
        supervisorRating,
        supervisorCompetencies: supervisorCompetencies as any,
        supervisorStrengths: supervisorStrengths ?? null,
        supervisorImprovements: supervisorImprovements ?? null,
        supervisorWouldHire: typeof supervisorWouldHire === 'boolean' ? supervisorWouldHire : null,
        supervisorEvalDate: new Date(),
        status: 'EVALUATED',
      },
    })

    // Writeback to skill graph — this is P1 closing the loop
    const writeback = await writeStageDeltas({
      stageId: id,
      studentId: stage.studentId,
      supervisorCompetencies,
      supervisorName: stage.supervisorName,
      companyName: stage.companyName,
      overallRating: supervisorRating,
    })

    return NextResponse.json({
      success: true,
      stage: {
        id: updated.id,
        status: updated.status,
        supervisorCompleted: updated.supervisorCompleted,
        supervisorEvalDate: updated.supervisorEvalDate?.toISOString() ?? null,
      },
      skillGraph: {
        deltasCreated: writeback.deltasCreated,
        deltasSkipped: writeback.deltasSkipped,
      },
    })
  } catch (error) {
    console.error('Stage evaluation error:', error)
    return NextResponse.json({ error: 'Failed to submit evaluation' }, { status: 500 })
  }
}
