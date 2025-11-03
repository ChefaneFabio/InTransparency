import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        photo: true,
        bio: true,
        university: true,
        degree: true,
        graduationYear: true,
        profilePublic: true,
        skills: true,
        linkedinUrl: true,
        githubUrl: true,
        portfolioUrl: true,
        projects: {
          where: {
            isPublic: true
          },
          select: {
            id: true,
            title: true,
            description: true,
            courseCode: true,
            courseName: true,
            category: true,
            technologies: true,
            videos: true,
            githubUrl: true,
            liveUrl: true,
            grade: true,
            createdAt: true,
            verifications: {
              select: {
                id: true,
                type: true,
                status: true,
                verifiedAt: true,
                verifierName: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if profile is public
    if (!user.profilePublic) {
      return NextResponse.json(
        { error: 'This portfolio is private' },
        { status: 403 }
      )
    }

    // Calculate stats
    const projectsCount = user.projects.length
    const verifiedProjectsCount = user.projects.filter(
      (p) => p.verifications && p.verifications.length > 0
    ).length
    const verificationScore = projectsCount > 0
      ? Math.round((verifiedProjectsCount / projectsCount) * 100)
      : 0

    const skillsCount = user.skills ? (user.skills as any[]).length : 0

    // Remove sensitive data
    const { email, ...publicUserData } = user

    return NextResponse.json({
      ...publicUserData,
      stats: {
        projectsCount,
        verifiedProjectsCount,
        verificationScore,
        skillsCount
      }
    })
  } catch (error) {
    console.error('Error fetching public portfolio:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
