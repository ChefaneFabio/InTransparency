import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/university/curriculum-alignment
 *
 * For each course, compares the skills students demonstrate in their projects
 * against what recruiters search for. Returns per-course alignment scores
 * and actionable suggestions for curriculum improvement.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'UNIVERSITY' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { company: true, university: true },
    })
    const universityName = user?.company || user?.university
    if (!universityName) {
      return NextResponse.json({ error: 'University not configured' }, { status: 400 })
    }

    // 1. Get all students from this university with their projects
    const students = await prisma.user.findMany({
      where: { university: universityName, role: 'STUDENT' },
      select: {
        id: true,
        projects: {
          where: { isPublic: true },
          select: {
            courseName: true,
            courseCode: true,
            technologies: true,
            skills: true,
            competencies: true,
            discipline: true,
          },
        },
      },
    })

    // 2. Aggregate skills per course
    const courseSkills: Record<string, {
      courseName: string
      courseCode: string | null
      studentCount: number
      studentIds: Set<string>
      skills: Record<string, number>
      disciplines: Record<string, number>
    }> = {}

    // All skills across the university
    const allStudentSkills: Record<string, number> = {}

    for (const student of students) {
      for (const project of student.projects) {
        const courseKey = project.courseName || 'Unassigned'
        if (!courseSkills[courseKey]) {
          courseSkills[courseKey] = {
            courseName: project.courseName || 'Unassigned',
            courseCode: project.courseCode,
            studentCount: 0,
            studentIds: new Set(),
            skills: {},
            disciplines: {},
          }
        }
        const course = courseSkills[courseKey]
        course.studentIds.add(student.id)

        if (project.discipline) {
          course.disciplines[project.discipline] = (course.disciplines[project.discipline] || 0) + 1
        }

        const projectSkills = [
          ...(project.technologies || []),
          ...(project.skills || []),
          ...(project.competencies || []),
        ]
        for (const skill of projectSkills) {
          course.skills[skill] = (course.skills[skill] || 0) + 1
          allStudentSkills[skill] = (allStudentSkills[skill] || 0) + 1
        }
      }
    }

    // Set student counts
    for (const course of Object.values(courseSkills)) {
      course.studentCount = course.studentIds.size
    }

    // 3. Get market demand — what recruiters search for
    // Use profile views and contact usage from recruiters viewing this uni's students
    const studentIds = students.map(s => s.id)

    // Skills from job listings (if available)
    const jobs = await prisma.job.findMany({
      where: { status: 'ACTIVE' },
      select: { requiredSkills: true, preferredSkills: true },
      take: 200,
    })

    const marketDemand: Record<string, number> = {}
    for (const job of jobs) {
      for (const skill of [...(job.requiredSkills || []), ...(job.preferredSkills || [])]) {
        marketDemand[skill] = (marketDemand[skill] || 0) + 1
      }
    }

    // Also count skills from projects of contacted/hired students (validated demand)
    const contactedStudentIds = await prisma.contactUsage.findMany({
      where: { recipientId: { in: studentIds } },
      select: { recipientId: true },
      distinct: ['recipientId'],
    })
    const contactedIds = contactedStudentIds.map(c => c.recipientId)

    if (contactedIds.length > 0) {
      const contactedProjects = await prisma.project.findMany({
        where: { userId: { in: contactedIds }, isPublic: true },
        select: { technologies: true, skills: true },
      })
      for (const p of contactedProjects) {
        for (const skill of [...(p.technologies || []), ...(p.skills || [])]) {
          marketDemand[skill] = (marketDemand[skill] || 0) + 2 // Weight higher — validated
        }
      }
    }

    // 4. Calculate per-course alignment
    const courseAlignments = Object.values(courseSkills)
      .filter(c => c.courseName !== 'Unassigned' && c.studentCount >= 1)
      .map(course => {
        const courseSkillSet = Object.keys(course.skills)
        const demandedSkills = Object.entries(marketDemand)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 30)
          .map(([name]) => name)

        // Skills this course teaches that are in demand
        const alignedSkills = courseSkillSet.filter(s =>
          demandedSkills.some(d => d.toLowerCase() === s.toLowerCase())
        )

        // In-demand skills NOT covered by this course
        const missingSkills = demandedSkills.filter(d =>
          !courseSkillSet.some(s => s.toLowerCase() === d.toLowerCase())
        ).slice(0, 5)

        // Alignment score
        const alignmentScore = demandedSkills.length > 0
          ? Math.round((alignedSkills.length / Math.min(demandedSkills.length, 10)) * 100)
          : 50

        // Top skills taught
        const topSkills = Object.entries(course.skills)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([name, count]) => ({ name, studentCount: count }))

        // Primary discipline
        const primaryDiscipline = Object.entries(course.disciplines)
          .sort((a, b) => b[1] - a[1])[0]?.[0] || 'GENERAL'

        return {
          courseName: course.courseName,
          courseCode: course.courseCode,
          studentCount: course.studentCount,
          primaryDiscipline,
          alignmentScore: Math.min(alignmentScore, 100),
          topSkills,
          alignedSkills: alignedSkills.slice(0, 5),
          missingSkills,
          suggestions: generateSuggestions(course.courseName, alignedSkills, missingSkills, alignmentScore),
        }
      })
      .sort((a, b) => a.alignmentScore - b.alignmentScore) // Worst first — action-oriented

    // 5. Overall stats
    const totalCourses = courseAlignments.length
    const avgAlignment = totalCourses > 0
      ? Math.round(courseAlignments.reduce((sum, c) => sum + c.alignmentScore, 0) / totalCourses)
      : 0
    const coursesNeedingAttention = courseAlignments.filter(c => c.alignmentScore < 50).length

    // Top demanded skills overall
    const topDemanded = Object.entries(marketDemand)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([name, demand]) => ({
        name,
        demand,
        covered: allStudentSkills[name] ? true : false,
        studentCount: allStudentSkills[name] || 0,
      }))

    return NextResponse.json({
      overview: {
        totalCourses,
        avgAlignment,
        coursesNeedingAttention,
        totalStudents: students.length,
      },
      courses: courseAlignments,
      topDemandedSkills: topDemanded,
    })
  } catch (error) {
    console.error('Curriculum alignment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateSuggestions(
  courseName: string,
  alignedSkills: string[],
  missingSkills: string[],
  score: number
): string[] {
  const suggestions: string[] = []

  if (score < 30) {
    suggestions.push(`This course has low alignment with market demand. Consider a curriculum review to incorporate in-demand skills.`)
  }

  if (missingSkills.length > 0) {
    suggestions.push(`Consider adding ${missingSkills.slice(0, 3).join(', ')} to the course — these are highly searched by recruiters but not covered.`)
  }

  if (alignedSkills.length > 0 && score >= 50) {
    suggestions.push(`Strong coverage of ${alignedSkills.slice(0, 3).join(', ')}. Consider deepening these through advanced projects or certifications.`)
  }

  if (score < 50) {
    suggestions.push(`Encourage students to add portfolio projects using in-demand tools to supplement coursework.`)
  }

  return suggestions
}
