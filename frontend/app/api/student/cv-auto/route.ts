import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { getCurrentSkillGraph } from '@/lib/skill-delta'

/**
 * GET /api/student/cv-auto
 *
 * Auto-generates a structured CV from the student's verified record:
 *   - Personal info (from profile)
 *   - Education (degree, university, graduation year, thesis)
 *   - Verified projects (ranked by complexity + verification)
 *   - Stage/internship experience with supervisor quotes
 *   - Professor endorsements (top 3)
 *   - Skill graph organized by proficiency (Expert → Advanced → Intermediate)
 *
 * Returns structured JSON the client can render as a PDF, HTML, or Europass XML.
 * The key advantage over traditional CV builders: every claim here is backed
 * by platform evidence and the VerifiableCredentials section can be shared
 * standalone.
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [user, projects, stages, endorsements, credentials] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        bio: true,
        tagline: true,
        location: true,
        university: true,
        degree: true,
        graduationYear: true,
        gpa: true,
        gpaPublic: true,
        thesisTitle: true,
        thesisSubject: true,
        thesisSupervisor: true,
        linkedinUrl: true,
        githubUrl: true,
        workExperience: true,
        interests: true,
      },
    }),
    prisma.project.findMany({
      where: { userId: session.user.id, verificationStatus: 'VERIFIED' },
      orderBy: [{ innovationScore: 'desc' }, { updatedAt: 'desc' }],
      take: 6,
      select: {
        id: true,
        title: true,
        description: true,
        skills: true,
        technologies: true,
        discipline: true,
        innovationScore: true,
        githubUrl: true,
        liveUrl: true,
        updatedAt: true,
      },
    }),
    prisma.stageExperience.findMany({
      where: { studentId: session.user.id, status: { in: ['EVALUATED', 'VERIFIED', 'COMPLETED'] } },
      orderBy: { startDate: 'desc' },
      take: 5,
      select: {
        role: true,
        companyName: true,
        department: true,
        startDate: true,
        endDate: true,
        completedHours: true,
        supervisorStrengths: true,
        supervisorWouldHire: true,
        supervisorRating: true,
      },
    }),
    prisma.professorEndorsement.findMany({
      where: { studentId: session.user.id, status: 'VERIFIED' },
      orderBy: { rating: 'desc' },
      take: 3,
      select: {
        professorName: true,
        professorTitle: true,
        university: true,
        endorsementText: true,
        rating: true,
        project: { select: { title: true } },
      },
    }),
    prisma.verifiableCredential.count({
      where: { subjectId: session.user.id, status: 'ISSUED' },
    }),
  ])

  if (!user) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const graph = await getCurrentSkillGraph(session.user.id)

  // Organize skills by proficiency bucket
  const skillsByLevel = {
    expert: graph.filter(g => g.currentLevel === 4),
    advanced: graph.filter(g => g.currentLevel === 3),
    intermediate: graph.filter(g => g.currentLevel === 2),
    beginner: graph.filter(g => g.currentLevel === 1),
  }

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    header: {
      name: [user.firstName, user.lastName].filter(Boolean).join(' '),
      tagline: user.tagline,
      email: user.email,
      location: user.location,
      linkedinUrl: user.linkedinUrl,
      githubUrl: user.githubUrl,
    },
    summary: user.bio,
    education: user.degree
      ? [
          {
            degree: user.degree,
            institution: user.university ?? '',
            graduationYear: user.graduationYear,
            grade: user.gpaPublic ? user.gpa : null,
            thesis: user.thesisTitle
              ? {
                  title: user.thesisTitle,
                  subject: user.thesisSubject,
                  supervisor: user.thesisSupervisor,
                }
              : null,
          },
        ]
      : [],
    experience: stages.map(s => ({
      role: s.role,
      company: s.companyName,
      department: s.department,
      startDate: s.startDate.toISOString(),
      endDate: s.endDate?.toISOString() ?? null,
      hours: s.completedHours,
      supervisorQuote: s.supervisorStrengths,
      verified: true,
      wouldHire: s.supervisorWouldHire,
    })),
    projects: projects.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description?.slice(0, 300),
      skills: p.skills,
      technologies: p.technologies,
      discipline: p.discipline,
      innovationScore: p.innovationScore,
      links: {
        github: p.githubUrl,
        live: p.liveUrl,
      },
      verified: true,
    })),
    endorsements: endorsements.map(e => ({
      from: e.professorName,
      title: e.professorTitle,
      university: e.university,
      rating: e.rating,
      quote: e.endorsementText,
      project: e.project.title,
    })),
    skills: {
      expert: skillsByLevel.expert.map(s => ({ skill: s.skillTerm, sources: s.sourceCount, escoUri: s.escoUri })),
      advanced: skillsByLevel.advanced.map(s => ({ skill: s.skillTerm, sources: s.sourceCount, escoUri: s.escoUri })),
      intermediate: skillsByLevel.intermediate.map(s => ({ skill: s.skillTerm, sources: s.sourceCount, escoUri: s.escoUri })),
      beginner: skillsByLevel.beginner.map(s => ({ skill: s.skillTerm, sources: s.sourceCount, escoUri: s.escoUri })),
    },
    credentials: {
      issuedCount: credentials,
      verifyEndpoint: '/api/credentials/public-key',
    },
    evidenceFootnote:
      'Every claim in this CV is backed by verifiable evidence on the InTransparency platform. ' +
      'Recipients can request a public verification link for any credential or endorsement.',
  })
}
