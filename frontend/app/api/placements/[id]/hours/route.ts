import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { checkPlacementAccess, audit } from '@/lib/rbac/institution-scope'

/**
 * POST /api/placements/[id]/hours
 * Body: { periodStart, periodEnd, hours, notes?, source?: 'manual' | 'tutor-confirm' }
 *
 * Student logs, tutor confirms. Each log is immutable; corrections create
 * a new log with negative hours if needed. Sums are recomputed on the
 * placement record.
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
    const { periodStart, periodEnd, hours, notes, source } = body

    if (!periodStart || !periodEnd || typeof hours !== 'number') {
      return NextResponse.json({ error: 'periodStart, periodEnd, hours required' }, { status: 400 })
    }
    if (hours < 0 || hours > 168) {
      return NextResponse.json({ error: 'hours must be 0..168' }, { status: 400 })
    }

    const isTutor = access.role === 'COMPANY_TUTOR' || access.role === 'ACADEMIC_TUTOR'
    const log = await prisma.placementHoursLog.create({
      data: {
        placementId: id,
        loggedByUserId: session.user.id,
        loggedByRole: access.role || 'UNKNOWN',
        periodStart: new Date(periodStart),
        periodEnd: new Date(periodEnd),
        hours,
        source: source || 'manual',
        confirmedByTutor: isTutor,
        notes: notes?.trim() || null,
      },
    })

    // Recompute sums and update placement
    const agg = await prisma.placementHoursLog.aggregate({
      where: { placementId: id },
      _sum: { hours: true },
    })
    const total = agg._sum.hours || 0
    const p = await prisma.placement.update({
      where: { id },
      data: {
        completedHours: total,
        lastHoursLoggedAt: new Date(),
      },
      select: { institutionId: true, plannedHours: true, completedHours: true },
    })

    await audit({
      actorId: session.user.id,
      actorRole: access.role || 'UNKNOWN',
      action: 'placement.hours.log',
      entityType: 'PlacementHoursLog',
      entityId: log.id,
      payload: { placementId: id, hours, periodStart, periodEnd, newTotal: total },
      institutionId: p.institutionId || undefined,
    })

    return NextResponse.json({
      log,
      totals: { completedHours: p.completedHours, plannedHours: p.plannedHours },
    }, { status: 201 })
  } catch (error) {
    console.error('Log hours error:', error)
    return NextResponse.json({ error: 'Failed to log hours' }, { status: 500 })
  }
}
