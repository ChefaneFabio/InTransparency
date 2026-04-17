import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

interface RouteContext {
  params: Promise<{ id: string }>
}

// GET /api/dashboard/university/stages/[id] — stage detail + check-ins
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await context.params
    const universityName = user.company || ''

    const stage = await prisma.stageExperience.findFirst({
      where: { id, universityName },
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true, email: true, photo: true, degree: true, university: true },
        },
      },
    })

    if (!stage) return NextResponse.json({ error: 'Stage not found' }, { status: 404 })

    // Get check-ins for this stage
    const checkIns = await prisma.internshipLog.findMany({
      where: { stageId: id },
      orderBy: { date: 'desc' },
    })

    // Hours by week for chart
    const weeklyHours: Record<string, number> = {}
    for (const log of checkIns) {
      const week = getWeekKey(log.date)
      weeklyHours[week] = (weeklyHours[week] || 0) + log.hoursWorked
    }

    // Attendance stats
    const attendance = {
      present: checkIns.filter(c => c.status === 'PRESENT').length,
      absent: checkIns.filter(c => c.status === 'ABSENT').length,
      late: checkIns.filter(c => c.status === 'LATE').length,
      excused: checkIns.filter(c => c.status === 'EXCUSED').length,
    }
    const totalCheckIns = checkIns.length
    const attendanceRate = totalCheckIns > 0 ? Math.round((attendance.present / totalCheckIns) * 100) : 0

    // Progress alerts
    const alerts: Array<{ type: 'warning' | 'info' | 'success'; messageKey: string; data?: any }> = []

    if (stage.status === 'ACTIVE') {
      const daysSinceStart = Math.floor((Date.now() - stage.startDate.getTime()) / 86400000)
      const totalDays = stage.endDate ? Math.floor((stage.endDate.getTime() - stage.startDate.getTime()) / 86400000) : null
      const expectedHours = stage.targetHours && totalDays ? Math.round((daysSinceStart / totalDays) * stage.targetHours) : null

      if (expectedHours && stage.completedHours < expectedHours * 0.7) {
        alerts.push({ type: 'warning', messageKey: 'behindOnHours', data: { completed: stage.completedHours, expected: expectedHours } })
      }

      const daysSinceLastCheckIn = checkIns.length > 0
        ? Math.floor((Date.now() - checkIns[0].date.getTime()) / 86400000)
        : daysSinceStart
      if (daysSinceLastCheckIn > 14) {
        alerts.push({ type: 'warning', messageKey: 'noRecentCheckIn', data: { days: daysSinceLastCheckIn } })
      }

      if (stage.targetHours && stage.completedHours >= stage.targetHours * 0.9) {
        alerts.push({ type: 'success', messageKey: 'nearCompletion', data: { percent: Math.round((stage.completedHours / stage.targetHours) * 100) } })
      }

      if (totalDays && daysSinceStart > totalDays * 0.5 && !stage.supervisorCompleted) {
        alerts.push({ type: 'info', messageKey: 'midtermEvalDue' })
      }
    }

    return NextResponse.json({
      stage: {
        id: stage.id,
        studentName: [stage.student.firstName, stage.student.lastName].filter(Boolean).join(' '),
        studentEmail: stage.student.email,
        studentPhoto: stage.student.photo,
        studentDegree: stage.student.degree,
        companyName: stage.companyName,
        companyIndustry: stage.companyIndustry,
        role: stage.role,
        department: stage.department,
        supervisorName: stage.supervisorName,
        supervisorEmail: stage.supervisorEmail,
        startDate: stage.startDate.toISOString(),
        endDate: stage.endDate?.toISOString() || null,
        targetHours: stage.targetHours,
        completedHours: stage.completedHours,
        stageType: stage.stageType,
        status: stage.status,
        studentDescription: stage.studentDescription,
        studentSkills: stage.studentSkills,
        studentRating: stage.studentRating,
        studentHighlight: stage.studentHighlight,
        supervisorCompleted: stage.supervisorCompleted,
        supervisorRating: stage.supervisorRating,
        supervisorCompetencies: stage.supervisorCompetencies,
        supervisorStrengths: stage.supervisorStrengths,
        supervisorImprovements: stage.supervisorImprovements,
        supervisorWouldHire: stage.supervisorWouldHire,
        verified: stage.verified,
        verifiedSkills: stage.verifiedSkills,
      },
      checkIns: checkIns.map(c => ({
        id: c.id,
        date: c.date.toISOString(),
        hoursWorked: c.hoursWorked,
        activity: c.activity,
        location: c.location,
        status: c.status,
        checkInType: c.checkInType,
        supervisorRating: c.supervisorRating,
        supervisorNotes: c.supervisorNotes,
        studentNotes: c.studentNotes,
        verified: c.verified,
      })),
      weeklyHours: Object.entries(weeklyHours)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([week, hours]) => ({ week, hours })),
      attendance,
      attendanceRate,
      alerts,
    })
  } catch (error) {
    console.error('Stage detail error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/dashboard/university/stages/[id] — add a check-in
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await context.params
    const universityName = user.company || ''

    const stage = await prisma.stageExperience.findFirst({ where: { id, universityName } })
    if (!stage) return NextResponse.json({ error: 'Stage not found' }, { status: 404 })

    const body = await req.json()
    const { date, hoursWorked, activity, location, attendance, checkInType, supervisorRating, supervisorNotes, studentNotes } = body

    if (!date || !hoursWorked) {
      return NextResponse.json({ error: 'Date and hours are required' }, { status: 400 })
    }

    const log = await prisma.internshipLog.create({
      data: {
        studentId: stage.studentId,
        universityId: session.user.id,
        stageId: id,
        companyName: stage.companyName,
        supervisorName: stage.supervisorName,
        supervisorEmail: stage.supervisorEmail,
        date: new Date(date),
        hoursWorked: parseFloat(hoursWorked),
        activity: activity || null,
        location: location || null,
        status: attendance || 'PRESENT',
        checkInType: checkInType || 'DAILY',
        supervisorRating: supervisorRating ? parseInt(supervisorRating) : null,
        supervisorNotes: supervisorNotes || null,
        studentNotes: studentNotes || null,
      },
    })

    // Update completed hours on stage
    await prisma.stageExperience.update({
      where: { id },
      data: { completedHours: { increment: parseFloat(hoursWorked) } },
    })

    return NextResponse.json({ success: true, checkIn: log })
  } catch (error) {
    console.error('Check-in error:', error)
    return NextResponse.json({ error: 'Failed to log check-in' }, { status: 500 })
  }
}

function getWeekKey(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d.toISOString().split('T')[0]
}
