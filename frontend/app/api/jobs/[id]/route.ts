import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Update job schema (same as create but all fields optional)
const updateJobSchema = z.object({
  companyName: z.string().min(1).optional(),
  companyLogo: z.string().url().optional().nullable(),
  companyWebsite: z.string().url().optional().nullable(),
  companySize: z.string().optional().nullable(),
  companyIndustry: z.string().optional().nullable(),

  title: z.string().min(1).optional(),
  description: z.string().min(50).optional(),
  responsibilities: z.string().optional().nullable(),
  requirements: z.string().optional().nullable(),
  niceToHave: z.string().optional().nullable(),

  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'TEMPORARY', 'FREELANCE']).optional(),
  workLocation: z.enum(['REMOTE', 'HYBRID', 'ON_SITE']).optional(),
  location: z.string().optional().nullable(),
  remoteOk: z.boolean().optional(),

  salaryMin: z.number().int().positive().optional().nullable(),
  salaryMax: z.number().int().positive().optional().nullable(),
  salaryCurrency: z.string().optional(),
  salaryPeriod: z.string().optional(),
  showSalary: z.boolean().optional(),

  requiredSkills: z.array(z.string()).optional(),
  preferredSkills: z.array(z.string()).optional(),
  education: z.string().optional().nullable(),
  experience: z.string().optional().nullable(),
  languages: z.array(z.string()).optional(),

  targetDisciplines: z.array(z.string()).optional(),

  applicationUrl: z.string().url().optional().nullable(),
  applicationEmail: z.string().email().optional().nullable(),
  internalApply: z.boolean().optional(),
  requireCV: z.boolean().optional(),
  requireCoverLetter: z.boolean().optional(),
  customQuestions: z.any().optional().nullable(),

  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'CLOSED', 'FILLED', 'CANCELLED']).optional(),
  isPublic: z.boolean().optional(),
  isFeatured: z.boolean().optional(),

  tags: z.array(z.string()).optional(),
  expiresAt: z.string().datetime().optional().nullable(),
})

/**
 * GET /api/jobs/[id]
 * Get a single job by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id

    // Get job
    const job = await prisma.job.findUnique({
      where: { id: jobId },
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
        },
        applications: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            applicant: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                photo: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      }
    })

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await prisma.job.update({
      where: { id: jobId },
      data: { views: { increment: 1 } }
    })

    return NextResponse.json({ job })
  } catch (error: any) {
    console.error('Get job error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch job' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/jobs/[id]
 * Update a job (recruiter/admin only)
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

    const jobId = params.id

    // Get existing job
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId }
    })

    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Check ownership
    const isOwner = existingJob.recruiterId === session.user.id
    const isAdmin = session.user.role === 'ADMIN'

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - You do not own this job' },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = updateJobSchema.parse(body)

    // Update slug if title changed
    let slug = existingJob.slug
    if (validatedData.title && validatedData.title !== existingJob.title) {
      slug = validatedData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        + '-' + Date.now()
    }

    // Update job
    const job = await prisma.job.update({
      where: { id: jobId },
      data: {
        ...validatedData,
        slug,
        postedAt: validatedData.status === 'ACTIVE' && existingJob.status === 'DRAFT'
          ? new Date()
          : existingJob.postedAt,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : undefined,
      },
      include: {
        recruiter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      job,
    })
  } catch (error: any) {
    console.error('Update job error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update job' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/jobs/[id]
 * Delete a job (recruiter/admin only)
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

    const jobId = params.id

    // Get existing job
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        _count: {
          select: {
            applications: true
          }
        }
      }
    })

    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Check ownership
    const isOwner = existingJob.recruiterId === session.user.id
    const isAdmin = session.user.role === 'ADMIN'

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - You do not own this job' },
        { status: 403 }
      )
    }

    // Prevent deletion if there are active applications
    if (existingJob._count.applications > 0) {
      return NextResponse.json(
        { error: 'Cannot delete job with existing applications. Set status to CANCELLED instead.' },
        { status: 400 }
      )
    }

    // Delete job
    await prisma.job.delete({
      where: { id: jobId }
    })

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully'
    })
  } catch (error: any) {
    console.error('Delete job error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete job' },
      { status: 500 }
    )
  }
}
