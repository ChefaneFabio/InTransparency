import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { computePlacementPrediction } from '@/lib/placement-prediction'

/**
 * GET /api/predictions/[studentId]
 * Returns placement prediction for a student.
 * Auth required: RECRUITER, UNIVERSITY, or ADMIN role.
 * Uses PlacementPrediction cache with 48h TTL.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as { id?: string; role?: string } | undefined
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allowedRoles = ['RECRUITER', 'UNIVERSITY', 'ADMIN']
    if (!allowedRoles.includes(user.role || '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { studentId } = await params

    // Verify student exists and is a STUDENT
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: { id: true, role: true },
    })

    if (!student || student.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Check cache (48h TTL)
    const now = new Date()
    const cached = await prisma.placementPrediction.findFirst({
      where: {
        studentId,
        expiresAt: { gt: now },
      },
      orderBy: { generatedAt: 'desc' },
    })

    if (cached) {
      return NextResponse.json({
        probability: cached.probability,
        signalWeights: cached.signalWeights,
        signalValues: cached.signalValues,
        topFactors: cached.topFactors,
        generatedAt: cached.generatedAt,
        cached: true,
      })
    }

    // Compute fresh prediction
    const prediction = await computePlacementPrediction(studentId)

    // Store in cache
    const expiresAt = new Date(now.getTime() + 48 * 60 * 60 * 1000) // 48h
    await prisma.placementPrediction.create({
      data: {
        studentId,
        probability: prediction.probability,
        signalWeights: Object.fromEntries(
          prediction.signals.map((s) => [s.name, s.weight])
        ),
        signalValues: Object.fromEntries(
          prediction.signals.map((s) => [s.name, s.value])
        ),
        topFactors: prediction.topFactors,
        generatedAt: now,
        expiresAt,
      },
    })

    return NextResponse.json({
      probability: prediction.probability,
      signalWeights: Object.fromEntries(
        prediction.signals.map((s) => [s.name, s.weight])
      ),
      signalValues: Object.fromEntries(
        prediction.signals.map((s) => [s.name, s.value])
      ),
      topFactors: prediction.topFactors,
      generatedAt: now,
      cached: false,
    })
  } catch (error) {
    console.error('Prediction error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
