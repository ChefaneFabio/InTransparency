import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { getCurrentSkillGraph } from '@/lib/skill-delta'

interface RouteContext {
  params: Promise<{ candidateId: string }>
}

/**
 * GET /api/dashboard/recruiter/evidence-packet/[candidateId]
 *
 * Returns a comprehensive, evidence-heavy dossier suitable for internal hiring decisions:
 *  - Candidate basics
 *  - Verified skill graph (with source counts)
 *  - Most recent MatchExplanation for this recruiter/candidate pair
 *  - Issued VerifiableCredentials
 *  - Stage history with supervisor ratings
 *  - Professor endorsements
 *
 * This is the "Can I hire this person?" document.
 */
export async function GET(_req: NextRequest, ctx: RouteContext) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || (user.role !== 'RECRUITER' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { candidateId } = await ctx.params

  const [candidate, explanation, credentials, stages, endorsements, graph] = await Promise.all([
    prisma.user.findUnique({
      where: { id: candidateId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        photo: true,
        university: true,
        degree: true,
        graduationYear: true,
        location: true,
        bio: true,
        gpa: true,
        gpaPublic: true,
        skills: true,
        linkedinUrl: true,
        githubUrl: true,
      },
    }),
    prisma.matchExplanation.findFirst({
      where: { subjectId: candidateId, counterpartyId: session.user.id },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.verifiableCredential.findMany({
      where: { subjectId: candidateId, status: 'ISSUED' },
      orderBy: { issuedAt: 'desc' },
      select: {
        id: true,
        credentialType: true,
        issuerName: true,
        issuerType: true,
        issuedAt: true,
        shareToken: true,
        viewCount: true,
      },
    }),
    prisma.stageExperience.findMany({
      where: { studentId: candidateId, status: { in: ['EVALUATED', 'VERIFIED', 'COMPLETED'] } },
      orderBy: { startDate: 'desc' },
      take: 10,
    }),
    prisma.professorEndorsement.findMany({
      where: { studentId: candidateId, status: 'VERIFIED' },
      orderBy: { verifiedAt: 'desc' },
      take: 10,
      include: { project: { select: { title: true, id: true } } },
    }),
    getCurrentSkillGraph(candidateId),
  ])

  if (!candidate) return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })

  return NextResponse.json({
    candidate: {
      id: candidate.id,
      name: [candidate.firstName, candidate.lastName].filter(Boolean).join(' ') || candidate.email,
      email: candidate.email,
      photo: candidate.photo,
      university: candidate.university,
      degree: candidate.degree,
      graduationYear: candidate.graduationYear,
      location: candidate.location,
      bio: candidate.bio,
      gpa: candidate.gpaPublic ? candidate.gpa : null,
      linkedinUrl: candidate.linkedinUrl,
      githubUrl: candidate.githubUrl,
    },
    matchExplanation: explanation
      ? {
          id: explanation.id,
          matchScore: explanation.matchScore,
          decisionLabel: explanation.decisionLabel,
          factors: explanation.factors,
          modelVersion: explanation.modelVersion,
          createdAt: explanation.createdAt.toISOString(),
        }
      : null,
    credentials: credentials.map(c => ({
      id: c.id,
      type: c.credentialType,
      issuer: c.issuerName,
      issuerType: c.issuerType,
      issuedAt: c.issuedAt.toISOString(),
      shareUrl: c.shareToken ? `/credentials/verify/${c.shareToken}` : null,
      viewCount: c.viewCount,
    })),
    skillGraph: graph.map(row => ({
      skill: row.skillTerm,
      level: row.currentLevel,
      sources: row.sourceCount,
      escoUri: row.escoUri,
      lastObservedAt: row.lastObservedAt.toISOString(),
    })),
    stages: stages.map(s => ({
      id: s.id,
      role: s.role,
      companyName: s.companyName,
      startDate: s.startDate.toISOString(),
      endDate: s.endDate?.toISOString() ?? null,
      supervisorRating: s.supervisorRating,
      supervisorWouldHire: s.supervisorWouldHire,
      supervisorStrengths: s.supervisorStrengths,
      completedHours: s.completedHours,
    })),
    endorsements: endorsements.map(e => ({
      id: e.id,
      professorName: e.professorName,
      professorTitle: e.professorTitle,
      university: e.university,
      courseName: e.courseName,
      rating: e.rating,
      grade: e.grade,
      projectTitle: e.project.title,
      projectId: e.project.id,
      skills: e.skills,
      verifiedAt: e.verifiedAt?.toISOString() ?? null,
    })),
    generatedAt: new Date().toISOString(),
  })
}
