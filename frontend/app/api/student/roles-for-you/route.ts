import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { getCurrentSkillGraph } from '@/lib/skill-delta'
import { computeFastFitScore } from '@/lib/fit-score-engine'
import type { FitProfile, RoleOffering } from '@/lib/fit-profile'
import type { ExtractedJobSignals } from '@/lib/job-signals-extractor'

/**
 * GET /api/student/roles-for-you
 *
 * Given the student's verified skill graph + preferences, match active jobs
 * and return the top fit with explanations. This is the student-side mirror
 * of Talent Match — same evidence-weighted logic, inverted direction.
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      skills: true,
      preferredLocations: true,
      preferredSectors: true,
      desiredOccupation: true,
      willingToRelocate: true,
      willingToRelocateAbroad: true,
      fitProfile: true,
    },
  })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Student's verified skill graph
  const graph = await getCurrentSkillGraph(session.user.id)
  const verifiedMap = new Map(graph.map(g => [g.skillTerm.toLowerCase(), g]))
  const selfSkills = new Set((user.skills ?? []).map(s => s.toLowerCase()))

  // Pull active jobs — larger pool, we'll filter and rank
  const jobs = await prisma.job.findMany({
    where: { status: 'ACTIVE' },
    select: {
      id: true,
      title: true,
      companyName: true,
      companyLogo: true,
      companyIndustry: true,
      companySize: true,
      location: true,
      workLocation: true,
      remoteOk: true,
      jobType: true,
      requiredSkills: true,
      preferredSkills: true,
      description: true,
      createdAt: true,
      roleOffering: true,
      extractedSignals: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

  const fitProfile = (user.fitProfile as FitProfile | null) ?? null

  // Score each job
  const scored = jobs.map(job => {
    const req = (job.requiredSkills ?? []).map(s => s.toLowerCase())
    const pref = (job.preferredSkills ?? []).map(s => s.toLowerCase())
    const allTargets = Array.from(new Set([...req, ...pref]))

    const verifiedReq = req.filter(s => verifiedMap.has(s))
    const selfReq = req.filter(s => !verifiedMap.has(s) && selfSkills.has(s))
    const missingReq = req.filter(s => !verifiedMap.has(s) && !selfSkills.has(s))

    const verifiedPref = pref.filter(s => verifiedMap.has(s))
    const selfPref = pref.filter(s => !verifiedMap.has(s) && selfSkills.has(s))

    // Scoring
    const reqScore = req.length > 0
      ? Math.round(((verifiedReq.length * 1.0 + selfReq.length * 0.6) / req.length) * 60)
      : 30
    const prefScore = pref.length > 0
      ? Math.round(((verifiedPref.length * 1.0 + selfPref.length * 0.6) / pref.length) * 20)
      : 10
    const depthScore = Math.min(
      15,
      allTargets.reduce((sum, s) => {
        const entry = verifiedMap.get(s)
        return sum + (entry && entry.currentLevel >= 3 ? (entry.currentLevel === 4 ? 3 : 2) : 0)
      }, 0)
    )
    const freshnessScore = Math.min(
      5,
      Math.max(0, 5 - Math.floor((Date.now() - job.createdAt.getTime()) / (7 * 86400000)))
    )

    const matchScore = Math.min(100, reqScore + prefScore + depthScore + freshnessScore)

    const fast = computeFastFitScore({
      profile: fitProfile,
      offering: (job.roleOffering as RoleOffering | null) ?? null,
      extracted: (job.extractedSignals as ExtractedJobSignals | null) ?? null,
      skillsScore: matchScore,
      skillsReason: `${verifiedReq.length + selfReq.length}/${req.length} required skills matched`,
      jobIndustry: job.companyIndustry,
      jobLocation: job.location,
      jobIsRemote: job.remoteOk || job.workLocation === 'REMOTE',
      companySize: job.companySize,
    })

    return {
      id: job.id,
      title: job.title,
      companyName: job.companyName,
      companyLogo: job.companyLogo,
      location: job.location,
      workLocation: job.workLocation,
      jobType: job.jobType,
      createdAt: job.createdAt.toISOString(),
      matchScore,
      fitScore: fitProfile
        ? { composite: fast.composite, dealBreakerHit: fast.dealBreakerHit, dealBreakerReason: fast.dealBreakerReason }
        : null,
      evidence: {
        requiredMatched: req.length > 0 ? (verifiedReq.length + selfReq.length) : 0,
        requiredTotal: req.length,
        verifiedMatches: verifiedReq.length + verifiedPref.length,
        selfMatches: selfReq.length + selfPref.length,
        missingRequired: missingReq.slice(0, 5),
        strongestVerified: verifiedReq
          .concat(verifiedPref)
          .slice(0, 3)
          .map(s => {
            const entry = verifiedMap.get(s)
            return { skill: s, level: entry?.currentLevel ?? 0 }
          }),
      },
    }
  })

  scored.sort((a, b) => b.matchScore - a.matchScore)
  const top = scored.filter(s => s.matchScore >= 30).slice(0, 30)

  return NextResponse.json({
    roles: top,
    graphSize: graph.length,
    context: {
      hasVerifiedSkills: graph.length > 0,
      totalJobsScanned: jobs.length,
    },
  })
}
