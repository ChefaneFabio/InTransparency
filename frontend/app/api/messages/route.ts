import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { getPricingTier } from '@/lib/config/pricing'

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

    // For recruiters, check contact limits
    const isRecruiter = session.user.role === 'RECRUITER'
    const recipientId = validatedData.recipientId

    if (isRecruiter && recipientId) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          subscriptionTier: true,
          premiumUntil: true,
        }
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const tier = getPricingTier(user.subscriptionTier)
      const contactLimit = tier?.limits.contacts ?? 0

      // Check if contacts are allowed
      if (contactLimit === 0) {
        return NextResponse.json({
          error: 'Upgrade required to contact candidates',
          upgradeUrl: '/pricing?for=recruiters',
        }, { status: 403 })
      }

      // For paid tiers with limits, check usage
      if (contactLimit !== -1) {
        const now = new Date()
        let billingPeriodStart: Date
        let billingPeriodEnd: Date

        if (user.premiumUntil) {
          const premiumDate = new Date(user.premiumUntil)
          const dayOfMonth = premiumDate.getDate()
          billingPeriodStart = new Date(now.getFullYear(), now.getMonth(), dayOfMonth)
          if (billingPeriodStart > now) {
            billingPeriodStart.setMonth(billingPeriodStart.getMonth() - 1)
          }
          billingPeriodEnd = new Date(billingPeriodStart)
          billingPeriodEnd.setMonth(billingPeriodEnd.getMonth() + 1)
        } else {
          billingPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1)
          billingPeriodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        }

        // Check if already contacted this student
        const existingContact = await prisma.contactUsage.findUnique({
          where: {
            recruiterId_recipientId_billingPeriodStart: {
              recruiterId: session.user.id,
              recipientId: recipientId,
              billingPeriodStart: billingPeriodStart,
            }
          }
        })

        if (!existingContact) {
          // Count current usage
          const used = await prisma.contactUsage.count({
            where: {
              recruiterId: session.user.id,
              billingPeriodStart: billingPeriodStart,
            }
          })

          if (used >= contactLimit) {
            return NextResponse.json({
              error: `Contact limit reached (${contactLimit}/month). Upgrade for more contacts.`,
              upgradeUrl: '/pricing?for=recruiters',
              used,
              limit: contactLimit,
            }, { status: 403 })
          }
        }

        // Generate thread ID if not provided
        const threadId = validatedData.threadId || `thread_${Date.now()}_${Math.random().toString(36).substring(7)}`

        // Create message and contact usage in a transaction
        const result = await prisma.$transaction(async (tx) => {
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

          // Record contact usage (upsert to handle same student contacted twice)
          if (!existingContact) {
            await tx.contactUsage.create({
              data: {
                recruiterId: session.user.id,
                recipientId: recipientId,
                billingPeriodStart: billingPeriodStart,
                billingPeriodEnd: billingPeriodEnd,
                messageId: message.id,
              }
            })
          }

          return message
        })

        return NextResponse.json({
          success: true,
          message: result,
        }, { status: 201 })
      }
    }

    // For non-recruiters or unlimited tier, just create the message
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

    // For unlimited tier recruiters, still record contact usage for analytics
    if (isRecruiter && recipientId) {
      const now = new Date()
      const billingPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const billingPeriodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)

      await prisma.contactUsage.upsert({
        where: {
          recruiterId_recipientId_billingPeriodStart: {
            recruiterId: session.user.id,
            recipientId: recipientId,
            billingPeriodStart: billingPeriodStart,
          }
        },
        update: {},
        create: {
          recruiterId: session.user.id,
          recipientId: recipientId,
          billingPeriodStart: billingPeriodStart,
          billingPeriodEnd: billingPeriodEnd,
          messageId: message.id,
        }
      })
    }

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
