import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/university/placements/[id]/timeline
 *
 * Merged chronological timeline for a single placement: stage transitions
 * (from AuditEvent), evaluations, hours-log entries, and deadlines —
 * everything staff need to see "what happened, when, and who did it."
 *
 * Scope: university/admin role + placement must belong to a student of
 * the staff member's university (legacy `user.company` matching, same as
 * sibling routes).
 */

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.role !== 'UNIVERSITY' && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id: placementId } = await params

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { company: true, university: true },
  })
  const universityName = user?.company || user?.university || ''
  if (!universityName) return NextResponse.json({ error: 'University not configured' }, { status: 400 })

  const placement = await prisma.placement.findFirst({
    where: { id: placementId, universityName },
    include: {
      student: {
        select: { id: true, firstName: true, lastName: true, email: true, degree: true },
      },
      currentStage: { select: { id: true, name: true, type: true, order: true } },
      academicTutor: { select: { firstName: true, lastName: true, email: true } },
      companyTutor: { select: { firstName: true, lastName: true, email: true } },
    },
  })
  if (!placement) return NextResponse.json({ error: 'Placement not found' }, { status: 404 })

  const [auditEvents, evaluations, hoursLogs, deadlines, allStages] = await Promise.all([
    prisma.auditEvent.findMany({
      where: { entityType: 'Placement', entityId: placementId },
      orderBy: { createdAt: 'asc' },
      take: 500,
    }),
    prisma.placementEvaluation.findMany({
      where: { placementId },
      orderBy: { submittedAt: 'asc' },
      include: {
        submittedBy: { select: { firstName: true, lastName: true, email: true } },
      },
    }),
    prisma.placementHoursLog.findMany({
      where: { placementId },
      orderBy: { createdAt: 'asc' },
      include: {
        loggedBy: { select: { firstName: true, lastName: true, email: true } },
      },
    }),
    prisma.placementDeadline.findMany({
      where: { placementId },
      orderBy: { dueAt: 'asc' },
    }),
    placement.institutionId
      ? prisma.placementStage.findMany({
          where: { institutionId: placement.institutionId, archived: false },
          orderBy: { order: 'asc' },
          select: { id: true, name: true, order: true, type: true },
        })
      : Promise.resolve([]),
  ])

  // Build a unified timeline view.
  type TimelineItem = {
    at: string
    kind: 'CREATED' | 'STAGE' | 'EVALUATION' | 'HOURS' | 'DEADLINE' | 'AUDIT'
    title: string
    detail?: string
    actor?: string
  }
  const items: TimelineItem[] = []

  items.push({
    at: placement.createdAt.toISOString(),
    kind: 'CREATED',
    title: 'Placement creato',
    detail: `${placement.companyName} — ${placement.jobTitle}`,
  })

  for (const e of auditEvents) {
    if (e.action === 'placement.stage_change') {
      const payload = (e.payload ?? {}) as { fromStageId?: string; toStageId?: string; note?: string | null }
      items.push({
        at: e.createdAt.toISOString(),
        kind: 'STAGE',
        title: 'Cambio fase',
        detail: payload.note ?? undefined,
        actor: e.actorRole ?? undefined,
      })
    } else {
      items.push({
        at: e.createdAt.toISOString(),
        kind: 'AUDIT',
        title: e.action,
        actor: e.actorRole ?? undefined,
      })
    }
  }

  for (const ev of evaluations) {
    const name = [ev.submittedBy?.firstName, ev.submittedBy?.lastName].filter(Boolean).join(' ')
    items.push({
      at: ev.submittedAt.toISOString(),
      kind: 'EVALUATION',
      title: `Valutazione (${ev.kind})`,
      detail: ev.comments ?? undefined,
      actor: name || ev.submitterRole,
    })
  }

  for (const log of hoursLogs) {
    const name = [log.loggedBy?.firstName, log.loggedBy?.lastName].filter(Boolean).join(' ')
    items.push({
      at: log.createdAt.toISOString(),
      kind: 'HOURS',
      title: `${log.hours}h registrate`,
      detail: log.notes ?? undefined,
      actor: name || log.loggedByRole,
    })
  }

  for (const d of deadlines) {
    items.push({
      at: (d.completedAt ?? d.dueAt).toISOString(),
      kind: 'DEADLINE',
      title: d.completedAt ? `Scadenza completata: ${d.label}` : `Scadenza: ${d.label}`,
      detail: d.completedAt ? undefined : `Da completare entro ${d.dueAt.toLocaleDateString('it-IT')}`,
    })
  }

  items.sort((a, b) => a.at.localeCompare(b.at))

  return NextResponse.json({
    placement: {
      id: placement.id,
      companyName: placement.companyName,
      jobTitle: placement.jobTitle,
      status: placement.status,
      offerType: placement.offerType,
      startDate: placement.startDate,
      endDate: placement.endDate,
      plannedHours: placement.plannedHours,
      completedHours: placement.completedHours,
      lastHoursLoggedAt: placement.lastHoursLoggedAt,
      currentStage: placement.currentStage,
      stageEnteredAt: placement.stageEnteredAt,
      student: placement.student,
      academicTutor: placement.academicTutor,
      companyTutor: placement.companyTutor,
    },
    timeline: items,
    stages: allStages,
  })
}
