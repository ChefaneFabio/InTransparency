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
    const view = searchParams.get('view') || 'dashboard' // 'dashboard' or 'list'

    // Find all students from this university
    const allStudents = await prisma.user.findMany({
      where: { university: universityName, role: 'STUDENT' },
      select: { id: true, firstName: true, lastName: true, degree: true },
    })
    const studentIds = allStudents.map((s) => s.id)

    // --- Dashboard analytics ---
    if (view === 'dashboard') {
      if (studentIds.length === 0) {
        return NextResponse.json({
          stats: {
            totalStudents: 0,
            studentsContacted: 0,
            confirmedHired: 0,
            placementRate: 0,
          },
          monthlyTrend: [],
          topCompanies: [],
          recentPlacements: [],
          avgTimeToHireDays: 0,
          departmentBreakdown: [],
        })
      }

      // Students contacted by recruiters
      const contactedStudents = await prisma.contactUsage.findMany({
        where: { recipientId: { in: studentIds } },
        select: { recipientId: true, firstContactAt: true },
        distinct: ['recipientId'],
      })
      const studentsContactedCount = contactedStudents.length

      // Confirmed hired from HiringConfirmation
      const hiringConfirmations = await prisma.hiringConfirmation.findMany({
        where: {
          studentId: { in: studentIds },
          status: 'CONFIRMED_HIRED',
        },
        select: {
          studentId: true,
          companyName: true,
          jobTitle: true,
          startDate: true,
          contactDate: true,
          respondedAt: true,
          student: { select: { firstName: true, lastName: true, degree: true } },
        },
      })
      const confirmedHiredCount = hiringConfirmations.length
      const placementRate = studentsContactedCount > 0
        ? Math.round((confirmedHiredCount / studentsContactedCount) * 100)
        : 0

      // Average time to hire (contactDate -> startDate)
      const hireDurations: number[] = []
      for (let i = 0; i < hiringConfirmations.length; i++) {
        const hc = hiringConfirmations[i]
        if (hc.startDate && hc.contactDate) {
          const days = Math.round(
            (hc.startDate.getTime() - hc.contactDate.getTime()) / (1000 * 60 * 60 * 24)
          )
          if (days > 0) hireDurations.push(days)
        }
      }
      const avgTimeToHireDays = hireDurations.length > 0
        ? Math.round(hireDurations.reduce((a, b) => a + b, 0) / hireDurations.length)
        : 0

      // Top hiring companies from HiringConfirmation
      const companyMap = new Map<string, number>()
      for (let i = 0; i < hiringConfirmations.length; i++) {
        const company = hiringConfirmations[i].companyName
        companyMap.set(company, (companyMap.get(company) || 0) + 1)
      }
      const topCompanies = Array.from(companyMap.entries())
        .map(([company, hires]) => ({ company, hires }))
        .sort((a, b) => b.hires - a.hires)
        .slice(0, 10)

      // Monthly trend: contacts and hires over the last 12 months
      const now = new Date()
      const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1)

      const allContacts = await prisma.contactUsage.findMany({
        where: {
          recipientId: { in: studentIds },
          firstContactAt: { gte: twelveMonthsAgo },
        },
        select: { firstContactAt: true },
      })

      const allHires = await prisma.hiringConfirmation.findMany({
        where: {
          studentId: { in: studentIds },
          status: 'CONFIRMED_HIRED',
          contactDate: { gte: twelveMonthsAgo },
        },
        select: { contactDate: true, respondedAt: true },
      })

      const monthlyTrend: Array<{ month: string; contacts: number; hires: number }> = []
      for (let m = 0; m < 12; m++) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - 11 + m, 1)
        const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59)
        const monthLabel = monthDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })

        let contacts = 0
        for (let c = 0; c < allContacts.length; c++) {
          const d = allContacts[c].firstContactAt
          if (d >= monthDate && d <= monthEnd) contacts++
        }

        let hires = 0
        for (let h = 0; h < allHires.length; h++) {
          const d = allHires[h].respondedAt || allHires[h].contactDate
          if (d >= monthDate && d <= monthEnd) hires++
        }

        monthlyTrend.push({ month: monthLabel, contacts, hires })
      }

      // Department breakdown
      const deptMap = new Map<string, { contacted: number; hired: number }>()
      const studentDeptMap = new Map<string, string>()
      for (let i = 0; i < allStudents.length; i++) {
        const s = allStudents[i]
        studentDeptMap.set(s.id, s.degree || 'Other')
      }

      const contactedSet = new Set<string>()
      const allContactsFull = await prisma.contactUsage.findMany({
        where: { recipientId: { in: studentIds } },
        select: { recipientId: true },
      })
      for (let i = 0; i < allContactsFull.length; i++) {
        contactedSet.add(allContactsFull[i].recipientId)
      }

      const hiredSet = new Set<string>()
      for (let i = 0; i < hiringConfirmations.length; i++) {
        hiredSet.add(hiringConfirmations[i].studentId)
      }

      const contactedArr = Array.from(contactedSet)
      for (let i = 0; i < contactedArr.length; i++) {
        const sid = contactedArr[i]
        const dept = studentDeptMap.get(sid) || 'Other'
        const existing = deptMap.get(dept) || { contacted: 0, hired: 0 }
        existing.contacted++
        deptMap.set(dept, existing)
      }

      const hiredArr = Array.from(hiredSet)
      for (let i = 0; i < hiredArr.length; i++) {
        const sid = hiredArr[i]
        const dept = studentDeptMap.get(sid) || 'Other'
        const existing = deptMap.get(dept) || { contacted: 0, hired: 0 }
        existing.hired++
        deptMap.set(dept, existing)
      }

      const departmentBreakdown = Array.from(deptMap.entries())
        .map(([department, data]) => ({
          department,
          contacted: data.contacted,
          hired: data.hired,
          rate: data.contacted > 0 ? Math.round((data.hired / data.contacted) * 100) : 0,
        }))
        .sort((a, b) => b.hired - a.hired)
        .slice(0, 8)

      // Recent placements (from HiringConfirmation CONFIRMED_HIRED, most recent)
      const recentHires = await prisma.hiringConfirmation.findMany({
        where: {
          studentId: { in: studentIds },
          status: 'CONFIRMED_HIRED',
        },
        orderBy: { respondedAt: 'desc' },
        take: 10,
        select: {
          id: true,
          studentId: true,
          companyName: true,
          jobTitle: true,
          startDate: true,
          respondedAt: true,
          student: { select: { firstName: true, lastName: true, degree: true } },
        },
      })

      const recentPlacements = recentHires.map((h) => ({
        id: h.id,
        studentName: [h.student.firstName, h.student.lastName].filter(Boolean).join(' ') || 'Anonymous',
        department: h.student.degree || '',
        company: h.companyName,
        jobTitle: h.jobTitle || '',
        startDate: h.startDate?.toISOString() || null,
        confirmedDate: h.respondedAt?.toISOString() || null,
      }))

      return NextResponse.json({
        stats: {
          totalStudents: allStudents.length,
          studentsContacted: studentsContactedCount,
          confirmedHired: confirmedHiredCount,
          placementRate,
        },
        monthlyTrend,
        topCompanies,
        recentPlacements,
        avgTimeToHireDays,
        departmentBreakdown,
      })
    }

    // --- List view (existing functionality) ---
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
