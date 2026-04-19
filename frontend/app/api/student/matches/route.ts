import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/student/matches
 * Returns all MatchExplanations where the current user is the subject.
 * Right-to-explanation index page — students see every match about them.
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const explanations = await prisma.matchExplanation.findMany({
    where: { subjectId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      id: true,
      matchScore: true,
      decisionLabel: true,
      contextType: true,
      contextId: true,
      counterpartyId: true,
      modelVersion: true,
      subjectViewed: true,
      createdAt: true,
    },
  })

  // Enrich with recruiter company name + job title if available
  const recruiterIds = Array.from(new Set(explanations.map(e => e.counterpartyId)))
  const jobIds = Array.from(
    new Set(explanations.filter(e => e.contextType === 'JOB' && e.contextId).map(e => e.contextId!))
  )

  const [recruiters, jobs] = await Promise.all([
    prisma.user.findMany({
      where: { id: { in: recruiterIds } },
      select: { id: true, company: true, firstName: true, lastName: true },
    }),
    jobIds.length > 0
      ? prisma.job.findMany({
          where: { id: { in: jobIds } },
          select: { id: true, title: true, companyName: true },
        })
      : Promise.resolve([]),
  ])

  const recruiterMap = new Map(recruiters.map(r => [r.id, r]))
  const jobMap = new Map(jobs.map(j => [j.id, j]))

  return NextResponse.json({
    matches: explanations.map(e => {
      const recruiter = recruiterMap.get(e.counterpartyId)
      const job = e.contextId ? jobMap.get(e.contextId) : null
      return {
        id: e.id,
        matchScore: e.matchScore,
        decisionLabel: e.decisionLabel,
        companyName: job?.companyName ?? recruiter?.company ?? 'Anonymous recruiter',
        jobTitle: job?.title ?? null,
        recruiterName:
          [recruiter?.firstName, recruiter?.lastName].filter(Boolean).join(' ') || null,
        viewed: e.subjectViewed,
        modelVersion: e.modelVersion,
        createdAt: e.createdAt.toISOString(),
      }
    }),
    summary: {
      total: explanations.length,
      strong: explanations.filter(e => e.decisionLabel === 'STRONG_MATCH').length,
      unviewed: explanations.filter(e => !e.subjectViewed).length,
    },
  })
}
