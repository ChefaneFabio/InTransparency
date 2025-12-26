import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'
const AI_SERVICE_API_KEY = process.env.AI_SERVICE_API_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    const body = await request.json()
    const { session_id, message, user_role, stream = false } = body

    if (!session_id || !message) {
      return NextResponse.json(
        { error: 'session_id and message are required' },
        { status: 400 }
      )
    }

    // Determine user role from session or request
    const role = user_role || session?.user?.role?.toLowerCase() || 'student'

    // Call AI service
    const aiResponse = await fetch(`${AI_SERVICE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_SERVICE_API_KEY}`
      },
      body: JSON.stringify({
        session_id,
        message,
        user_role: role,
        user_id: session?.user?.id || null,
        stream
      })
    })

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text()
      console.error('AI service error:', errorText)
      return NextResponse.json(
        { error: 'Failed to get AI response' },
        { status: aiResponse.status }
      )
    }

    // Handle streaming response
    if (stream) {
      const reader = aiResponse.body?.getReader()
      if (!reader) {
        return NextResponse.json(
          { error: 'Streaming not available' },
          { status: 500 }
        )
      }

      const encoder = new TextEncoder()
      const decoder = new TextDecoder()

      const readableStream = new ReadableStream({
        async start(controller) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              controller.close()
              break
            }
            controller.enqueue(value)
          }
        }
      })

      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        }
      })
    }

    // Regular response
    const data = await aiResponse.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'session_id is required' },
        { status: 400 }
      )
    }

    // Get conversation history from AI service
    const aiResponse = await fetch(`${AI_SERVICE_URL}/chat/history/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${AI_SERVICE_API_KEY}`
      }
    })

    if (!aiResponse.ok) {
      if (aiResponse.status === 404) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to get history' },
        { status: aiResponse.status }
      )
    }

    const data = await aiResponse.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Chat history error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'session_id is required' },
        { status: 400 }
      )
    }

    // Delete session from AI service
    const aiResponse = await fetch(`${AI_SERVICE_URL}/chat/session/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${AI_SERVICE_API_KEY}`
      }
    })

    if (!aiResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to delete session' },
        { status: aiResponse.status }
      )
    }

    return NextResponse.json({ status: 'success', message: 'Session deleted' })

  } catch (error) {
    console.error('Delete session error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
