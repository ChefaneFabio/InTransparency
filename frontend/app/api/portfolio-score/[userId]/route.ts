import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { computePortfolioScore } from '@/lib/portfolio-scoring'

/**
 * GET /api/portfolio-score/[userId]
 * Public endpoint — returns trust score for a student.
 * Uses PortfolioScore cache with 24h TTL.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params

    // Check cache
    const now = new Date()
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

    // Compute fresh
    const result = await computePortfolioScore(userId)

    // Store in cache (24h TTL)
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)
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

    return NextResponse.json({ ...result, cached: false, generatedAt: now })
  } catch (error) {
    console.error('Portfolio score error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
