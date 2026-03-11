import prisma from '@/lib/prisma'
import { analyzeProject, type ProjectData } from '@/lib/ai-analysis'

/**
 * Run AI analysis on a project asynchronously.
 * Updates the project with analysis results without blocking the caller.
 */
export async function runAIAnalysis(projectId: string, projectData: ProjectData) {
  try {
    console.log(`[AI Analysis] Starting analysis for project ${projectId}`)

    // Fetch project files for multimodal analysis
    const projectFiles = await prisma.projectFile.findMany({
      where: { projectId },
      select: {
        fileType: true,
        fileName: true,
        fileSize: true,
        fileUrl: true,
        mimeType: true,
      },
    })

    if (projectFiles.length > 0) {
      console.log(`[AI Analysis] Found ${projectFiles.length} files for multimodal analysis`)
      projectData.files = projectFiles.map(f => ({
        fileType: f.fileType,
        fileName: f.fileName,
        fileSize: f.fileSize,
        fileUrl: f.fileUrl,
        mimeType: f.mimeType,
      }))
    }

    const analysis = await analyzeProject(projectData)

    console.log(`[AI Analysis] Analysis complete for project ${projectId}:`, {
      overallScore: analysis.overallScore,
      innovationScore: analysis.innovationScore,
      complexityScore: analysis.complexityScore
    })

    await prisma.project.update({
      where: { id: projectId },
      data: {
        innovationScore: analysis.innovationScore,
        complexityScore: analysis.complexityScore,
        marketRelevance: analysis.relevanceScore,

        aiInsights: JSON.parse(JSON.stringify({
          summary: analysis.summary,
          strengths: analysis.strengths,
          improvements: analysis.improvements,
          highlights: analysis.highlights,
          qualityScore: analysis.qualityScore,
          overallScore: analysis.overallScore,
          detectedCompetencies: analysis.detectedCompetencies,
          softSkills: analysis.softSkills,
          recommendations: analysis.recommendations,
          analyzedAt: new Date().toISOString()
        })),

        aiAnalyzed: true
      }
    })

    console.log(`[AI Analysis] Project ${projectId} updated with analysis results`)

  } catch (error) {
    console.error(`[AI Analysis] Failed for project ${projectId}:`, error)

    await prisma.project.update({
      where: { id: projectId },
      data: {
        aiAnalyzed: false,
      }
    }).catch(err => console.error('Failed to update project after AI error:', err))
  }
}

/**
 * Build ProjectData from a Prisma project record for analysis.
 */
export function buildProjectData(project: {
  title: string
  description: string
  discipline: string
  projectType?: string | null
  technologies?: string[]
  githubUrl?: string | null
  liveUrl?: string | null
  skills?: string[]
  tools?: string[]
  competencies?: string[]
  courseName?: string | null
  courseCode?: string | null
  grade?: string | null
  professor?: string | null
  duration?: string | null
  teamSize?: number | null
  role?: string | null
  outcome?: string | null
  certifications?: string[]
}): ProjectData {
  return {
    title: project.title,
    description: project.description,
    discipline: project.discipline as ProjectData['discipline'],
    projectType: project.projectType || undefined,
    technologies: project.technologies || [],
    githubUrl: project.githubUrl || undefined,
    liveUrl: project.liveUrl || undefined,
    skills: project.skills || [],
    tools: project.tools || [],
    competencies: project.competencies || [],
    courseName: project.courseName || undefined,
    courseCode: project.courseCode || undefined,
    grade: project.grade || undefined,
    professor: project.professor || undefined,
    duration: project.duration || undefined,
    teamSize: project.teamSize || undefined,
    role: project.role || undefined,
    outcome: project.outcome || undefined,
    certifications: project.certifications || []
  }
}
