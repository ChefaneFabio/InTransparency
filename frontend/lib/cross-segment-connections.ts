/**
 * Cross-Segment Connection Engine
 *
 * Ties together students, recruiters, universities, and tech parks through
 * AI-powered matching, notifications, and intelligence.
 *
 * This module is the "glue" that makes the platform valuable for all segments.
 */

import prisma from '@/lib/prisma'
import { createNotification, createBulkNotifications } from '@/lib/notifications'
import { buildStudentSkillSet, buildStudentDisciplines, computeJobMatch } from '@/lib/job-matching'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. PROJECT CREATED → Notify matching recruiters
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function onProjectCreated(projectId: string, userId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        title: true, skills: true, tools: true, discipline: true,
        user: { select: { firstName: true, lastName: true, university: true } },
      },
    })
    if (!project) return

    // Find recruiters with active jobs that match this project's skills
    const projectSkills = Array.from(new Set([
      ...project.skills, ...project.tools,
    ])).map(s => s.toLowerCase())

    if (projectSkills.length === 0) return

    const matchingJobs = await prisma.job.findMany({
      where: {
        status: 'ACTIVE',
        isPublic: true,
      },
      select: {
        id: true,
        title: true,
        recruiterId: true,
        requiredSkills: true,
        targetDisciplines: true,
      },
    })

    // Score each job against the project
    const notifiedRecruiters = new Set<string>()

    for (const job of matchingJobs) {
      const jobSkills = job.requiredSkills.map(s => s.toLowerCase())
      const overlap = projectSkills.filter(s => jobSkills.includes(s))
      const matchRatio = jobSkills.length > 0 ? overlap.length / jobSkills.length : 0

      // Notify if >40% skill overlap
      if (matchRatio >= 0.4 && !notifiedRecruiters.has(job.recruiterId)) {
        notifiedRecruiters.add(job.recruiterId)
        await createNotification({
          userId: job.recruiterId,
          type: 'GENERAL',
          title: 'New matching candidate',
          body: `${project.user.firstName || 'A student'}${project.user.university ? ` from ${project.user.university}` : ''} uploaded "${project.title}" with ${overlap.length} matching skills for your "${job.title}" role.`,
          link: `/dashboard/recruiter/candidates`,
          groupKey: `new-talent-${projectId}`,
        })
      }
    }
  } catch (error) {
    console.error('onProjectCreated notification error:', error)
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. JOB POSTED → Notify matching students
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function onJobPosted(jobId: string) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: {
        title: true, companyName: true, requiredSkills: true,
        preferredSkills: true, targetDisciplines: true, location: true,
        jobType: true,
      },
    })
    if (!job) return

    const jobSkills = Array.from(new Set([
      ...job.requiredSkills, ...job.preferredSkills,
    ])).map(s => s.toLowerCase())

    if (jobSkills.length === 0) return

    // Find students with matching skills (from their projects)
    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        jobAlertNotifications: true,
        projects: { some: {} },
      },
      select: {
        id: true,
        projects: {
          select: { skills: true, tools: true, technologies: true, competencies: true, discipline: true },
        },
      },
      take: 500, // Limit to prevent overload
    })

    const matchingStudentIds: string[] = []

    for (const student of students) {
      const studentSkills = buildStudentSkillSet(student.projects)
      const overlap = jobSkills.filter(s => studentSkills.has(s))
      const matchRatio = jobSkills.length > 0 ? overlap.length / jobSkills.length : 0

      if (matchRatio >= 0.3) {
        matchingStudentIds.push(student.id)
      }
    }

    if (matchingStudentIds.length > 0) {
      const jobTypePretty = job.jobType.replace('_', ' ').toLowerCase()
      await createBulkNotifications(
        matchingStudentIds.slice(0, 100), // Cap at 100 notifications
        {
          type: 'GENERAL',
          title: 'New matching job',
          body: `${job.companyName} is looking for a ${job.title} (${jobTypePretty})${job.location ? ` in ${job.location}` : ''}. Your skills match!`,
          link: `/dashboard/student/jobs`,
          groupKey: `new-job-${jobId}`,
        }
      )
    }
  } catch (error) {
    console.error('onJobPosted notification error:', error)
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. HIRING CONFIRMED → Update placement, notify university
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function onHiringConfirmed(studentId: string, recruiterId: string, jobTitle: string, companyName: string) {
  try {
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: { firstName: true, lastName: true, university: true, degree: true },
    })
    if (!student) return

    // Create placement record
    await prisma.placement.create({
      data: {
        studentId,
        companyName,
        jobTitle,
        jobType: 'FULL_TIME',
        status: 'CONFIRMED',
        startDate: new Date(),
        source: 'PLATFORM',
      },
    }).catch(() => {}) // Don't fail if duplicate

    // Notify student
    await createNotification({
      userId: studentId,
      type: 'GENERAL',
      title: 'Hiring confirmed!',
      body: `Congratulations! Your hiring at ${companyName} as ${jobTitle} has been confirmed.`,
      link: `/dashboard/student`,
    })

    // Notify university admin (if student's university has a settings record)
    if (student.university) {
      const uniSettings = await prisma.universitySettings.findFirst({
        where: {
          name: { contains: student.university, mode: 'insensitive' },
          notifyPlacements: true,
        },
        select: { userId: true, name: true },
      })

      if (uniSettings) {
        await createNotification({
          userId: uniSettings.userId,
          type: 'GENERAL',
          title: 'New placement!',
          body: `${student.firstName} ${student.lastName} (${student.degree || 'student'}) was hired by ${companyName} as ${jobTitle}.`,
          link: `/dashboard/university/placements`,
          groupKey: `placement-${studentId}`,
        })
      }
    }
  } catch (error) {
    console.error('onHiringConfirmed error:', error)
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. AI TALENT RECOMMENDATIONS for Recruiters
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface TalentRecommendation {
  studentId: string
  firstName: string | null
  lastName: string | null
  university: string | null
  photo: string | null
  matchScore: number
  matchedSkills: string[]
  projectCount: number
  verified: boolean
}

export async function getTopTalentForRecruiter(recruiterId: string, limit: number = 10): Promise<TalentRecommendation[]> {
  // Get recruiter's active jobs
  const jobs = await prisma.job.findMany({
    where: { recruiterId, status: 'ACTIVE' },
    select: { requiredSkills: true, preferredSkills: true, targetDisciplines: true },
  })

  if (jobs.length === 0) return []

  // Aggregate all required skills across jobs
  const allRequiredSkills = new Set<string>()
  const allPreferredSkills = new Set<string>()
  for (const job of jobs) {
    job.requiredSkills.forEach(s => allRequiredSkills.add(s.toLowerCase()))
    job.preferredSkills.forEach(s => allPreferredSkills.add(s.toLowerCase()))
  }

  // Find students with projects
  const students = await prisma.user.findMany({
    where: {
      role: 'STUDENT',
      profilePublic: true,
      projects: { some: {} },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      university: true,
      photo: true,
      projects: {
        select: { skills: true, tools: true, technologies: true, competencies: true, discipline: true, verificationStatus: true },
      },
    },
    take: 200,
  })

  // Score each student
  const recommendations: TalentRecommendation[] = []

  for (const student of students) {
    const studentSkills = buildStudentSkillSet(student.projects)
    const requiredArr = Array.from(allRequiredSkills)
    const matchedSkills = requiredArr.filter(s => studentSkills.has(s))
    const preferredMatched = Array.from(allPreferredSkills).filter(s => studentSkills.has(s))

    const requiredScore = requiredArr.length > 0 ? matchedSkills.length / requiredArr.length : 0
    const preferredScore = allPreferredSkills.size > 0 ? preferredMatched.length / allPreferredSkills.size : 0
    const matchScore = Math.round((requiredScore * 0.7 + preferredScore * 0.3) * 100)

    if (matchScore >= 30) {
      const hasVerified = student.projects.some(p => p.verificationStatus === 'VERIFIED')
      recommendations.push({
        studentId: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        university: student.university,
        photo: student.photo,
        matchScore,
        matchedSkills,
        projectCount: student.projects.length,
        verified: hasVerified,
      })
    }
  }

  return recommendations
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. AI JOB RECOMMENDATIONS for Students
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface JobRecommendation {
  jobId: string
  title: string
  companyName: string
  location: string | null
  jobType: string
  matchScore: number
  matchedSkills: string[]
  missingSkills: string[]
}

export async function getTopJobsForStudent(studentId: string, limit: number = 10): Promise<JobRecommendation[]> {
  const student = await prisma.user.findUnique({
    where: { id: studentId },
    select: {
      projects: {
        select: { skills: true, tools: true, technologies: true, competencies: true, discipline: true },
      },
    },
  })

  if (!student || student.projects.length === 0) return []

  const studentSkills = buildStudentSkillSet(student.projects)
  const studentDisciplines = buildStudentDisciplines(student.projects)

  const jobs = await prisma.job.findMany({
    where: { status: 'ACTIVE', isPublic: true },
    select: {
      id: true, title: true, companyName: true, location: true, jobType: true,
      requiredSkills: true, preferredSkills: true, targetDisciplines: true,
    },
    take: 100,
  })

  const recommendations: JobRecommendation[] = []

  for (const job of jobs) {
    const jobRequired = job.requiredSkills.map(s => s.toLowerCase())
    const matchedSkills = jobRequired.filter(s => studentSkills.has(s))
    const missingSkills = jobRequired.filter(s => !studentSkills.has(s))

    const requiredScore = jobRequired.length > 0 ? matchedSkills.length / jobRequired.length : 0
    const preferredMatched = job.preferredSkills.filter(s => studentSkills.has(s.toLowerCase()))
    const preferredScore = job.preferredSkills.length > 0 ? preferredMatched.length / job.preferredSkills.length : 0

    const disciplineMatch = job.targetDisciplines.length === 0 ||
      job.targetDisciplines.some(d => studentDisciplines.has(d.toLowerCase()))

    const matchScore = Math.round(
      (requiredScore * 0.6 + preferredScore * 0.25 + (disciplineMatch ? 0.15 : 0)) * 100
    )

    if (matchScore >= 25) {
      recommendations.push({
        jobId: job.id,
        title: job.title,
        companyName: job.companyName,
        location: job.location,
        jobType: job.jobType,
        matchScore,
        matchedSkills,
        missingSkills: missingSkills.slice(0, 5),
      })
    }
  }

  return recommendations
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6. UNIVERSITY SKILL GAP INSIGHTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface SkillGapInsight {
  skill: string
  demandScore: number  // How many jobs require this
  supplyScore: number  // How many students have this
  gapSeverity: 'critical' | 'moderate' | 'low'
  recommendation: string
}

export async function getSkillGapInsights(universityName: string): Promise<SkillGapInsight[]> {
  // Get all students from this university
  const students = await prisma.user.findMany({
    where: { university: { contains: universityName, mode: 'insensitive' }, role: 'STUDENT' },
    select: {
      projects: {
        select: { skills: true, tools: true, technologies: true },
      },
    },
  })

  // Count skills across students
  const studentSkillCounts = new Map<string, number>()
  for (const student of students) {
    const seen = new Set<string>()
    for (const project of student.projects) {
      for (const skill of [...project.skills, ...project.tools, ...project.technologies]) {
        const normalized = skill.toLowerCase()
        if (!seen.has(normalized)) {
          seen.add(normalized)
          studentSkillCounts.set(normalized, (studentSkillCounts.get(normalized) || 0) + 1)
        }
      }
    }
  }

  // Count skills demanded by active jobs
  const jobSkillCounts = new Map<string, number>()
  const jobs = await prisma.job.findMany({
    where: { status: 'ACTIVE', isPublic: true },
    select: { requiredSkills: true },
  })

  for (const job of jobs) {
    for (const skill of job.requiredSkills) {
      const normalized = skill.toLowerCase()
      jobSkillCounts.set(normalized, (jobSkillCounts.get(normalized) || 0) + 1)
    }
  }

  // Compute gaps
  const insights: SkillGapInsight[] = []
  const totalStudents = students.length || 1

  Array.from(jobSkillCounts.entries()).forEach(([skill, demandCount]) => {
    const supplyCount = studentSkillCounts.get(skill) || 0
    const supplyRatio = supplyCount / totalStudents
    const demandScore = demandCount

    let gapSeverity: 'critical' | 'moderate' | 'low' = 'low'
    let recommendation = ''

    if (demandCount >= 5 && supplyRatio < 0.1) {
      gapSeverity = 'critical'
      recommendation = `Only ${Math.round(supplyRatio * 100)}% of students have ${skill} — consider adding it to curriculum. ${demandCount} active jobs require it.`
    } else if (demandCount >= 3 && supplyRatio < 0.25) {
      gapSeverity = 'moderate'
      recommendation = `${skill} is in demand (${demandCount} jobs) but only ${Math.round(supplyRatio * 100)}% of students have it.`
    } else {
      recommendation = `${skill} demand is covered — ${Math.round(supplyRatio * 100)}% of students have it.`
    }

    insights.push({
      skill,
      demandScore,
      supplyScore: supplyCount,
      gapSeverity,
      recommendation,
    })
  })

  return insights
    .sort((a, b) => {
      const severityOrder = { critical: 0, moderate: 1, low: 2 }
      if (severityOrder[a.gapSeverity] !== severityOrder[b.gapSeverity]) {
        return severityOrder[a.gapSeverity] - severityOrder[b.gapSeverity]
      }
      return b.demandScore - a.demandScore
    })
    .slice(0, 20)
}
