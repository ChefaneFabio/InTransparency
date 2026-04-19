import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { persistMatchExplanation, legacyReasonsToFactors, MATCH_MODEL_VERSION } from '@/lib/match-explanation'
import { createNotification } from '@/lib/notifications'

/**
 * POST /api/dashboard/recruiter/talent-match
 * Given a role description and criteria, find and rank matching students
 * with explainable match scores.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'RECRUITER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { jobId, requiredSkills, preferredSkills, minGpa, maxGradYear, locations, disciplines } = await req.json()

    // If jobId provided, pull criteria from the job
    let skills: string[] = requiredSkills || []
    let preferred: string[] = preferredSkills || []

    if (jobId) {
      const job = await prisma.job.findFirst({
        where: { id: jobId, recruiterId: session.user.id },
        select: { requiredSkills: true, preferredSkills: true, title: true },
      })
      if (job) {
        skills = job.requiredSkills
        preferred = job.preferredSkills
      }
    }

    if (skills.length === 0 && preferred.length === 0) {
      return NextResponse.json({ error: 'At least one skill is required' }, { status: 400 })
    }

    const allTargetSkills = Array.from(new Set([...skills, ...preferred]))

    // Find students with matching skills, public profiles, and projects
    const where: any = {
      role: 'STUDENT',
      profilePublic: true,
      skills: { hasSome: allTargetSkills },
    }
    if (maxGradYear) where.graduationYear = { lte: String(maxGradYear) }
    if (locations && locations.length > 0) {
      where.OR = locations.map((loc: string) => ({
        location: { contains: loc, mode: 'insensitive' },
      }))
    }

    const students = await prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        photo: true,
        university: true,
        degree: true,
        graduationYear: true,
        gpa: true,
        gpaPublic: true,
        skills: true,
        location: true,
        bio: true,
        availableFor: true,
        projects: {
          where: { isPublic: true },
          select: {
            id: true,
            title: true,
            skills: true,
            discipline: true,
            verificationStatus: true,
            innovationScore: true,
            grade: true,
          },
          take: 10,
        },
        stageExperiences: {
          where: { status: { in: ['EVALUATED', 'VERIFIED'] } },
          select: {
            companyName: true,
            role: true,
            supervisorRating: true,
            supervisorWouldHire: true,
            verifiedSkills: true,
          },
          take: 5,
        },
        _count: {
          select: { projects: true },
        },
      },
      take: 100,
    })

    // Pull verified skill graph from SkillDelta for all candidates in one query
    // Use the most recent delta per (studentId, skillTerm) as the current level
    const studentIds = students.map(s => s.id)
    const allDeltas = studentIds.length > 0
      ? await prisma.skillDelta.findMany({
          where: { studentId: { in: studentIds } },
          orderBy: { occurredAt: 'desc' },
          select: {
            studentId: true,
            skillTerm: true,
            afterLevel: true,
            source: true,
            confidence: true,
          },
        })
      : []

    // Build a map: studentId → Map<skillTermLower, { level, sources[] }>
    const verifiedByStudent = new Map<string, Map<string, { level: number; sources: Set<string> }>>()
    for (const d of allDeltas) {
      const sid = d.studentId
      const key = d.skillTerm.toLowerCase()
      if (!verifiedByStudent.has(sid)) verifiedByStudent.set(sid, new Map())
      const studentMap = verifiedByStudent.get(sid)!
      const existing = studentMap.get(key)
      if (!existing) {
        studentMap.set(key, { level: d.afterLevel, sources: new Set([d.source]) })
      } else {
        existing.sources.add(d.source)
        // Keep highest observed level (deltas are desc by time — first hit is newest)
      }
    }

    // Score each student
    const scored = students.map(student => {
      const reasons: Array<{ factor: string; score: number; detail: string }> = []
      let totalScore = 0

      // Verified skill graph for this student (from SkillDelta)
      const verifiedMap = verifiedByStudent.get(student.id) ?? new Map<string, { level: number; sources: Set<string> }>()
      const verifiedLower = new Set(Array.from(verifiedMap.keys()))

      // 1. Required skills match (0-40 points)
      // Verified matches count 1.0; self-declared-only matches count 0.6 — evidence-weighted.
      const studentSkillsLower = student.skills.map(s => s.toLowerCase())
      const matchedRequired = skills.filter(s => studentSkillsLower.includes(s.toLowerCase()))
      const matchedRequiredVerified = matchedRequired.filter(s => verifiedLower.has(s.toLowerCase()))
      const matchedRequiredSelf = matchedRequired.filter(s => !verifiedLower.has(s.toLowerCase()))
      const requiredWeight = matchedRequiredVerified.length * 1.0 + matchedRequiredSelf.length * 0.6
      const requiredScore = skills.length > 0 ? Math.round((requiredWeight / skills.length) * 40) : 20
      totalScore += requiredScore
      if (matchedRequired.length > 0) {
        const detail = matchedRequiredVerified.length > 0
          ? `${matchedRequiredVerified.length} verified · ${matchedRequiredSelf.length} self-declared: ${matchedRequired.join(', ')}`
          : matchedRequired.join(', ')
        reasons.push({ factor: 'requiredSkills', score: requiredScore, detail })
      }

      // 2. Preferred skills match (0-15 points) — same evidence-weighted treatment
      const matchedPreferred = preferred.filter(s => studentSkillsLower.includes(s.toLowerCase()))
      const matchedPreferredVerified = matchedPreferred.filter(s => verifiedLower.has(s.toLowerCase()))
      const matchedPreferredSelf = matchedPreferred.filter(s => !verifiedLower.has(s.toLowerCase()))
      const preferredWeight = matchedPreferredVerified.length * 1.0 + matchedPreferredSelf.length * 0.6
      const preferredScore = preferred.length > 0 ? Math.round((preferredWeight / preferred.length) * 15) : 0
      totalScore += preferredScore
      if (matchedPreferred.length > 0) {
        reasons.push({ factor: 'preferredSkills', score: preferredScore, detail: matchedPreferred.join(', ') })
      }

      // 2.5. Verified skill depth bonus (0-10 points)
      // Rewards candidates whose verified graph shows Advanced/Expert in the target skills
      const targetLower = allTargetSkills.map(s => s.toLowerCase())
      let depthBonus = 0
      const depthDetails: string[] = []
      for (const target of targetLower) {
        const entry = verifiedMap.get(target)
        if (entry && entry.level >= 3) {
          depthBonus += entry.level === 4 ? 3 : 2 // Expert=3pts, Advanced=2pts
          const levelLabel = entry.level === 4 ? 'Expert' : 'Advanced'
          depthDetails.push(`${target} (${levelLabel}, ${entry.sources.size} source${entry.sources.size !== 1 ? 's' : ''})`)
        }
      }
      depthBonus = Math.min(10, depthBonus)
      if (depthBonus > 0) {
        totalScore += depthBonus
        reasons.push({
          factor: 'verifiedDepth',
          score: depthBonus,
          detail: depthDetails.slice(0, 3).join('; '),
        })
      }

      // 3. Verified projects with matching skills (0-20 points)
      const verifiedProjects = student.projects.filter(p => p.verificationStatus === 'VERIFIED')
      const projectsWithSkills = verifiedProjects.filter(p =>
        p.skills.some(ps => allTargetSkills.some(ts => ps.toLowerCase().includes(ts.toLowerCase())))
      )
      const projectScore = Math.min(20, projectsWithSkills.length * 7)
      totalScore += projectScore
      if (projectsWithSkills.length > 0) {
        reasons.push({
          factor: 'verifiedProjects',
          score: projectScore,
          detail: `${projectsWithSkills.length} verified project${projectsWithSkills.length > 1 ? 's' : ''} with matching skills`,
        })
      }

      // 4. Internship experience (0-15 points)
      const stages = student.stageExperiences
      if (stages.length > 0) {
        const avgRating = stages.filter(s => s.supervisorRating).reduce((sum, s) => sum + s.supervisorRating!, 0) / Math.max(1, stages.filter(s => s.supervisorRating).length)
        const wouldHire = stages.some(s => s.supervisorWouldHire)
        const stageScore = Math.min(15, Math.round(avgRating * 2) + (wouldHire ? 5 : 0))
        totalScore += stageScore
        const stageDetail = stages.map(s => `${s.role} @ ${s.companyName}`).join('; ')
        reasons.push({
          factor: 'internshipExperience',
          score: stageScore,
          detail: `${stageDetail}${wouldHire ? ' (supervisor would hire)' : ''}`,
        })
      }

      // 5. GPA bonus (0-10 points)
      if (student.gpa && student.gpaPublic) {
        const gpaNum = parseFloat(student.gpa)
        if (gpaNum >= 27) {
          const gpaScore = Math.min(10, Math.round((gpaNum - 22) * 1.25))
          totalScore += gpaScore
          reasons.push({ factor: 'academicPerformance', score: gpaScore, detail: `GPA: ${student.gpa}` })
        }
      }

      // Missing skills
      const missingRequired = skills.filter(s => !studentSkillsLower.includes(s.toLowerCase()))
      const missingPreferred = preferred.filter(s => !studentSkillsLower.includes(s.toLowerCase()))

      return {
        id: student.id,
        name: [student.firstName, student.lastName].filter(Boolean).join(' '),
        photo: student.photo,
        university: student.university,
        degree: student.degree,
        graduationYear: student.graduationYear,
        location: student.location,
        bio: student.bio?.substring(0, 200),
        skills: student.skills,
        matchScore: Math.min(100, totalScore),
        matchedSkills: [...matchedRequired, ...matchedPreferred],
        missingSkills: missingRequired,
        missingPreferred: missingPreferred,
        reasons,
        projectCount: student._count.projects,
        verifiedProjectCount: verifiedProjects.length,
        topProjects: projectsWithSkills.slice(0, 3).map(p => ({
          title: p.title,
          grade: p.grade,
          verified: p.verificationStatus === 'VERIFIED',
          innovationScore: p.innovationScore,
        })),
        internships: stages.map(s => ({
          company: s.companyName,
          role: s.role,
          rating: s.supervisorRating,
          wouldHire: s.supervisorWouldHire,
        })),
        availableFor: student.availableFor,
      }
    })

    // Sort by match score, take top 20
    scored.sort((a, b) => b.matchScore - a.matchScore)
    const results = scored.slice(0, 20)

    // Persist explanations for the top results (async, don't block response)
    // AI Act Art. 86 — right to explanation for high-impact decisions
    const explanationInputs = {
      requiredSkills: skills,
      preferredSkills: preferred,
      minGpa: minGpa ?? null,
      maxGradYear: maxGradYear ?? null,
      locations: locations ?? [],
      disciplines: disciplines ?? [],
    }
    const explanationWrites = await Promise.all(
      results.map(async r => {
        const factors = legacyReasonsToFactors(r.reasons, {
          matchedSkills: r.matchedSkills,
          topProjects: r.topProjects,
          internships: r.internships.map(i => ({ company: i.company, role: i.role })),
        })
        try {
          const expl = await persistMatchExplanation({
            subjectId: r.id,
            subjectType: 'STUDENT',
            counterpartyId: session.user.id,
            counterpartyType: 'RECRUITER',
            contextType: jobId ? 'JOB' : 'GENERIC',
            contextId: jobId ?? null,
            matchScore: r.matchScore,
            factors,
            inputSnapshot: explanationInputs,
          })
          // Notification policy:
          //  - Always notify for first 3 matches a student ever receives (onboarding moment)
          //  - Otherwise only for STRONG_MATCH (score ≥ 80) to avoid spam
          const priorMatchCount = await prisma.matchExplanation.count({
            where: { subjectId: r.id },
          }).catch(() => 999)
          const shouldNotify = priorMatchCount <= 3 || r.matchScore >= 80
          if (shouldNotify) {
            createNotification({
              userId: r.id,
              type: 'MATCH_CREATED',
              title: priorMatchCount <= 3 ? 'Your first matches are in' : 'You matched a role',
              body: `A recruiter\'s search matched your profile (${Math.round(r.matchScore)}/100).`,
              link: `/matches/${expl.id}/why`,
              groupKey: `match:${expl.id}`,
            }).catch(err => console.error('Match notification failed:', err))
          }
          return { candidateId: r.id, explanationId: expl.id }
        } catch (e) {
          console.error('Persist explanation failed for', r.id, e)
          return { candidateId: r.id, explanationId: null }
        }
      })
    )

    const explanationByCandidate = new Map(
      explanationWrites.map(w => [w.candidateId, w.explanationId])
    )

    return NextResponse.json({
      matches: results.map(r => ({ ...r, explanationId: explanationByCandidate.get(r.id) ?? null })),
      totalCandidates: students.length,
      criteria: { requiredSkills: skills, preferredSkills: preferred },
      modelVersion: MATCH_MODEL_VERSION,
    })
  } catch (error) {
    console.error('Talent match error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
