import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/student/journey
 *
 * Aggregate view of a student's academic + career journey — used by
 * the student's "pipeline" dashboard (/dashboard/student/journey).
 *
 * Pulls:
 *   - profile (graduation year, university, degree)
 *   - affiliation (program, enrolled-since date)
 *   - courses (derived from project courseName/courseCode per semester)
 *   - projects (count, verified count, avg innovation score)
 *   - placements (active + completed)
 *   - applications (pipeline by status)
 *   - top skills (from projects)
 */
export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const [user, affiliation, projects, placements, applications] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          university: true,
          degree: true,
          graduationYear: true,
          gpa: true,
          gpaPublic: true,
          skills: true,
          jobSearchStatus: true,
          availabilityFrom: true,
          createdAt: true,
        },
      }),
      prisma.institutionAffiliation.findFirst({
        where: { studentId: userId, status: 'ACTIVE' },
        include: {
          institution: {
            select: { id: true, name: true, type: true, city: true },
          },
        },
        orderBy: { startDate: 'desc' },
      }),
      prisma.project.findMany({
        where: { userId },
        select: {
          id: true,
          title: true,
          description: true,
          discipline: true,
          skills: true,
          technologies: true,
          courseName: true,
          courseCode: true,
          semester: true,
          academicYear: true,
          grade: true,
          professor: true,
          verificationStatus: true,
          innovationScore: true,
          isPublic: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.placement.findMany({
        where: { studentId: userId },
        select: {
          id: true,
          jobTitle: true,
          companyName: true,
          companyIndustry: true,
          offerType: true,
          status: true,
          outcome: true,
          startDate: true,
          endDate: true,
          plannedHours: true,
          completedHours: true,
          currentStage: { select: { name: true, order: true, type: true } },
        },
        orderBy: { startDate: 'desc' },
      }),
      prisma.application.findMany({
        where: { applicantId: userId },
        select: {
          id: true,
          status: true,
          createdAt: true,
          job: {
            select: {
              id: true,
              title: true,
              companyName: true,
              location: true,
              jobType: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ])

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // ── Derive courses from projects ────────────────────────────────────
    type Course = {
      courseName: string
      courseCode: string | null
      semester: string | null
      academicYear: string | null
      projectCount: number
      verifiedProjectCount: number
      grade: string | null
      professor: string | null
    }
    const courseMap = new Map<string, Course>()
    for (const p of projects) {
      if (!p.courseName) continue
      const key = `${p.courseName}|${p.courseCode ?? ''}|${p.semester ?? ''}`
      const existing = courseMap.get(key)
      if (existing) {
        existing.projectCount += 1
        if (p.verificationStatus === 'VERIFIED') existing.verifiedProjectCount += 1
        if (!existing.grade && p.grade) existing.grade = p.grade
      } else {
        courseMap.set(key, {
          courseName: p.courseName,
          courseCode: p.courseCode,
          semester: p.semester,
          academicYear: p.academicYear,
          projectCount: 1,
          verifiedProjectCount: p.verificationStatus === 'VERIFIED' ? 1 : 0,
          grade: p.grade,
          professor: p.professor,
        })
      }
    }
    const courses = Array.from(courseMap.values()).sort((a, b) => {
      const aYear = a.academicYear || ''
      const bYear = b.academicYear || ''
      return bYear.localeCompare(aYear)
    })

    // ── Project stats ───────────────────────────────────────────────────
    const verifiedProjects = projects.filter(p => p.verificationStatus === 'VERIFIED')
    const innovationScores = verifiedProjects
      .map(p => p.innovationScore)
      .filter((s): s is number => s !== null)
    const avgInnovationScore =
      innovationScores.length > 0
        ? Math.round(innovationScores.reduce((a, b) => a + b, 0) / innovationScores.length)
        : null
    const topInnovationScore = innovationScores.length > 0 ? Math.max(...innovationScores) : null

    // ── Placements ──────────────────────────────────────────────────────
    const activePlacement = placements.find(
      p =>
        !p.outcome &&
        p.status !== 'DECLINED' &&
        (!p.endDate || new Date(p.endDate) > new Date()),
    )
    const completedPlacements = placements.filter(p => !!p.outcome)

    // ── Applications by status ──────────────────────────────────────────
    const appsByStatus: Record<string, number> = {}
    for (const a of applications) {
      appsByStatus[a.status] = (appsByStatus[a.status] || 0) + 1
    }

    // ── Graduation progress ─────────────────────────────────────────────
    let graduationProgress: {
      enrolledDate: string | null
      graduationYear: number | null
      yearsEnrolled: number
      percentComplete: number | null
      monthsToGraduation: number | null
    } = {
      enrolledDate: affiliation?.startDate.toISOString() ?? user.createdAt.toISOString(),
      graduationYear: user.graduationYear ? parseInt(user.graduationYear, 10) : null,
      yearsEnrolled: 0,
      percentComplete: null,
      monthsToGraduation: null,
    }
    if (graduationProgress.enrolledDate && graduationProgress.graduationYear) {
      const enrolledAt = new Date(graduationProgress.enrolledDate)
      const gradAt = new Date(graduationProgress.graduationYear, 6, 15) // mid-July
      const now = Date.now()
      const totalMs = gradAt.getTime() - enrolledAt.getTime()
      const elapsedMs = now - enrolledAt.getTime()
      graduationProgress.yearsEnrolled = Math.max(
        0,
        Math.floor(elapsedMs / (365.25 * 86_400_000)),
      )
      graduationProgress.percentComplete =
        totalMs > 0
          ? Math.min(100, Math.max(0, Math.round((elapsedMs / totalMs) * 100)))
          : null
      graduationProgress.monthsToGraduation = Math.max(
        0,
        Math.round((gradAt.getTime() - now) / (30.44 * 86_400_000)),
      )
    }

    // ── Top skills (counted across projects) ────────────────────────────
    const skillCounts = new Map<string, number>()
    for (const p of projects) {
      for (const s of p.skills || []) {
        skillCounts.set(s, (skillCounts.get(s) || 0) + 1)
      }
    }
    const topSkills = Array.from(skillCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([skill, count]) => ({ skill, count }))

    // ── Milestones — ordered checkable list ─────────────────────────────
    const milestones = [
      {
        key: 'enrolled',
        label: 'Iscritto al corso',
        done: !!affiliation,
        date: affiliation?.startDate ?? user.createdAt,
      },
      {
        key: 'firstProject',
        label: 'Primo progetto pubblicato',
        done: projects.length > 0,
        date: projects[projects.length - 1]?.createdAt ?? null,
      },
      {
        key: 'firstVerified',
        label: 'Primo progetto verificato',
        done: verifiedProjects.length > 0,
        date: verifiedProjects[verifiedProjects.length - 1]?.createdAt ?? null,
      },
      {
        key: 'firstApplication',
        label: 'Prima candidatura',
        done: applications.length > 0,
        date: applications[applications.length - 1]?.createdAt ?? null,
      },
      {
        key: 'firstInterview',
        label: 'Primo colloquio',
        done: appsByStatus.INTERVIEW > 0 || appsByStatus.SHORTLISTED > 0,
        date: null,
      },
      {
        key: 'placement',
        label: 'Tirocinio attivo',
        done: !!activePlacement,
        date: activePlacement?.startDate ?? null,
      },
      {
        key: 'graduation',
        label: 'Laurea',
        done: false,
        date: graduationProgress.graduationYear
          ? new Date(graduationProgress.graduationYear, 6, 15)
          : null,
      },
    ]

    return NextResponse.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        university: user.university,
        degree: user.degree,
        graduationYear: user.graduationYear,
        gpa: user.gpaPublic ? user.gpa : null,
        jobSearchStatus: user.jobSearchStatus,
      },
      affiliation: affiliation
        ? {
            program: affiliation.program,
            status: affiliation.status,
            startDate: affiliation.startDate,
            institution: affiliation.institution,
          }
        : null,
      graduationProgress,
      courses,
      projects: {
        total: projects.length,
        verified: verifiedProjects.length,
        avgInnovationScore,
        topInnovationScore,
        recent: projects.slice(0, 6).map(p => ({
          id: p.id,
          title: p.title,
          discipline: p.discipline,
          verified: p.verificationStatus === 'VERIFIED',
          innovationScore: p.innovationScore,
          courseName: p.courseName,
          grade: p.grade,
        })),
      },
      placements: {
        active: activePlacement
          ? {
              id: activePlacement.id,
              jobTitle: activePlacement.jobTitle,
              companyName: activePlacement.companyName,
              offerType: activePlacement.offerType,
              stage: activePlacement.currentStage?.name ?? null,
              plannedHours: activePlacement.plannedHours,
              completedHours: activePlacement.completedHours,
              progressPct: activePlacement.plannedHours
                ? Math.min(
                    100,
                    Math.round(
                      ((activePlacement.completedHours ?? 0) /
                        activePlacement.plannedHours) *
                        100,
                    ),
                  )
                : null,
              startDate: activePlacement.startDate,
              endDate: activePlacement.endDate,
            }
          : null,
        completed: completedPlacements.length,
        total: placements.length,
      },
      applications: {
        total: applications.length,
        byStatus: appsByStatus,
        recent: applications.slice(0, 5).map(a => ({
          id: a.id,
          status: a.status,
          jobTitle: a.job?.title,
          companyName: a.job?.companyName,
          createdAt: a.createdAt,
        })),
      },
      topSkills,
      milestones,
    })
  } catch (error: any) {
    console.error('Student journey error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to load journey' },
      { status: 500 }
    )
  }
}
