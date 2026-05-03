import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { audit } from '@/lib/audit'

const ACTIONS = ['send', 'signUniversity', 'signCompany', 'signStudent', 'complete', 'revoke'] as const
type Action = (typeof ACTIONS)[number]

const TERMINAL = new Set(['COMPLETED', 'REVOKED', 'EXPIRED'])

/**
 * POST /api/dashboard/university/conventions/[id]/transition
 * Body: { action: Action, note?: string }
 *
 * State machine:
 *   send             DRAFT              -> PENDING_SIGNATURES
 *   signUniversity   any non-terminal   -> flips signedByUniversity
 *   signCompany      any non-terminal   -> flips signedByCompany
 *   signStudent      any non-terminal   -> flips signedByStudent
 *   complete         ACTIVE             -> COMPLETED
 *   revoke           any non-terminal   -> REVOKED
 *
 * After any sign action, if all three flags are true the status is
 * auto-promoted from PENDING_SIGNATURES to ACTIVE.
 *
 * The endpoint is university-side only — company and student parties
 * sign physical/PDF copies; the career office records the signature
 * here and the audit log captures who flipped it. External e-sign can
 * later replace these flips with vendor callbacks without changing
 * the state machine.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const action: Action = body.action
  const note: string | undefined = body.note

  if (!action || !ACTIONS.includes(action)) {
    return NextResponse.json(
      { error: `action must be one of: ${ACTIONS.join(', ')}` },
      { status: 400 }
    )
  }

  const universityName = user.company || ''
  const conv = await prisma.stageConvention.findFirst({
    where: { id, universityName },
  })
  if (!conv) {
    return NextResponse.json({ error: 'Convention not found' }, { status: 404 })
  }

  if (TERMINAL.has(conv.status)) {
    return NextResponse.json(
      { error: `Convention is in terminal state ${conv.status}` },
      { status: 409 }
    )
  }

  const now = new Date()
  const data: Record<string, unknown> = {}
  let newStatus = conv.status

  switch (action) {
    case 'send':
      if (conv.status !== 'DRAFT') {
        return NextResponse.json(
          { error: `send requires DRAFT status, got ${conv.status}` },
          { status: 409 }
        )
      }
      newStatus = 'PENDING_SIGNATURES'
      data.status = newStatus
      break

    case 'signUniversity':
      data.signedByUniversity = true
      data.universitySignDate = now
      break

    case 'signCompany':
      data.signedByCompany = true
      data.companySignDate = now
      break

    case 'signStudent':
      data.signedByStudent = true
      data.studentSignDate = now
      break

    case 'complete':
      if (conv.status !== 'ACTIVE') {
        return NextResponse.json(
          { error: `complete requires ACTIVE status, got ${conv.status}` },
          { status: 409 }
        )
      }
      newStatus = 'COMPLETED'
      data.status = newStatus
      break

    case 'revoke':
      newStatus = 'REVOKED'
      data.status = newStatus
      break
  }

  const allSignedAfter =
    (action === 'signUniversity' || conv.signedByUniversity) &&
    (action === 'signCompany' || conv.signedByCompany) &&
    (action === 'signStudent' || conv.signedByStudent)

  if (
    (action === 'signUniversity' || action === 'signCompany' || action === 'signStudent') &&
    allSignedAfter &&
    conv.status !== 'ACTIVE'
  ) {
    newStatus = 'ACTIVE'
    data.status = newStatus
  }

  const updated = await prisma.stageConvention.update({
    where: { id: conv.id },
    data,
  })

  await audit({
    actorId: user.id,
    actorEmail: user.email,
    actorRole: user.role,
    action: 'CONVENTION_TRANSITION',
    targetType: 'StageConvention',
    targetId: conv.id,
    context: {
      transition: action,
      from: conv.status,
      to: newStatus,
      note: note || null,
    },
  })

  return NextResponse.json({ success: true, convention: updated })
}
