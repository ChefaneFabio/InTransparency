import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { checkPlacementAccess } from '@/lib/rbac/institution-scope'

export const maxDuration = 15

export type PendingSeverity = 'overdue' | 'upcoming' | 'info'

export interface PendingAction {
  key: string
  severity: PendingSeverity
  owner: 'student' | 'company_tutor' | 'academic_tutor' | 'staff'
  label: string
  detail?: string
  dueAt?: string
  actionHref?: string
  actionLabel?: string
}

/**
 * GET /api/placements/[id]/pending
 * Returns a structured list of what's pending on this placement, from the
 * caller's point of view. Drives the "Pending" card on the student dashboard
 * and the reminder engine on the institution side.
 *
 * Checks (in priority order):
 *  1. Overdue PlacementDeadline rows
 *  2. Missing weekly hours log (nothing in the last 7 days on an active stage)
 *  3. Missing mid-term evaluation (past 50% of duration, no MID evaluation)
 *  4. Missing final evaluation (past end date, no FINAL evaluation)
 *  5. Upcoming deadlines in the next 14 days
 *  6. Missing student self-eval (stage ended, student has no self-rating)
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params

    const access = await checkPlacementAccess(session.user.id, id)
    if (!access.canView) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const placement = await prisma.placement.findUnique({
      where: { id },
      include: {
        currentStage: true,
        evaluations: { select: { kind: true, submittedAt: true } },
        deadlines: { orderBy: { dueAt: 'asc' } },
        companyTutor: { select: { firstName: true, lastName: true } },
      },
    })
    if (!placement) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const now = new Date()
    const actions: PendingAction[] = []

    const startMs = placement.startDate.getTime()
    const endMs = placement.endDate?.getTime() ?? null
    const totalDurationMs = endMs ? endMs - startMs : null
    const elapsedMs = Math.max(0, now.getTime() - startMs)
    const daysRemaining = endMs
      ? Math.max(0, Math.ceil((endMs - now.getTime()) / 86_400_000))
      : null
    const pctComplete = totalDurationMs
      ? Math.min(100, Math.round((elapsedMs / totalDurationMs) * 100))
      : null
    const weekNumber = Math.max(1, Math.ceil(elapsedMs / (7 * 86_400_000)))

    const isActive =
      placement.status === 'ACTIVE' ||
      (placement.currentStage &&
        ['MATCHED', 'CONVENTION_SIGNED', 'IN_PROGRESS', 'MID_EVALUATION'].includes(
          placement.currentStage.type
        ))
    const hasEnded = endMs !== null && endMs < now.getTime()

    // 1. Overdue deadlines
    for (const d of placement.deadlines) {
      if (d.completedAt) continue
      if (d.dueAt.getTime() < now.getTime()) {
        actions.push({
          key: `overdue-deadline-${d.id}`,
          severity: 'overdue',
          owner: 'student',
          label: d.label,
          detail: `Overdue by ${Math.ceil(
            (now.getTime() - d.dueAt.getTime()) / 86_400_000
          )} days`,
          dueAt: d.dueAt.toISOString(),
        })
      }
    }

    // 2. Missing weekly hours (active only)
    if (isActive) {
      const lastLog = placement.lastHoursLoggedAt
      const daysSinceLog = lastLog
        ? Math.floor((now.getTime() - lastLog.getTime()) / 86_400_000)
        : Math.floor(elapsedMs / 86_400_000)
      if (daysSinceLog >= 7) {
        actions.push({
          key: 'hours-missing',
          severity: daysSinceLog > 14 ? 'overdue' : 'upcoming',
          owner: 'student',
          label: 'Log hours for this week',
          detail: lastLog
            ? `Last log was ${daysSinceLog} days ago`
            : 'No hours logged yet for this stage',
          actionHref: `/dashboard/student/tirocinio#log-hours`,
          actionLabel: 'Log hours',
        })
      }
    }

    // 3. Missing mid-term evaluation (only if we're past halfway)
    const hasMidEval = placement.evaluations.some(e => e.kind === 'MID')
    if (pctComplete !== null && pctComplete >= 50 && !hasMidEval && !hasEnded) {
      actions.push({
        key: 'mid-eval-missing',
        severity: pctComplete >= 70 ? 'overdue' : 'upcoming',
        owner: 'company_tutor',
        label: 'Mid-term evaluation from your company tutor',
        detail: placement.companyTutor
          ? `Waiting on ${placement.companyTutor.firstName ?? ''} ${placement.companyTutor.lastName ?? ''}`.trim()
          : 'Ask your company tutor to complete the mid-term form',
      })
    }

    // 4. Missing final evaluation (only after end date)
    const hasFinalEval = placement.evaluations.some(e => e.kind === 'FINAL')
    if (hasEnded && !hasFinalEval) {
      actions.push({
        key: 'final-eval-missing',
        severity: 'overdue',
        owner: 'company_tutor',
        label: 'Final evaluation from your company tutor',
        detail: 'Your stage has ended — the final evaluation unlocks your transcript entry',
      })
    }

    // 5. Upcoming deadlines (next 14 days, not yet overdue)
    for (const d of placement.deadlines) {
      if (d.completedAt) continue
      const delta = d.dueAt.getTime() - now.getTime()
      if (delta > 0 && delta <= 14 * 86_400_000) {
        actions.push({
          key: `upcoming-deadline-${d.id}`,
          severity: 'upcoming',
          owner: 'student',
          label: d.label,
          detail: `Due in ${Math.ceil(delta / 86_400_000)} days`,
          dueAt: d.dueAt.toISOString(),
        })
      }
    }

    // 6. Student self-assessment after end
    if (hasEnded && placement.studentId === session.user.id) {
      const stageExp = await prisma.stageExperience.findFirst({
        where: {
          studentId: placement.studentId,
          companyName: placement.companyName,
        },
        select: { studentRating: true, studentDescription: true },
      })
      const selfDone =
        stageExp?.studentRating !== null && stageExp?.studentRating !== undefined
      if (!selfDone) {
        actions.push({
          key: 'self-eval-missing',
          severity: 'upcoming',
          owner: 'student',
          label: 'Self-assessment',
          detail: 'Share what you built and learned — recruiters read this on your profile',
          actionHref: `/dashboard/student/tirocinio#self-eval`,
          actionLabel: 'Start',
        })
      }
    }

    return NextResponse.json({
      placementId: id,
      daysRemaining,
      pctComplete,
      weekNumber,
      status: placement.status,
      stage: placement.currentStage
        ? { name: placement.currentStage.name, type: placement.currentStage.type }
        : null,
      actions,
      summary: {
        overdue: actions.filter(a => a.severity === 'overdue').length,
        upcoming: actions.filter(a => a.severity === 'upcoming').length,
        total: actions.length,
      },
    })
  } catch (error) {
    console.error('GET /api/placements/[id]/pending error:', error)
    return NextResponse.json({ error: 'Failed to load pending actions' }, { status: 500 })
  }
}
