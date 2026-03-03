import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/assessments
 * List user's assessments.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const assessments = await prisma.softSkillAssessment.findMany({
      where: { userId: session.user.id },
      include: {
        bigFiveProfile: { select: { personality: true, openness: true, conscientiousness: true, extraversion: true, agreeableness: true, neuroticism: true } },
        discProfile: { select: { primaryStyle: true, dominance: true, influence: true, steadiness: true, compliance: true } },
        competencyProfile: { select: { overallScore: true, topStrengths: true } },
      },
      orderBy: { timeStarted: 'desc' },
    })

    // Also get available questions count per type
    const questionCounts = await prisma.psychometricQuestion.groupBy({
      by: ['questionType'],
      where: { isActive: true },
      _count: true,
    })

    return NextResponse.json({
      assessments,
      questionCounts: questionCounts.reduce((acc, q) => {
        acc[q.questionType] = q._count
        return acc
      }, {} as Record<string, number>),
    })
  } catch (error) {
    console.error('Assessments fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/assessments
 * Start a new assessment.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { assessmentType } = body

    if (!assessmentType || !['BIG_FIVE', 'DISC', 'COMPETENCY', 'FULL'].includes(assessmentType)) {
      return NextResponse.json({ error: 'Invalid assessment type' }, { status: 400 })
    }

    // Check if user already has an active assessment of this type
    const existing = await prisma.softSkillAssessment.findFirst({
      where: {
        userId: session.user.id,
        assessmentType,
        status: { in: ['IN_PROGRESS', 'PAID'] },
      },
    })

    if (existing) {
      return NextResponse.json({ assessment: existing })
    }

    // Get questions for this type
    const questionTypes = assessmentType === 'FULL'
      ? ['BIG_FIVE', 'DISC', 'COMPETENCY']
      : [assessmentType]

    const questionCount = await prisma.psychometricQuestion.count({
      where: { questionType: { in: questionTypes as any[] }, isActive: true },
    })

    const totalQuestions = questionCount > 0 ? questionCount : getDefaultQuestionCount(assessmentType)

    const assessment = await prisma.softSkillAssessment.create({
      data: {
        userId: session.user.id,
        assessmentType,
        status: 'IN_PROGRESS',
        totalQuestions,
        responses: {},
      },
    })

    return NextResponse.json({ assessment }, { status: 201 })
  } catch (error) {
    console.error('Assessment create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getDefaultQuestionCount(type: string): number {
  switch (type) {
    case 'BIG_FIVE': return 50
    case 'DISC': return 28
    case 'COMPETENCY': return 40
    case 'FULL': return 118
    default: return 50
  }
}
