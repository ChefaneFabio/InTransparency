import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { anthropic, AI_MODEL } from '@/lib/openai-shared'
import { aiLimiter, getClientIp } from '@/lib/rate-limit'
import prisma from '@/lib/prisma'

/**
 * Search the web for company/organization context
 */
const searchWeb = async (query: string): Promise<string> => {
  try {
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
      { signal: AbortSignal.timeout(5000) }
    )
    if (!res.ok) return ''
    const data = await res.json()
    const parts: string[] = []
    if (data.Abstract) parts.push(data.Abstract)
    if (data.RelatedTopics) {
      for (const t of (Array.isArray(data.RelatedTopics) ? data.RelatedTopics : []).slice(0, 3)) {
        if (t.Text) parts.push(t.Text)
      }
    }
    return parts.join('\n').slice(0, 800)
  } catch { return '' }
}

/**
 * Extract company names from text for web search
 */
const extractCompanyNames = (text: string): string[] => {
  const terms: string[] = []
  const pattern = /(?:per|for|at|with|presso|da|di|con)\s+([A-Z][a-zA-Zàèéìòù]+(?:\s+[A-Z][a-zA-Zàèéìòù]+)*)/g
  let match
  while ((match = pattern.exec(text)) !== null) {
    if (match[1] && match[1].length > 2) terms.push(match[1])
  }
  return Array.from(new Set(terms)).slice(0, 3)
}

/**
 * POST /api/ai/analyze-project
 * Conversational project intake with real-world context and student awareness.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const ip = getClientIp(request)
    const { success } = aiLimiter.check(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please wait.' }, { status: 429 })
    }

    const body = await request.json()
    const {
      messages = [],
      currentProjectData = {},
      imageUrls = [],
      documentUrls = [],
      locale = 'en',
    } = body

    if (messages.length === 0) {
      return NextResponse.json({ error: 'Messages required' }, { status: 400 })
    }

    // Get student context
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        firstName: true, university: true, degree: true, country: true,
        graduationYear: true, skills: true, interests: true,
      },
    })

    // Get active job market data (top demanded skills)
    const topJobSkills = await prisma.job.findMany({
      where: { status: 'ACTIVE', isPublic: true },
      select: { requiredSkills: true, title: true },
      take: 50,
    })
    const skillDemand = new Map<string, number>()
    for (const job of topJobSkills) {
      for (const skill of job.requiredSkills) {
        const s = skill.toLowerCase()
        skillDemand.set(s, (skillDemand.get(s) || 0) + 1)
      }
    }
    const topDemandedSkills = Array.from(skillDemand.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([skill, count]) => `${skill} (${count} jobs)`)

    // Web search for companies mentioned in first message
    let webContext = ''
    if (messages.length <= 2) {
      const firstUserMsg = messages.find((m: any) => m.role === 'user')
      if (firstUserMsg) {
        const companies = extractCompanyNames(firstUserMsg.content)
        if (companies.length > 0) {
          const results = await Promise.all(
            companies.map(c => searchWeb(`${c} company azienda`))
          )
          const valid = results.filter(r => r.length > 0)
          if (valid.length > 0) {
            webContext = `\n\nWEB RESEARCH about mentioned organizations:\n${valid.join('\n---\n')}`
          }
        }
      }
    }

    // Determine school level
    let schoolLevel = 'university student'
    const uni = user?.university?.toLowerCase() || ''
    const degree = user?.degree?.toLowerCase() || ''
    if (uni.includes('liceo') || uni.includes('istituto tecnico') || uni.includes('istituto professionale') || uni.includes('high school') || degree.includes('diploma')) {
      schoolLevel = 'high school student'
    } else if (uni.includes('its') || degree.includes('its')) {
      schoolLevel = 'ITS (technical institute) student'
    } else if (degree.includes('master') || degree.includes('magistrale')) {
      schoolLevel = 'master\'s student'
    } else if (degree.includes('phd') || degree.includes('dottorato')) {
      schoolLevel = 'PhD student'
    }

    const lang = locale === 'it' ? 'Italian' : 'English'
    const systemPrompt = `You are a friendly project intake assistant for InTransparency, a platform where students showcase their academic and personal projects to recruiters.

Your job: have a natural conversation with the student to build a complete project profile. Extract information from what they share, then ask smart follow-up questions.

STUDENT CONTEXT:
- Name: ${user?.firstName || 'Unknown'}
- School: ${user?.university || 'Not specified'}
- Degree: ${user?.degree || 'Not specified'}
- Level: ${schoolLevel}
- Country: ${user?.country || 'IT'}
- Graduation: ${user?.graduationYear || 'Not specified'}
- Existing skills: ${(user?.skills || []).join(', ') || 'None listed'}

Adapt your questions and expectations to this student's level. A high school student's cooking project is different from a PhD thesis. Be appropriate.

CURRENT JOB MARKET (top demanded skills right now):
${topDemandedSkills.join(', ')}

When extracting skills, note which ones match current market demand. This helps the student understand their employability.
${webContext}

RULES:
- Respond in ${lang} (or match the student's language if they switch)
- Be warm and encouraging — students are sharing their work
- Ask 1-3 follow-up questions at a time, grouped by topic
- Don't ask about fields that are irrelevant to this student/project
- If a company/organization is mentioned, acknowledge what you know about it
- If the student uploaded documents/images, acknowledge them
- When mentioning skills, note if they're in high demand ("React — very sought after right now!")
- Extract information progressively

COLLECTABLE FIELDS:
- title: A clear, concise project title
- description: What the project is about (2-4 sentences)
- discipline: One of TECHNOLOGY, BUSINESS, DESIGN, HEALTHCARE, ENGINEERING, SOCIAL_SCIENCES, LAW, SCIENCES, ARTS, EDUCATION, TRADES, ARCHITECTURE, MEDIA, WRITING, OTHER
- projectType: e.g. "Web Application", "Research Paper", "Thesis", "Business Plan", "Prototype", "Clinical Study", "Design Portfolio"
- skills: Array of 3-8 specific skills demonstrated
- tools: Array of 2-6 tools/technologies used
- competencies: Array of 2-4 broader competencies (e.g. "Problem Solving", "Teamwork")
- role: Student's role (e.g. "Lead Developer", "Researcher", "Team Lead", "Solo project")
- teamSize: Number of people involved (1 for solo)
- duration: How long the project took (e.g. "3 months", "1 semester")
- courseName: Name of the course if academic
- grade: Grade received (if any)
- professor: Professor's name (if academic)
- outcome: What was the result/impact
- client: Company/organization if done for someone
- githubUrl: Repository URL (if applicable)
- liveUrl: Live demo URL (if applicable)

CURRENT PROJECT DATA (already collected):
${JSON.stringify(currentProjectData, null, 2)}

CONVERSATION FLOW:
1. After first message: Extract what you can. If a company is mentioned, share what you found about it. Note which skills are in demand. Ask about role/team and duration.
2. After learning context: Ask about academic details (course, grade, professor) if relevant for their school level.
3. After that: Ask about outcome/results and any links to share.
4. When complete: Summarize and note which extracted skills match current job market demand.

RESPONSE FORMAT:
Always end your response with:
<project_data>
{ ...fields extracted so far... }
</project_data>
<completeness>NUMBER</completeness>

Conversational text goes BEFORE the tags.`

    // Build Claude messages
    const claudeMessages: Array<{ role: 'user' | 'assistant'; content: any }> = []

    for (const msg of messages) {
      if (msg.role === 'user') {
        const content: any[] = []

        // Add images on first user message
        if (msg === messages[0] && imageUrls.length > 0) {
          for (const url of imageUrls.slice(0, 4)) {
            try {
              const imgRes = await fetch(url, { signal: AbortSignal.timeout(10000) })
              if (imgRes.ok) {
                const buffer = await imgRes.arrayBuffer()
                const base64 = Buffer.from(buffer).toString('base64')
                const contentType = imgRes.headers.get('content-type') || 'image/jpeg'
                content.push({
                  type: 'image',
                  source: { type: 'base64', media_type: contentType, data: base64 },
                })
              }
            } catch { /* skip */ }
          }
        }

        // Add document context
        if (msg === messages[0] && documentUrls.length > 0) {
          const docNames = documentUrls.map((d: any) => d.name || d).join(', ')
          content.push({ type: 'text', text: `[Student attached documents: ${docNames}]\n\n${msg.content}` })
        } else {
          content.push({ type: 'text', text: msg.content })
        }

        claudeMessages.push({ role: 'user', content })
      } else if (msg.role === 'assistant') {
        claudeMessages.push({ role: 'assistant', content: msg.content })
      }
    }

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 1200,
      system: systemPrompt,
      messages: claudeMessages,
    })

    const rawText = response.content[0].type === 'text' ? response.content[0].text : ''

    // Parse response
    let message = rawText
    let projectData: Record<string, any> = {}
    let completeness = 0

    const dataMatch = rawText.match(/<project_data>\s*([\s\S]*?)\s*<\/project_data>/)
    if (dataMatch) {
      try { projectData = JSON.parse(dataMatch[1]) } catch { /* keep empty */ }
      message = rawText.slice(0, rawText.indexOf('<project_data>')).trim()
    }

    const completenessMatch = rawText.match(/<completeness>\s*(\d+)\s*<\/completeness>/)
    if (completenessMatch) {
      completeness = parseInt(completenessMatch[1])
      message = message.replace(/<completeness>\s*\d+\s*<\/completeness>/, '').trim()
    }

    return NextResponse.json({ message, projectData, completeness })
  } catch (error) {
    console.error('Analyze project error:', error)
    return NextResponse.json({ message: '', projectData: {}, completeness: 0, error: 'AI analysis failed' }, { status: 500 })
  }
}
