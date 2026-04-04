import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { onJobPosted } from '@/lib/cross-segment-connections'

/**
 * GET /api/dashboard/recruiter/jobs
 * Returns recruiter's own jobs with application counts, views, status
 * Query params: status (filter), search (title search)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Build where clause
    const where: Record<string, unknown> = { recruiterId: userId }

    if (status) {
      where.status = status
    }

    if (search) {
      where.title = { contains: search, mode: 'insensitive' }
    }

    const jobs = await prisma.job.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        location: true,
        jobType: true,
        salaryMin: true,
        salaryMax: true,
        salaryCurrency: true,
        salaryPeriod: true,
        showSalary: true,
        views: true,
        postedAt: true,
        createdAt: true,
        requiredSkills: true,
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Format salary for display
    const formattedJobs = jobs.map((job) => {
      let salaryDisplay: string | null = null

      if (job.showSalary && (job.salaryMin || job.salaryMax)) {
        const currency = job.salaryCurrency || 'EUR'
        const period = job.salaryPeriod || 'yearly'
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency,
          maximumFractionDigits: 0,
        })

        if (job.salaryMin && job.salaryMax) {
          salaryDisplay = `${formatter.format(job.salaryMin)} - ${formatter.format(job.salaryMax)} / ${period}`
        } else if (job.salaryMin) {
          salaryDisplay = `From ${formatter.format(job.salaryMin)} / ${period}`
        } else if (job.salaryMax) {
          salaryDisplay = `Up to ${formatter.format(job.salaryMax)} / ${period}`
        }
      }

      return {
        id: job.id,
        title: job.title,
        slug: job.slug,
        status: job.status,
        location: job.location,
        jobType: job.jobType,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryCurrency: job.salaryCurrency,
        salaryPeriod: job.salaryPeriod,
        showSalary: job.showSalary,
        salaryDisplay,
        views: job.views,
        postedAt: job.postedAt,
        createdAt: job.createdAt,
        requiredSkills: job.requiredSkills,
        applicationCount: job._count.applications,
      }
    })

    return NextResponse.json({ jobs: formattedJobs })
  } catch (error) {
    console.error('Error fetching recruiter jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/dashboard/recruiter/jobs
 * Create a new job posting. Notifies matching students.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()

    if (!body.title || !body.description) {
      return NextResponse.json({ error: 'Title and description required' }, { status: 400 })
    }

    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60) + '-' + Date.now().toString(36)

    const job = await prisma.job.create({
      data: {
        recruiterId: session.user.id,
        title: body.title,
        description: body.description,
        responsibilities: body.responsibilities || null,
        requirements: body.requirements || null,
        niceToHave: body.niceToHave || null,
        companyName: body.companyName || session.user.company || 'Company',
        companyIndustry: body.companyIndustry || null,
        jobType: body.jobType || 'FULL_TIME',
        workLocation: body.workLocation || 'HYBRID',
        location: body.location || null,
        remoteOk: body.remoteOk || false,
        salaryMin: body.salaryMin ? parseInt(body.salaryMin) : null,
        salaryMax: body.salaryMax ? parseInt(body.salaryMax) : null,
        salaryPeriod: body.salaryPeriod || 'yearly',
        showSalary: !!(body.salaryMin || body.salaryMax),
        requiredSkills: body.requiredSkills || [],
        preferredSkills: body.preferredSkills || [],
        education: body.education || null,
        experience: body.experience || null,
        languages: body.languages || [],
        slug,
        status: body.status || 'DRAFT',
        isPublic: body.isPublic || false,
        internalApply: body.internalApply !== false,
        applicationUrl: body.applicationUrl || null,
        postedAt: body.status === 'ACTIVE' ? new Date() : null,
      },
    })

    // Cross-segment: notify matching students if job is active
    if (job.status === 'ACTIVE') {
      onJobPosted(job.id).catch(err => console.error('Job notification failed:', err))
    }

    return NextResponse.json({ success: true, job }, { status: 201 })
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
  }
}
