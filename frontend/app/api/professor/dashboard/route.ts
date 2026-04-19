import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * GET /api/professor/dashboard?token=<verificationToken>
 *
 * Token-based auth (no account) — consistent with the email-link endorsement
 * flow. Any valid endorsement token grants access to all endorsements
 * addressed to the same professor email.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 })

  // Resolve the token → professor email
  const reference = await prisma.professorEndorsement.findUnique({
    where: { verificationToken: token },
    select: { professorEmail: true, professorName: true, university: true },
  })
  if (!reference) return NextResponse.json({ error: 'Invalid token' }, { status: 404 })

  const professorEmail = reference.professorEmail

  // Fetch all endorsements addressed to this professor email
  const endorsements = await prisma.professorEndorsement.findMany({
    where: { professorEmail },
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      student: {
        select: { firstName: true, lastName: true, email: true, university: true, degree: true, photo: true },
      },
      project: { select: { id: true, title: true, description: true, technologies: true } },
    },
  })

  const pending = endorsements.filter(e => e.status === 'PENDING')
  const verified = endorsements.filter(e => e.status === 'VERIFIED')
  const declined = endorsements.filter(e => e.status === 'DECLINED')

  return NextResponse.json({
    professor: {
      name: reference.professorName,
      email: professorEmail,
      university: reference.university,
    },
    stats: {
      pending: pending.length,
      verified: verified.length,
      declined: declined.length,
      total: endorsements.length,
    },
    pending: pending.map(e => ({
      id: e.id,
      verificationToken: e.verificationToken, // Used for quick-action deep links
      studentName:
        [e.student.firstName, e.student.lastName].filter(Boolean).join(' ') || e.student.email,
      studentPhoto: e.student.photo,
      studentDegree: e.student.degree,
      studentUniversity: e.student.university,
      projectId: e.project.id,
      projectTitle: e.project.title,
      projectDescription: e.project.description?.substring(0, 200),
      courseName: e.courseName,
      semester: e.semester,
      createdAt: e.createdAt.toISOString(),
      daysWaiting: Math.floor((Date.now() - e.createdAt.getTime()) / 86400000),
    })),
    history: [...verified, ...declined].slice(0, 30).map(e => ({
      id: e.id,
      status: e.status,
      studentName:
        [e.student.firstName, e.student.lastName].filter(Boolean).join(' ') || e.student.email,
      projectTitle: e.project.title,
      rating: e.rating,
      grade: e.grade,
      skills: e.skills,
      verifiedAt: e.verifiedAt?.toISOString() ?? null,
    })),
  })
}
