import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { generateDecisionPack } from '@/lib/decision-pack'

/**
 * GET /api/decision-pack/[candidateId]
 * Returns a full hiring dossier for a candidate.
 * RECRUITER auth required.
 * Uses DecisionPack cache with 7-day TTL.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ candidateId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as { id?: string; role?: string } | undefined
    if (!user?.id || user.role !== 'RECRUITER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { candidateId } = await params
    const url = new URL(request.url)
    const jobId = url.searchParams.get('jobId') || undefined

    // Check recruiter has active contact OR existing pack
    const hasContact = await prisma.contactUsage.findFirst({
      where: {
        recruiterId: user.id,
        recipientId: candidateId,
      },
    })

    // Check cache (7-day TTL)
    const now = new Date()
    const cached = await prisma.decisionPack.findFirst({
      where: {
        recruiterId: user.id,
        candidateId,
        jobId: jobId || null,
        expiresAt: { gt: now },
      },
    })

    if (cached) {
      return NextResponse.json({
        ...(cached.content as object),
        matchScore: cached.matchScore,
        cached: true,
        generatedAt: cached.generatedAt,
      })
    }

    // If no contact access and no existing cache, check access
    if (!hasContact) {
      return NextResponse.json(
        { error: 'Contact access required. Purchase a contact credit first.' },
        { status: 402 }
      )
    }

    // Generate fresh pack
    const pack = await generateDecisionPack(user.id, candidateId, jobId)

    // Store in cache
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days
    await prisma.decisionPack.upsert({
      where: {
        recruiterId_candidateId_jobId: {
          recruiterId: user.id,
          candidateId,
          jobId: jobId || '',
        },
      },
      create: {
        recruiterId: user.id,
        candidateId,
        jobId: jobId || null,
        content: JSON.parse(JSON.stringify(pack)),
        matchScore: pack.matchScore,
        generatedAt: now,
        expiresAt,
      },
      update: {
        content: JSON.parse(JSON.stringify(pack)),
        matchScore: pack.matchScore,
        generatedAt: now,
        expiresAt,
      },
    })

    return NextResponse.json({ ...pack, cached: false })
  } catch (error) {
    console.error('Decision pack error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
