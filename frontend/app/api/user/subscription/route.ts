import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const userId = session.user.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        premiumUntil: true,
        contactBalance: true,
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
