import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { getUserScope } from '@/lib/rbac/institution-scope'
import { isInstitutionPremium } from '@/lib/rbac/plan-check'

/**
 * GET /api/dashboard/university/workspace-actions
 *
 * Single aggregate endpoint backing the Workspace Action Center on
 * the university dashboard. Tells the staff at a glance what needs
 * their attention across the 4 modules.
 *
 * Returns per module:
 *   - pendingCount  : items that need action
 *   - overdueCount  : subset already past due / flagged at-risk
 *   - recentChange  : whether new activity in the last 24h
 *
 * Also returns:
 *   - plan          : the institution plan ('CORE' | 'PREMIUM')
 *   - isFirstRun    : no activity yet → show onboarding nudges
 */
export async function GET(_req: NextRequest) {
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
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const [
      isPremium,
      mediationPending,
      mediationNew24h,
      offersPending,
      offersNew24h,
      leadsTotal,
      leadsStaleCount,
      placementsActive,
      placementsOverdueDeadlines,
      placementsNoHours,
      auditLast24h,
      totalStudents,
    ] = await Promise.all([
      isInstitutionPremium(institutionId),
      prisma.mediationMessage.count({
        where: {
          thread: { institutionId },
          status: 'PENDING_REVIEW',
        },
      }),
      prisma.mediationMessage.count({
        where: {
          thread: { institutionId },
          status: 'PENDING_REVIEW',
          createdAt: { gte: oneDayAgo },
        },
      }),
      prisma.job.count({
        where: { institutionId, status: 'PENDING_APPROVAL' },
      }),
      prisma.job.count({
        where: {
          institutionId,
          status: 'PENDING_APPROVAL',
          createdAt: { gte: oneDayAgo },
        },
      }),
      prisma.companyLead.count({ where: { institutionId } }),
      prisma.companyLead.count({
        where: { institutionId, updatedAt: { lt: sevenDaysAgo } },
      }),
      prisma.placement.count({
        where: {
          institutionId,
          outcome: null,
          OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
        },
      }),
      prisma.placementDeadline.count({
        where: {
          placement: { institutionId },
          completedAt: null,
          dueAt: { lt: new Date() },
        },
      }),
      prisma.placement.count({
        where: {
          institutionId,
          outcome: null,
          plannedHours: { not: null },
          OR: [
            { lastHoursLoggedAt: null },
            { lastHoursLoggedAt: { lt: sevenDaysAgo } },
          ],
        },
      }),
      prisma.auditEvent.count({
        where: { institutionId, createdAt: { gte: oneDayAgo } },
      }),
      prisma.institutionAffiliation.count({
        where: { institutionId, status: 'ACTIVE' },
      }),
    ])

    const placementsAtRisk = placementsOverdueDeadlines + placementsNoHours

    const plan: 'CORE' | 'PREMIUM' = isPremium ? 'PREMIUM' : 'CORE'

    // First-run heuristic: no real activity yet
    const isFirstRun =
      totalStudents === 0 &&
      leadsTotal === 0 &&
      placementsActive === 0 &&
      offersPending === 0

    return NextResponse.json({
      plan,
      isFirstRun,
      totalStudents,
      modules: {
        inbox: {
          key: 'inbox',
          pendingCount: mediationPending,
          recentCount: mediationNew24h,
          href: '/dashboard/university/inbox',
        },
        offers: {
          key: 'offers',
          pendingCount: offersPending,
          recentCount: offersNew24h,
          href: '/dashboard/university/offers',
        },
        crm: {
          key: 'crm',
          pendingCount: leadsStaleCount,
          totalCount: leadsTotal,
          href: '/dashboard/university/crm',
        },
        placement: {
          key: 'placement',
          pendingCount: placementsAtRisk,
          activeCount: placementsActive,
          overdueDeadlines: placementsOverdueDeadlines,
          noHours: placementsNoHours,
          href: '/dashboard/university/placement-pipeline',
        },
        assistant: {
          key: 'assistant',
          recentCount: auditLast24h,
          href: '/dashboard/university/assistant',
        },
        auditLog: {
          key: 'auditLog',
          recentCount: auditLast24h,
          href: '/dashboard/university/audit-log',
        },
      },
    })
  } catch (error: any) {
    console.error('Workspace actions error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to load workspace actions' },
      { status: 500 }
    )
  }
}
