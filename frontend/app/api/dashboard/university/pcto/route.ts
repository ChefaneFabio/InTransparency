import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// GET /api/dashboard/university/pcto — List PCTO activities
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

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || ''
    const activityType = searchParams.get('activityType') || ''

    const where: any = { universityId: session.user.id }
    if (status) where.status = status
    if (activityType) where.activityType = activityType

    const activities = await prisma.pCTOActivity.findMany({
      where,
      include: {
        convention: { select: { id: true, companyName: true, status: true } },
        hours: { select: { id: true, hours: true, studentId: true, status: true } },
      },
      orderBy: { startDate: 'desc' },
    })

    // Add hours summary to each activity
    const activitiesWithSummary = activities.map((a) => {
      let totalHoursLogged = 0
      const studentSet = new Set<string>()
      for (let i = 0; i < a.hours.length; i++) {
        totalHoursLogged += a.hours[i].hours
        studentSet.add(a.hours[i].studentId)
      }
      return {
        ...a,
        hoursSummary: {
          totalHoursLogged: Math.round(totalHoursLogged * 10) / 10,
          uniqueStudents: studentSet.size,
        },
      }
    })

    return NextResponse.json({ activities: activitiesWithSummary })
  } catch (err: any) {
    console.error('[PCTO Activities GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/dashboard/university/pcto — Create a PCTO activity
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const {
      title,
      description,
      activityType,
      companyName,
      location,
      startDate,
      endDate,
      totalHours,
      maxStudents,
      conventionId,
    } = body

    if (!title || !activityType || !startDate || !totalHours) {
      return NextResponse.json(
        { error: 'title, activityType, startDate, and totalHours are required' },
        { status: 400 }
      )
    }

    const activity = await prisma.pCTOActivity.create({
      data: {
        universityId: session.user.id,
        title,
        description: description || null,
        activityType,
        companyName: companyName || null,
        location: location || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        totalHours: parseInt(totalHours, 10),
        maxStudents: maxStudents ? parseInt(maxStudents, 10) : null,
        conventionId: conventionId || null,
      },
    })

    return NextResponse.json(activity, { status: 201 })
  } catch (err: any) {
    console.error('[PCTO Activities POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
