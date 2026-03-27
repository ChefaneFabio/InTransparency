import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { normalizeSkill, calculateProficiency, detectTransferableSkills, getSuggestedSkills } from '@/lib/skills-intelligence'

/**
 * GET /api/dashboard/student/skills-timeline
 *
 * Returns the student's skill growth over time, with proficiency levels
 * calculated from project evidence.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        title: true,
        description: true,
        technologies: true,
        skills: true,
        competencies: true,
        innovationScore: true,
        complexityScore: true,
        createdAt: true,
        discipline: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    if (projects.length === 0) {
      return NextResponse.json({ hasData: false, message: 'No projects yet.' })
    }

    // Track skills over time
    const skillTimeline: Record<string, {
      firstSeen: string
      projectCount: number
      projects: string[]
      complexityScores: number[]
      innovationScores: number[]
    }> = {}

    const descriptions: string[] = []

    for (const project of projects) {
      const allSkills = [
        ...(project.technologies || []),
        ...(project.skills || []),
        ...(project.competencies || []),
      ]
      if (project.description) descriptions.push(project.description)

      for (const skill of allSkills) {
        const normalized = normalizeSkill(skill)
        if (!skillTimeline[normalized]) {
          skillTimeline[normalized] = {
            firstSeen: project.createdAt.toISOString(),
            projectCount: 0,
            projects: [],
            complexityScores: [],
            innovationScores: [],
          }
        }
        skillTimeline[normalized].projectCount++
        skillTimeline[normalized].projects.push(project.title)
        if (project.complexityScore !== null) {
          skillTimeline[normalized].complexityScores.push(project.complexityScore)
        }
        if (project.innovationScore !== null) {
          skillTimeline[normalized].innovationScores.push(project.innovationScore)
        }
      }
    }

    // Calculate proficiency for each skill
    const skillsWithProficiency = Object.entries(skillTimeline)
      .map(([name, data]) => {
        const avgComplexity = data.complexityScores.length > 0
          ? Math.round(data.complexityScores.reduce((a, b) => a + b, 0) / data.complexityScores.length)
          : null
        const avgInnovation = data.innovationScores.length > 0
          ? Math.round(data.innovationScores.reduce((a, b) => a + b, 0) / data.innovationScores.length)
          : null

        const proficiency = calculateProficiency(data.projectCount, avgComplexity, avgInnovation)

        return {
          name,
          firstSeen: data.firstSeen,
          projectCount: data.projectCount,
          projects: data.projects,
          avgComplexity,
          avgInnovation,
          proficiency: proficiency.level,
          proficiencyScore: proficiency.score,
        }
      })
      .sort((a, b) => b.proficiencyScore - a.proficiencyScore)

    // Timeline events (monthly skill snapshots)
    const monthlySnapshots: Array<{ month: string; skillCount: number; newSkills: string[] }> = []
    const seenByMonth = new Map<string, Set<string>>()
    const allSeenSkills = new Set<string>()

    for (const project of projects) {
      const month = project.createdAt.toISOString().slice(0, 7) // YYYY-MM
      if (!seenByMonth.has(month)) {
        seenByMonth.set(month, new Set())
      }
      const monthSkills = seenByMonth.get(month)!
      const allSkills = [
        ...(project.technologies || []),
        ...(project.skills || []),
        ...(project.competencies || []),
      ]
      for (const skill of allSkills) {
        const normalized = normalizeSkill(skill)
        monthSkills.add(normalized)
      }
    }

    const monthEntries = Array.from(seenByMonth.entries()).sort((a, b) => a[0].localeCompare(b[0]))
    for (const [month, skills] of monthEntries) {
      const newSkills: string[] = []
      skills.forEach(s => {
        if (!allSeenSkills.has(s)) {
          newSkills.push(s)
          allSeenSkills.add(s)
        }
      })
      monthlySnapshots.push({
        month,
        skillCount: allSeenSkills.size,
        newSkills,
      })
    }

    // Detect transferable skills
    const transferable = detectTransferableSkills(descriptions)

    // Suggest next skills to learn
    const currentSkillNames = skillsWithProficiency.map(s => s.name)
    const suggestions = getSuggestedSkills(currentSkillNames)

    // Summary stats
    const expertSkills = skillsWithProficiency.filter(s => s.proficiency === 'expert').length
    const proficientSkills = skillsWithProficiency.filter(s => s.proficiency === 'proficient').length
    const workingSkills = skillsWithProficiency.filter(s => s.proficiency === 'working').length
    const exposureSkills = skillsWithProficiency.filter(s => s.proficiency === 'exposure').length

    return NextResponse.json({
      hasData: true,
      summary: {
        totalSkills: skillsWithProficiency.length,
        totalProjects: projects.length,
        expertSkills,
        proficientSkills,
        workingSkills,
        exposureSkills,
      },
      skills: skillsWithProficiency,
      timeline: monthlySnapshots,
      transferableSkills: transferable,
      suggestions,
    })
  } catch (error) {
    console.error('Skills timeline error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
