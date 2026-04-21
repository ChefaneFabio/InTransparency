import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import {
  fetchEurostatBenchmarks,
  normalizeToYearlySalary,
} from '@/lib/market-data'
import type { MarketSalaryBenchmark } from '@/lib/market-data'

// GET /api/dashboard/university/students/performance
// Returns GPA distribution, employability scores, placement stats,
// salary data (placements + jobs + alumni + platform-wide + Eurostat), industry distribution
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = user.company || ''

    // ── 1. Students & GPA ──────────────────────────────────────────────
    const students = await prisma.user.findMany({
      where: { university: universityName, role: 'STUDENT' },
      select: { id: true, gpa: true },
    })

    // GPA distribution. Supports both scales:
    //   - US 4.0 (used by some international/exchange students)
    //   - IT 30-point (18-30) — the Italian university & ITS standard
    // If any GPA > 5 we assume the cohort is on the 30-point scale.
    const totalWithGpa = students.filter(s => s.gpa !== null).length
    const gpaValues = students
      .map(s => (s.gpa !== null ? parseFloat(s.gpa as any) : NaN))
      .filter(v => !Number.isNaN(v))
    const useThirtyScale = gpaValues.some(v => v > 5)

    const gpaRanges = useThirtyScale
      ? [
          { min: 28, max: 30, key: 'top', label: '28–30 / 30' },
          { min: 26, max: 27.99, key: 'high', label: '26–27 / 30' },
          { min: 24, max: 25.99, key: 'mid', label: '24–25 / 30' },
          { min: 21, max: 23.99, key: 'low', label: '21–23 / 30' },
          { min: 18, max: 20.99, key: 'pass', label: '18–20 / 30' },
        ]
      : [
          { min: 3.8, max: 4.0, key: 'top', label: '3.8–4.0' },
          { min: 3.5, max: 3.79, key: 'high', label: '3.5–3.79' },
          { min: 3.0, max: 3.49, key: 'mid', label: '3.0–3.49' },
          { min: 2.5, max: 2.99, key: 'low', label: '2.5–2.99' },
          { min: 0, max: 2.49, key: 'pass', label: 'Below 2.5' },
        ]

    const gpaDistribution = gpaRanges.map(range => {
      const count = gpaValues.filter(gpa => gpa >= range.min && gpa <= range.max).length
      return {
        key: range.key,
        label: range.label,
        count,
        percentage: totalWithGpa > 0 ? Math.round((count / totalWithGpa) * 100) : 0,
      }
    })

    // ── 2. Employability Scores ────────────────────────────────────────
    const studentIds = students.map(s => s.id)
    const predictions = await prisma.placementPrediction.findMany({
      where: { studentId: { in: studentIds } },
      select: { studentId: true, probability: true },
      orderBy: { generatedAt: 'desc' },
      distinct: ['studentId'],
    })

    const scoreRanges = [
      { min: 90, max: 100, key: '90-100', color: 'bg-green-500' },
      { min: 80, max: 89, key: '80-89', color: 'bg-blue-500' },
      { min: 70, max: 79, key: '70-79', color: 'bg-yellow-500' },
      { min: 60, max: 69, key: '60-69', color: 'bg-orange-500' },
      { min: 0, max: 59, key: 'below60', color: 'bg-red-500' },
    ]

    const totalWithPredictions = predictions.length
    const employabilityDistribution = scoreRanges.map(range => {
      const count = predictions.filter(p => {
        const score = Math.round(p.probability * 100)
        if (range.key === 'below60') return score < 60
        return score >= range.min && score <= range.max
      }).length
      return {
        key: range.key,
        count,
        percentage: totalWithPredictions > 0 ? Math.round((count / totalWithPredictions) * 100) : 0,
        color: range.color,
      }
    })

    // ── 3. Placement Status ────────────────────────────────────────────
    const placements = await prisma.placement.findMany({
      where: { universityName },
      select: {
        status: true,
        studentId: true,
        salaryAmount: true,
        salaryCurrency: true,
        salaryPeriod: true,
        jobType: true,
        companyIndustry: true,
        jobTitle: true,
      },
    })

    const placementStatus = [
      { key: 'confirmed', count: placements.filter(p => p.status === 'CONFIRMED').length, color: 'bg-green-500' },
      { key: 'pending', count: placements.filter(p => p.status === 'PENDING').length, color: 'bg-blue-500' },
      { key: 'declined', count: placements.filter(p => p.status === 'DECLINED').length, color: 'bg-yellow-500' },
    ]

    const studentsWithPlacement = new Set(placements.map(p => p.studentId))
    const notStartedCount = students.length - studentsWithPlacement.size
    placementStatus.push({ key: 'notStarted', count: Math.max(0, notStartedCount), color: 'bg-gray-500' })

    // ── 4. Salary Data — merge Placements + Jobs + Alumni ──────────────
    // Source A: Placement salaries (this university)
    const placementSalaries: number[] = []
    for (const p of placements) {
      if (p.status === 'CONFIRMED' && p.salaryAmount) {
        placementSalaries.push(
          normalizeToYearlySalary(p.salaryAmount, p.salaryPeriod || 'yearly', p.salaryCurrency || 'EUR')
        )
      }
    }

    // Source B: Alumni salaries (this university)
    const alumni = await prisma.alumniRecord.findMany({
      where: { universityName, salary: { not: null }, employmentStatus: 'EMPLOYED' },
      select: { salary: true, salaryCurrency: true, currentIndustry: true, currentRole: true },
    })
    const alumniSalaries: number[] = []
    for (const a of alumni) {
      if (a.salary) {
        alumniSalaries.push(
          normalizeToYearlySalary(a.salary, 'yearly', a.salaryCurrency || 'EUR')
        )
      }
    }

    // Source C: Job posting salary ranges (all active jobs — market signal)
    const jobs = await prisma.job.findMany({
      where: { status: 'ACTIVE', isPublic: true },
      select: {
        salaryMin: true,
        salaryMax: true,
        salaryCurrency: true,
        salaryPeriod: true,
        companyIndustry: true,
        title: true,
      },
    })
    const jobSalaries: number[] = []
    for (const j of jobs) {
      if (j.salaryMin || j.salaryMax) {
        const mid = j.salaryMin && j.salaryMax
          ? Math.round((j.salaryMin + j.salaryMax) / 2)
          : (j.salaryMin || j.salaryMax || 0)
        if (mid > 0) {
          jobSalaries.push(
            normalizeToYearlySalary(mid, j.salaryPeriod || 'yearly', j.salaryCurrency || 'EUR')
          )
        }
      }
    }

    // Combined salary data for this university (placements + alumni)
    const ownSalaries = [...placementSalaries, ...alumniSalaries]

    // Salary distribution using own data
    const salaryBuckets = [
      { min: 50000, max: Infinity, key: '50k+' },
      { min: 35000, max: 49999, key: '35k-50k' },
      { min: 25000, max: 34999, key: '25k-35k' },
      { min: 0, max: 24999, key: 'below25k' },
    ]

    const salaryDistribution = salaryBuckets.map(range => {
      const count = ownSalaries.filter(s => s >= range.min && s <= range.max).length
      return { key: range.key, count }
    })

    // ── 5. Platform-wide benchmarks (all universities) ─────────────────
    const allPlacements = await prisma.placement.findMany({
      where: { status: 'CONFIRMED', salaryAmount: { not: null } },
      select: {
        salaryAmount: true,
        salaryCurrency: true,
        salaryPeriod: true,
        companyIndustry: true,
        jobTitle: true,
      },
    })

    const allAlumni = await prisma.alumniRecord.findMany({
      where: { salary: { not: null }, employmentStatus: 'EMPLOYED' },
      select: { salary: true, salaryCurrency: true, currentIndustry: true, currentRole: true },
    })

    const platformSalaries: number[] = []
    const platformByIndustry: Record<string, number[]> = {}
    const platformByRole: Record<string, number[]> = {}

    for (const p of allPlacements) {
      const yearly = normalizeToYearlySalary(
        p.salaryAmount as number,
        p.salaryPeriod || 'yearly',
        p.salaryCurrency || 'EUR'
      )
      platformSalaries.push(yearly)
      const ind = p.companyIndustry || 'Other'
      if (!platformByIndustry[ind]) platformByIndustry[ind] = []
      platformByIndustry[ind].push(yearly)
      const role = p.jobTitle || 'Other'
      if (!platformByRole[role]) platformByRole[role] = []
      platformByRole[role].push(yearly)
    }

    for (const a of allAlumni) {
      if (a.salary) {
        const yearly = normalizeToYearlySalary(a.salary, 'yearly', a.salaryCurrency || 'EUR')
        platformSalaries.push(yearly)
        const ind = a.currentIndustry || 'Other'
        if (!platformByIndustry[ind]) platformByIndustry[ind] = []
        platformByIndustry[ind].push(yearly)
        const role = a.currentRole || 'Other'
        if (!platformByRole[role]) platformByRole[role] = []
        platformByRole[role].push(yearly)
      }
    }

    // Also include job postings in platform data
    for (const j of jobs) {
      if (j.salaryMin || j.salaryMax) {
        const mid = j.salaryMin && j.salaryMax
          ? Math.round((j.salaryMin + j.salaryMax) / 2)
          : (j.salaryMin || j.salaryMax || 0)
        if (mid > 0) {
          const yearly = normalizeToYearlySalary(mid, j.salaryPeriod || 'yearly', j.salaryCurrency || 'EUR')
          platformSalaries.push(yearly)
          const ind = j.companyIndustry || 'Other'
          if (!platformByIndustry[ind]) platformByIndustry[ind] = []
          platformByIndustry[ind].push(yearly)
        }
      }
    }

    const sorted = Array.from(platformSalaries).sort((a, b) => a - b)
    const avg = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0
    const median = (arr: number[]) => {
      if (arr.length === 0) return 0
      const s = Array.from(arr).sort((a, b) => a - b)
      const mid = Math.floor(s.length / 2)
      return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2)
    }
    const percentile = (arr: number[], p: number) => {
      if (arr.length === 0) return 0
      const s = Array.from(arr).sort((a, b) => a - b)
      const idx = Math.ceil((p / 100) * s.length) - 1
      return s[Math.max(0, idx)]
    }

    const platformBenchmark = {
      avgSalary: avg(sorted),
      medianSalary: median(sorted),
      p25Salary: percentile(sorted, 25),
      p75Salary: percentile(sorted, 75),
      totalDataPoints: sorted.length,
      byIndustry: Object.entries(platformByIndustry)
        .map(([industry, salaries]) => ({ industry, avgSalary: avg(salaries), count: salaries.length }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      byRole: Object.entries(platformByRole)
        .map(([role, salaries]) => ({ role, avgSalary: avg(salaries), count: salaries.length }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
    }

    // ── 6. Your university vs platform comparison ──────────────────────
    const ownAvg = avg(ownSalaries)
    const ownMedian = median(ownSalaries)

    const universityComparison = {
      yourAvgSalary: ownAvg,
      yourMedianSalary: ownMedian,
      yourDataPoints: ownSalaries.length,
      platformAvgSalary: platformBenchmark.avgSalary,
      platformMedianSalary: platformBenchmark.medianSalary,
      platformDataPoints: platformBenchmark.totalDataPoints,
      differencePercent: platformBenchmark.avgSalary > 0
        ? Math.round(((ownAvg - platformBenchmark.avgSalary) / platformBenchmark.avgSalary) * 100)
        : 0,
      sources: {
        placements: placementSalaries.length,
        alumni: alumniSalaries.length,
        jobPostings: jobSalaries.length,
      },
    }

    // ── 7. Industry Distribution (enriched) ────────────────────────────
    const industryCounts: Record<string, number> = {}
    for (const p of placements.filter(p => p.status === 'CONFIRMED')) {
      const industry = p.companyIndustry || 'Other'
      industryCounts[industry] = (industryCounts[industry] || 0) + 1
    }
    for (const a of alumni) {
      const industry = a.currentIndustry || 'Other'
      industryCounts[industry] = (industryCounts[industry] || 0) + 1
    }

    const industryDistribution = Object.entries(industryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([industry, count]) => ({ industry, count }))

    // ── 8. Eurostat benchmarks ─────────────────────────────────────────
    let eurostatBenchmarks: MarketSalaryBenchmark[] = []
    try {
      eurostatBenchmarks = await fetchEurostatBenchmarks()
    } catch (err) {
      console.warn('Failed to fetch Eurostat benchmarks:', err)
    }

    return NextResponse.json({
      gpaDistribution,
      employabilityDistribution,
      placementStatus,
      salaryDistribution,
      industryDistribution,
      totalStudents: students.length,
      totalWithGpa,
      totalWithPredictions,
      // New: enriched salary & market context
      platformBenchmark,
      universityComparison,
      eurostatBenchmarks,
      dataSources: {
        placements: placementSalaries.length,
        alumni: alumniSalaries.length,
        jobPostings: jobSalaries.length,
        platformTotal: platformBenchmark.totalDataPoints,
        eurostat: eurostatBenchmarks.length,
      },
    })
  } catch (error) {
    console.error('Error fetching performance data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
