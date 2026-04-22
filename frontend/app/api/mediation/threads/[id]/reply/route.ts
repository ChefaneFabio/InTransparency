import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { audit } from '@/lib/rbac/institution-scope'

/**
 * POST /api/mediation/threads/[id]/reply
 * Student or company replies to a thread. Student replies default to
 * APPROVED (no moderation in MVP). Company replies start PENDING_REVIEW
 * and require staff approval.
 *
 * Body: { body }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params

    const body = await req.json().catch(() => ({}))
    const { body: messageBody } = body
    if (!messageBody?.trim()) {
      return NextResponse.json({ error: 'body required' }, { status: 400 })
    }

    const thread = await prisma.mediationThread.findUnique({ where: { id } })
    if (!thread) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (thread.status === 'CLOSED') {
      return NextResponse.json({ error: 'Thread is closed' }, { status: 400 })
    }

    const isStudent = thread.studentId === session.user.id
    const isCompany = thread.companyUserId === session.user.id

    if (!isStudent && !isCompany) {
      return NextResponse.json({ error: 'Not a participant' }, { status: 403 })
    }

    const now = new Date()
    const message = await prisma.mediationMessage.create({
      data: {
        threadId: id,
        direction: isStudent ? 'STUDENT_TO_COMPANY' : 'COMPANY_TO_STUDENT',
        authorUserId: session.user.id,
        bodyOriginal: messageBody.trim(),
        status: isStudent ? 'APPROVED' : 'PENDING_REVIEW',
        deliveredAt: isStudent ? now : null,
      },
    })

    await prisma.mediationThread.update({
      where: { id },
      data: { updatedAt: now },
    })

    await audit({
      actorId: session.user.id,
      actorRole: isStudent ? 'STUDENT' : 'RECRUITER',
      action: isStudent ? 'mediation.message.student_reply' : 'mediation.message.company_reply',
      entityType: 'MediationMessage',
      entityId: message.id,
      payload: { threadId: id },
      institutionId: thread.institutionId,
    })

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error('Reply error:', error)
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 })
  }
}
