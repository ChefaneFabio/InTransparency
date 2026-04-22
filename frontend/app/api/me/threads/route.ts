import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/me/threads
 * Returns the current user's mediation threads.
 * - Student → threads where studentId = me, last message DELIVERED/READ/REPLIED
 * - Recruiter → threads where companyUserId = me, all statuses
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const me = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })
    if (!me) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const asStudent = me.role === 'STUDENT'
    const where = asStudent
      ? { studentId: session.user.id }
      : { companyUserId: session.user.id }

    const threads = await prisma.mediationThread.findMany({
      where,
      include: {
        student: { select: { id: true, firstName: true, lastName: true, email: true, photo: true, degree: true } },
        company: { select: { id: true, firstName: true, lastName: true, email: true, company: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true, status: true, direction: true, bodyApproved: true, bodyOriginal: true,
            createdAt: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    })

    const shaped = threads
      .map(t => {
        const last = t.messages[0]
        // Student: hide threads with no delivered message
        if (asStudent && last && last.direction === 'COMPANY_TO_STUDENT' &&
            !['DELIVERED', 'READ', 'REPLIED'].includes(last.status)) {
          return null
        }
        return {
          id: t.id,
          subject: t.subject,
          status: t.status,
          institutionId: t.institutionId,
          lastMessage: last ? {
            id: last.id,
            status: last.status,
            direction: last.direction,
            preview: ((last.bodyApproved || last.bodyOriginal) || '').slice(0, 140),
            createdAt: last.createdAt.toISOString(),
          } : null,
          counterpart: asStudent
            ? (t.company ? {
                id: t.company.id,
                name: t.company.company || [t.company.firstName, t.company.lastName].filter(Boolean).join(' '),
                email: t.company.email,
              } : null)
            : (t.student ? {
                id: t.student.id,
                name: [t.student.firstName, t.student.lastName].filter(Boolean).join(' ') || t.student.email,
                email: t.student.email,
                photo: t.student.photo,
              } : null),
          updatedAt: t.updatedAt.toISOString(),
        }
      })
      .filter(Boolean)

    return NextResponse.json({ threads: shaped, viewerRole: asStudent ? 'STUDENT' : 'COMPANY' })
  } catch (error) {
    console.error('GET /api/me/threads error:', error)
    return NextResponse.json({ error: 'Failed to load threads' }, { status: 500 })
  }
}
