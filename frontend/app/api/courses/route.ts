import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/courses
 * Returns courses for the current user's university.
 * Query params: semester, department, search
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { university: true, role: true },
    })

    const url = new URL(req.url)
    const semester = url.searchParams.get('semester') || undefined
    const department = url.searchParams.get('department') || undefined
    const search = url.searchParams.get('search') || undefined

    const where: Record<string, unknown> = {}

    // Students see their university's courses; university users see their own
    if (user?.university) {
      where.university = user.university
    }

    if (semester) where.semester = semester
    if (department) where.department = department
    if (search) {
      where.OR = [
        { courseName: { contains: search, mode: 'insensitive' } },
        { courseCode: { contains: search, mode: 'insensitive' } },
      ]
    }

    const courses = await prisma.course.findMany({
      where: where as any,
      include: {
        _count: { select: { projects: true } },
      },
      orderBy: [{ semester: 'desc' }, { courseName: 'asc' }],
      take: 100,
    })

    return NextResponse.json({
      data: {
        courses: courses.map((c) => ({
          id: c.id,
          courseCode: c.courseCode,
          courseName: c.courseName,
          department: c.department,
          university: c.university,
          semester: c.semester,
          academicYear: c.academicYear,
          professorName: c.professorName,
          credits: c.credits,
          ectsCredits: c.ectsCredits,
          level: c.level,
          description: c.description,
          competencies: c.competencies,
          universityVerified: c.universityVerified,
          projectCount: c._count.projects,
        })),
      },
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/courses
 * Create a new course (student self-report or university admin).
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { university: true },
    })

    const body = await req.json()
    const { courseCode, courseName, semester, year, credits, grade, instructor } = body

    if (!courseCode || !courseName || !semester) {
      return NextResponse.json({ error: 'Course code, name, and semester are required' }, { status: 400 })
    }

    const academicYear = year ? `${year}-${year + 1}` : `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`

    const course = await prisma.course.create({
      data: {
        courseCode: courseCode.trim(),
        courseName: courseName.trim(),
        semester: semester.trim(),
        academicYear,
        university: user?.university || 'Unknown',
        professorName: instructor || null,
        credits: credits ? parseInt(String(credits)) : null,
      },
    })

    return NextResponse.json({ data: { course } }, { status: 201 })
  } catch (error: any) {
    // Handle unique constraint violation
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'This course already exists for this semester' }, { status: 409 })
    }
    console.error('Error creating course:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
