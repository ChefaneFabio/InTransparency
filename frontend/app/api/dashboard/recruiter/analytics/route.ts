import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

function getTimeWindow(timeRange: string): Date {
  const now = new Date()
  switch (timeRange) {
    case '1month':
      return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    case '3months':
      return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
    case '6months':
      return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
    case '1year':
      return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
    default:
      return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
  }
}

/**
 * GET /api/dashboard/recruiter/analytics
 * Returns hiring funnel, application trends, skills gap, and overview stats
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
    const timeRange = searchParams.get('timeRange') || '3months'
    const startDate = getTimeWindow(timeRange)

    // ----------------------------------------------------------------
    // 1. Hiring Funnel
    // ----------------------------------------------------------------
    const applications = await prisma.application.findMany({
      where: {
        job: { recruiterId: userId },
        createdAt: { gte: startDate },
      },
      select: { status: true },
    })

    const statusCounts: Record<string, number> = {}
    for (let i = 0; i < applications.length; i++) {
      const status = applications[i].status
      statusCounts[status] = (statusCounts[status] || 0) + 1
    }

    const totalCount = applications.length
    const hiringFunnel = [
      { name: 'Applications', value: totalCount },
      { name: 'Reviewing', value: statusCounts['REVIEWING'] || 0 },
      { name: 'Shortlisted', value: statusCounts['SHORTLISTED'] || 0 },
      { name: 'Interview', value: statusCounts['INTERVIEW'] || 0 },
      { name: 'Offer', value: statusCounts['OFFER'] || 0 },
      { name: 'Accepted', value: statusCounts['ACCEPTED'] || 0 },
      { name: 'Rejected', value: statusCounts['REJECTED'] || 0 },
    ]

    // ----------------------------------------------------------------
    // 2. Application Trends (group by month)
    // ----------------------------------------------------------------
    const applicationsByMonth: Record<string, number> = {}

    // Initialize all months in the range
    const now = new Date()
    const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    while (cursor <= now) {
      const key = `${cursor.getFullYear()}-${cursor.getMonth()}`
      applicationsByMonth[key] = 0
      cursor.setMonth(cursor.getMonth() + 1)
    }

    // Re-query with createdAt for trend grouping (funnel query only selected status)
    const applicationsWithDates = await prisma.application.findMany({
      where: {
        job: { recruiterId: userId },
        createdAt: { gte: startDate },
      },
      select: { createdAt: true },
    })

    for (let i = 0; i < applicationsWithDates.length; i++) {
      const d = applicationsWithDates[i].createdAt
      const key = `${d.getFullYear()}-${d.getMonth()}`
      if (key in applicationsByMonth) {
        applicationsByMonth[key] += 1
      }
    }

    const applicationTrends = Array.from(Object.entries(applicationsByMonth)).map(
      ([key, count]) => {
        const parts = key.split('-')
        const monthIndex = parseInt(parts[1], 10)
        return {
          month: MONTH_NAMES[monthIndex],
          applications: count,
        }
      }
    )

    // ----------------------------------------------------------------
    // 3. Skills Gap
    // ----------------------------------------------------------------
    const activeJobs = await prisma.job.findMany({
      where: {
        recruiterId: userId,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        requiredSkills: true,
      },
    })

    // Tally how many jobs require each skill
    const skillDemandMap = new Map<string, number>()
    for (let i = 0; i < activeJobs.length; i++) {
      const skills = activeJobs[i].requiredSkills
      for (let j = 0; j < skills.length; j++) {
        const skill = skills[j]
        skillDemandMap.set(skill, (skillDemandMap.get(skill) || 0) + 1)
      }
    }

    // Get all unique required skills
    const allRequiredSkills = Array.from(skillDemandMap.keys())

    // Count candidates who have matching skills in their projects
    // Look at applicants' projects for skills overlap
    let skillSupplyMap = new Map<string, number>()

    if (allRequiredSkills.length > 0) {
      // Get all applicants who applied to this recruiter's jobs
      const applicantIds = await prisma.application.findMany({
        where: {
          job: { recruiterId: userId },
        },
        select: { applicantId: true },
        distinct: ['applicantId'],
      })

      const uniqueApplicantIds = applicantIds.map(a => a.applicantId)

      if (uniqueApplicantIds.length > 0) {
        // Get projects from those applicants
        const applicantProjects = await prisma.project.findMany({
          where: {
            userId: { in: uniqueApplicantIds },
          },
          select: {
            userId: true,
            skills: true,
            technologies: true,
          },
        })

        // For each skill, count how many unique applicants have it
        for (let i = 0; i < allRequiredSkills.length; i++) {
          const skill = allRequiredSkills[i]
          const skillLower = skill.toLowerCase()
          const matchingUserIds = new Set<string>()

          for (let j = 0; j < applicantProjects.length; j++) {
            const project = applicantProjects[j]
            const projectSkills = project.skills.concat(project.technologies)
            let found = false
            for (let k = 0; k < projectSkills.length; k++) {
              if (projectSkills[k].toLowerCase() === skillLower) {
                found = true
                break
              }
            }
            if (found) {
              matchingUserIds.add(project.userId)
            }
          }

          skillSupplyMap.set(skill, matchingUserIds.size)
        }
      }
    }

    // Build skills gap array, sorted by gap descending, top 10
    const skillsGapArray = Array.from(skillDemandMap.entries()).map(([skill, demand]) => {
      const supply = skillSupplyMap.get(skill) || 0
      return {
        skill,
        demand,
        supply,
        gap: demand - supply,
      }
    })

    skillsGapArray.sort((a, b) => b.gap - a.gap)
    const skillsGap = skillsGapArray.slice(0, 10)

    // ----------------------------------------------------------------
    // 4. Overview Stats
    // ----------------------------------------------------------------
    const interviewsScheduled = statusCounts['INTERVIEW'] || 0
    const offersExtended = (statusCounts['OFFER'] || 0) + (statusCounts['ACCEPTED'] || 0)

    // Calculate average time to hire (ACCEPTED applications with respondedAt)
    const acceptedApplications = await prisma.application.findMany({
      where: {
        job: { recruiterId: userId },
        status: 'ACCEPTED',
        respondedAt: { not: null },
      },
      select: {
        createdAt: true,
        respondedAt: true,
      },
    })

    let avgTimeToHire = 0
    if (acceptedApplications.length > 0) {
      let totalDays = 0
      for (let i = 0; i < acceptedApplications.length; i++) {
        const app = acceptedApplications[i]
        if (app.respondedAt) {
          const diffMs = app.respondedAt.getTime() - app.createdAt.getTime()
          totalDays += diffMs / (1000 * 60 * 60 * 24)
        }
      }
      avgTimeToHire = Math.round(totalDays / acceptedApplications.length)
    }

    const overviewStats = {
      totalApplications: totalCount,
      interviewsScheduled,
      offersExtended,
      avgTimeToHire,
    }

    return NextResponse.json({
      hiringFunnel,
      applicationTrends,
      skillsGap,
      overviewStats,
    })
  } catch (error) {
    console.error('Error fetching recruiter analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
