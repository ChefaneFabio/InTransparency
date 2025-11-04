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
            skills: true,
            technologies: true,
            videos: true,
            githubUrl: true,
            liveUrl: true,
            grade: true,
            createdAt: true,
            universityVerified: true,
            professor: true,
            endorsements: {
              select: {
                id: true,
                professorName: true,
                professorTitle: true,
                endorsementText: true,
                createdAt: true
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
      (p) => p.universityVerified || (p.endorsements && p.endorsements.length > 0)
    ).length
    const verificationScore = projectsCount > 0
      ? Math.round((verifiedProjectsCount / projectsCount) * 100)
      : 0

    // Aggregate unique skills from all projects
    const allSkills = new Set<string>()
    user.projects.forEach(project => {
      if (project.skills && Array.isArray(project.skills)) {
        project.skills.forEach(skill => allSkills.add(skill))
      }
      if (project.technologies && Array.isArray(project.technologies)) {
        project.technologies.forEach(tech => allSkills.add(tech))
      }
    })
    const skillsCount = allSkills.size

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
