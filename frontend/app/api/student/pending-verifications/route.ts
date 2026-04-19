import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/student/pending-verifications
 * Returns everything the student has "in flight" — endorsements awaiting professor
 * response, stages awaiting supervisor evaluation, projects awaiting university verification,
 * exchanges awaiting host completion.
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [endorsements, stages, projects, exchanges] = await Promise.all([
    prisma.professorEndorsement.findMany({
      where: { studentId: session.user.id, status: 'PENDING' },
      select: {
        id: true,
        professorName: true,
        university: true,
        createdAt: true,
        project: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    prisma.stageExperience.findMany({
      where: { studentId: session.user.id, supervisorCompleted: false, status: { in: ['ACTIVE', 'COMPLETED'] } },
      select: {
        id: true,
        role: true,
        companyName: true,
        supervisorName: true,
        endDate: true,
        status: true,
      },
      orderBy: { startDate: 'desc' },
      take: 10,
    }),
    prisma.project.findMany({
      where: { userId: session.user.id, verificationStatus: 'PENDING' },
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.exchangeEnrollment.findMany({
      where: {
        studentId: session.user.id,
        status: 'ACTIVE',
        verifiedByHost: false,
      },
      select: {
        id: true,
        hostUniversityName: true,
        hostCountry: true,
        endDate: true,
      },
      orderBy: { startDate: 'desc' },
      take: 5,
    }),
  ])

  return NextResponse.json({
    endorsements: endorsements.map(e => ({
      id: e.id,
      professorName: e.professorName,
      university: e.university,
      projectTitle: e.project.title,
      requestedAt: e.createdAt.toISOString(),
      daysWaiting: Math.floor((Date.now() - e.createdAt.getTime()) / 86400000),
    })),
    stages: stages.map(s => ({
      id: s.id,
      role: s.role,
      companyName: s.companyName,
      supervisorName: s.supervisorName,
      endDate: s.endDate?.toISOString() ?? null,
      status: s.status,
    })),
    projects: projects.map(p => ({
      id: p.id,
      title: p.title,
      createdAt: p.createdAt.toISOString(),
    })),
    exchanges: exchanges.map(e => ({
      id: e.id,
      hostUniversityName: e.hostUniversityName,
      hostCountry: e.hostCountry,
      endDate: e.endDate?.toISOString() ?? null,
    })),
    total:
      endorsements.length + stages.length + projects.length + exchanges.length,
  })
}
