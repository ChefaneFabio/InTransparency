import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

interface AiInsights {
  summary?: string
  strengths?: string[]
  improvements?: string[]
  highlights?: string[]
  recommendations?: string[]
  detectedCompetencies?: Array<{ name: string; proficiency: number }>
  softSkills?: Array<{ name: string; score: number }>
}

/**
 * GET /api/recruiter/readiness-brief/[studentId]
 *
 * Aggregates a student's verified projects, AI analysis, and competencies
 * into an actionable "Readiness Brief" for recruiters — showing what tasks
 * this candidate can handle, suggested onboarding, and growth areas.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { studentId } = await params

    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        degree: true,
        university: true,
        projects: {
          where: { isPublic: true },
          select: {
            title: true,
            description: true,
            discipline: true,
            technologies: true,
            skills: true,
            competencies: true,
            innovationScore: true,
            complexityScore: true,
            aiInsights: true,
            aiAnalyzed: true,
            grade: true,
            universityVerified: true,
            teamSize: true,
            role: true,
            duration: true,
          },
          orderBy: { innovationScore: 'desc' },
        },
      },
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const projects = student.projects
    if (projects.length === 0) {
      return NextResponse.json({
        hasData: false,
        message: 'This student has no public projects to analyze.',
      })
    }

    // --- Aggregate data from all projects ---

    // Collect all technologies, skills, competencies with frequency
    const techFrequency: Record<string, number> = {}
    const skillFrequency: Record<string, number> = {}
    const competencyScores: Record<string, { total: number; count: number }> = {}
    const softSkillScores: Record<string, { total: number; count: number }> = {}
    const allStrengths: string[] = []
    const allImprovements: string[] = []
    const disciplines: Record<string, number> = {}

    let totalComplexity = 0
    let totalInnovation = 0
    let scoredProjects = 0
    let verifiedCount = 0
    let teamProjects = 0
    let soloProjects = 0

    for (const project of projects) {
      // Count disciplines
      if (project.discipline) {
        disciplines[project.discipline] = (disciplines[project.discipline] || 0) + 1
      }

      // Tech frequency
      for (const tech of project.technologies || []) {
        techFrequency[tech] = (techFrequency[tech] || 0) + 1
      }

      // Skill frequency
      for (const skill of project.skills || []) {
        skillFrequency[skill] = (skillFrequency[skill] || 0) + 1
      }

      // Competencies from project fields
      for (const comp of project.competencies || []) {
        if (!competencyScores[comp]) competencyScores[comp] = { total: 0, count: 0 }
        competencyScores[comp].total += (project.innovationScore || 50)
        competencyScores[comp].count += 1
      }

      // Scores
      if (project.innovationScore !== null) {
        totalInnovation += project.innovationScore
        scoredProjects++
      }
      if (project.complexityScore !== null) {
        totalComplexity += project.complexityScore
      }

      if (project.universityVerified) verifiedCount++

      // Team vs solo
      if (project.teamSize && project.teamSize > 1) {
        teamProjects++
      } else {
        soloProjects++
      }

      // AI insights aggregation
      if (project.aiInsights && project.aiAnalyzed) {
        const insights = project.aiInsights as AiInsights
        if (insights.strengths) allStrengths.push(...insights.strengths)
        if (insights.improvements) allImprovements.push(...insights.improvements)

        if (insights.detectedCompetencies) {
          for (const comp of insights.detectedCompetencies) {
            if (!competencyScores[comp.name]) competencyScores[comp.name] = { total: 0, count: 0 }
            competencyScores[comp.name].total += comp.proficiency
            competencyScores[comp.name].count += 1
          }
        }

        if (insights.softSkills) {
          for (const skill of insights.softSkills) {
            if (!softSkillScores[skill.name]) softSkillScores[skill.name] = { total: 0, count: 0 }
            softSkillScores[skill.name].total += skill.score
            softSkillScores[skill.name].count += 1
          }
        }
      }
    }

    // --- Build the readiness brief ---

    // Core technologies (sorted by frequency, top 8)
    const coreTechnologies = Object.entries(techFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, projectCount: count }))

    // Top competencies (averaged scores, sorted)
    const topCompetencies = Object.entries(competencyScores)
      .map(([name, data]) => ({
        name,
        averageScore: Math.round(data.total / data.count),
        projectCount: data.count,
      }))
      .sort((a, b) => b.averageScore - a.averageScore)

    // Soft skills (averaged)
    const softSkills = Object.entries(softSkillScores)
      .map(([name, data]) => ({
        name,
        score: Math.round(data.total / data.count),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)

    // Average scores
    const avgInnovation = scoredProjects > 0 ? Math.round(totalInnovation / scoredProjects) : null
    const avgComplexity = scoredProjects > 0 ? Math.round(totalComplexity / scoredProjects) : null

    // Primary discipline
    const primaryDiscipline = Object.entries(disciplines)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'GENERAL'

    // --- Ready-to-assign tasks (derived from demonstrated skills) ---
    const readyToAssignTasks = generateReadyTasks(coreTechnologies, topCompetencies, primaryDiscipline, avgComplexity || 50)

    // --- Onboarding suggestion ---
    const onboardingPath = generateOnboardingPath(coreTechnologies, topCompetencies, avgComplexity || 50, teamProjects, soloProjects)

    // --- Team fit ---
    const teamFit = generateTeamFit(primaryDiscipline, coreTechnologies, softSkills, teamProjects, soloProjects)

    // --- Growth areas ---
    const growthAreas = deduplicateStrings(allImprovements).slice(0, 5)

    // --- Unique strengths ---
    const strengths = deduplicateStrings(allStrengths).slice(0, 5)

    return NextResponse.json({
      hasData: true,
      studentName: `${student.firstName || ''} ${student.lastName || ''}`.trim(),
      degree: student.degree,
      university: student.university,
      summary: {
        totalProjects: projects.length,
        verifiedProjects: verifiedCount,
        avgInnovation,
        avgComplexity,
        primaryDiscipline,
        teamProjects,
        soloProjects,
      },
      coreTechnologies,
      topCompetencies: topCompetencies.slice(0, 8),
      softSkills,
      readyToAssignTasks,
      onboardingPath,
      teamFit,
      strengths,
      growthAreas,
    })
  } catch (error) {
    console.error('Error generating readiness brief:', error)
    return NextResponse.json(
      { error: 'Failed to generate readiness brief' },
      { status: 500 }
    )
  }
}

// --- Helper functions ---

function generateReadyTasks(
  techs: Array<{ name: string; projectCount: number }>,
  competencies: Array<{ name: string; averageScore: number; projectCount: number }>,
  discipline: string,
  avgComplexity: number
): Array<{ task: string; confidence: 'high' | 'medium'; reason: string }> {
  const tasks: Array<{ task: string; confidence: 'high' | 'medium'; reason: string }> = []
  const techNames = techs.map(t => t.name.toLowerCase())

  // Technology-based task suggestions
  if (techNames.some(t => ['react', 'next.js', 'nextjs', 'vue', 'angular'].includes(t))) {
    tasks.push({
      task: 'Build and maintain frontend features and UI components',
      confidence: techs[0]?.projectCount >= 2 ? 'high' : 'medium',
      reason: `Demonstrated across ${techs[0]?.projectCount || 1} project(s) using ${techs.filter(t => ['react', 'next.js', 'nextjs', 'vue', 'angular'].includes(t.name.toLowerCase())).map(t => t.name).join(', ')}`,
    })
  }

  if (techNames.some(t => ['node.js', 'express', 'fastapi', 'django', 'spring', 'nestjs'].includes(t))) {
    tasks.push({
      task: 'Develop REST APIs and backend services',
      confidence: avgComplexity >= 60 ? 'high' : 'medium',
      reason: 'Built backend services with server-side frameworks',
    })
  }

  if (techNames.some(t => ['python', 'pandas', 'numpy', 'jupyter', 'r', 'matlab'].includes(t))) {
    tasks.push({
      task: 'Run data analysis and build reports',
      confidence: 'medium',
      reason: 'Experience with data processing tools',
    })
  }

  if (techNames.some(t => ['postgresql', 'mysql', 'mongodb', 'prisma', 'sql'].includes(t))) {
    tasks.push({
      task: 'Design and query databases, write migrations',
      confidence: avgComplexity >= 50 ? 'high' : 'medium',
      reason: 'Worked with database systems in projects',
    })
  }

  if (techNames.some(t => ['figma', 'sketch', 'adobe xd', 'css', 'tailwind'].includes(t))) {
    tasks.push({
      task: 'Create UI designs and implement responsive layouts',
      confidence: 'medium',
      reason: 'Experience with design and styling tools',
    })
  }

  if (techNames.some(t => ['docker', 'kubernetes', 'aws', 'gcp', 'azure', 'ci/cd'].includes(t))) {
    tasks.push({
      task: 'Set up deployment pipelines and manage infrastructure',
      confidence: 'medium',
      reason: 'Exposure to DevOps and cloud tools',
    })
  }

  if (techNames.some(t => ['tensorflow', 'pytorch', 'scikit-learn', 'machine learning', 'ai'].includes(t))) {
    tasks.push({
      task: 'Build and train ML models, integrate AI features',
      confidence: avgComplexity >= 70 ? 'high' : 'medium',
      reason: 'Experience with machine learning frameworks',
    })
  }

  // Discipline-based fallbacks
  if (discipline === 'BUSINESS' && tasks.length < 2) {
    tasks.push({
      task: 'Prepare business analysis and market research reports',
      confidence: 'medium',
      reason: 'Business discipline projects with analytical focus',
    })
  }

  if (discipline === 'DESIGN' && tasks.length < 2) {
    tasks.push({
      task: 'Lead UX research and create design prototypes',
      confidence: 'medium',
      reason: 'Design discipline with project portfolio',
    })
  }

  // Generic task based on project complexity
  if (avgComplexity >= 70) {
    tasks.push({
      task: 'Own small features end-to-end with minimal supervision',
      confidence: 'high',
      reason: `Average project complexity score of ${avgComplexity}/100 indicates strong independent work capability`,
    })
  }

  return tasks.slice(0, 6)
}

function generateOnboardingPath(
  techs: Array<{ name: string; projectCount: number }>,
  competencies: Array<{ name: string; averageScore: number }>,
  avgComplexity: number,
  teamProjects: number,
  soloProjects: number
): { first30: string[]; next30: string[]; next30to90: string[] } {
  const first30: string[] = []
  const next30: string[] = []
  const next30to90: string[] = []

  // First 30 days — orientation and small wins
  first30.push('Pair with a senior team member on existing codebase')
  if (techs.length > 0) {
    first30.push(`Assign tasks using their strongest tools: ${techs.slice(0, 3).map(t => t.name).join(', ')}`)
  }
  first30.push('Complete a small, self-contained task to build confidence')

  // Days 30–60 — increasing ownership
  if (avgComplexity >= 60) {
    next30.push('Assign ownership of a small feature or module')
  } else {
    next30.push('Gradually increase task complexity with code review support')
  }
  if (teamProjects > soloProjects) {
    next30.push('Include in cross-functional team meetings — they thrive in teams')
  } else {
    next30.push('Give focused, independent tasks — they work well solo')
  }
  next30.push('Introduce to production deployment and monitoring workflows')

  // Days 60–90 — autonomy
  next30to90.push('Own a feature from design through delivery')
  if (competencies.some(c => c.averageScore >= 70)) {
    next30to90.push('Mentor newer team members in their strongest areas')
  }
  next30to90.push('Contribute to architecture discussions and technical decisions')

  return { first30, next30, next30to90 }
}

function generateTeamFit(
  discipline: string,
  techs: Array<{ name: string; projectCount: number }>,
  softSkills: Array<{ name: string; score: number }>,
  teamProjects: number,
  soloProjects: number
): { bestFitRoles: string[]; workStyle: string; collaborationNote: string } {
  const bestFitRoles: string[] = []
  const techNames = techs.map(t => t.name.toLowerCase())

  if (techNames.some(t => ['react', 'vue', 'angular', 'css', 'tailwind', 'figma'].includes(t))) {
    bestFitRoles.push('Frontend / UI')
  }
  if (techNames.some(t => ['node.js', 'express', 'django', 'spring', 'fastapi', 'nestjs'].includes(t))) {
    bestFitRoles.push('Backend / API')
  }
  if (techNames.some(t => ['python', 'pandas', 'r', 'sql', 'jupyter'].includes(t))) {
    bestFitRoles.push('Data / Analytics')
  }
  if (techNames.some(t => ['docker', 'kubernetes', 'aws', 'gcp', 'terraform'].includes(t))) {
    bestFitRoles.push('DevOps / Infrastructure')
  }
  if (techNames.some(t => ['tensorflow', 'pytorch', 'scikit-learn'].includes(t))) {
    bestFitRoles.push('ML / AI')
  }
  if (discipline === 'DESIGN') bestFitRoles.push('Product Design / UX')
  if (discipline === 'BUSINESS') bestFitRoles.push('Business Analysis / Strategy')

  if (bestFitRoles.length === 0) bestFitRoles.push('Generalist / Cross-functional')

  const workStyle = teamProjects > soloProjects
    ? 'Collaborative — has worked primarily in team settings'
    : soloProjects > teamProjects
      ? 'Independent — most projects were self-directed'
      : 'Balanced — comfortable in both team and solo settings'

  const topSoft = softSkills[0]?.name || ''
  const collaborationNote = topSoft
    ? `Strongest soft skill: ${topSoft}. Consider roles where this adds value.`
    : teamProjects > 0
      ? 'Has team project experience — can integrate into existing teams.'
      : 'Primarily solo work — may benefit from structured onboarding with a buddy.'

  return { bestFitRoles, workStyle, collaborationNote }
}

function deduplicateStrings(arr: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const item of arr) {
    const normalized = item.toLowerCase().trim()
    if (!seen.has(normalized) && normalized.length > 0) {
      seen.add(normalized)
      result.push(item)
    }
  }
  return result
}
