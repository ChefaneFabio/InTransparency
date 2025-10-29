import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// POST /api/analytics/revenue - Track revenue from conversions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { plan, revenue, source, userId, timestamp } = body

    if (!plan || !revenue || !source) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get session info
    const sessionId = request.headers.get('x-session-id')
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')

    // Track as analytics event with revenue data
    await prisma.analytics.create({
      data: {
        userId: userId || undefined,
        eventType: 'SUBSCRIPTION_STARTED',
        eventName: 'revenue_tracked',
        properties: {
          plan,
          revenue: parseFloat(revenue.toString()),
          source,
          timestamp: timestamp ? new Date(timestamp).toISOString() : new Date().toISOString()
        },
        sessionId: sessionId || undefined,
        ipAddress: ipAddress || undefined
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking revenue:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/analytics/revenue - Get revenue analytics (admin only)
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
    const plan = searchParams.get('plan')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build query for Analytics table
    const where: any = {
      eventName: 'revenue_tracked'
    }

    if (plan) {
      where.properties = {
        path: ['plan'],
        equals: plan
      }
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate)
      if (endDate) where.createdAt.lte = new Date(endDate)
    }

    // Get revenue events from Analytics
    const revenueEvents = await prisma.analytics.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        userId: true,
        createdAt: true,
        properties: true
      }
    })

    // Transform and calculate totals
    const transformedEvents = revenueEvents.map(event => {
      const props = event.properties as any
      return {
        id: event.id,
        userId: event.userId,
        plan: props.plan,
        revenue: props.revenue,
        source: props.source,
        timestamp: event.createdAt
      }
    })

    const totalRevenue = transformedEvents.reduce((sum, event) => sum + (event.revenue || 0), 0)
    const totalConversions = transformedEvents.length

    // Group by plan
    const revenueByPlanMap = new Map<string, { revenue: number; count: number }>()
    transformedEvents.forEach(event => {
      const existing = revenueByPlanMap.get(event.plan) || { revenue: 0, count: 0 }
      revenueByPlanMap.set(event.plan, {
        revenue: existing.revenue + event.revenue,
        count: existing.count + 1
      })
    })

    // Group by source
    const revenueBySourceMap = new Map<string, { revenue: number; count: number }>()
    transformedEvents.forEach(event => {
      const existing = revenueBySourceMap.get(event.source) || { revenue: 0, count: 0 }
      revenueBySourceMap.set(event.source, {
        revenue: existing.revenue + event.revenue,
        count: existing.count + 1
      })
    })

    return NextResponse.json({
      events: transformedEvents,
      stats: {
        totalRevenue,
        totalConversions,
        revenueByPlan: Array.from(revenueByPlanMap.entries()).map(([plan, data]) => ({
          plan,
          _sum: { revenue: data.revenue },
          _count: data.count
        })),
        revenueBySource: Array.from(revenueBySourceMap.entries()).map(([source, data]) => ({
          source,
          _sum: { revenue: data.revenue },
          _count: data.count
        }))
      }
    })
  } catch (error) {
    console.error('Error fetching revenue analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
