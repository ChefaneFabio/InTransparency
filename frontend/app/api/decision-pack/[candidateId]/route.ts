import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/decision-pack/[candidateId]
 * Returns a decision pack for a specific candidate.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ candidateId: string }> }
) {
  try {
    const { candidateId } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch candidate profile
    const candidate = await prisma.user.findUnique({
      where: { id: candidateId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        photo: true,
        email: true,
        university: true,
        degree: true,
        graduationYear: true,
        gpa: true,
        bio: true,
        tagline: true,
        skills: true,
        interests: true,
        location: true,
        linkedinUrl: true,
        githubUrl: true,
        profilePublic: true,
      },
    })

    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
    }

    // Legitimate-business-need gate. A recruiter may pull a decision pack only
    // if at least one of these is true:
    //   (1) ADMIN — bypass.
    //   (2) Candidate has profilePublic=true — they have opted into discovery.
    //   (3) Recruiter has prior contact with this candidate — message in either
    //       direction, OR an application from this candidate to one of the
    //       recruiter's jobs.
    //   (4) Recruiter is on a paid tier (subscriptionTier !== FREE) — they
    //       have purchased access to the talent pool.
    // This prevents enumeration of private candidate profiles by any logged-in
    // recruiter and keeps the email field gated on a real business reason.
    if (session.user.role !== 'ADMIN' && !candidate.profilePublic) {
      const recruiterTier = (session.user as { subscriptionTier?: string }).subscriptionTier
      const isPaid = recruiterTier && recruiterTier !== 'FREE'

      let hasContact = false
      if (!isPaid) {
        const [msg, app] = await Promise.all([
          prisma.message.findFirst({
            where: {
              OR: [
                { senderId: session.user.id, recipientId: candidateId },
                { senderId: candidateId, recipientId: session.user.id },
              ],
            },
            select: { id: true },
          }),
          prisma.application.findFirst({
            where: {
              applicantId: candidateId,
              job: { recruiterId: session.user.id },
            },
            select: { id: true },
          }),
        ])
        hasContact = Boolean(msg || app)
      }

      if (!isPaid && !hasContact) {
        return NextResponse.json(
          {
            error: 'Forbidden',
            code: 'NO_BUSINESS_RELATIONSHIP',
            message:
              'This candidate has not made their profile public. Reach out via a message or application before requesting a decision pack, or upgrade to access the full talent pool.',
          },
          { status: 403 }
        )
      }
    }

    // Fetch projects
    const projects = await prisma.project.findMany({
      where: { userId: candidateId, isPublic: true },
      select: {
        id: true,
        title: true,
        description: true,
        grade: true,
        normalizedGrade: true,
        verificationStatus: true,
        universityVerified: true,
        skills: true,
        technologies: true,
        complexityScore: true,
        innovationScore: true,
        marketRelevance: true,
        courseName: true,
        courseCode: true,
        semester: true,
        featured: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // Fetch endorsements
    const endorsements = await prisma.professorEndorsement.findMany({
      where: { studentId: candidateId, verified: true },
      select: {
        id: true,
        professorName: true,
        professorTitle: true,
        department: true,
        university: true,
        courseName: true,
        endorsementText: true,
        skills: true,
        rating: true,
        competencyRatings: true,
        verifiedAt: true,
      },
    })

    // Fetch placement prediction if available
    const prediction = await prisma.placementPrediction.findFirst({
      where: { studentId: candidateId },
      orderBy: { generatedAt: 'desc' },
      select: {
        probability: true,
        topFactors: true,
        generatedAt: true,
      },
    })

    // Calculate trust score: verified projects / total projects
    const totalProjects = projects.length
    const verifiedProjects = projects.filter(
      (p) => p.verificationStatus === 'VERIFIED' || p.universityVerified
    ).length
    const trustScore = totalProjects > 0
      ? Math.round((verifiedProjects / totalProjects) * 100)
      : 0

    // Aggregate all skills from projects + user profile
    const allSkills = new Set<string>()
    for (const s of candidate.skills) allSkills.add(s)
    for (const p of projects) {
      for (const s of p.skills) allSkills.add(s)
      for (const t of p.technologies) allSkills.add(t)
    }
    for (const e of endorsements) {
      for (const s of e.skills) allSkills.add(s)
    }

    return NextResponse.json({
      candidate: {
        id: candidate.id,
        name: [candidate.firstName, candidate.lastName].filter(Boolean).join(' ') || 'Unknown',
        photo: candidate.photo,
        email: candidate.email,
        university: candidate.university,
        degree: candidate.degree,
        graduationYear: candidate.graduationYear,
        gpa: candidate.gpa,
        bio: candidate.bio,
        tagline: candidate.tagline,
        location: candidate.location,
        linkedinUrl: candidate.linkedinUrl,
        githubUrl: candidate.githubUrl,
      },
      trustScore,
      verifiedProjects,
      totalProjects,
      projects: projects.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        grade: p.grade,
        normalizedGrade: p.normalizedGrade,
        verificationStatus: p.verificationStatus,
        universityVerified: p.universityVerified,
        skills: p.skills,
        technologies: p.technologies,
        complexityScore: p.complexityScore,
        innovationScore: p.innovationScore,
        marketRelevance: p.marketRelevance,
        courseName: p.courseName,
        courseCode: p.courseCode,
        semester: p.semester,
        featured: p.featured,
        createdAt: p.createdAt.toISOString(),
      })),
      skills: Array.from(allSkills),
      endorsements: endorsements.map((e) => ({
        id: e.id,
        professorName: e.professorName,
        professorTitle: e.professorTitle,
        department: e.department,
        university: e.university,
        courseName: e.courseName,
        endorsementText: e.endorsementText,
        skills: e.skills,
        rating: e.rating,
        competencyRatings: e.competencyRatings,
        verifiedAt: e.verifiedAt?.toISOString() ?? null,
      })),
      placementProbability: prediction?.probability ?? null,
      placementTopFactors: prediction?.topFactors ?? null,
      placementGeneratedAt: prediction?.generatedAt?.toISOString() ?? null,
    })
  } catch (error) {
    console.error('Error fetching decision pack for candidate:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
