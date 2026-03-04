import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// GET /api/professor/endorsements — list endorsements by this professor's email
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, role: true },
    })

    if (!user || user.role !== 'PROFESSOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const statusFilter = req.nextUrl.searchParams.get('status')

    const where: Record<string, unknown> = {
      professorEmail: user.email,
    }
    if (statusFilter && statusFilter !== 'ALL') {
      where.status = statusFilter
    }

    const endorsements = await prisma.professorEndorsement.findMany({
      where,
      include: {
        student: {
          select: { firstName: true, lastName: true, university: true },
        },
        project: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      endorsements: endorsements.map((e) => ({
        id: e.id,
        studentName: `${e.student.firstName} ${e.student.lastName}`,
        studentUniversity: e.student.university,
        projectTitle: e.project.title,
        projectId: e.project.id,
        courseName: e.courseName,
        status: e.status,
        rating: e.rating,
        endorsementText: e.endorsementText,
        verifiedAt: e.verifiedAt,
        createdAt: e.createdAt,
        verificationToken: e.status === 'PENDING' ? e.verificationToken : null,
      })),
    })
  } catch (error) {
    console.error('Error fetching professor endorsements:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
