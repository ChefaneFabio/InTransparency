import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import {
  buildSkillScoresFromProjects,
  identifySkillGaps,
  generateProjectIdeas,
  buildCareerPaths,
  buildRoadmap,
  calculateHireabilityScore,
  getMarketDemandFromJobs,
  type SkillScore,
  type SkillGap,
  type ProjectIdea,
  type CareerPath,
  type RoadmapMilestone,
} from '@/lib/skill-path'

const TIER_LIMITS = {
  FREE: {
    maxGaps: 3,
    maxProjectIdeas: 2,
    maxCareerPaths: 1,
    hasRoadmap: false,
    hasChallenges: false,
    refreshCooldown: 10080, // 7 days in minutes
  },
  STUDENT_PREMIUM: {
    maxGaps: 999,
    maxProjectIdeas: 999,
    maxCareerPaths: 999,
    hasRoadmap: true,
    hasChallenges: true,
    refreshCooldown: 60, // 1 hour in minutes
  },
} as const

type TierKey = keyof typeof TIER_LIMITS

function getTierLimits(tier: string) {
  if (tier in TIER_LIMITS) {
    return TIER_LIMITS[tier as TierKey]
  }
  return TIER_LIMITS.FREE
}

/**
 * GET /api/student/skill-path
 * Returns skill path recommendations for the authenticated student.
 * Checks cache first, then generates fresh analysis if needed.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const userTier = (session.user as any).subscriptionTier || 'FREE'
    const limits = getTierLimits(userTier)

    // Track page view
    prisma.analytics.create({
      data: {
        userId,
        eventType: 'PAGE_VIEW',
        eventName: 'skill_path_viewed',
        properties: { tier: userTier },
      },
    }).catch(() => {}) // Non-blocking

    // Check cache first
    const cached = await prisma.skillPathRecommendation.findUnique({
      where: { userId },
    })

    if (cached && new Date(cached.expiresAt) > new Date()) {
      // Return cached data with tier gating applied
      return NextResponse.json(
        applyTierGating(cached, limits, userTier)
      )
    }

    // Cache miss or expired - generate fresh analysis
    const result = await generateSkillPathAnalysis(userId)

    if (!result) {
      return NextResponse.json({
        data: null,
        tierLimits: { tier: userTier, ...limits },
        isLimited: userTier === 'FREE',
        isEmpty: true,
      })
    }

    // Upsert cache
    const ttlHours = 24
    const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000)

    const saved = await prisma.skillPathRecommendation.upsert({
      where: { userId },
      update: {
        currentSkills: result.currentSkills as any,
        skillGaps: result.skillGaps as any,
        recommendations: result.recommendations as any,
        careerPaths: result.careerPaths as any,
        hireabilityScore: result.hireabilityScore,
        generatedAt: new Date(),
        expiresAt,
      },
      create: {
        userId,
        currentSkills: result.currentSkills as any,
        skillGaps: result.skillGaps as any,
        recommendations: result.recommendations as any,
        careerPaths: result.careerPaths as any,
        hireabilityScore: result.hireabilityScore,
        generatedAt: new Date(),
        expiresAt,
      },
    })

    return NextResponse.json(
      applyTierGating(saved, limits, userTier)
    )
  } catch (error) {
    console.error('Error fetching skill path:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skill path recommendations' },
      { status: 500 }
    )
  }
}

async function generateSkillPathAnalysis(userId: string) {
  // Parallel queries for all needed data
  const [projects, jobs, competencies, softSkillAssessment] = await Promise.all([
    prisma.project.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        description: true,
        discipline: true,
        technologies: true,
        skills: true,
        tools: true,
        complexityScore: true,
        innovationScore: true,
        marketRelevance: true,
      },
    }),
    prisma.job.findMany({
      where: {
        status: 'ACTIVE',
        isPublic: true,
      },
      select: {
        requiredSkills: true,
        preferredSkills: true,
        title: true,
      },
      take: 200, // Sample of recent active jobs
    }),
    prisma.competency.findMany({
      where: {
        industryDemand: { not: null },
      },
      select: {
        name: true,
        industryDemand: true,
        discipline: true,
      },
    }),
    prisma.softSkillAssessment.findFirst({
      where: {
        userId,
        status: 'CERTIFIED',
      },
      include: {
        competencyProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  // If user has no projects, return null to show empty state
  if (projects.length === 0) {
    return null
  }

  // Build skill scores from projects
  const currentSkills = buildSkillScoresFromProjects(projects)

  // Get market demand from active jobs
  const marketDemand = getMarketDemandFromJobs(jobs)

  // Get competency-based demand
  const competencyDemand = new Map(
    competencies
      .filter(c => c.industryDemand !== null)
      .map(c => [c.name.toLowerCase(), c.industryDemand!])
  )

  // Identify skill gaps
  const skillGaps = identifySkillGaps(currentSkills, marketDemand, competencyDemand)

  // Primary discipline from projects
  const disciplineCounts = new Map<string, number>()
  for (const p of projects) {
    disciplineCounts.set(p.discipline, (disciplineCounts.get(p.discipline) || 0) + 1)
  }
  const primaryDiscipline = Array.from(disciplineCounts.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'TECHNOLOGY'

  // Generate project ideas
  const projectIdeas = generateProjectIdeas(skillGaps, primaryDiscipline)

  // Build career paths
  const careerPaths = buildCareerPaths(currentSkills, jobs)

  // Build roadmap
  const roadmap = buildRoadmap(skillGaps)

  // Extract soft skill data if available
  const softSkillData = softSkillAssessment?.competencyProfile
    ? {
        communication: softSkillAssessment.competencyProfile.communication,
        teamwork: softSkillAssessment.competencyProfile.teamwork,
        leadership: softSkillAssessment.competencyProfile.leadership,
        problemSolving: softSkillAssessment.competencyProfile.problemSolving,
        adaptability: softSkillAssessment.competencyProfile.adaptability,
        emotionalIntelligence: softSkillAssessment.competencyProfile.emotionalIntelligence,
        timeManagement: softSkillAssessment.competencyProfile.timeManagement,
        conflictResolution: softSkillAssessment.competencyProfile.conflictResolution,
      }
    : null

  // Calculate hireability score
  const hireabilityScore = calculateHireabilityScore(
    currentSkills,
    skillGaps,
    projects.length,
    softSkillData
  )

  return {
    currentSkills,
    skillGaps,
    recommendations: {
      projectIdeas,
      challenges: [], // Populated when company challenges feature is mature
      resources: [],
    },
    careerPaths,
    roadmap,
    hireabilityScore,
  }
}

function applyTierGating(
  record: any,
  limits: ReturnType<typeof getTierLimits>,
  tier: string
) {
  const currentSkills = record.currentSkills as SkillScore[]
  const allGaps = record.skillGaps as SkillGap[]
  const recommendations = record.recommendations as {
    projectIdeas: ProjectIdea[]
    challenges: ProjectIdea[]
    resources: any[]
  }
  const allCareerPaths = record.careerPaths as CareerPath[]

  // Apply limits
  const gatedGaps = allGaps.slice(0, limits.maxGaps)
  const gatedIdeas = recommendations.projectIdeas.slice(0, limits.maxProjectIdeas)
  const gatedPaths = allCareerPaths.slice(0, limits.maxCareerPaths)
  const gatedChallenges = limits.hasChallenges ? recommendations.challenges : []

  // Build roadmap from the gated gaps (or empty if tier doesn't allow)
  const roadmap = limits.hasRoadmap ? buildRoadmap(allGaps) : []

  return {
    data: {
      hireabilityScore: record.hireabilityScore,
      currentSkills,
      skillGaps: gatedGaps,
      projectIdeas: gatedIdeas,
      careerPaths: gatedPaths,
      roadmap,
      challenges: gatedChallenges,
      generatedAt: record.generatedAt,
      expiresAt: record.expiresAt,
    },
    tierLimits: {
      tier,
      ...limits,
    },
    isLimited: tier === 'FREE',
    totalGaps: allGaps.length,
    totalProjectIdeas: recommendations.projectIdeas.length,
    totalCareerPaths: allCareerPaths.length,
  }
}
