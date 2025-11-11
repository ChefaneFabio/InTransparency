import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation schema for job creation
const createJobSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  companyLogo: z.string().url().optional().nullable(),
  companyWebsite: z.string().url().optional().nullable(),
  companySize: z.string().optional().nullable(),
  companyIndustry: z.string().optional().nullable(),

  title: z.string().min(1, 'Job title is required'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  responsibilities: z.string().optional().nullable(),
  requirements: z.string().optional().nullable(),
  niceToHave: z.string().optional().nullable(),

  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'TEMPORARY', 'FREELANCE']),
  workLocation: z.enum(['REMOTE', 'HYBRID', 'ON_SITE']),
  location: z.string().optional().nullable(),
  remoteOk: z.boolean().default(false),

  salaryMin: z.number().int().positive().optional().nullable(),
  salaryMax: z.number().int().positive().optional().nullable(),
  salaryCurrency: z.string().default('EUR'),
  salaryPeriod: z.string().default('yearly'),
  showSalary: z.boolean().default(false),

  requiredSkills: z.array(z.string()).default([]),
  preferredSkills: z.array(z.string()).default([]),
  education: z.string().optional().nullable(),
  experience: z.string().optional().nullable(),
  languages: z.array(z.string()).default([]),

  targetDisciplines: z.array(z.string()).default([]),

  applicationUrl: z.string().url().optional().nullable(),
  applicationEmail: z.string().email().optional().nullable(),
  internalApply: z.boolean().default(true),
  requireCV: z.boolean().default(false),
  requireCoverLetter: z.boolean().default(false),
  customQuestions: z.any().optional().nullable(),

  tags: z.array(z.string()).default([]),
  expiresAt: z.string().datetime().optional().nullable(),
})

/**
 * GET /api/jobs
 * List all jobs with filtering
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // Filters
    const status = searchParams.get('status')
    const jobType = searchParams.get('jobType')
    const workLocation = searchParams.get('workLocation')
    const search = searchParams.get('search')
    const discipline = searchParams.get('discipline')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build where clause
    const where: any = {
      isPublic: true,
      status: status || 'ACTIVE',
    }

    if (jobType) {
      where.jobType = jobType
    }

    if (workLocation) {
      where.workLocation = workLocation
    }

    if (discipline) {
      where.targetDisciplines = {
        has: discipline
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Get jobs with pagination
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          recruiter: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              company: true,
            }
          },
          _count: {
            select: {
              applications: true
            }
          }
        },
        orderBy: [
          { isFeatured: 'desc' },
          { postedAt: 'desc' },
          { createdAt: 'desc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.job.count({ where })
    ])

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    })
  } catch (error: any) {
    console.error('Get jobs error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/jobs
 * Create a new job posting (recruiters only)
 */
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    // Check if user is a recruiter
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Only recruiters can create jobs' },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = createJobSchema.parse(body)

    // Generate slug from title
    const slug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now()

    // Create job
    const job = await prisma.job.create({
      data: {
        ...validatedData,
        slug,
        recruiterId: session.user.id,
        status: 'DRAFT', // Start as draft
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
    }, { status: 201 })
  } catch (error: any) {
    console.error('Create job error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create job' },
      { status: 500 }
    )
  }
}
