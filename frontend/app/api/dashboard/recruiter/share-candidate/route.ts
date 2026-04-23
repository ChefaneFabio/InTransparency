import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { audit } from '@/lib/rbac/institution-scope'

export const maxDuration = 15

const DEFAULT_TTL_DAYS = 7
const MAX_TTL_DAYS = 30

/**
 * POST /api/dashboard/recruiter/share-candidate
 * Body: { candidateId, ttlDays?, note?, recipientEmail? }
 * Creates a signed, token-gated link that renders the candidate's evidence
 * pack publicly (no login). Audited as CANDIDATE_SHARE_CREATED.
 *
 * GET /api/dashboard/recruiter/share-candidate
 * Lists this recruiter's active shares (not expired, not revoked).
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'RECRUITER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const { candidateId, ttlDays, note, recipientEmail } = body as {
      candidateId?: string
      ttlDays?: number
      note?: string
      recipientEmail?: string
    }

    if (!candidateId || typeof candidateId !== 'string') {
      return NextResponse.json({ error: 'candidateId required' }, { status: 400 })
    }

    // Confirm the candidate exists and has a public profile
    const candidate = await prisma.user.findUnique({
      where: { id: candidateId },
      select: { id: true, role: true, profilePublic: true },
    })
    if (!candidate || candidate.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
    }
    if (!candidate.profilePublic) {
      return NextResponse.json(
        { error: 'Candidate profile is private and cannot be shared' },
        { status: 403 }
      )
    }

    const safeTtl = Math.min(
      MAX_TTL_DAYS,
      Math.max(1, typeof ttlDays === 'number' ? ttlDays : DEFAULT_TTL_DAYS)
    )
    const expiresAt = new Date(Date.now() + safeTtl * 86_400_000)
    const token = randomBytes(32).toString('base64url')

    const share = await prisma.candidateShare.create({
      data: {
        token,
        candidateId,
        sharedByUserId: session.user.id,
        note: note?.slice(0, 2000) ?? null,
        recipientEmail: recipientEmail?.slice(0, 255) ?? null,
        expiresAt,
      },
    })

    // AI Act compliance: audit the share creation
    await audit({
      actorId: session.user.id,
      actorRole: 'RECRUITER',
      action: 'CANDIDATE_SHARE_CREATED',
      entityType: 'User',
      entityId: candidateId,
      payload: { shareId: share.id, ttlDays: safeTtl, hasRecipient: !!recipientEmail },
    })

    return NextResponse.json({
      share: {
        id: share.id,
        token: share.token,
        expiresAt: share.expiresAt.toISOString(),
        createdAt: share.createdAt.toISOString(),
        url: `/shared/candidate/${share.token}`,
      },
    })
  } catch (error) {
    console.error('POST /api/dashboard/recruiter/share-candidate error:', error)
    return NextResponse.json({ error: 'Failed to create share link' }, { status: 500 })
  }
}

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'RECRUITER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const shares = await prisma.candidateShare.findMany({
      where: {
        sharedByUserId: session.user.id,
        revokedAt: null,
      },
      include: {
        candidate: {
          select: { id: true, firstName: true, lastName: true, photo: true, university: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    const shaped = shares.map(s => ({
      id: s.id,
      token: s.token,
      candidate: s.candidate
        ? {
            id: s.candidate.id,
            name:
              `${s.candidate.firstName ?? ''} ${s.candidate.lastName ?? ''}`.trim() ||
              'Candidate',
            photo: s.candidate.photo,
            university: s.candidate.university,
          }
        : null,
      recipientEmail: s.recipientEmail,
      note: s.note,
      expiresAt: s.expiresAt.toISOString(),
      expired: s.expiresAt.getTime() < now.getTime(),
      createdAt: s.createdAt.toISOString(),
      firstViewedAt: s.firstViewedAt?.toISOString() ?? null,
      lastViewedAt: s.lastViewedAt?.toISOString() ?? null,
      viewCount: s.viewCount,
      url: `/shared/candidate/${s.token}`,
    }))

    return NextResponse.json({ shares: shaped })
  } catch (error) {
    console.error('GET /api/dashboard/recruiter/share-candidate error:', error)
    return NextResponse.json({ error: 'Failed to load shares' }, { status: 500 })
  }
}
