import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/recruiter/search/by-course
 * Search students by course data: courseCategory (department), minGrade, institutionType
 * Returns students grouped by institution/course.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const courseCategory = searchParams.get('courseCategory') || ''
    const minGrade = searchParams.get('minGrade') || ''
    const institutionType = searchParams.get('institutionType') || ''
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))

    // Build Course where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const courseWhere: any = {}

    // courseCategory maps to Course.department
    if (courseCategory) {
      courseWhere.department = { contains: courseCategory, mode: 'insensitive' }
    }

    // institutionType filters by university name pattern
    if (institutionType) {
      courseWhere.university = { contains: institutionType, mode: 'insensitive' }
    }

    // Find courses matching filters, and include their projects + student users
    const courses = await prisma.course.findMany({
      where: courseWhere,
      select: {
        id: true,
        courseName: true,
        courseCode: true,
        department: true,
        university: true,
        semester: true,
        academicYear: true,
        professorName: true,
        credits: true,
        level: true,
        projects: {
          where: {
            isPublic: true,
            user: {
              role: 'STUDENT',
              profilePublic: true,
            },
          },
          select: {
            id: true,
            title: true,
            grade: true,
            technologies: true,
            skills: true,
            innovationScore: true,
            complexityScore: true,
            userId: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                university: true,
                degree: true,
                graduationYear: true,
                gpa: true,
                gpaPublic: true,
                photo: true,
                bio: true,
                tagline: true,
              },
            },
          },
        },
      },
      orderBy: [
        { university: 'asc' },
        { courseName: 'asc' },
      ],
    })

    // Filter by minGrade if provided (grade is a string like "A", "A-", "B+", etc.)
    // We'll compare alphabetically or numerically depending on format
    const gradeRank: Record<string, number> = {
      'A+': 13, 'A': 12, 'A-': 11,
      'B+': 10, 'B': 9, 'B-': 8,
      'C+': 7, 'C': 6, 'C-': 5,
      'D+': 4, 'D': 3, 'D-': 2,
      'F': 1,
    }

    const getGradeRank = (grade: string | null): number => {
      if (!grade) return 0
      // Check if it's a letter grade
      const upperGrade = grade.trim().toUpperCase()
      if (gradeRank[upperGrade] !== undefined) return gradeRank[upperGrade]
      // Try parsing as a number (percentage)
      const numGrade = parseFloat(grade)
      if (!isNaN(numGrade)) return numGrade
      return 0
    }

    const minGradeRank = minGrade ? getGradeRank(minGrade) : 0

    // Process and group results by institution/course
    // Use a Map for grouping, then convert with Array.from
    const groupMap = new Map<string, {
      institution: string
      courses: Array<{
        courseId: string
        courseName: string
        courseCode: string
        department: string | null
        semester: string
        academicYear: string
        professorName: string | null
        students: Array<{
          id: string
          name: string
          initials: string
          email: string
          university: string | null
          degree: string | null
          graduationYear: string | null
          gpa: number | null
          photo: string | null
          bio: string | null
          tagline: string | null
          courseGrade: string | null
          project: {
            id: string
            title: string
            technologies: string[]
            skills: string[]
            innovationScore: number | null
            complexityScore: number | null
          }
        }>
      }>
    }>()

    for (let ci = 0; ci < courses.length; ci++) {
      const course = courses[ci]
      const institution = course.university

      // Filter projects by minGrade
      const matchingProjects = minGradeRank > 0
        ? course.projects.filter(p => getGradeRank(p.grade) >= minGradeRank)
        : course.projects

      if (matchingProjects.length === 0) continue

      if (!groupMap.has(institution)) {
        groupMap.set(institution, {
          institution,
          courses: [],
        })
      }

      const group = groupMap.get(institution)!

      const students = matchingProjects.map(p => ({
        id: p.user.id,
        name: [p.user.firstName, p.user.lastName].filter(Boolean).join(' ') || 'Anonymous',
        initials: getInitials(p.user.firstName, p.user.lastName),
        email: p.user.email,
        university: p.user.university,
        degree: p.user.degree,
        graduationYear: p.user.graduationYear,
        gpa: p.user.gpaPublic && p.user.gpa ? parseFloat(p.user.gpa) : null,
        photo: p.user.photo,
        bio: p.user.bio,
        tagline: p.user.tagline,
        courseGrade: p.grade,
        project: {
          id: p.id,
          title: p.title,
          technologies: p.technologies,
          skills: p.skills,
          innovationScore: p.innovationScore,
          complexityScore: p.complexityScore,
        },
      }))

      group.courses.push({
        courseId: course.id,
        courseName: course.courseName,
        courseCode: course.courseCode,
        department: course.department,
        semester: course.semester,
        academicYear: course.academicYear,
        professorName: course.professorName,
        students,
      })
    }

    // Convert Map to array using Array.from (no downlevelIteration)
    const allGroups = Array.from(groupMap.values())

    // Count total students across all groups
    let totalStudents = 0
    for (let gi = 0; gi < allGroups.length; gi++) {
      const group = allGroups[gi]
      for (let ci = 0; ci < group.courses.length; ci++) {
        totalStudents += group.courses[ci].students.length
      }
    }

    // Paginate groups
    const paginatedGroups = allGroups.slice((page - 1) * limit, page * limit)

    return NextResponse.json({
      groups: paginatedGroups,
      total: totalStudents,
      totalGroups: allGroups.length,
      page,
      limit,
      totalPages: Math.ceil(allGroups.length / limit),
    })
  } catch (error) {
    console.error('Error searching students by course:', error)
    return NextResponse.json(
      { error: 'Failed to search students by course' },
      { status: 500 }
    )
  }
}

function getInitials(firstName?: string | null, lastName?: string | null): string {
  const first = firstName?.[0] || ''
  const last = lastName?.[0] || ''
  return (first + last).toUpperCase() || 'U'
}
