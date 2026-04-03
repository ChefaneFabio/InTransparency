import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * POST /api/dashboard/university/generate-report
 * Generates a placement report in CSV or JSON format.
 * Body: { reportType: 'annual'|'department'|'employer'|'contracts', period: string, format: 'csv'|'pdf' }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userRecord = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!userRecord || (userRecord.role !== 'UNIVERSITY' && userRecord.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = userRecord.company || ''
    const { reportType, period, format } = await req.json()

    if (!reportType || !period) {
      return NextResponse.json({ error: 'reportType and period are required' }, { status: 400 })
    }

    // Parse period (e.g., "2024-2025")
    const years = period.split('-').map(Number)
    const startDate = new Date(years[0], 0, 1)
    const endDate = years[1] ? new Date(years[1], 11, 31) : new Date(years[0], 11, 31)

    // Gather data based on report type
    let reportData: any = {}

    if (reportType === 'annual' || reportType === 'department') {
      const [students, placements, projects] = await Promise.all([
        prisma.user.findMany({
          where: { university: universityName, role: 'STUDENT' },
          select: { id: true, firstName: true, lastName: true, degree: true, graduationYear: true },
        }),
        prisma.placement.findMany({
          where: { universityName, startDate: { gte: startDate, lte: endDate } },
          include: { student: { select: { firstName: true, lastName: true, degree: true } } },
        }),
        prisma.project.count({
          where: { user: { university: universityName }, verificationStatus: 'VERIFIED' },
        }),
      ])

      const confirmed = placements.filter(p => p.status === 'CONFIRMED')
      const salaries = confirmed.filter(p => p.salaryAmount).map(p => p.salaryAmount as number)
      const avgSalary = salaries.length > 0 ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length) : 0

      reportData = {
        period,
        universityName,
        totalStudents: students.length,
        totalPlacements: placements.length,
        confirmedPlacements: confirmed.length,
        placementRate: students.length > 0 ? Math.round((confirmed.length / students.length) * 100) : 0,
        averageSalary: avgSalary,
        verifiedProjects: projects,
        placements: placements.map(p => ({
          studentName: [p.student.firstName, p.student.lastName].filter(Boolean).join(' '),
          department: p.student.degree || '',
          company: p.companyName,
          industry: p.companyIndustry || '',
          jobTitle: p.jobTitle,
          jobType: p.jobType,
          salary: p.salaryAmount || '',
          startDate: p.startDate.toISOString().split('T')[0],
          status: p.status,
        })),
      }

      if (reportType === 'department') {
        // Group by department
        const deptMap = new Map<string, any[]>()
        for (let i = 0; i < reportData.placements.length; i++) {
          const dept = reportData.placements[i].department || 'Other'
          const existing = deptMap.get(dept)
          if (existing) existing.push(reportData.placements[i])
          else deptMap.set(dept, [reportData.placements[i]])
        }
        reportData.departments = Array.from(deptMap.entries()).map(([name, entries]) => ({
          name,
          placements: entries.length,
          avgSalary: entries.filter((e: any) => e.salary).length > 0
            ? Math.round(entries.filter((e: any) => e.salary).reduce((a: number, e: any) => a + e.salary, 0) / entries.filter((e: any) => e.salary).length)
            : 0,
        }))
      }
    } else if (reportType === 'employer') {
      const placements = await prisma.placement.findMany({
        where: { universityName, startDate: { gte: startDate, lte: endDate } },
        select: { companyName: true, companyIndustry: true, jobTitle: true, salaryAmount: true, status: true },
      })

      const companyMap = new Map<string, { hires: number; totalSalary: number; salaryCount: number; industry: string }>()
      for (let i = 0; i < placements.length; i++) {
        const p = placements[i]
        const existing = companyMap.get(p.companyName)
        if (existing) {
          existing.hires++
          if (p.salaryAmount) { existing.totalSalary += p.salaryAmount; existing.salaryCount++ }
        } else {
          companyMap.set(p.companyName, {
            hires: 1,
            totalSalary: p.salaryAmount || 0,
            salaryCount: p.salaryAmount ? 1 : 0,
            industry: p.companyIndustry || '',
          })
        }
      }

      reportData = {
        period,
        universityName,
        employers: Array.from(companyMap.entries())
          .map(([name, data]) => ({
            company: name,
            industry: data.industry,
            hires: data.hires,
            avgSalary: data.salaryCount > 0 ? Math.round(data.totalSalary / data.salaryCount) : 0,
          }))
          .sort((a, b) => b.hires - a.hires),
      }
    }

    // Generate CSV if requested
    if (format === 'csv') {
      const rows = reportData.placements || reportData.employers || []
      if (rows.length === 0) {
        return NextResponse.json({ error: 'No data for this period' }, { status: 404 })
      }

      const headers = Object.keys(rows[0])
      const csvLines = [headers.join(',')]
      for (let i = 0; i < rows.length; i++) {
        const values = headers.map(h => {
          const val = String(rows[i][h] ?? '')
          return val.includes(',') ? `"${val}"` : val
        })
        csvLines.push(values.join(','))
      }
      const csv = csvLines.join('\n')

      return new Response(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="report-${reportType}-${period}.csv"`,
        },
      })
    }

    // Default: return JSON data (frontend can render preview)
    return NextResponse.json({ report: reportData })
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
