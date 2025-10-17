import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import crypto from 'crypto'

// POST /api/endorsements/request - Request professor endorsement
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

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
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/endorsements/verify/${verificationToken}`

    // TODO: Send email to professor
    // For now, we'll just log the email content
    const emailContent = {
      to: professorEmail,
      subject: `${student?.firstName} ${student?.lastName} is requesting your endorsement`,
      body: `
Dear Professor ${professorName},

Your student ${student?.firstName} ${student?.lastName} (${student?.email}) has requested your endorsement for their project "${project.title}" on InTransparency.

${message || 'They would appreciate your feedback on their work in your course.'}

Course: ${courseName} (${courseCode}) - ${semester}
Project: ${project.title}

To provide your endorsement, please click the link below:
${verificationUrl}

This link will expire in 7 days.

Best regards,
The InTransparency Team
      `
    }

    console.log('Email to send:', emailContent)

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
