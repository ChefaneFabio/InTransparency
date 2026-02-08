import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// GET /api/dashboard/university/placements
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

    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }
    if (type && type !== 'all') {
      where.jobType = type.toUpperCase()
    }
    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { jobTitle: { contains: search, mode: 'insensitive' } },
        { student: { firstName: { contains: search, mode: 'insensitive' } } },
        { student: { lastName: { contains: search, mode: 'insensitive' } } },
      ]
    }

    const placements = await prisma.placement.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            degree: true,
            photo: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
    })

    const formatted = placements.map(p => ({
      id: p.id,
      studentName: [p.student.firstName, p.student.lastName].filter(Boolean).join(' '),
      studentId: p.student.id,
      department: p.student.degree || '',
      company: p.companyName,
      position: p.jobTitle,
      salary: p.salaryAmount || 0,
      salaryCurrency: p.salaryCurrency,
      salaryPeriod: p.salaryPeriod,
      location: '',
      startDate: p.startDate.toISOString(),
      endDate: p.endDate?.toISOString() || null,
      status: p.status.toLowerCase(),
      type: p.jobType.toLowerCase().replace('_', '-'),
    }))

    // Stats
    const allPlacements = await prisma.placement.findMany({ where: { universityName } })
    const confirmed = allPlacements.filter(p => p.status === 'CONFIRMED')
    const pending = allPlacements.filter(p => p.status === 'PENDING')
    const fullTimeSalaries = confirmed
      .filter(p => p.salaryAmount && p.jobType === 'FULL_TIME')
      .map(p => p.salaryAmount as number)
    const avgSalary = fullTimeSalaries.length > 0
      ? Math.round(fullTimeSalaries.reduce((a, b) => a + b, 0) / fullTimeSalaries.length)
      : 0

    const totalStudents = await prisma.user.count({
      where: { university: universityName, role: 'STUDENT' },
    })
    const placementRate = totalStudents > 0
      ? Math.round((confirmed.length / totalStudents) * 100)
      : 0

    return NextResponse.json({
      placements: formatted,
      stats: {
        confirmed: confirmed.length,
        pending: pending.length,
        avgSalary,
        placementRate,
      },
    })
  } catch (error) {
    console.error('Error fetching placements:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/dashboard/university/placements
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

    const { studentId, companyName, companyIndustry, jobTitle, jobType, salaryAmount, salaryCurrency, startDate, status } = body

    if (!studentId || !companyName || !jobTitle || !startDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify student belongs to this university
    const student = await prisma.user.findFirst({
      where: { id: studentId, university: universityName, role: 'STUDENT' },
    })
    if (!student) {
      return NextResponse.json({ error: 'Student not found in your university' }, { status: 404 })
    }

    const placement = await prisma.placement.create({
      data: {
        studentId,
        universityName,
        companyName,
        companyIndustry: companyIndustry || null,
        jobTitle,
        jobType: jobType || 'FULL_TIME',
        salaryAmount: salaryAmount ? parseInt(salaryAmount) : null,
        salaryCurrency: salaryCurrency || 'EUR',
        startDate: new Date(startDate),
        status: status || 'PENDING',
        source: 'platform',
      },
    })

    return NextResponse.json({ placement })
  } catch (error) {
    console.error('Error creating placement:', error)
    return NextResponse.json({ error: 'Failed to create placement' }, { status: 500 })
  }
}
