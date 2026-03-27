import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/recruiter/contacts
 * Returns contact usage stats based on the recruiter's pricing model
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        subscriptionTier: true,
        contactBalance: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Count total unique contacts ever made
    const totalContacted = await prisma.contactUsage.count({
      where: {
        recruiterId: session.user.id,
      }
    })

    // Phase 1: All recruiters get unlimited access
    return NextResponse.json({
      model: 'unlimited',
      unlimited: true,
      totalContacted,
      tier: user.subscriptionTier,
    })
  } catch (error) {
    console.error('Error fetching contact usage:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact usage' },
      { status: 500 }
    )
  }
}
