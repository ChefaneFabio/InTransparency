import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const verificationActionSchema = z.object({
  action: z.enum(['verify', 'reject', 'request_info']),
  message: z.string().optional(),
})

/**
 * GET /api/dashboard/university/projects/[id]
 * Get project details for verification
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'UNIVERSITY' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id: projectId } = await params

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

    // Get project with all details
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            photo: true,
            university: true,
            degree: true,
            graduationYear: true,
            gpa: true,
            gpaPublic: true,
          }
        },
        endorsements: {
          select: {
            id: true,
            professorName: true,
            professorEmail: true,
            professorTitle: true,
            department: true,
            university: true,
            courseName: true,
            courseCode: true,
            semester: true,
            grade: true,
            endorsementText: true,
            skills: true,
            rating: true,
            verified: true,
            status: true,
            verifiedAt: true,
          }
        },
        course: {
          select: {
            id: true,
            courseName: true,
            courseCode: true,
            department: true,
            semester: true,
            academicYear: true,
            professorName: true,
            professorEmail: true,
            description: true,
            credits: true,
            universityVerified: true,
          }
        },
        files: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            fileUrl: true,
            fileSize: true,
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Verify the student belongs to this university
    if (project.user.university !== universityName && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Project not from your university' }, { status: 403 })
    }

    return NextResponse.json({
      project: {
        id: project.id,
        title: project.title,
        description: project.description,
        discipline: project.discipline,
        projectType: project.projectType,
        technologies: project.technologies,
        skills: project.skills,
        tools: project.tools,
        githubUrl: project.githubUrl,
        liveUrl: project.liveUrl,
        imageUrl: project.imageUrl,
        images: project.images,
        videos: project.videos,
        duration: project.duration,
        teamSize: project.teamSize,
        role: project.role,
        client: project.client,
        outcome: project.outcome,
        courseName: project.courseName || project.course?.courseName,
        courseCode: project.courseCode || project.course?.courseCode,
        semester: project.semester || project.course?.semester,
        academicYear: project.academicYear || project.course?.academicYear,
        grade: project.grade,
        professor: project.professor || project.course?.professorName,
        verificationStatus: project.verificationStatus,
        verificationMessage: project.verificationMessage,
        verifiedBy: project.verifiedBy,
        verifiedAt: project.verifiedAt,
        universityVerified: project.universityVerified,
        complexityScore: project.complexityScore,
        innovationScore: project.innovationScore,
        marketRelevance: project.marketRelevance,
        aiInsights: project.aiInsights,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
      student: {
        id: project.user.id,
        name: `${project.user.firstName || ''} ${project.user.lastName || ''}`.trim() || 'Anonymous',
        email: project.user.email,
        photo: project.user.photo,
        university: project.user.university,
        degree: project.user.degree,
        graduationYear: project.user.graduationYear,
        gpa: project.user.gpaPublic ? project.user.gpa : null,
      },
      endorsements: project.endorsements,
      course: project.course,
      files: project.files,
    })

  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/dashboard/university/projects/[id]
 * Update project verification status
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'UNIVERSITY' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id: projectId } = await params
    const body = await req.json()
    const { action, message } = verificationActionSchema.parse(body)

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

    // Verify project exists and belongs to university
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        user: {
          select: { university: true }
        }
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (project.user.university !== universityName && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Project not from your university' }, { status: 403 })
    }

    // Determine new status based on action
    let verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NEEDS_INFO'
    let universityVerified: boolean

    switch (action) {
      case 'verify':
        verificationStatus = 'VERIFIED'
        universityVerified = true
        break
      case 'reject':
        verificationStatus = 'REJECTED'
        universityVerified = false
        break
      case 'request_info':
        verificationStatus = 'NEEDS_INFO'
        universityVerified = false
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        verificationStatus,
        universityVerified,
        verificationMessage: message || null,
        verifiedBy: session.user.id,
        verifiedAt: action === 'verify' ? new Date() : null,
      },
      select: {
        id: true,
        verificationStatus: true,
        universityVerified: true,
        verificationMessage: true,
        verifiedAt: true,
      }
    })

    // TODO: Send notification to student about verification status change

    return NextResponse.json({
      success: true,
      project: updatedProject,
      message: action === 'verify'
        ? 'Project verified successfully'
        : action === 'reject'
          ? 'Project verification rejected'
          : 'Additional information requested from student',
    })

  } catch (error) {
    console.error('Error updating project verification:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update verification' },
      { status: 500 }
    )
  }
}
