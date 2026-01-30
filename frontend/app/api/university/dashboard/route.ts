import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/university/dashboard - Get university dashboard data
export async function GET(request: NextRequest) {
  try {
    // Get university from API key or session
    const apiKey = request.headers.get('x-api-key')
    const universityId = request.headers.get('x-university-id')

    let university

    if (apiKey) {
      university = await prisma.university.findUnique({
        where: { apiKey }
      })
    } else if (universityId) {
      university = await prisma.university.findUnique({
        where: { id: universityId }
      })
    }

    if (!university) {
      return NextResponse.json(
        { error: 'University not authenticated' },
        { status: 401 }
      )
    }

    // Get student stats
    const studentStats = await prisma.universityStudent.groupBy({
      by: ['status'],
      where: { universityId: university.id },
      _count: { status: true }
    })

    const statusCounts = studentStats.reduce((acc, s) => {
      acc[s.status] = s._count.status
      return acc
    }, {} as Record<string, number>)

    const totalStudents = Object.values(statusCounts).reduce((a, b) => a + b, 0)
    const claimedStudents = (statusCounts['CLAIMED'] || 0) + (statusCounts['VERIFIED'] || 0)
    const verifiedStudents = statusCounts['VERIFIED'] || 0

    // Get students who have claimed profiles
    const claimedStudentUserIds = await prisma.universityStudent.findMany({
      where: {
        universityId: university.id,
        userId: { not: null }
      },
      select: { userId: true }
    })

    const userIds = claimedStudentUserIds
      .map(s => s.userId)
      .filter((id): id is string => id !== null)

    // Get project stats for these students
    let projectCount = 0
    let verifiedProjectCount = 0
    let avgInnovationScore = 0
    let topProjects: any[] = []

    if (userIds.length > 0) {
      const projectStats = await prisma.project.aggregate({
        where: { userId: { in: userIds } },
        _count: { id: true },
        _avg: { innovationScore: true }
      })

      projectCount = projectStats._count.id
      avgInnovationScore = Math.round(projectStats._avg.innovationScore || 0)

      verifiedProjectCount = await prisma.project.count({
        where: {
          userId: { in: userIds },
          universityVerified: true
        }
      })

      // Get top projects
      topProjects = await prisma.project.findMany({
        where: { userId: { in: userIds } },
        orderBy: { innovationScore: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          discipline: true,
          innovationScore: true,
          complexityScore: true,
          views: true,
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      })
    }

    // Get program distribution
    const programStats = await prisma.universityStudent.groupBy({
      by: ['program'],
      where: {
        universityId: university.id,
        program: { not: null }
      },
      _count: { program: true },
      orderBy: { _count: { program: 'desc' } },
      take: 10
    })

    const programDistribution = programStats
      .filter(p => p.program)
      .map(p => ({
        program: p.program,
        count: p._count.program,
        percentage: Math.round((p._count.program / totalStudents) * 100)
      }))

    // Get recent activity
    const recentClaims = await prisma.universityStudent.findMany({
      where: {
        universityId: university.id,
        claimedAt: { not: null }
      },
      orderBy: { claimedAt: 'desc' },
      take: 10,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        program: true,
        claimedAt: true
      }
    })

    // Calculate profile completion rate
    const profileCompletionRate = totalStudents > 0
      ? Math.round((claimedStudents / totalStudents) * 100)
      : 0

    return NextResponse.json({
      success: true,
      university: {
        id: university.id,
        name: university.name,
        domain: university.domain,
        type: university.type,
        status: university.status,
        city: university.city,
        logo: university.logo
      },
      stats: {
        students: {
          total: totalStudents,
          imported: statusCounts['IMPORTED'] || 0,
          invited: statusCounts['INVITED'] || 0,
          claimed: claimedStudents,
          verified: verifiedStudents,
          profileCompletionRate
        },
        projects: {
          total: projectCount,
          verified: verifiedProjectCount,
          avgInnovationScore
        },
        engagement: {
          // Placeholder - would track recruiter views, messages, etc.
          recruiterViews: 0,
          messagesReceived: 0,
          placements: 0
        }
      },
      programDistribution,
      topProjects,
      recentActivity: {
        recentClaims
      }
    })

  } catch (error) {
    console.error('Error fetching dashboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
