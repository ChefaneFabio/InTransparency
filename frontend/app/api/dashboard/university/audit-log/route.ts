import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { getUserScope } from '@/lib/rbac/institution-scope'
import { getInstitutionPlan } from '@/lib/rbac/plan-check'
import { getInstitutionTier } from '@/lib/config/pricing'

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
 * Plan behavior: Free Core sees the last 30 days. Institutional Premium
 * sees the full history with no retention clamp. CSV export is a separate
 * Premium-only endpoint (see audit.export.csv gate).
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

    // Retention clamp — Free Core sees only the last `auditLogDays` days.
    // PREMIUM has -1 (unlimited) so no clamp is applied. Platform admins
    // bypass the clamp entirely.
    const plan = await getInstitutionPlan(institutionId)
    const tier = getInstitutionTier(plan)
    const retentionDays = tier.limits.auditLogDays

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

    // Resolve the effective `since` floor: max of caller-provided since and
    // the plan's retention floor (so Free Core can never reach beyond 30d).
    const sinceParam = searchParams.get('since')
    const callerSince = sinceParam ? new Date(sinceParam) : null
    const planFloor =
      retentionDays > 0 && !scope.isPlatformAdmin
        ? new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000)
        : null
    const effectiveSince =
      callerSince && !isNaN(callerSince.getTime()) && planFloor
        ? new Date(Math.max(callerSince.getTime(), planFloor.getTime()))
        : (callerSince && !isNaN(callerSince.getTime()) ? callerSince : planFloor)
    if (effectiveSince) where.createdAt = { gte: effectiveSince }

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
      // Plan envelope — lets the UI render "showing last 30 days · upgrade
      // for full history" when the institution is on Free Core.
      plan: plan ?? 'CORE',
      retentionDays: retentionDays < 0 ? null : retentionDays,
      effectiveSince: effectiveSince ? effectiveSince.toISOString() : null,
      csvExportAvailable: tier.limits.csvExports,
      upgradeUrl: tier.limits.csvExports ? null : '/pricing?for=institutions',
    })
  } catch (error: any) {
    console.error('Audit log fetch error:', error)
    return NextResponse.json({ error: 'Failed to load audit log' }, { status: 500 })
  }
}
