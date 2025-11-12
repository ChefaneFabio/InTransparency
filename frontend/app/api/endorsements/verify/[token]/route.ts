import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/endorsements/verify/[token] - Get endorsement request details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    const endorsement = await prisma.professorEndorsement.findUnique({
      where: { verificationToken: token },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            description: true,
            technologies: true,
            githubUrl: true,
            liveUrl: true
          }
        }
      }
    })

    if (!endorsement) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 404 })
    }

    // Check if already verified or expired (7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    if (endorsement.status === 'VERIFIED') {
      return NextResponse.json({ error: 'Already verified' }, { status: 400 })
    }
    if (endorsement.createdAt < sevenDaysAgo) {
      await prisma.professorEndorsement.update({
        where: { id: endorsement.id },
        data: { status: 'EXPIRED' }
      })
      return NextResponse.json({ error: 'Token expired' }, { status: 400 })
    }

    // Get student info
    const student = await prisma.user.findUnique({
      where: { id: endorsement.studentId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        university: true
      }
    })

    return NextResponse.json({
      endorsement: {
        id: endorsement.id,
        studentName: `${student?.firstName} ${student?.lastName}`,
        studentEmail: student?.email,
        studentUniversity: student?.university,
        project: endorsement.project,
        courseName: endorsement.courseName,
        courseCode: endorsement.courseCode,
        semester: endorsement.semester
      }
    })
  } catch (error) {
    console.error('Error fetching endorsement:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/endorsements/verify/[token] - Submit endorsement
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const body = await request.json()
    const { endorsementText, skills, rating, grade, action } = body

    const endorsement = await prisma.professorEndorsement.findUnique({
      where: { verificationToken: token }
    })

    if (!endorsement) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
    }

    if (endorsement.status === 'VERIFIED' || endorsement.status === 'DECLINED') {
      return NextResponse.json({ error: 'Already processed' }, { status: 400 })
    }

    // Check if expired
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    if (endorsement.createdAt < sevenDaysAgo) {
      await prisma.professorEndorsement.update({
        where: { id: endorsement.id },
        data: { status: 'EXPIRED' }
      })
      return NextResponse.json({ error: 'Token expired' }, { status: 400 })
    }

    if (action === 'decline') {
      // Professor declined
      await prisma.professorEndorsement.update({
        where: { id: endorsement.id },
        data: {
          status: 'DECLINED',
          verifiedAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Thank you for your response'
      })
    }

    // Professor verified
    const updated = await prisma.professorEndorsement.update({
      where: { id: endorsement.id },
      data: {
        endorsementText,
        skills: skills || [],
        rating,
        grade,
        verified: true,
        status: 'VERIFIED',
        verifiedAt: new Date()
      }
    })

    // Track analytics
    await prisma.analytics.create({
      data: {
        userId: endorsement.studentId,
        eventType: 'CUSTOM',
        eventName: 'endorsement_verified',
        properties: {
          projectId: endorsement.projectId,
          rating,
          skills: skills || []
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Endorsement submitted successfully'
    })
  } catch (error) {
    console.error('Error submitting endorsement:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
