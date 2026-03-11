import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

type MatchedCandidate = {
  id: string
  firstName: string | null
  lastName: string | null
  university: string | null
  degree: string | null
  graduationYear: string | null
  location: string | null
  photo: string | null
  matchScore: number
  matchReasons: string[]
  matchedSkills: string[]
  verifiedProjectCount: number
  totalProjectCount: number
}

/**
 * POST /api/recruiter/ai-shortlist
 * Accepts a role description and returns auto-matched candidates using a scoring algorithm.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { title, description, skills, location, minGrade, save } = body as {
      title: string
      description: string
      skills: string[]
      location?: string
      minGrade?: number
      save?: boolean
    }

    if (!title || !description || !skills || skills.length === 0) {
      return NextResponse.json(
        { error: 'Title, description, and at least one skill are required' },
        { status: 400 }
      )
    }

    // Normalize requested skills to lowercase for matching
    const requestedSkills = skills.map((s: string) => s.toLowerCase().trim())

    // Fetch all student users with their projects
    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        profilePublic: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        university: true,
        degree: true,
        graduationYear: true,
        location: true,
        photo: true,
        skills: true,
        bio: true,
        gpa: true,
        projects: {
          where: { isPublic: true },
          select: {
            id: true,
            skills: true,
            technologies: true,
            normalizedGrade: true,
            universityVerified: true,
            verificationStatus: true,
            competencies: true,
          },
        },
      },
    })

    // Score each student
    const scored: MatchedCandidate[] = []

    for (let i = 0; i < students.length; i++) {
      const student = students[i]
      let score = 0
      const reasons: string[] = []
      const matchedSkillsSet = new Set<string>()

      // 1. Skill matching from User.skills
      const userSkills = (student.skills || []).map((s) => s.toLowerCase())
      for (let j = 0; j < requestedSkills.length; j++) {
        const reqSkill = requestedSkills[j]
        for (let k = 0; k < userSkills.length; k++) {
          if (
            userSkills[k].includes(reqSkill) ||
            reqSkill.includes(userSkills[k])
          ) {
            matchedSkillsSet.add(reqSkill)
            break
          }
        }
      }

      // 2. Skill matching from Project skills/technologies/competencies
      for (let p = 0; p < student.projects.length; p++) {
        const proj = student.projects[p]
        const projSkills = Array.from(
          new Set(
            (proj.skills || [])
              .concat(proj.technologies || [])
              .concat(proj.competencies || [])
              .map((s) => s.toLowerCase())
          )
        )
        for (let j = 0; j < requestedSkills.length; j++) {
          const reqSkill = requestedSkills[j]
          for (let k = 0; k < projSkills.length; k++) {
            if (
              projSkills[k].includes(reqSkill) ||
              reqSkill.includes(projSkills[k])
            ) {
              matchedSkillsSet.add(reqSkill)
              break
            }
          }
        }
      }

      const matchedSkills = Array.from(matchedSkillsSet)
      const skillMatchRatio = matchedSkills.length / requestedSkills.length

      // Skill score: up to 40 points
      score += Math.round(skillMatchRatio * 40)
      if (matchedSkills.length > 0) {
        reasons.push(`skillMatch`)
      }

      // 3. Verified projects: up to 20 points
      const verifiedProjects = student.projects.filter(
        (p) => p.verificationStatus === 'VERIFIED'
      )
      const verifiedCount = verifiedProjects.length
      if (verifiedCount > 0) {
        score += Math.min(verifiedCount * 5, 20)
        reasons.push(`verifiedProject`)
      }

      // 4. Institution-verified projects: bonus 10 points
      const institutionVerified = student.projects.filter(
        (p) => p.universityVerified
      )
      if (institutionVerified.length > 0) {
        score += 10
        reasons.push(`institutionVerified`)
      }

      // 5. Grade: up to 15 points
      const projectGrades = student.projects
        .map((p) => p.normalizedGrade)
        .filter((g): g is number => g !== null)
      let avgGrade = 0
      if (projectGrades.length > 0) {
        avgGrade =
          projectGrades.reduce((sum, g) => sum + g, 0) / projectGrades.length
        if (minGrade && avgGrade < minGrade) {
          // Skip candidates below minimum grade
          continue
        }
        score += Math.round((avgGrade / 100) * 15)
        if (avgGrade >= 75) {
          reasons.push(`highGrade`)
        }
      }

      // 6. Profile completeness: up to 10 points
      let completeness = 0
      if (student.firstName) completeness += 1
      if (student.lastName) completeness += 1
      if (student.university) completeness += 1
      if (student.degree) completeness += 1
      if (student.bio) completeness += 1
      if (student.photo) completeness += 1
      if (student.skills.length > 0) completeness += 2
      if (student.projects.length > 0) completeness += 2
      score += completeness

      // 7. Location match: bonus 5 points
      if (location && student.location) {
        const studentLoc = student.location.toLowerCase()
        const reqLoc = location.toLowerCase()
        if (studentLoc.includes(reqLoc) || reqLoc.includes(studentLoc)) {
          score += 5
          reasons.push(`locationMatch`)
        }
      }

      // Only include candidates with at least 1 skill match
      if (matchedSkills.length === 0) {
        continue
      }

      scored.push({
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        university: student.university,
        degree: student.degree,
        graduationYear: student.graduationYear,
        location: student.location,
        photo: student.photo,
        matchScore: Math.min(score, 100),
        matchReasons: reasons,
        matchedSkills: matchedSkills,
        verifiedProjectCount: verifiedCount,
        totalProjectCount: student.projects.length,
      })
    }

    // Sort by score descending, take top 10
    scored.sort((a, b) => b.matchScore - a.matchScore)
    const topMatches = scored.slice(0, 10)

    // Optionally save the shortlist
    let savedId: string | null = null
    if (save) {
      const shortlist = await prisma.aiShortlist.create({
        data: {
          recruiterId: session.user.id,
          title,
          description,
          skills: skills,
          location: location || null,
          minGrade: minGrade || null,
          results: topMatches,
        },
      })
      savedId = shortlist.id
    }

    return NextResponse.json({
      candidates: topMatches,
      total: scored.length,
      savedId,
    })
  } catch (error) {
    console.error('Error in AI shortlist:', error)
    return NextResponse.json(
      { error: 'Failed to generate shortlist' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/recruiter/ai-shortlist
 * Returns saved shortlists for this recruiter.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const shortlists = await prisma.aiShortlist.findMany({
      where: { recruiterId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    return NextResponse.json({
      shortlists: shortlists.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        skills: s.skills,
        location: s.location,
        minGrade: s.minGrade,
        results: s.results,
        createdAt: s.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('Error fetching shortlists:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shortlists' },
      { status: 500 }
    )
  }
}
