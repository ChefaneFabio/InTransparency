import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// GET /api/dashboard/university/stages
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
    const type = searchParams.get('type') || ''

    const where: any = { universityName }
    if (status) where.status = status
    if (type) where.stageType = type
    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { role: { contains: search, mode: 'insensitive' } },
        { student: { firstName: { contains: search, mode: 'insensitive' } } },
        { student: { lastName: { contains: search, mode: 'insensitive' } } },
      ]
    }

    const stages = await prisma.stageExperience.findMany({
      where,
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true, email: true, photo: true, degree: true },
        },
      },
      orderBy: { startDate: 'desc' },
    })

    // Stats
    const allStages = await prisma.stageExperience.findMany({
      where: { universityName },
      select: { status: true, stageType: true, completedHours: true, supervisorRating: true, supervisorWouldHire: true, companyName: true },
    })

    const totalHours = allStages.reduce((sum, s) => sum + s.completedHours, 0)
    const ratings = allStages.filter(s => s.supervisorRating).map(s => s.supervisorRating!)
    const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length) : 0
    const wouldHire = allStages.filter(s => s.supervisorWouldHire === true).length
    const evaluated = allStages.filter(s => s.supervisorRating !== null).length
    const companies = new Set(allStages.map(s => s.companyName))

    const byStatus: Record<string, number> = {}
    const byType: Record<string, number> = {}
    for (const s of allStages) {
      byStatus[s.status] = (byStatus[s.status] || 0) + 1
      byType[s.stageType] = (byType[s.stageType] || 0) + 1
    }

    return NextResponse.json({
      stages: stages.map(s => ({
        id: s.id,
        studentName: [s.student.firstName, s.student.lastName].filter(Boolean).join(' '),
        studentEmail: s.student.email,
        studentPhoto: s.student.photo,
        studentDegree: s.student.degree,
        companyName: s.companyName,
        companyIndustry: s.companyIndustry,
        role: s.role,
        department: s.department,
        supervisorName: s.supervisorName,
        startDate: s.startDate.toISOString(),
        endDate: s.endDate?.toISOString() || null,
        targetHours: s.targetHours,
        completedHours: s.completedHours,
        stageType: s.stageType,
        status: s.status,
        studentSkills: s.studentSkills,
        studentRating: s.studentRating,
        studentHighlight: s.studentHighlight,
        supervisorRating: s.supervisorRating,
        supervisorCompetencies: s.supervisorCompetencies,
        supervisorStrengths: s.supervisorStrengths,
        supervisorWouldHire: s.supervisorWouldHire,
        verified: s.verified,
        verifiedSkills: s.verifiedSkills,
        createdAt: s.createdAt.toISOString(),
      })),
      stats: {
        total: allStages.length,
        active: byStatus['ACTIVE'] || 0,
        completed: (byStatus['COMPLETED'] || 0) + (byStatus['EVALUATED'] || 0) + (byStatus['VERIFIED'] || 0),
        evaluated,
        totalHours,
        avgRating: Math.round(avgRating * 10) / 10,
        wouldHireRate: evaluated > 0 ? Math.round((wouldHire / evaluated) * 100) : 0,
        companies: companies.size,
        byType,
      },
    })
  } catch (error) {
    console.error('Stages error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/dashboard/university/stages — register a new stage/tirocinio
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
    const { studentId, companyName, role, department, companyIndustry, supervisorName, supervisorEmail, startDate, endDate, targetHours, stageType } = body

    if (!studentId || !companyName || !role || !startDate) {
      return NextResponse.json({ error: 'Student, company, role, and start date are required' }, { status: 400 })
    }

    // Verify student belongs to university
    const student = await prisma.user.findFirst({
      where: { id: studentId, university: universityName, role: 'STUDENT' },
    })
    if (!student) return NextResponse.json({ error: 'Student not found in your institution' }, { status: 404 })

    const stage = await prisma.stageExperience.create({
      data: {
        studentId,
        universityName,
        companyName,
        role,
        department: department || null,
        companyIndustry: companyIndustry || null,
        supervisorName: supervisorName || null,
        supervisorEmail: supervisorEmail || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        targetHours: targetHours ? parseInt(targetHours) : null,
        stageType: stageType || 'CURRICULARE',
        status: 'ACTIVE',
      },
    })

    return NextResponse.json({ success: true, stage })
  } catch (error) {
    console.error('Create stage error:', error)
    return NextResponse.json({ error: 'Failed to create stage' }, { status: 500 })
  }
}
