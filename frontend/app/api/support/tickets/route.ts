import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const ticketSchema = z.object({
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
  category: z.enum(['billing', 'technical', 'account', 'feature_request', 'other']).default('other'),
  priority: z.enum(['low', 'medium', 'high']).optional(),
})

/**
 * POST /api/support/tickets
 * Submit a support ticket. Enterprise users get auto-elevated priority.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        subscriptionTier: true,
        role: true,
        email: true,
        firstName: true,
        lastName: true,
        company: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await req.json()
    const { subject, message, category, priority: requestedPriority } = ticketSchema.parse(body)

    const isDedicatedSupport = user.subscriptionTier === 'RECRUITER_ENTERPRISE' || user.subscriptionTier === 'INSTITUTION_ENTERPRISE'
    const isPrioritySupport = isDedicatedSupport || user.subscriptionTier === 'STUDENT_PREMIUM'

    // Auto-elevate priority for enterprise users
    let effectivePriority = requestedPriority || 'medium'
    if (isDedicatedSupport && effectivePriority === 'low') {
      effectivePriority = 'medium'
    }
    if (isDedicatedSupport && effectivePriority === 'medium') {
      effectivePriority = 'high'
    }

    // Store ticket as an analytics event (or could be a dedicated model)
    // For now, track via analytics and return a ticket reference
    const ticketRef = `TK-${Date.now().toString(36).toUpperCase()}`

    await prisma.analytics.create({
      data: {
        userId: session.user.id,
        eventType: 'CUSTOM',
        eventName: 'support_ticket',
        properties: {
          ticketRef,
          subject,
          message,
          category,
          priority: effectivePriority,
          tier: user.subscriptionTier,
          role: user.role,
          email: user.email,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          company: user.company,
          isDedicatedSupport,
          isPrioritySupport,
        }
      }
    })

    const responseTime = isDedicatedSupport ? '4 hours' : isPrioritySupport ? '24 hours' : '48 hours'

    return NextResponse.json({
      success: true,
      ticket: {
        reference: ticketRef,
        subject,
        category,
        priority: effectivePriority,
        status: 'open',
        expectedResponseTime: responseTime,
        supportEmail: isDedicatedSupport ? 'enterprise@intransparency.com' : 'support@intransparency.com',
      },
      message: `Support ticket ${ticketRef} created. Expected response within ${responseTime}.`,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating support ticket:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to create support ticket' }, { status: 500 })
  }
}
