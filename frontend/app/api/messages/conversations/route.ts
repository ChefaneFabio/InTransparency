import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * GET /api/messages/conversations
 * List all unique conversations (grouped by threadId)
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

    // Get all messages involving the user
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { recipientId: session.user.id },
          { recipientEmail: session.user.email },
        ]
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
            role: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Group messages by thread and get latest message for each thread
    const conversationsMap = new Map()

    messages.forEach(message => {
      const threadId = message.threadId || message.id

      if (!conversationsMap.has(threadId)) {
        // Determine the other participant
        let otherParticipant
        if (message.senderId === session.user.id) {
          otherParticipant = {
            email: message.recipientEmail,
            id: message.recipientId,
          }
        } else {
          otherParticipant = message.sender
        }

        conversationsMap.set(threadId, {
          threadId,
          latestMessage: message,
          otherParticipant,
          unreadCount: 0,
        })
      }

      // Count unread messages
      if (!message.read && message.recipientId === session.user.id) {
        const conversation = conversationsMap.get(threadId)
        conversation.unreadCount++
      }
    })

    const conversations = Array.from(conversationsMap.values())

    return NextResponse.json({
      conversations,
      total: conversations.length,
    })
  } catch (error: any) {
    console.error('Get conversations error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}
