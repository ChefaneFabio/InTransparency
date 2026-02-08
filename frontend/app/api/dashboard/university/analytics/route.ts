import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import {
  getPlacementStats,
  getSkillsGapData,
  getEmployerEngagement,
  getIndustryDistribution,
  getSalaryData,
  getBenchmarkData,
} from '@/lib/university-analytics'

// GET /api/dashboard/university/analytics
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
    const tab = searchParams.get('tab') || 'all'

    const result: any = {}

    if (tab === 'all' || tab === 'overview' || tab === 'placement') {
      result.placement = await getPlacementStats(universityName)
    }
    if (tab === 'all' || tab === 'overview') {
      result.industryDistribution = await getIndustryDistribution(universityName)
    }
    if (tab === 'all' || tab === 'skills') {
      result.skillsGap = await getSkillsGapData(universityName)
    }
    if (tab === 'all' || tab === 'employers') {
      result.employers = await getEmployerEngagement(universityName)
    }
    if (tab === 'all' || tab === 'salary') {
      result.salary = await getSalaryData(universityName)
    }
    if (tab === 'all' || tab === 'benchmark') {
      result.benchmark = await getBenchmarkData(universityName)
    }

    // Overview stats
    if (tab === 'all' || tab === 'overview') {
      const totalStudents = await prisma.user.count({
        where: { university: universityName, role: 'STUDENT' },
      })

      const uniqueEmployers = await prisma.placement.findMany({
        where: { universityName, status: 'CONFIRMED' },
        select: { companyName: true },
        distinct: ['companyName'],
      })

      result.overview = {
        totalStudents,
        employerPartners: uniqueEmployers.length,
        placementRate: result.placement?.placementRate || 0,
        avgSalary: result.placement?.avgSalary || 0,
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
