import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const updateApplicationSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW', 'OFFER', 'ACCEPTED', 'REJECTED', 'WITHDRAWN']).optional(),
  isRead: z.boolean().optional(),
  isStarred: z.boolean().optional(),
  recruiterNotes: z.string().optional().nullable(),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  interviewDate: z.string().datetime().optional().nullable(),
  interviewType: z.string().optional().nullable(),
  interviewNotes: z.string().optional().nullable(),
  rejectionReason: z.string().optional().nullable(),
  offerDetails: z.any().optional().nullable(),
})

/**
 * GET /api/applications/[id]
 * Get a single application
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    const applicationId = params.id

    // Get application
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          include: {
            recruiter: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                company: true,
                email: true,
                photo: true,
              }
            }
          }
        },
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            photo: true,
            university: true,
            degree: true,
            graduationYear: true,
            gpa: true,
            bio: true,
          }
        }
      }
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Check access permissions
    const isApplicant = application.applicantId === session.user.id
    const isRecruiter = application.job.recruiterId === session.user.id
    const isAdmin = session.user.role === 'ADMIN'

    if (!isApplicant && !isRecruiter && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - You do not have access to this application' },
        { status: 403 }
      )
    }

    // Mark as read if recruiter is viewing
    if (isRecruiter && !application.isRead) {
      await prisma.application.update({
        where: { id: applicationId },
        data: { isRead: true }
      })
    }

    // If applicant is viewing, don't show recruiter-only fields
    if (isApplicant && !isRecruiter && !isAdmin) {
      const { recruiterNotes, rating, ...safeApplication } = application
      return NextResponse.json({ application: safeApplication })
    }

    return NextResponse.json({ application })
  } catch (error: any) {
    console.error('Get application error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch application' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/applications/[id]
 * Update application status (recruiter only)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    const applicationId = params.id

    // Get application
    const existingApplication = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: true
      }
    })

    if (!existingApplication) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Check if user is the recruiter who posted the job
    const isRecruiter = existingApplication.job.recruiterId === session.user.id
    const isAdmin = session.user.role === 'ADMIN'

    if (!isRecruiter && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Only the recruiter can update this application' },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = updateApplicationSchema.parse(body)

    // Update application
    const application = await prisma.application.update({
      where: { id: applicationId },
      data: {
        ...validatedData,
        respondedAt: validatedData.status && validatedData.status !== 'PENDING'
          ? new Date()
          : existingApplication.respondedAt,
        interviewDate: validatedData.interviewDate ? new Date(validatedData.interviewDate) : undefined,
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            companyName: true,
          }
        },
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    })

    // TODO: Send email notification to applicant about status change

    return NextResponse.json({
      success: true,
      application,
    })
  } catch (error: any) {
    console.error('Update application error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update application' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/applications/[id]
 * Withdraw application (student only)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    const applicationId = params.id

    // Get application
    const application = await prisma.application.findUnique({
      where: { id: applicationId }
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Check if user owns the application
    const isApplicant = application.applicantId === session.user.id
    const isAdmin = session.user.role === 'ADMIN'

    if (!isApplicant && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - You cannot withdraw this application' },
        { status: 403 }
      )
    }

    // Update status to withdrawn instead of deleting
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'WITHDRAWN' }
    })

    return NextResponse.json({
      success: true,
      message: 'Application withdrawn successfully'
    })
  } catch (error: any) {
    console.error('Withdraw application error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to withdraw application' },
      { status: 500 }
    )
  }
}
