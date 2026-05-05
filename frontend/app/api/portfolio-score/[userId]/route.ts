import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { computePortfolioScore } from '@/lib/portfolio-scoring'

/**
 * GET /api/portfolio-score/[userId]
 * Returns trust score for a student.
 *
 * Access rules — score is profile-derived data and follows the same
 * visibility rules as the profile itself:
 *   - profilePublic=true → anyone can read.
 *   - profilePublic=false → only the owner or an admin can read.
 *
 * Returns 204 (No Content) on access denial to avoid leaking the difference
 * between "user does not exist" and "user has private profile".
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, profilePublic: true },
    })
    if (!user) {
      return new NextResponse(null, { status: 204 })
    }

    if (!user.profilePublic) {
      const session = await getServerSession(authOptions)
      const isOwner = session?.user?.id === userId
      const isAdmin = session?.user?.role === 'ADMIN'
      if (!isOwner && !isAdmin) {
        return new NextResponse(null, { status: 204 })
      }
    }

    // Check cache — wrapped in try/catch in case table doesn't exist yet
    const now = new Date()
    try {
      const cached = await prisma.portfolioScore.findFirst({
        where: {
          userId,
          expiresAt: { gt: now },
        },
        orderBy: { generatedAt: 'desc' },
      })

      if (cached) {
        return NextResponse.json({
          score: cached.score,
          badgeLevel: cached.badgeLevel,
          verificationScore: cached.verificationScore,
          endorsementScore: cached.endorsementScore,
          completenessScore: cached.completenessScore,
          aiAnalysisScore: cached.aiAnalysisScore,
          activityScore: cached.activityScore,
          predictionScore: cached.predictionScore,
          weights: cached.weights,
          cached: true,
          generatedAt: cached.generatedAt,
        })
      }
    } catch {
      // Cache table may not exist — continue to compute fresh
    }

    // Compute fresh — if user has no data, return empty score silently
    let result
    try {
      result = await computePortfolioScore(userId)
    } catch {
      // User exists but has no projects/data — return empty rather than error
      return new NextResponse(null, { status: 204 })
    }

    // Store in cache (24h TTL) — fail silently if table doesn't exist
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    try {
      await prisma.portfolioScore.create({
        data: {
          userId,
          score: result.score,
          verificationScore: result.verificationScore,
          endorsementScore: result.endorsementScore,
          completenessScore: result.completenessScore,
          aiAnalysisScore: result.aiAnalysisScore,
          activityScore: result.activityScore,
          predictionScore: result.predictionScore,
          weights: result.weights as any,
          badgeLevel: result.badgeLevel,
          generatedAt: now,
          expiresAt,
        },
      })
    } catch {
      // Cache write failed — still return the result
    }

    return NextResponse.json({ ...result, cached: false, generatedAt: now })
  } catch (error) {
    console.error('Portfolio score error:', error)
    return new NextResponse(null, { status: 204 })
  }
}
