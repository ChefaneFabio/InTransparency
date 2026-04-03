import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { anthropic, AI_MODEL } from '@/lib/openai-shared'
import { aiLimiter, getClientIp } from '@/lib/rate-limit'

const FALLBACK: ProjectResult = {
  discipline: 'TECHNOLOGY',
  projectType: 'Project',
  skills: [],
  tools: [],
  competencies: [],
}

interface ProjectResult {
  discipline: string
  projectType: string
  skills: string[]
  tools: string[]
  competencies: string[]
  companyInfo?: string
}

/**
 * Extract company/organization names from text for web search
 */
const extractSearchTerms = (text: string): string[] => {
  const terms: string[] = []

  // Match capitalized words that look like company/org names (2+ consecutive capitalized words or single known patterns)
  const companyPattern = /(?:per|for|at|with|presso|da|di)\s+([A-Z][a-zA-Zàèéìòù]+(?:\s+[A-Z][a-zA-Zàèéìòù]+)*)/g
  let match
  while ((match = companyPattern.exec(text)) !== null) {
    if (match[1] && match[1].length > 2) {
      terms.push(match[1])
    }
  }

  // Also match standalone capitalized words that aren't common words
  const commonWords = new Set(['Il', 'La', 'Lo', 'Le', 'Un', 'Una', 'The', 'This', 'That', 'With', 'From', 'Into', 'My', 'Our', 'Per', 'Con', 'Nel', 'Del', 'Che', 'Non', 'Sono', 'Come', 'Anche', 'Progetto', 'Project', 'App', 'Web', 'Sistema', 'System'])
  const standalonePattern = /\b([A-Z][a-zA-Zàèéìòù]{2,}(?:\s+[A-Z][a-zA-Zàèéìòù]+)*)\b/g
  while ((match = standalonePattern.exec(text)) !== null) {
    const word = match[1]
    if (word && !commonWords.has(word) && !terms.includes(word)) {
      // Only add if it looks like a proper noun (not a sentence start after period)
      const charBefore = text[match.index - 2]
      if (charBefore && charBefore !== '.') {
        terms.push(word)
      }
    }
  }

  return Array.from(new Set(terms)).slice(0, 3) // Max 3 search terms
}

/**
 * Simple web search using a search API
 */
const searchWeb = async (query: string): Promise<string> => {
  try {
    // Use a simple fetch to get search results
    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
    const res = await fetch(searchUrl, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return ''

    const data = await res.json()
    const results: string[] = []

    if (data.Abstract) {
      results.push(data.Abstract)
    }
    if (data.RelatedTopics) {
      const topics = Array.isArray(data.RelatedTopics) ? data.RelatedTopics : []
      for (const topic of topics.slice(0, 3)) {
        if (topic.Text) results.push(topic.Text)
      }
    }

    return results.join('\n').slice(0, 1000)
  } catch {
    return ''
  }
}

/**
 * POST /api/ai/analyze-project
 * Analyzes a project description (with optional images and web search) and returns structured data.
 */
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Rate limiting
    const ip = getClientIp(request)
    const { success } = aiLimiter.check(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please wait.' }, { status: 429 })
    }

    const body = await request.json()
    const {
      title,
      description,
      githubUrl,
      imageUrls = [],
      documentUrls = [],
      searchWeb: shouldSearch = false,
      isFollowUp = false,
      existingSkills = [],
      existingTools = [],
    } = body

    if (!title && !description && imageUrls.length === 0) {
      return NextResponse.json({ error: 'Title, description, or image required' }, { status: 400 })
    }

    if (!anthropic) {
      return NextResponse.json(FALLBACK)
    }

    // Web search for company/organization context
    let webContext = ''
    if (shouldSearch && description) {
      const searchTerms = extractSearchTerms(description)
      if (searchTerms.length > 0) {
        const searchResults = await Promise.all(
          searchTerms.map(term => searchWeb(`${term} company azienda`))
        )
        const validResults = searchResults.filter(r => r.length > 0)
        if (validResults.length > 0) {
          webContext = `\n\nWeb research about mentioned organizations:\n${validResults.join('\n---\n')}`
        }
      }
    }

    // Build message content with text and optional images
    const content: Array<any> = []

    // Add images for vision analysis
    for (const url of imageUrls.slice(0, 4)) {
      try {
        // Fetch image and convert to base64 for Claude vision
        const imgRes = await fetch(url, { signal: AbortSignal.timeout(10000) })
        if (imgRes.ok) {
          const buffer = await imgRes.arrayBuffer()
          const base64 = Buffer.from(buffer).toString('base64')
          const contentType = imgRes.headers.get('content-type') || 'image/jpeg'
          const mediaType = contentType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

          content.push({
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64,
            },
          })
        }
      } catch {
        // Skip failed image fetches
      }
    }

    // Build the analysis prompt
    const hasImages = content.length > 0
    const hasDocuments = documentUrls.length > 0

    let prompt: string
    if (isFollowUp) {
      prompt = `The student has added more information to their project. Analyze the FULL updated description and return improved structured data.

Title: ${title || 'Untitled'}
Full Description: ${description || '(described via images)'}
${githubUrl ? `GitHub: ${githubUrl}` : ''}
${hasDocuments ? `Attached documents: ${documentUrls.map((d: { name: string }) => d.name).join(', ')}` : ''}
${hasImages ? '\nThe student also attached images of their project. Describe what you see and extract relevant information.' : ''}
${webContext}

Previously extracted skills: ${existingSkills.join(', ') || 'none'}
Previously extracted tools: ${existingTools.join(', ') || 'none'}

Return a JSON object with:
- discipline: one of TECHNOLOGY, BUSINESS, DESIGN, HEALTHCARE, ENGINEERING, SOCIAL_SCIENCES, LAW, SCIENCES, ARTS, EDUCATION, TRADES, ARCHITECTURE, MEDIA, WRITING, OTHER
- projectType: a short label like "Web Application", "Research Paper", "Business Plan", "Prototype", "Hardware Project", "Thesis", etc.
- skills: array of 3-8 relevant skills (INCLUDE previously extracted ones if still relevant, ADD new ones from the additional context)
- tools: array of 2-6 tools used (INCLUDE previously extracted ones if still relevant, ADD new ones)
- competencies: array of 2-4 broader competencies (e.g. "Problem Solving", "Teamwork", "Critical Thinking")
${webContext ? '- companyInfo: a brief 1-2 sentence description of the company/organization mentioned, based on web research (in the same language the student used)' : ''}

Return ONLY valid JSON, no markdown.`
    } else {
      prompt = `Analyze this student project and extract structured data.

Title: ${title || 'Untitled'}
Description: ${description || '(described via images)'}
${githubUrl ? `GitHub: ${githubUrl}` : ''}
${hasDocuments ? `Attached documents: ${documentUrls.map((d: { name: string }) => d.name).join(', ')} — these are project deliverables like thesis papers, reports, or presentations.` : ''}
${hasImages ? '\nThe student attached images of their project. Analyze them carefully — they might show hardware prototypes, UI designs, architectural diagrams, lab work, or physical outputs. Describe what you see and extract relevant skills and tools from the visual evidence.' : ''}
${webContext}

Return a JSON object with:
- discipline: one of TECHNOLOGY, BUSINESS, DESIGN, HEALTHCARE, ENGINEERING, SOCIAL_SCIENCES, LAW, SCIENCES, ARTS, EDUCATION, TRADES, ARCHITECTURE, MEDIA, WRITING, OTHER
- projectType: a short label like "Web Application", "Research Paper", "Business Plan", "Prototype", "Hardware Project", "Thesis", etc.
- skills: array of 3-8 relevant skills (e.g. "Python", "Data Analysis", "Project Management", "Carpentry", "Structural Design")
- tools: array of 2-6 tools used (e.g. "React", "Figma", "MATLAB", "Excel", "AutoCAD", "Arduino")
- competencies: array of 2-4 broader competencies (e.g. "Problem Solving", "Teamwork", "Critical Thinking")
${webContext ? '- companyInfo: a brief 1-2 sentence summary of the company/organization mentioned, based on web research (in the same language the student wrote in)' : ''}

Return ONLY valid JSON, no markdown.`
    }

    content.push({ type: 'text', text: prompt })

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 800,
      messages: [{ role: 'user', content }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    try {
      // Try to parse JSON, handling potential markdown wrappers
      const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const parsed = JSON.parse(jsonStr)
      return NextResponse.json(parsed)
    } catch {
      return NextResponse.json(FALLBACK)
    }
  } catch (error) {
    console.error('Analyze project error:', error)
    return NextResponse.json(FALLBACK)
  }
}
