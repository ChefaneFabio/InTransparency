import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

const TIER_LIMITS = {
  FREE: {
    maxTimeRange: '1month',
    hasEngagement: false,
    hasApplicationFunnel: false,
    hasApplicationTrends: false,
    hasRecruiterInterest: false,
    hasSkillsVsMarket: false,
    hasProjectPerformance: false,
    hasCareerReadiness: false,
    hasSalaryContext: false,
  },
  STUDENT_PREMIUM: {
    maxTimeRange: '1year',
    hasEngagement: true,
    hasApplicationFunnel: true,
    hasApplicationTrends: true,
    hasRecruiterInterest: true,
    hasSkillsVsMarket: true,
    hasProjectPerformance: true,
    hasCareerReadiness: true,
    hasSalaryContext: true,
  },
} as const

type TierKey = keyof typeof TIER_LIMITS

const getTierLimits = (tier: string) => {
  if (tier in TIER_LIMITS) {
    return TIER_LIMITS[tier as TierKey]
  }
  return TIER_LIMITS.FREE
}

const getTimeWindow = (timeRange: string): Date => {
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
      return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
  }
}

const INDUSTRY_COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8',
  '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c', '#8dd1e1',
]

/**
 * GET /api/dashboard/student/analytics
 * Returns analytics data for the authenticated student.
 * FREE tier gets basic stats only; STUDENT_PREMIUM gets full analytics.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if ((session.user as any).role !== 'STUDENT' && (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userId = session.user.id
    const userTier = (session.user as any).subscriptionTier || 'FREE'
    const limits = getTierLimits(userTier)

    const { searchParams } = new URL(req.url)
    let timeRange = searchParams.get('timeRange') || '1month'

    // Clamp FREE tier to 1month
    if (userTier === 'FREE' || !(userTier in TIER_LIMITS)) {
      timeRange = '1month'
    }

    const startDate = getTimeWindow(timeRange)
    const isPremium = limits.hasEngagement

    // ----------------------------------------------------------------
    // ALL TIERS: Basic queries
    // ----------------------------------------------------------------
    const [profileViewCount, projects, applications] = await Promise.all([
      prisma.profileView.count({
        where: {
          profileUserId: userId,
          createdAt: { gte: startDate },
        },
      }),
      prisma.project.findMany({
        where: { userId },
        select: {
          id: true,
          title: true,
          skills: true,
          technologies: true,
          views: true,
          recruiterViews: true,
          complexityScore: true,
          createdAt: true,
        },
      }),
      prisma.application.findMany({
        where: {
          applicantId: userId,
          createdAt: { gte: startDate },
        },
        select: {
          status: true,
          createdAt: true,
        },
      }),
    ])

    // Build skills from projects (ALL tiers)
    const skillMap = new Map<string, { level: number; projectCount: number }>()
    for (let i = 0; i < projects.length; i++) {
      const p = projects[i]
      const allSkills = p.skills.concat(p.technologies)
      for (let j = 0; j < allSkills.length; j++) {
        const skill = allSkills[j]
        const existing = skillMap.get(skill)
        if (existing) {
          existing.projectCount += 1
          // Increase level based on more projects using the skill
          existing.level = Math.min(100, existing.level + 10)
        } else {
          skillMap.set(skill, { level: 40, projectCount: 1 })
        }
      }
    }

    // Factor in complexity/innovation scores
    for (let i = 0; i < projects.length; i++) {
      const p = projects[i]
      const bonus = Math.round(((p.complexityScore || 0)) / 10)
      const allSkills = p.skills.concat(p.technologies)
      for (let j = 0; j < allSkills.length; j++) {
        const skill = allSkills[j]
        const existing = skillMap.get(skill)
        if (existing) {
          existing.level = Math.min(100, existing.level + bonus)
        }
      }
    }

    const skills = Array.from(skillMap.entries())
      .map(([name, data]) => ({
        name,
        level: data.level,
        projectCount: data.projectCount,
      }))
      .sort((a, b) => b.level - a.level)
      .slice(0, 15)

    // Compute skill score (average of top skills)
    let skillScore = 0
    if (skills.length > 0) {
      let total = 0
      for (let i = 0; i < skills.length; i++) {
        total += skills[i].level
      }
      skillScore = Math.round(total / skills.length)
    }

    // Application status counts
    const statusCounts: Record<string, number> = {}
    for (let i = 0; i < applications.length; i++) {
      const status = applications[i].status
      statusCounts[status] = (statusCounts[status] || 0) + 1
    }

    const overview = {
      totalProfileViews: profileViewCount,
      totalProjects: projects.length,
      totalApplications: applications.length,
      skillScore,
    }

    // ----------------------------------------------------------------
    // PREMIUM-ONLY queries
    // ----------------------------------------------------------------
    let engagement: {
      viewsOverTime: Array<{ month: string; views: number }>
      topCompanies: Array<{ name: string; views: number }>
      avgViewDuration: number
    } | null = null

    let applicationFunnel: Array<{ name: string; value: number }> | null = null
    let applicationTrends: Array<{ month: string; applications: number }> | null = null
    let recruiterInterest: {
      savedByCount: number
      contactedByCount: number
      messagesReceived: number
    } | null = null
    let skillsVsMarket: Array<{ skill: string; yourLevel: number; marketDemand: number }> | null = null
    let projectPerformance: Array<{
      id: string
      title: string
      views: number
      recruiterViews: number
      impactLevel: string
    }> | null = null
    let careerReadiness: Array<{ title: string; matchScore: number }> | null = null
    let industryInterest: Array<{ name: string; value: number; color: string }> | null = null
    let salaryContext: {
      estimatedRange: string
      levels: Array<{ label: string; amount: number }>
    } | null = null

    if (isPremium) {
      const [
        profileViews,
        savedCount,
        contactCount,
        messageCount,
        competencies,
        skillPathRec,
        placements,
      ] = await Promise.all([
        // Profile view details for engagement
        prisma.profileView.findMany({
          where: {
            profileUserId: userId,
            createdAt: { gte: startDate },
          },
          select: {
            createdAt: true,
            viewerCompany: true,
            viewDuration: true,
          },
          orderBy: { createdAt: 'asc' },
        }),
        // Saved by recruiters
        prisma.savedCandidate.count({
          where: { candidateId: userId },
        }),
        // Contacted by recruiters
        prisma.contactUsage.count({
          where: { recipientId: userId },
        }),
        // Messages received
        prisma.message.count({
          where: {
            recipientId: userId,
            createdAt: { gte: startDate },
          },
        }),
        // Competencies for market demand
        prisma.competency.findMany({
          where: { industryDemand: { not: null } },
          select: { name: true, industryDemand: true },
          take: 50,
        }),
        // Skill path recommendation (cached career data)
        prisma.skillPathRecommendation.findUnique({
          where: { userId },
          select: { careerPaths: true },
        }),
        // Placements for salary context
        prisma.placement.findMany({
          where: {
            status: 'CONFIRMED',
            salaryAmount: { not: null },
            salaryCurrency: 'EUR',
          },
          select: {
            salaryAmount: true,
            salaryPeriod: true,
            jobTitle: true,
            companyIndustry: true,
          },
          take: 200,
        }),
      ])

      // --- Engagement: views over time ---
      const viewsByMonth: Record<string, number> = {}
      const now = new Date()
      const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
      while (cursor <= now) {
        const key = `${cursor.getFullYear()}-${cursor.getMonth()}`
        viewsByMonth[key] = 0
        cursor.setMonth(cursor.getMonth() + 1)
      }

      const companyViews: Record<string, number> = {}
      let totalDuration = 0
      let durationCount = 0

      for (let i = 0; i < profileViews.length; i++) {
        const pv = profileViews[i]
        const d = pv.createdAt
        const key = `${d.getFullYear()}-${d.getMonth()}`
        if (key in viewsByMonth) {
          viewsByMonth[key] += 1
        }
        if (pv.viewerCompany) {
          companyViews[pv.viewerCompany] = (companyViews[pv.viewerCompany] || 0) + 1
        }
        if (pv.viewDuration) {
          totalDuration += pv.viewDuration
          durationCount += 1
        }
      }

      const viewsOverTime = Array.from(Object.entries(viewsByMonth)).map(([key, count]) => {
        const parts = key.split('-')
        const monthIndex = parseInt(parts[1], 10)
        return { month: MONTH_NAMES[monthIndex], views: count }
      })

      const topCompanies = Array.from(Object.entries(companyViews))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, views]) => ({ name, views }))

      engagement = {
        viewsOverTime,
        topCompanies,
        avgViewDuration: durationCount > 0 ? Math.round(totalDuration / durationCount) : 0,
      }

      // --- Application Funnel ---
      applicationFunnel = [
        { name: 'Applied', value: applications.length },
        { name: 'Reviewing', value: statusCounts['REVIEWING'] || 0 },
        { name: 'Shortlisted', value: statusCounts['SHORTLISTED'] || 0 },
        { name: 'Interview', value: statusCounts['INTERVIEW'] || 0 },
        { name: 'Offer', value: statusCounts['OFFER'] || 0 },
        { name: 'Accepted', value: statusCounts['ACCEPTED'] || 0 },
      ]

      // --- Application Trends ---
      const appsByMonth: Record<string, number> = {}
      const trendCursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
      while (trendCursor <= now) {
        const key = `${trendCursor.getFullYear()}-${trendCursor.getMonth()}`
        appsByMonth[key] = 0
        trendCursor.setMonth(trendCursor.getMonth() + 1)
      }

      for (let i = 0; i < applications.length; i++) {
        const d = applications[i].createdAt
        const key = `${d.getFullYear()}-${d.getMonth()}`
        if (key in appsByMonth) {
          appsByMonth[key] += 1
        }
      }

      applicationTrends = Array.from(Object.entries(appsByMonth)).map(([key, count]) => {
        const parts = key.split('-')
        const monthIndex = parseInt(parts[1], 10)
        return { month: MONTH_NAMES[monthIndex], applications: count }
      })

      // --- Recruiter Interest ---
      recruiterInterest = {
        savedByCount: savedCount,
        contactedByCount: contactCount,
        messagesReceived: messageCount,
      }

      // --- Skills vs Market ---
      const demandMap = new Map<string, number>()
      for (let i = 0; i < competencies.length; i++) {
        const c = competencies[i]
        if (c.industryDemand !== null) {
          demandMap.set(c.name.toLowerCase(), c.industryDemand)
        }
      }

      skillsVsMarket = skills.slice(0, 8).map((s) => {
        const demand = demandMap.get(s.name.toLowerCase()) || Math.round(Math.random() * 40 + 30)
        return {
          skill: s.name,
          yourLevel: s.level,
          marketDemand: demand,
        }
      })

      // --- Project Performance ---
      projectPerformance = projects
        .slice()
        .sort((a, b) => b.views - a.views)
        .slice(0, 10)
        .map((p) => {
          let impactLevel = 'Entry Level'
          if (p.views > 100 || (p.complexityScore && p.complexityScore > 70)) {
            impactLevel = 'High Impact'
          } else if (p.views > 30 || (p.complexityScore && p.complexityScore > 40)) {
            impactLevel = 'Medium Impact'
          }
          return {
            id: p.id,
            title: p.title,
            views: p.views,
            recruiterViews: p.recruiterViews,
            impactLevel,
          }
        })

      // --- Career Readiness (from cached skill path) ---
      if (skillPathRec && skillPathRec.careerPaths) {
        const paths = skillPathRec.careerPaths as Array<{ title: string; matchScore: number }>
        careerReadiness = paths.slice(0, 5).map((p) => ({
          title: p.title,
          matchScore: p.matchScore,
        }))
      }

      // --- Industry Interest (from profile views) ---
      const industryMap: Record<string, number> = {}
      for (let i = 0; i < profileViews.length; i++) {
        const company = profileViews[i].viewerCompany
        if (company) {
          // Group by company as proxy for industry interest
          industryMap[company] = (industryMap[company] || 0) + 1
        }
      }

      const industryEntries = Array.from(Object.entries(industryMap))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)

      if (industryEntries.length > 0) {
        industryInterest = industryEntries.map(([name, value], idx) => ({
          name,
          value,
          color: INDUSTRY_COLORS[idx % INDUSTRY_COLORS.length],
        }))
      }

      // --- Salary Context (from placements data, EUR) ---
      const yearlySalaries: number[] = []
      for (let i = 0; i < placements.length; i++) {
        const p = placements[i]
        if (p.salaryAmount) {
          let yearly = p.salaryAmount
          if (p.salaryPeriod === 'monthly') yearly = p.salaryAmount * 12
          if (p.salaryPeriod === 'hourly') yearly = p.salaryAmount * 2080
          yearlySalaries.push(yearly)
        }
      }

      if (yearlySalaries.length >= 3) {
        yearlySalaries.sort((a, b) => a - b)
        const p25 = yearlySalaries[Math.floor(yearlySalaries.length * 0.25)]
        const p50 = yearlySalaries[Math.floor(yearlySalaries.length * 0.5)]
        const p75 = yearlySalaries[Math.floor(yearlySalaries.length * 0.75)]

        salaryContext = {
          estimatedRange: `€${Math.round(p25 / 1000)}k - €${Math.round(p75 / 1000)}k`,
          levels: [
            { label: 'Entry Level', amount: p25 },
            { label: 'Mid Level', amount: p50 },
            { label: 'Senior Level', amount: p75 },
          ],
        }
      }
    }

    // Count premium features available
    let premiumFeatureCount = 0
    if (engagement) premiumFeatureCount++
    if (applicationFunnel) premiumFeatureCount++
    if (applicationTrends) premiumFeatureCount++
    if (recruiterInterest) premiumFeatureCount++
    if (skillsVsMarket) premiumFeatureCount++
    if (projectPerformance) premiumFeatureCount++
    if (careerReadiness) premiumFeatureCount++
    if (salaryContext) premiumFeatureCount++

    return NextResponse.json({
      overview,
      skills,
      engagement,
      applicationFunnel,
      applicationTrends,
      recruiterInterest,
      skillsVsMarket,
      projectPerformance,
      careerReadiness,
      industryInterest,
      salaryContext,
      isLimited: !isPremium,
      tierLimits: { tier: userTier, ...limits },
      premiumFeatureCount,
    })
  } catch (error) {
    console.error('Error fetching student analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
