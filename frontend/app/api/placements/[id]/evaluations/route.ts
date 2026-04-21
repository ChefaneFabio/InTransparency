import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { checkPlacementAccess, audit } from '@/lib/rbac/institution-scope'

/**
 * POST /api/placements/[id]/evaluations
 * Body: { kind: MID | FINAL | INCIDENT, scores?: {...}, comments?: string }
 *
 * Submitter role is derived from checkPlacementAccess. Both tutors and
 * the student may submit (student only for self-reflection). Staff can
 * submit INCIDENT reports.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params

    const access = await checkPlacementAccess(session.user.id, id)
    if (!access.canView) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json().catch(() => ({}))
    const { kind, scores, comments } = body
    if (!kind || !['MID', 'FINAL', 'INCIDENT'].includes(kind)) {
      return NextResponse.json({ error: 'Invalid kind' }, { status: 400 })
    }
    // Student cannot submit INCIDENT
    if (kind === 'INCIDENT' && access.role === 'STUDENT') {
      return NextResponse.json({ error: 'Students cannot submit incident reports' }, { status: 403 })
    }

    const evaluation = await prisma.placementEvaluation.create({
      data: {
        placementId: id,
        kind,
        submittedByUserId: session.user.id,
        submitterRole: access.role || 'UNKNOWN',
        scores: scores ?? null,
        comments: comments?.trim() || null,
      },
    })

    const p = await prisma.placement.findUnique({ where: { id }, select: { institutionId: true } })
    await audit({
      actorId: session.user.id,
      actorRole: access.role || 'UNKNOWN',
      action: 'placement.evaluation.submit',
      entityType: 'PlacementEvaluation',
      entityId: evaluation.id,
      payload: { placementId: id, kind },
      institutionId: p?.institutionId || undefined,
    })

    return NextResponse.json({ evaluation }, { status: 201 })
  } catch (error) {
    console.error('Evaluation submit error:', error)
    return NextResponse.json({ error: 'Failed to submit evaluation' }, { status: 500 })
  }
}
