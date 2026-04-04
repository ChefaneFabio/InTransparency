import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { anthropic, AI_MODEL } from '@/lib/openai-shared'
import { aiLimiter, getClientIp } from '@/lib/rate-limit'

/**
 * POST /api/ai/analyze-project
 * Conversational project intake — accepts message history, returns AI reply + extracted data.
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

    // Build the system prompt
    const lang = locale === 'it' ? 'Italian' : 'English'
    const systemPrompt = `You are a friendly project intake assistant for InTransparency, a platform where students showcase their academic and personal projects to recruiters.

Your job: have a natural conversation with the student to build a complete project profile. Extract information from what they share, then ask follow-up questions about what's missing.

RULES:
- Respond in ${lang} (or match the student's language if they switch)
- Be warm and encouraging — students are sharing their work
- Ask 1-3 follow-up questions at a time, grouped by topic
- Don't ask about fields that are irrelevant (e.g., don't ask for GitHub URL on a nursing project)
- If the student uploaded documents/images, acknowledge them
- Extract information progressively — don't wait for everything before showing results

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
- outcome: What was the result/impact (e.g. "Published paper", "Deployed to 500 users", "Grade: 30/30")
- client: Company/organization if done for someone
- githubUrl: Repository URL (if applicable)
- liveUrl: Live demo URL (if applicable)

CURRENT PROJECT DATA (already collected):
${JSON.stringify(currentProjectData, null, 2)}

CONVERSATION FLOW:
1. After the first message: Extract what you can (title, description, discipline, skills, tools). Ask about role/team and duration.
2. After learning context: Ask about academic details (course, grade, professor) if relevant.
3. After that: Ask about outcome/results and any links to share.
4. When profile feels complete: Summarize what you've captured and say it's ready to create.

RESPONSE FORMAT:
Always end your response with a JSON block in these exact tags:
<project_data>
{
  "title": "...",
  "description": "...",
  "discipline": "...",
  ...only include fields you're confident about...
}
</project_data>
<completeness>NUMBER</completeness>

The completeness number (0-100) estimates how complete the profile is. Minimum to create: title + description + discipline + skills (around 40%). Full profile with academic context, outcome, and links: 100%.

Your conversational text goes BEFORE the tags. Never put the JSON inside your conversational text.`

    // Build Claude messages
    const claudeMessages: Array<{ role: 'user' | 'assistant'; content: any }> = []

    for (const msg of messages) {
      if (msg.role === 'user') {
        const content: any[] = []

        // Add images if this is the first user message with images
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

        // Add document names as context
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

    // Parse the response: extract conversational text, project data, and completeness
    let message = rawText
    let projectData: Record<string, any> = {}
    let completeness = 0

    // Extract project data JSON
    const dataMatch = rawText.match(/<project_data>\s*([\s\S]*?)\s*<\/project_data>/)
    if (dataMatch) {
      try {
        projectData = JSON.parse(dataMatch[1])
      } catch { /* keep empty */ }
      message = rawText.slice(0, rawText.indexOf('<project_data>')).trim()
    }

    // Extract completeness
    const completenessMatch = rawText.match(/<completeness>\s*(\d+)\s*<\/completeness>/)
    if (completenessMatch) {
      completeness = parseInt(completenessMatch[1])
      // Remove completeness tag from message if still present
      message = message.replace(/<completeness>\s*\d+\s*<\/completeness>/, '').trim()
    }

    return NextResponse.json({
      message,
      projectData,
      completeness,
    })
  } catch (error) {
    console.error('Analyze project error:', error)
    return NextResponse.json({
      message: '',
      projectData: {},
      completeness: 0,
      error: 'AI analysis failed',
    }, { status: 500 })
  }
}
