import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/challenges/[id]/submissions
 * Get all submissions for a challenge (recruiter view)
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
      select: { recruiterId: true }
    })

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    // Only owner, university, or admin can view all submissions
    const isOwner = challenge.recruiterId === session.user.id
    const isUniversity = session.user.role === 'UNIVERSITY'
    const isAdmin = session.user.role === 'ADMIN'

    if (!isOwner && !isUniversity && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const where: Record<string, unknown> = { challengeId: id }
    if (status) where.status = status

    // For universities, only show submissions from their students
    if (isUniversity && session.user.university) {
      where.universityName = session.user.university
    }

    const submissions = await prisma.challengeSubmission.findMany({
      where,
      include: {
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
                discipline: true
              },
              take: 3
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Group submissions by status for easy filtering
    const grouped = {
      applied: submissions.filter(s => s.status === 'APPLIED'),
      selected: submissions.filter(s => s.status === 'SELECTED'),
      inProgress: submissions.filter(s => s.status === 'IN_PROGRESS'),
      submitted: submissions.filter(s => s.status === 'SUBMITTED'),
      revisionRequested: submissions.filter(s => s.status === 'REVISION_REQUESTED'),
      approved: submissions.filter(s => s.status === 'APPROVED'),
      rejected: submissions.filter(s => s.status === 'REJECTED'),
      withdrawn: submissions.filter(s => s.status === 'WITHDRAWN')
    }

    return NextResponse.json({
      submissions,
      grouped,
      total: submissions.length
    })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}
