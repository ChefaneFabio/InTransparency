import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/student/submissions/[id]
 * Get a single submission
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const submission = await prisma.challengeSubmission.findUnique({
      where: { id },
      include: {
        challenge: {
          include: {
            recruiter: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                company: true,
                photo: true
              }
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

    // Only owner can view
    if (submission.studentId !== session.user.id && session.user.role !== 'ADMIN') {
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
 * PUT /api/student/submissions/[id]
 * Update submission (submit work, withdraw, etc.)
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const submission = await prisma.challengeSubmission.findUnique({
      where: { id },
      select: {
        id: true,
        studentId: true,
        status: true,
        challengeId: true,
        submissionUrl: true
      }
    })

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    if (submission.studentId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const {
      action,
      submissionTitle,
      submissionDescription,
      submissionUrl,
      documentationUrl,
      additionalFiles,
      teamName,
      teamMembers
    } = body

    const updateData: Record<string, unknown> = {}

    // Update submission content
    if (submissionTitle !== undefined) updateData.submissionTitle = submissionTitle
    if (submissionDescription !== undefined) updateData.submissionDescription = submissionDescription
    if (submissionUrl !== undefined) updateData.submissionUrl = submissionUrl
    if (documentationUrl !== undefined) updateData.documentationUrl = documentationUrl
    if (additionalFiles !== undefined) updateData.additionalFiles = additionalFiles
    if (teamName !== undefined) updateData.teamName = teamName
    if (teamMembers !== undefined) updateData.teamMembers = teamMembers

    // Handle actions
    if (action === 'submit') {
      if (!['IN_PROGRESS', 'REVISION_REQUESTED'].includes(submission.status)) {
        return NextResponse.json(
          { error: 'Can only submit work when in-progress or revision requested' },
          { status: 400 }
        )
      }

      if (!submissionUrl && !submission.submissionUrl) {
        return NextResponse.json(
          { error: 'Submission URL is required' },
          { status: 400 }
        )
      }

      updateData.status = 'SUBMITTED'
      updateData.submittedAt = new Date()
    }

    if (action === 'withdraw') {
      if (['APPROVED', 'REJECTED', 'WITHDRAWN'].includes(submission.status)) {
        return NextResponse.json(
          { error: 'Cannot withdraw in current status' },
          { status: 400 }
        )
      }
      updateData.status = 'WITHDRAWN'
    }

    const updated = await prisma.challengeSubmission.update({
      where: { id },
      data: updateData,
      include: {
        challenge: {
          select: {
            id: true,
            title: true,
            companyName: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      submission: updated
    })
  } catch (error) {
    console.error('Error updating submission:', error)
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    )
  }
}
