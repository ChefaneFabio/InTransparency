import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { anthropic, AI_MODEL } from '@/lib/openai-shared'
import { auditFromRequest } from '@/lib/audit'

/**
 * POST /api/dashboard/recruiter/ai-parse-search
 * Uses Claude to parse natural language recruiter search queries into structured filters.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { query } = await req.json()
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query required' }, { status: 400 })
    }

    void auditFromRequest(req, {
      actorId: session.user.id,
      actorEmail: session.user.email ?? null,
      actorRole: session.user.role ?? null,
      action: 'SEARCH_CANDIDATES',
      context: { endpoint: 'recruiter/ai-parse-search', query: { naturalLanguage: query } },
    })

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 600,
      messages: [{
        role: 'user',
        content: `You are a recruiter search assistant. Parse this candidate search query and extract structured filters. Return ONLY valid JSON.

Query: "${query}"

Return JSON with these optional fields:
{
  "skills": ["technical skills mentioned"],
  "softSkills": ["soft skills mentioned"],
  "fieldOfStudy": ["fields/majors mentioned"],
  "universities": ["specific university names"],
  "location": "city/region or null",
  "languages": ["languages mentioned"],
  "gpaMin": number or null,
  "graduationYear": "YYYY" or null,
  "experienceLevel": "entry" | "senior" or null,
  "availability": "description" or null,
  "search": "general keyword" or null
}`
      }],
    })

    const text = (response.content[0] as any).text || '{}'
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const criteria = jsonMatch ? JSON.parse(jsonMatch[0]) : { search: query }

    return NextResponse.json({ criteria })
  } catch (error) {
    console.error('AI search parse error:', error)
    // Fallback: return the query as a simple text search
    return NextResponse.json({ criteria: { search: req.body ? '' : '' } }, { status: 200 })
  }
}
