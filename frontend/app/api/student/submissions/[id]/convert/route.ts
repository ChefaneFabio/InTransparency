import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * POST /api/student/submissions/[id]/convert
 * Convert an approved submission to a portfolio project
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const submission = await prisma.challengeSubmission.findUnique({
      where: { id },
      include: {
        challenge: {
          select: {
            id: true,
            title: true,
            description: true,
            companyName: true,
            companyLogo: true,
            discipline: true,
            challengeType: true,
            requiredSkills: true,
            tools: true
          }
        }
      }
    })

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    if (submission.studentId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (submission.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Only approved submissions can be converted to projects' },
        { status: 400 }
      )
    }

    if (submission.convertedToProject) {
      return NextResponse.json(
        { error: 'Submission has already been converted to a project' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const {
      title,
      description,
      projectType,
      images,
      githubUrl,
      liveUrl,
      featured
    } = body

    // Create the project with university verification
    const project = await prisma.project.create({
      data: {
        userId: session.user.id,
        title: title || submission.submissionTitle || `${submission.challenge.title} - Challenge Project`,
        description: description || submission.submissionDescription || submission.challenge.description,
        discipline: submission.challenge.discipline,
        projectType: projectType || mapChallengeTypeToProjectType(submission.challenge.challengeType),
        skills: submission.challenge.requiredSkills,
        tools: submission.challenge.tools,
        client: submission.challenge.companyName,
        role: submission.isTeamProject ? 'Team Member' : 'Individual Contributor',
        teamSize: submission.isTeamProject && submission.teamMembers
          ? (submission.teamMembers as Array<unknown>).length + 1
          : 1,
        outcome: submission.companyFeedback || 'Successfully completed company challenge',
        courseName: submission.courseName,
        courseCode: submission.courseCode,
        semester: submission.semester,
        professor: submission.professorName,
        grade: submission.grade,
        universityVerified: true,
        liveUrl: submission.submissionUrl || liveUrl,
        githubUrl: githubUrl,
        images: images || [],
        featured: featured || false,
        isPublic: true,
        aiAnalyzed: false,
        aiInsights: {
          challengeId: submission.challengeId,
          challengeTitle: submission.challenge.title,
          companyName: submission.challenge.companyName,
          companyFeedback: submission.companyFeedback,
          companyRating: submission.companyRating,
          completedAt: submission.reviewedAt || new Date()
        }
      }
    })

    // Update submission with project reference
    await prisma.challengeSubmission.update({
      where: { id },
      data: {
        convertedToProject: true,
        projectId: project.id
      }
    })

    return NextResponse.json({
      success: true,
      project,
      message: 'Submission converted to portfolio project with university verification badge'
    }, { status: 201 })
  } catch (error) {
    console.error('Error converting submission to project:', error)
    return NextResponse.json(
      { error: 'Failed to convert submission to project' },
      { status: 500 }
    )
  }
}

function mapChallengeTypeToProjectType(challengeType: string): string {
  const mapping: Record<string, string> = {
    CAPSTONE: 'Capstone Project',
    INTERNSHIP: 'Internship Project',
    COURSE_PROJECT: 'Course Project',
    THESIS: 'Thesis',
    HACKATHON: 'Hackathon',
    RESEARCH: 'Research Project'
  }
  return mapping[challengeType] || 'Project'
}
