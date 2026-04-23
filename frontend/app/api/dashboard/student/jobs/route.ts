import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { computeFastFitScore } from '@/lib/fit-score-engine'
import type { FitProfile, RoleOffering } from '@/lib/fit-profile'
import type { ExtractedJobSignals } from '@/lib/job-signals-extractor'

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

    // Get student's skills + fit profile in one roundtrip
    const [user, projects] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { fitProfile: true },
      }),
      prisma.project.findMany({
        where: { userId },
        select: { skills: true, technologies: true },
      }),
    ])

    const skillSet = new Set<string>()
    for (let i = 0; i < projects.length; i++) {
      const p = projects[i]
      for (let j = 0; j < p.skills.length; j++) skillSet.add(p.skills[j].toLowerCase())
      for (let j = 0; j < p.technologies.length; j++) skillSet.add(p.technologies[j].toLowerCase())
    }
    const profileSkills = Array.from(skillSet)
    const fitProfile = (user?.fitProfile as FitProfile | null) ?? null

    // Fetch active public jobs — include fit-relevant fields
    const jobs = await prisma.job.findMany({
      where: { status: 'ACTIVE', isPublic: true },
      select: {
        id: true,
        title: true,
        companyName: true,
        companyIndustry: true,
        companySize: true,
        location: true,
        jobType: true,
        workLocation: true,
        requiredSkills: true,
        preferredSkills: true,
        remoteOk: true,
        salaryMin: true,
        salaryMax: true,
        salaryCurrency: true,
        showSalary: true,
        postedAt: true,
        roleOffering: true,
        extractedSignals: true,
      },
      orderBy: { postedAt: 'desc' },
      take: 100,
    })

    // Compute both a skills matchScore and a fast fit score (no Claude).
    const jobsWithScore = jobs.map(job => {
      const required = job.requiredSkills || []
      const preferred = job.preferredSkills || []
      let reqHits = 0
      for (let i = 0; i < required.length; i++) {
        if (skillSet.has(required[i].toLowerCase())) reqHits++
      }
      const matchScore =
        required.length > 0 ? Math.round((reqHits / required.length) * 100) : 0

      // Fast fit score — uses cached extractedSignals + roleOffering; no Claude.
      const fitScore = computeFastFitScore({
        profile: fitProfile,
        offering: (job.roleOffering as RoleOffering | null) ?? null,
        extracted: (job.extractedSignals as ExtractedJobSignals | null) ?? null,
        skillsScore: matchScore,
        skillsReason: `${reqHits}/${required.length} required skills matched`,
        jobIndustry: job.companyIndustry,
        jobLocation: job.location,
        jobIsRemote: job.remoteOk || job.workLocation === 'REMOTE',
        companySize: job.companySize,
      })

      return {
        ...formatJob(job),
        matchScore,
        fitScore: fitProfile ? {
          composite: fitScore.composite,
          dealBreakerHit: fitScore.dealBreakerHit,
          dealBreakerReason: fitScore.dealBreakerReason,
        } : null,
      }
    })

    // Sort by composite fit (if profile exists), else by skill match
    jobsWithScore.sort((a, b) => {
      const ac = a.fitScore?.composite ?? a.matchScore
      const bc = b.fitScore?.composite ?? b.matchScore
      return bc - ac
    })

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
