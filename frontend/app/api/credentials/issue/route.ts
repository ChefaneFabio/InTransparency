import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import {
  issueEndorsementCredential,
  issueStageCompletionCredential,
} from '@/lib/verifiable-credentials'

/**
 * POST /api/credentials/issue
 * Body: { sourceType: 'ProfessorEndorsement' | 'StageExperience', sourceId: string }
 *
 * Issues a Verifiable Credential. Authorization:
 *  - ProfessorEndorsement: the subject student OR the issuing professor (via token) OR university admin
 *  - StageExperience: the subject student OR university admin
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { sourceType, sourceId } = await req.json()
  if (!sourceType || !sourceId) {
    return NextResponse.json({ error: 'sourceType and sourceId required' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    if (sourceType === 'ProfessorEndorsement') {
      const endorsement = await prisma.professorEndorsement.findUnique({ where: { id: sourceId } })
      if (!endorsement) return NextResponse.json({ error: 'Endorsement not found' }, { status: 404 })
      const authorized =
        endorsement.studentId === user.id ||
        user.role === 'ADMIN' ||
        (user.role === 'UNIVERSITY' && endorsement.university === (user.company ?? ''))
      if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      const vc = await issueEndorsementCredential(sourceId)
      return NextResponse.json({
        credential: {
          id: vc.id,
          type: vc.credentialType,
          shareToken: vc.shareToken,
          shareUrl: `/credentials/verify/${vc.shareToken}`,
          issuedAt: vc.issuedAt.toISOString(),
        },
      })
    }

    if (sourceType === 'StageExperience') {
      const stage = await prisma.stageExperience.findUnique({ where: { id: sourceId } })
      if (!stage) return NextResponse.json({ error: 'Stage not found' }, { status: 404 })
      const authorized =
        stage.studentId === user.id ||
        user.role === 'ADMIN' ||
        (user.role === 'UNIVERSITY' && stage.universityName === (user.company ?? ''))
      if (!authorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      const vc = await issueStageCompletionCredential(sourceId)
      return NextResponse.json({
        credential: {
          id: vc.id,
          type: vc.credentialType,
          shareToken: vc.shareToken,
          shareUrl: `/credentials/verify/${vc.shareToken}`,
          issuedAt: vc.issuedAt.toISOString(),
        },
      })
    }

    return NextResponse.json({ error: 'Unsupported sourceType' }, { status: 400 })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('Issue credential error:', error)
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
