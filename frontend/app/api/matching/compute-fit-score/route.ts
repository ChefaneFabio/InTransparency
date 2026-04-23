import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { computeFitScore } from '@/lib/fit-score-engine'
import {
  type FitProfile,
  type RoleOffering,
  FIT_ENGINE_VERSION,
} from '@/lib/fit-profile'

export const maxDuration = 30

/**
 * POST /api/matching/compute-fit-score
 * Body: { userId: string, jobId: string, applicationId?: string, force?: boolean }
 *
 * Computes the fit-score for a (student, job) pair and, if an applicationId is
 * provided, caches it on the Application row. Returns the computed FitScore.
 *
 * - `force=true` bypasses the cache even if one exists at current engine version.
 * - `skillsScore` is computed inline here from required-skill coverage so this
 *   endpoint works in isolation (e.g. for "preview fit" before applying).
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const { userId, jobId, applicationId, force } = body as {
      userId?: string
      jobId?: string
      applicationId?: string
      force?: boolean
    }

    if (!userId || !jobId) {
      return NextResponse.json({ error: 'userId and jobId required' }, { status: 400 })
    }

    // Authorization: caller must be the student, the job's recruiter, or ADMIN
    const [user, job] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, fitProfile: true, fitProfileUpdatedAt: true },
      }),
      prisma.job.findUnique({
        where: { id: jobId },
        select: {
          id: true,
          recruiterId: true,
          requiredSkills: true,
          preferredSkills: true,
          roleOffering: true,
          companyIndustry: true,
          companySize: true,
          location: true,
          workLocation: true,
          remoteOk: true,
        },
      }),
    ])

    if (!user || !job) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const isStudent = session.user.id === userId
    const isRecruiter = session.user.id === job.recruiterId
    const isAdmin = session.user.role === 'ADMIN'
    if (!isStudent && !isRecruiter && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Try cache first
    if (applicationId && !force) {
      const app = await prisma.application.findUnique({
        where: { id: applicationId },
        select: { fitScore: true, fitScoreComputedAt: true },
      })
      const cached = app?.fitScore as any
      const cachedVersion = cached?.engineVersion
      if (cached && cachedVersion === FIT_ENGINE_VERSION) {
        return NextResponse.json({ fitScore: cached, cached: true })
      }
    }

    // Compute skills axis inline: coverage of required skills by student's
    // verified project skills + tools + technologies.
    const projects = await prisma.project.findMany({
      where: { userId, isPublic: true },
      select: { skills: true, tools: true, technologies: true, verificationStatus: true },
    })
    const studentSkillSet = new Set<string>()
    let verifiedCount = 0
    for (const p of projects) {
      for (const s of [...p.skills, ...p.tools, ...p.technologies]) {
        studentSkillSet.add(s.toLowerCase())
      }
      if (p.verificationStatus === 'VERIFIED') verifiedCount++
    }
    const required = (job.requiredSkills ?? []).map(s => s.toLowerCase())
    const preferred = (job.preferredSkills ?? []).map(s => s.toLowerCase())
    const reqHits = required.filter(r => studentSkillSet.has(r)).length
    const prefHits = preferred.filter(p => studentSkillSet.has(p)).length
    const reqCoverage = required.length > 0 ? reqHits / required.length : 0
    const prefCoverage = preferred.length > 0 ? prefHits / preferred.length : 0
    const verifiedDensity =
      projects.length > 0 ? verifiedCount / projects.length : 0
    const skillsScore = Math.round(
      reqCoverage * 70 + prefCoverage * 20 + verifiedDensity * 10
    )
    const skillsReason = required.length
      ? `${reqHits}/${required.length} required skills matched${
          preferred.length ? `, ${prefHits}/${preferred.length} preferred` : ''
        }.`
      : 'Role did not list required skills.'

    const fitScore = await computeFitScore({
      profile: (user.fitProfile as FitProfile | null) ?? null,
      offering: (job.roleOffering as RoleOffering | null) ?? null,
      skillsScore,
      skillsReason,
      jobIndustry: job.companyIndustry,
      jobLocation: job.location,
      jobIsRemote: job.remoteOk || job.workLocation === 'REMOTE',
      companySize: job.companySize,
    })

    // Cache on Application if provided
    if (applicationId) {
      prisma.application
        .update({
          where: { id: applicationId },
          data: {
            fitScore: fitScore as any,
            fitScoreComputedAt: new Date(),
          },
        })
        .catch(err => console.error('Fit-score cache write failed:', err))
    }

    return NextResponse.json({ fitScore, cached: false })
  } catch (error) {
    console.error('POST /api/matching/compute-fit-score error:', error)
    return NextResponse.json({ error: 'Failed to compute fit score' }, { status: 500 })
  }
}
