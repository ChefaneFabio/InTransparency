import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { getUserScope, audit } from '@/lib/rbac/institution-scope'
import { checkPremium } from '@/lib/rbac/plan-check'

/**
 * POST /api/leads/[id]/transition
 * Body: { toStageId, note? }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params

    const scope = await getUserScope(session.user.id)
    if (!scope) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const lead = await prisma.companyLead.findUnique({ where: { id } })
    if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (!scope.isPlatformAdmin && !scope.staffInstitutionIds.includes(lead.institutionId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json().catch(() => ({}))
    const { toStageId, note } = body
    if (!toStageId) return NextResponse.json({ error: 'toStageId required' }, { status: 400 })

    const targetStage = await prisma.pipelineStage.findUnique({ where: { id: toStageId } })
    if (!targetStage || targetStage.institutionId !== lead.institutionId) {
      return NextResponse.json({ error: 'Stage not in this institution' }, { status: 400 })
    }

    if (!scope.isPlatformAdmin) {
      const gate = await checkPremium(lead.institutionId, 'lead.stage_change')
      if (gate) return gate
    }

    const fromStageId = lead.currentStageId

    const [updated, transition] = await prisma.$transaction([
      prisma.companyLead.update({
        where: { id },
        data: {
          currentStageId: toStageId,
          stageEnteredAt: new Date(),
        },
      }),
      prisma.stageTransition.create({
        data: {
          leadId: id,
          fromStageId,
          toStageId,
          staffId: session.user.id,
          note: note?.trim() || null,
        },
      }),
    ])

    await audit({
      actorId: session.user.id,
      actorRole: 'INSTITUTION_STAFF',
      action: 'lead.stage_change',
      entityType: 'CompanyLead',
      entityId: id,
      payload: { fromStageId, toStageId, note: note ?? null },
      institutionId: lead.institutionId,
    })

    return NextResponse.json({ lead: updated, transition })
  } catch (error) {
    console.error('Lead transition error:', error)
    return NextResponse.json({ error: 'Failed to transition' }, { status: 500 })
  }
}
