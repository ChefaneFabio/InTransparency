import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/recruiter/university-insights
 * Shows recruiters which universities produce the best candidates
 * for their open roles. Helps companies target their recruitment.
 *
 * Inspired by PoliMi's "1,200 new host companies" stat — we help
 * companies find the RIGHT university to recruit from.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get recruiter's jobs to understand what skills they need
    const jobs = await prisma.job.findMany({
      where: { recruiterId: session.user.id, status: 'ACTIVE' },
      select: { requiredSkills: true, targetDisciplines: true },
    })

    const neededSkills = new Set<string>()
    for (const job of jobs) {
      job.requiredSkills.forEach(s => neededSkills.add(s.toLowerCase()))
    }

    // Find all public students with projects
    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        profilePublic: true,
        university: { not: null },
        projects: { some: {} },
      },
      select: {
        university: true,
        projects: {
          select: {
            skills: true, tools: true, technologies: true,
            verificationStatus: true, discipline: true,
          },
        },
      },
      take: 500,
    })

    // Aggregate by university
    const uniData = new Map<string, {
      studentCount: number
      totalProjects: number
      verifiedProjects: number
      matchingStudents: number
      topSkills: Map<string, number>
      disciplines: Map<string, number>
    }>()

    for (const student of students) {
      const uni = student.university || 'Unknown'
      const data = uniData.get(uni) || {
        studentCount: 0,
        totalProjects: 0,
        verifiedProjects: 0,
        matchingStudents: 0,
        topSkills: new Map(),
        disciplines: new Map(),
      }

      data.studentCount++
      data.totalProjects += student.projects.length
      data.verifiedProjects += student.projects.filter(p => p.verificationStatus === 'VERIFIED').length

      // Check if this student matches the recruiter's needs
      const studentSkills = new Set<string>()
      for (const p of student.projects) {
        for (const s of [...p.skills, ...p.tools, ...p.technologies]) {
          studentSkills.add(s.toLowerCase())
        }
        // Track discipline
        if (p.discipline) {
          data.disciplines.set(p.discipline, (data.disciplines.get(p.discipline) || 0) + 1)
        }
      }

      // Skill overlap with recruiter's needs
      let matchCount = 0
      for (const s of Array.from(neededSkills)) {
        if (studentSkills.has(s)) {
          matchCount++
          data.topSkills.set(s, (data.topSkills.get(s) || 0) + 1)
        }
      }
      if (neededSkills.size > 0 && matchCount / neededSkills.size >= 0.3) {
        data.matchingStudents++
      }

      uniData.set(uni, data)
    }

    // Build ranked list
    const universities = Array.from(uniData.entries())
      .map(([name, data]) => ({
        name,
        studentCount: data.studentCount,
        totalProjects: data.totalProjects,
        verifiedProjects: data.verifiedProjects,
        verificationRate: data.totalProjects > 0 ? Math.round((data.verifiedProjects / data.totalProjects) * 100) : 0,
        matchingStudents: data.matchingStudents,
        matchRate: data.studentCount > 0 ? Math.round((data.matchingStudents / data.studentCount) * 100) : 0,
        topSkills: Array.from(data.topSkills.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([skill, count]) => ({ skill, count })),
        topDisciplines: Array.from(data.disciplines.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([discipline, count]) => ({ discipline, count })),
      }))
      .sort((a, b) => b.matchingStudents - a.matchingStudents)

    return NextResponse.json({
      universities,
      totalUniversities: universities.length,
      neededSkills: Array.from(neededSkills).slice(0, 10),
    })
  } catch (error) {
    console.error('University insights error:', error)
    return NextResponse.json({ universities: [] })
  }
}
