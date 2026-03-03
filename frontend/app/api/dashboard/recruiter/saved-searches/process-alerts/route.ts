import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

/**
 * POST /api/dashboard/recruiter/saved-searches/process-alerts
 *
 * Cron-callable endpoint that processes all active saved searches with alerts enabled.
 * For each search, re-counts matching candidates and notifies recruiters of new matches.
 *
 * Protected by CRON_SECRET header to prevent unauthorized access.
 * Can also be called by ADMIN users.
 */
export async function POST(req: NextRequest) {
  try {
    // Auth: either cron secret or admin session
    const cronSecret = req.headers.get('x-cron-secret')
    const isAuthorizedCron = cronSecret && cronSecret === process.env.CRON_SECRET

    if (!isAuthorizedCron) {
      // Check for admin session
      const { getServerSession } = await import('next-auth/next')
      const { authOptions } = await import('@/lib/auth/config')
      const session = await getServerSession(authOptions)
      if (!session?.user?.id || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    // Get frequency from query (default: daily)
    const url = new URL(req.url)
    const frequency = url.searchParams.get('frequency') || 'daily'

    // Find all saved searches with alerts enabled that match the frequency
    const searches = await prisma.savedSearch.findMany({
      where: {
        isActive: true,
        alertsEnabled: true,
        alertFrequency: frequency,
      },
      include: {
        recruiter: {
          select: { id: true, firstName: true, email: true },
        },
      },
    })

    let processed = 0
    let notified = 0

    for (const search of searches) {
      const filters = search.filters as Record<string, unknown>
      const previousCount = search.candidateCount

      // Recount matching candidates
      const currentCount = await countMatchingCandidates(filters)
      const newMatches = Math.max(0, currentCount - previousCount)

      // Update the saved search with new counts
      await prisma.savedSearch.update({
        where: { id: search.id },
        data: {
          candidateCount: currentCount,
          newMatches,
          lastRunAt: new Date(),
        },
      })

      processed++

      // Only notify if there are genuinely new matches
      if (newMatches > 0) {
        await createNotification({
          userId: search.recruiterId,
          type: 'GENERAL',
          title: `${newMatches} new candidate${newMatches > 1 ? 's' : ''} match "${search.name}"`,
          body: `Your saved search found ${newMatches} new student${newMatches > 1 ? 's' : ''} matching your criteria.`,
          link: `/dashboard/recruiter/saved-searches`,
          groupKey: `saved-search-${search.id}`,
        })
        notified++
      }
    }

    return NextResponse.json({
      processed,
      notified,
      frequency,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error processing saved search alerts:', error)
    return NextResponse.json(
      { error: 'Failed to process alerts' },
      { status: 500 }
    )
  }
}

/**
 * Count matching candidates based on saved search filters.
 * Duplicated from parent route to keep this endpoint self-contained.
 */
async function countMatchingCandidates(filters: Record<string, unknown>): Promise<number> {
  try {
    const where: Record<string, unknown> = {
      role: 'STUDENT',
      profilePublic: true,
    }

    if (filters.university && typeof filters.university === 'string') {
      where.university = { contains: filters.university, mode: 'insensitive' }
    }

    if (filters.major && typeof filters.major === 'string') {
      where.degree = { contains: filters.major, mode: 'insensitive' }
    }

    if (filters.graduationYear && typeof filters.graduationYear === 'string') {
      where.graduationYear = filters.graduationYear
    }

    if (filters.skills) {
      let skillsList: string[] = []
      if (typeof filters.skills === 'string') {
        skillsList = filters.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
      } else if (Array.isArray(filters.skills)) {
        skillsList = filters.skills.filter((s): s is string => typeof s === 'string')
      }
      if (skillsList.length > 0) {
        where.projects = {
          some: {
            isPublic: true,
            OR: [
              { skills: { hasSome: skillsList } },
              { technologies: { hasSome: skillsList } },
            ],
          },
        }
      }
    }

    if (filters.search && typeof filters.search === 'string') {
      const search = filters.search
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
      ]
    }

    return await prisma.user.count({ where: where as any })
  } catch (error) {
    console.error('Error counting matching candidates:', error)
    return 0
  }
}
