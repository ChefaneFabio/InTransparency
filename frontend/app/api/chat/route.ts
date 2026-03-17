import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

// In-memory session store (conversations reset on deploy, which is fine for a support chatbot)
const sessions = new Map<string, { role: string; content: string }[]>()
const SESSION_MAX_MESSAGES = 20

const systemPrompts: Record<string, string> = {
  student: `You are Transparenty, the friendly AI assistant for InTransparency — a platform that connects students with companies through verified, institution-backed skill profiles.

You're helping a STUDENT. You can help with:
- Building their profile from projects (theses, code, stage curriculare)
- Finding jobs matching their verified skills
- Career advice specific to their discipline
- Understanding how the platform works
- Explaining match scores and what companies look for

Guidelines:
- Be helpful, concise, and warm
- Use bullet points and bold for key info
- Always be transparent about how data is used (GDPR compliant)
- Suggest actionable next steps
- Keep responses under 250 words unless detailed analysis is needed
- Answer in the same language the user writes in (Italian or English)`,

  recruiter: `You are Transparenty, the AI assistant for InTransparency — a platform with verified, institution-backed student profiles.

You're helping a COMPANY/RECRUITER. You can help with:
- Finding verified candidates across all disciplines
- Understanding match scores and verified skills
- Sourcing tips and search strategies
- Explaining the pay-per-contact model (browse free, €10 per contact)
- Skill demand trends

Guidelines:
- Be professional and efficient
- Emphasize verified skills over self-reported CVs
- Use bullet points and bold for key info
- Keep responses under 250 words
- Answer in the same language the user writes in (Italian or English)`,

  institution: `You are Transparenty, the AI assistant for InTransparency — a platform connecting students to companies through verified profiles.

You're helping an ACADEMIC PARTNER (university, ITS academy, or school). You can help with:
- Setting up a free partnership
- Understanding the analytics dashboard
- Company search intelligence (which companies view your students)
- Early intervention alerts for at-risk students
- Data-driven career counseling
- Placement statistics and reporting

Guidelines:
- Be professional and knowledgeable
- Emphasize the platform is always free for academic partners
- Use bullet points and bold for key info
- Keep responses under 250 words
- Answer in the same language the user writes in (Italian or English)`,
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Chat service not configured' },
        { status: 503 }
      )
    }

    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { session_id, message, user_role, stream = false } = body

    if (!session_id || !message) {
      return NextResponse.json(
        { error: 'session_id and message are required' },
        { status: 400 }
      )
    }

    const role = user_role || session?.user?.role?.toLowerCase() || 'student'
    const systemPrompt = systemPrompts[role] || systemPrompts.student

    // Get or create conversation history
    if (!sessions.has(session_id)) {
      sessions.set(session_id, [])
    }
    const history = sessions.get(session_id)!

    // Add user message
    history.push({ role: 'user', content: message })

    // Trim to last N messages to stay within token limits
    if (history.length > SESSION_MAX_MESSAGES) {
      history.splice(0, history.length - SESSION_MAX_MESSAGES)
    }

    if (stream) {
      const encoder = new TextEncoder()

      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            const stream = anthropic.messages.stream({
              model: 'claude-haiku-4-5-20251001',
              max_tokens: 1000,
              system: systemPrompt,
              messages: history,
            })

            let fullResponse = ''

            stream.on('text', (text) => {
              fullResponse += text
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              )
            })

            stream.on('end', () => {
              // Save assistant response to history
              history.push({ role: 'assistant', content: fullResponse })
              controller.enqueue(encoder.encode('data: [DONE]\n\n'))
              controller.close()
            })

            stream.on('error', (err) => {
              console.error('Claude stream error:', err)
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: 'Sorry, I encountered an error. Please try again.' })}\n\n`)
              )
              controller.enqueue(encoder.encode('data: [DONE]\n\n'))
              controller.close()
            })
          } catch (err) {
            console.error('Stream setup error:', err)
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: 'Sorry, the chat service is temporarily unavailable.' })}\n\n`)
            )
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
          }
        },
      })

      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      })
    }

    // Non-streaming response
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      system: systemPrompt,
      messages: history,
    })

    const assistantMessage =
      response.content[0].type === 'text' ? response.content[0].text : ''

    // Save to history
    history.push({ role: 'assistant', content: assistantMessage })

    return NextResponse.json({
      message: assistantMessage,
      intent: 'general',
      entities: {},
      suggested_actions: [],
      session_id,
      status: 'success',
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')

  if (sessionId) {
    sessions.delete(sessionId)
  }

  return NextResponse.json({ status: 'success', message: 'Session deleted' })
}
