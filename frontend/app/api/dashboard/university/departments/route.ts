import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// GET /api/dashboard/university/departments
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = user.company || ''

    // Get departments from courses
    const courseDepartments = await prisma.course.findMany({
      where: { university: universityName, department: { not: null } },
      select: { department: true },
      distinct: ['department'],
    })

    // Get departments from student degrees
    const studentDegrees = await prisma.user.findMany({
      where: { university: universityName, role: 'STUDENT', degree: { not: null } },
      select: { degree: true },
      distinct: ['degree'],
    })

    // Combine and deduplicate
    const allDepartments = new Set<string>()
    for (const c of courseDepartments) {
      if (c.department) allDepartments.add(c.department)
    }
    for (const s of studentDegrees) {
      if (s.degree) allDepartments.add(s.degree)
    }

    // Get stats for each department
    const departments = []
    for (const deptName of Array.from(allDepartments)) {
      const studentCount = await prisma.user.count({
        where: { university: universityName, role: 'STUDENT', degree: deptName },
      })

      const placements = await prisma.placement.findMany({
        where: {
          universityName,
          status: 'CONFIRMED',
          student: { degree: deptName },
        },
        select: { salaryAmount: true, companyName: true },
      })

      const salaries = placements
        .map(p => p.salaryAmount)
        .filter((s): s is number => s !== null)
      const avgSalary = salaries.length > 0
        ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length)
        : 0

      const placementRate = studentCount > 0
        ? Math.round((placements.length / studentCount) * 100)
        : 0

      // Get top companies
      const companyCounts: Record<string, number> = {}
      for (const p of placements) {
        companyCounts[p.companyName] = (companyCounts[p.companyName] || 0) + 1
      }
      const topCompanies = Object.entries(companyCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([name]) => name)

      // Generate code from name
      const code = deptName
        .split(/\s+/)
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 3)

      departments.push({
        id: deptName,
        name: deptName,
        code,
        students: studentCount,
        placementRate,
        avgSalary,
        topCompanies,
        trend: 'stable' as const,
        trendValue: 0,
      })
    }

    // Sort by student count
    departments.sort((a, b) => b.students - a.students)

    return NextResponse.json({ departments })
  } catch (error) {
    console.error('Error fetching departments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
