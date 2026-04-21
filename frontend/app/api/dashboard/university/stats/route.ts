import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/university/stats
 * Returns aggregated stats for university dashboard
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'UNIVERSITY' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userId = session.user.id

    // Get the university name from the user's profile
    const universityUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { company: true, firstName: true } // company field stores university name for UNIVERSITY role
    })

    const universityName = universityUser?.company || universityUser?.firstName || ''

    // Scope all profile-view analytics to this institution's students only.
    // Without this, the "Recruiter attivi" widget leaks views from other
    // universities' students into every admin's dashboard.
    const institutionStudents = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        university: { contains: universityName, mode: 'insensitive' },
      },
      select: { id: true },
    })
    const institutionStudentIds = institutionStudents.map(s => s.id)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    // Run queries in parallel
    const [
      totalStudents,
      verifiedStudents,
      studentsWithProjects,
      totalProfileViews,
      recentStudents,
      topRecruiters,
      studentsWithMultipleProjects,
      studentsWithBio,
      studentsWithSkills,
    ] = await Promise.all([
      // Count students from this university
      prisma.user.count({
        where: {
          role: 'STUDENT',
          university: {
            contains: universityName,
            mode: 'insensitive'
          }
        }
      }),

      // Count verified students (those with email verified)
      prisma.user.count({
        where: {
          role: 'STUDENT',
          university: {
            contains: universityName,
            mode: 'insensitive'
          },
          emailVerified: true
        }
      }),

      // Count students with at least one project
      prisma.user.count({
        where: {
          role: 'STUDENT',
          university: {
            contains: universityName,
            mode: 'insensitive'
          },
          projects: {
            some: {}
          }
        }
      }),

      // Total profile views for students from THIS institution only (30d)
      institutionStudentIds.length > 0
        ? prisma.profileView.count({
            where: {
              profileUserId: { in: institutionStudentIds },
              createdAt: { gte: thirtyDaysAgo },
            },
          })
        : Promise.resolve(0),

      // Recent students from this university
      prisma.user.findMany({
        where: {
          role: 'STUDENT',
          university: {
            contains: universityName,
            mode: 'insensitive'
          }
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          degree: true,
          graduationYear: true,
          emailVerified: true,
          photo: true,
          _count: {
            select: { projects: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),

      // Top recruiters viewing THIS institution's students (30d)
      institutionStudentIds.length > 0
        ? prisma.profileView.groupBy({
            by: ['viewerCompany'],
            where: {
              profileUserId: { in: institutionStudentIds },
              viewerCompany: { not: null },
              createdAt: { gte: thirtyDaysAgo },
            },
            _count: true,
            orderBy: { _count: { viewerCompany: 'desc' } },
            take: 5,
          })
        : Promise.resolve([] as Array<{ viewerCompany: string | null; _count: number }>),

      // Students with 2+ projects (engaged students)
      prisma.user.count({
        where: {
          role: 'STUDENT',
          university: { contains: universityName, mode: 'insensitive' },
          projects: { some: {} },
        },
      }).then(async (withProjects) => {
        // Count those with multiple projects via raw aggregation
        const multiProject = await prisma.user.findMany({
          where: {
            role: 'STUDENT',
            university: { contains: universityName, mode: 'insensitive' },
          },
          select: { _count: { select: { projects: true } } },
        })
        return multiProject.filter(u => u._count.projects >= 2).length
      }),

      // Students with a bio/summary
      prisma.user.count({
        where: {
          role: 'STUDENT',
          university: { contains: universityName, mode: 'insensitive' },
          bio: { not: null },
          NOT: { bio: '' },
        },
      }),

      // Students with skills listed
      prisma.user.count({
        where: {
          role: 'STUDENT',
          university: { contains: universityName, mode: 'insensitive' },
          skills: { isEmpty: false },
        },
      }),
    ])

    // Format students
    const formattedStudents = recentStudents.map(student => ({
      id: student.id,
      name: `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Anonymous',
      initials: getInitials(student.firstName, student.lastName),
      course: student.degree || 'Course not specified',
      year: student.graduationYear || 'Year not specified',
      projects: student._count.projects,
      verified: student.emailVerified,
      photo: student.photo
    }))

    // Format recruiters
    const formattedRecruiters = topRecruiters
      .filter(r => r.viewerCompany)
      .map(recruiter => ({
        name: recruiter.viewerCompany!,
        views: recruiter._count,
        contacts: Math.floor(recruiter._count * 0.25) // Estimate contacts as 25% of views
      }))

    // Activation metrics
    const activationRate = totalStudents > 0
      ? Math.round((studentsWithProjects / totalStudents) * 100)
      : 0
    const profileCompletionRate = totalStudents > 0
      ? Math.round(((studentsWithBio + studentsWithSkills + studentsWithProjects) / (totalStudents * 3)) * 100)
      : 0

    return NextResponse.json({
      stats: {
        totalStudents,
        verifiedStudents,
        activeProfiles: studentsWithProjects,
        recruiterViews: totalProfileViews,
      },
      activation: {
        activationRate,
        profileCompletionRate,
        withProjects: studentsWithProjects,
        withMultipleProjects: studentsWithMultipleProjects,
        withBio: studentsWithBio,
        withSkills: studentsWithSkills,
      },
      recentStudents: formattedStudents,
      topRecruiters: formattedRecruiters,
    })

  } catch (error) {
    console.error('Error fetching university stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}

function getInitials(firstName?: string | null, lastName?: string | null): string {
  const first = firstName?.[0] || ''
  const last = lastName?.[0] || ''
  return (first + last).toUpperCase() || 'U'
}
