import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/jwt-verify'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth(req)

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        premiumUntil: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        projects: {
          select: { id: true }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get project count
    const projectCount = user.projects.length

    // TODO: Add analytics queries for AI search count, contact count, etc.
    // For now, return mock data
    const aiSearchCount = 0
    const contactCount = 0

    return NextResponse.json({
      ...user,
      projectCount,
      aiSearchCount,
      contactCount,
      projects: undefined  // Remove full projects array
    })
  } catch (error: any) {
    console.error('Error fetching user subscription:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user subscription' },
      { status: 500 }
    )
  }
}
