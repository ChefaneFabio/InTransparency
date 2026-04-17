import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

interface RouteContext {
  params: Promise<{ id: string }>
}

// GET /api/dashboard/university/stages/[id]/journal
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await context.params

    const journals = await prisma.stageJournal.findMany({
      where: { stageId: id },
      orderBy: { weekNumber: 'asc' },
    })

    // Compute growth trajectory
    const ratings = journals.filter(j => j.confidenceLevel && j.independenceRating)
    const growthCurve = ratings.map(j => ({
      week: j.weekNumber,
      confidence: j.confidenceLevel,
      independence: j.independenceRating,
      preparedness: j.preparednessRating,
      teamIntegration: j.teamIntegration,
      satisfaction: j.overallSatisfaction,
    }))

    // Skills collected across weeks
    const skillsPracticed = journals.map(j => j.skillPracticed).filter(Boolean) as string[]
    const newSkills = journals.map(j => j.newSkillLearned).filter(Boolean) as string[]
    const coursesReferenced = journals.map(j => j.courseConnection).filter(Boolean) as string[]

    // Average preparedness over time
    const prepRatings = journals.filter(j => j.preparednessRating).map(j => j.preparednessRating!)
    const avgPreparedness = prepRatings.length > 0
      ? Math.round((prepRatings.reduce((a, b) => a + b, 0) / prepRatings.length) * 10) / 10
      : null

    return NextResponse.json({
      entries: journals.map(j => ({
        id: j.id,
        weekNumber: j.weekNumber,
        activitiesSummary: j.activitiesSummary,
        biggestChallenge: j.biggestChallenge,
        biggestWin: j.biggestWin,
        skillPracticed: j.skillPracticed,
        newSkillLearned: j.newSkillLearned,
        courseConnection: j.courseConnection,
        preparednessRating: j.preparednessRating,
        independenceRating: j.independenceRating,
        confidenceLevel: j.confidenceLevel,
        teamIntegration: j.teamIntegration,
        workLifeBalance: j.workLifeBalance,
        overallSatisfaction: j.overallSatisfaction,
        whatWouldChange: j.whatWouldChange,
        adviceForNextIntern: j.adviceForNextIntern,
        supervisorComment: j.supervisorComment,
        supervisorRating: j.supervisorRating,
        createdAt: j.createdAt.toISOString(),
      })),
      growthCurve,
      insights: {
        totalWeeks: journals.length,
        skillsPracticed,
        newSkills,
        coursesReferenced,
        avgPreparedness,
      },
    })
  } catch (error) {
    console.error('Journal fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/dashboard/university/stages/[id]/journal — add a weekly entry
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await context.params
    const body = await req.json()

    const stage = await prisma.stageExperience.findUnique({ where: { id } })
    if (!stage) return NextResponse.json({ error: 'Stage not found' }, { status: 404 })

    const { weekNumber, activitiesSummary, biggestChallenge, biggestWin, skillPracticed, newSkillLearned, courseConnection, preparednessRating, independenceRating, confidenceLevel, teamIntegration, workLifeBalance, overallSatisfaction, whatWouldChange, adviceForNextIntern } = body

    if (!weekNumber || !activitiesSummary) {
      return NextResponse.json({ error: 'Week number and activities are required' }, { status: 400 })
    }

    const entry = await prisma.stageJournal.upsert({
      where: { stageId_weekNumber: { stageId: id, weekNumber: parseInt(weekNumber) } },
      create: {
        stageId: id,
        studentId: stage.studentId,
        weekNumber: parseInt(weekNumber),
        activitiesSummary,
        biggestChallenge: biggestChallenge || null,
        biggestWin: biggestWin || null,
        skillPracticed: skillPracticed || null,
        newSkillLearned: newSkillLearned || null,
        courseConnection: courseConnection || null,
        preparednessRating: preparednessRating ? parseInt(preparednessRating) : null,
        independenceRating: independenceRating ? parseInt(independenceRating) : null,
        confidenceLevel: confidenceLevel ? parseInt(confidenceLevel) : null,
        teamIntegration: teamIntegration ? parseInt(teamIntegration) : null,
        workLifeBalance: workLifeBalance ? parseInt(workLifeBalance) : null,
        overallSatisfaction: overallSatisfaction ? parseInt(overallSatisfaction) : null,
        whatWouldChange: whatWouldChange || null,
        adviceForNextIntern: adviceForNextIntern || null,
      },
      update: {
        activitiesSummary,
        biggestChallenge: biggestChallenge || null,
        biggestWin: biggestWin || null,
        skillPracticed: skillPracticed || null,
        newSkillLearned: newSkillLearned || null,
        courseConnection: courseConnection || null,
        preparednessRating: preparednessRating ? parseInt(preparednessRating) : null,
        independenceRating: independenceRating ? parseInt(independenceRating) : null,
        confidenceLevel: confidenceLevel ? parseInt(confidenceLevel) : null,
        teamIntegration: teamIntegration ? parseInt(teamIntegration) : null,
        workLifeBalance: workLifeBalance ? parseInt(workLifeBalance) : null,
        overallSatisfaction: overallSatisfaction ? parseInt(overallSatisfaction) : null,
        whatWouldChange: whatWouldChange || null,
        adviceForNextIntern: adviceForNextIntern || null,
      },
    })

    return NextResponse.json({ success: true, entry })
  } catch (error) {
    console.error('Journal save error:', error)
    return NextResponse.json({ error: 'Failed to save entry' }, { status: 500 })
  }
}
