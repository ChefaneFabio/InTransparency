import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * GET /api/messages/[id]
 * Get a single message
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    const messageId = params.id

    // Get message
    const message = await prisma.message.findUnique({
      where: { id: messageId },
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

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }

    // Check access
    const isSender = message.senderId === session.user.id
    const isRecipient = message.recipientId === session.user.id || message.recipientEmail === session.user.email
    const isAdmin = session.user.role === 'ADMIN'

    if (!isSender && !isRecipient && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - You do not have access to this message' },
        { status: 403 }
      )
    }

    // Mark as read if recipient is viewing
    if (isRecipient && !message.read) {
      await prisma.message.update({
        where: { id: messageId },
        data: {
          read: true,
          readAt: new Date()
        }
      })
    }

    return NextResponse.json({ message })
  } catch (error: any) {
    console.error('Get message error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch message' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/messages/[id]
 * Delete a message (sender only)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    const messageId = params.id

    // Get message
    const message = await prisma.message.findUnique({
      where: { id: messageId }
    })

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }

    // Check if user is sender or admin
    const isSender = message.senderId === session.user.id
    const isAdmin = session.user.role === 'ADMIN'

    if (!isSender && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Only the sender can delete this message' },
        { status: 403 }
      )
    }

    // Delete message
    await prisma.message.delete({
      where: { id: messageId }
    })

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully'
    })
  } catch (error: any) {
    console.error('Delete message error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete message' },
      { status: 500 }
    )
  }
}
