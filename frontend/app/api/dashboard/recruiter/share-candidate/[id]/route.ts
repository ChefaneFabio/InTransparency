import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { audit } from '@/lib/rbac/institution-scope'

/**
 * DELETE /api/dashboard/recruiter/share-candidate/[id]
 * Revoke a share link. Marks revokedAt; the public page will 410 from here on.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'RECRUITER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params

    const share = await prisma.candidateShare.findUnique({
      where: { id },
      select: { id: true, sharedByUserId: true, candidateId: true, revokedAt: true },
    })
    if (!share || share.sharedByUserId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    if (share.revokedAt) {
      return NextResponse.json({ ok: true, alreadyRevoked: true })
    }

    await prisma.candidateShare.update({
      where: { id },
      data: { revokedAt: new Date() },
    })

    await audit({
      actorId: session.user.id,
      actorRole: 'RECRUITER',
      action: 'CANDIDATE_SHARE_REVOKED',
      entityType: 'User',
      entityId: share.candidateId,
      payload: { shareId: id },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE share error:', error)
    return NextResponse.json({ error: 'Failed to revoke share' }, { status: 500 })
  }
}
