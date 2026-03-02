import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/student/mentoring
 * List mentorships (as mentor or mentee) + available mentors at same university.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Get user's university for matching
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { university: true, graduationYear: true },
    })

    // My mentorships (both as mentor and mentee)
    const myMentorships = await prisma.mentorshipConnection.findMany({
      where: {
        OR: [{ mentorId: userId }, { menteeId: userId }],
      },
      include: {
        mentor: {
          select: { id: true, firstName: true, lastName: true, photo: true, university: true, degree: true, graduationYear: true },
        },
        mentee: {
          select: { id: true, firstName: true, lastName: true, photo: true, university: true, degree: true, graduationYear: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Available mentors: same university, senior students or alumni
    let availableMentors: Array<{
      id: string
      firstName: string | null
      lastName: string | null
      photo: string | null
      degree: string | null
      graduationYear: string | null
      _count: { mentorshipsAsMentor: number }
    }> = []

    if (user?.university) {
      availableMentors = await prisma.user.findMany({
        where: {
          university: user.university,
          id: { not: userId },
          role: 'STUDENT',
          // Other students at the same university
          graduationYear: { not: null },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          photo: true,
          degree: true,
          graduationYear: true,
          _count: { select: { mentorshipsAsMentor: true } },
        },
        take: 20,
        orderBy: { graduationYear: 'desc' },
      })
    }

    return NextResponse.json({
      mentorships: myMentorships.map((m) => ({
        ...m,
        role: m.mentorId === userId ? 'mentor' : 'mentee',
        partner: m.mentorId === userId ? m.mentee : m.mentor,
      })),
      availableMentors,
    })
  } catch (error) {
    console.error('Mentoring fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/dashboard/student/mentoring
 * Request a mentorship connection.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { mentorId, message, topics } = body

    if (!mentorId) {
      return NextResponse.json({ error: 'Mentor ID required' }, { status: 400 })
    }

    if (mentorId === session.user.id) {
      return NextResponse.json({ error: 'Cannot mentor yourself' }, { status: 400 })
    }

    // Check for existing connection
    const existing = await prisma.mentorshipConnection.findFirst({
      where: {
        OR: [
          { mentorId, menteeId: session.user.id },
          { mentorId: session.user.id, menteeId: mentorId },
        ],
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'Mentorship connection already exists' }, { status: 409 })
    }

    // Get shared university
    const [mentee, mentor] = await Promise.all([
      prisma.user.findUnique({ where: { id: session.user.id }, select: { university: true } }),
      prisma.user.findUnique({ where: { id: mentorId }, select: { university: true } }),
    ])

    const connection = await prisma.mentorshipConnection.create({
      data: {
        mentorId,
        menteeId: session.user.id,
        message: message || null,
        topics: topics || [],
        university: mentee?.university || mentor?.university || null,
        status: 'PENDING',
      },
    })

    // Create notification for mentor
    await prisma.notification.create({
      data: {
        userId: mentorId,
        type: 'MENTORSHIP_REQUEST',
        title: 'New mentorship request',
        body: `A student has requested you as their mentor.`,
        link: '/dashboard/student/mentoring',
      },
    })

    return NextResponse.json({ connection }, { status: 201 })
  } catch (error) {
    console.error('Mentoring create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/dashboard/student/mentoring
 * Accept/decline/complete a mentorship.
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { connectionId, action, rating, feedback } = body

    if (!connectionId || !action) {
      return NextResponse.json({ error: 'connectionId and action required' }, { status: 400 })
    }

    const connection = await prisma.mentorshipConnection.findUnique({
      where: { id: connectionId },
    })

    if (!connection) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Only mentor can accept/decline, either party can complete/cancel
    const isMentor = connection.mentorId === session.user.id
    const isMentee = connection.menteeId === session.user.id

    if (!isMentor && !isMentee) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updateData: Record<string, unknown> = {}

    switch (action) {
      case 'accept':
        if (!isMentor) return NextResponse.json({ error: 'Only mentor can accept' }, { status: 403 })
        updateData.status = 'ACTIVE'
        updateData.startedAt = new Date()
        break
      case 'decline':
        if (!isMentor) return NextResponse.json({ error: 'Only mentor can decline' }, { status: 403 })
        updateData.status = 'DECLINED'
        break
      case 'complete':
        updateData.status = 'COMPLETED'
        updateData.completedAt = new Date()
        if (isMentee && rating) updateData.mentorRating = rating
        if (isMentor && rating) updateData.menteeRating = rating
        if (feedback) updateData.feedback = feedback
        break
      case 'cancel':
        updateData.status = 'CANCELLED'
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const updated = await prisma.mentorshipConnection.update({
      where: { id: connectionId },
      data: updateData,
    })

    // Notify the other party
    const recipientId = isMentor ? connection.menteeId : connection.mentorId
    const actionLabel = action === 'accept' ? 'accepted' : action === 'decline' ? 'declined' : action === 'complete' ? 'completed' : 'cancelled'
    await prisma.notification.create({
      data: {
        userId: recipientId,
        type: 'MENTORSHIP_REQUEST',
        title: `Mentorship ${actionLabel}`,
        body: `Your mentorship connection has been ${actionLabel}.`,
        link: '/dashboard/student/mentoring',
      },
    })

    return NextResponse.json({ connection: updated })
  } catch (error) {
    console.error('Mentoring update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
