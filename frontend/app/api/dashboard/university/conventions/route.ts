import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// GET /api/dashboard/university/conventions
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = user.company || ''
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    const where: any = { universityName }
    if (status) where.status = status
    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { studentName: { contains: search, mode: 'insensitive' } },
        { companyContact: { contains: search, mode: 'insensitive' } },
      ]
    }

    const conventions = await prisma.stageConvention.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    // Stats
    const all = await prisma.stageConvention.findMany({
      where: { universityName },
      select: { status: true },
    })

    const stats = {
      total: all.length,
      draft: all.filter(c => c.status === 'DRAFT').length,
      pending: all.filter(c => c.status === 'PENDING_SIGNATURES').length,
      active: all.filter(c => c.status === 'ACTIVE').length,
      completed: all.filter(c => c.status === 'COMPLETED').length,
      expired: all.filter(c => c.status === 'EXPIRED').length,
    }

    return NextResponse.json({
      conventions: conventions.map(c => ({
        id: c.id,
        companyName: c.companyName,
        companyContact: c.companyContact,
        companyEmail: c.companyEmail,
        studentName: c.studentName,
        conventionType: c.conventionType,
        objectives: c.objectives,
        department: c.department,
        totalHours: c.totalHours,
        startDate: c.startDate?.toISOString() || null,
        endDate: c.endDate?.toISOString() || null,
        status: c.status,
        signedByUniversity: c.signedByUniversity,
        signedByCompany: c.signedByCompany,
        signedByStudent: c.signedByStudent,
        documentUrl: c.documentUrl,
        createdAt: c.createdAt.toISOString(),
      })),
      stats,
    })
  } catch (error) {
    console.error('Conventions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/dashboard/university/conventions — create a new convention
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = user.company || ''
    const body = await req.json()

    const {
      companyName, companyAddress, companyVAT, companyContact, companyEmail, companyPhone,
      universityContact, universityEmail,
      studentId, studentName,
      conventionType, objectives, activities, department,
      hoursPerWeek, totalHours, startDate, endDate,
      insuranceINAIL, insuranceRCT, ccnlReference, notes,
    } = body

    if (!companyName) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 })
    }

    const convention = await prisma.stageConvention.create({
      data: {
        universityName,
        createdBy: session.user.id,
        companyName,
        companyAddress: companyAddress || null,
        companyVAT: companyVAT || null,
        companyContact: companyContact || null,
        companyEmail: companyEmail || null,
        companyPhone: companyPhone || null,
        universityContact: universityContact || null,
        universityEmail: universityEmail || null,
        studentId: studentId || null,
        studentName: studentName || null,
        conventionType: conventionType || 'TIROCINIO_CURRICULARE',
        objectives: objectives || null,
        activities: activities || null,
        department: department || null,
        hoursPerWeek: hoursPerWeek ? parseInt(hoursPerWeek) : null,
        totalHours: totalHours ? parseInt(totalHours) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        insuranceINAIL: insuranceINAIL || null,
        insuranceRCT: insuranceRCT || null,
        ccnlReference: ccnlReference || null,
        notes: notes || null,
        status: 'DRAFT',
      },
    })

    return NextResponse.json({ success: true, convention })
  } catch (error) {
    console.error('Create convention error:', error)
    return NextResponse.json({ error: 'Failed to create convention' }, { status: 500 })
  }
}
