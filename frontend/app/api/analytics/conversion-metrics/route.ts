import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/analytics/conversion-metrics - Get conversion funnel data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const plan = searchParams.get('plan')
    const trigger = searchParams.get('trigger')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!plan) {
      return NextResponse.json({ error: 'Plan parameter required' }, { status: 400 })
    }

    // Build date filter
    const dateFilter: any = {}
    if (startDate || endDate) {
      if (startDate) dateFilter.gte = new Date(startDate)
      if (endDate) dateFilter.lte = new Date(endDate)
    }

    // Get prompts shown
    const promptsShown = await prisma.analytics.count({
      where: {
        eventName: 'upgrade_prompt_shown',
        properties: {
          path: ['targetPlan'],
          equals: plan,
          ...(trigger ? { path: ['trigger'], equals: trigger } : {})
        },
        ...(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {})
      }
    })

    // Get prompts clicked
    const promptsClicked = await prisma.analytics.count({
      where: {
        eventName: 'upgrade_prompt_clicked',
        properties: {
          path: ['targetPlan'],
          equals: plan,
          ...(trigger ? { path: ['trigger'], equals: trigger } : {})
        },
        ...(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {})
      }
    })

    // Get conversions completed
    const conversionsCompleted = await prisma.analytics.count({
      where: {
        eventName: 'conversion_completed',
        properties: {
          path: ['plan'],
          equals: plan,
          ...(trigger ? { path: ['source'], equals: trigger } : {})
        },
        ...(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {})
      }
    })

    // Calculate conversion rate
    const conversionRate = promptsShown > 0 ? (conversionsCompleted / promptsShown) : 0

    return NextResponse.json({
      promptsShown,
      clicked: promptsClicked,
      converted: conversionsCompleted,
      conversionRate: parseFloat((conversionRate * 100).toFixed(2))
    })
  } catch (error) {
    console.error('Error fetching conversion metrics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/analytics/conversion-metrics - Get detailed funnel breakdown
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { plan, startDate, endDate } = body

    const dateFilter: any = {}
    if (startDate || endDate) {
      if (startDate) dateFilter.gte = new Date(startDate)
      if (endDate) dateFilter.lte = new Date(endDate)
    }

    // Get all triggers for this plan
    const triggers = await prisma.analytics.findMany({
      where: {
        eventName: 'upgrade_prompt_shown',
        properties: {
          path: ['targetPlan'],
          equals: plan
        },
        ...(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {})
      },
      select: {
        properties: true
      }
    })

    // Extract unique trigger types
    const uniqueTriggers = Array.from(new Set(
      triggers
        .map(t => (t.properties as any)?.trigger)
        .filter(Boolean)
    ))

    // Build funnel for each trigger
    const funnelData = await Promise.all(
      uniqueTriggers.map(async (trigger) => {
        const shown = await prisma.analytics.count({
          where: {
            AND: [
              { eventName: 'upgrade_prompt_shown' },
              { properties: { path: ['targetPlan'], equals: plan } },
              { properties: { path: ['trigger'], equals: trigger } },
              ...(Object.keys(dateFilter).length > 0 ? [{ createdAt: dateFilter }] : [])
            ]
          }
        })

        const clicked = await prisma.analytics.count({
          where: {
            AND: [
              { eventName: 'upgrade_prompt_clicked' },
              { properties: { path: ['targetPlan'], equals: plan } },
              { properties: { path: ['trigger'], equals: trigger } },
              ...(Object.keys(dateFilter).length > 0 ? [{ createdAt: dateFilter }] : [])
            ]
          }
        })

        const converted = await prisma.analytics.count({
          where: {
            AND: [
              { eventName: 'conversion_completed' },
              { properties: { path: ['plan'], equals: plan } },
              { properties: { path: ['source'], equals: trigger } },
              ...(Object.keys(dateFilter).length > 0 ? [{ createdAt: dateFilter }] : [])
            ]
          }
        })

        return {
          trigger,
          shown,
          clicked,
          converted,
          clickRate: shown > 0 ? parseFloat(((clicked / shown) * 100).toFixed(2)) : 0,
          conversionRate: shown > 0 ? parseFloat(((converted / shown) * 100).toFixed(2)) : 0
        }
      })
    )

    return NextResponse.json({
      plan,
      dateRange: { startDate, endDate },
      funnel: funnelData.sort((a, b) => b.shown - a.shown)
    })
  } catch (error) {
    console.error('Error fetching funnel data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
