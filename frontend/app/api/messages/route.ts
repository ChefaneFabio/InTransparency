import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { createNotification } from '@/lib/notifications'

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
          email: true,
          subscriptionTier: true,
          contactBalance: true,
        }
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      // Position-listing pay-per-position tier was retired with the per-contact
      // dismantling (commit 1e27cbe). Legacy active listings are still honored
      // until they expire — read-only check, no new ones can be created.
      const activePositionListing = await prisma.positionListing.findFirst({
        where: {
          recruiterId: session.user.id,
          status: 'ACTIVE',
          expiresAt: { gt: new Date() },
        },
        orderBy: { expiresAt: 'asc' },
      })

      if (activePositionListing) {
        // Legacy listing — grant unlimited contacts until it expires naturally.
        const existingContact = await prisma.contactUsage.findFirst({
          where: {
            recruiterId: session.user.id,
            recipientId: recipientId,
          }
        })

        if (!existingContact) {
          await prisma.positionListing.update({
            where: { id: activePositionListing.id },
            data: { contactsUsed: { increment: 1 } },
          })
        }

        // Position listing grants unlimited contacts — skip balance checks below
        // Fall through to the message creation at the end of the function
      }

      // FREE / RECRUITER_FREE / RECRUITER_PAY_PER_CONTACT: 5 free unique contacts
      // PER MONTH per company domain. After that, subscribe to continue.
      // Per-contact credit purchases were retired 2026-04-25 — the only path
      // forward after exhausting the free quota is the subscription tier.
      const FREE_CONTACT_LIMIT = 5
      const isFreemiumTier =
        user.subscriptionTier === 'RECRUITER_FREE' ||
        user.subscriptionTier === 'FREE' ||
        user.subscriptionTier === 'RECRUITER_PAY_PER_CONTACT'

      if (!activePositionListing && isFreemiumTier) {
        const existingContact = await prisma.contactUsage.findFirst({
          where: { recruiterId: session.user.id, recipientId: recipientId },
        })

        if (!existingContact) {
          // Monthly window — quota resets on the 1st each month so recruiters
          // get a recurring trial moment that nudges to subscription.
          const now = new Date()
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

          // Count free contacts across the entire company domain (prevents
          // creating multiple accounts to get extra free contacts).
          const emailDomain = user.email.split('@')[1]?.toLowerCase()
          const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 'icloud.com', 'mail.com', 'protonmail.com']
          const isCompanyDomain = emailDomain && !freeProviders.includes(emailDomain)

          let monthlyDomainContactCount = 0
          if (isCompanyDomain) {
            const domainRecruiters = await prisma.user.findMany({
              where: {
                email: { endsWith: `@${emailDomain}` },
                role: 'RECRUITER',
              },
              select: { id: true },
            })
            const domainRecruiterIds = domainRecruiters.map(r => r.id)
            monthlyDomainContactCount = await prisma.contactUsage.count({
              where: {
                recruiterId: { in: domainRecruiterIds },
                firstContactAt: { gte: startOfMonth },
              },
            })
          } else {
            monthlyDomainContactCount = await prisma.contactUsage.count({
              where: {
                recruiterId: session.user.id,
                firstContactAt: { gte: startOfMonth },
              },
            })
          }

          if (monthlyDomainContactCount >= FREE_CONTACT_LIMIT) {
            return NextResponse.json({
              error: isCompanyDomain
                ? `Your company (${emailDomain}) has used all ${FREE_CONTACT_LIMIT} free contacts this month. Subscribe for unlimited contacts.`
                : `You've used all ${FREE_CONTACT_LIMIT} free contacts this month. Subscribe for unlimited contacts.`,
              upgradeUrl: '/pricing?for=companies&plan=subscription',
              code: 'FREE_QUOTA_EXHAUSTED',
              freeContactsUsedThisMonth: monthlyDomainContactCount,
              freeContactLimit: FREE_CONTACT_LIMIT,
              resetsOn: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString(),
            }, { status: 403 })
          }
        }
        // Free contact allowed — fall through to message creation
      }

      // RECRUITER_ENTERPRISE (€89/mo subscription + enterprise) / re-contacts:
      // unlimited. Still record ContactUsage for dedup + analytics.
      // (Per-contact credit purchases retired 2026-04-25 — freemium tiers
      // hit the gate above, paid tiers fall through here.)
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

      // Notify the recipient
      if (recipientId) {
        const senderName = [message.sender.firstName, message.sender.lastName].filter(Boolean).join(' ') || 'A recruiter'
        await createNotification({
          userId: recipientId,
          type: 'MESSAGE_RECEIVED',
          title: 'New Message from Recruiter',
          body: `${senderName} sent you a message${validatedData.subject ? `: ${validatedData.subject}` : ''}`,
          link: `/dashboard/student/messages?thread=${threadId}`,
          groupKey: `msg-${threadId}`,
        }).catch(() => {})
      }

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

    // Notify the recipient
    if (validatedData.recipientId) {
      const senderName = [message.sender.firstName, message.sender.lastName].filter(Boolean).join(' ') || 'Someone'
      await createNotification({
        userId: validatedData.recipientId,
        type: 'MESSAGE_RECEIVED',
        title: 'New Message',
        body: `${senderName} sent you a message${validatedData.subject ? `: ${validatedData.subject}` : ''}`,
        link: `/dashboard/${session.user.role?.toLowerCase() || 'student'}/messages?thread=${threadId}`,
        groupKey: `msg-${threadId}`,
      }).catch(() => {}) // Don't fail the message send if notification fails
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
