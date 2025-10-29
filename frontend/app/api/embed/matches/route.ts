import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/embed/matches?institutionId=xxx&limit=5
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const institutionId = searchParams.get('institutionId')
    const limit = parseInt(searchParams.get('limit') || '5')

    if (!institutionId) {
      return NextResponse.json({ error: 'institutionId required' }, { status: 400 })
    }

    // TODO: Add Institution model to schema with subscriptionTier field
    // For now, widget is available to all institutions for demo purposes
    // When Institution model exists, verify Premium Embed access:
    // const institution = await prisma.institution.findUnique({
    //   where: { id: institutionId },
    //   select: { subscriptionTier: true }
    // })
    // if (!['PREMIUM_EMBED', 'ENTERPRISE_CUSTOM'].includes(institution.subscriptionTier)) {
    //   return NextResponse.json({ error: 'Premium Embed subscription required' }, { status: 403 })
    // }

    // TODO: Replace with real data once Match and Institution models are added to schema
    // For now, using mock data to demonstrate widget functionality

    const now = new Date()

    // Mock match data
    const mockMatches = [
      {
        id: '1',
        studentDegree: 'Computer Science',
        companyName: 'BMW Italia',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        matchScore: 95
      },
      {
        id: '2',
        studentDegree: 'Data Science',
        companyName: 'Pirelli',
        timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        matchScore: 89
      },
      {
        id: '3',
        studentDegree: 'Software Engineering',
        companyName: 'Leonardo S.p.A.',
        timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
        matchScore: 87
      },
      {
        id: '4',
        studentDegree: 'Mechanical Engineering',
        companyName: 'Ferrari',
        timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        matchScore: 92
      },
      {
        id: '5',
        studentDegree: 'Business Analytics',
        companyName: 'Enel',
        timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        matchScore: 85
      }
    ]

    const matchEvents = mockMatches.slice(0, limit)

    // Mock stats
    const todayMatches = 12
    const weekMatches = 47
    const activeStudents = 234

    // Track widget view for analytics
    await prisma.analytics.create({
      data: {
        eventType: 'CUSTOM',
        eventName: 'embed_widget_view',
        properties: {
          institutionId,
          matchCount: matchEvents.length
        }
      }
    }).catch(() => {}) // Non-blocking

    return NextResponse.json({
      success: true,
      matches: matchEvents,
      stats: {
        todayMatches,
        weekMatches,
        activeStudents
      }
    })

  } catch (error) {
    console.error('Error fetching widget matches:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
