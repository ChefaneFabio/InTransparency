import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import {
  buildStudentSkillSet,
  buildStudentDisciplines,
  computeJobMatch,
} from '@/lib/job-matching'

/**
 * GET /api/dashboard/student/job-matches
 * Returns active jobs enriched with per-job match scores based on student's projects.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')
    const jobType = searchParams.get('jobType')
    const workLocation = searchParams.get('workLocation')

    // Build job filter
    const where: any = {
      isPublic: true,
      status: 'ACTIVE',
    }
    if (jobType) where.jobType = jobType
    if (workLocation) where.workLocation = workLocation
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Fetch student projects and active jobs in parallel
    const [projects, jobs] = await Promise.all([
      prisma.project.findMany({
        where: { userId },
        select: {
          technologies: true,
          skills: true,
          tools: true,
          competencies: true,
          discipline: true,
        },
      }),
      prisma.job.findMany({
        where,
        include: {
          _count: { select: { applications: true } },
        },
        orderBy: [
          { isFeatured: 'desc' },
          { postedAt: 'desc' },
          { createdAt: 'desc' },
        ],
        take: 100,
      }),
    ])

    const hasProjects = projects.length > 0
    const studentSkills = buildStudentSkillSet(projects)
    const studentDisciplines = buildStudentDisciplines(projects)

    // Compute match for each job
    const jobsWithMatch = jobs.map((job) => {
      const match = computeJobMatch(studentSkills, studentDisciplines, {
        id: job.id,
        requiredSkills: job.requiredSkills,
        preferredSkills: job.preferredSkills,
        targetDisciplines: job.targetDisciplines,
      })

      return {
        id: job.id,
        title: job.title,
        companyName: job.companyName,
        companyLogo: job.companyLogo,
        location: job.location,
        jobType: job.jobType,
        workLocation: job.workLocation,
        description: job.description,
        requiredSkills: job.requiredSkills,
        preferredSkills: job.preferredSkills,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryCurrency: job.salaryCurrency,
        showSalary: job.showSalary,
        postedAt: job.postedAt,
        createdAt: job.createdAt,
        expiresAt: job.expiresAt,
        _count: job._count,
        matchScore: match.matchScore,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        matchedPreferred: match.matchedPreferred,
        disciplineMatch: match.disciplineMatch,
      }
    })

    return NextResponse.json({
      jobs: jobsWithMatch,
      studentSkillCount: studentSkills.size,
      hasProjects,
    })
  } catch (error: any) {
    console.error('Job matches error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch job matches' },
      { status: 500 }
    )
  }
}
