import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// GET /api/dashboard/university/prior-learning
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || ''

    const where: any = { universityId: user.id }
    if (status) where.status = status

    const assessments = await prisma.priorLearningAssessment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    // Enrich with student names
    const studentIds = assessments.map((a) => a.studentId)
    const students = await prisma.user.findMany({
      where: { id: { in: studentIds } },
      select: { id: true, firstName: true, lastName: true },
    })
    const studentMap: Record<string, string> = {}
    students.forEach((s) => {
      studentMap[s.id] = `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Studente'
    })

    const enriched = assessments.map((a) => ({
      ...a,
      studentName: studentMap[a.studentId] || 'Studente',
    }))

    const stats = {
      total: assessments.length,
      submitted: assessments.filter((a) => a.status === 'SUBMITTED').length,
      underReview: assessments.filter((a) => a.status === 'UNDER_REVIEW').length,
      approved: assessments.filter((a) => a.status === 'APPROVED').length,
      rejected: assessments.filter((a) => a.status === 'REJECTED').length,
    }

    return NextResponse.json({ assessments: enriched, stats })
  } catch (error) {
    console.error('Prior learning GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/dashboard/university/prior-learning — create new assessment
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { studentId, experienceType, description, yearsExperience, evidenceUrls } = body

    if (!studentId || !experienceType || !description) {
      return NextResponse.json({ error: 'studentId, experienceType, and description are required' }, { status: 400 })
    }

    const assessment = await prisma.priorLearningAssessment.create({
      data: {
        studentId,
        universityId: user.id,
        experienceType,
        description,
        yearsExperience: yearsExperience || null,
        evidenceUrls: evidenceUrls || [],
        status: 'SUBMITTED',
      },
    })

    return NextResponse.json({ success: true, assessment })
  } catch (error) {
    console.error('Prior learning POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/dashboard/university/prior-learning — review assessment
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { assessmentId, status, reviewerNotes, creditEquivalent, recognizedSkills } = body

    if (!assessmentId || !status) {
      return NextResponse.json({ error: 'assessmentId and status are required' }, { status: 400 })
    }

    if (status !== 'APPROVED' && status !== 'REJECTED' && status !== 'UNDER_REVIEW') {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const assessment = await prisma.priorLearningAssessment.update({
      where: { id: assessmentId },
      data: {
        status,
        reviewerNotes: reviewerNotes || null,
        creditEquivalent: creditEquivalent || null,
        recognizedSkills: recognizedSkills || null,
        reviewedBy: user.id,
        reviewedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, assessment })
  } catch (error) {
    console.error('Prior learning PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
