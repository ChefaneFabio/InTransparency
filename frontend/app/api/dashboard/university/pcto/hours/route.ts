import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// GET /api/dashboard/university/pcto/hours
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
    const studentId = searchParams.get('studentId') || ''
    const activityId = searchParams.get('activityId') || ''

    // Only return hours for activities owned by this institution
    const ownActivityIds = await prisma.pCTOActivity.findMany({
      where: { universityId: session.user.id },
      select: { id: true },
    })
    const activityIds = ownActivityIds.map((a) => a.id)

    if (activityIds.length === 0) {
      return NextResponse.json({ hours: [], studentSummaries: [] })
    }

    const where: any = { activityId: { in: activityIds } }
    if (studentId) where.studentId = studentId
    if (activityId && activityIds.includes(activityId)) where.activityId = activityId

    const hours = await prisma.pCTOHours.findMany({
      where,
      include: {
        activity: { select: { id: true, title: true, activityType: true } },
      },
      orderBy: { date: 'desc' },
    })

    // Per-student summaries
    const studentMap = new Map<string, { totalHours: number; entries: number; activities: Set<string> }>()
    for (let i = 0; i < hours.length; i++) {
      const h = hours[i]
      const existing = studentMap.get(h.studentId)
      if (existing) {
        existing.totalHours += h.hours
        existing.entries += 1
        existing.activities.add(h.activityId)
      } else {
        const actSet = new Set<string>()
        actSet.add(h.activityId)
        studentMap.set(h.studentId, {
          totalHours: h.hours,
          entries: 1,
          activities: actSet,
        })
      }
    }

    const studentSummaries = Array.from(studentMap.entries()).map(([sid, data]) => ({
      studentId: sid,
      totalHours: Math.round(data.totalHours * 10) / 10,
      entries: data.entries,
      activitiesCount: data.activities.size,
    }))

    return NextResponse.json({ hours, studentSummaries })
  } catch (err: any) {
    console.error('[PCTO Hours GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/dashboard/university/pcto/hours — Log hours for a student
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
    const { studentId, activityId, date, hours, notes } = body

    if (!studentId || !activityId || !date || !hours) {
      return NextResponse.json(
        { error: 'studentId, activityId, date, and hours are required' },
        { status: 400 }
      )
    }

    // Verify the activity belongs to this institution
    const activity = await prisma.pCTOActivity.findFirst({
      where: { id: activityId, universityId: session.user.id },
    })

    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
    }

    const entry = await prisma.pCTOHours.create({
      data: {
        studentId,
        activityId,
        date: new Date(date),
        hours: parseFloat(hours),
        notes: notes || null,
      },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (err: any) {
    console.error('[PCTO Hours POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
