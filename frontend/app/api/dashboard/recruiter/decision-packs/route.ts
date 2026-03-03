import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/recruiter/decision-packs
 * List all decision packs for the current recruiter.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const packs = await prisma.decisionPack.findMany({
      where: { recruiterId: session.user.id },
      include: {
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photo: true,
            university: true,
          },
        },
      },
      orderBy: { generatedAt: 'desc' },
    })

    return NextResponse.json({
      packs: packs.map((p) => ({
        id: p.id,
        candidateId: p.candidateId,
        candidateName: [p.candidate.firstName, p.candidate.lastName].filter(Boolean).join(' ') || 'Unknown',
        candidatePhoto: p.candidate.photo,
        candidateUniversity: p.candidate.university,
        matchScore: p.matchScore,
        generatedAt: p.generatedAt.toISOString(),
        expiresAt: p.expiresAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Error fetching decision packs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
