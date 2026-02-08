import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { z } from 'zod'

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

    // For recruiters, check contact limits based on new tier model
    const isRecruiter = session.user.role === 'RECRUITER'
    const recipientId = validatedData.recipientId

    if (isRecruiter && recipientId) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          subscriptionTier: true,
          contactBalance: true,
        }
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      // RECRUITER_FREE: reject with upgrade message
      if (user.subscriptionTier === 'RECRUITER_FREE' || user.subscriptionTier === 'FREE') {
        return NextResponse.json({
          error: 'Upgrade required to contact candidates',
          upgradeUrl: '/pricing?for=recruiters',
        }, { status: 403 })
      }

      // RECRUITER_PAY_PER_CONTACT: check balance and deduct
      if (user.subscriptionTier === 'RECRUITER_PAY_PER_CONTACT') {
        // Check dedup: already contacted = free re-contact
        const existingContact = await prisma.contactUsage.findFirst({
          where: {
            recruiterId: session.user.id,
            recipientId: recipientId,
          }
        })

        if (!existingContact) {
          // New contact - check balance
          if (user.contactBalance < 1000) {
            return NextResponse.json({
              error: 'Insufficient contact credits. Purchase more credits to contact new candidates.',
              upgradeUrl: '/pricing?for=recruiters',
              balance: user.contactBalance,
              costPerContact: 1000,
            }, { status: 403 })
          }

          // Deduct balance and create message + usage in transaction
          const threadId = validatedData.threadId || `thread_${Date.now()}_${Math.random().toString(36).substring(7)}`

          const result = await prisma.$transaction(async (tx) => {
            // Deduct contact balance
            await tx.user.update({
              where: { id: session.user.id },
              data: {
                contactBalance: { decrement: 1000 },
              },
            })

            const message = await tx.message.create({
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

            // Record contact usage for dedup
            const now = new Date()
            const billingPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1)
            const billingPeriodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)

            await tx.contactUsage.create({
              data: {
                recruiterId: session.user.id,
                recipientId: recipientId,
                billingPeriodStart,
                billingPeriodEnd,
                messageId: message.id,
              }
            })

            return message
          })

          return NextResponse.json({
            success: true,
            message: result,
          }, { status: 201 })
        }

        // Already contacted this student - free re-contact, fall through to create message
      }

      // RECRUITER_ENTERPRISE: allow unlimited, still record ContactUsage for analytics
      // Also handles PAY_PER_CONTACT re-contacts (already contacted student)
      const threadId = validatedData.threadId || `thread_${Date.now()}_${Math.random().toString(36).substring(7)}`

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

      // Record contact usage for analytics (upsert for dedup)
      const now = new Date()
      const billingPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const billingPeriodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)

      await prisma.contactUsage.upsert({
        where: {
          recruiterId_recipientId_billingPeriodStart: {
            recruiterId: session.user.id,
            recipientId: recipientId,
            billingPeriodStart,
          }
        },
        update: {},
        create: {
          recruiterId: session.user.id,
          recipientId: recipientId,
          billingPeriodStart,
          billingPeriodEnd,
          messageId: message.id,
        }
      })

      return NextResponse.json({
        success: true,
        message,
      }, { status: 201 })
    }

    // For students, gate recruiter contact behind STUDENT_PREMIUM
    const isStudent = session.user.role === 'STUDENT'
    if (isStudent && validatedData.recipientId) {
      // Check if recipient is a recruiter
      const recipient = await prisma.user.findUnique({
        where: { id: validatedData.recipientId },
        select: { role: true }
      })

      if (recipient?.role === 'RECRUITER') {
        const student = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { subscriptionTier: true }
        })

        if (student?.subscriptionTier !== 'STUDENT_PREMIUM') {
          return NextResponse.json({
            error: 'Upgrade to Premium to contact recruiters directly',
            upgradeUrl: '/dashboard/student/upgrade',
          }, { status: 403 })
        }
      }
    }

    // For non-recruiters, just create the message
    const threadId = validatedData.threadId || `thread_${Date.now()}_${Math.random().toString(36).substring(7)}`

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
