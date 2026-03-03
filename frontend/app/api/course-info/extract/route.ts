import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { anthropic, AI_MODEL } from '@/lib/openai-shared'

/**
 * POST /api/course-info/extract
 * Fetches a university course URL and extracts academic info using AI.
 * Auth required.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { url } = await request.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Basic URL validation
    let parsedUrl: URL
    try {
      parsedUrl = new URL(url)
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid protocol')
      }
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    // Fetch the page
    let pageText: string
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; InTransparency/1.0)',
          'Accept': 'text/html',
        },
        signal: AbortSignal.timeout(10000),
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }

      const html = await res.text()

      // Strip HTML tags, scripts, styles — keep text content
      pageText = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 8000) // Limit to ~8k chars for AI context
    } catch (error: any) {
      return NextResponse.json(
        { error: `Could not fetch page: ${error.message}` },
        { status: 422 }
      )
    }

    if (!pageText || pageText.length < 50) {
      return NextResponse.json(
        { error: 'Page appears empty or could not be read' },
        { status: 422 }
      )
    }

    // Use AI to extract structured info
    if (!anthropic) {
      // Fallback: try basic extraction from URL and text
      return NextResponse.json(extractBasic(url, pageText))
    }

    const message = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `Extract academic course information from this university web page. Return ONLY valid JSON with these fields (use null if not found):

{
  "university": "full university name",
  "major": "degree program / field of study name",
  "degree": "Bachelor/Master/PhD or equivalent",
  "department": "department or faculty name",
  "duration": "duration in years if mentioned",
  "language": "teaching language if mentioned",
  "skills": ["up to 10 relevant technical/professional skills that students in this program typically learn"],
  "interests": ["up to 5 career areas or professional interests relevant to this program"]
}

URL: ${url}

Page content:
${pageText}`
      }],
    })

    const aiText = message.content[0].type === 'text' ? message.content[0].text : ''

    // Parse JSON from AI response
    const jsonMatch = aiText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json(extractBasic(url, pageText))
    }

    const extracted = JSON.parse(jsonMatch[0])

    return NextResponse.json({
      university: extracted.university || null,
      major: extracted.major || null,
      degree: extracted.degree || null,
      department: extracted.department || null,
      duration: extracted.duration || null,
      language: extracted.language || null,
      skills: Array.isArray(extracted.skills) ? extracted.skills.slice(0, 10) : [],
      interests: Array.isArray(extracted.interests) ? extracted.interests.slice(0, 5) : [],
      source: url,
    })
  } catch (error) {
    console.error('Course info extraction error:', error)
    return NextResponse.json(
      { error: 'Failed to extract course information' },
      { status: 500 }
    )
  }
}

/** Basic extraction without AI — parses URL domain and page text patterns */
function extractBasic(url: string, text: string): Record<string, string | null> {
  const hostname = new URL(url).hostname.replace('www.', '')

  // Common university domain patterns
  const uniPatterns = [
    /universit[àáa]\s+(?:degli\s+studi\s+di\s+)?[\w\s]+/i,
    /politecnico\s+di\s+\w+/i,
    /university\s+of\s+[\w\s]+/i,
    /[\w\s]+university/i,
    /[\w\s]+institute\s+of\s+technology/i,
  ]

  let university: string | null = null
  for (const pattern of uniPatterns) {
    const match = text.match(pattern)
    if (match) {
      university = match[0].trim()
      break
    }
  }

  // Try to get major from title-like patterns
  const majorPatterns = [
    /(?:laurea|master|bachelor|degree)\s+(?:in|di)\s+([^.,:;]+)/i,
    /(?:corso\s+di\s+laurea)\s+(?:in|di)\s+([^.,:;]+)/i,
    /(?:programme|program)\s+(?:in)\s+([^.,:;]+)/i,
  ]

  let major: string | null = null
  for (const pattern of majorPatterns) {
    const match = text.match(pattern)
    if (match) {
      major = match[1].trim().slice(0, 100)
      break
    }
  }

  return {
    university,
    major,
    degree: null,
    department: null,
    duration: null,
    language: null,
    source: url,
  }
}
