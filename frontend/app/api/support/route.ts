import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/support
 * Returns support options based on user's subscription tier.
 * Enterprise users get priority support with faster response times.
 */
export async function GET() {
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
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const tier = user.subscriptionTier
    const isPrioritySupport = tier === 'RECRUITER_ENTERPRISE' || tier === 'INSTITUTION_ENTERPRISE' || tier === 'STUDENT_PREMIUM'
    const isDedicatedSupport = tier === 'RECRUITER_ENTERPRISE' || tier === 'INSTITUTION_ENTERPRISE'

    // Base support (all tiers)
    const support: any = {
      tier: tier,
      level: isDedicatedSupport ? 'dedicated' : isPrioritySupport ? 'priority' : 'standard',
      channels: {
        helpCenter: {
          available: true,
          url: '/help',
          label: 'Help Center',
        },
        email: {
          available: true,
          address: isDedicatedSupport ? 'enterprise@intransparency.com' : 'support@intransparency.com',
          responseTime: isDedicatedSupport ? '4 hours' : isPrioritySupport ? '24 hours' : '48 hours',
          label: isDedicatedSupport ? 'Priority Email Support' : 'Email Support',
        },
        community: {
          available: true,
          url: '/community',
          label: 'Community Forum',
        },
      },
      responseTime: isDedicatedSupport ? '4 hours' : isPrioritySupport ? '24 hours' : '48 hours',
    }

    // Priority support (STUDENT_PREMIUM + Enterprise tiers)
    if (isPrioritySupport) {
      support.channels.chat = {
        available: true,
        label: 'Live Chat',
        hours: isDedicatedSupport ? '24/7' : 'Business hours (9-18 CET)',
      }
    }

    // Dedicated support (Enterprise tiers only)
    if (isDedicatedSupport) {
      support.channels.phone = {
        available: true,
        number: '+39 02 1234 5678',
        hours: 'Business hours (9-18 CET)',
        label: 'Phone Support',
      }
      support.channels.accountManager = {
        available: true,
        label: 'Dedicated Account Manager',
        description: 'Your dedicated point of contact for strategic support',
      }
      support.channels.onboarding = {
        available: true,
        label: 'Onboarding Session',
        description: 'Personalized setup and training session',
      }
      support.sla = {
        responseTime: '4 hours',
        resolutionTime: '24 hours',
        uptime: '99.9%',
      }
    }

    return NextResponse.json({ support })
  } catch (error) {
    console.error('Error fetching support info:', error)
    return NextResponse.json({ error: 'Failed to fetch support info' }, { status: 500 })
  }
}
