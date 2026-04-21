import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/university/employer-crm/[company]
 * Full detail view of one partner company for the ITS / university admin:
 *   - CompanyProfile (if claimed/registered): branding, industries, size, HQ, LinkedIn
 *   - Contact persons: every RECRUITER user whose `company` field matches
 *   - Relationship history: views, contacts, placements, event participations
 *   - Students engaged: distinct list from this university that the company has touched
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ company: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { company } = await params
    const companyName = decodeURIComponent(company)
    const universityName = user.university || user.company || ''
    if (!universityName) return NextResponse.json({ error: 'No institution on session' }, { status: 400 })

    // 1. CompanyProfile (may not exist — unclaimed partner companies are fine)
    const profile = await prisma.companyProfile.findFirst({
      where: { companyName: { equals: companyName, mode: 'insensitive' } },
    })

    // 2. Contact persons — recruiters attached to this company
    const contacts = await prisma.user.findMany({
      where: {
        role: 'RECRUITER',
        company: { equals: companyName, mode: 'insensitive' },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        jobTitle: true,
        photo: true,
        linkedinUrl: true,
        location: true,
        lastLoginAt: true,
      },
      orderBy: { lastLoginAt: 'desc' },
      take: 20,
    })

    // 3. Students from this university
    const students = await prisma.user.findMany({
      where: { university: universityName, role: 'STUDENT' },
      select: { id: true, firstName: true, lastName: true, degree: true, photo: true },
    })
    const studentIds = students.map(s => s.id)
    const studentById = new Map(students.map(s => [s.id, s]))

    // 4. Relationship telemetry
    const [views, contactsLog, placements, eventRsvps] = await Promise.all([
      prisma.profileView.findMany({
        where: {
          profileUserId: { in: studentIds },
          viewerRole: 'RECRUITER',
          viewerCompany: { equals: companyName, mode: 'insensitive' },
        },
        select: { profileUserId: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 200,
      }),
      prisma.contactUsage.findMany({
        where: {
          recipientId: { in: studentIds },
          recruiter: { company: { equals: companyName, mode: 'insensitive' } },
        },
        select: { recipientId: true, createdAt: true, recruiterId: true },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      prisma.placement.findMany({
        where: {
          universityName,
          companyName: { equals: companyName, mode: 'insensitive' },
        },
        select: {
          studentId: true,
          status: true,
          jobTitle: true,
          salaryAmount: true,
          salaryCurrency: true,
          startDate: true,
          companyIndustry: true,
        },
        orderBy: { startDate: 'desc' },
      }),
      prisma.universitySettings.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      }).then(async (settings) => {
        if (!settings) return []
        return prisma.eventRSVP.findMany({
          where: {
            event: { organizerId: settings.id },
            companyName: { equals: companyName, mode: 'insensitive' },
          },
          select: { createdAt: true, status: true, event: { select: { title: true, startDate: true } } },
          orderBy: { createdAt: 'desc' },
          take: 20,
        })
      }),
    ])

    // 5. Engaged students — union of all recruiter actions, deduped
    const engagedIds = new Set<string>()
    views.forEach(v => engagedIds.add(v.profileUserId))
    contactsLog.forEach(c => engagedIds.add(c.recipientId))
    placements.forEach(p => p.studentId && engagedIds.add(p.studentId))
    const engagedStudents = Array.from(engagedIds)
      .map(id => studentById.get(id))
      .filter(Boolean)

    // 6. Recent activity timeline (last 20 events, newest first)
    type Activity =
      | { type: 'view'; at: Date; studentId: string; studentName: string }
      | { type: 'contact'; at: Date; studentId: string; studentName: string }
      | { type: 'placement'; at: Date; studentId: string; studentName: string; jobTitle: string }
      | { type: 'event_rsvp'; at: Date; title: string; status: string }

    const activities: Activity[] = []
    for (const v of views.slice(0, 40)) {
      const s = studentById.get(v.profileUserId)
      if (!s) continue
      activities.push({
        type: 'view',
        at: v.createdAt,
        studentId: v.profileUserId,
        studentName: `${s.firstName || ''} ${s.lastName || ''}`.trim(),
      })
    }
    for (const c of contactsLog) {
      const s = studentById.get(c.recipientId)
      if (!s) continue
      activities.push({
        type: 'contact',
        at: c.createdAt,
        studentId: c.recipientId,
        studentName: `${s.firstName || ''} ${s.lastName || ''}`.trim(),
      })
    }
    for (const p of placements) {
      if (!p.studentId || !p.startDate) continue
      const s = studentById.get(p.studentId)
      if (!s) continue
      activities.push({
        type: 'placement',
        at: p.startDate,
        studentId: p.studentId,
        studentName: `${s.firstName || ''} ${s.lastName || ''}`.trim(),
        jobTitle: p.jobTitle || '',
      })
    }
    for (const r of eventRsvps as any[]) {
      activities.push({
        type: 'event_rsvp',
        at: r.createdAt,
        title: r.event?.title || '',
        status: r.status || '',
      })
    }
    activities.sort((a, b) => b.at.getTime() - a.at.getTime())

    // 7. Summary metrics
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    const recentViews = views.filter(v => v.createdAt > thirtyDaysAgo).length
    const confirmedHires = placements.filter(p => p.status === 'CONFIRMED').length
    const avgSalary = confirmedHires > 0
      ? Math.round(
          placements
            .filter(p => p.status === 'CONFIRMED' && p.salaryAmount)
            .reduce((sum, p) => sum + (p.salaryAmount || 0), 0) / confirmedHires
        )
      : null

    return NextResponse.json({
      company: {
        name: companyName,
        profile: profile
          ? {
              logoUrl: profile.logoUrl,
              coverUrl: profile.coverUrl,
              tagline: profile.tagline,
              description: profile.description,
              industries: profile.industries,
              sizeCategory: profile.sizeCategory,
              headquarters: profile.headquarters,
              foundedYear: profile.foundedYear,
              websiteUrl: profile.websiteUrl,
              linkedinUrl: profile.linkedinUrl,
              mission: profile.mission,
              countries: profile.countries,
              officeLocations: profile.officeLocations,
              verified: profile.verified,
              published: profile.published,
              slug: profile.slug,
            }
          : null,
      },
      contacts,
      metrics: {
        totalViews: views.length,
        recentViews,
        totalContacts: contactsLog.length,
        confirmedHires,
        avgSalary,
        engagedCount: engagedStudents.length,
        studentsTotal: students.length,
      },
      engagedStudents: engagedStudents.slice(0, 12),
      recentActivity: activities.slice(0, 20),
      placements: placements.slice(0, 10),
    })
  } catch (error) {
    console.error('Error fetching employer-crm company detail:', error)
    return NextResponse.json({ error: 'Failed to fetch company detail' }, { status: 500 })
  }
}
