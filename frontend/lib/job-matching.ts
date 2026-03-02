// Job matching logic — runs server-side only (no 'use client')

import prisma from '@/lib/prisma'

export interface JobMatchResult {
  jobId: string
  matchScore: number
  matchedSkills: string[]
  missingSkills: string[]
  matchedPreferred: string[]
  disciplineMatch: boolean
}

interface ProjectForMatching {
  technologies: string[]
  skills: string[]
  tools: string[]
  competencies: string[]
  discipline: string
}

interface JobForMatching {
  id: string
  requiredSkills: string[]
  preferredSkills: string[]
  targetDisciplines: string[]
}

/**
 * Extract all unique skill names from a student's projects (lowercased).
 */
export function buildStudentSkillSet(projects: ProjectForMatching[]): Set<string> {
  const skills = new Set<string>()
  for (const project of projects) {
    const all = project.technologies
      .concat(project.skills)
      .concat(project.tools)
      .concat(project.competencies)
    for (const s of all) {
      const normalized = s.toLowerCase().trim()
      if (normalized) {
        skills.add(normalized)
      }
    }
  }
  return skills
}

/**
 * Extract unique disciplines from a student's projects (lowercased).
 */
export function buildStudentDisciplines(projects: ProjectForMatching[]): Set<string> {
  const disciplines = new Set<string>()
  for (const project of projects) {
    if (project.discipline) {
      disciplines.add(project.discipline.toLowerCase().trim())
    }
  }
  return disciplines
}

/**
 * Compute a match score for a single job against a student's skill set.
 *
 * Weights:
 *  - Required skills match:  60%
 *  - Preferred skills match: 25%
 *  - Discipline match:       15%
 */
export function computeJobMatch(
  studentSkillNames: Set<string>,
  studentDisciplines: Set<string>,
  job: JobForMatching
): JobMatchResult {
  // Required skills
  const matchedSkills: string[] = []
  const missingSkills: string[] = []
  for (const skill of job.requiredSkills) {
    if (studentSkillNames.has(skill.toLowerCase().trim())) {
      matchedSkills.push(skill)
    } else {
      missingSkills.push(skill)
    }
  }
  const requiredScore = job.requiredSkills.length > 0
    ? (matchedSkills.length / job.requiredSkills.length) * 100
    : 100 // No required skills = full score

  // Preferred skills
  const matchedPreferred: string[] = []
  for (const skill of job.preferredSkills) {
    if (studentSkillNames.has(skill.toLowerCase().trim())) {
      matchedPreferred.push(skill)
    }
  }
  const preferredScore = job.preferredSkills.length > 0
    ? (matchedPreferred.length / job.preferredSkills.length) * 100
    : 100

  // Discipline match
  let disciplineMatch = false
  if (job.targetDisciplines.length === 0) {
    disciplineMatch = true // No discipline requirement = match
  } else {
    for (const d of job.targetDisciplines) {
      if (studentDisciplines.has(d.toLowerCase().trim())) {
        disciplineMatch = true
        break
      }
    }
  }
  const disciplineScore = disciplineMatch ? 100 : 0

  const matchScore = Math.round(
    requiredScore * 0.6 + preferredScore * 0.25 + disciplineScore * 0.15
  )

  return {
    jobId: job.id,
    matchScore,
    matchedSkills,
    missingSkills,
    matchedPreferred,
    disciplineMatch,
  }
}

/**
 * Build an expanded skill set that includes industry synonyms from SkillMapping.
 * This gives fuzzy matching: "manutenzione predittiva ML" now matches "predictive maintenance".
 */
export async function buildExpandedSkillSet(
  projects: ProjectForMatching[]
): Promise<Set<string>> {
  const baseSkills = buildStudentSkillSet(projects)
  const skillArray = Array.from(baseSkills)

  if (skillArray.length === 0) return baseSkills

  // Look up all SkillMappings that match any of the student's skills
  const mappings = await prisma.skillMapping.findMany({
    where: {
      OR: [
        { academicTerm: { in: skillArray } },
        { industryTerms: { hasSome: skillArray } },
        { synonyms: { hasSome: skillArray } },
      ],
    },
    select: { academicTerm: true, industryTerms: true, synonyms: true },
  })

  // Expand the skill set with all related terms
  const expanded = new Set(baseSkills)
  for (const mapping of mappings) {
    expanded.add(mapping.academicTerm.toLowerCase())
    for (const term of mapping.industryTerms) {
      expanded.add(term.toLowerCase().trim())
    }
    for (const syn of mapping.synonyms) {
      expanded.add(syn.toLowerCase().trim())
    }
  }

  return expanded
}
