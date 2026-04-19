import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendEndorsementResponseEmail } from '@/lib/email'
import { createNotification } from '@/lib/notifications'
import { writeProjectDeltas } from '@/lib/skill-delta'

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
    const { endorsementText, skills, rating, grade, action, competencyRatings } = body

    const endorsement = await prisma.professorEndorsement.findUnique({
      where: { verificationToken: token },
      include: {
        project: { select: { id: true, title: true } },
      },
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

    // Fetch student info for notifications
    const student = await prisma.user.findUnique({
      where: { id: endorsement.studentId },
      select: { email: true, firstName: true, lastName: true },
    })

    if (action === 'decline') {
      // Professor declined
      await prisma.professorEndorsement.update({
        where: { id: endorsement.id },
        data: {
          status: 'DECLINED',
          verifiedAt: new Date()
        }
      })

      // Notify student
      if (student?.email) {
        try {
          await sendEndorsementResponseEmail(
            student.email,
            student.firstName || 'Student',
            endorsement.professorName,
            endorsement.project.title,
            'DECLINED',
            endorsement.projectId
          )
        } catch (e) {
          console.error('Failed to send decline notification email:', e)
        }
        await createNotification({
          userId: endorsement.studentId,
          type: 'ENDORSEMENT_RESPONSE',
          title: 'Endorsement Declined',
          body: `Prof. ${endorsement.professorName} declined to endorse "${endorsement.project.title}"`,
          link: '/dashboard/student/projects',
        })
      }

      return NextResponse.json({
        success: true,
        message: 'Thank you for your response'
      })
    }

    // Professor verified
    await prisma.professorEndorsement.update({
      where: { id: endorsement.id },
      data: {
        endorsementText,
        skills: skills || [],
        rating,
        grade,
        competencyRatings: competencyRatings || undefined,
        verified: true,
        status: 'VERIFIED',
        verifiedAt: new Date()
      }
    })

    // Auto-verify the project now that a professor has endorsed it
    await prisma.project.update({
      where: { id: endorsement.projectId },
      data: {
        verificationStatus: 'VERIFIED',
        universityVerified: true,
        verifiedAt: new Date(),
      },
    }).catch((err: unknown) => {
      console.error('Auto-verification of project failed:', err)
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
          skills: skills || [],
          competencyRatings: competencyRatings || {},
        }
      }
    })

    // Writeback to skill graph — closes the loop so verified endorsements
    // actually update the student's verified proficiency graph. (P1)
    const ratingToLevel = (r: number): string => {
      if (r <= 2) return 'Beginner'
      if (r === 3) return 'Intermediate'
      if (r === 4) return 'Advanced'
      return 'Expert'
    }
    const competencies: Array<{ skill: string; proficiencyLevel: string; evidence?: string }> = []
    // Rated competencies → direct mapping
    if (competencyRatings && typeof competencyRatings === 'object') {
      for (const [skill, ratingVal] of Object.entries(competencyRatings as Record<string, number>)) {
        if (typeof ratingVal === 'number' && skill) {
          competencies.push({ skill, proficiencyLevel: ratingToLevel(ratingVal) })
        }
      }
    }
    // Endorsed skills without per-skill rating → use overall rating as proxy
    const ratedSkillsLower = new Set(competencies.map(c => c.skill.toLowerCase()))
    for (const s of (skills || []) as string[]) {
      if (s && !ratedSkillsLower.has(s.toLowerCase())) {
        competencies.push({
          skill: s,
          proficiencyLevel: rating ? ratingToLevel(rating) : 'Intermediate',
        })
      }
    }
    if (competencies.length > 0) {
      try {
        await writeProjectDeltas({
          projectId: endorsement.projectId,
          studentId: endorsement.studentId,
          projectTitle: endorsement.project.title,
          competencies,
          endorserName: endorsement.professorName,
        })
      } catch (e) {
        console.error('Project skill-delta writeback failed:', e)
      }
    }

    // Notify student
    if (student?.email) {
      try {
        await sendEndorsementResponseEmail(
          student.email,
          student.firstName || 'Student',
          endorsement.professorName,
          endorsement.project.title,
          'VERIFIED',
          endorsement.projectId
        )
      } catch (e) {
        console.error('Failed to send endorsement notification email:', e)
      }
      await createNotification({
        userId: endorsement.studentId,
        type: 'ENDORSEMENT_RESPONSE',
        title: 'Endorsement Received!',
        body: `Prof. ${endorsement.professorName} endorsed your project "${endorsement.project.title}"`,
        link: '/dashboard/student/projects',
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Endorsement submitted successfully'
    })
  } catch (error) {
    console.error('Error submitting endorsement:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
