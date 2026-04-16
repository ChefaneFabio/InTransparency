import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://intransparency.eu'

/**
 * GET /api/badge/[projectId]/ob3
 * Returns Open Badges 3.0 / VerifiableCredential JSON-LD.
 * No auth required — public endpoint.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          university: true,
          email: true,
        },
      },
      portableBadges: {
        orderBy: { issuedAt: 'desc' },
        take: 1,
      },
    },
  })

  if (!project || project.verificationStatus !== 'VERIFIED') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const badge = project.portableBadges[0]
  const issuanceDate = badge?.issuedAt || project.verifiedAt || project.createdAt

  const credential = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.2.json',
    ],
    id: `${APP_URL}/api/badge/${projectId}/ob3`,
    type: ['VerifiableCredential', 'OpenBadgeCredential'],
    issuer: {
      id: `${APP_URL}`,
      type: ['Profile'],
      name: project.user?.university || 'InTransparency',
      url: APP_URL,
    },
    issuanceDate: issuanceDate.toISOString(),
    credentialSubject: {
      id: `${APP_URL}/students/${project.user?.id}`,
      type: ['AchievementSubject'],
      name: [project.user?.firstName, project.user?.lastName]
        .filter(Boolean)
        .join(' '),
      achievement: {
        id: `${APP_URL}/verify/project/${projectId}`,
        type: ['Achievement'],
        name: project.title,
        description: project.description.substring(0, 500),
        criteria: {
          narrative: `Project verified by ${project.user?.university || 'institution'} through InTransparency platform.`,
        },
        ...(project.skills.length > 0 && {
          tag: project.skills,
        }),
        ...(project.grade && {
          resultDescription: [
            {
              id: `${APP_URL}/verify/project/${projectId}#grade`,
              type: ['ResultDescription'],
              name: 'Grade',
              resultType: 'Result',
            },
          ],
        }),
      },
      ...(project.grade && {
        result: [
          {
            type: ['Result'],
            resultDescription: `${APP_URL}/verify/project/${projectId}#grade`,
            value: project.grade,
          },
        ],
      }),
    },
    ...(badge && {
      proof: {
        type: 'ContentHashProof',
        created: badge.issuedAt.toISOString(),
        contentHash: badge.contentHash,
        verificationMethod: `${APP_URL}/verify/project/${projectId}`,
      },
    }),
  }

  return NextResponse.json(credential, {
    headers: {
      'Content-Type': 'application/ld+json',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
