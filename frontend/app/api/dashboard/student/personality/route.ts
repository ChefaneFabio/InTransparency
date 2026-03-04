import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/student/personality
 * Returns full assessment profiles with history + peer averages
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if ((session.user as any).role !== 'STUDENT' && (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userId = session.user.id

    // Fetch user's university for peer comparison
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { university: true },
    })

    // Fetch all completed/certified assessments with full profile data
    const assessments = await prisma.softSkillAssessment.findMany({
      where: {
        userId,
        status: { in: ['COMPLETED', 'CERTIFIED'] },
      },
      include: {
        bigFiveProfile: true,
        discProfile: true,
        competencyProfile: true,
      },
      orderBy: { timeCompleted: 'desc' },
    })

    // Extract the latest profile of each type
    let bigFive = null
    let disc = null
    let competency = null

    // Collect historical snapshots for comparison over time
    const history: {
      bigFive: Array<{ date: string; openness: number; conscientiousness: number; extraversion: number; agreeableness: number; neuroticism: number }>
      disc: Array<{ date: string; dominance: number; influence: number; steadiness: number; compliance: number }>
      competency: Array<{ date: string; overallScore: number; communication: number; teamwork: number; leadership: number; problemSolving: number; adaptability: number; emotionalIntelligence: number; timeManagement: number; conflictResolution: number }>
    } = { bigFive: [], disc: [], competency: [] }

    for (const a of assessments) {
      const dateStr = a.timeCompleted ? a.timeCompleted.toISOString() : a.timeStarted.toISOString()

      if (a.bigFiveProfile) {
        if (!bigFive) bigFive = a.bigFiveProfile
        history.bigFive.push({
          date: dateStr,
          openness: a.bigFiveProfile.openness,
          conscientiousness: a.bigFiveProfile.conscientiousness,
          extraversion: a.bigFiveProfile.extraversion,
          agreeableness: a.bigFiveProfile.agreeableness,
          neuroticism: a.bigFiveProfile.neuroticism,
        })
      }
      if (a.discProfile) {
        if (!disc) disc = a.discProfile
        history.disc.push({
          date: dateStr,
          dominance: a.discProfile.dominance,
          influence: a.discProfile.influence,
          steadiness: a.discProfile.steadiness,
          compliance: a.discProfile.compliance,
        })
      }
      if (a.competencyProfile) {
        if (!competency) competency = a.competencyProfile
        history.competency.push({
          date: dateStr,
          overallScore: a.competencyProfile.overallScore,
          communication: a.competencyProfile.communication,
          teamwork: a.competencyProfile.teamwork,
          leadership: a.competencyProfile.leadership,
          problemSolving: a.competencyProfile.problemSolving,
          adaptability: a.competencyProfile.adaptability,
          emotionalIntelligence: a.competencyProfile.emotionalIntelligence,
          timeManagement: a.competencyProfile.timeManagement,
          conflictResolution: a.competencyProfile.conflictResolution,
        })
      }
    }

    // Reverse history so oldest is first (for charts)
    history.bigFive.reverse()
    history.disc.reverse()
    history.competency.reverse()

    // Peer comparison: average scores from students at the same university
    let peerAverages: {
      bigFive: { openness: number; conscientiousness: number; extraversion: number; agreeableness: number; neuroticism: number; count: number } | null
      competency: { communication: number; teamwork: number; leadership: number; problemSolving: number; adaptability: number; emotionalIntelligence: number; timeManagement: number; conflictResolution: number; overallScore: number; count: number } | null
    } = { bigFive: null, competency: null }

    if (user?.university) {
      // Find peer user IDs from same university (excluding self)
      const peerIds = await prisma.user.findMany({
        where: {
          university: user.university,
          id: { not: userId },
          role: 'STUDENT',
        },
        select: { id: true },
        take: 500,
      })
      const peerIdList = peerIds.map((p) => p.id)

      if (peerIdList.length > 0) {
        // BigFive peer averages
        const peerBigFive = await prisma.bigFiveProfile.aggregate({
          where: {
            assessment: {
              userId: { in: peerIdList },
              status: { in: ['COMPLETED', 'CERTIFIED'] },
            },
          },
          _avg: {
            openness: true,
            conscientiousness: true,
            extraversion: true,
            agreeableness: true,
            neuroticism: true,
          },
          _count: true,
        })

        if (peerBigFive._count > 0) {
          peerAverages.bigFive = {
            openness: Math.round(peerBigFive._avg.openness || 0),
            conscientiousness: Math.round(peerBigFive._avg.conscientiousness || 0),
            extraversion: Math.round(peerBigFive._avg.extraversion || 0),
            agreeableness: Math.round(peerBigFive._avg.agreeableness || 0),
            neuroticism: Math.round(peerBigFive._avg.neuroticism || 0),
            count: peerBigFive._count,
          }
        }

        // Competency peer averages
        const peerComp = await prisma.competencyProfile.aggregate({
          where: {
            assessment: {
              userId: { in: peerIdList },
              status: { in: ['COMPLETED', 'CERTIFIED'] },
            },
          },
          _avg: {
            communication: true,
            teamwork: true,
            leadership: true,
            problemSolving: true,
            adaptability: true,
            emotionalIntelligence: true,
            timeManagement: true,
            conflictResolution: true,
            overallScore: true,
          },
          _count: true,
        })

        if (peerComp._count > 0) {
          peerAverages.competency = {
            communication: Math.round(peerComp._avg.communication || 0),
            teamwork: Math.round(peerComp._avg.teamwork || 0),
            leadership: Math.round(peerComp._avg.leadership || 0),
            problemSolving: Math.round(peerComp._avg.problemSolving || 0),
            adaptability: Math.round(peerComp._avg.adaptability || 0),
            emotionalIntelligence: Math.round(peerComp._avg.emotionalIntelligence || 0),
            timeManagement: Math.round(peerComp._avg.timeManagement || 0),
            conflictResolution: Math.round(peerComp._avg.conflictResolution || 0),
            overallScore: Math.round(peerComp._avg.overallScore || 0),
            count: peerComp._count,
          }
        }
      }
    }

    return NextResponse.json({
      bigFive,
      disc,
      competency,
      history,
      peerAverages,
      university: user?.university || null,
      hasAnyAssessment: !!(bigFive || disc || competency),
    })
  } catch (error) {
    console.error('Error fetching personality data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
