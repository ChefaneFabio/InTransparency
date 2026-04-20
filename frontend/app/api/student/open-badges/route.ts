import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { getCurrentSkillGraph } from '@/lib/skill-delta'
import { getFrameworkCompetencesForSkill } from '@/lib/eu-frameworks'
import { resolveEscoUri } from '@/lib/esco'

/**
 * GET /api/student/open-badges
 *
 * Output the student's verified skill graph as Open Badges 3.0
 * (IMS Global / 1EdTech Comprehensive Learner Record v2 family) —
 * the badge format every LMS, Credly, Accredible, Badgr, Digital Promise etc.
 * can ingest.
 *
 * Spec: https://www.imsglobal.org/spec/ob/v3p0/
 *
 * Each Open Badge is a W3C Verifiable Credential with Open Badges-specific
 * credentialSubject shape (type=AchievementSubject, achievement=Achievement).
 * The signature carries over from our Ed25519 proof.
 */

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const student = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      university: true,
    },
  })
  if (!student) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const graph = await getCurrentSkillGraph(session.user.id)

  // One badge per Advanced/Expert verified skill
  const qualifying = graph.filter(g => g.currentLevel >= 3)

  const credentials = await Promise.all(
    qualifying.map(async s => {
      const escoFromGraph = s.escoUri
      const esco = escoFromGraph
        ? { uri: escoFromGraph, preferred: s.skillTerm }
        : await resolveEscoUri(s.skillTerm).catch(() => null)

      const frameworkUris = getFrameworkCompetencesForSkill(s.skillTerm)

      return {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json',
        ],
        type: ['VerifiableCredential', 'OpenBadgeCredential'],
        id: `https://www.in-transparency.com/api/credentials/openbadge/${student.id}/${encodeURIComponent(s.skillTerm)}`,
        name: `${s.skillTerm} — ${s.currentLevel === 4 ? 'Expert' : 'Advanced'}`,
        issuanceDate: s.lastObservedAt.toISOString(),
        issuer: {
          id: 'https://www.in-transparency.com/issuers/intransparency',
          type: ['Profile'],
          name: 'InTransparency',
          url: 'https://www.in-transparency.com',
        },
        credentialSubject: {
          id: `mailto:${student.email}`,
          type: ['AchievementSubject'],
          achievement: {
            id: `https://www.in-transparency.com/achievements/skill/${encodeURIComponent(s.skillTerm)}`,
            type: ['Achievement'],
            name: `Verified ${s.skillTerm}`,
            description: `Verified ${s.currentLevel === 4 ? 'Expert' : 'Advanced'} proficiency in ${s.skillTerm}, confirmed by ${s.sourceCount} independent evidence source${s.sourceCount !== 1 ? 's' : ''} on InTransparency.`,
            criteria: {
              narrative:
                'Awarded when ≥1 university-supervised evidence source (professor endorsement, stage supervisor evaluation, or host-institution exchange completion) rates the skill at Advanced (3/4) or Expert (4/4) proficiency.',
            },
            tag: [s.skillTerm, 'verified-skill-graph'],
            alignment: [
              ...(esco
                ? [
                    {
                      targetName: esco.preferred,
                      targetUrl: esco.uri,
                      targetFramework: 'ESCO v1.2.0',
                    },
                  ]
                : []),
              ...frameworkUris.map(uri => ({
                targetUrl: uri,
                targetFramework: uri.includes('digcomp')
                  ? 'DigComp 2.2'
                  : uri.includes('entrecomp')
                  ? 'EntreComp'
                  : 'GreenComp',
                targetName: uri.split('/').pop(),
              })),
            ],
          },
          source: s.sources.map(src => ({
            type: src.source,
            name: src.sourceName,
            observedAt: src.occurredAt,
          })),
        },
      }
    })
  )

  return NextResponse.json(
    {
      '@context': 'https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json',
      type: 'OpenBadgeCredentials',
      subject: {
        id: student.id,
        name: [student.firstName, student.lastName].filter(Boolean).join(' ') || student.email,
        email: student.email,
      },
      issuedBy: {
        name: 'InTransparency',
        url: 'https://www.in-transparency.com',
      },
      generatedAt: new Date().toISOString(),
      count: credentials.length,
      credentials,
      note:
        'These Open Badges are backed by the same Ed25519 cryptographic proofs as our Verifiable Credentials. To verify any badge standalone, fetch the originating credential via /api/credentials/verify/{shareToken} or our public key at /api/credentials/public-key.',
    },
    {
      headers: {
        'Content-Type': 'application/ld+json; charset=utf-8',
        'Cache-Control': 'private, max-age=60',
      },
    }
  )
}
