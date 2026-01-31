import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/university/projects
 * List projects from university's students for verification
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

    // Get the university name from session user
    const universityUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        university: true,
        firstName: true,
        lastName: true,
      }
    })

    const universityName = universityUser?.university ||
      `${universityUser?.firstName || ''} ${universityUser?.lastName || ''}`.trim()

    if (!universityName) {
      return NextResponse.json({ error: 'University name not configured' }, { status: 400 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || 'all'
    const discipline = searchParams.get('discipline')
    const course = searchParams.get('course')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build where clause for students from this university
    const where: any = {
      user: {
        university: universityName,
        role: 'STUDENT',
      },
      // Only show projects with course context (eligible for verification)
      OR: [
        { courseName: { not: null } },
        { courseCode: { not: null } },
        { courseId: { not: null } },
      ]
    }

    // Filter by verification status
    if (status !== 'all') {
      where.verificationStatus = status.toUpperCase()
    }

    // Filter by discipline
    if (discipline && discipline !== 'all') {
      where.discipline = discipline
    }

    // Filter by course
    if (course) {
      where.OR = [
        { courseName: { contains: course, mode: 'insensitive' } },
        { courseCode: { contains: course, mode: 'insensitive' } },
      ]
    }

    // Get projects
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              photo: true,
              degree: true,
              graduationYear: true,
            }
          },
          endorsements: {
            where: { status: 'VERIFIED' },
            select: {
              id: true,
              professorName: true,
              verified: true,
            },
            take: 1,
          },
          course: {
            select: {
              id: true,
              courseName: true,
              courseCode: true,
              professorName: true,
            }
          }
        },
        orderBy: [
          { verificationStatus: 'asc' }, // Pending first
          { createdAt: 'desc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.project.count({ where })
    ])

    // Get stats
    const [pendingCount, verifiedCount, rejectedCount, needsInfoCount] = await Promise.all([
      prisma.project.count({
        where: {
          ...where,
          verificationStatus: 'PENDING',
        }
      }),
      prisma.project.count({
        where: {
          ...where,
          verificationStatus: 'VERIFIED',
        }
      }),
      prisma.project.count({
        where: {
          ...where,
          verificationStatus: 'REJECTED',
        }
      }),
      prisma.project.count({
        where: {
          ...where,
          verificationStatus: 'NEEDS_INFO',
        }
      }),
    ])

    // Format projects
    const formattedProjects = projects.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      discipline: project.discipline,
      projectType: project.projectType,
      skills: project.skills,
      tools: project.tools,
      imageUrl: project.imageUrl,
      courseName: project.courseName || project.course?.courseName,
      courseCode: project.courseCode || project.course?.courseCode,
      semester: project.semester,
      professor: project.professor || project.course?.professorName,
      grade: project.grade,
      verificationStatus: project.verificationStatus,
      verificationMessage: project.verificationMessage,
      verifiedAt: project.verifiedAt,
      universityVerified: project.universityVerified,
      createdAt: project.createdAt,
      student: {
        id: project.user.id,
        name: `${project.user.firstName || ''} ${project.user.lastName || ''}`.trim() || 'Anonymous',
        email: project.user.email,
        photo: project.user.photo,
        degree: project.user.degree,
        graduationYear: project.user.graduationYear,
      },
      hasProfessorEndorsement: project.endorsements.length > 0,
      professorEndorsement: project.endorsements[0] || null,
    }))

    return NextResponse.json({
      projects: formattedProjects,
      stats: {
        total,
        pending: pendingCount,
        verified: verifiedCount,
        rejected: rejectedCount,
        needsInfo: needsInfoCount,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    })

  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}
