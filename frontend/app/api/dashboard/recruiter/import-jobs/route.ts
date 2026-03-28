import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { anthropic, AI_MODEL } from '@/lib/openai-shared'
import prisma from '@/lib/prisma'
import { JobType } from '@prisma/client'
import { z } from 'zod'

const importSchema = z.object({
  url: z.string().url('Valid URL required'),
  companyName: z.string().min(1).optional(),
})

/**
 * POST /api/dashboard/recruiter/import-jobs
 *
 * Takes a company careers page URL, fetches the HTML,
 * uses AI to extract job listings, and creates Job records.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (!anthropic) {
      return NextResponse.json({ error: 'AI service unavailable' }, { status: 503 })
    }

    const body = await req.json()
    const { url, companyName } = importSchema.parse(body)

    // Fetch the career page HTML
    const pageResponse = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; InTransparency/1.0)' },
    })
    if (!pageResponse.ok) {
      return NextResponse.json({ error: 'Could not fetch the career page' }, { status: 400 })
    }

    const html = await pageResponse.text()
    // Strip scripts/styles, keep text content (max 15000 chars for AI)
    const cleanText = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 15000)

    // Use AI to extract job listings
    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 3000,
      messages: [{
        role: 'user',
        content: `Extract all job listings from this career page text. For each job found, extract:
- title: the job title
- department: which department/team
- location: city/country or "Remote"
- type: FULL_TIME, PART_TIME, CONTRACT, or INTERNSHIP
- description: a brief description if available (1-2 sentences)

Company name: ${companyName || 'Unknown (extract from page if possible)'}
Career page URL: ${url}

Page text:
"""
${cleanText}
"""

Respond in valid JSON:
{"companyName": "...", "jobs": [{"title": "...", "department": "...", "location": "...", "type": "FULL_TIME", "description": "..."}]}

If no jobs are found, return {"companyName": "...", "jobs": []}.
Only output JSON, nothing else.`
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Could not extract jobs from the page' }, { status: 500 })
    }

    const extracted = JSON.parse(jsonMatch[0])
    const jobs = extracted.jobs || []
    const detectedCompany = extracted.companyName || companyName || 'Unknown'

    if (jobs.length === 0) {
      return NextResponse.json({ companyName: detectedCompany, imported: 0, jobs: [] })
    }

    // Create Job records
    const typeMap: Record<string, JobType> = {
      'FULL_TIME': 'FULL_TIME',
      'PART_TIME': 'PART_TIME',
      'CONTRACT': 'CONTRACT',
      'INTERNSHIP': 'INTERNSHIP',
      'Full Time': 'FULL_TIME',
      'Part Time': 'PART_TIME',
    }

    const created = []
    for (const job of jobs) {
      try {
        const title = job.title || 'Untitled Position'
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now()
        const record = await prisma.job.create({
          data: {
            recruiterId: session.user.id,
            companyName: detectedCompany,
            title,
            slug,
            description: job.description || `${title} at ${detectedCompany}`,
            jobType: typeMap[job.type] || 'FULL_TIME',
            workLocation: 'HYBRID',
            location: job.location || null,
            status: 'ACTIVE',
            requiredSkills: [],
            preferredSkills: [],
            tags: [job.department || '', `imported:${url}`].filter(Boolean),
          },
        })
        created.push({
          id: record.id,
          title: record.title,
          location: job.location,
          department: job.department,
        })
      } catch {
        // Skip duplicates or validation errors
      }
    }

    return NextResponse.json({
      companyName: detectedCompany,
      imported: created.length,
      total: jobs.length,
      jobs: created,
    })
  } catch (error) {
    console.error('Job import error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to import jobs' }, { status: 500 })
  }
}
