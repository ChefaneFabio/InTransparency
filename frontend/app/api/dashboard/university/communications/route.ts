import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/university/communications
 * Get audience counts for targeting + sent message history
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = user.company || ''

    // Student audience counts
    const students = await prisma.user.findMany({
      where: { university: universityName, role: 'STUDENT' },
      select: { id: true, degree: true, graduationYear: true, emailVerified: true, skills: true },
    })

    const degrees = Array.from(new Set(students.map(s => s.degree).filter(Boolean))) as string[]
    const gradYears = Array.from(new Set(students.map(s => s.graduationYear).filter(Boolean))) as string[]

    // Company audience — companies that have interacted with students
    const studentIds = students.map(s => s.id)
    const viewingCompanies = studentIds.length > 0
      ? await prisma.profileView.findMany({
          where: { profileUserId: { in: studentIds }, viewerRole: 'RECRUITER', viewerCompany: { not: null } },
          select: { viewerCompany: true, viewerId: true },
          distinct: ['viewerCompany'],
        })
      : []

    // Sent messages history
    const sentMessages = await prisma.message.findMany({
      where: { senderId: session.user.id },
      select: { id: true, subject: true, recipientEmail: true, createdAt: true, read: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({
      audiences: {
        students: {
          total: students.length,
          verified: students.filter(s => s.emailVerified).length,
          byDegree: degrees.map(d => ({ degree: d, count: students.filter(s => s.degree === d).length })),
          byYear: gradYears.sort().map(y => ({ year: y, count: students.filter(s => s.graduationYear === y).length })),
        },
        companies: {
          total: viewingCompanies.length,
          list: viewingCompanies.map(c => c.viewerCompany!),
        },
      },
      filters: { degrees, gradYears },
      history: sentMessages.map(m => ({
        id: m.id,
        subject: m.subject,
        recipient: m.recipientEmail,
        sentAt: m.createdAt.toISOString(),
        read: m.read,
      })),
    })
  } catch (error) {
    console.error('Communications error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/dashboard/university/communications
 * Send targeted message to filtered audience
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = user.company || ''
    const { audience, subject, content, filters } = await req.json()

    if (!subject || !content) {
      return NextResponse.json({ error: 'Subject and content are required' }, { status: 400 })
    }

    let recipients: Array<{ id: string; email: string }> = []

    if (audience === 'students') {
      const where: any = { university: universityName, role: 'STUDENT' }
      if (filters?.degree) where.degree = filters.degree
      if (filters?.graduationYear) where.graduationYear = filters.graduationYear
      if (filters?.skills && filters.skills.length > 0) where.skills = { hasSome: filters.skills }

      recipients = await prisma.user.findMany({
        where,
        select: { id: true, email: true },
      })
    } else if (audience === 'companies') {
      // Get recruiter users from selected companies
      const studentIds = (await prisma.user.findMany({
        where: { university: universityName, role: 'STUDENT' },
        select: { id: true },
      })).map(s => s.id)

      if (studentIds.length > 0) {
        const companyFilter = filters?.companies
        const recruiterViews = await prisma.profileView.findMany({
          where: {
            profileUserId: { in: studentIds },
            viewerRole: 'RECRUITER',
            viewerId: { not: null },
            ...(companyFilter && companyFilter.length > 0 ? { viewerCompany: { in: companyFilter } } : {}),
          },
          select: { viewerId: true },
          distinct: ['viewerId'],
        })

        const recruiterIds = recruiterViews.map(v => v.viewerId).filter(Boolean) as string[]
        if (recruiterIds.length > 0) {
          recipients = await prisma.user.findMany({
            where: { id: { in: recruiterIds } },
            select: { id: true, email: true },
          })
        }
      }
    }

    if (recipients.length === 0) {
      return NextResponse.json({ error: 'No recipients match your filters', sent: 0 }, { status: 400 })
    }

    // Cap at 200 per batch
    const batch = recipients.slice(0, 200)
    let sent = 0

    for (const recipient of batch) {
      await prisma.message.create({
        data: {
          senderId: session.user.id,
          recipientId: recipient.id,
          recipientEmail: recipient.email,
          subject,
          content,
        },
      })
      sent++
    }

    return NextResponse.json({
      success: true,
      sent,
      total: recipients.length,
      capped: recipients.length > 200,
    })
  } catch (error) {
    console.error('Send communication error:', error)
    return NextResponse.json({ error: 'Failed to send messages' }, { status: 500 })
  }
}
