import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/student/salary-benchmarks
 * Returns salary estimates for the student's skills across EU countries.
 * Uses active job postings with salary data + curated market data.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get student's skills
    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      select: { skills: true, tools: true, technologies: true },
    })

    const studentSkills = new Set<string>()
    for (const p of projects) {
      for (const s of [...p.skills, ...p.tools, ...p.technologies]) {
        studentSkills.add(s.toLowerCase())
      }
    }

    if (studentSkills.size === 0) {
      return NextResponse.json({ benchmarks: [], message: 'Add projects to see salary benchmarks' })
    }

    // Get salary data from active jobs matching student's skills
    const jobs = await prisma.job.findMany({
      where: {
        status: 'ACTIVE',
        isPublic: true,
        showSalary: true,
        salaryMin: { not: null },
      },
      select: {
        requiredSkills: true, location: true,
        salaryMin: true, salaryMax: true, salaryPeriod: true, salaryCurrency: true,
      },
      take: 200,
    })

    // Group by country/region and calculate averages
    const countryData = new Map<string, { salaries: number[]; matchingJobs: number }>()

    for (const job of jobs) {
      const jobSkills = job.requiredSkills.map(s => s.toLowerCase())
      const overlap = jobSkills.filter(s => studentSkills.has(s))
      if (overlap.length === 0) continue

      // Extract country from location
      const location = (job.location || '').toLowerCase()
      let country = 'Italy'
      if (location.includes('germany') || location.includes('berlin') || location.includes('munich') || location.includes('münchen')) country = 'Germany'
      else if (location.includes('uk') || location.includes('london') || location.includes('england')) country = 'United Kingdom'
      else if (location.includes('france') || location.includes('paris')) country = 'France'
      else if (location.includes('spain') || location.includes('madrid') || location.includes('barcelona')) country = 'Spain'
      else if (location.includes('netherlands') || location.includes('amsterdam')) country = 'Netherlands'
      else if (location.includes('switzerland') || location.includes('zurich') || location.includes('zürich')) country = 'Switzerland'
      else if (location.includes('remote')) country = 'Remote (EU)'
      else if (location.includes('milan') || location.includes('roma') || location.includes('italy') || location.includes('italia')) country = 'Italy'

      let salary = (job.salaryMin || 0) + ((job.salaryMax || job.salaryMin || 0) - (job.salaryMin || 0)) / 2
      if (job.salaryPeriod === 'monthly') salary *= 12
      if (job.salaryPeriod === 'hourly') salary *= 2080

      const existing = countryData.get(country) || { salaries: [], matchingJobs: 0 }
      existing.salaries.push(salary)
      existing.matchingJobs++
      countryData.set(country, existing)
    }

    // Add curated fallback data for countries without job data
    const curatedData: Record<string, { juniorAvg: number; seniorAvg: number }> = {
      'Italy': { juniorAvg: 26000, seniorAvg: 42000 },
      'Germany': { juniorAvg: 45000, seniorAvg: 72000 },
      'United Kingdom': { juniorAvg: 35000, seniorAvg: 65000 },
      'France': { juniorAvg: 35000, seniorAvg: 55000 },
      'Spain': { juniorAvg: 24000, seniorAvg: 40000 },
      'Netherlands': { juniorAvg: 40000, seniorAvg: 65000 },
      'Switzerland': { juniorAvg: 70000, seniorAvg: 110000 },
      'Remote (EU)': { juniorAvg: 35000, seniorAvg: 60000 },
    }

    const benchmarks = Object.entries(curatedData).map(([country, curated]) => {
      const data = countryData.get(country)
      const avgFromJobs = data && data.salaries.length > 0
        ? Math.round(data.salaries.reduce((a, b) => a + b, 0) / data.salaries.length)
        : null

      return {
        country,
        estimatedSalary: avgFromJobs || curated.juniorAvg,
        range: { min: curated.juniorAvg, max: curated.seniorAvg },
        matchingJobs: data?.matchingJobs || 0,
        currency: country === 'United Kingdom' ? 'GBP' : country === 'Switzerland' ? 'CHF' : 'EUR',
        source: avgFromJobs ? 'platform' : 'market_data',
      }
    })

    return NextResponse.json({
      benchmarks: benchmarks.sort((a, b) => b.estimatedSalary - a.estimatedSalary),
      skillCount: studentSkills.size,
    })
  } catch (error) {
    console.error('Salary benchmarks error:', error)
    return NextResponse.json({ benchmarks: [] })
  }
}
