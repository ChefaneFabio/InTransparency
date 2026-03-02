/**
 * Decision Pack Generator
 *
 * Aggregates all available data about a candidate into a structured hiring dossier.
 * No 'use client' — server-side only.
 */

import prisma from '@/lib/prisma'
import { translateSkills } from './skill-translation'
import { normalizeGrade, formatGradeForDisplay } from './grade-normalization'
import { computePlacementPrediction } from './placement-prediction'

export interface DecisionPackData {
  candidate: {
    id: string
    firstName: string | null
    lastName: string | null
    university: string | null
    degree: string | null
    country: string
    tagline: string | null
    bio: string | null
  }
  trustScore: {
    verifiedProjects: number
    totalProjects: number
    endorsementCount: number
    universityVerified: boolean
  }
  skills: Array<{
    name: string
    industryTerms: string[]
    evidenceSources: string[]
    verifiedLevel: string
  }>
  projects: Array<{
    id: string
    title: string
    discipline: string
    grade: string | null
    normalizedGrade: number | null
    gradeDisplay: string | null
    innovationScore: number | null
    complexityScore: number | null
    marketRelevance: number | null
    aiInsights: unknown
    verificationStatus: string
    skills: string[]
    endorsements: Array<{
      professorName: string
      rating: number | null
      endorsementText: string | null
    }>
  }>
  grades: Array<{
    projectTitle: string
    originalGrade: string
    country: string
    normalizedGrade: number | null
    displayInCountry: Record<string, string>
  }>
  prediction: {
    probability: number
    topFactors: Array<{ factor: string; impact: number; description: string }>
  } | null
  softSkills: Array<{ name: string; score: number; evidence: string }> | null
  matchScore: number | null
  generatedAt: string
}

/**
 * Generate a complete Decision Pack for a candidate.
 */
export async function generateDecisionPack(
  recruiterId: string,
  candidateId: string,
  jobId?: string
): Promise<DecisionPackData> {
  // Fetch all candidate data in parallel
  const [candidate, projects, endorsements, skillPath] = await Promise.all([
    prisma.user.findUnique({
      where: { id: candidateId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        university: true,
        degree: true,
        country: true,
        tagline: true,
        bio: true,
      },
    }),
    prisma.project.findMany({
      where: { userId: candidateId, isPublic: true },
      include: {
        endorsements: {
          where: { status: 'VERIFIED' },
          select: {
            professorName: true,
            rating: true,
            endorsementText: true,
            skills: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.professorEndorsement.count({
      where: { studentId: candidateId, status: 'VERIFIED' },
    }),
    prisma.skillPathRecommendation.findUnique({
      where: { userId: candidateId },
    }),
  ])

  if (!candidate) {
    throw new Error('Candidate not found')
  }

  const country = candidate.country || 'IT'

  // Trust score
  const verifiedProjects = projects.filter(
    (p) => p.verificationStatus === 'VERIFIED'
  ).length
  const trustScore = {
    verifiedProjects,
    totalProjects: projects.length,
    endorsementCount: endorsements,
    universityVerified: verifiedProjects > 0,
  }

  // Collect all skills across projects
  const allSkillNames = new Set<string>()
  const skillEvidence = new Map<string, string[]>()

  for (const project of projects) {
    const projectSkills = [
      ...project.skills,
      ...project.technologies,
      ...project.tools,
    ]
    for (const skill of projectSkills) {
      const lower = skill.toLowerCase()
      allSkillNames.add(lower)
      const sources = skillEvidence.get(lower) || []
      sources.push(project.title)
      skillEvidence.set(lower, sources)
    }
  }

  // Translate skills to industry terms
  const translated = await translateSkills(
    Array.from(allSkillNames),
    'en'
  )

  const skills = translated.map((t) => ({
    name: t.original,
    industryTerms: t.industryTerms,
    evidenceSources: skillEvidence.get(t.original.toLowerCase()) || [],
    verifiedLevel: verifiedProjects > 0 ? 'Institution Verified' : 'Self-Reported',
  }))

  // Projects with normalized grades
  const projectData = projects.map((p) => {
    let normalizedGradeVal: number | null = null
    let gradeDisplay: string | null = null

    if (p.grade) {
      normalizedGradeVal = p.normalizedGrade ?? normalizeGrade(p.grade, country)
      if (normalizedGradeVal !== null) {
        gradeDisplay = formatGradeForDisplay(normalizedGradeVal, country)
      }
    }

    return {
      id: p.id,
      title: p.title,
      discipline: p.discipline,
      grade: p.grade,
      normalizedGrade: normalizedGradeVal,
      gradeDisplay,
      innovationScore: p.innovationScore,
      complexityScore: p.complexityScore,
      marketRelevance: p.marketRelevance,
      aiInsights: p.aiInsights,
      verificationStatus: p.verificationStatus,
      skills: [...p.skills, ...p.technologies],
      endorsements: p.endorsements.map((e) => ({
        professorName: e.professorName,
        rating: e.rating,
        endorsementText: e.endorsementText,
      })),
    }
  })

  // Grade provenance table
  const grades = projects
    .filter((p) => p.grade)
    .map((p) => {
      const normalized = p.normalizedGrade ?? normalizeGrade(p.grade!, country)
      const displayInCountry: Record<string, string> = {}
      if (normalized !== null) {
        for (const c of ['IT', 'DE', 'FR', 'ES', 'UK']) {
          displayInCountry[c] = formatGradeForDisplay(normalized, c)
        }
      }
      return {
        projectTitle: p.title,
        originalGrade: p.grade!,
        country,
        normalizedGrade: normalized,
        displayInCountry,
      }
    })

  // Placement prediction
  let prediction: DecisionPackData['prediction'] = null
  try {
    const pred = await computePlacementPrediction(candidateId)
    prediction = {
      probability: pred.probability,
      topFactors: pred.topFactors,
    }
  } catch {
    // Skip if prediction fails
  }

  // Soft skills from SkillPath
  let softSkills: DecisionPackData['softSkills'] = null
  if (skillPath?.recommendations) {
    try {
      const recs = skillPath.recommendations as { softSkills?: Array<{ name: string; score: number; evidence: string }> }
      if (recs.softSkills) {
        softSkills = recs.softSkills
      }
    } catch {
      // Ignore parse errors
    }
  }

  // Job match score (if job context provided)
  let matchScore: number | null = null
  if (jobId) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { requiredSkills: true, preferredSkills: true },
    })
    if (job) {
      const candidateSkillsLower = Array.from(allSkillNames)
      const translatedLower = translated.flatMap((t) =>
        t.industryTerms.map((i) => i.toLowerCase())
      )
      const allCandidateSkills = new Set([...candidateSkillsLower, ...translatedLower])

      const requiredMatches = job.requiredSkills.filter((s) =>
        allCandidateSkills.has(s.toLowerCase())
      ).length
      const preferredMatches = job.preferredSkills.filter((s) =>
        allCandidateSkills.has(s.toLowerCase())
      ).length

      const requiredScore = job.requiredSkills.length > 0
        ? (requiredMatches / job.requiredSkills.length) * 100
        : 100
      const preferredScore = job.preferredSkills.length > 0
        ? (preferredMatches / job.preferredSkills.length) * 100
        : 100

      matchScore = Math.round(requiredScore * 0.7 + preferredScore * 0.3)
    }
  }

  return {
    candidate: {
      id: candidate.id,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      university: candidate.university,
      degree: candidate.degree,
      country,
      tagline: candidate.tagline,
      bio: candidate.bio,
    },
    trustScore,
    skills,
    projects: projectData,
    grades,
    prediction,
    softSkills,
    matchScore,
    generatedAt: new Date().toISOString(),
  }
}
