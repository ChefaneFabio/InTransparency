import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

const STATUS_KEYS = ['ACTIVE', 'PAUSED', 'COMPLETED', 'REPLIED', 'BOUNCED'] as const
type SequenceStatus = (typeof STATUS_KEYS)[number]

const SCORE_BUCKETS: Array<{ label: string; min: number; max: number }> = [
  { label: '0-20', min: 0, max: 20 },
  { label: '20-40', min: 20, max: 40 },
  { label: '40-60', min: 40, max: 60 },
  { label: '60-80', min: 60, max: 80 },
  { label: '80-100', min: 80, max: 100.0001 }, // inclusive top
]

function emptyByStatus(): Record<SequenceStatus, number> {
  return { ACTIVE: 0, PAUSED: 0, COMPLETED: 0, REPLIED: 0, BOUNCED: 0 }
}

function median(values: number[]): number | null {
  if (values.length === 0) return null
  const sorted = Array.from(values).sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2
  }
  return sorted[mid]
}

/**
 * GET /api/dashboard/recruiter/analytics/pipeline
 * Returns outreach pipeline analytics for the current recruiter:
 *   - sequence status distribution
 *   - per-template performance
 *   - response time stats (median/fastest/slowest, last 90 days)
 *   - match-score distribution histogram (last 90 days)
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
    const now = new Date()
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

    // ------------------------------------------------------------------
    // 1. Sequences overview (all time, scoped to this recruiter)
    // ------------------------------------------------------------------
    const allSequences = await prisma.outreachSequence.findMany({
      where: { recruiterId: userId },
      select: {
        id: true,
        status: true,
        templateId: true,
        templateName: true,
        currentStepIdx: true,
        candidateId: true,
        createdAt: true,
      },
    })

    const byStatus = emptyByStatus()
    let stepsSentTotal = 0
    for (let i = 0; i < allSequences.length; i++) {
      const s = allSequences[i]
      if (STATUS_KEYS.indexOf(s.status as SequenceStatus) !== -1) {
        byStatus[s.status as SequenceStatus] += 1
      }
      stepsSentTotal += s.currentStepIdx
    }

    const totalSequences = allSequences.length
    const avgStepsSent =
      totalSequences > 0 ? stepsSentTotal / totalSequences : 0

    // ------------------------------------------------------------------
    // 2. Per-template performance
    // ------------------------------------------------------------------
    interface TemplateBucket {
      templateId: string | null
      templateName: string
      totalSequences: number
      completed: number
      replied: number
      active: number
      paused: number
      bounced: number
    }
    const templateMap = new Map<string, TemplateBucket>()
    for (let i = 0; i < allSequences.length; i++) {
      const s = allSequences[i]
      const key = s.templateId || `__snapshot__:${s.templateName}`
      let bucket = templateMap.get(key)
      if (!bucket) {
        bucket = {
          templateId: s.templateId,
          templateName: s.templateName || 'Untitled',
          totalSequences: 0,
          completed: 0,
          replied: 0,
          active: 0,
          paused: 0,
          bounced: 0,
        }
        templateMap.set(key, bucket)
      }
      bucket.totalSequences += 1
      if (s.status === 'COMPLETED') bucket.completed += 1
      else if (s.status === 'REPLIED') bucket.replied += 1
      else if (s.status === 'ACTIVE') bucket.active += 1
      else if (s.status === 'PAUSED') bucket.paused += 1
      else if (s.status === 'BOUNCED') bucket.bounced += 1
    }

    // For avg steps sent per template
    const templateStepTotals = new Map<string, { steps: number; count: number }>()
    for (let i = 0; i < allSequences.length; i++) {
      const s = allSequences[i]
      const key = s.templateId || `__snapshot__:${s.templateName}`
      const agg = templateStepTotals.get(key) || { steps: 0, count: 0 }
      agg.steps += s.currentStepIdx
      agg.count += 1
      templateStepTotals.set(key, agg)
    }

    const templates = Array.from(templateMap.entries())
      .map(([key, b]) => {
        const denom = b.completed + b.replied + b.active + b.paused
        const replyRate = denom > 0 ? b.replied / denom : 0
        const stepAgg = templateStepTotals.get(key)
        const avgSteps = stepAgg && stepAgg.count > 0 ? stepAgg.steps / stepAgg.count : 0
        return {
          templateId: b.templateId,
          templateName: b.templateName,
          totalSequences: b.totalSequences,
          completed: b.completed,
          replied: b.replied,
          replyRate,
          avgStepsSent: avgSteps,
        }
      })
      .sort((a, b) => b.totalSequences - a.totalSequences)

    // ------------------------------------------------------------------
    // 3. Response time (last 90 days)
    // ------------------------------------------------------------------
    const recentSequences = allSequences.filter(s => s.createdAt >= ninetyDaysAgo)
    const responseHours: number[] = []

    if (recentSequences.length > 0) {
      const seqIds = recentSequences.map(s => s.id)

      // Outreach messages in these threads sent BY the candidate (reply back).
      const replyMessages = await prisma.message.findMany({
        where: {
          threadId: { in: seqIds },
          replied: true,
        },
        select: {
          threadId: true,
          senderId: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      })

      // Map sequenceId -> candidateId -> createdAt
      const seqById = new Map<string, { candidateId: string; createdAt: Date }>()
      for (let i = 0; i < recentSequences.length; i++) {
        const s = recentSequences[i]
        seqById.set(s.id, { candidateId: s.candidateId, createdAt: s.createdAt })
      }

      const firstReplyByThread = new Map<string, Date>()
      for (let i = 0; i < replyMessages.length; i++) {
        const m = replyMessages[i]
        if (!m.threadId) continue
        const seq = seqById.get(m.threadId)
        if (!seq) continue
        if (m.senderId !== seq.candidateId) continue // we only care about replies FROM the candidate
        if (!firstReplyByThread.has(m.threadId)) {
          firstReplyByThread.set(m.threadId, m.createdAt)
        }
      }

      const entries = Array.from(firstReplyByThread.entries())
      for (let i = 0; i < entries.length; i++) {
        const [threadId, replyAt] = entries[i]
        const seq = seqById.get(threadId)
        if (!seq) continue
        const hours = (replyAt.getTime() - seq.createdAt.getTime()) / (1000 * 60 * 60)
        if (hours >= 0) responseHours.push(hours)
      }
    }

    const medianHours = median(responseHours)
    let fastestHours: number | null = null
    let slowestHours: number | null = null
    if (responseHours.length > 0) {
      fastestHours = responseHours[0]
      slowestHours = responseHours[0]
      for (let i = 1; i < responseHours.length; i++) {
        const v = responseHours[i]
        if (v < fastestHours) fastestHours = v
        if (v > slowestHours) slowestHours = v
      }
    }

    // ------------------------------------------------------------------
    // 4. Score distribution (MatchExplanations, last 90 days)
    // ------------------------------------------------------------------
    const explanations = await prisma.matchExplanation.findMany({
      where: {
        counterpartyId: userId,
        createdAt: { gte: ninetyDaysAgo },
      },
      select: { matchScore: true },
    })

    const scoreDistribution = SCORE_BUCKETS.map(b => ({
      bucket: b.label,
      count: 0,
    }))
    for (let i = 0; i < explanations.length; i++) {
      const score = explanations[i].matchScore
      for (let j = 0; j < SCORE_BUCKETS.length; j++) {
        const bucket = SCORE_BUCKETS[j]
        if (score >= bucket.min && score < bucket.max) {
          scoreDistribution[j].count += 1
          break
        }
      }
    }

    return NextResponse.json({
      sequences: {
        total: totalSequences,
        byStatus,
        avgStepsSent,
      },
      templates,
      responseTime: {
        medianHours,
        fastestHours,
        slowestHours,
      },
      scoreDistribution,
    })
  } catch (error) {
    console.error('Error fetching recruiter pipeline analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pipeline analytics' },
      { status: 500 }
    )
  }
}
