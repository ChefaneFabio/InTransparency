import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/recruiter/scheduling
 * Returns recruiter's availability slots and upcoming interviews.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userId = session.user.id

    // Get availability from recruiter settings
    const settings = await prisma.recruiterSettings.findUnique({
      where: { userId },
      select: { availabilitySlots: true },
    })

    // Get upcoming interviews (applications with INTERVIEW status and future date)
    const interviews = await prisma.application.findMany({
      where: {
        job: { recruiterId: userId },
        status: 'INTERVIEW',
        interviewDate: { gte: new Date() },
      },
      select: {
        id: true,
        interviewDate: true,
        interviewType: true,
        interviewNotes: true,
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photo: true,
            university: true,
          },
        },
        job: {
          select: { title: true },
        },
      },
      orderBy: { interviewDate: 'asc' },
      take: 20,
    })

    const formattedInterviews = interviews.map(i => ({
      id: i.id,
      date: i.interviewDate?.toISOString() || null,
      type: i.interviewType,
      notes: i.interviewNotes,
      candidate: {
        id: i.applicant.id,
        name: [i.applicant.firstName, i.applicant.lastName].filter(Boolean).join(' ') || 'Anonymous',
        photo: i.applicant.photo,
        university: i.applicant.university,
      },
      jobTitle: i.job.title,
    }))

    return NextResponse.json({
      availability: settings?.availabilitySlots || null,
      interviews: formattedInterviews,
    })
  } catch (error) {
    console.error('Error fetching scheduling data:', error)
    return NextResponse.json({ error: 'Failed to fetch scheduling' }, { status: 500 })
  }
}

/**
 * PUT /api/dashboard/recruiter/scheduling
 * Save recruiter's availability slots.
 * Body: { availability: { monday: { morning: bool, afternoon: bool, evening: bool }, ... } }
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { availability } = await req.json()

    await prisma.recruiterSettings.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id, availabilitySlots: availability },
      update: { availabilitySlots: availability },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving scheduling data:', error)
    return NextResponse.json({ error: 'Failed to save scheduling' }, { status: 500 })
  }
}
