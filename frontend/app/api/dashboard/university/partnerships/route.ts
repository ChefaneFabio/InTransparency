import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/university/partnerships
 * List all partnerships for the authenticated institution.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'UNIVERSITY' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const settings = await prisma.universitySettings.findUnique({
      where: { userId: session.user.id },
    })

    if (!settings) {
      return NextResponse.json({ partnerships: [] })
    }

    const partnerships = await prisma.institutionPartnership.findMany({
      where: {
        OR: [
          { institutionAId: settings.id },
          { institutionBId: settings.id },
        ],
      },
      include: {
        institutionA: {
          select: { id: true, name: true, shortName: true, city: true, country: true },
        },
        institutionB: {
          select: { id: true, name: true, shortName: true, city: true, country: true },
        },
        courseEquivalencies: {
          select: {
            id: true,
            sourceCourseName: true,
            targetCourseName: true,
            sourceCredits: true,
            targetCredits: true,
            approved: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Reshape: always show "partner" from perspective of current institution
    const result = partnerships.map((p) => {
      const isA = p.institutionAId === settings.id
      const partner = isA ? p.institutionB : p.institutionA
      return {
        id: p.id,
        partner: {
          id: partner.id,
          name: partner.name || partner.shortName || 'Unknown',
          city: partner.city,
          country: partner.country,
        },
        status: p.status,
        exchangeType: p.exchangeType,
        maxStudents: p.maxStudents,
        startDate: p.startDate,
        endDate: p.endDate,
        courseEquivalencies: p.courseEquivalencies,
        createdAt: p.createdAt,
      }
    })

    return NextResponse.json({ partnerships: result })
  } catch (error) {
    console.error('Error fetching partnerships:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/dashboard/university/partnerships
 * Create a new partnership request.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'UNIVERSITY' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const settings = await prisma.universitySettings.findUnique({
      where: { userId: session.user.id },
    })

    if (!settings) {
      return NextResponse.json({ error: 'University settings not found' }, { status: 404 })
    }

    const body = await request.json()
    const { partnerInstitutionId, exchangeType, maxStudents, notes } = body

    if (!partnerInstitutionId) {
      return NextResponse.json({ error: 'Partner institution required' }, { status: 400 })
    }

    if (partnerInstitutionId === settings.id) {
      return NextResponse.json({ error: 'Cannot partner with yourself' }, { status: 400 })
    }

    // Check if partnership already exists
    const existing = await prisma.institutionPartnership.findFirst({
      where: {
        OR: [
          { institutionAId: settings.id, institutionBId: partnerInstitutionId },
          { institutionAId: partnerInstitutionId, institutionBId: settings.id },
        ],
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'Partnership already exists' }, { status: 409 })
    }

    const partnership = await prisma.institutionPartnership.create({
      data: {
        institutionAId: settings.id,
        institutionBId: partnerInstitutionId,
        exchangeType: exchangeType || 'BILATERAL',
        maxStudents: maxStudents || null,
        notes: notes || null,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ partnership }, { status: 201 })
  } catch (error) {
    console.error('Error creating partnership:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
