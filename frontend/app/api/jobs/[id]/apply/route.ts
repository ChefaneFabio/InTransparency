import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const applySchema = z.object({
  coverLetter: z.string().optional().nullable(),
  cvUrl: z.string().url().optional().nullable(),
  portfolioUrl: z.string().url().optional().nullable(),
  customAnswers: z.any().optional().nullable(),
  selectedProjects: z.array(z.string()).default([]),
})

/**
 * POST /api/jobs/[id]/apply
 * Apply to a job (students only)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    // Check if user is a student
    if (session.user.role !== 'STUDENT' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Only students can apply to jobs' },
        { status: 403 }
      )
    }

    const { id: jobId } = await params

    // Get job
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    })

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Check if job is accepting applications
    if (job.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'This job is not currently accepting applications' },
        { status: 400 }
      )
    }

    // Check if already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        jobId_applicantId: {
          jobId,
          applicantId: session.user.id
        }
      }
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied to this job' },
        { status: 400 }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = applySchema.parse(body)

    // Check required fields based on job requirements
    if (job.requireCoverLetter && !validatedData.coverLetter) {
      return NextResponse.json(
        { error: 'Cover letter is required for this position' },
        { status: 400 }
      )
    }

    if (job.requireCV && !validatedData.cvUrl) {
      return NextResponse.json(
        { error: 'CV/Resume is required for this position' },
        { status: 400 }
      )
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        jobId,
        applicantId: session.user.id,
        ...validatedData,
        status: 'PENDING',
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
            photo: true,
          }
        }
      }
    })

    // TODO: Send email notification to recruiter

    return NextResponse.json({
      success: true,
      application,
      message: 'Application submitted successfully'
    }, { status: 201 })
  } catch (error: any) {
    console.error('Job application error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to submit application' },
      { status: 500 }
    )
  }
}
