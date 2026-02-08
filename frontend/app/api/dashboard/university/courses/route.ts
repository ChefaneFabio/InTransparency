import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// GET /api/dashboard/university/courses
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = user.company || ''
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const department = searchParams.get('department') || ''
    const semester = searchParams.get('semester') || ''

    const where: any = { university: universityName }
    if (search) {
      where.OR = [
        { courseName: { contains: search, mode: 'insensitive' } },
        { courseCode: { contains: search, mode: 'insensitive' } },
        { professorName: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (department) where.department = department
    if (semester) where.semester = semester

    const courses = await prisma.course.findMany({
      where,
      include: {
        _count: {
          select: { projects: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Get filter options
    const departments = await prisma.course.findMany({
      where: { university: universityName, department: { not: null } },
      select: { department: true },
      distinct: ['department'],
    })
    const semesters = await prisma.course.findMany({
      where: { university: universityName },
      select: { semester: true },
      distinct: ['semester'],
    })

    return NextResponse.json({
      courses: courses.map(c => ({
        id: c.id,
        courseName: c.courseName,
        courseCode: c.courseCode,
        department: c.department,
        semester: c.semester,
        academicYear: c.academicYear,
        professorName: c.professorName,
        professorEmail: c.professorEmail,
        description: c.description,
        credits: c.credits,
        level: c.level,
        competencies: c.competencies,
        learningOutcomes: c.learningOutcomes,
        projectCount: c._count.projects,
        verified: c.universityVerified,
      })),
      filters: {
        departments: departments.map(d => d.department).filter(Boolean),
        semesters: semesters.map(s => s.semester),
      },
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/dashboard/university/courses
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = user.company || ''
    const body = await req.json()

    const { courseName, courseCode, department, semester, academicYear, professorName, professorEmail, description, credits, level, competencies, learningOutcomes } = body

    if (!courseName || !courseCode || !semester || !academicYear) {
      return NextResponse.json({ error: 'Course name, code, semester, and academic year are required' }, { status: 400 })
    }

    const course = await prisma.course.create({
      data: {
        courseName,
        courseCode,
        department: department || null,
        university: universityName,
        semester,
        academicYear,
        professorName: professorName || null,
        professorEmail: professorEmail || null,
        description: description || null,
        credits: credits ? parseInt(credits) : null,
        level: level || null,
        competencies: competencies || [],
        learningOutcomes: learningOutcomes || [],
        universityVerified: true,
      },
    })

    return NextResponse.json({ course })
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'A course with this code/semester already exists' }, { status: 409 })
    }
    console.error('Error creating course:', error)
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}
