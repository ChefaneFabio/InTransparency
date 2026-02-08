import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * POST /api/student/skill-path/refresh
 * Forces cache invalidation and triggers re-analysis.
 * Respects tier-based refresh cooldowns.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const userTier = (session.user as any).subscriptionTier || 'FREE'

    // Track refresh click
    prisma.analytics.create({
      data: {
        userId,
        eventType: 'BUTTON_CLICK',
        eventName: 'skill_path_refresh',
        properties: { tier: userTier },
      },
    }).catch(() => {}) // Non-blocking

    // Check refresh cooldown
    const existing = await prisma.skillPathRecommendation.findUnique({
      where: { userId },
      select: { generatedAt: true },
    })

    if (existing) {
      const cooldownMinutes = getCooldown(userTier)
      const cooldownMs = cooldownMinutes * 60 * 1000
      const timeSinceGenerated = Date.now() - new Date(existing.generatedAt).getTime()

      if (timeSinceGenerated < cooldownMs) {
        const waitMinutes = Math.ceil((cooldownMs - timeSinceGenerated) / 60000)
        return NextResponse.json(
          { error: `Please wait ${waitMinutes} minute${waitMinutes > 1 ? 's' : ''} before refreshing` },
          { status: 429 }
        )
      }
    }

    // Invalidate cache by deleting it
    await prisma.skillPathRecommendation.deleteMany({
      where: { userId },
    })

    // Redirect to GET endpoint which will regenerate
    const baseUrl = req.nextUrl.origin
    const response = await fetch(`${baseUrl}/api/student/skill-path`, {
      headers: {
        cookie: req.headers.get('cookie') || '',
      },
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error refreshing skill path:', error)
    return NextResponse.json(
      { error: 'Failed to refresh recommendations' },
      { status: 500 }
    )
  }
}

function getCooldown(tier: string): number {
  switch (tier) {
    case 'STUDENT_PREMIUM': return 60 // 1 hour
    default: return 10080 // 7 days
  }
}
