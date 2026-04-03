import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/student/jobs
 * Returns active jobs with a matchScore based on how many required skills
 * the student has (derived from their projects).
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Get student's skills from projects
    const projects = await prisma.project.findMany({
      where: { userId },
      select: { skills: true, technologies: true },
    })

    const skillSet = new Set<string>()
    for (let i = 0; i < projects.length; i++) {
      const p = projects[i]
      for (let j = 0; j < p.skills.length; j++) skillSet.add(p.skills[j].toLowerCase())
      for (let j = 0; j < p.technologies.length; j++) skillSet.add(p.technologies[j].toLowerCase())
    }
    const profileSkills = Array.from(skillSet)

    // Fetch active public jobs
    const jobs = await prisma.job.findMany({
      where: { status: 'ACTIVE', isPublic: true },
      select: {
        id: true,
        title: true,
        companyName: true,
        location: true,
        jobType: true,
        workLocation: true,
        requiredSkills: true,
        salaryMin: true,
        salaryMax: true,
        salaryCurrency: true,
        showSalary: true,
        postedAt: true,
      },
      orderBy: { postedAt: 'desc' },
      take: 100,
    })

    // Calculate match score for each job
    const jobsWithScore = jobs.map(job => {
      const required = job.requiredSkills || []
      if (required.length === 0) {
        return { ...formatJob(job), matchScore: 0 }
      }
      let matches = 0
      for (let i = 0; i < required.length; i++) {
        if (skillSet.has(required[i].toLowerCase())) matches++
      }
      const matchScore = Math.round((matches / required.length) * 100)
      return { ...formatJob(job), matchScore }
    })

    // Sort by match score desc, then by date
    jobsWithScore.sort((a, b) => b.matchScore - a.matchScore)

    return NextResponse.json({
      jobs: jobsWithScore,
      profileSkills,
    })
  } catch (error) {
    console.error('Error fetching student jobs:', error)
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}

function formatJob(job: any) {
  return {
    id: job.id,
    title: job.title,
    companyName: job.companyName,
    location: job.location,
    jobType: job.jobType,
    workLocation: job.workLocation,
    requiredSkills: job.requiredSkills || [],
    salary: job.showSalary && job.salaryMin
      ? `${job.salaryCurrency || 'EUR'} ${job.salaryMin.toLocaleString()}${job.salaryMax ? ` - ${job.salaryMax.toLocaleString()}` : ''}`
      : null,
    postedAt: job.postedAt?.toISOString() || null,
  }
}
