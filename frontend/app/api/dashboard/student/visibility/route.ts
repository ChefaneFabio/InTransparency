import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/student/visibility
 *
 * Reciprocal visibility widget — shows the student how many recruiters are
 * watching them, how many active outreach sequences are targeting them,
 * and how many match explanations about them were produced in the last 30 days.
 *
 * AI Act Art. 86 + GDPR Art. 22 — the subject of automated matching has the
 * right to know when, why, and by whom they are being profiled.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const studentId = session.user.id
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const [watchingCount, activeOutreachCount, recentMatchCount] = await Promise.all([
      prisma.savedCandidate.count({
        where: { candidateId: studentId },
      }),
      prisma.outreachSequence.count({
        where: { candidateId: studentId, status: 'ACTIVE' },
      }),
      prisma.matchExplanation.count({
        where: {
          subjectId: studentId,
          subjectType: 'STUDENT',
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
    ])

    return NextResponse.json({
      watchingCount,
      activeOutreachCount,
      recentMatchCount,
    })
  } catch (error) {
    console.error('Error fetching student visibility:', error)
    return NextResponse.json(
      { error: 'Failed to fetch visibility' },
      { status: 500 }
    )
  }
}
