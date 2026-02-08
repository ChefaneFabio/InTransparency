import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

/**
 * GET /api/dashboard/recruiter/talent-analytics
 * Returns platform-wide talent pool analytics for recruiters
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // ----------------------------------------------------------------
    // 1. Talent Pool - Total public STUDENT users
    // ----------------------------------------------------------------
    const talentPool = await prisma.user.count({
      where: {
        role: 'STUDENT',
        profilePublic: true,
      },
    })

    // ----------------------------------------------------------------
    // 2. University Distribution - Top 10 universities by student count
    // ----------------------------------------------------------------
    const studentsWithUniversity = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        profilePublic: true,
        university: { not: null },
      },
      select: { university: true },
    })

    const universityCountMap = new Map<string, number>()
    for (let i = 0; i < studentsWithUniversity.length; i++) {
      const uni = studentsWithUniversity[i].university
      if (uni) {
        universityCountMap.set(uni, (universityCountMap.get(uni) || 0) + 1)
      }
    }

    const universityDistribution = Array.from(universityCountMap.entries())
      .map(([university, count]) => ({ university, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // ----------------------------------------------------------------
    // 3. Skills Frequency - Top 20 skills from public projects
    // ----------------------------------------------------------------
    const publicProjects = await prisma.project.findMany({
      where: {
        isPublic: true,
        user: {
          role: 'STUDENT',
          profilePublic: true,
        },
      },
      select: {
        skills: true,
        technologies: true,
      },
    })

    const skillCountMap = new Map<string, number>()
    for (let i = 0; i < publicProjects.length; i++) {
      const project = publicProjects[i]
      const allSkills = project.skills.concat(project.technologies)
      for (let j = 0; j < allSkills.length; j++) {
        const skill = allSkills[j]
        if (skill) {
          skillCountMap.set(skill, (skillCountMap.get(skill) || 0) + 1)
        }
      }
    }

    const skillsFrequency = Array.from(skillCountMap.entries())
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20)

    // ----------------------------------------------------------------
    // 4. Growth Trends - New students per month for last 6 months
    // ----------------------------------------------------------------
    const now = new Date()
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1) // Start of 6 months ago

    const recentStudents = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        createdAt: { gte: sixMonthsAgo },
      },
      select: { createdAt: true },
    })

    // Initialize months
    const growthMap = new Map<string, number>()
    const cursor = new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth(), 1)
    while (cursor <= now) {
      const key = `${cursor.getFullYear()}-${cursor.getMonth()}`
      growthMap.set(key, 0)
      cursor.setMonth(cursor.getMonth() + 1)
    }

    for (let i = 0; i < recentStudents.length; i++) {
      const d = recentStudents[i].createdAt
      const key = `${d.getFullYear()}-${d.getMonth()}`
      if (growthMap.has(key)) {
        growthMap.set(key, (growthMap.get(key) || 0) + 1)
      }
    }

    const growthTrends = Array.from(growthMap.entries()).map(([key, newStudents]) => {
      const parts = key.split('-')
      const monthIndex = parseInt(parts[1], 10)
      return {
        month: MONTH_NAMES[monthIndex],
        newStudents,
      }
    })

    // ----------------------------------------------------------------
    // 5. Discipline Distribution - Group projects by discipline
    // ----------------------------------------------------------------
    const projectDisciplines = await prisma.project.findMany({
      where: {
        isPublic: true,
        user: {
          role: 'STUDENT',
          profilePublic: true,
        },
      },
      select: { discipline: true },
    })

    const disciplineCountMap = new Map<string, number>()
    for (let i = 0; i < projectDisciplines.length; i++) {
      const discipline = projectDisciplines[i].discipline
      disciplineCountMap.set(discipline, (disciplineCountMap.get(discipline) || 0) + 1)
    }

    const disciplineDistribution = Array.from(disciplineCountMap.entries())
      .map(([discipline, count]) => ({ discipline, count }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json({
      talentPool,
      universityDistribution,
      skillsFrequency,
      growthTrends,
      disciplineDistribution,
    })
  } catch (error) {
    console.error('Error fetching talent analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch talent analytics' },
      { status: 500 }
    )
  }
}
