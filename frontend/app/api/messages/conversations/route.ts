import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/messages/conversations
 * List all unique conversations (grouped by threadId) in the shape
 * the recruiter/student messages pages expect:
 * { threadId, subject, lastMessage, unreadCount, participants[], updatedAt }
 */
export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized - Please sign in' }, { status: 401 })
    }

    const userId = session.user.id
    const userEmail = session.user.email

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { recipientId: userId },
          ...(userEmail ? [{ recipientEmail: userEmail }] : []),
        ],
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
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Collect recipient IDs that are not the current user and not already seen as senders
    const recipientIds = new Set<string>()
    for (const m of messages) {
      if (m.recipientId && m.recipientId !== userId) recipientIds.add(m.recipientId)
    }

    const recipientUsers = recipientIds.size
      ? await prisma.user.findMany({
          where: { id: { in: Array.from(recipientIds) } },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            photo: true,
            company: true,
          },
        })
      : []
    const recipientById = new Map(recipientUsers.map(u => [u.id, u]))

    type Participant = {
      id: string
      firstName: string
      lastName: string
      email: string
      photo?: string | null
      company?: string | null
    }

    const conversationsMap = new Map<
      string,
      {
        threadId: string
        subject: string
        lastMessage: string
        unreadCount: number
        participants: Participant[]
        updatedAt: string
      }
    >()

    for (const message of messages) {
      const threadId = message.threadId || message.id

      // Resolve "other" participant
      const isSelfSender = message.senderId === userId
      let other: Participant | null = null
      if (isSelfSender) {
        if (message.recipientId) {
          const u = recipientById.get(message.recipientId)
          if (u) {
            other = {
              id: u.id,
              firstName: u.firstName || '',
              lastName: u.lastName || '',
              email: u.email || message.recipientEmail,
              photo: u.photo,
              company: u.company,
            }
          }
        }
        if (!other) {
          other = {
            id: message.recipientId || message.recipientEmail,
            firstName: '',
            lastName: '',
            email: message.recipientEmail,
          }
        }
      } else if (message.sender) {
        other = {
          id: message.sender.id,
          firstName: message.sender.firstName || '',
          lastName: message.sender.lastName || '',
          email: message.sender.email,
          photo: message.sender.photo,
          company: message.sender.company,
        }
      }

      const me: Participant = {
        id: userId,
        firstName: session.user.firstName || '',
        lastName: session.user.lastName || '',
        email: userEmail || '',
      }

      if (!conversationsMap.has(threadId)) {
        conversationsMap.set(threadId, {
          threadId,
          subject: message.subject || '(no subject)',
          lastMessage: message.content?.slice(0, 200) || '',
          unreadCount: 0,
          participants: other ? [me, other] : [me],
          updatedAt: message.createdAt.toISOString(),
        })
      }

      if (!message.read && message.recipientId === userId) {
        const conversation = conversationsMap.get(threadId)!
        conversation.unreadCount += 1
      }
    }

    const conversations = Array.from(conversationsMap.values())
    return NextResponse.json({ conversations, total: conversations.length })
  } catch (error: any) {
    console.error('Get conversations error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}
