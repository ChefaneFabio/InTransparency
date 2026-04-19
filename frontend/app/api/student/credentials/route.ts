import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/student/credentials
 * Lists every VerifiableCredential issued for the current user plus the
 * "issuable" endorsements/stages that could be turned into credentials
 * (verified but no VC yet).
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [issued, endorsements, stages] = await Promise.all([
    prisma.verifiableCredential.findMany({
      where: { subjectId: session.user.id },
      orderBy: { issuedAt: 'desc' },
      select: {
        id: true,
        credentialType: true,
        issuerName: true,
        issuerType: true,
        status: true,
        shareToken: true,
        viewCount: true,
        issuedAt: true,
        expiresAt: true,
        sourceType: true,
        sourceId: true,
      },
    }),
    // Verified endorsements without a VC yet
    prisma.professorEndorsement.findMany({
      where: { studentId: session.user.id, status: 'VERIFIED' },
      select: {
        id: true,
        professorName: true,
        university: true,
        verifiedAt: true,
        project: { select: { title: true } },
      },
    }),
    // Evaluated stages without a VC yet
    prisma.stageExperience.findMany({
      where: { studentId: session.user.id, supervisorCompleted: true },
      select: {
        id: true,
        role: true,
        companyName: true,
        universityName: true,
        supervisorEvalDate: true,
      },
    }),
  ])

  const issuedSources = new Set(issued.map(v => `${v.sourceType}:${v.sourceId}`))

  const issuable = [
    ...endorsements
      .filter(e => !issuedSources.has(`ProfessorEndorsement:${e.id}`))
      .map(e => ({
        sourceType: 'ProfessorEndorsement' as const,
        sourceId: e.id,
        label: `Endorsement: ${e.project.title}`,
        subLabel: `${e.professorName} — ${e.university}`,
        verifiedAt: e.verifiedAt?.toISOString() ?? null,
      })),
    ...stages
      .filter(s => !issuedSources.has(`StageExperience:${s.id}`))
      .map(s => ({
        sourceType: 'StageExperience' as const,
        sourceId: s.id,
        label: `Stage: ${s.role} @ ${s.companyName}`,
        subLabel: s.universityName,
        verifiedAt: s.supervisorEvalDate?.toISOString() ?? null,
      })),
  ]

  return NextResponse.json({
    issued: issued.map(v => ({
      id: v.id,
      credentialType: v.credentialType,
      issuerName: v.issuerName,
      issuerType: v.issuerType,
      status: v.status,
      shareToken: v.shareToken,
      viewCount: v.viewCount,
      issuedAt: v.issuedAt.toISOString(),
      expiresAt: v.expiresAt?.toISOString() ?? null,
      sourceType: v.sourceType,
    })),
    issuable,
  })
}
