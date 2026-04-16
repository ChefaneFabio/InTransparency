import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// GET /api/dashboard/university/orientation
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const assessments = await prisma.orientationAssessment.findMany({
      where: { universityId: user.id },
      include: { result: true },
      orderBy: { createdAt: 'desc' },
    })

    // Fetch student names
    const studentIds = assessments.map((a) => a.studentId)
    const students = await prisma.user.findMany({
      where: { id: { in: studentIds } },
      select: { id: true, firstName: true, lastName: true, email: true },
    })
    const studentMap: Record<string, { firstName: string | null; lastName: string | null; email: string }> = {}
    students.forEach((s) => {
      studentMap[s.id] = { firstName: s.firstName, lastName: s.lastName, email: s.email }
    })

    const totalAssessments = assessments.length
    const completed = assessments.filter((a) => a.status === 'COMPLETED').length
    const inProgress = totalAssessments - completed

    // Aggregate interest areas from completed results
    const interestAreas: Record<string, number[]> = {}
    assessments.forEach((a) => {
      if (a.result && a.result.interestProfile) {
        const profile = a.result.interestProfile as Record<string, number>
        const keys = Object.keys(profile)
        keys.forEach((key) => {
          if (!interestAreas[key]) interestAreas[key] = []
          interestAreas[key].push(profile[key])
        })
      }
    })

    const avgInterestAreas: Record<string, number> = {}
    const areaKeys = Object.keys(interestAreas)
    areaKeys.forEach((key) => {
      const values = interestAreas[key]
      avgInterestAreas[key] = Math.round(values.reduce((a, b) => a + b, 0) / values.length)
    })

    const enrichedAssessments = assessments.map((a) => ({
      ...a,
      studentName: studentMap[a.studentId]
        ? `${studentMap[a.studentId].firstName || ''} ${studentMap[a.studentId].lastName || ''}`.trim()
        : 'Studente',
      studentEmail: studentMap[a.studentId]?.email || '',
    }))

    return NextResponse.json({
      assessments: enrichedAssessments,
      stats: {
        total: totalAssessments,
        completed,
        inProgress,
        avgInterestAreas,
      },
    })
  } catch (error) {
    console.error('Orientation GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/dashboard/university/orientation — start a new assessment
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { studentId, assessmentType } = body

    if (!studentId) {
      return NextResponse.json({ error: 'studentId is required' }, { status: 400 })
    }

    const assessment = await prisma.orientationAssessment.create({
      data: {
        studentId,
        universityId: user.id,
        assessmentType: assessmentType || 'combined',
        responses: {},
        status: 'IN_PROGRESS',
      },
    })

    return NextResponse.json({ success: true, assessment })
  } catch (error) {
    console.error('Orientation POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
