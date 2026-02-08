import prisma from '@/lib/prisma'

export async function getPlacementStats(universityName: string) {
  const placements = await prisma.placement.findMany({
    where: { universityName },
  })

  const confirmed = placements.filter(p => p.status === 'CONFIRMED')
  const totalStudents = await prisma.user.count({
    where: { university: universityName, role: 'STUDENT' },
  })

  const fullTimeSalaries = confirmed
    .filter(p => p.salaryAmount && p.salaryPeriod === 'yearly')
    .map(p => p.salaryAmount as number)

  const avgSalary = fullTimeSalaries.length > 0
    ? Math.round(fullTimeSalaries.reduce((a, b) => a + b, 0) / fullTimeSalaries.length)
    : 0

  const placementRate = totalStudents > 0
    ? Math.round((confirmed.length / totalStudents) * 100)
    : 0

  // Trends by year
  const trends: Record<string, { count: number; salary: number[] }> = {}
  for (const p of confirmed) {
    const year = p.startDate.getFullYear().toString()
    if (!trends[year]) trends[year] = { count: 0, salary: [] }
    trends[year].count++
    if (p.salaryAmount) trends[year].salary.push(p.salaryAmount)
  }

  const placementTrends = Object.entries(trends)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([year, data]) => ({
      year,
      rate: totalStudents > 0 ? Math.round((data.count / totalStudents) * 100) : 0,
      avgSalary: data.salary.length > 0
        ? Math.round(data.salary.reduce((a, b) => a + b, 0) / data.salary.length)
        : 0,
    }))

  return {
    totalPlacements: placements.length,
    confirmed: confirmed.length,
    pending: placements.filter(p => p.status === 'PENDING').length,
    declined: placements.filter(p => p.status === 'DECLINED').length,
    avgSalary,
    placementRate,
    placementTrends,
  }
}

export async function getSkillsGapData(universityName: string) {
  // Get skills from students' projects
  const studentProjects = await prisma.project.findMany({
    where: { user: { university: universityName, role: 'STUDENT' } },
    select: { skills: true, technologies: true },
  })

  const studentSkillCounts: Record<string, number> = {}
  const totalStudentProjects = studentProjects.length || 1
  for (const p of studentProjects) {
    const allSkills = [...p.skills, ...p.technologies]
    for (const skill of allSkills) {
      studentSkillCounts[skill] = (studentSkillCounts[skill] || 0) + 1
    }
  }

  // Get required skills from jobs
  const jobs = await prisma.job.findMany({
    where: { status: 'ACTIVE', isPublic: true },
    select: { requiredSkills: true },
  })

  const demandCounts: Record<string, number> = {}
  const totalJobs = jobs.length || 1
  for (const j of jobs) {
    for (const skill of j.requiredSkills) {
      demandCounts[skill] = (demandCounts[skill] || 0) + 1
    }
  }

  // Combine into gap analysis for top skills
  const allSkills = new Set([
    ...Object.keys(studentSkillCounts),
    ...Object.keys(demandCounts),
  ])

  const skillsGap = Array.from(allSkills)
    .map(skill => {
      const demand = Math.round((demandCounts[skill] || 0) / totalJobs * 100)
      const students = Math.round((studentSkillCounts[skill] || 0) / totalStudentProjects * 100)
      return {
        skill,
        demand: Math.min(demand, 100),
        students: Math.min(students, 100),
        gap: Math.max(0, demand - students),
      }
    })
    .filter(s => s.demand > 0 || s.students > 0)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 12)

  return skillsGap
}

export async function getEmployerEngagement(universityName: string) {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  // Get profile views of university's students
  const students = await prisma.user.findMany({
    where: { university: universityName, role: 'STUDENT' },
    select: { id: true },
  })
  const studentIds = students.map(s => s.id)

  const profileViews = await prisma.profileView.findMany({
    where: {
      profileUserId: { in: studentIds },
      viewerRole: 'RECRUITER',
      createdAt: { gte: sixMonthsAgo },
    },
    select: { viewerCompany: true, createdAt: true },
  })

  // Aggregate by month
  const monthlyData: Record<string, { visits: Set<string>; views: number }> = {}
  for (const view of profileViews) {
    const monthKey = view.createdAt.toLocaleString('en', { month: 'short' })
    if (!monthlyData[monthKey]) monthlyData[monthKey] = { visits: new Set(), views: 0 }
    monthlyData[monthKey].views++
    if (view.viewerCompany) monthlyData[monthKey].visits.add(view.viewerCompany)
  }

  // Get contacts made
  const contacts = await prisma.contactUsage.findMany({
    where: {
      recipientId: { in: studentIds },
      createdAt: { gte: sixMonthsAgo },
    },
    select: { recruiterId: true, createdAt: true },
  })

  // Top companies by engagement
  const companyEngagement: Record<string, { views: number; contacts: number }> = {}
  for (const view of profileViews) {
    const company = view.viewerCompany || 'Unknown'
    if (!companyEngagement[company]) companyEngagement[company] = { views: 0, contacts: 0 }
    companyEngagement[company].views++
  }

  const topCompanies = Object.entries(companyEngagement)
    .sort(([, a], [, b]) => b.views - a.views)
    .slice(0, 10)
    .map(([company, data]) => ({ company, ...data }))

  return {
    totalViews: profileViews.length,
    totalContacts: contacts.length,
    uniqueCompanies: new Set(profileViews.map(v => v.viewerCompany).filter(Boolean)).size,
    topCompanies,
  }
}

export async function getIndustryDistribution(universityName: string) {
  const placements = await prisma.placement.findMany({
    where: { universityName, status: 'CONFIRMED' },
    select: { companyIndustry: true },
  })

  const industryCounts: Record<string, number> = {}
  for (const p of placements) {
    const industry = p.companyIndustry || 'Other'
    industryCounts[industry] = (industryCounts[industry] || 0) + 1
  }

  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300']

  return Object.entries(industryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, value], i) => ({
      name,
      value,
      color: colors[i % colors.length],
    }))
}

export async function getSalaryData(universityName: string) {
  const placements = await prisma.placement.findMany({
    where: {
      universityName,
      status: 'CONFIRMED',
      salaryAmount: { not: null },
    },
    include: { student: { select: { degree: true } } },
  })

  const byDegree: Record<string, number[]> = {}
  for (const p of placements) {
    const degree = p.student.degree || 'Other'
    if (!byDegree[degree]) byDegree[degree] = []
    byDegree[degree].push(p.salaryAmount as number)
  }

  return Object.entries(byDegree)
    .map(([major, salaries]) => ({
      major,
      avg: Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length),
      min: Math.min(...salaries),
      max: Math.max(...salaries),
      count: salaries.length,
    }))
    .sort((a, b) => b.avg - a.avg)
}

export async function getBenchmarkData(universityName: string) {
  // Get all universities with placement data
  const universities = await prisma.placement.groupBy({
    by: ['universityName'],
    where: { status: 'CONFIRMED' },
    _count: true,
    _avg: { salaryAmount: true },
  })

  const benchmarks = []
  for (const uni of universities) {
    const totalStudents = await prisma.user.count({
      where: { university: uni.universityName, role: 'STUDENT' },
    })
    const placementRate = totalStudents > 0
      ? Math.round((uni._count / totalStudents) * 100)
      : 0

    benchmarks.push({
      university: uni.universityName,
      placementRate,
      avgSalary: Math.round(uni._avg.salaryAmount || 0),
      placements: uni._count,
      isOwn: uni.universityName === universityName,
    })
  }

  return benchmarks
    .sort((a, b) => b.placementRate - a.placementRate)
    .map((b, i) => ({ ...b, rank: i + 1 }))
}
