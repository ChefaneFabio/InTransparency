import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const university = searchParams.get('university') || ''
    const year = searchParams.get('year') || ''
    const skill = searchParams.get('skill') || ''

    // Build where clause for filtering
    const whereClause: any = {
      role: 'STUDENT',
      profilePublic: true,
    }

    // Search filter (name or username)
    if (search) {
      whereClause.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
      ]
    }

    // University filter
    if (university) {
      whereClause.university = { contains: university, mode: 'insensitive' }
    }

    // Graduation year filter
    if (year) {
      whereClause.graduationYear = year
    }

    // Fetch students with public profiles
    const students = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        photo: true,
        university: true,
        degree: true,
        graduationYear: true,
        subscriptionTier: true,
        projects: {
          where: { isPublic: true },
          select: {
            id: true,
            skills: true,
            technologies: true,
            universityVerified: true,
            endorsements: {
              select: { id: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit results
    })

    // Sort STUDENT_PREMIUM users first for priority in search results
    students.sort((a: any, b: any) => {
      const aPremium = a.subscriptionTier === 'STUDENT_PREMIUM' ? 1 : 0
      const bPremium = b.subscriptionTier === 'STUDENT_PREMIUM' ? 1 : 0
      if (bPremium !== aPremium) return bPremium - aPremium
      return 0 // preserve existing order for same tier
    })

    // Process students to calculate stats and filter by skills
    const processedStudents = students
      .map(student => {
        // Calculate projects count
        const projectsCount = student.projects.length

        // Calculate verified projects
        const verifiedProjectsCount = student.projects.filter(
          p => p.universityVerified || (p.endorsements && p.endorsements.length > 0)
        ).length

        // Calculate verification score
        const verificationScore = projectsCount > 0
          ? Math.round((verifiedProjectsCount / projectsCount) * 100)
          : 0

        // Aggregate unique skills
        const allSkills = new Set<string>()
        student.projects.forEach(project => {
          if (project.skills && Array.isArray(project.skills)) {
            project.skills.forEach((s: string) => allSkills.add(s))
          }
          if (project.technologies && Array.isArray(project.technologies)) {
            project.technologies.forEach((t: string) => allSkills.add(t))
          }
        })
        const skillsArray = Array.from(allSkills)
        const skillsCount = skillsArray.length

        return {
          id: student.id,
          username: student.username || student.id,
          firstName: student.firstName || '',
          lastName: student.lastName || '',
          photo: student.photo,
          university: student.university || '',
          degree: student.degree || '',
          graduationYear: student.graduationYear ? parseInt(student.graduationYear) : new Date().getFullYear(),
          projectsCount,
          verificationScore,
          skillsCount,
          topSkills: skillsArray.slice(0, 5),
        }
      })
      // Filter by skill if provided
      .filter(student => {
        if (!skill) return true
        return student.topSkills.some(s =>
          s.toLowerCase().includes(skill.toLowerCase())
        )
      })

    return NextResponse.json({
      students: processedStudents,
      total: processedStudents.length
    })
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
