import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/dashboard/university/challenges/[id]
 * Get challenge details for university
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'UNIVERSITY' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityId = session.user.university || session.user.id

    const challenge = await prisma.companyChallenge.findUnique({
      where: { id },
      include: {
        recruiter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true,
            photo: true
          }
        },
        universityApprovals: {
          where: { universityId },
          include: {
            linkedCourse: true
          }
        },
        submissions: {
          where: { universityId },
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                degree: true,
                photo: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            submissions: true,
            universityApprovals: true
          }
        }
      }
    })

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    // Get available courses for linking
    const courses = await prisma.course.findMany({
      where: { university: session.user.university || '' },
      select: {
        id: true,
        courseName: true,
        courseCode: true,
        semester: true,
        professorName: true
      },
      orderBy: { courseName: 'asc' }
    })

    return NextResponse.json({
      challenge,
      courses,
      approval: challenge.universityApprovals[0] || null
    })
  } catch (error) {
    console.error('Error fetching challenge:', error)
    return NextResponse.json(
      { error: 'Failed to fetch challenge' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/dashboard/university/challenges/[id]
 * Approve, reject, or update university approval for a challenge
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'UNIVERSITY' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const challenge = await prisma.companyChallenge.findUnique({
      where: { id },
      select: { id: true, status: true }
    })

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    const body = await req.json()
    const {
      action, // 'approve', 'reject', 'request_changes'
      statusMessage,
      linkedCourseId,
      courseName,
      courseCode,
      semester,
      professorName,
      professorEmail
    } = body

    const universityId = session.user.university || session.user.id
    const universityName = session.user.university || 'University'

    // Map action to status
    const statusMap: Record<string, string> = {
      approve: 'APPROVED',
      reject: 'REJECTED',
      request_changes: 'REQUIRES_CHANGES'
    }

    const approvalStatus = statusMap[action]
    if (!approvalStatus) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Upsert university approval
    const approval = await prisma.challengeUniversityApproval.upsert({
      where: {
        challengeId_universityId: {
          challengeId: id,
          universityId
        }
      },
      create: {
        challengeId: id,
        universityId,
        universityName,
        approvedBy: session.user.id,
        status: approvalStatus as 'APPROVED' | 'REJECTED' | 'REQUIRES_CHANGES' | 'PENDING',
        statusMessage,
        linkedCourseId,
        courseName,
        courseCode,
        semester,
        professorName,
        professorEmail,
        approvedAt: action === 'approve' ? new Date() : null
      },
      update: {
        approvedBy: session.user.id,
        status: approvalStatus as 'APPROVED' | 'REJECTED' | 'REQUIRES_CHANGES' | 'PENDING',
        statusMessage,
        linkedCourseId,
        courseName,
        courseCode,
        semester,
        professorName,
        professorEmail,
        approvedAt: action === 'approve' ? new Date() : null
      },
      include: {
        linkedCourse: true
      }
    })

    // If at least one university approved, update challenge status
    if (action === 'approve' && challenge.status === 'PENDING_REVIEW') {
      await prisma.companyChallenge.update({
        where: { id },
        data: { status: 'APPROVED' }
      })
    }

    return NextResponse.json({
      success: true,
      approval,
      message: action === 'approve'
        ? 'Challenge approved for your students'
        : action === 'reject'
        ? 'Challenge rejected'
        : 'Changes requested from company'
    })
  } catch (error) {
    console.error('Error updating challenge approval:', error)
    return NextResponse.json(
      { error: 'Failed to update challenge approval' },
      { status: 500 }
    )
  }
}
