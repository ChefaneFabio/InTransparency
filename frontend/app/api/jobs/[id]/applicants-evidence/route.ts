import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { computeFitScore } from '@/lib/fit-score-engine'
import {
  type FitProfile,
  type RoleOffering,
  type FitScore,
  FIT_ENGINE_VERSION,
} from '@/lib/fit-profile'

export const maxDuration = 60

/**
 * GET /api/jobs/[id]/applicants-evidence
 * Recruiter-only. For every applicant, return an inline evidence pack:
 *   - matchedSkills / missingSkills (vs job.requiredSkills)
 *   - top 3 verified-first projects relevant to the JD
 *   - endorsement count + skill-graph stats
 *   - matchScore 0-100 composite for shortlisting in ~30s
 *
 * Story: recruiters see the evidence inline in the applicants list instead
 * of clicking through every profile.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id: jobId } = await params

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        recruiterId: true,
        requiredSkills: true,
        preferredSkills: true,
        targetDisciplines: true,
        roleOffering: true,
        companyIndustry: true,
        companySize: true,
        location: true,
        workLocation: true,
        remoteOk: true,
      },
    })
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    if (job.recruiterId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const required = (job.requiredSkills ?? []).map(s => s.toLowerCase())
    const preferred = (job.preferredSkills ?? []).map(s => s.toLowerCase())
    const targetDisciplines = new Set(job.targetDisciplines ?? [])

    const applications = await prisma.application.findMany({
      where: { jobId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        isRead: true,
        isStarred: true,
        rating: true,
        coverLetter: true,
        createdAt: true,
        selectedProjects: true,
        fitScore: true,
        fitScoreComputedAt: true,
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photo: true,
            university: true,
            degree: true,
            graduationYear: true,
            gpa: true,
            fitProfile: true,
          },
        },
      },
    })

    if (applications.length === 0) {
      return NextResponse.json({ applicants: [], jobSkills: { required, preferred } })
    }

    const applicantIds = applications.map(a => a.applicant.id)

    // One fan-out read per entity — keep the endpoint cheap.
    const [projects, endorsements, skillDeltas] = await Promise.all([
      prisma.project.findMany({
        where: { userId: { in: applicantIds }, isPublic: true },
        select: {
          id: true,
          userId: true,
          title: true,
          discipline: true,
          skills: true,
          tools: true,
          technologies: true,
          innovationScore: true,
          verificationStatus: true,
        },
      }),
      prisma.endorsement.groupBy({
        by: ['studentId'],
        where: { studentId: { in: applicantIds }, status: 'VERIFIED' },
        _count: { _all: true },
      }),
      prisma.skillDelta.groupBy({
        by: ['studentId'],
        where: { studentId: { in: applicantIds } },
        _count: { _all: true },
      }),
    ])

    const projectsByStudent = new Map<string, typeof projects>()
    for (const p of projects) {
      const list = projectsByStudent.get(p.userId) ?? []
      list.push(p)
      projectsByStudent.set(p.userId, list)
    }
    const endorsementCount = new Map(endorsements.map(e => [e.studentId, e._count._all]))
    const skillGraphSize = new Map(skillDeltas.map(d => [d.studentId, d._count._all]))

    const offering = (job.roleOffering as RoleOffering | null) ?? null
    const jobIsRemote = job.remoteOk || job.workLocation === 'REMOTE'

    const applicants = await Promise.all(applications.map(async app => {
      const studentProjects = projectsByStudent.get(app.applicant.id) ?? []
      const studentSkillSet = new Set<string>()
      for (const p of studentProjects) {
        for (const s of [...p.skills, ...p.tools, ...p.technologies]) {
          studentSkillSet.add(s.toLowerCase())
        }
      }

      const matchedSkills: string[] = []
      const missingSkills: string[] = []
      for (const r of required) {
        if (studentSkillSet.has(r)) matchedSkills.push(r)
        else missingSkills.push(r)
      }
      const matchedPreferred: string[] = preferred.filter(p => studentSkillSet.has(p))

      // Rank projects: verified first, then by discipline match, then by innovation score
      const scoredProjects = studentProjects
        .map(p => {
          const projSkills = new Set(
            [...p.skills, ...p.tools, ...p.technologies].map(s => s.toLowerCase())
          )
          const skillHits = required.filter(r => projSkills.has(r)).length
          const disciplineBonus =
            p.discipline && targetDisciplines.has(p.discipline) ? 2 : 0
          const verifiedBonus = p.verificationStatus === 'VERIFIED' ? 10 : 0
          const innovationBonus = (p.innovationScore ?? 0) / 10
          const score = skillHits * 5 + disciplineBonus + verifiedBonus + innovationBonus
          return { project: p, score, skillHits }
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(s => ({
          id: s.project.id,
          title: s.project.title,
          discipline: s.project.discipline,
          innovationScore: s.project.innovationScore,
          verified: s.project.verificationStatus === 'VERIFIED',
          skillHits: s.skillHits,
        }))

      const verifiedProjectCount = studentProjects.filter(
        p => p.verificationStatus === 'VERIFIED'
      ).length

      // Composite match score (0-100):
      //  50% required-skill coverage, 20% preferred-skill bonus,
      //  20% verified-project density, 10% endorsements
      const reqCoverage = required.length > 0 ? matchedSkills.length / required.length : 0
      const prefCoverage =
        preferred.length > 0 ? matchedPreferred.length / preferred.length : 0
      const verifiedDensity =
        studentProjects.length > 0
          ? verifiedProjectCount / studentProjects.length
          : 0
      const endorsements = endorsementCount.get(app.applicant.id) ?? 0
      const endorsementBoost = Math.min(1, endorsements / 3) // 3+ endorsements = full

      const matchScore = Math.round(
        reqCoverage * 50 +
          prefCoverage * 20 +
          verifiedDensity * 20 +
          endorsementBoost * 10
      )

      // ─── Fit score: cached if current, else compute+cache ──────────────
      let fitScore: FitScore | null = null
      const cached = app.fitScore as FitScore | null
      if (cached && cached.engineVersion === FIT_ENGINE_VERSION) {
        fitScore = cached
      } else {
        try {
          fitScore = await computeFitScore({
            profile: (app.applicant.fitProfile as FitProfile | null) ?? null,
            offering,
            skillsScore: matchScore,
            skillsReason: `${matchedSkills.length}/${required.length} required skills matched${
              preferred.length ? `, ${matchedPreferred.length}/${preferred.length} preferred` : ''
            }.`,
            jobIndustry: job.companyIndustry,
            jobLocation: job.location,
            jobIsRemote,
            companySize: job.companySize,
          })
          // Non-blocking cache write
          prisma.application
            .update({
              where: { id: app.id },
              data: { fitScore: fitScore as any, fitScoreComputedAt: new Date() },
            })
            .catch(err => console.error('Fit-score cache write failed:', err))
        } catch (e) {
          console.error('computeFitScore failed for applicant', app.applicant.id, e)
        }
      }

      return {
        id: app.id,
        status: app.status,
        isRead: app.isRead,
        isStarred: app.isStarred,
        rating: app.rating,
        createdAt: app.createdAt.toISOString(),
        coverLetterPreview: app.coverLetter ? app.coverLetter.slice(0, 200) : null,
        applicant: {
          id: app.applicant.id,
          name:
            `${app.applicant.firstName ?? ''} ${app.applicant.lastName ?? ''}`.trim() ||
            'Candidate',
          photo: app.applicant.photo,
          university: app.applicant.university,
          degree: app.applicant.degree,
          graduationYear: app.applicant.graduationYear,
          gpa: app.applicant.gpa ? Number(app.applicant.gpa) : null,
          hasFitProfile: !!app.applicant.fitProfile,
        },
        evidence: {
          matchScore,
          matchedSkills,
          missingSkills,
          matchedPreferred,
          topProjects: scoredProjects,
          totalProjects: studentProjects.length,
          verifiedProjectCount,
          endorsementCount: endorsements,
          skillGraphSize: skillGraphSize.get(app.applicant.id) ?? 0,
        },
        fitScore,
      }
    }))

    // Sort by combined skills+fit score (fit composite includes skills already,
    // so prefer composite when available, fall back to pure skills match score).
    applicants.sort((a, b) => {
      const as = a.fitScore?.composite ?? a.evidence.matchScore
      const bs = b.fitScore?.composite ?? b.evidence.matchScore
      return bs - as
    })

    return NextResponse.json({
      applicants,
      jobSkills: { required, preferred, targetDisciplines: Array.from(targetDisciplines) },
    })
  } catch (error) {
    console.error('GET /api/jobs/[id]/applicants-evidence error:', error)
    return NextResponse.json(
      { error: 'Failed to load applicants evidence' },
      { status: 500 }
    )
  }
}
