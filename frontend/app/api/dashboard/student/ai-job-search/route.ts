import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { anthropic, AI_MODEL } from '@/lib/openai-shared'
import { auditFromRequest } from '@/lib/audit'

/**
 * POST /api/dashboard/student/ai-job-search
 * AI-powered conversational job search. Parses natural language query
 * using Claude, extracts filters, and returns matching jobs.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { query } = await req.json()
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    void auditFromRequest(req, {
      actorId: session.user.id,
      actorEmail: session.user.email ?? null,
      actorRole: session.user.role ?? null,
      action: 'SEARCH_JOBS',
      context: { endpoint: 'student/ai-job-search', query: { naturalLanguage: query } },
    })

    // Use AI to extract search criteria from natural language
    let filters: any = {}
    try {
      const response = await anthropic.messages.create({
        model: AI_MODEL,
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: `Extract job search filters from this query. Return ONLY valid JSON, no explanation.

Query: "${query}"

Return JSON with these optional fields:
{
  "skills": ["skill1", "skill2"],
  "jobType": "FULL_TIME" | "PART_TIME" | "INTERNSHIP" | "CONTRACT" | null,
  "workLocation": "REMOTE" | "HYBRID" | "ON_SITE" | null,
  "location": "city or region" | null,
  "search": "keyword for title search" | null
}`
        }],
      })

      const text = (response.content[0] as any).text || '{}'
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        filters = JSON.parse(jsonMatch[0])
      }
    } catch (aiError) {
      console.error('AI parsing failed, falling back to text search:', aiError)
      filters = { search: query }
    }

    // Build Prisma where clause
    const where: any = { status: 'ACTIVE', isPublic: true }

    if (filters.jobType) {
      where.jobType = filters.jobType
    }
    if (filters.workLocation) {
      where.workLocation = filters.workLocation
    }
    if (filters.location) {
      where.location = { contains: filters.location, mode: 'insensitive' }
    }
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { companyName: { contains: filters.search, mode: 'insensitive' } },
      ]
    }
    if (filters.skills && Array.isArray(filters.skills) && filters.skills.length > 0) {
      where.requiredSkills = { hasSome: filters.skills }
    }

    const jobs = await prisma.job.findMany({
      where,
      select: {
        id: true,
        title: true,
        companyName: true,
        location: true,
        jobType: true,
        workLocation: true,
        requiredSkills: true,
        salaryMin: true,
        salaryMax: true,
        salaryCurrency: true,
        showSalary: true,
      },
      orderBy: { postedAt: 'desc' },
      take: 20,
    })

    // Calculate match score against extracted skills
    const searchSkills = new Set((filters.skills || []).map((s: string) => s.toLowerCase()))

    const results = jobs.map(job => {
      const required = job.requiredSkills || []
      let matchScore = 0
      if (required.length > 0 && searchSkills.size > 0) {
        let matches = 0
        for (let i = 0; i < required.length; i++) {
          if (searchSkills.has(required[i].toLowerCase())) matches++
        }
        matchScore = Math.round((matches / required.length) * 100)
      }
      return {
        id: job.id,
        title: job.title,
        companyName: job.companyName,
        location: job.location,
        jobType: job.jobType,
        workLocation: job.workLocation,
        requiredSkills: required,
        matchScore,
        salary: job.showSalary && job.salaryMin
          ? `${job.salaryCurrency || 'EUR'} ${job.salaryMin.toLocaleString()}${job.salaryMax ? ` - ${job.salaryMax.toLocaleString()}` : ''}`
          : null,
      }
    })

    results.sort((a, b) => b.matchScore - a.matchScore)

    return NextResponse.json({ jobs: results, filters })
  } catch (error) {
    console.error('AI job search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
