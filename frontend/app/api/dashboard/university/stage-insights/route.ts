import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/university/stage-insights
 * Aggregate insights from all stage journals — the consulting layer.
 * Shows patterns: where students struggle, what prepares them, growth curves.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = user.company || ''

    // Get all stage IDs for this university
    const stages = await prisma.stageExperience.findMany({
      where: { universityName },
      select: { id: true, companyName: true, role: true, stageType: true, status: true, studentId: true },
    })
    const stageIds = stages.map(s => s.id)

    if (stageIds.length === 0) {
      return NextResponse.json({ insights: null, message: 'No stages found' })
    }

    // Get all journal entries
    const journals = await prisma.stageJournal.findMany({
      where: { stageId: { in: stageIds } },
    })

    if (journals.length === 0) {
      return NextResponse.json({ insights: null, message: 'No journal entries yet' })
    }

    // ── Preparedness gap ──
    // How prepared students felt vs what they needed
    const prepRatings = journals.filter(j => j.preparednessRating).map(j => j.preparednessRating!)
    const avgPreparedness = prepRatings.length > 0
      ? Math.round((prepRatings.reduce((a, b) => a + b, 0) / prepRatings.length) * 10) / 10
      : null

    // Preparedness by week (does it improve over time?)
    const prepByWeek: Record<number, number[]> = {}
    for (const j of journals) {
      if (j.preparednessRating) {
        if (!prepByWeek[j.weekNumber]) prepByWeek[j.weekNumber] = []
        prepByWeek[j.weekNumber].push(j.preparednessRating)
      }
    }
    const prepTrend = Object.entries(prepByWeek)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([week, ratings]) => ({
        week: parseInt(week),
        avg: Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10,
        count: ratings.length,
      }))

    // ── Confidence & independence growth ──
    const confByWeek: Record<number, number[]> = {}
    const indByWeek: Record<number, number[]> = {}
    for (const j of journals) {
      if (j.confidenceLevel) {
        if (!confByWeek[j.weekNumber]) confByWeek[j.weekNumber] = []
        confByWeek[j.weekNumber].push(j.confidenceLevel)
      }
      if (j.independenceRating) {
        if (!indByWeek[j.weekNumber]) indByWeek[j.weekNumber] = []
        indByWeek[j.weekNumber].push(j.independenceRating)
      }
    }

    const growthCurve = Array.from(new Set([...Object.keys(confByWeek), ...Object.keys(indByWeek)].map(Number)))
      .sort((a, b) => a - b)
      .map(week => ({
        week,
        confidence: confByWeek[week] ? Math.round((confByWeek[week].reduce((a, b) => a + b, 0) / confByWeek[week].length) * 10) / 10 : null,
        independence: indByWeek[week] ? Math.round((indByWeek[week].reduce((a, b) => a + b, 0) / indByWeek[week].length) * 10) / 10 : null,
      }))

    // ── Most referenced courses ──
    const courseCounts: Record<string, number> = {}
    for (const j of journals) {
      if (j.courseConnection) {
        courseCounts[j.courseConnection] = (courseCounts[j.courseConnection] || 0) + 1
      }
    }
    const topCourses = Object.entries(courseCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([course, count]) => ({ course, count }))

    // ── Most practiced skills ──
    const skillCounts: Record<string, number> = {}
    for (const j of journals) {
      if (j.skillPracticed) skillCounts[j.skillPracticed] = (skillCounts[j.skillPracticed] || 0) + 1
    }
    const topSkills = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }))

    // ── New skills learned ──
    const newSkillCounts: Record<string, number> = {}
    for (const j of journals) {
      if (j.newSkillLearned) newSkillCounts[j.newSkillLearned] = (newSkillCounts[j.newSkillLearned] || 0) + 1
    }
    const topNewSkills = Object.entries(newSkillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }))

    // ── Common challenges ──
    const challenges = journals
      .filter(j => j.biggestChallenge)
      .map(j => ({ text: j.biggestChallenge!, week: j.weekNumber }))

    // ── Satisfaction distribution ──
    const satRatings = journals.filter(j => j.overallSatisfaction).map(j => j.overallSatisfaction!)
    const satDistribution = [1, 2, 3, 4, 5].map(r => ({
      rating: r,
      count: satRatings.filter(s => s === r).length,
    }))
    const avgSatisfaction = satRatings.length > 0
      ? Math.round((satRatings.reduce((a, b) => a + b, 0) / satRatings.length) * 10) / 10
      : null

    // ── Advice from interns ──
    const advice = journals
      .filter(j => j.adviceForNextIntern)
      .map(j => j.adviceForNextIntern!)

    return NextResponse.json({
      insights: {
        totalEntries: journals.length,
        totalStages: stageIds.length,
        stagesWithJournals: new Set(journals.map(j => j.stageId)).size,
        avgPreparedness,
        avgSatisfaction,
        prepTrend,
        growthCurve,
        topCourses,
        topSkills,
        topNewSkills,
        satDistribution,
        challenges: challenges.slice(0, 20),
        advice: advice.slice(0, 10),
      },
    })
  } catch (error) {
    console.error('Stage insights error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
