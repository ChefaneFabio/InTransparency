import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/recruiter/saved-searches
 * List all saved searches for the current recruiter.
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

    const savedSearches = await prisma.savedSearch.findMany({
      where: { recruiterId: session.user.id },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({
      savedSearches: savedSearches.map(s => ({
        id: s.id,
        name: s.name,
        description: s.description,
        filters: s.filters,
        isActive: s.isActive,
        alertsEnabled: s.alertsEnabled,
        alertFrequency: s.alertFrequency,
        candidateCount: s.candidateCount,
        newMatches: s.newMatches,
        lastRunAt: s.lastRunAt?.toISOString() || null,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
      })),
      total: savedSearches.length,
    })
  } catch (error) {
    console.error('Error fetching saved searches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch saved searches' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/dashboard/recruiter/saved-searches
 * Create a new saved search. Body: { name, description?, filters, alertsEnabled?, alertFrequency? }
 * After creating, counts matching candidates based on filters.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const {
      name,
      description,
      filters,
      alertsEnabled,
      alertFrequency,
    } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    if (!filters || typeof filters !== 'object') {
      return NextResponse.json({ error: 'Filters object is required' }, { status: 400 })
    }

    // Count matching candidates based on the provided filters
    const candidateCount = await countMatchingCandidates(filters)

    const savedSearch = await prisma.savedSearch.create({
      data: {
        recruiterId: session.user.id,
        name: name.trim(),
        description: description || null,
        filters,
        alertsEnabled: alertsEnabled ?? false,
        alertFrequency: alertFrequency || 'daily',
        candidateCount,
        lastRunAt: new Date(),
      },
    })

    return NextResponse.json({
      savedSearch: {
        id: savedSearch.id,
        name: savedSearch.name,
        description: savedSearch.description,
        filters: savedSearch.filters,
        isActive: savedSearch.isActive,
        alertsEnabled: savedSearch.alertsEnabled,
        alertFrequency: savedSearch.alertFrequency,
        candidateCount: savedSearch.candidateCount,
        newMatches: savedSearch.newMatches,
        lastRunAt: savedSearch.lastRunAt?.toISOString() || null,
        createdAt: savedSearch.createdAt.toISOString(),
        updatedAt: savedSearch.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('Error creating saved search:', error)
    return NextResponse.json(
      { error: 'Failed to create saved search' },
      { status: 500 }
    )
  }
}

/**
 * Count matching candidates based on saved search filters.
 * Builds a rough Prisma query from the filters JSON.
 */
async function countMatchingCandidates(filters: Record<string, unknown>): Promise<number> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      role: 'STUDENT',
      profilePublic: true,
    }

    // University filter
    if (filters.university && typeof filters.university === 'string') {
      where.university = { contains: filters.university, mode: 'insensitive' }
    }

    // Degree/major filter
    if (filters.major && typeof filters.major === 'string') {
      where.degree = { contains: filters.major, mode: 'insensitive' }
    }

    // Graduation year filter
    if (filters.graduationYear && typeof filters.graduationYear === 'string') {
      where.graduationYear = filters.graduationYear
    }

    // Skills filter
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

    // Search text filter
    if (filters.search && typeof filters.search === 'string') {
      const search = filters.search
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
      ]
    }

    const count = await prisma.user.count({ where })
    return count
  } catch (error) {
    console.error('Error counting matching candidates:', error)
    return 0
  }
}
