import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const sendMessageSchema = z.object({
  recipientId: z.string().optional().nullable(),
  recipientEmail: z.string().email('Invalid recipient email'),
  subject: z.string().optional().nullable(),
  content: z.string().min(1, 'Message content is required'),
  threadId: z.string().optional().nullable(),
  replyToId: z.string().optional().nullable(),
})

/**
 * GET /api/messages
 * List all messages (conversations)
 */
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const threadId = searchParams.get('threadId')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build where clause
    const where: any = {
      OR: [
        { senderId: session.user.id },
        { recipientId: session.user.id },
        { recipientEmail: session.user.email },
      ]
    }

    if (threadId) {
      where.threadId = threadId
    }

    if (unreadOnly) {
      where.read = false
      where.recipientId = session.user.id
    }

    // Get messages
    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              photo: true,
              company: true,
              role: true,
            }
          }
        },
        orderBy: {
          createdAt: threadId ? 'asc' : 'desc'
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.message.count({ where })
    ])

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    })
  } catch (error: any) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/messages
 * Send a new message
 */
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = sendMessageSchema.parse(body)

    // Generate thread ID if not provided (for new conversations)
    const threadId = validatedData.threadId || `thread_${Date.now()}_${Math.random().toString(36).substring(7)}`

    // Create message
    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        recipientEmail: validatedData.recipientEmail,
        recipientId: validatedData.recipientId || null,
        subject: validatedData.subject,
        content: validatedData.content,
        threadId,
        replyToId: validatedData.replyToId,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            photo: true,
            company: true,
          }
        }
      }
    })

    // TODO: Send email notification if recipient is not online
    // TODO: Emit Socket.io event for real-time delivery

    return NextResponse.json({
      success: true,
      message,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Send message error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    )
  }
}
