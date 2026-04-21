import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { getUserScope } from '@/lib/rbac/institution-scope'

/**
 * GET /api/institutions/[id]/pipeline
 *   Returns stages + leads grouped by stage for the kanban board.
 *   Staff-scoped to this institution.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id: institutionId } = await params

    const scope = await getUserScope(session.user.id)
    if (!scope || (!scope.isPlatformAdmin && !scope.staffInstitutionIds.includes(institutionId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [stages, leads] = await Promise.all([
      prisma.pipelineStage.findMany({
        where: { institutionId, archived: false },
        orderBy: { order: 'asc' },
      }),
      prisma.companyLead.findMany({
        where: { institutionId },
        include: {
          ownerStaff: { select: { id: true, firstName: true, lastName: true } },
          currentStage: { select: { id: true, name: true, order: true, type: true } },
          _count: { select: { activities: true } },
        },
        orderBy: { updatedAt: 'desc' },
      }),
    ])

    const now = Date.now()
    const leadsByStage: Record<string, any[]> = {}
    for (const lead of leads) {
      const key = lead.currentStageId
      if (!leadsByStage[key]) leadsByStage[key] = []
      leadsByStage[key].push({
        id: lead.id,
        companyName: lead.externalName || 'Azienda senza nome',
        domain: lead.externalDomain,
        sector: lead.sector,
        sizeRange: lead.sizeRange,
        region: lead.region,
        city: lead.city,
        source: lead.source,
        owner: lead.ownerStaff
          ? { id: lead.ownerStaff.id, name: [lead.ownerStaff.firstName, lead.ownerStaff.lastName].filter(Boolean).join(' ') }
          : null,
        stageEnteredAt: lead.stageEnteredAt.toISOString(),
        daysInStage: Math.max(0, Math.round((now - lead.stageEnteredAt.getTime()) / 86_400_000)),
        nextActionAt: lead.nextActionAt?.toISOString() || null,
        primaryContact: lead.primaryContactName ? {
          name: lead.primaryContactName,
          email: lead.primaryContactEmail,
          phone: lead.primaryContactPhone,
        } : null,
        activitiesCount: lead._count.activities,
      })
    }

    const shapedStages = stages.map(s => ({
      id: s.id,
      name: s.name,
      order: s.order,
      type: s.type,
      count: (leadsByStage[s.id] || []).length,
      leads: leadsByStage[s.id] || [],
    }))

    const summary = {
      totalLeads: leads.length,
      signed: leads.filter(l => ['SIGNED', 'ACTIVE', 'RENEWAL'].includes(l.currentStage.type)).length,
      lost: leads.filter(l => l.currentStage.type === 'LOST').length,
      atRisk: leads.filter(l => l.nextActionAt && l.nextActionAt < new Date()).length,
    }

    return NextResponse.json({ stages: shapedStages, summary })
  } catch (error) {
    console.error('Pipeline GET error:', error)
    return NextResponse.json({ error: 'Failed to load pipeline' }, { status: 500 })
  }
}
