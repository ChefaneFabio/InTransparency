import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

export const maxDuration = 15

/**
 * GET /api/dashboard/university/auto-report
 * Auto-generates a placement report like the Padova Career Service Observatory.
 * Returns real-time data instead of annual surveys.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await prisma.universitySettings.findUnique({
      where: { userId: session.user.id },
      select: { name: true },
    })

    const universityName = settings?.name || ''
    const now = new Date()
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
    const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate())

    // Get all students from this university
    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        university: universityName ? { contains: universityName, mode: 'insensitive' } : undefined,
      },
      select: {
        id: true, degree: true, graduationYear: true,
        projects: {
          select: {
            discipline: true, skills: true, tools: true, technologies: true,
            verificationStatus: true, createdAt: true,
          },
        },
      },
    })

    const studentIds = students.map(s => s.id)

    // Get placements
    const [currentPlacements, previousPlacements] = await Promise.all([
      prisma.placement.findMany({
        where: {
          studentId: { in: studentIds },
          createdAt: { gte: oneYearAgo },
        },
        select: {
          studentId: true, companyName: true, jobTitle: true, jobType: true,
          status: true, startDate: true, source: true,
          student: { select: { degree: true, university: true } },
        },
      }),
      prisma.placement.findMany({
        where: {
          studentId: { in: studentIds },
          createdAt: { gte: twoYearsAgo, lt: oneYearAgo },
        },
        select: { id: true },
      }),
    ])

    // Get contact/outreach data (recruiter interest)
    const contactCount = await prisma.contactUsage.count({
      where: {
        recipientId: { in: studentIds },
        createdAt: { gte: oneYearAgo },
      },
    })

    const previousContactCount = await prisma.contactUsage.count({
      where: {
        recipientId: { in: studentIds },
        createdAt: { gte: twoYearsAgo, lt: oneYearAgo },
      },
    })

    // Profile views (recruiter interest indicator)
    const profileViews = await prisma.profileView.count({
      where: {
        profileUserId: { in: studentIds },
        viewerRole: 'RECRUITER',
        createdAt: { gte: oneYearAgo },
      },
    })

    // Compute metrics by discipline
    const disciplineStats = new Map<string, { students: number; placements: number; projects: number }>()
    for (const student of students) {
      const disciplines = new Set(student.projects.map(p => p.discipline).filter(Boolean))
      if (disciplines.size === 0) disciplines.add('OTHER')

      for (const discipline of Array.from(disciplines)) {
        const existing = disciplineStats.get(discipline) || { students: 0, placements: 0, projects: 0 }
        existing.students++
        existing.projects += student.projects.length
        disciplineStats.set(discipline, existing)
      }
    }

    for (const placement of currentPlacements) {
      const degree = placement.student?.degree?.toLowerCase() || ''
      let discipline = 'OTHER'
      if (degree.includes('ingegner') || degree.includes('engineer')) discipline = 'ENGINEERING'
      else if (degree.includes('economia') || degree.includes('business') || degree.includes('management')) discipline = 'BUSINESS'
      else if (degree.includes('medicin') || degree.includes('infermier') || degree.includes('health')) discipline = 'HEALTHCARE'
      else if (degree.includes('giurisp') || degree.includes('law')) discipline = 'LAW'
      else if (degree.includes('informatica') || degree.includes('computer')) discipline = 'TECHNOLOGY'
      else if (degree.includes('psicolog')) discipline = 'SOCIAL_SCIENCES'
      else if (degree.includes('design') || degree.includes('architettura')) discipline = 'DESIGN'
      else if (degree.includes('scienz') || degree.includes('science')) discipline = 'SCIENCES'

      const existing = disciplineStats.get(discipline) || { students: 0, placements: 0, projects: 0 }
      existing.placements++
      disciplineStats.set(discipline, existing)
    }

    // Top hiring companies
    const companyCounts = new Map<string, number>()
    for (const p of currentPlacements) {
      companyCounts.set(p.companyName, (companyCounts.get(p.companyName) || 0) + 1)
    }
    const topCompanies = Array.from(companyCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }))

    // Job type distribution
    const jobTypeCounts = new Map<string, number>()
    for (const p of currentPlacements) {
      jobTypeCounts.set(p.jobType, (jobTypeCounts.get(p.jobType) || 0) + 1)
    }

    // Skill supply analysis
    const skillCounts = new Map<string, number>()
    for (const student of students) {
      const seen = new Set<string>()
      for (const project of student.projects) {
        for (const skill of [...project.skills, ...project.tools, ...project.technologies]) {
          const normalized = skill.toLowerCase()
          if (!seen.has(normalized)) {
            seen.add(normalized)
            skillCounts.set(normalized, (skillCounts.get(normalized) || 0) + 1)
          }
        }
      }
    }
    const topSkills = Array.from(skillCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([skill, count]) => ({ skill, count, percentage: Math.round((count / Math.max(students.length, 1)) * 100) }))

    // Verified project rate
    const totalProjects = students.reduce((sum, s) => sum + s.projects.length, 0)
    const verifiedProjects = students.reduce((sum, s) => sum + s.projects.filter(p => p.verificationStatus === 'VERIFIED').length, 0)

    const report = {
      universityName: universityName || 'All Students',
      reportPeriod: {
        from: oneYearAgo.toISOString().split('T')[0],
        to: now.toISOString().split('T')[0],
      },
      summary: {
        totalStudents: students.length,
        totalPlacements: currentPlacements.length,
        placementRate: students.length > 0 ? Math.round((currentPlacements.length / students.length) * 100) : 0,
        previousYearPlacements: previousPlacements.length,
        placementGrowth: previousPlacements.length > 0
          ? Math.round(((currentPlacements.length - previousPlacements.length) / previousPlacements.length) * 100)
          : 0,
        totalProjects,
        verifiedProjects,
        verificationRate: totalProjects > 0 ? Math.round((verifiedProjects / totalProjects) * 100) : 0,
        recruiterContacts: contactCount,
        contactGrowth: previousContactCount > 0
          ? Math.round(((contactCount - previousContactCount) / previousContactCount) * 100)
          : 0,
        profileViews,
      },
      byDiscipline: Array.from(disciplineStats.entries())
        .map(([discipline, data]) => ({
          discipline,
          students: data.students,
          placements: data.placements,
          projects: data.projects,
          placementRate: data.students > 0 ? Math.round((data.placements / data.students) * 100) : 0,
        }))
        .sort((a, b) => b.students - a.students),
      topHiringCompanies: topCompanies,
      jobTypeDistribution: Array.from(jobTypeCounts.entries())
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count),
      topSkills,
      generatedAt: now.toISOString(),
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error('Auto-report error:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
