import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// POST /api/analytics - Track analytics event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      eventType,
      eventName,
      properties,
      pageUrl,
      pagePath,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent
    } = body

    if (!eventType || !eventName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get user ID if authenticated
    const userId = request.headers.get('x-user-id')
    const sessionId = request.headers.get('x-session-id')
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    const userAgent = request.headers.get('user-agent')
    const referrer = request.headers.get('referer')

    // Create analytics event
    await prisma.analytics.create({
      data: {
        userId: userId || undefined,
        eventType,
        eventName,
        properties: properties || undefined,
        sessionId: sessionId || undefined,
        ipAddress: ipAddress || undefined,
        userAgent: userAgent || undefined,
        referrer: referrer || undefined,
        pageUrl: pageUrl || undefined,
        pagePath: pagePath || undefined,
        utmSource: utmSource || undefined,
        utmMedium: utmMedium || undefined,
        utmCampaign: utmCampaign || undefined,
        utmTerm: utmTerm || undefined,
        utmContent: utmContent || undefined
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/analytics - Get analytics data (admin only)
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const eventType = searchParams.get('eventType')
    const eventName = searchParams.get('eventName')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const limit = parseInt(searchParams.get('limit') || '100')

    // Build query
    const where: any = {}
    if (eventType) where.eventType = eventType
    if (eventName) where.eventName = eventName
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate)
      if (endDate) where.createdAt.lte = new Date(endDate)
    }

    // Get analytics events
    const events = await prisma.analytics.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    // Get aggregated stats
    const totalEvents = await prisma.analytics.count({ where })

    const eventsByType = await prisma.analytics.groupBy({
      by: ['eventType'],
      where,
      _count: true
    })

    const eventsByName = await prisma.analytics.groupBy({
      by: ['eventName'],
      where,
      _count: true,
      orderBy: {
        _count: {
          eventName: 'desc'
        }
      },
      take: 20
    })

    return NextResponse.json({
      events,
      stats: {
        totalEvents,
        eventsByType,
        eventsByName
      }
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
