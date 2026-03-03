import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import {
  scoreBigFive,
  scoreDISC,
  scoreCompetencies,
  calculatePercentile,
  getDISCStyle,
  generateBigFiveInterpretation,
  generateDISCInterpretation,
} from '@/lib/assessment-scoring'

/**
 * GET /api/assessments/[id]
 * Get assessment details with questions.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const assessment = await prisma.softSkillAssessment.findUnique({
      where: { id },
      include: {
        bigFiveProfile: true,
        discProfile: true,
        competencyProfile: true,
      },
    })

    if (!assessment || assessment.userId !== session.user.id) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    // Get questions if assessment is in progress
    let questions: any[] = []
    if (assessment.status === 'IN_PROGRESS' || assessment.status === 'PAID') {
      const questionTypes = assessment.assessmentType === 'FULL'
        ? ['BIG_FIVE', 'DISC', 'COMPETENCY']
        : [assessment.assessmentType]

      questions = await prisma.psychometricQuestion.findMany({
        where: { questionType: { in: questionTypes as any[] }, isActive: true },
        orderBy: { orderIndex: 'asc' },
        select: {
          id: true,
          questionText: true,
          questionType: true,
          dimension: true,
          category: true,
          responseType: true,
          minValue: true,
          maxValue: true,
          minLabel: true,
          maxLabel: true,
          orderIndex: true,
        },
      })

      // If no questions in DB, generate default ones
      if (questions.length === 0) {
        questions = generateDefaultQuestions(assessment.assessmentType)
      }
    }

    return NextResponse.json({ assessment, questions })
  } catch (error) {
    console.error('Assessment fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/assessments/[id]
 * Submit answers and optionally complete the assessment.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { responses, complete } = body

    const assessment = await prisma.softSkillAssessment.findUnique({
      where: { id },
    })

    if (!assessment || assessment.userId !== session.user.id) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    if (assessment.status !== 'IN_PROGRESS' && assessment.status !== 'PAID') {
      return NextResponse.json({ error: 'Assessment is not in progress' }, { status: 400 })
    }

    // Merge responses
    const existingResponses = (assessment.responses as Record<string, number>) || {}
    const mergedResponses = { ...existingResponses, ...responses }

    const updateData: any = {
      responses: mergedResponses,
      currentQuestion: Object.keys(mergedResponses).length,
    }

    if (complete) {
      updateData.status = 'COMPLETED'
      updateData.timeCompleted = new Date()
      updateData.durationSeconds = Math.round(
        (Date.now() - assessment.timeStarted.getTime()) / 1000
      )

      // Score the assessment
      const questionTypes = assessment.assessmentType === 'FULL'
        ? ['BIG_FIVE', 'DISC', 'COMPETENCY']
        : [assessment.assessmentType]

      let questions = await prisma.psychometricQuestion.findMany({
        where: { questionType: { in: questionTypes as any[] }, isActive: true },
        select: {
          id: true,
          dimension: true,
          facet: true,
          isReverseCoded: true,
          weight: true,
          maxValue: true,
          questionType: true,
        },
      })

      // Use default questions if none in DB
      if (questions.length === 0) {
        questions = generateDefaultQuestions(assessment.assessmentType).map((q: any) => ({
          id: q.id,
          dimension: q.dimension,
          facet: null,
          isReverseCoded: q.isReverseCoded || false,
          weight: 1.0,
          maxValue: q.maxValue,
          questionType: q.questionType,
        }))
      }

      const scores: Record<string, any> = {}

      // Score Big Five
      if (assessment.assessmentType === 'BIG_FIVE' || assessment.assessmentType === 'FULL') {
        const bigFiveQs = questions.filter((q) => q.questionType === 'BIG_FIVE')
        const bigFiveScores = scoreBigFive(mergedResponses, bigFiveQs)
        scores.bigFive = bigFiveScores

        const interpretation = await generateBigFiveInterpretation(bigFiveScores)

        await prisma.bigFiveProfile.create({
          data: {
            assessmentId: assessment.id,
            openness: bigFiveScores.openness,
            conscientiousness: bigFiveScores.conscientiousness,
            extraversion: bigFiveScores.extraversion,
            agreeableness: bigFiveScores.agreeableness,
            neuroticism: bigFiveScores.neuroticism,
            opennessPercentile: calculatePercentile(bigFiveScores.openness),
            conscientiousnessPercentile: calculatePercentile(bigFiveScores.conscientiousness),
            extraversionPercentile: calculatePercentile(bigFiveScores.extraversion),
            agreeablenessPercentile: calculatePercentile(bigFiveScores.agreeableness),
            neuroticismPercentile: calculatePercentile(bigFiveScores.neuroticism),
            personality: interpretation.personality,
            strengths: interpretation.strengths,
            developmentAreas: interpretation.developmentAreas,
            careerFit: interpretation.careerFit,
          },
        })
      }

      // Score DISC
      if (assessment.assessmentType === 'DISC' || assessment.assessmentType === 'FULL') {
        const discQs = questions.filter((q) => q.questionType === 'DISC')
        const discScores = scoreDISC(mergedResponses, discQs)
        scores.disc = discScores

        const style = getDISCStyle(discScores)
        const interpretation = await generateDISCInterpretation(discScores)

        await prisma.dISCProfile.create({
          data: {
            assessmentId: assessment.id,
            dominance: discScores.dominance,
            influence: discScores.influence,
            steadiness: discScores.steadiness,
            compliance: discScores.compliance,
            dominancePercentile: calculatePercentile(discScores.dominance),
            influencePercentile: calculatePercentile(discScores.influence),
            steadinessPercentile: calculatePercentile(discScores.steadiness),
            compliancePercentile: calculatePercentile(discScores.compliance),
            primaryStyle: style.primary,
            secondaryStyle: style.secondary,
            workStyle: interpretation.workStyle,
            communicationStyle: interpretation.communicationStyle,
            motivators: interpretation.motivators,
            stressors: interpretation.stressors,
            idealTeamRole: interpretation.idealTeamRole,
          },
        })
      }

      // Score Competencies
      if (assessment.assessmentType === 'COMPETENCY' || assessment.assessmentType === 'FULL') {
        const compQs = questions.filter((q) => q.questionType === 'COMPETENCY')
        const compScores = scoreCompetencies(mergedResponses, compQs)
        scores.competency = compScores

        const scoreValues = Object.values(compScores)
        const overallScore = Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)

        const sortedDims = Object.entries(compScores).sort((a, b) => b[1] - a[1])
        const topStrengths = sortedDims.slice(0, 3).map(([k]) => k)
        const developmentAreas = sortedDims.slice(-3).map(([k]) => k)

        await prisma.competencyProfile.create({
          data: {
            assessmentId: assessment.id,
            communication: compScores.communication,
            teamwork: compScores.teamwork,
            leadership: compScores.leadership,
            problemSolving: compScores.problemSolving,
            adaptability: compScores.adaptability,
            emotionalIntelligence: compScores.emotionalIntelligence,
            timeManagement: compScores.timeManagement,
            conflictResolution: compScores.conflictResolution,
            communicationPercentile: calculatePercentile(compScores.communication),
            teamworkPercentile: calculatePercentile(compScores.teamwork),
            leadershipPercentile: calculatePercentile(compScores.leadership),
            problemSolvingPercentile: calculatePercentile(compScores.problemSolving),
            adaptabilityPercentile: calculatePercentile(compScores.adaptability),
            emotionalIntelligencePercentile: calculatePercentile(compScores.emotionalIntelligence),
            timeManagementPercentile: calculatePercentile(compScores.timeManagement),
            conflictResolutionPercentile: calculatePercentile(compScores.conflictResolution),
            overallScore,
            overallPercentile: calculatePercentile(overallScore),
            topStrengths,
            developmentAreas,
          },
        })
      }

      updateData.scores = scores
      updateData.isCertified = true
      updateData.certificateId = `CERT-${Date.now().toString(36).toUpperCase()}`
      updateData.certificateIssuedAt = new Date()
    }

    const updated = await prisma.softSkillAssessment.update({
      where: { id },
      data: updateData,
      include: {
        bigFiveProfile: true,
        discProfile: true,
        competencyProfile: true,
      },
    })

    return NextResponse.json({ assessment: updated })
  } catch (error) {
    console.error('Assessment update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ============================================================================
// DEFAULT QUESTIONS (when no seed data in DB)
// ============================================================================

function generateDefaultQuestions(assessmentType: string): any[] {
  const questions: any[] = []
  let index = 0

  if (assessmentType === 'BIG_FIVE' || assessmentType === 'FULL') {
    const bigFiveItems = [
      { dimension: 'openness', text: 'I enjoy trying new and different experiences', reverse: false },
      { dimension: 'openness', text: 'I prefer routine over variety', reverse: true },
      { dimension: 'openness', text: 'I am curious about many different things', reverse: false },
      { dimension: 'openness', text: 'I have a vivid imagination', reverse: false },
      { dimension: 'openness', text: 'I prefer practical solutions over creative ones', reverse: true },
      { dimension: 'conscientiousness', text: 'I always meet my deadlines', reverse: false },
      { dimension: 'conscientiousness', text: 'I pay attention to details', reverse: false },
      { dimension: 'conscientiousness', text: 'I sometimes leave tasks unfinished', reverse: true },
      { dimension: 'conscientiousness', text: 'I like to plan ahead', reverse: false },
      { dimension: 'conscientiousness', text: 'I am thorough in my work', reverse: false },
      { dimension: 'extraversion', text: 'I enjoy being the center of attention', reverse: false },
      { dimension: 'extraversion', text: 'I prefer working alone', reverse: true },
      { dimension: 'extraversion', text: 'I feel energized after social interactions', reverse: false },
      { dimension: 'extraversion', text: 'I start conversations easily', reverse: false },
      { dimension: 'extraversion', text: 'I am quiet in large groups', reverse: true },
      { dimension: 'agreeableness', text: 'I go out of my way to help others', reverse: false },
      { dimension: 'agreeableness', text: 'I trust people easily', reverse: false },
      { dimension: 'agreeableness', text: 'I sometimes prioritize my needs over others', reverse: true },
      { dimension: 'agreeableness', text: 'I try to see things from others\' perspectives', reverse: false },
      { dimension: 'agreeableness', text: 'I value cooperation over competition', reverse: false },
      { dimension: 'neuroticism', text: 'I worry about things often', reverse: false },
      { dimension: 'neuroticism', text: 'I stay calm under pressure', reverse: true },
      { dimension: 'neuroticism', text: 'I get stressed easily', reverse: false },
      { dimension: 'neuroticism', text: 'I bounce back quickly from setbacks', reverse: true },
      { dimension: 'neuroticism', text: 'I am easily upset by criticism', reverse: false },
    ]

    for (const item of bigFiveItems) {
      questions.push({
        id: `bf_${index}`,
        questionText: item.text,
        questionType: 'BIG_FIVE',
        dimension: item.dimension,
        category: `Big Five - ${item.dimension.charAt(0).toUpperCase() + item.dimension.slice(1)}`,
        responseType: 'likert_5',
        minValue: 1,
        maxValue: 5,
        minLabel: 'Strongly Disagree',
        maxLabel: 'Strongly Agree',
        orderIndex: index,
        isReverseCoded: item.reverse,
      })
      index++
    }
  }

  if (assessmentType === 'DISC' || assessmentType === 'FULL') {
    const discItems = [
      { dimension: 'dominance', text: 'I take charge in group situations', reverse: false },
      { dimension: 'dominance', text: 'I am direct in my communication', reverse: false },
      { dimension: 'dominance', text: 'I enjoy challenges and competition', reverse: false },
      { dimension: 'dominance', text: 'I make decisions quickly', reverse: false },
      { dimension: 'dominance', text: 'I avoid confrontation when possible', reverse: true },
      { dimension: 'influence', text: 'I easily motivate and inspire others', reverse: false },
      { dimension: 'influence', text: 'I enjoy meeting new people', reverse: false },
      { dimension: 'influence', text: 'I am optimistic about outcomes', reverse: false },
      { dimension: 'influence', text: 'I prefer working alone over in groups', reverse: true },
      { dimension: 'influence', text: 'I express my emotions openly', reverse: false },
      { dimension: 'steadiness', text: 'I prefer a stable and predictable work environment', reverse: false },
      { dimension: 'steadiness', text: 'I am patient with others', reverse: false },
      { dimension: 'steadiness', text: 'I am a good listener', reverse: false },
      { dimension: 'steadiness', text: 'I embrace rapid change easily', reverse: true },
      { dimension: 'steadiness', text: 'I value loyalty and consistency', reverse: false },
      { dimension: 'compliance', text: 'I pay close attention to rules and procedures', reverse: false },
      { dimension: 'compliance', text: 'I analyze problems systematically', reverse: false },
      { dimension: 'compliance', text: 'I make decisions based on data', reverse: false },
      { dimension: 'compliance', text: 'I sometimes overlook details', reverse: true },
      { dimension: 'compliance', text: 'I value accuracy over speed', reverse: false },
    ]

    for (const item of discItems) {
      questions.push({
        id: `disc_${index}`,
        questionText: item.text,
        questionType: 'DISC',
        dimension: item.dimension,
        category: `DISC - ${item.dimension.charAt(0).toUpperCase() + item.dimension.slice(1)}`,
        responseType: 'likert_5',
        minValue: 1,
        maxValue: 5,
        minLabel: 'Strongly Disagree',
        maxLabel: 'Strongly Agree',
        orderIndex: index,
        isReverseCoded: item.reverse,
      })
      index++
    }
  }

  if (assessmentType === 'COMPETENCY' || assessmentType === 'FULL') {
    const compItems = [
      { dimension: 'communication', text: 'I express my ideas clearly in writing', reverse: false },
      { dimension: 'communication', text: 'I am confident speaking in front of groups', reverse: false },
      { dimension: 'communication', text: 'I actively listen to understand others', reverse: false },
      { dimension: 'teamwork', text: 'I contribute effectively to team projects', reverse: false },
      { dimension: 'teamwork', text: 'I support my teammates even when I disagree', reverse: false },
      { dimension: 'teamwork', text: 'I share credit for accomplishments', reverse: false },
      { dimension: 'leadership', text: 'I take initiative without being asked', reverse: false },
      { dimension: 'leadership', text: 'I can delegate tasks effectively', reverse: false },
      { dimension: 'leadership', text: 'Others look to me for guidance', reverse: false },
      { dimension: 'problemSolving', text: 'I break complex problems into manageable parts', reverse: false },
      { dimension: 'problemSolving', text: 'I consider multiple solutions before deciding', reverse: false },
      { dimension: 'problemSolving', text: 'I think creatively to overcome obstacles', reverse: false },
      { dimension: 'adaptability', text: 'I adjust well to new situations', reverse: false },
      { dimension: 'adaptability', text: 'I remain productive during periods of change', reverse: false },
      { dimension: 'adaptability', text: 'I learn new skills quickly', reverse: false },
      { dimension: 'emotionalIntelligence', text: 'I am aware of how my emotions affect others', reverse: false },
      { dimension: 'emotionalIntelligence', text: 'I can empathize with people from different backgrounds', reverse: false },
      { dimension: 'emotionalIntelligence', text: 'I manage my emotions effectively under stress', reverse: false },
      { dimension: 'timeManagement', text: 'I prioritize tasks effectively', reverse: false },
      { dimension: 'timeManagement', text: 'I rarely procrastinate on important tasks', reverse: false },
      { dimension: 'timeManagement', text: 'I balance multiple commitments well', reverse: false },
      { dimension: 'conflictResolution', text: 'I address conflicts directly and constructively', reverse: false },
      { dimension: 'conflictResolution', text: 'I seek win-win solutions in disagreements', reverse: false },
      { dimension: 'conflictResolution', text: 'I remain calm during heated discussions', reverse: false },
    ]

    for (const item of compItems) {
      questions.push({
        id: `comp_${index}`,
        questionText: item.text,
        questionType: 'COMPETENCY',
        dimension: item.dimension,
        category: `Competency - ${item.dimension.replace(/([A-Z])/g, ' $1').trim()}`,
        responseType: 'likert_5',
        minValue: 1,
        maxValue: 5,
        minLabel: 'Strongly Disagree',
        maxLabel: 'Strongly Agree',
        orderIndex: index,
        isReverseCoded: item.reverse,
      })
      index++
    }
  }

  return questions
}
