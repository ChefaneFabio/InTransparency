import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/university/scorecard
 * Institutional health scorecard — grades across key dimensions
 * with platform benchmarks and actionable recommendations.
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
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // ── Get student IDs first ───────────────────────────────────
    const students = await prisma.user.findMany({
      where: { university: universityName, role: 'STUDENT' },
      select: { id: true },
    })
    const studentIds = students.map(s => s.id)

    // ── Gather metrics ──────────────────────────────────────────
    const studentWhere = { university: universityName, role: 'STUDENT' as const }
    const [
      totalStudents,
      verifiedStudents,
      activeStudents,
      studentsWithProjects,
      studentsWithBio,
      studentsWithSkills,
      totalProjects,
      verifiedProjects,
      totalCourses,
      profileViews,
      recentViews,
      contacts,
      placements,
      alumniRecords,
      employedAlumni,
      platformTotalStudents,
      platformViews,
    ] = await Promise.all([
      Promise.resolve(studentIds.length),
      prisma.user.count({ where: { ...studentWhere, emailVerified: true } }),
      prisma.user.count({ where: { ...studentWhere, lastLoginAt: { gte: thirtyDaysAgo } } }),
      prisma.user.count({ where: { ...studentWhere, projects: { some: {} } } }),
      prisma.user.count({ where: { ...studentWhere, bio: { not: null } } }),
      prisma.user.count({ where: { ...studentWhere, skills: { isEmpty: false } } }),
      prisma.project.count({ where: { userId: { in: studentIds } } }),
      prisma.project.count({ where: { userId: { in: studentIds }, verificationStatus: 'VERIFIED' } }),
      prisma.course.count({ where: { university: universityName } }),
      studentIds.length > 0
        ? prisma.profileView.count({ where: { profileUserId: { in: studentIds }, viewerRole: 'RECRUITER' } })
        : Promise.resolve(0),
      studentIds.length > 0
        ? prisma.profileView.count({ where: { profileUserId: { in: studentIds }, viewerRole: 'RECRUITER', createdAt: { gte: thirtyDaysAgo } } })
        : Promise.resolve(0),
      studentIds.length > 0
        ? prisma.contactUsage.count({ where: { recipientId: { in: studentIds } } })
        : Promise.resolve(0),
      prisma.placement.count({ where: { universityName, status: 'CONFIRMED' } }),
      prisma.alumniRecord.count({ where: { universityName } }),
      prisma.alumniRecord.count({ where: { universityName, employmentStatus: 'EMPLOYED' } }),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.profileView.count({ where: { viewerRole: 'RECRUITER' } }),
    ])

    // Get distinct companies viewing students
    const viewingCompanies = studentIds.length > 0
      ? await prisma.profileView.findMany({
          where: { profileUserId: { in: studentIds }, viewerRole: 'RECRUITER', viewerCompany: { not: null } },
          select: { viewerCompany: true },
          distinct: ['viewerCompany'],
        })
      : []

    // ── Compute scores (0-100) ──────────────────────────────────
    const safe = (n: number, d: number) => d > 0 ? Math.round((n / d) * 100) : 0

    // 1. Student Activation — how actively students use the platform
    const activationRate = safe(activeStudents, totalStudents)
    const profileCompleteness = totalStudents > 0
      ? Math.round(((safe(studentsWithBio, totalStudents) + safe(studentsWithSkills, totalStudents)) / 2))
      : 0
    const projectParticipation = safe(studentsWithProjects, totalStudents)
    const studentActivationScore = Math.round((activationRate * 0.4 + profileCompleteness * 0.3 + projectParticipation * 0.3))

    // 2. Employer Visibility — how visible students are to recruiters
    const viewsPerStudent = totalStudents > 0 ? profileViews / totalStudents : 0
    const platformAvgViews = platformTotalStudents > 0 ? platformViews / platformTotalStudents : 0
    const viewsVsPlatform = platformAvgViews > 0 ? Math.min(100, Math.round((viewsPerStudent / platformAvgViews) * 50)) : 50
    const companyReach = Math.min(100, viewingCompanies.length * 5) // 20 companies = 100
    const contactRate = totalStudents > 0 ? Math.min(100, Math.round((contacts / totalStudents) * 100)) : 0
    const employerVisibilityScore = Math.round((viewsVsPlatform * 0.4 + companyReach * 0.3 + contactRate * 0.3))

    // 3. Placement Performance
    const placementRate = safe(placements, totalStudents)
    const employmentRate = alumniRecords > 0 ? safe(employedAlumni, alumniRecords) : 0
    const placementScore = alumniRecords > 0
      ? Math.round((placementRate * 0.5 + employmentRate * 0.5))
      : Math.min(100, placementRate * 2) // amplify if no alumni data

    // 4. Academic Quality — projects, courses, verification
    const verificationRate = safe(verifiedProjects, totalProjects)
    const courseRichness = Math.min(100, totalCourses * 10) // 10 courses = 100
    const projectDensity = totalStudents > 0 ? Math.min(100, Math.round((totalProjects / totalStudents) * 50)) : 0
    const academicScore = Math.round((verificationRate * 0.4 + courseRichness * 0.3 + projectDensity * 0.3))

    // 5. Data Completeness — how well the institution uses the platform
    const hasAlumni = alumniRecords > 0 ? 100 : 0
    const hasCourses = totalCourses > 0 ? 100 : 0
    const verifiedRate = safe(verifiedStudents, totalStudents)
    const dataScore = Math.round((verifiedRate * 0.3 + hasAlumni * 0.2 + hasCourses * 0.2 + profileCompleteness * 0.3))

    // Overall
    const overallScore = Math.round(
      (studentActivationScore * 0.25 +
        employerVisibilityScore * 0.25 +
        placementScore * 0.2 +
        academicScore * 0.15 +
        dataScore * 0.15)
    )

    const toGrade = (score: number): string => {
      if (score >= 90) return 'A'
      if (score >= 75) return 'B'
      if (score >= 60) return 'C'
      if (score >= 40) return 'D'
      return 'F'
    }

    // ── Build recommendations ───────────────────────────────────
    const recommendations: Array<{ priority: 'high' | 'medium' | 'low'; area: string; titleKey: string; descriptionKey: string; metric: string }> = []

    if (activationRate < 30) {
      recommendations.push({ priority: 'high', area: 'activation', titleKey: 'rec.lowActivation', descriptionKey: 'rec.lowActivationDesc', metric: `${activationRate}%` })
    }
    if (profileCompleteness < 40) {
      recommendations.push({ priority: 'high', area: 'profiles', titleKey: 'rec.incompleteProfiles', descriptionKey: 'rec.incompleteProfilesDesc', metric: `${profileCompleteness}%` })
    }
    if (projectParticipation < 20) {
      recommendations.push({ priority: 'high', area: 'projects', titleKey: 'rec.lowProjects', descriptionKey: 'rec.lowProjectsDesc', metric: `${projectParticipation}%` })
    }
    if (viewingCompanies.length < 5) {
      recommendations.push({ priority: 'medium', area: 'visibility', titleKey: 'rec.lowVisibility', descriptionKey: 'rec.lowVisibilityDesc', metric: `${viewingCompanies.length}` })
    }
    if (alumniRecords === 0) {
      recommendations.push({ priority: 'medium', area: 'alumni', titleKey: 'rec.noAlumni', descriptionKey: 'rec.noAlumniDesc', metric: '0' })
    }
    if (totalCourses === 0) {
      recommendations.push({ priority: 'medium', area: 'courses', titleKey: 'rec.noCourses', descriptionKey: 'rec.noCoursesDesc', metric: '0' })
    }
    if (verificationRate < 50 && totalProjects > 0) {
      recommendations.push({ priority: 'low', area: 'verification', titleKey: 'rec.lowVerification', descriptionKey: 'rec.lowVerificationDesc', metric: `${verificationRate}%` })
    }
    if (contactRate < 10) {
      recommendations.push({ priority: 'medium', area: 'engagement', titleKey: 'rec.lowContacts', descriptionKey: 'rec.lowContactsDesc', metric: `${contactRate}%` })
    }

    return NextResponse.json({
      overall: { score: overallScore, grade: toGrade(overallScore) },
      dimensions: [
        {
          key: 'studentActivation',
          score: studentActivationScore,
          grade: toGrade(studentActivationScore),
          metrics: { activationRate, profileCompleteness, projectParticipation },
        },
        {
          key: 'employerVisibility',
          score: employerVisibilityScore,
          grade: toGrade(employerVisibilityScore),
          metrics: { viewsPerStudent: Math.round(viewsPerStudent * 10) / 10, companies: viewingCompanies.length, contactRate },
        },
        {
          key: 'placementPerformance',
          score: placementScore,
          grade: toGrade(placementScore),
          metrics: { placementRate, employmentRate, totalPlacements: placements },
        },
        {
          key: 'academicQuality',
          score: academicScore,
          grade: toGrade(academicScore),
          metrics: { verificationRate, totalCourses, projectDensity },
        },
        {
          key: 'dataCompleteness',
          score: dataScore,
          grade: toGrade(dataScore),
          metrics: { verifiedRate, hasAlumni: alumniRecords > 0, hasCourses: totalCourses > 0 },
        },
      ],
      recommendations,
      raw: {
        totalStudents,
        verifiedStudents,
        activeStudents,
        studentsWithProjects,
        totalProjects,
        verifiedProjects,
        totalCourses,
        profileViews,
        recentViews,
        contacts,
        placements,
        alumniRecords,
        employedAlumni,
        companies: viewingCompanies.length,
      },
    })
  } catch (error) {
    console.error('Scorecard error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
