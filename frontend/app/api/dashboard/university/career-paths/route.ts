import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/university/career-paths
 * Per-program career pathway mapping: transferable skills, matching
 * industries, and companies — framed as opportunity, not blame.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = user.company || ''

    // Get all students grouped by degree
    const students = await prisma.user.findMany({
      where: { university: universityName, role: 'STUDENT' },
      select: {
        id: true,
        degree: true,
        skills: true,
        projects: {
          where: { isPublic: true },
          select: { skills: true, discipline: true, verificationStatus: true },
        },
      },
    })

    // Get all active jobs on the platform to map demand
    const jobs = await prisma.job.findMany({
      where: { status: 'ACTIVE', isPublic: true },
      select: {
        title: true,
        companyName: true,
        companyIndustry: true,
        requiredSkills: true,
        preferredSkills: true,
        jobType: true,
        location: true,
      },
    })

    // Get placements from this university
    const placements = await prisma.placement.findMany({
      where: { universityName },
      select: {
        studentId: true,
        companyName: true,
        companyIndustry: true,
        jobTitle: true,
      },
    })

    // Get alumni outcomes
    const alumni = await prisma.alumniRecord.findMany({
      where: { universityName },
      select: {
        degree: true,
        currentCompany: true,
        currentRole: true,
        currentIndustry: true,
        employmentStatus: true,
      },
    })

    // Build student-placement map
    const studentDegreeMap = new Map(students.map(s => [s.id, s.degree]))

    // Group by degree program
    const degrees = Array.from(new Set(students.map(s => s.degree).filter(Boolean))) as string[]

    const programs = degrees.map(degree => {
      const programStudents = students.filter(s => s.degree === degree)
      const studentIds = programStudents.map(s => s.id)

      // Collect all skills from students and their projects
      const skillCounts: Record<string, number> = {}
      for (const s of programStudents) {
        for (const skill of s.skills) {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1
        }
        for (const p of s.projects) {
          for (const skill of p.skills) {
            skillCounts[skill] = (skillCounts[skill] || 0) + 1
          }
        }
      }

      const topSkills = Object.entries(skillCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 12)
        .map(([skill, count]) => ({ skill, studentsWithSkill: count }))

      // Which jobs match these skills?
      const allProgramSkills = Object.keys(skillCounts)
      const matchingJobs = jobs.filter(job => {
        const jobSkills = [...job.requiredSkills, ...job.preferredSkills]
        const overlap = jobSkills.filter(js =>
          allProgramSkills.some(ps => ps.toLowerCase().includes(js.toLowerCase()) || js.toLowerCase().includes(ps.toLowerCase()))
        )
        return overlap.length >= 2
      })

      // Industries from matching jobs
      const industryCounts: Record<string, number> = {}
      for (const job of matchingJobs) {
        const industry = job.companyIndustry || 'Other'
        industryCounts[industry] = (industryCounts[industry] || 0) + 1
      }
      const matchingIndustries = Object.entries(industryCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6)
        .map(([industry, jobCount]) => ({ industry, jobCount }))

      // Companies from matching jobs
      const companyCounts: Record<string, number> = {}
      for (const job of matchingJobs) {
        companyCounts[job.companyName] = (companyCounts[job.companyName] || 0) + 1
      }
      const matchingCompanies = Object.entries(companyCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8)
        .map(([company]) => company)

      // Placements from this program
      const programPlacements = placements.filter(p => studentIds.includes(p.studentId))
      const placementRoles: Record<string, number> = {}
      const placementIndustries: Record<string, number> = {}
      for (const p of programPlacements) {
        if (p.jobTitle) placementRoles[p.jobTitle] = (placementRoles[p.jobTitle] || 0) + 1
        if (p.companyIndustry) placementIndustries[p.companyIndustry] = (placementIndustries[p.companyIndustry] || 0) + 1
      }

      // Alumni from this program
      const programAlumni = alumni.filter(a => a.degree === degree)
      const alumniRoles: Record<string, number> = {}
      const alumniIndustries: Record<string, number> = {}
      for (const a of programAlumni) {
        if (a.currentRole) alumniRoles[a.currentRole] = (alumniRoles[a.currentRole] || 0) + 1
        if (a.currentIndustry) alumniIndustries[a.currentIndustry] = (alumniIndustries[a.currentIndustry] || 0) + 1
      }

      // Career paths: combine placement roles + alumni roles + matching job titles
      const careerPathCounts: Record<string, number> = {}
      for (const [role, count] of Object.entries(placementRoles)) careerPathCounts[role] = (careerPathCounts[role] || 0) + count * 3
      for (const [role, count] of Object.entries(alumniRoles)) careerPathCounts[role] = (careerPathCounts[role] || 0) + count * 2
      const jobTitleCounts: Record<string, number> = {}
      for (const job of matchingJobs) jobTitleCounts[job.title] = (jobTitleCounts[job.title] || 0) + 1
      for (const [title, count] of Object.entries(jobTitleCounts)) careerPathCounts[title] = (careerPathCounts[title] || 0) + count

      const careerPaths = Object.entries(careerPathCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8)
        .map(([role, weight]) => ({ role, weight }))

      // Skill transferability score: how many industries value these skills
      const skillTransferability = topSkills.map(s => {
        const industriesUsingSkill = new Set<string>()
        for (const job of jobs) {
          if ([...job.requiredSkills, ...job.preferredSkills].some(js => js.toLowerCase().includes(s.skill.toLowerCase()))) {
            industriesUsingSkill.add(job.companyIndustry || 'Other')
          }
        }
        return { ...s, industriesCount: industriesUsingSkill.size }
      }).sort((a, b) => b.industriesCount - a.industriesCount)

      // Market demand: how many open jobs want skills from this program
      const demandScore = Math.min(100, Math.round((matchingJobs.length / Math.max(jobs.length, 1)) * 200))

      return {
        degree,
        studentCount: programStudents.length,
        topSkills: skillTransferability,
        matchingJobs: matchingJobs.length,
        matchingIndustries,
        matchingCompanies,
        careerPaths,
        demandScore,
        placementCount: programPlacements.length,
        alumniCount: programAlumni.length,
        verifiedProjects: programStudents.reduce((sum, s) => sum + s.projects.filter(p => p.verificationStatus === 'VERIFIED').length, 0),
      }
    })

    // Sort by student count (largest programs first)
    programs.sort((a, b) => b.studentCount - a.studentCount)

    return NextResponse.json({
      programs,
      totalStudents: students.length,
      totalJobs: jobs.length,
      totalDegrees: degrees.length,
    })
  } catch (error) {
    console.error('Career paths error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
