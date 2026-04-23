import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { audit } from '@/lib/rbac/institution-scope'
import { getCurrentSkillGraph } from '@/lib/skill-delta'

export const maxDuration = 15

/**
 * GET /api/shared/candidate/[token]
 * PUBLIC — no auth. Token is the gate. Validates expiry + revocation,
 * increments view counters, audits the access, and returns the candidate's
 * evidence pack (profile, verified projects, skill graph summary).
 *
 * Returns 410 Gone for revoked/expired links; 404 for unknown tokens.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    if (!token || typeof token !== 'string' || token.length < 20) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
    }

    const share = await prisma.candidateShare.findUnique({
      where: { token },
      include: {
        sharedBy: { select: { id: true, firstName: true, lastName: true } },
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photo: true,
            tagline: true,
            bio: true,
            university: true,
            degree: true,
            graduationYear: true,
            gpa: true,
            profilePublic: true,
            projects: {
              where: { isPublic: true },
              select: {
                id: true,
                title: true,
                description: true,
                discipline: true,
                skills: true,
                tools: true,
                technologies: true,
                innovationScore: true,
                complexityScore: true,
                githubUrl: true,
                liveUrl: true,
                imageUrl: true,
                verificationStatus: true,
                createdAt: true,
              },
              orderBy: [{ innovationScore: 'desc' }, { createdAt: 'desc' }],
              take: 6,
            },
          },
        },
      },
    })

    if (!share) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    if (share.revokedAt) {
      return NextResponse.json({ error: 'Link revoked', reason: 'revoked' }, { status: 410 })
    }
    if (share.expiresAt.getTime() < Date.now()) {
      return NextResponse.json({ error: 'Link expired', reason: 'expired' }, { status: 410 })
    }
    if (!share.candidate || !share.candidate.profilePublic) {
      return NextResponse.json({ error: 'Candidate unavailable' }, { status: 410 })
    }

    // Record view (fire-and-forget)
    const now = new Date()
    prisma.candidateShare
      .update({
        where: { id: share.id },
        data: {
          lastViewedAt: now,
          firstViewedAt: share.firstViewedAt ?? now,
          viewCount: { increment: 1 },
        },
      })
      .catch(err => console.error('share view increment failed:', err))

    // Audit (AI Act). Anonymous viewer — actorId is null, action tells us what.
    audit({
      actorId: null, // external viewer, no account
      actorRole: 'SHARE_RECIPIENT',
      action: 'CANDIDATE_SHARE_VIEWED',
      entityType: 'User',
      entityId: share.candidate.id,
      payload: {
        shareId: share.id,
        recruiterId: share.sharedByUserId,
        ua: req.headers.get('user-agent')?.slice(0, 200) ?? null,
      },
    }).catch(() => {})

    const verifiedProjectCount = share.candidate.projects.filter(
      p => p.verificationStatus === 'VERIFIED'
    ).length

    // Compact skill graph summary (top 12 by level)
    const graph = await getCurrentSkillGraph(share.candidate.id).catch(() => [])
    const topSkills = graph.slice(0, 12).map(row => ({
      skillTerm: row.skillTerm,
      currentLevel: row.currentLevel,
      sourceCount: row.sourceCount,
    }))

    return NextResponse.json({
      candidate: {
        id: share.candidate.id,
        name: `${share.candidate.firstName ?? ''} ${share.candidate.lastName ?? ''}`.trim() ||
          'Candidate',
        photo: share.candidate.photo,
        tagline: share.candidate.tagline,
        bio: share.candidate.bio,
        university: share.candidate.university,
        degree: share.candidate.degree,
        graduationYear: share.candidate.graduationYear,
        gpa: share.candidate.gpa ? Number(share.candidate.gpa) : null,
        projects: share.candidate.projects.map(p => ({
          ...p,
          createdAt: p.createdAt.toISOString(),
        })),
        verifiedProjectCount,
        topSkills,
      },
      share: {
        sharedBy:
          `${share.sharedBy?.firstName ?? ''} ${share.sharedBy?.lastName ?? ''}`.trim() ||
          'A recruiter',
        note: share.note,
        expiresAt: share.expiresAt.toISOString(),
        viewCount: share.viewCount + 1,
      },
    })
  } catch (error) {
    console.error('GET /api/shared/candidate/[token] error:', error)
    return NextResponse.json({ error: 'Failed to load share' }, { status: 500 })
  }
}
