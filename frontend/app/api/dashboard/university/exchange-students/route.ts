import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/university/exchange-students
 * List incoming and outgoing exchange students for the university
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = user.company || ''
    if (!universityName) {
      return NextResponse.json({ error: 'University name not configured' }, { status: 400 })
    }

    const { searchParams } = new URL(req.url)
    const direction = searchParams.get('direction') || 'all' // incoming, outgoing, all

    const whereClause: any = {}
    if (direction === 'incoming') {
      whereClause.hostUniversityName = universityName
    } else if (direction === 'outgoing') {
      whereClause.homeUniversityName = universityName
    } else {
      whereClause.OR = [
        { homeUniversityName: universityName },
        { hostUniversityName: universityName },
      ]
    }

    const enrollments = await prisma.exchangeEnrollment.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            degree: true,
            country: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
    })

    // Split into incoming and outgoing
    const incoming = enrollments.filter((e: any) => e.hostUniversityName === universityName)
    const outgoing = enrollments.filter((e: any) => e.homeUniversityName === universityName)

    // Summary stats
    const countrySet = new Set<string>()
    for (let i = 0; i < enrollments.length; i++) {
      const e = enrollments[i] as any
      countrySet.add(e.hostUniversityName === universityName ? e.homeCountry : e.hostCountry)
    }
    const stats = {
      totalIncoming: incoming.length,
      totalOutgoing: outgoing.length,
      activeIncoming: incoming.filter((e: any) => e.status === 'ACTIVE').length,
      activeOutgoing: outgoing.filter((e: any) => e.status === 'ACTIVE').length,
      countries: Array.from(countrySet),
    }

    return NextResponse.json({ incoming, outgoing, stats })
  } catch (error) {
    console.error('Error fetching exchange students:', error)
    return NextResponse.json({ error: 'Failed to fetch exchange students' }, { status: 500 })
  }
}

/**
 * PATCH /api/dashboard/university/exchange-students
 * Verify an exchange enrollment (by home or host university)
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = user.company || ''
    const body = await req.json()
    const { enrollmentId, verified } = body

    if (!enrollmentId) {
      return NextResponse.json({ error: 'Missing enrollment ID' }, { status: 400 })
    }

    const enrollment = await prisma.exchangeEnrollment.findUnique({ where: { id: enrollmentId } })
    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 })
    }

    const updateData: Record<string, any> = {}
    if (enrollment.homeUniversityName === universityName) {
      updateData.verifiedByHome = verified !== false
    } else if (enrollment.hostUniversityName === universityName) {
      updateData.verifiedByHost = verified !== false
    } else {
      return NextResponse.json({ error: 'Not authorized for this enrollment' }, { status: 403 })
    }

    const updated = await prisma.exchangeEnrollment.update({
      where: { id: enrollmentId },
      data: updateData,
    })

    return NextResponse.json({ enrollment: updated })
  } catch (error) {
    console.error('Error verifying exchange enrollment:', error)
    return NextResponse.json({ error: 'Failed to verify enrollment' }, { status: 500 })
  }
}
