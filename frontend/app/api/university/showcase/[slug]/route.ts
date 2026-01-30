import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/university/showcase/[slug] - Get university showcase data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Find university by slug
    const university = await prisma.university.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        domain: true,
        city: true,
        region: true,
        logo: true,
        website: true,
        primaryColor: true,
        studentCount: true,
        verifiedStudentCount: true,
        projectCount: true,
        placementCount: true,
        status: true
      }
    })

    if (!university) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      )
    }

    if (university.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'University not yet verified' },
        { status: 403 }
      )
    }

    // Get featured students (those who claimed profiles and are featured)
    const universityStudents = await prisma.universityStudent.findMany({
      where: {
        universityId: university.id,
        userId: { not: null },
        status: { in: ['CLAIMED', 'VERIFIED'] }
      },
      select: { userId: true }
    })

    const userIds = universityStudents
      .map(s => s.userId)
      .filter((id): id is string => id !== null)

    let featuredStudents: any[] = []
    let topProjects: any[] = []
    let avgScore = 0
    let placementRate = 0

    if (userIds.length > 0) {
      // Get user profiles for featured students
      const users = await prisma.user.findMany({
        where: {
          id: { in: userIds },
          profilePublic: true
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          photo: true,
          tagline: true,
          projects: {
            where: { isPublic: true },
            select: {
              id: true,
              innovationScore: true,
              skills: true
            }
          }
        },
        take: 8
      })

      // Get university student info to check for featured flag
      const studentInfo = await prisma.universityStudent.findMany({
        where: {
          universityId: university.id,
          userId: { in: users.map(u => u.id) }
        },
        select: {
          userId: true,
          program: true
        }
      })

      const studentInfoMap = new Map(studentInfo.map(s => [s.userId, s]))

      featuredStudents = users
        .map(user => {
          const info = studentInfoMap.get(user.id)
          const projectScores = user.projects
            .map(p => p.innovationScore)
            .filter((s): s is number => s !== null)
          const avgStudentScore = projectScores.length > 0
            ? Math.round(projectScores.reduce((a, b) => a + b, 0) / projectScores.length)
            : 0

          // Collect all skills from projects
          const allSkills = user.projects.flatMap(p => p.skills)
          const skillCounts = allSkills.reduce((acc, skill) => {
            acc[skill] = (acc[skill] || 0) + 1
            return acc
          }, {} as Record<string, number>)
          const topSkills = Object.entries(skillCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([skill]) => skill)

          return {
            id: user.id,
            firstName: user.firstName || 'Student',
            lastName: user.lastName || '',
            photo: user.photo,
            tagline: user.tagline,
            program: info?.program || null,
            topSkills,
            projectCount: user.projects.length,
            avgScore: avgStudentScore,
            featured: true
          }
        })
        .sort((a, b) => b.avgScore - a.avgScore)
        .slice(0, 4)

      // Get top projects
      topProjects = await prisma.project.findMany({
        where: {
          userId: { in: userIds },
          isPublic: true,
          innovationScore: { not: null }
        },
        orderBy: { innovationScore: 'desc' },
        take: 6,
        select: {
          id: true,
          title: true,
          discipline: true,
          innovationScore: true,
          imageUrl: true,
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      })

      topProjects = topProjects.map(p => ({
        id: p.id,
        title: p.title,
        discipline: p.discipline,
        innovationScore: p.innovationScore,
        imageUrl: p.imageUrl,
        studentName: `${p.user.firstName || ''} ${p.user.lastName || ''}`.trim() || 'Student'
      }))

      // Calculate average score
      const allScores = await prisma.project.aggregate({
        where: {
          userId: { in: userIds },
          innovationScore: { not: null }
        },
        _avg: { innovationScore: true }
      })
      avgScore = Math.round(allScores._avg.innovationScore || 0)

      // Placeholder placement rate (would need actual tracking)
      placementRate = 85
    }

    return NextResponse.json({
      success: true,
      university,
      featuredStudents,
      topProjects,
      stats: {
        avgScore,
        placementRate,
        topSkills: ['React', 'Python', 'JavaScript', 'SQL', 'Node.js'] // Would be computed
      }
    })

  } catch (error) {
    console.error('Error fetching university showcase:', error)
    return NextResponse.json(
      { error: 'Failed to fetch university data' },
      { status: 500 }
    )
  }
}
