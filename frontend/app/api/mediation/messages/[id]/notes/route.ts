import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { getUserScope, audit } from '@/lib/rbac/institution-scope'

/**
 * POST /api/mediation/messages/[id]/notes
 * Staff-only internal note on a specific message. Body: { note }
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
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json().catch(() => ({}))
    const { note } = body
    if (!note?.trim()) {
      return NextResponse.json({ error: 'Note content required' }, { status: 400 })
    }

    const staffNote = await prisma.mediationStaffNote.create({
      data: {
        messageId: id,
        staffId: session.user.id,
        note: note.trim(),
      },
    })

    await audit({
      actorId: session.user.id,
      actorRole: 'INSTITUTION_STAFF',
      action: 'mediation.message.note',
      entityType: 'MediationStaffNote',
      entityId: staffNote.id,
      payload: { messageId: id, threadId: message.threadId },
      institutionId: message.thread.institutionId,
    })

    return NextResponse.json({ note: staffNote }, { status: 201 })
  } catch (error) {
    console.error('Create staff note error:', error)
    return NextResponse.json({ error: 'Failed to add note' }, { status: 500 })
  }
}
