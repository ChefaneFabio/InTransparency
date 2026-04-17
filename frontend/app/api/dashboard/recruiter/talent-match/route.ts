import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

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

    // Score each student
    const scored = students.map(student => {
      const reasons: Array<{ factor: string; score: number; detail: string }> = []
      let totalScore = 0

      // 1. Required skills match (0-40 points)
      const studentSkillsLower = student.skills.map(s => s.toLowerCase())
      const matchedRequired = skills.filter(s => studentSkillsLower.includes(s.toLowerCase()))
      const requiredScore = skills.length > 0 ? Math.round((matchedRequired.length / skills.length) * 40) : 20
      totalScore += requiredScore
      if (matchedRequired.length > 0) {
        reasons.push({ factor: 'requiredSkills', score: requiredScore, detail: matchedRequired.join(', ') })
      }

      // 2. Preferred skills match (0-15 points)
      const matchedPreferred = preferred.filter(s => studentSkillsLower.includes(s.toLowerCase()))
      const preferredScore = preferred.length > 0 ? Math.round((matchedPreferred.length / preferred.length) * 15) : 0
      totalScore += preferredScore
      if (matchedPreferred.length > 0) {
        reasons.push({ factor: 'preferredSkills', score: preferredScore, detail: matchedPreferred.join(', ') })
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

    return NextResponse.json({
      matches: results,
      totalCandidates: students.length,
      criteria: { requiredSkills: skills, preferredSkills: preferred },
    })
  } catch (error) {
    console.error('Talent match error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
