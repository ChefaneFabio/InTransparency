import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/recruiter/action-center
 *
 * One-shot aggregate feeding the recruiter home "what's happening today"
 * strip. Mirrors the staff Workspace Action Center pattern.
 *
 * Returns:
 *   - pipelineByStage      : saved candidate counts by folder/stage
 *   - activeJobs           : my ACTIVE job listings + count of pending applications each
 *   - newApplicationsToday : apps received in last 24h across all my jobs
 *   - unreadMessages       : messages addressed to me I haven't opened
 *   - profileViewsLast7d   : people viewing my jobs + saved candidates recently
 *   - assistantActivity    : # queries I've run with the Talent Assistant in last 7d
 */
export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userId = session.user.id
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const [
      savedCandidates,
      activeJobs,
      newApplicationsToday,
      unreadMessages,
      jobsViewedLast7d,
      assistantQueries7d,
      totalJobs,
    ] = await Promise.all([
      // Saved candidates by folder — our kanban stages
      prisma.savedCandidate.groupBy({
        by: ['folder'],
        where: { recruiterId: userId },
        _count: { _all: true },
      }),

      // Active jobs with pending application count
      prisma.job.findMany({
        where: { recruiterId: userId, status: 'ACTIVE' },
        select: {
          id: true,
          title: true,
          location: true,
          postedAt: true,
          _count: {
            select: {
              applications: {
                where: { status: 'PENDING' },
              },
            },
          },
        },
        orderBy: { postedAt: 'desc' },
        take: 5,
      }),

      // Apps received in last 24h
      prisma.application.count({
        where: {
          job: { recruiterId: userId },
          createdAt: { gte: oneDayAgo },
        },
      }),

      // Unread messages to me
      prisma.message.count({
        where: {
          recipientId: userId,
          read: false,
          isArchived: false,
        },
      }),

      // Views of my job listings in last 7d
      prisma.job.aggregate({
        where: { recruiterId: userId, status: 'ACTIVE' },
        _sum: { views: true },
      }),

      // Assistant queries I've made in last 7d (from AuditEvent)
      prisma.auditEvent.count({
        where: {
          actorId: userId,
          action: { startsWith: 'assistant.' },
          createdAt: { gte: sevenDaysAgo },
        },
      }),

      prisma.job.count({ where: { recruiterId: userId } }),
    ])

    // Normalize saved-candidates into the 5-stage pipeline model
    const STAGES = ['discovered', 'contacted', 'interviewing', 'offered', 'hired'] as const
    const byStage: Record<string, number> = {
      discovered: 0,
      contacted: 0,
      interviewing: 0,
      offered: 0,
      hired: 0,
    }
    for (const row of savedCandidates) {
      const folder = (row.folder || 'all').toLowerCase()
      const matched = STAGES.find(s => s === folder)
      if (matched) byStage[matched] += row._count._all
      else byStage.discovered += row._count._all // uncategorised → discovered
    }
    const totalInPipeline = Object.values(byStage).reduce((a, b) => a + b, 0)

    // First-run heuristic
    const isFirstRun =
      totalJobs === 0 && totalInPipeline === 0 && activeJobs.length === 0

    return NextResponse.json({
      isFirstRun,
      pipeline: {
        total: totalInPipeline,
        byStage,
      },
      jobs: {
        activeCount: activeJobs.length,
        totalCount: totalJobs,
        viewsLast7d: jobsViewedLast7d._sum.views ?? 0,
        active: activeJobs.map(j => ({
          id: j.id,
          title: j.title,
          location: j.location,
          postedAt: j.postedAt,
          pendingApplications: j._count.applications,
        })),
      },
      applications: {
        newToday: newApplicationsToday,
      },
      messages: {
        unread: unreadMessages,
      },
      assistant: {
        queriesLast7d: assistantQueries7d,
      },
    })
  } catch (error: any) {
    console.error('Recruiter action center error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to load action center' },
      { status: 500 }
    )
  }
}
