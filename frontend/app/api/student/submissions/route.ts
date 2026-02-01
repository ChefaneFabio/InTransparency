import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/student/submissions
 * Get all submissions for the current student
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'STUDENT' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {
      studentId: session.user.id
    }

    if (status) where.status = status

    const submissions = await prisma.challengeSubmission.findMany({
      where,
      include: {
        challenge: {
          select: {
            id: true,
            title: true,
            companyName: true,
            companyLogo: true,
            discipline: true,
            challengeType: true,
            startDate: true,
            endDate: true,
            slug: true
          }
        },
        project: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Group by status
    const grouped = {
      active: submissions.filter(s => ['APPLIED', 'SELECTED', 'IN_PROGRESS', 'REVISION_REQUESTED'].includes(s.status)),
      submitted: submissions.filter(s => s.status === 'SUBMITTED'),
      completed: submissions.filter(s => ['APPROVED', 'REJECTED'].includes(s.status)),
      withdrawn: submissions.filter(s => s.status === 'WITHDRAWN')
    }

    // Calculate stats
    const stats = {
      total: submissions.length,
      active: grouped.active.length,
      submitted: grouped.submitted.length,
      approved: submissions.filter(s => s.status === 'APPROVED').length,
      converted: submissions.filter(s => s.convertedToProject).length
    }

    return NextResponse.json({
      submissions,
      grouped,
      stats
    })
  } catch (error) {
    console.error('Error fetching student submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}
