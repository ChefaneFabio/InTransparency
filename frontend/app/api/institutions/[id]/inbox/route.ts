import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { getUserScope } from '@/lib/rbac/institution-scope'

/**
 * GET /api/institutions/[id]/inbox
 * Staff-only queue of mediation messages. Supports filter:
 * - status: PENDING_REVIEW | APPROVED | EDITED | REJECTED | all
 * - overdueSince: hours (e.g. ?overdueSince=48 for SLA alerts)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id: institutionId } = await params

    const scope = await getUserScope(session.user.id)
    if (!scope || (!scope.isPlatformAdmin && !scope.staffInstitutionIds.includes(institutionId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const url = new URL(req.url)
    const status = url.searchParams.get('status')
    const overdueSince = Number(url.searchParams.get('overdueSince')) || null

    const where: any = {
      thread: { institutionId },
      direction: 'COMPANY_TO_STUDENT',
    }
    if (status && status !== 'all') where.status = status
    if (overdueSince) {
      where.status = 'PENDING_REVIEW'
      where.createdAt = { lt: new Date(Date.now() - overdueSince * 3_600_000) }
    }

    const messages = await prisma.mediationMessage.findMany({
      where,
      include: {
        thread: {
          include: {
            student: { select: { id: true, firstName: true, lastName: true, email: true, photo: true, degree: true } },
            company: { select: { id: true, firstName: true, lastName: true, email: true, company: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    const shaped = messages.map(m => {
      const now = Date.now()
      const ageHours = Math.round((now - m.createdAt.getTime()) / 3_600_000)
      return {
        id: m.id,
        threadId: m.threadId,
        status: m.status,
        bodyOriginal: m.bodyOriginal,
        bodyApproved: m.bodyApproved,
        rejectionReason: m.rejectionReason,
        ageHours,
        isOverdue: m.status === 'PENDING_REVIEW' && ageHours >= 48,
        createdAt: m.createdAt.toISOString(),
        reviewedAt: m.reviewedAt?.toISOString() || null,
        subject: m.thread.subject,
        student: m.thread.student
          ? {
              id: m.thread.student.id,
              name: [m.thread.student.firstName, m.thread.student.lastName].filter(Boolean).join(' ') || m.thread.student.email,
              email: m.thread.student.email,
              photo: m.thread.student.photo,
              degree: m.thread.student.degree,
            }
          : null,
        company: m.thread.company
          ? {
              id: m.thread.company.id,
              name: m.thread.company.company || [m.thread.company.firstName, m.thread.company.lastName].filter(Boolean).join(' '),
              email: m.thread.company.email,
            }
          : null,
      }
    })

    // Summary counts
    const [pending, approved, rejected] = await Promise.all([
      prisma.mediationMessage.count({
        where: { thread: { institutionId }, direction: 'COMPANY_TO_STUDENT', status: 'PENDING_REVIEW' },
      }),
      prisma.mediationMessage.count({
        where: { thread: { institutionId }, direction: 'COMPANY_TO_STUDENT', status: { in: ['APPROVED', 'EDITED', 'DELIVERED', 'READ', 'REPLIED'] } },
      }),
      prisma.mediationMessage.count({
        where: { thread: { institutionId }, direction: 'COMPANY_TO_STUDENT', status: 'REJECTED' },
      }),
    ])

    return NextResponse.json({
      messages: shaped,
      summary: {
        pending,
        approved,
        rejected,
        overdue: shaped.filter(m => m.isOverdue).length,
      },
    })
  } catch (error) {
    console.error('Inbox GET error:', error)
    return NextResponse.json({ error: 'Failed to load inbox' }, { status: 500 })
  }
}
