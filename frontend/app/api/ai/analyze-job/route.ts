import { NextRequest, NextResponse } from 'next/server'
import { anthropic, AI_MODEL } from '@/lib/openai-shared'

const FALLBACK = {
  title: '',
  description: '',
  location: '',
  jobType: 'FULL_TIME',
  workLocation: 'ON_SITE',
  skills: [],
  salaryMin: null,
  salaryMax: null,
}

/**
 * POST /api/ai/analyze-job
 * Analyzes a job description and returns structured fields.
 */
export async function POST(request: NextRequest) {
  try {
    const { description, url } = await request.json()

    if (!description) {
      return NextResponse.json({ error: 'Description required' }, { status: 400 })
    }

    if (!anthropic) {
      return NextResponse.json({ ...FALLBACK, description })
    }

    const prompt = `Analyze this job posting and extract structured data.

Description: ${description}
${url ? `URL: ${url}` : ''}

Return a JSON object with:
- title: the job title (e.g. "Junior React Developer")
- description: a clean, concise version of the job description (2-4 sentences)
- location: city or region (e.g. "Milan, Italy")
- jobType: one of FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, TEMPORARY, FREELANCE
- workLocation: one of REMOTE, HYBRID, ON_SITE
- skills: array of 3-8 relevant technical skills or tools
- salaryMin: number or null (annual in EUR, or monthly if clearly stated)
- salaryMax: number or null

Return ONLY valid JSON, no markdown.`

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
      return NextResponse.json({ ...FALLBACK, description })
    }
  } catch (error) {
    console.error('Analyze job error:', error)
    return NextResponse.json(FALLBACK)
  }
}
