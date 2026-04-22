import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { deriveContactMode } from '@/lib/mediation/contact-mode'
import { audit } from '@/lib/rbac/institution-scope'
import { checkPremium } from '@/lib/rbac/plan-check'

/**
 * POST /api/mediation/threads
 *   Recruiter starts a mediated thread. Requires the target student to
 *   be in MEDIATED mode. Creates the thread + the first message in
 *   PENDING_REVIEW.
 *
 * Body: { studentId, subject, body, applicationId? }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const { studentId, subject, body: messageBody, applicationId } = body

    if (!studentId || !subject?.trim() || !messageBody?.trim()) {
      return NextResponse.json({ error: 'studentId, subject, body required' }, { status: 400 })
    }

    // Only recruiters or platform admins can initiate
    const me = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
    if (!me || (me.role !== 'RECRUITER' && me.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Only recruiters can start mediated threads' }, { status: 403 })
    }

    // Verify the student is MEDIATED
    const cm = await deriveContactMode(studentId)
    if (cm.mode !== 'MEDIATED' || !cm.institutionId) {
      return NextResponse.json({
        error: 'Student is not in mediated mode',
        detail: 'Use the direct-unlock flow instead',
      }, { status: 400 })
    }

    // deriveContactMode only returns MEDIATED for PREMIUM institutions with
    // mediationEnabled=true, so this check is defence-in-depth.
    const gate = await checkPremium(cm.institutionId, 'mediation.message.submit')
    if (gate) return gate

    // Check for existing open thread between same company user + student — reuse if found
    let thread = await prisma.mediationThread.findFirst({
      where: {
        studentId,
        companyUserId: session.user.id,
        status: 'OPEN',
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!thread) {
      thread = await prisma.mediationThread.create({
        data: {
          institutionId: cm.institutionId,
          companyUserId: session.user.id,
          studentId,
          subject: subject.trim(),
          applicationId: applicationId || null,
        },
      })
    }

    const message = await prisma.mediationMessage.create({
      data: {
        threadId: thread.id,
        direction: 'COMPANY_TO_STUDENT',
        authorUserId: session.user.id,
        bodyOriginal: messageBody.trim(),
        status: 'PENDING_REVIEW',
      },
    })

    await audit({
      actorId: session.user.id,
      actorRole: 'RECRUITER',
      action: 'mediation.message.submit',
      entityType: 'MediationMessage',
      entityId: message.id,
      payload: { threadId: thread.id, studentId },
      institutionId: cm.institutionId,
    })

    return NextResponse.json({ thread, message }, { status: 201 })
  } catch (error) {
    console.error('Create mediation thread error:', error)
    return NextResponse.json({ error: 'Failed to create thread' }, { status: 500 })
  }
}
