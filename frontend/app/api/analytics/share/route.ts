import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'


// POST /api/analytics/share - Track share events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { shareType, platform, contentType, contentId } = body

    if (!shareType || !platform) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const userId = request.headers.get('x-user-id')
    const sessionId = request.headers.get('x-session-id')
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    const userAgent = request.headers.get('user-agent')
    const referrer = request.headers.get('referer')

    // Track share event
    await prisma.analytics.create({
      data: {
        userId: userId || undefined,
        eventType: 'SHARE_EVENT',
        eventName: `share_${shareType}_${platform}`,
        properties: {
          shareType,
          platform,
          contentType,
          contentId
        },
        sessionId: sessionId || undefined,
        ipAddress: ipAddress || undefined,
        userAgent: userAgent || undefined,
        referrer: referrer || undefined
      }
    })

    // Update share count on user profile if it's a profile share
    if (userId && shareType === 'profile') {
      // Could add a shareCount field to track viral growth
      // For now, just track in analytics
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking share event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
