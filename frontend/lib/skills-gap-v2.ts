/**
 * Skills Gap v2 — program-level drill-down + temporal trends
 *
 * Extends v1 (whole-university) to slice by degree program, write monthly
 * snapshots, and generate Evidence-based curriculum recommendations.
 *
 * This is the "Cattolica-ready" product: answers "which skills gaps exist
 * per degree program, and what trend are they on?"
 */

import prisma from './prisma'
import { resolveEscoUri } from './esco'

export interface ProgramGapRow {
  skill: string
  escoUri: string | null
  demandScore: number
  studentCount: number
  coverage: number // 0-100 — % of students in program who have this skill
  gapSeverity: number // demand - coverage
}

export interface ProgramGapReport {
  universityName: string
  programName: string | null // Null = university-wide
  studentCount: number
  jobCount: number
  gaps: ProgramGapRow[]
  strengths: ProgramGapRow[]
  gapIndex: number
  alignmentIndex: number
  computedAt: Date
}

/**
 * Compute skills gap for a specific program within a university.
 * programName null → all students at the university (v1 equivalent).
 */
export async function computeProgramGap(
  universityName: string,
  programName: string | null
): Promise<ProgramGapReport> {
  const whereStudent: any = {
    university: { equals: universityName, mode: 'insensitive' },
    role: 'STUDENT',
  }
  if (programName) {
    whereStudent.degree = { equals: programName, mode: 'insensitive' }
  }

  const students = await prisma.user.findMany({
    where: whereStudent,
    select: {
      id: true,
      skills: true,
      projects: {
        where: { isPublic: true },
        select: { skills: true, technologies: true },
      },
    },
  })

  // Count student skill coverage (% of students who have each skill)
  const skillCoverage: Record<string, number> = {}
  for (const s of students) {
    const set = new Set<string>()
    for (const sk of s.skills ?? []) set.add(sk.toLowerCase())
    for (const p of s.projects) {
      for (const sk of p.skills ?? []) set.add(sk.toLowerCase())
      for (const t of p.technologies ?? []) set.add(t.toLowerCase())
    }
    set.forEach(sk => {
      skillCoverage[sk] = (skillCoverage[sk] ?? 0) + 1
    })
  }

  // Market demand — from jobs + SkillMapping
  const mappings = await prisma.skillMapping.findMany({
    where: { demandScore: { gt: 0 } },
    select: { academicTerm: true, industryTerms: true, demandScore: true, escoUri: true },
  })
  const marketDemand: Record<string, { score: number; escoUri: string | null }> = {}
  for (const m of mappings) {
    marketDemand[m.academicTerm.toLowerCase()] = { score: m.demandScore, escoUri: m.escoUri }
    for (const t of m.industryTerms) {
      marketDemand[t.toLowerCase()] = { score: m.demandScore, escoUri: m.escoUri }
    }
  }
  const activeJobs = await prisma.job.findMany({
    where: { status: 'ACTIVE' },
    select: { requiredSkills: true },
  })
  const jobCounts: Record<string, number> = {}
  for (const j of activeJobs) {
    for (const sk of j.requiredSkills ?? []) {
      const k = sk.toLowerCase()
      jobCounts[k] = (jobCounts[k] ?? 0) + 1
    }
  }
  const maxJob = Math.max(...Object.values(jobCounts), 1)
  for (const [sk, count] of Object.entries(jobCounts)) {
    const norm = Math.round((count / maxJob) * 100)
    const existing = marketDemand[sk]
    marketDemand[sk] = {
      score: Math.max(existing?.score ?? 0, norm),
      escoUri: existing?.escoUri ?? null,
    }
  }

  // Merge into rows
  const allSkills = new Set([...Object.keys(skillCoverage), ...Object.keys(marketDemand)])
  const rows: ProgramGapRow[] = []
  const totalStudents = students.length
  for (const sk of Array.from(allSkills)) {
    const demand = marketDemand[sk]?.score ?? 0
    const absCount = skillCoverage[sk] ?? 0
    const coverage = totalStudents > 0 ? Math.round((absCount / totalStudents) * 100) : 0
    const gapSeverity = demand - coverage
    if (demand > 0 || absCount > 0) {
      rows.push({
        skill: sk,
        escoUri: marketDemand[sk]?.escoUri ?? null,
        demandScore: demand,
        studentCount: absCount,
        coverage,
        gapSeverity,
      })
    }
  }

  rows.sort((a, b) => b.gapSeverity - a.gapSeverity)

  const gaps = rows.filter(r => r.gapSeverity > 10).slice(0, 20)
  const strengths = rows
    .filter(r => r.gapSeverity < -10)
    .sort((a, b) => a.gapSeverity - b.gapSeverity)
    .slice(0, 20)

  // Aggregate indices
  const gapIndex =
    gaps.length > 0
      ? Math.min(100, Math.round(gaps.reduce((sum, r) => sum + r.gapSeverity, 0) / gaps.length))
      : 0
  const alignmentIndex =
    rows.length > 0
      ? Math.max(
          0,
          Math.round(
            rows.reduce((sum, r) => sum + Math.max(0, 100 - Math.abs(r.gapSeverity)), 0) / rows.length
          )
        )
      : 50

  return {
    universityName,
    programName,
    studentCount: totalStudents,
    jobCount: activeJobs.length,
    gaps,
    strengths,
    gapIndex,
    alignmentIndex,
    computedAt: new Date(),
  }
}

/**
 * List all programs at the university for which we have student data.
 * Used by the program-selector UI.
 */
export async function listProgramsForUniversity(universityName: string): Promise<string[]> {
  const students = await prisma.user.findMany({
    where: { university: { equals: universityName, mode: 'insensitive' }, role: 'STUDENT' },
    select: { degree: true },
  })
  const set = new Set<string>()
  for (const s of students) {
    if (s.degree) set.add(s.degree)
  }
  return Array.from(set).sort()
}

/**
 * Persist a monthly snapshot — idempotent per (university, program, month).
 * Called by a cron or on-demand from the dashboard.
 */
export async function persistMonthlySnapshot(
  universityName: string,
  programName: string | null
): Promise<void> {
  const now = new Date()
  const snapshotMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))

  const report = await computeProgramGap(universityName, programName)

  await prisma.skillGapTrend.upsert({
    where: {
      universityName_programName_snapshotMonth: {
        universityName,
        programName: programName ?? '',
        snapshotMonth,
      },
    },
    create: {
      universityName,
      programName,
      snapshotMonth,
      topSkills: report.strengths as any,
      gaps: report.gaps as any,
      strengths: report.strengths as any,
      studentCount: report.studentCount,
      jobCount: report.jobCount,
      gapIndex: report.gapIndex,
      alignmentIndex: report.alignmentIndex,
    },
    update: {
      topSkills: report.strengths as any,
      gaps: report.gaps as any,
      strengths: report.strengths as any,
      studentCount: report.studentCount,
      jobCount: report.jobCount,
      gapIndex: report.gapIndex,
      alignmentIndex: report.alignmentIndex,
    },
  })
}

/**
 * Trend data for a program — last N months.
 */
export async function getProgramTrend(
  universityName: string,
  programName: string | null,
  months: number = 12
): Promise<Array<{ month: string; gapIndex: number; alignmentIndex: number; studentCount: number }>> {
  const since = new Date()
  since.setMonth(since.getMonth() - months)

  const snapshots = await prisma.skillGapTrend.findMany({
    where: {
      universityName,
      programName: programName ?? '',
      snapshotMonth: { gte: since },
    },
    orderBy: { snapshotMonth: 'asc' },
  })

  return snapshots.map(s => ({
    month: s.snapshotMonth.toISOString().substring(0, 7),
    gapIndex: s.gapIndex,
    alignmentIndex: s.alignmentIndex,
    studentCount: s.studentCount,
  }))
}

/**
 * Generate Evidence-based curriculum recommendations from a gap report.
 * Returns actionable items for the university's curriculum committee.
 */
export async function generateCurriculumRecommendations(
  report: ProgramGapReport
): Promise<Array<{ type: string; skill: string; suggestion: string; confidence: number; rationale: string }>> {
  const recs: Array<{ type: string; skill: string; suggestion: string; confidence: number; rationale: string }> = []

  // Top-5 severe gaps → course addition recommendations
  for (const gap of report.gaps.slice(0, 5)) {
    const esco = gap.escoUri ?? (await resolveEscoUri(gap.skill).then(r => r?.uri ?? null).catch(() => null))
    recs.push({
      type: 'ADD_COURSE',
      skill: gap.skill,
      suggestion: `Consider adding a course or elective covering "${gap.skill}"`,
      confidence: Math.min(1, gap.gapSeverity / 80),
      rationale: `${gap.demandScore}% market demand but only ${gap.coverage}% of students have this skill. Gap severity ${gap.gapSeverity}.${esco ? ' Mapped to ESCO.' : ''}`,
    })
  }

  // Top strengths → marketing / showcase recommendations
  for (const strength of report.strengths.slice(0, 3)) {
    recs.push({
      type: 'SHOWCASE',
      skill: strength.skill,
      suggestion: `Highlight "${strength.skill}" coverage (${strength.coverage}%) in program marketing`,
      confidence: 0.9,
      rationale: `Students exceed market demand by ${-strength.gapSeverity} points — competitive differentiator.`,
    })
  }

  return recs
}
