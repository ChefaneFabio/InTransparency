import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * POST /api/decision-pack/compare
 * Compare multiple candidates side-by-side.
 * Body: { candidateIds: string[] }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { candidateIds } = body

    if (!Array.isArray(candidateIds) || candidateIds.length === 0) {
      return NextResponse.json(
        { error: 'candidateIds must be a non-empty array' },
        { status: 400 }
      )
    }

    if (candidateIds.length > 10) {
      return NextResponse.json(
        { error: 'Cannot compare more than 10 candidates at once' },
        { status: 400 }
      )
    }

    // Fetch all candidates with their projects, endorsements, and predictions
    const candidates = await prisma.user.findMany({
      where: { id: { in: candidateIds } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        photo: true,
        university: true,
        degree: true,
        graduationYear: true,
        gpa: true,
        skills: true,
        location: true,
        projects: {
          where: { isPublic: true },
          select: {
            id: true,
            verificationStatus: true,
            universityVerified: true,
            skills: true,
            technologies: true,
            normalizedGrade: true,
          },
        },
        endorsements: {
          where: { verified: true },
          select: { id: true },
        },
        predictions: {
          orderBy: { generatedAt: 'desc' },
          take: 1,
          select: { probability: true },
        },
      },
    })

    const summaries = candidates.map((c) => {
      const totalProjects = c.projects.length
      const verifiedProjects = c.projects.filter(
        (p) => p.verificationStatus === 'VERIFIED' || p.universityVerified
      ).length
      const trustScore = totalProjects > 0
        ? Math.round((verifiedProjects / totalProjects) * 100)
        : 0

      // Aggregate all skills
      const allSkills = new Set<string>()
      for (const s of c.skills) allSkills.add(s)
      for (const p of c.projects) {
        for (const s of p.skills) allSkills.add(s)
        for (const t of p.technologies) allSkills.add(t)
      }

      // Average normalized grade across projects that have one
      const gradesArr = c.projects
        .map((p) => p.normalizedGrade)
        .filter((g): g is number => g !== null)
      const avgGrade = gradesArr.length > 0
        ? Math.round(gradesArr.reduce((sum, g) => sum + g, 0) / gradesArr.length)
        : null

      return {
        id: c.id,
        name: [c.firstName, c.lastName].filter(Boolean).join(' ') || 'Unknown',
        photo: c.photo,
        university: c.university,
        degree: c.degree,
        graduationYear: c.graduationYear,
        gpa: c.gpa,
        location: c.location,
        totalProjects,
        verifiedProjects,
        trustScore,
        skillsCount: allSkills.size,
        skills: Array.from(allSkills),
        endorsementsCount: c.endorsements.length,
        averageGrade: avgGrade,
        placementProbability: c.predictions[0]?.probability ?? null,
      }
    })

    return NextResponse.json({ candidates: summaries })
  } catch (error) {
    console.error('Error comparing candidates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
