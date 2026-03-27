import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { normalizeSkill, calculateSkillMatch } from '@/lib/skills-intelligence'

/**
 * GET /api/dashboard/student/skills-demand
 *
 * Returns live skills demand data:
 * - What companies are searching for (from job listings)
 * - Which of those the student has vs doesn't have
 * - Trending skills (most demanded)
 * - Personalized gap alerts
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get student's skills
    const student = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        university: true,
        degree: true,
        projects: {
          where: { isPublic: true },
          select: {
            technologies: true,
            skills: true,
            competencies: true,
          },
        },
      },
    })

    const mySkills: string[] = []
    for (const p of student?.projects || []) {
      mySkills.push(
        ...(p.technologies || []),
        ...(p.skills || []),
        ...(p.competencies || []),
      )
    }
    const myNormalized = Array.from(new Set(mySkills.map(s => normalizeSkill(s))))

    // Get demand from active job listings
    const jobs = await prisma.job.findMany({
      where: { status: 'ACTIVE' },
      select: {
        requiredSkills: true,
        preferredSkills: true,
        title: true,
        location: true,
        companyName: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 500,
    })

    // Aggregate skill demand
    const demandCount: Record<string, { required: number; preferred: number; total: number; recentJobs: string[] }> = {}

    for (const job of jobs) {
      for (const skill of job.requiredSkills || []) {
        const norm = normalizeSkill(skill)
        if (!demandCount[norm]) demandCount[norm] = { required: 0, preferred: 0, total: 0, recentJobs: [] }
        demandCount[norm].required++
        demandCount[norm].total++
        if (demandCount[norm].recentJobs.length < 3) {
          demandCount[norm].recentJobs.push(`${job.title} at ${job.companyName}`)
        }
      }
      for (const skill of job.preferredSkills || []) {
        const norm = normalizeSkill(skill)
        if (!demandCount[norm]) demandCount[norm] = { required: 0, preferred: 0, total: 0, recentJobs: [] }
        demandCount[norm].preferred++
        demandCount[norm].total++
        if (demandCount[norm].recentJobs.length < 3) {
          demandCount[norm].recentJobs.push(`${job.title} at ${job.companyName}`)
        }
      }
    }

    // Sort by demand
    const trending = Object.entries(demandCount)
      .map(([skill, data]) => ({
        skill,
        ...data,
        iHaveIt: myNormalized.includes(skill),
      }))
      .sort((a, b) => b.total - a.total)

    // Top demanded skills
    const topDemanded = trending.slice(0, 20)

    // Skills I'm missing that are in high demand
    const gaps = trending
      .filter(s => !s.iHaveIt && s.total >= 2)
      .slice(0, 10)
      .map(s => ({
        skill: s.skill,
        demandCount: s.total,
        requiredIn: s.required,
        preferredIn: s.preferred,
        exampleJobs: s.recentJobs,
      }))

    // Skills I have that are in demand (strengths)
    const strengths = trending
      .filter(s => s.iHaveIt)
      .slice(0, 10)
      .map(s => ({
        skill: s.skill,
        demandCount: s.total,
      }))

    // Overall match — how well do my skills match the market?
    const topRequiredSkills = trending
      .filter(s => s.required >= 2)
      .slice(0, 15)
      .map(s => s.skill)
    const overallMatch = calculateSkillMatch(mySkills, topRequiredSkills)

    // Recent demand trend (skills appearing in jobs from last 30 days vs prior)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentJobs = jobs.filter(j => j.createdAt >= thirtyDaysAgo)
    const recentDemand: Record<string, number> = {}
    for (const job of recentJobs) {
      for (const skill of [...(job.requiredSkills || []), ...(job.preferredSkills || [])]) {
        const norm = normalizeSkill(skill)
        recentDemand[norm] = (recentDemand[norm] || 0) + 1
      }
    }

    const risingSkills = Object.entries(recentDemand)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([skill, count]) => ({ skill, recentMentions: count }))

    return NextResponse.json({
      totalJobs: jobs.length,
      mySkillCount: myNormalized.length,
      marketMatchPercent: overallMatch.score,
      topDemanded,
      gaps,
      strengths,
      risingSkills,
    })
  } catch (error) {
    console.error('Skills demand error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
