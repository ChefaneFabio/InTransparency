import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/student/exchange
 * List student's exchange enrollments
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const enrollments = await prisma.exchangeEnrollment.findMany({
      where: { studentId: session.user.id },
      orderBy: { startDate: 'desc' },
    })

    return NextResponse.json({ enrollments })
  } catch (error) {
    console.error('Error fetching exchange enrollments:', error)
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 })
  }
}

/**
 * POST /api/dashboard/student/exchange
 * Create a new exchange enrollment
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, university: true, country: true },
    })
    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { hostUniversityName, hostCountry, programType, startDate, endDate } = body

    if (!hostUniversityName || !hostCountry || !startDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const enrollment = await prisma.exchangeEnrollment.create({
      data: {
        studentId: session.user.id,
        homeUniversityName: user.university || '',
        homeCountry: user.country || 'IT',
        hostUniversityName,
        hostCountry,
        programType: programType || 'ERASMUS',
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status: 'PLANNED',
      },
    })

    return NextResponse.json({ enrollment }, { status: 201 })
  } catch (error) {
    console.error('Error creating exchange enrollment:', error)
    return NextResponse.json({ error: 'Failed to create enrollment' }, { status: 500 })
  }
}

/**
 * PATCH /api/dashboard/student/exchange
 * Update an exchange enrollment
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { id, status, endDate, verificationDoc } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing enrollment ID' }, { status: 400 })
    }

    // Verify ownership
    const existing = await prisma.exchangeEnrollment.findUnique({ where: { id } })
    if (!existing || existing.studentId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const updateData: Record<string, any> = {}
    if (status !== undefined) updateData.status = status
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null
    if (verificationDoc !== undefined) updateData.verificationDoc = verificationDoc

    const enrollment = await prisma.exchangeEnrollment.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ enrollment })
  } catch (error) {
    console.error('Error updating exchange enrollment:', error)
    return NextResponse.json({ error: 'Failed to update enrollment' }, { status: 500 })
  }
}

/**
 * DELETE /api/dashboard/student/exchange
 * Delete an exchange enrollment
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing enrollment ID' }, { status: 400 })
    }

    const existing = await prisma.exchangeEnrollment.findUnique({ where: { id } })
    if (!existing || existing.studentId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.exchangeEnrollment.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting exchange enrollment:', error)
    return NextResponse.json({ error: 'Failed to delete enrollment' }, { status: 500 })
  }
}
