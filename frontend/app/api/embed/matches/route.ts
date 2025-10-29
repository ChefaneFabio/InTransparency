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

    // Verify institution has Premium Embed access
    const institution = await prisma.institution.findUnique({
      where: { id: institutionId },
      select: { subscriptionTier: true }
    })

    if (!institution || !['PREMIUM_EMBED', 'ENTERPRISE_CUSTOM'].includes(institution.subscriptionTier || '')) {
      return NextResponse.json({
        error: 'Premium Embed subscription required',
        upgradeUrl: 'https://intransparency.com/pricing'
      }, { status: 403 })
    }

    // Get recent matches for this institution
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Fetch recent matches (anonymized for public display)
    const matches = await prisma.match.findMany({
      where: {
        student: {
          institutionId
        },
        createdAt: {
          gte: weekAgo
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        matchScore: true,
        createdAt: true,
        student: {
          select: {
            degree: true
          }
        },
        company: {
          select: {
            name: true
          }
        }
      }
    })

    // Transform to widget format
    const matchEvents = matches.map(match => ({
      id: match.id,
      studentDegree: match.student.degree,
      companyName: match.company.name,
      timestamp: match.createdAt.toISOString(),
      matchScore: Math.round(match.matchScore * 100)
    }))

    // Get stats
    const todayMatches = await prisma.match.count({
      where: {
        student: { institutionId },
        createdAt: { gte: today }
      }
    })

    const weekMatches = await prisma.match.count({
      where: {
        student: { institutionId },
        createdAt: { gte: weekAgo }
      }
    })

    const activeStudents = await prisma.student.count({
      where: {
        institutionId,
        verified: true,
        projects: {
          some: {}
        }
      }
    })

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
