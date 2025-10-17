import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { analyzeProject, type ProjectData, type Discipline } from '@/lib/ai-analysis'

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    // Get user ID from headers (assuming authentication middleware sets this)
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.description || !body.discipline) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, discipline' },
        { status: 400 }
      )
    }

    // Validate discipline
    const validDisciplines = [
      'TECHNOLOGY', 'BUSINESS', 'DESIGN', 'HEALTHCARE', 'ENGINEERING',
      'TRADES', 'ARCHITECTURE', 'MEDIA', 'WRITING', 'SOCIAL_SCIENCES',
      'ARTS', 'LAW', 'EDUCATION', 'SCIENCE', 'OTHER'
    ]

    if (!validDisciplines.includes(body.discipline)) {
      return NextResponse.json(
        { error: 'Invalid discipline' },
        { status: 400 }
      )
    }

    // Create project with all new fields
    const project = await prisma.project.create({
      data: {
        userId,

        // Discipline & Type
        discipline: body.discipline,
        projectType: body.projectType,
        category: body.category,

        // Basic Info
        title: body.title,
        description: body.description,

        // Tech-specific fields (for TECHNOLOGY discipline)
        technologies: body.technologies || [],
        githubUrl: body.githubUrl,
        liveUrl: body.liveUrl,

        // Universal fields (all disciplines)
        skills: body.skills || [],
        tools: body.tools || [],

        // Media & Files
        imageUrl: body.imageUrl,
        images: body.images || [],
        videos: body.videos || [],
        // Note: files will be handled separately via file upload endpoint

        // Project Context
        duration: body.duration,
        teamSize: body.teamSize,
        role: body.role,
        client: body.client,
        outcome: body.outcome,

        // Academic Context (Course-based verification)
        courseName: body.courseName,
        courseCode: body.courseCode,
        semester: body.semester,
        academicYear: body.academicYear,
        grade: body.grade,
        professor: body.professor,
        universityVerified: false, // Will be verified later by university
        // courseId will be set when we link to Course model

        // Competencies Demonstrated
        competencies: body.competencies || [],

        // Certifications (for trades, healthcare, technical fields)
        certifications: body.certifications || [],

        // Visibility
        featured: body.featured || false,
        isPublic: body.isPublic !== undefined ? body.isPublic : true,

        // AI Analysis (will be done asynchronously)
        aiAnalyzed: false
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            university: true
          }
        }
      }
    })

    // Trigger AI analysis asynchronously (non-blocking)
    runAIAnalysis(project.id, {
      title: project.title,
      description: project.description,
      discipline: project.discipline as Discipline,
      projectType: project.projectType || undefined,
      technologies: project.technologies,
      githubUrl: project.githubUrl || undefined,
      liveUrl: project.liveUrl || undefined,
      skills: project.skills,
      tools: project.tools,
      competencies: project.competencies,
      courseName: project.courseName || undefined,
      courseCode: project.courseCode || undefined,
      grade: project.grade || undefined,
      professor: project.professor || undefined,
      duration: project.duration || undefined,
      teamSize: project.teamSize || undefined,
      role: project.role || undefined,
      outcome: project.outcome || undefined,
      certifications: project.certifications
    }).catch(err => console.error('AI analysis failed:', err))

    // Track analytics
    await prisma.analytics.create({
      data: {
        userId,
        eventType: 'PROJECT_VIEW',
        eventName: 'project_created',
        properties: {
          projectId: project.id,
          discipline: project.discipline,
          projectType: project.projectType
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      project
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project. Please try again.' },
      { status: 500 }
    )
  }
}

// GET /api/projects - Get all projects (with filters)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const discipline = searchParams.get('discipline')
    const isPublic = searchParams.get('isPublic')
    const featured = searchParams.get('featured')
    const courseName = searchParams.get('courseName')
    const courseCode = searchParams.get('courseCode')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: any = {}

    if (userId) {
      where.userId = userId
    }

    if (discipline) {
      where.discipline = discipline
    }

    if (isPublic !== null && isPublic !== undefined) {
      where.isPublic = isPublic === 'true'
    }

    if (featured !== null && featured !== undefined) {
      where.featured = featured === 'true'
    }

    if (courseName) {
      where.courseName = {
        contains: courseName,
        mode: 'insensitive'
      }
    }

    if (courseCode) {
      where.courseCode = {
        equals: courseCode,
        mode: 'insensitive'
      }
    }

    // Get projects with filters
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' }
        ],
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              university: true,
              photo: true
            }
          },
          endorsements: {
            where: { status: 'VERIFIED' },
            select: {
              id: true,
              professorName: true,
              university: true,
              rating: true
            }
          },
          _count: {
            select: {
              endorsements: true
            }
          }
        }
      }),
      prisma.project.count({ where })
    ])

    return NextResponse.json({
      success: true,
      projects,
      total,
      limit,
      offset,
      hasMore: offset + limit < total
    })

  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// ============================================================================
// AI ANALYSIS - Asynchronous Processing
// ============================================================================

/**
 * Run AI analysis on a project asynchronously
 * Updates the project with analysis results without blocking the API response
 */
async function runAIAnalysis(projectId: string, projectData: ProjectData) {
  try {
    console.log(`[AI Analysis] Starting analysis for project ${projectId}`)

    // Run the AI analysis
    const analysis = await analyzeProject(projectData)

    console.log(`[AI Analysis] Analysis complete for project ${projectId}:`, {
      overallScore: analysis.overallScore,
      innovationScore: analysis.innovationScore,
      complexityScore: analysis.complexityScore
    })

    // Update the project with analysis results
    await prisma.project.update({
      where: { id: projectId },
      data: {
        // AI Scores
        innovationScore: analysis.innovationScore,
        complexityScore: analysis.complexityScore,
        relevanceScore: analysis.relevanceScore,
        qualityScore: analysis.qualityScore,
        overallScore: analysis.overallScore,

        // AI Insights
        aiSummary: analysis.summary,
        aiStrengths: analysis.strengths,
        aiImprovements: analysis.improvements,
        aiHighlights: analysis.highlights,

        // Detected competencies (merge with user-provided ones)
        // detectedCompetencies: analysis.detectedCompetencies,

        // Mark as analyzed
        aiAnalyzed: true,
        aiAnalyzedAt: new Date()
      }
    })

    console.log(`[AI Analysis] Project ${projectId} updated with analysis results`)

  } catch (error) {
    console.error(`[AI Analysis] Failed for project ${projectId}:`, error)

    // Mark analysis as attempted but failed
    await prisma.project.update({
      where: { id: projectId },
      data: {
        aiAnalyzed: false,
        // Could add an aiAnalysisError field to track failures
      }
    }).catch(err => console.error('Failed to update project after AI error:', err))
  }
}
