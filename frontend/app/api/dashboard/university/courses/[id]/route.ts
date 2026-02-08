import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// GET /api/dashboard/university/courses/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = user.company || ''
    const course = await prisma.course.findFirst({
      where: { id: params.id, university: universityName },
      include: {
        projects: {
          select: {
            id: true,
            title: true,
            description: true,
            skills: true,
            user: { select: { firstName: true, lastName: true } },
            verificationStatus: true,
            createdAt: true,
          },
          take: 20,
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { projects: true } },
      },
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    return NextResponse.json({ course })
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/dashboard/university/courses/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = user.company || ''
    const existing = await prisma.course.findFirst({
      where: { id: params.id, university: universityName },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const body = await req.json()
    const course = await prisma.course.update({
      where: { id: params.id },
      data: {
        ...(body.courseName && { courseName: body.courseName }),
        ...(body.courseCode && { courseCode: body.courseCode }),
        ...(body.department !== undefined && { department: body.department || null }),
        ...(body.semester && { semester: body.semester }),
        ...(body.academicYear && { academicYear: body.academicYear }),
        ...(body.professorName !== undefined && { professorName: body.professorName || null }),
        ...(body.professorEmail !== undefined && { professorEmail: body.professorEmail || null }),
        ...(body.description !== undefined && { description: body.description || null }),
        ...(body.credits !== undefined && { credits: body.credits ? parseInt(body.credits) : null }),
        ...(body.level !== undefined && { level: body.level || null }),
        ...(body.competencies && { competencies: body.competencies }),
        ...(body.learningOutcomes && { learningOutcomes: body.learningOutcomes }),
      },
    })

    return NextResponse.json({ course })
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
  }
}

// DELETE /api/dashboard/university/courses/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = user.company || ''
    const existing = await prisma.course.findFirst({
      where: { id: params.id, university: universityName },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    await prisma.course.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 })
  }
}
