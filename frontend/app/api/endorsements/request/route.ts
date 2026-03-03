import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import crypto from 'crypto'
import { sendEndorsementRequestEmail } from '@/lib/email'

// POST /api/endorsements/request - Request professor endorsement
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      projectId,
      professorName,
      professorEmail,
      professorTitle,
      department,
      university,
      courseName,
      courseCode,
      semester,
      message
    } = body

    if (!projectId || !professorName || !professorEmail || !university) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')

    // Create endorsement request
    const endorsement = await prisma.professorEndorsement.create({
      data: {
        studentId: userId,
        projectId,
        professorName,
        professorEmail,
        professorTitle,
        department,
        university,
        courseName,
        courseCode,
        semester,
        verificationToken,
        status: 'PENDING'
      }
    })

    // Get student info for email
    const student = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        university: true
      }
    })

    // Send verification email to professor
    const studentName = [student?.firstName, student?.lastName].filter(Boolean).join(' ') || 'A student'
    await sendEndorsementRequestEmail(
      professorEmail,
      professorName,
      studentName,
      student?.email || '',
      project.title,
      courseName || '',
      courseCode || '',
      semester || '',
      verificationToken,
      message || undefined
    )

    // Track analytics
    await prisma.analytics.create({
      data: {
        userId,
        eventType: 'CUSTOM',
        eventName: 'endorsement_requested',
        properties: {
          projectId,
          professorEmail,
          university
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Endorsement request sent to professor',
      endorsementId: endorsement.id
    })
  } catch (error) {
    console.error('Error requesting endorsement:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
