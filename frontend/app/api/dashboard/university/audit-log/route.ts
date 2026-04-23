import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { getUserScope } from '@/lib/rbac/institution-scope'
import { checkPremium } from '@/lib/rbac/plan-check'

/**
 * GET /api/dashboard/university/audit-log
 *
 * Returns the audit trail for the caller's institution. This is the
 * reproducible evidence we sell to universities worried about AI Act
 * obligations (Art. 22 right to explanation, Art. 86 right to review).
 *
 * Filters (all optional, query params):
 *   action     — exact action string (e.g. "placement.stage_change")
 *   actorId    — filter to a specific staff / recruiter
 *   entityType — Placement | MediationMessage | CompanyLead | Job | AssistantQuery
 *   entityId   — lock to a specific record (e.g. one placement id)
 *   since      — ISO date
 *   limit      — default 100, max 500
 *
 * PREMIUM-gated. Reads are blocked on CORE so staff can't browse audit
 * trails without upgrading — the log itself is the product value.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const scope = await getUserScope(session.user.id)
    if (!scope || scope.staffInstitutionIds.length === 0) {
      return NextResponse.json(
        { error: 'Institution staff only' },
        { status: 403 }
      )
    }

    const institutionId = scope.staffInstitutionIds[0]

    if (!scope.isPlatformAdmin) {
      const gate = await checkPremium(institutionId, 'assistant.query')
      if (gate) return gate
    }

    const { searchParams } = new URL(req.url)
    const where: any = { institutionId }

    const action = searchParams.get('action')
    if (action) where.action = action

    const actorId = searchParams.get('actorId')
    if (actorId) where.actorId = actorId

    const entityType = searchParams.get('entityType')
    if (entityType) where.entityType = entityType

    const entityId = searchParams.get('entityId')
    if (entityId) where.entityId = entityId

    const since = searchParams.get('since')
    if (since) {
      const d = new Date(since)
      if (!isNaN(d.getTime())) where.createdAt = { gte: d }
    }

    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 500)

    const [events, actionBreakdown, total] = await Promise.all([
      prisma.auditEvent.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      prisma.auditEvent.groupBy({
        by: ['action'],
        where: { institutionId },
        _count: { _all: true },
        orderBy: { _count: { action: 'desc' } },
        take: 15,
      }),
      prisma.auditEvent.count({ where: { institutionId } }),
    ])

    // Enrich with actor names (batch-resolve)
    const actorIds = Array.from(
      new Set(events.map(e => e.actorId).filter((x): x is string => !!x))
    )
    const actors = actorIds.length
      ? await prisma.user.findMany({
          where: { id: { in: actorIds } },
          select: { id: true, firstName: true, lastName: true, role: true, email: true },
        })
      : []
    const actorById = new Map(actors.map(a => [a.id, a]))

    const enriched = events.map(e => ({
      id: e.id,
      action: e.action,
      entityType: e.entityType,
      entityId: e.entityId,
      payload: e.payload,
      createdAt: e.createdAt,
      actor: e.actorId
        ? {
            id: e.actorId,
            name: actorById.get(e.actorId)
              ? `${actorById.get(e.actorId)!.firstName ?? ''} ${actorById.get(e.actorId)!.lastName ?? ''}`.trim() || actorById.get(e.actorId)!.email
              : 'Sconosciuto',
            role: e.actorRole || actorById.get(e.actorId)?.role || null,
          }
        : null,
    }))

    return NextResponse.json({
      events: enriched,
      totalForInstitution: total,
      actionBreakdown: actionBreakdown.map(a => ({
        action: a.action,
        count: a._count._all,
      })),
    })
  } catch (error: any) {
    console.error('Audit log fetch error:', error)
    return NextResponse.json({ error: 'Failed to load audit log' }, { status: 500 })
  }
}
