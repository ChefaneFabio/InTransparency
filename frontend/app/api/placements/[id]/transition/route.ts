import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { checkPlacementAccess, audit } from '@/lib/rbac/institution-scope'

/**
 * POST /api/placements/[id]/transition
 * Body: { toStageId: string, note?: string }
 *
 * Staff or institution admin may move a placement between stages. When
 * the stage matches IN_PROGRESS and no startDate anchor exists, anchor now.
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
    if (!access.canEdit) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json().catch(() => ({}))
    const { toStageId, note } = body
    if (!toStageId) return NextResponse.json({ error: 'toStageId is required' }, { status: 400 })

    const placement = await prisma.placement.findUnique({ where: { id }, select: { institutionId: true, currentStageId: true } })
    if (!placement) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const stage = await prisma.placementStage.findUnique({ where: { id: toStageId } })
    if (!stage || stage.institutionId !== placement.institutionId) {
      return NextResponse.json({ error: 'Stage not in this institution' }, { status: 400 })
    }

    const updated = await prisma.placement.update({
      where: { id },
      data: {
        currentStageId: toStageId,
        stageEnteredAt: new Date(),
        outcomeNotes: note ? `${stage.name} — ${note}` : undefined,
      },
    })

    await audit({
      actorId: session.user.id,
      actorRole: access.role || 'UNKNOWN',
      action: 'placement.stage_change',
      entityType: 'Placement',
      entityId: id,
      payload: { fromStageId: placement.currentStageId, toStageId, note: note ?? null },
      institutionId: placement.institutionId || undefined,
    })

    return NextResponse.json({ placement: updated })
  } catch (error) {
    console.error('Transition placement error:', error)
    return NextResponse.json({ error: 'Failed to transition' }, { status: 500 })
  }
}
