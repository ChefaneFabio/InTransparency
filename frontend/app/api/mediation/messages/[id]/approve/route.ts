import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { getUserScope, audit } from '@/lib/rbac/institution-scope'
import { checkPremium } from '@/lib/rbac/plan-check'

/**
 * POST /api/mediation/messages/[id]/approve
 * Staff approves a PENDING_REVIEW message as-is. Optional body: { edit }.
 * If `edit` is provided, sets status to EDITED with bodyApproved.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params

    const scope = await getUserScope(session.user.id)
    if (!scope) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const message = await prisma.mediationMessage.findUnique({
      where: { id },
      include: { thread: { select: { institutionId: true } } },
    })
    if (!message) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const isStaff = scope.staffInstitutionIds.includes(message.thread.institutionId)
    if (!isStaff && !scope.isPlatformAdmin) {
      return NextResponse.json({ error: 'Not a staff member of this institution' }, { status: 403 })
    }

    if (message.status !== 'PENDING_REVIEW') {
      return NextResponse.json({ error: 'Message not in PENDING_REVIEW' }, { status: 400 })
    }

    if (!scope.isPlatformAdmin) {
      const gate = await checkPremium(message.thread.institutionId, 'mediation.message.approve')
      if (gate) return gate
    }

    const body = await req.json().catch(() => ({}))
    const { edit } = body

    const now = new Date()
    const updated = await prisma.mediationMessage.update({
      where: { id },
      data: {
        status: edit ? 'EDITED' : 'APPROVED',
        bodyApproved: edit?.trim() || null,
        reviewedByStaffId: session.user.id,
        reviewedAt: now,
        deliveredAt: now, // Auto-deliver on approval
      },
    })

    // Transition to DELIVERED
    await prisma.mediationMessage.update({
      where: { id },
      data: { status: 'DELIVERED' },
    })

    await audit({
      actorId: session.user.id,
      actorRole: 'INSTITUTION_STAFF',
      action: edit ? 'mediation.message.edit' : 'mediation.message.approve',
      entityType: 'MediationMessage',
      entityId: id,
      payload: { threadId: message.threadId, edited: !!edit },
      institutionId: message.thread.institutionId,
    })

    return NextResponse.json({ message: updated })
  } catch (error) {
    console.error('Approve message error:', error)
    return NextResponse.json({ error: 'Failed to approve' }, { status: 500 })
  }
}
