import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/projects/[id] - Get a single project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            university: true,
            degree: true,
            graduationYear: true,
            photo: true,
            subscriptionTier: true
          }
        },
        endorsements: {
          where: { status: 'VERIFIED' },
          select: {
            id: true,
            professorName: true,
            professorTitle: true,
            department: true,
            university: true,
            courseName: true,
            courseCode: true,
            endorsementText: true,
            skills: true,
            rating: true,
            verifiedAt: true
          },
          orderBy: { verifiedAt: 'desc' }
        },
        files: {
          orderBy: { createdAt: 'asc' }
        },
        competencyRecords: {
          include: {
            competency: true
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check if project is public or user owns it
    const requestingUserId = request.headers.get('x-user-id')
    if (!project.isPublic && project.userId !== requestingUserId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Increment view count
    await prisma.project.update({
      where: { id },
      data: {
        views: { increment: 1 }
      }
    })

    // Track analytics
    if (requestingUserId && requestingUserId !== project.userId) {
      await prisma.analytics.create({
        data: {
          userId: requestingUserId,
          eventType: 'PROJECT_VIEW',
          eventName: 'project_viewed',
          properties: {
            projectId: project.id,
            projectOwnerId: project.userId,
            discipline: project.discipline
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      project
    })

  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PATCH /api/projects/[id] - Update a project
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user owns the project
    const existingProject = await prisma.project.findUnique({
      where: { id },
      select: { userId: true }
    })

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (existingProject.userId !== userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Parse request body
    const body = await request.json()

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        // Only update fields that are provided
        ...(body.title && { title: body.title }),
        ...(body.description && { description: body.description }),
        ...(body.discipline && { discipline: body.discipline }),
        ...(body.projectType && { projectType: body.projectType }),
        ...(body.technologies && { technologies: body.technologies }),
        ...(body.githubUrl !== undefined && { githubUrl: body.githubUrl }),
        ...(body.liveUrl !== undefined && { liveUrl: body.liveUrl }),
        ...(body.skills && { skills: body.skills }),
        ...(body.tools && { tools: body.tools }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        ...(body.images && { images: body.images }),
        ...(body.videos && { videos: body.videos }),
        ...(body.duration !== undefined && { duration: body.duration }),
        ...(body.teamSize !== undefined && { teamSize: body.teamSize }),
        ...(body.role !== undefined && { role: body.role }),
        ...(body.client !== undefined && { client: body.client }),
        ...(body.outcome !== undefined && { outcome: body.outcome }),
        ...(body.courseName !== undefined && { courseName: body.courseName }),
        ...(body.courseCode !== undefined && { courseCode: body.courseCode }),
        ...(body.semester !== undefined && { semester: body.semester }),
        ...(body.academicYear !== undefined && { academicYear: body.academicYear }),
        ...(body.grade !== undefined && { grade: body.grade }),
        ...(body.professor !== undefined && { professor: body.professor }),
        ...(body.competencies && { competencies: body.competencies }),
        ...(body.certifications && { certifications: body.certifications }),
        ...(body.featured !== undefined && { featured: body.featured }),
        ...(body.isPublic !== undefined && { isPublic: body.isPublic })
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      project: updatedProject
    })

  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user owns the project
    const existingProject = await prisma.project.findUnique({
      where: { id },
      select: { userId: true }
    })

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (existingProject.userId !== userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Delete project (cascade will delete related endorsements, files, etc.)
    await prisma.project.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
