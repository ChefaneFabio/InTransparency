import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/university/challenges
 * List challenges available for university approval/monitoring
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'UNIVERSITY' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') // 'pending', 'approved', 'all'
    const discipline = searchParams.get('discipline')
    const approvalStatus = searchParams.get('approvalStatus')

    const universityId = session.user.university || session.user.id

    // Build where clause for challenges
    const where: Record<string, unknown> = {
      status: { in: ['PENDING_REVIEW', 'APPROVED', 'ACTIVE', 'IN_PROGRESS'] },
      isPublic: true,
      OR: [
        { targetUniversities: { isEmpty: true } },
        { targetUniversities: { has: universityId } }
      ]
    }

    if (discipline) where.discipline = discipline
    if (status && status !== 'all') where.status = status.toUpperCase()

    const challenges = await prisma.companyChallenge.findMany({
      where,
      include: {
        recruiter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true
          }
        },
        universityApprovals: {
          where: { universityId },
          select: {
            id: true,
            status: true,
            courseName: true,
            courseCode: true,
            semester: true,
            professorName: true,
            approvedAt: true
          }
        },
        _count: {
          select: {
            submissions: {
              where: { universityId }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Filter by approval status if specified
    let filteredChallenges = challenges
    if (approvalStatus) {
      filteredChallenges = challenges.filter(c => {
        const approval = c.universityApprovals[0]
        if (approvalStatus === 'pending') return !approval || approval.status === 'PENDING'
        if (approvalStatus === 'approved') return approval?.status === 'APPROVED'
        if (approvalStatus === 'rejected') return approval?.status === 'REJECTED'
        return true
      })
    }

    // Get stats
    const stats = {
      total: challenges.length,
      pendingApproval: challenges.filter(c => !c.universityApprovals[0] || c.universityApprovals[0].status === 'PENDING').length,
      approved: challenges.filter(c => c.universityApprovals[0]?.status === 'APPROVED').length,
      withSubmissions: challenges.filter(c => c._count.submissions > 0).length
    }

    return NextResponse.json({
      challenges: filteredChallenges,
      stats
    })
  } catch (error) {
    console.error('Error fetching university challenges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch challenges' },
      { status: 500 }
    )
  }
}
