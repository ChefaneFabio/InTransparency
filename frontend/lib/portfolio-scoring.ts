import prisma from '@/lib/prisma'

interface PortfolioScoreResult {
  score: number
  verificationScore: number
  endorsementScore: number
  completenessScore: number
  aiAnalysisScore: number
  activityScore: number
  predictionScore: number
  badgeLevel: string
  weights: Record<string, number>
}

const WEIGHTS = {
  verification: 0.25,
  endorsement: 0.20,
  completeness: 0.15,
  aiAnalysis: 0.20,
  activity: 0.10,
  prediction: 0.10,
}

function getBadgeLevel(score: number): string {
  if (score >= 80) return 'PLATINUM'
  if (score >= 60) return 'GOLD'
  if (score >= 40) return 'SILVER'
  return 'BRONZE'
}

/**
 * Compute a portfolio trust score (0-100) for a student.
 */
export async function computePortfolioScore(userId: string): Promise<PortfolioScoreResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      projects: {
        select: {
          id: true,
          verificationStatus: true,
          universityVerified: true,
          innovationScore: true,
          complexityScore: true,
          marketRelevance: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  })

  if (!user) {
    return {
      score: 0,
      verificationScore: 0,
      endorsementScore: 0,
      completenessScore: 0,
      aiAnalysisScore: 0,
      activityScore: 0,
      predictionScore: 0,
      badgeLevel: 'BRONZE',
      weights: WEIGHTS,
    }
  }

  // 1. Verification Score (0-100): % of projects verified
  const totalProjects = user.projects.length
  const verifiedProjects = user.projects.filter((p) => p.verificationStatus === 'VERIFIED').length
  const verificationScore = totalProjects > 0
    ? Math.round((verifiedProjects / totalProjects) * 100)
    : 0

  // 2. Endorsement Score (0-100): quality + quantity
  const endorsements = await prisma.professorEndorsement.findMany({
    where: {
      projectId: { in: user.projects.map((p) => p.id) },
      status: 'VERIFIED',
    },
    select: { rating: true },
  })
  const endorsementCount = endorsements.length
  const avgEndorsementRating = endorsementCount > 0
    ? endorsements.reduce((sum, e) => sum + (e.rating || 3), 0) / endorsementCount
    : 0
  // Score: combination of count (up to 5) and quality
  const endorsementScore = Math.min(
    Math.round(
      (Math.min(endorsementCount, 5) / 5) * 60 +
      (avgEndorsementRating / 5) * 40
    ),
    100
  )

  // 3. Completeness Score (0-100): profile fields filled
  const fields = [
    user.firstName,
    user.lastName,
    user.bio,
    user.university,
    user.degree,
    user.photo,
    user.portfolioUrl,
    user.profilePublic ? 'yes' : null,
    totalProjects > 0 ? 'yes' : null,
  ]
  const filledCount = fields.filter(Boolean).length
  const completenessScore = Math.round((filledCount / fields.length) * 100)

  // 4. AI Analysis Score (0-100): average AI scores across projects
  const aiScores: number[] = []
  for (const p of user.projects) {
    const scores = [p.innovationScore, p.complexityScore, p.marketRelevance].filter((s): s is number => s !== null)
    if (scores.length > 0) {
      aiScores.push(scores.reduce((a, b) => a + b, 0) / scores.length)
    }
  }
  const aiAnalysisScore = aiScores.length > 0
    ? Math.round(aiScores.reduce((a, b) => a + b, 0) / aiScores.length)
    : 0

  // 5. Activity Score (0-100): recency of project updates
  const now = Date.now()
  const recentProject = user.projects
    .map((p) => p.updatedAt.getTime())
    .sort((a, b) => b - a)[0]
  const daysSinceUpdate = recentProject
    ? (now - recentProject) / (1000 * 60 * 60 * 24)
    : 365
  const activityScore = Math.max(0, Math.round(100 - (daysSinceUpdate / 3.65)))

  // 6. Prediction Score (0-100): from PlacementPrediction
  const prediction = await prisma.placementPrediction.findFirst({
    where: { studentId: userId },
    orderBy: { generatedAt: 'desc' },
    select: { probability: true },
  })
  const predictionScore = prediction
    ? Math.round(prediction.probability * 100)
    : 30 // Default baseline

  // Weighted total
  const score = Math.round(
    verificationScore * WEIGHTS.verification +
    endorsementScore * WEIGHTS.endorsement +
    completenessScore * WEIGHTS.completeness +
    aiAnalysisScore * WEIGHTS.aiAnalysis +
    activityScore * WEIGHTS.activity +
    predictionScore * WEIGHTS.prediction
  )

  return {
    score: Math.min(score, 100),
    verificationScore,
    endorsementScore,
    completenessScore,
    aiAnalysisScore,
    activityScore,
    predictionScore,
    badgeLevel: getBadgeLevel(score),
    weights: WEIGHTS,
  }
}
