import prisma from '@/lib/prisma'

interface SkillGapItem {
  skill: string
  demandScore: number
  studentCount: number
  gapSeverity: number // positive = gap (demand > supply), negative = strength
}

interface SkillGapResult {
  gaps: SkillGapItem[]
  strengths: SkillGapItem[]
  studentSkills: Record<string, number>
  marketDemand: Record<string, number>
  studentCount: number
  jobCount: number
}

/**
 * Compute skills gap analysis for a university.
 * Compares student skills (from projects) vs market demand (from jobs + SkillMapping).
 */
export async function computeSkillsGap(universityName: string): Promise<SkillGapResult> {
  // 1. Gather student skills from projects
  const students = await prisma.user.findMany({
    where: {
      university: { equals: universityName, mode: 'insensitive' },
      role: 'STUDENT',
    },
    select: {
      id: true,
      projects: {
        select: { skills: true, technologies: true },
        where: { isPublic: true },
      },
    },
  })

  const studentSkillCounts: Record<string, number> = {}
  for (const student of students) {
    const studentSkillSet = new Set<string>()
    for (const project of student.projects) {
      const allSkills = [...(project.skills || []), ...(project.technologies || [])]
      for (const skill of allSkills) {
        studentSkillSet.add(skill.toLowerCase())
      }
    }
    studentSkillSet.forEach((skill) => {
      studentSkillCounts[skill] = (studentSkillCounts[skill] || 0) + 1
    })
  }

  // 2. Gather market demand from SkillMapping (demandScore) and active jobs
  const skillMappings = await prisma.skillMapping.findMany({
    where: { demandScore: { gt: 0 } },
    select: { academicTerm: true, industryTerms: true, demandScore: true },
  })

  const marketDemand: Record<string, number> = {}
  for (const mapping of skillMappings) {
    marketDemand[mapping.academicTerm.toLowerCase()] = mapping.demandScore
    for (const term of mapping.industryTerms) {
      marketDemand[term.toLowerCase()] = mapping.demandScore
    }
  }

  // Also count from active jobs
  const activeJobs = await prisma.job.findMany({
    where: { status: 'ACTIVE' },
    select: { requiredSkills: true },
  })

  const jobSkillCounts: Record<string, number> = {}
  for (const job of activeJobs) {
    for (const skill of (job.requiredSkills || [])) {
      const key = skill.toLowerCase()
      jobSkillCounts[key] = (jobSkillCounts[key] || 0) + 1
    }
  }

  // Normalize job counts to 0-100 scale
  const maxJobCount = Math.max(...Object.values(jobSkillCounts), 1)
  for (const [skill, count] of Object.entries(jobSkillCounts)) {
    const normalized = Math.round((count / maxJobCount) * 100)
    // Merge with SkillMapping demand, taking the higher value
    marketDemand[skill] = Math.max(marketDemand[skill] || 0, normalized)
  }

  // 3. Compute gaps: all skills in demand that students lack
  const allSkills = new Set([
    ...Object.keys(studentSkillCounts),
    ...Object.keys(marketDemand),
  ])

  const items: SkillGapItem[] = []
  allSkills.forEach((skill) => {
    const demand = marketDemand[skill] || 0
    const supply = studentSkillCounts[skill] || 0
    // Normalize supply to 0-100 based on total students
    const supplyNormalized = students.length > 0
      ? Math.round((supply / students.length) * 100)
      : 0
    const gapSeverity = demand - supplyNormalized

    if (demand > 0 || supply > 0) {
      items.push({
        skill,
        demandScore: demand,
        studentCount: supply,
        gapSeverity,
      })
    }
  })

  // Sort: biggest gaps first
  items.sort((a, b) => b.gapSeverity - a.gapSeverity)

  const gaps = items.filter((i) => i.gapSeverity > 10).slice(0, 20)
  const strengths = items.filter((i) => i.gapSeverity < -10).sort((a, b) => a.gapSeverity - b.gapSeverity).slice(0, 20)

  return {
    gaps,
    strengths,
    studentSkills: studentSkillCounts,
    marketDemand,
    studentCount: students.length,
    jobCount: activeJobs.length,
  }
}
