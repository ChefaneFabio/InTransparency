import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { getUserScope } from '@/lib/rbac/institution-scope'

/**
 * GET /api/mediation/threads/[id]
 * Returns the thread with messages. Role-scoped:
 * - Student: always their own bodyApproved (original hidden)
 * - Company: sees their own original, sees student replies as-is
 * - Staff: sees original + approved + notes
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params

    const scope = await getUserScope(session.user.id)
    if (!scope) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const thread = await prisma.mediationThread.findUnique({
      where: { id },
      include: {
        student: { select: { id: true, firstName: true, lastName: true, email: true, photo: true } },
        company: { select: { id: true, firstName: true, lastName: true, email: true, company: true } },
      },
    })
    if (!thread) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const isStudent = thread.studentId === session.user.id
    const isCompany = thread.companyUserId === session.user.id
    const isStaff = scope.staffInstitutionIds.includes(thread.institutionId)

    if (!isStudent && !isCompany && !isStaff && !scope.isPlatformAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const messages = await prisma.mediationMessage.findMany({
      where: { threadId: id },
      orderBy: { createdAt: 'asc' },
      include: {
        staffNotes: isStaff || scope.isPlatformAdmin ? {
          orderBy: { createdAt: 'desc' },
          include: { staff: { select: { id: true, firstName: true, lastName: true } } },
        } : false,
      },
    })

    // Shape messages per role
    const shapedMessages = messages.map(m => {
      if (isStudent) {
        // Student sees only DELIVERED / READ / REPLIED + their own replies
        if (m.direction === 'COMPANY_TO_STUDENT' &&
            !['DELIVERED', 'READ', 'REPLIED'].includes(m.status)) {
          return null
        }
        return {
          id: m.id,
          direction: m.direction,
          body: m.bodyApproved || m.bodyOriginal,
          status: m.status,
          createdAt: m.createdAt.toISOString(),
          deliveredAt: m.deliveredAt?.toISOString() || null,
        }
      }
      if (isCompany) {
        // Company sees own-original + all student replies
        if (m.direction === 'COMPANY_TO_STUDENT') {
          return {
            id: m.id,
            direction: m.direction,
            body: m.bodyOriginal,
            bodyAsDelivered: m.status === 'EDITED' ? m.bodyApproved : m.bodyOriginal,
            status: m.status,
            rejectionReason: m.rejectionReason,
            createdAt: m.createdAt.toISOString(),
            deliveredAt: m.deliveredAt?.toISOString() || null,
            readAt: m.readAt?.toISOString() || null,
          }
        }
        // Student-to-company always visible
        return {
          id: m.id,
          direction: m.direction,
          body: m.bodyOriginal,
          status: m.status,
          createdAt: m.createdAt.toISOString(),
        }
      }
      // Staff / admin — full detail
      return {
        id: m.id,
        direction: m.direction,
        bodyOriginal: m.bodyOriginal,
        bodyApproved: m.bodyApproved,
        status: m.status,
        reviewedByStaffId: m.reviewedByStaffId,
        reviewedAt: m.reviewedAt?.toISOString() || null,
        rejectionReason: m.rejectionReason,
        deliveredAt: m.deliveredAt?.toISOString() || null,
        readAt: m.readAt?.toISOString() || null,
        createdAt: m.createdAt.toISOString(),
        staffNotes: (m as any).staffNotes?.map((n: any) => ({
          id: n.id,
          note: n.note,
          staff: { id: n.staff.id, name: [n.staff.firstName, n.staff.lastName].filter(Boolean).join(' ') },
          createdAt: n.createdAt.toISOString(),
        })) || [],
      }
    }).filter(Boolean)

    return NextResponse.json({
      thread: {
        id: thread.id,
        subject: thread.subject,
        status: thread.status,
        student: thread.student,
        company: thread.company,
        institutionId: thread.institutionId,
        createdAt: thread.createdAt.toISOString(),
        updatedAt: thread.updatedAt.toISOString(),
      },
      messages: shapedMessages,
      viewerRole: isStudent ? 'STUDENT' : isCompany ? 'COMPANY' : isStaff ? 'STAFF' : 'ADMIN',
    })
  } catch (error) {
    console.error('GET mediation thread error:', error)
    return NextResponse.json({ error: 'Failed to load thread' }, { status: 500 })
  }
}
