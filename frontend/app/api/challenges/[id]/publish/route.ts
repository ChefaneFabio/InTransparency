import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * POST /api/challenges/[id]/publish
 * Publish a challenge (move from DRAFT to PENDING_REVIEW or ACTIVE)
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const challenge = await prisma.companyChallenge.findUnique({
      where: { id },
      select: {
        recruiterId: true,
        status: true,
        title: true,
        description: true,
        applicationDeadline: true
      }
    })

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    if (challenge.recruiterId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (challenge.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Only draft challenges can be published' },
        { status: 400 }
      )
    }

    // Validate required fields before publishing
    if (!challenge.title || !challenge.description) {
      return NextResponse.json(
        { error: 'Challenge must have a title and description to publish' },
        { status: 400 }
      )
    }

    const body = await req.json().catch(() => ({}))
    const { skipReview } = body

    // Determine next status
    // If skipReview is true (admin or premium), go directly to ACTIVE
    // Otherwise, go to PENDING_REVIEW for university approval
    const newStatus = skipReview ? 'ACTIVE' : 'PENDING_REVIEW'

    const updated = await prisma.companyChallenge.update({
      where: { id },
      data: {
        status: newStatus,
        isPublic: true,
        publishedAt: new Date()
      },
      include: {
        recruiter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      challenge: updated,
      message: skipReview
        ? 'Challenge published and is now active'
        : 'Challenge submitted for university review'
    })
  } catch (error) {
    console.error('Error publishing challenge:', error)
    return NextResponse.json(
      { error: 'Failed to publish challenge' },
      { status: 500 }
    )
  }
}
