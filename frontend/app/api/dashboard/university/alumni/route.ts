import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// GET /api/dashboard/university/alumni
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
    const year = searchParams.get('year') || ''

    const where: any = { universityName }
    if (status) where.employmentStatus = status
    if (year) where.graduationYear = year
    if (search) {
      where.OR = [
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { currentCompany: { contains: search, mode: 'insensitive' } },
        { currentRole: { contains: search, mode: 'insensitive' } },
      ]
    }

    const alumni = await prisma.alumniRecord.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            photo: true,
          },
        },
      },
      orderBy: { graduationYear: 'desc' },
    })

    // Stats
    const allAlumni = await prisma.alumniRecord.findMany({
      where: { universityName },
    })
    const employed = allAlumni.filter(a => a.employmentStatus === 'EMPLOYED')
    const salaries = employed
      .map(a => a.salary)
      .filter((s): s is number => s !== null)
    const avgSalary = salaries.length > 0
      ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length)
      : 0

    // Industry breakdown
    const industryCounts: Record<string, number> = {}
    for (const a of employed) {
      const industry = a.currentIndustry || 'Other'
      industryCounts[industry] = (industryCounts[industry] || 0) + 1
    }

    const formatted = alumni.map(a => ({
      id: a.id,
      userId: a.userId,
      name: [a.user.firstName, a.user.lastName].filter(Boolean).join(' '),
      email: a.user.email,
      photo: a.user.photo,
      graduationYear: a.graduationYear,
      degree: a.degree,
      department: a.department,
      currentCompany: a.currentCompany,
      currentRole: a.currentRole,
      currentIndustry: a.currentIndustry,
      employmentStatus: a.employmentStatus,
      salary: a.salary,
      salaryCurrency: a.salaryCurrency,
      location: a.location,
      linkedInUrl: a.linkedInUrl,
    }))

    // Graduation years for filter
    const years = await prisma.alumniRecord.findMany({
      where: { universityName },
      select: { graduationYear: true },
      distinct: ['graduationYear'],
      orderBy: { graduationYear: 'desc' },
    })

    return NextResponse.json({
      alumni: formatted,
      stats: {
        total: allAlumni.length,
        employed: employed.length,
        seeking: allAlumni.filter(a => a.employmentStatus === 'SEEKING').length,
        furtherStudy: allAlumni.filter(a => a.employmentStatus === 'FURTHER_STUDY').length,
        avgSalary,
        employmentRate: allAlumni.length > 0
          ? Math.round((employed.length / allAlumni.length) * 100)
          : 0,
      },
      industryBreakdown: Object.entries(industryCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([name, count]) => ({ name, count })),
      filters: {
        years: years.map(y => y.graduationYear),
      },
    })
  } catch (error) {
    console.error('Error fetching alumni:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/dashboard/university/alumni
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

    const { userId, graduationYear, degree, department, currentCompany, currentRole, currentIndustry, employmentStatus, salary, salaryCurrency, location, linkedInUrl } = body

    if (!userId || !graduationYear) {
      return NextResponse.json({ error: 'User ID and graduation year are required' }, { status: 400 })
    }

    // Verify user belongs to university
    const student = await prisma.user.findFirst({
      where: { id: userId, university: universityName },
    })
    if (!student) {
      return NextResponse.json({ error: 'User not found in your university' }, { status: 404 })
    }

    const record = await prisma.alumniRecord.upsert({
      where: { userId },
      create: {
        userId,
        universityName,
        graduationYear,
        degree: degree || student.degree || null,
        department: department || null,
        currentCompany: currentCompany || null,
        currentRole: currentRole || null,
        currentIndustry: currentIndustry || null,
        employmentStatus: employmentStatus || 'SEEKING',
        salary: salary ? parseInt(salary) : null,
        salaryCurrency: salaryCurrency || null,
        location: location || null,
        linkedInUrl: linkedInUrl || null,
      },
      update: {
        graduationYear,
        degree: degree || null,
        department: department || null,
        currentCompany: currentCompany || null,
        currentRole: currentRole || null,
        currentIndustry: currentIndustry || null,
        employmentStatus: employmentStatus || 'SEEKING',
        salary: salary ? parseInt(salary) : null,
        salaryCurrency: salaryCurrency || null,
        location: location || null,
        linkedInUrl: linkedInUrl || null,
      },
    })

    return NextResponse.json({ alumni: record })
  } catch (error) {
    console.error('Error creating alumni record:', error)
    return NextResponse.json({ error: 'Failed to create alumni record' }, { status: 500 })
  }
}
