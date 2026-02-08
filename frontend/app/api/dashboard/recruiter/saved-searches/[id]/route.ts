import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * PUT /api/dashboard/recruiter/saved-searches/[id]
 * Update a saved search (name, description, filters, isActive, alertsEnabled, alertFrequency).
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Verify the saved search belongs to this recruiter
    const existing = await prisma.savedSearch.findFirst({
      where: { id, recruiterId: session.user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Saved search not found' }, { status: 404 })
    }

    const body = await req.json()
    const {
      name,
      description,
      filters,
      isActive,
      alertsEnabled,
      alertFrequency,
    } = body

    // Build update data only for provided fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {}

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 })
      }
      updateData.name = name.trim()
    }

    if (description !== undefined) {
      updateData.description = description || null
    }

    if (filters !== undefined) {
      if (typeof filters !== 'object' || filters === null) {
        return NextResponse.json({ error: 'Filters must be a valid object' }, { status: 400 })
      }
      updateData.filters = filters

      // Re-count matching candidates when filters change
      updateData.candidateCount = await countMatchingCandidates(filters)
      updateData.lastRunAt = new Date()
    }

    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive)
    }

    if (alertsEnabled !== undefined) {
      updateData.alertsEnabled = Boolean(alertsEnabled)
    }

    if (alertFrequency !== undefined) {
      const validFrequencies = ['daily', 'weekly', 'monthly', 'never']
      if (!validFrequencies.includes(alertFrequency)) {
        return NextResponse.json(
          { error: `alertFrequency must be one of: ${validFrequencies.join(', ')}` },
          { status: 400 }
        )
      }
      updateData.alertFrequency = alertFrequency
    }

    const updated = await prisma.savedSearch.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      savedSearch: {
        id: updated.id,
        name: updated.name,
        description: updated.description,
        filters: updated.filters,
        isActive: updated.isActive,
        alertsEnabled: updated.alertsEnabled,
        alertFrequency: updated.alertFrequency,
        candidateCount: updated.candidateCount,
        newMatches: updated.newMatches,
        lastRunAt: updated.lastRunAt?.toISOString() || null,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('Error updating saved search:', error)
    return NextResponse.json(
      { error: 'Failed to update saved search' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/dashboard/recruiter/saved-searches/[id]
 * Delete a saved search.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Verify the saved search belongs to this recruiter
    const existing = await prisma.savedSearch.findFirst({
      where: { id, recruiterId: session.user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Saved search not found' }, { status: 404 })
    }

    await prisma.savedSearch.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting saved search:', error)
    return NextResponse.json(
      { error: 'Failed to delete saved search' },
      { status: 500 }
    )
  }
}

/**
 * Count matching candidates based on saved search filters.
 */
async function countMatchingCandidates(filters: Record<string, unknown>): Promise<number> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
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

    return await prisma.user.count({ where })
  } catch (error) {
    console.error('Error counting matching candidates:', error)
    return 0
  }
}
