import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/student/project-suggestions?projectId=xxx
 *
 * Returns improvement suggestions for a specific project.
 * Analyzes the project fields to provide actionable feedback.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json({ error: 'projectId required' }, { status: 400 })
    }

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: session.user.id },
      select: {
        title: true,
        description: true,
        discipline: true,
        skills: true,
        technologies: true,
        isPublic: true,
        grade: true,
        githubUrl: true,
        liveUrl: true,
        files: { select: { id: true } },
        endorsements: { select: { id: true } },
        verificationStatus: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const suggestions = generateSuggestions(project)

    return NextResponse.json({ suggestions, projectTitle: project.title })
  } catch (error) {
    console.error('Error generating project suggestions:', error)
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 })
  }
}

interface ProjectData {
  title: string
  description: string
  discipline: string | null
  skills: string[]
  technologies: string[]
  isPublic: boolean
  grade: string | null
  githubUrl: string | null
  liveUrl: string | null
  files: { id: string }[]
  endorsements: { id: string }[]
  verificationStatus: string
}

interface Suggestion {
  id: string
  category: 'content' | 'visibility' | 'credibility' | 'technical'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  actionLabel: string
  completed: boolean
}

function generateSuggestions(project: ProjectData): Suggestion[] {
  const suggestions: Suggestion[] = []

  // Content suggestions
  if (!project.description || project.description.length < 100) {
    suggestions.push({
      id: 'description-length',
      category: 'content',
      priority: 'high',
      title: 'Write a detailed description',
      description: `Your project description is ${project.description ? 'only ' + project.description.length + ' characters' : 'empty'}. Aim for 200+ characters to help recruiters understand your work, approach, and results.`,
      actionLabel: 'Edit project',
      completed: false,
    })
  }

  if (project.skills.length < 3) {
    suggestions.push({
      id: 'add-skills',
      category: 'content',
      priority: 'high',
      title: 'Add more skills',
      description: `You've listed ${project.skills.length} skill${project.skills.length === 1 ? '' : 's'}. Adding 3-5 relevant skills improves your searchability by 40%.`,
      actionLabel: 'Add skills',
      completed: project.skills.length >= 3,
    })
  }

  if (project.technologies.length < 2) {
    suggestions.push({
      id: 'add-technologies',
      category: 'technical',
      priority: 'medium',
      title: 'List technologies used',
      description: 'Recruiters often search by specific technologies. Add frameworks, languages, and tools you used.',
      actionLabel: 'Add technologies',
      completed: project.technologies.length >= 2,
    })
  }

  // Visibility suggestions
  if (!project.isPublic) {
    suggestions.push({
      id: 'make-public',
      category: 'visibility',
      priority: 'high',
      title: 'Make your project public',
      description: 'Only public projects appear in recruiter searches. Set this project to public to be discoverable.',
      actionLabel: 'Change visibility',
      completed: false,
    })
  }

  if (!project.liveUrl && !project.githubUrl) {
    suggestions.push({
      id: 'add-links',
      category: 'visibility',
      priority: 'medium',
      title: 'Add project or repository links',
      description: 'Live demos and GitHub repos significantly increase recruiter interest. Add a URL so they can explore your work.',
      actionLabel: 'Add links',
      completed: false,
    })
  }

  if (project.files.length === 0) {
    suggestions.push({
      id: 'upload-files',
      category: 'visibility',
      priority: 'medium',
      title: 'Upload project files or screenshots',
      description: 'Visual evidence makes your project stand out. Add screenshots, diagrams, or documentation.',
      actionLabel: 'Upload files',
      completed: false,
    })
  }

  // Credibility suggestions
  if (project.verificationStatus !== 'VERIFIED') {
    suggestions.push({
      id: 'get-verified',
      category: 'credibility',
      priority: 'high',
      title: 'Get institution verification',
      description: 'Verified projects rank higher in searches and build trust with recruiters. Ask your university to verify this project.',
      actionLabel: 'Request verification',
      completed: false,
    })
  }

  if (project.endorsements.length === 0) {
    suggestions.push({
      id: 'get-endorsement',
      category: 'credibility',
      priority: 'medium',
      title: 'Request a professor endorsement',
      description: 'Professor endorsements add credibility. Send an endorsement request to your course professor.',
      actionLabel: 'Request endorsement',
      completed: false,
    })
  }

  if (!project.grade) {
    suggestions.push({
      id: 'add-grade',
      category: 'credibility',
      priority: 'low',
      title: 'Add your project grade',
      description: 'If this was graded coursework, adding the grade provides additional verification for recruiters.',
      actionLabel: 'Add grade',
      completed: false,
    })
  }

  // Sort by priority
  const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 }
  suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  return suggestions
}
