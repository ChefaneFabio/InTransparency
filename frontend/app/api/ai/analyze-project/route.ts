import { NextRequest, NextResponse } from 'next/server'
import { anthropic, AI_MODEL } from '@/lib/openai-shared'

/**
 * POST /api/ai/analyze-project
 * Analyzes a project description and returns suggested skills, tools, category.
 */
export async function POST(request: NextRequest) {
  try {
    const { title, description, githubUrl } = await request.json()

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description required' }, { status: 400 })
    }

    const prompt = `Analyze this student project and extract structured data.

Title: ${title}
Description: ${description}
${githubUrl ? `GitHub: ${githubUrl}` : ''}

Return a JSON object with:
- discipline: one of TECHNOLOGY, BUSINESS, DESIGN, HEALTHCARE, ENGINEERING, SOCIAL_SCIENCES, LAW, SCIENCES, ARTS, EDUCATION
- projectType: a short label like "Web Application", "Research Paper", "Business Plan", "Prototype", etc.
- skills: array of 3-6 relevant skills (e.g. "Python", "Data Analysis", "Project Management")
- tools: array of 2-4 tools used (e.g. "React", "Figma", "MATLAB", "Excel")
- competencies: array of 2-3 broader competencies (e.g. "Problem Solving", "Teamwork", "Critical Thinking")

Return ONLY valid JSON, no markdown.`

    if (!anthropic) {
      return NextResponse.json({
        discipline: 'TECHNOLOGY',
        projectType: 'Project',
        skills: [],
        tools: [],
        competencies: [],
      })
    }

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    try {
      const parsed = JSON.parse(text)
      return NextResponse.json(parsed)
    } catch {
      // If AI returns non-JSON, return sensible defaults
      return NextResponse.json({
        discipline: 'TECHNOLOGY',
        projectType: 'Project',
        skills: [],
        tools: [],
        competencies: [],
      })
    }
  } catch (error) {
    console.error('Analyze project error:', error)
    return NextResponse.json({
      discipline: 'TECHNOLOGY',
      projectType: 'Project',
      skills: [],
      tools: [],
      competencies: [],
    })
  }
}
