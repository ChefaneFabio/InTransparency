import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/challenges/[id]
 * Get a single challenge
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

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
          include: {
            linkedCourse: {
              select: {
                id: true,
                courseName: true,
                courseCode: true
              }
            }
          }
        },
        submissions: session?.user?.role === 'RECRUITER' ? {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                university: true,
                degree: true,
                photo: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        } : false,
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

    // Check access - public challenges are visible to all, draft/private only to owner
    const isOwner = session?.user?.id === challenge.recruiterId
    const isAdmin = session?.user?.role === 'ADMIN'
    const isPublicAndActive = challenge.isPublic &&
      ['ACTIVE', 'IN_PROGRESS', 'COMPLETED'].includes(challenge.status)

    if (!isOwner && !isAdmin && !isPublicAndActive) {
      return NextResponse.json({ error: 'Not authorized to view this challenge' }, { status: 403 })
    }

    // Increment views for non-owners
    if (!isOwner && !isAdmin) {
      await prisma.companyChallenge.update({
        where: { id },
        data: { views: { increment: 1 } }
      })
    }

    return NextResponse.json(challenge)
  } catch (error) {
    console.error('Error fetching challenge:', error)
    return NextResponse.json(
      { error: 'Failed to fetch challenge' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/challenges/[id]
 * Update a challenge
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const challenge = await prisma.companyChallenge.findUnique({
      where: { id },
      select: { recruiterId: true, status: true }
    })

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    // Only owner or admin can update
    if (challenge.recruiterId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const {
      title,
      description,
      problemStatement,
      expectedOutcome,
      challengeType,
      discipline,
      requiredSkills,
      tools,
      teamSizeMin,
      teamSizeMax,
      estimatedDuration,
      startDate,
      endDate,
      applicationDeadline,
      targetCourses,
      targetSemesters,
      creditWorth,
      targetUniversities,
      maxSubmissions,
      mentorshipOffered,
      compensation,
      equipmentProvided,
      companyName,
      companyLogo,
      companyIndustry,
      status,
      isPublic
    } = body

    // Build update data
    const updateData: Record<string, unknown> = {}

    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (problemStatement !== undefined) updateData.problemStatement = problemStatement
    if (expectedOutcome !== undefined) updateData.expectedOutcome = expectedOutcome
    if (challengeType !== undefined) updateData.challengeType = challengeType
    if (discipline !== undefined) updateData.discipline = discipline
    if (requiredSkills !== undefined) updateData.requiredSkills = requiredSkills
    if (tools !== undefined) updateData.tools = tools
    if (teamSizeMin !== undefined) updateData.teamSizeMin = teamSizeMin
    if (teamSizeMax !== undefined) updateData.teamSizeMax = teamSizeMax
    if (estimatedDuration !== undefined) updateData.estimatedDuration = estimatedDuration
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null
    if (applicationDeadline !== undefined) updateData.applicationDeadline = applicationDeadline ? new Date(applicationDeadline) : null
    if (targetCourses !== undefined) updateData.targetCourses = targetCourses
    if (targetSemesters !== undefined) updateData.targetSemesters = targetSemesters
    if (creditWorth !== undefined) updateData.creditWorth = creditWorth
    if (targetUniversities !== undefined) updateData.targetUniversities = targetUniversities
    if (maxSubmissions !== undefined) updateData.maxSubmissions = maxSubmissions
    if (mentorshipOffered !== undefined) updateData.mentorshipOffered = mentorshipOffered
    if (compensation !== undefined) updateData.compensation = compensation
    if (equipmentProvided !== undefined) updateData.equipmentProvided = equipmentProvided
    if (companyName !== undefined) updateData.companyName = companyName
    if (companyLogo !== undefined) updateData.companyLogo = companyLogo
    if (companyIndustry !== undefined) updateData.companyIndustry = companyIndustry
    if (isPublic !== undefined) updateData.isPublic = isPublic

    // Handle status changes
    if (status !== undefined) {
      updateData.status = status
      if (status === 'ACTIVE' && !challenge.status.includes('ACTIVE')) {
        updateData.publishedAt = new Date()
      }
    }

    const updated = await prisma.companyChallenge.update({
      where: { id },
      data: updateData,
      include: {
        recruiter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true
          }
        },
        _count: {
          select: {
            submissions: true,
            universityApprovals: true
          }
        }
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating challenge:', error)
    return NextResponse.json(
      { error: 'Failed to update challenge' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/challenges/[id]
 * Delete a challenge
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const challenge = await prisma.companyChallenge.findUnique({
      where: { id },
      select: { recruiterId: true, status: true }
    })

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    // Only owner or admin can delete
    if (challenge.recruiterId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Can't delete challenges with active submissions
    if (['IN_PROGRESS', 'COMPLETED'].includes(challenge.status)) {
      const activeSubmissions = await prisma.challengeSubmission.count({
        where: {
          challengeId: id,
          status: { in: ['SELECTED', 'IN_PROGRESS', 'SUBMITTED'] }
        }
      })

      if (activeSubmissions > 0) {
        return NextResponse.json(
          { error: 'Cannot delete challenge with active submissions' },
          { status: 400 }
        )
      }
    }

    await prisma.companyChallenge.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting challenge:', error)
    return NextResponse.json(
      { error: 'Failed to delete challenge' },
      { status: 500 }
    )
  }
}
