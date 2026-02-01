import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/student/challenges/[id]
 * Get challenge details for student
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
        universityApprovals: session.user.university ? {
          where: {
            universityId: session.user.university,
            status: 'APPROVED'
          },
          select: {
            courseName: true,
            courseCode: true,
            semester: true,
            professorName: true
          }
        } : {
          where: { status: 'APPROVED' },
          select: {
            universityName: true,
            courseName: true
          },
          take: 5
        },
        submissions: {
          where: { studentId: session.user.id },
          select: {
            id: true,
            status: true,
            applicationText: true,
            proposalUrl: true,
            submissionTitle: true,
            submissionUrl: true,
            companyFeedback: true,
            companyRating: true,
            createdAt: true,
            submittedAt: true
          }
        },
        _count: {
          select: { submissions: true }
        }
      }
    })

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    // Check if challenge is accessible
    if (!challenge.isPublic || !['ACTIVE', 'APPROVED', 'IN_PROGRESS'].includes(challenge.status)) {
      return NextResponse.json({ error: 'Challenge not available' }, { status: 403 })
    }

    return NextResponse.json({
      challenge,
      mySubmission: challenge.submissions[0] || null,
      spotsRemaining: challenge.maxSubmissions - challenge._count.submissions,
      canApply: !challenge.submissions[0] &&
                challenge._count.submissions < challenge.maxSubmissions &&
                (!challenge.applicationDeadline || new Date(challenge.applicationDeadline) > new Date())
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
 * POST /api/student/challenges/[id]
 * Apply to a challenge
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Only students can apply to challenges' }, { status: 403 })
    }

    const challenge = await prisma.companyChallenge.findUnique({
      where: { id },
      include: {
        _count: { select: { submissions: true } }
      }
    })

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    if (!['ACTIVE', 'APPROVED'].includes(challenge.status)) {
      return NextResponse.json({ error: 'Challenge is not accepting applications' }, { status: 400 })
    }

    if (challenge.applicationDeadline && new Date(challenge.applicationDeadline) < new Date()) {
      return NextResponse.json({ error: 'Application deadline has passed' }, { status: 400 })
    }

    if (challenge._count.submissions >= challenge.maxSubmissions) {
      return NextResponse.json({ error: 'Challenge has reached maximum submissions' }, { status: 400 })
    }

    // Check if already applied
    const existing = await prisma.challengeSubmission.findUnique({
      where: {
        challengeId_studentId: {
          challengeId: id,
          studentId: session.user.id
        }
      }
    })

    if (existing) {
      return NextResponse.json({ error: 'You have already applied to this challenge' }, { status: 400 })
    }

    const body = await req.json()
    const {
      applicationText,
      proposalUrl,
      resumeUrl,
      isTeamProject,
      teamName,
      teamMembers,
      courseName,
      courseCode,
      semester,
      professorName
    } = body

    const submission = await prisma.challengeSubmission.create({
      data: {
        challengeId: id,
        studentId: session.user.id,
        universityId: session.user.university || null,
        universityName: session.user.university || null,
        applicationText,
        proposalUrl,
        resumeUrl,
        isTeamProject: isTeamProject || false,
        teamName,
        teamMembers,
        courseName,
        courseCode,
        semester,
        professorName,
        status: 'APPLIED'
      }
    })

    // Update challenge status if this is the first submission
    if (challenge._count.submissions === 0) {
      await prisma.companyChallenge.update({
        where: { id },
        data: { status: 'ACTIVE' }
      })
    }

    return NextResponse.json({
      success: true,
      submission,
      message: 'Application submitted successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error applying to challenge:', error)
    return NextResponse.json(
      { error: 'Failed to apply to challenge' },
      { status: 500 }
    )
  }
}
