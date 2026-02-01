import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string; subId: string }>
}

/**
 * GET /api/challenges/[id]/submissions/[subId]
 * Get a single submission
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id, subId } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const submission = await prisma.challengeSubmission.findUnique({
      where: { id: subId },
      include: {
        challenge: {
          select: {
            id: true,
            title: true,
            recruiterId: true,
            companyName: true
          }
        },
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            university: true,
            degree: true,
            photo: true,
            projects: {
              where: { isPublic: true },
              select: {
                id: true,
                title: true,
                description: true,
                discipline: true,
                imageUrl: true
              },
              take: 5
            }
          }
        },
        project: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    if (submission.challengeId !== id) {
      return NextResponse.json({ error: 'Submission does not belong to this challenge' }, { status: 400 })
    }

    // Check access
    const isRecruiter = submission.challenge.recruiterId === session.user.id
    const isStudent = submission.studentId === session.user.id
    const isAdmin = session.user.role === 'ADMIN'

    if (!isRecruiter && !isStudent && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(submission)
  } catch (error) {
    console.error('Error fetching submission:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submission' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/challenges/[id]/submissions/[subId]
 * Update submission status (recruiter) or submission content (student)
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id, subId } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const submission = await prisma.challengeSubmission.findUnique({
      where: { id: subId },
      include: {
        challenge: {
          select: {
            id: true,
            recruiterId: true,
            maxSubmissions: true
          }
        }
      }
    })

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    if (submission.challengeId !== id) {
      return NextResponse.json({ error: 'Submission does not belong to this challenge' }, { status: 400 })
    }

    const isRecruiter = submission.challenge.recruiterId === session.user.id
    const isStudent = submission.studentId === session.user.id
    const isAdmin = session.user.role === 'ADMIN'

    if (!isRecruiter && !isStudent && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const updateData: Record<string, unknown> = {}

    // Recruiter updates
    if (isRecruiter || isAdmin) {
      const { status, companyFeedback, companyRating } = body

      if (status) {
        // Validate status transition
        const validTransitions: Record<string, string[]> = {
          APPLIED: ['SELECTED', 'REJECTED'],
          SELECTED: ['IN_PROGRESS', 'REJECTED'],
          IN_PROGRESS: ['SUBMITTED', 'WITHDRAWN'],
          SUBMITTED: ['APPROVED', 'REJECTED', 'REVISION_REQUESTED'],
          REVISION_REQUESTED: ['SUBMITTED', 'WITHDRAWN'],
          APPROVED: [],
          REJECTED: [],
          WITHDRAWN: []
        }

        if (!validTransitions[submission.status]?.includes(status)) {
          return NextResponse.json(
            { error: `Cannot transition from ${submission.status} to ${status}` },
            { status: 400 }
          )
        }

        // Check max submissions when selecting
        if (status === 'SELECTED') {
          const selectedCount = await prisma.challengeSubmission.count({
            where: {
              challengeId: id,
              status: { in: ['SELECTED', 'IN_PROGRESS', 'SUBMITTED', 'APPROVED'] }
            }
          })

          if (selectedCount >= submission.challenge.maxSubmissions) {
            return NextResponse.json(
              { error: 'Maximum submissions reached for this challenge' },
              { status: 400 }
            )
          }
        }

        updateData.status = status

        // Set timestamps based on status
        if (status === 'SELECTED') updateData.selectedAt = new Date()
        if (status === 'APPROVED' || status === 'REJECTED') updateData.reviewedAt = new Date()
      }

      if (companyFeedback !== undefined) updateData.companyFeedback = companyFeedback
      if (companyRating !== undefined) updateData.companyRating = companyRating
    }

    // Student updates
    if (isStudent) {
      const {
        applicationText,
        proposalUrl,
        resumeUrl,
        submissionTitle,
        submissionDescription,
        submissionUrl,
        documentationUrl,
        additionalFiles,
        teamName,
        teamMembers,
        isTeamProject
      } = body

      // Students can only update certain fields in certain statuses
      const editableStatuses = ['APPLIED', 'SELECTED', 'IN_PROGRESS', 'REVISION_REQUESTED']
      if (!editableStatuses.includes(submission.status)) {
        return NextResponse.json(
          { error: 'Cannot edit submission in current status' },
          { status: 400 }
        )
      }

      if (applicationText !== undefined) updateData.applicationText = applicationText
      if (proposalUrl !== undefined) updateData.proposalUrl = proposalUrl
      if (resumeUrl !== undefined) updateData.resumeUrl = resumeUrl
      if (submissionTitle !== undefined) updateData.submissionTitle = submissionTitle
      if (submissionDescription !== undefined) updateData.submissionDescription = submissionDescription
      if (submissionUrl !== undefined) updateData.submissionUrl = submissionUrl
      if (documentationUrl !== undefined) updateData.documentationUrl = documentationUrl
      if (additionalFiles !== undefined) updateData.additionalFiles = additionalFiles
      if (teamName !== undefined) updateData.teamName = teamName
      if (teamMembers !== undefined) updateData.teamMembers = teamMembers
      if (isTeamProject !== undefined) updateData.isTeamProject = isTeamProject

      // Handle submission action from student
      if (body.action === 'submit') {
        if (!['IN_PROGRESS', 'REVISION_REQUESTED'].includes(submission.status)) {
          return NextResponse.json(
            { error: 'Can only submit from in-progress or revision-requested status' },
            { status: 400 }
          )
        }
        updateData.status = 'SUBMITTED'
        updateData.submittedAt = new Date()
      }

      if (body.action === 'withdraw') {
        if (['APPROVED', 'REJECTED', 'WITHDRAWN'].includes(submission.status)) {
          return NextResponse.json(
            { error: 'Cannot withdraw in current status' },
            { status: 400 }
          )
        }
        updateData.status = 'WITHDRAWN'
      }
    }

    const updated = await prisma.challengeSubmission.update({
      where: { id: subId },
      data: updateData,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            university: true,
            photo: true
          }
        }
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating submission:', error)
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    )
  }
}
