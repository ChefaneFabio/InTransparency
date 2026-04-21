import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * POST /api/dashboard/university/internship-pipeline/deals
 * Create a new InternshipDeal card on the kanban.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json().catch(() => ({}))
    const { companyName, stage, studentId, role, contactName, contactEmail, industry, tutorName, tutorEmail, salaryAmount, notes } = body

    if (!companyName || typeof companyName !== 'string' || !companyName.trim()) {
      return NextResponse.json({ error: 'companyName is required' }, { status: 400 })
    }

    const universityName = user.university || user.company || ''
    if (!universityName) return NextResponse.json({ error: 'No institution on session' }, { status: 400 })

    const allowedStages = ['LEAD', 'CONVENZIONE', 'MATCHING', 'ATTIVO', 'COMPLETATO', 'ASSUNTO', 'LOST']
    const finalStage = allowedStages.includes(stage) ? stage : 'LEAD'

    // Validate student belongs to the same university, if provided
    if (studentId) {
      const student = await prisma.user.findFirst({
        where: { id: studentId, role: 'STUDENT', university: universityName },
        select: { id: true },
      })
      if (!student) return NextResponse.json({ error: 'Student not found in your institution' }, { status: 404 })
    }

    const deal = await prisma.internshipDeal.create({
      data: {
        universityName,
        ownerId: session.user.id,
        companyName: companyName.trim(),
        contactName: contactName?.trim() || null,
        contactEmail: contactEmail?.trim() || null,
        role: role?.trim() || null,
        industry: industry?.trim() || null,
        studentId: studentId || null,
        stage: finalStage as any,
        tutorName: tutorName?.trim() || null,
        tutorEmail: tutorEmail?.trim() || null,
        salaryAmount: typeof salaryAmount === 'number' ? salaryAmount : null,
        notes: notes?.trim() || null,
        sourceType: 'MANUAL',
      },
    })

    return NextResponse.json({ deal }, { status: 201 })
  } catch (error) {
    console.error('InternshipDeal create error:', error)
    return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 })
  }
}
