import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { aiLimiter, getClientIp } from '@/lib/rate-limit'
import { anthropic, AI_MODEL } from '@/lib/openai-shared'

/**
 * POST /api/ai/parse-job-text
 * Body: { text?: string, url?: string }
 *
 * Single-shot job parser — paste a JD or URL, get back structured Job
 * fields ready to populate the new-job form. Different from the existing
 * /api/ai/analyze-job (multi-turn conversational extractor) — this is the
 * "I already have a JD, just digest it" flow used on the new-job page.
 */

interface ParsedJob {
  title?: string
  description?: string
  responsibilities?: string
  requirements?: string
  niceToHave?: string
  jobType?: 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT' | 'FREELANCE'
  workLocation?: 'ONSITE' | 'REMOTE' | 'HYBRID'
  location?: string
  remoteOk?: boolean
  salaryMin?: number
  salaryMax?: number
  salaryCurrency?: string
  requiredSkills?: string[]
  preferredSkills?: string[]
  education?: string
  experience?: string
  languages?: string[]
  seniority?: string
}

const MAX_INPUT_LEN = 18_000 // ~6k tokens, plenty for any JD

async function fetchUrlAsText(url: string): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'InTransparency-JobParser/1.0' },
      redirect: 'follow',
    })
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
    const html = await res.text()
    // Crude but effective: strip scripts/styles, then strip all tags, collapse whitespace
    const stripped = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim()
    return stripped.slice(0, MAX_INPUT_LEN)
  } finally {
    clearTimeout(timeout)
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const ip = getClientIp(req)
    const { success } = aiLimiter.check(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await req.json()
    const url = typeof body.url === 'string' ? body.url.trim() : ''
    let text = typeof body.text === 'string' ? body.text.trim() : ''

    if (url && /^https?:\/\//i.test(url)) {
      try {
        text = await fetchUrlAsText(url)
      } catch (err) {
        return NextResponse.json(
          { error: 'Could not fetch the URL. Paste the job description directly instead.' },
          { status: 400 }
        )
      }
    }

    if (!text) {
      return NextResponse.json({ error: 'Provide either text or a fetchable URL' }, { status: 400 })
    }

    // Cap to avoid exploding the prompt
    text = text.slice(0, MAX_INPUT_LEN)

    const prompt = `You are extracting structured fields from a job description so a recruiter can review and publish it on a hiring platform.

INPUT:
"""
${text}
"""

Return a JSON object with these fields. Omit any field you cannot reasonably infer:
- title (string)
- description (string, 2-4 sentences, the elevator pitch — not a wall of text)
- responsibilities (string, bullet points joined with "\\n• ")
- requirements (string, the must-haves)
- niceToHave (string, optional perks)
- jobType: "FULL_TIME" | "PART_TIME" | "INTERNSHIP" | "CONTRACT" | "FREELANCE"
- workLocation: "ONSITE" | "REMOTE" | "HYBRID"
- location (string, "City, Country")
- remoteOk (boolean)
- salaryMin (number, EUR; convert if currency is different and note in description)
- salaryMax (number, EUR)
- salaryCurrency (string, default "EUR")
- requiredSkills (array of 3-8 short skill names: "Python", "AWS", "Italian B2", "Stakeholder management")
- preferredSkills (array, nice-to-haves)
- education (string, e.g. "Laurea triennale in Informatica")
- experience (string, e.g. "0-2 anni" or "3-5 years")
- languages (array, e.g. ["Italian", "English"])
- seniority: "intern" | "junior" | "mid" | "senior" | "lead"

CRITICAL:
- Italian-language JDs are common — preserve Italian where natural; the "title" can stay in Italian if that's how it appears.
- Don't invent salary if not stated.
- For remote/hybrid, infer from phrases like "smart working", "in sede", "ibrido".
- Reply with ONLY the JSON object. No markdown fences, no commentary.`

    const result = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = result.content
      .filter(b => b.type === 'text')
      .map(b => (b as { type: 'text'; text: string }).text)
      .join('')
      .trim()

    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()

    let parsed: ParsedJob
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      return NextResponse.json(
        { error: 'AI returned an invalid response. Try pasting a cleaner JD.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ parsed })
  } catch (error: any) {
    console.error('parse-job-text error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to parse job' },
      { status: 500 }
    )
  }
}
