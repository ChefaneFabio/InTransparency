import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/university/engagement-alerts
 *
 * Returns aggregated engagement alerts for the university:
 * "Accenture viewed 5 of your Computer Science students this week"
 * "3 companies contacted your Engineering students"
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'UNIVERSITY' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { company: true, university: true },
    })
    const universityName = user?.company || user?.university
    if (!universityName) {
      return NextResponse.json({ error: 'University not configured' }, { status: 400 })
    }

    // Get all students
    const students = await prisma.user.findMany({
      where: { university: universityName, role: 'STUDENT' },
      select: { id: true, degree: true },
    })
    const studentIds = students.map(s => s.id)
    const studentDegrees = new Map(students.map(s => [s.id, s.degree || 'Unknown']))

    if (studentIds.length === 0) {
      return NextResponse.json({ alerts: [], summary: { totalViews: 0, totalContacts: 0, activeCompanies: 0 } })
    }

    // Last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Views this week
    const recentViews = await prisma.profileView.findMany({
      where: {
        profileUserId: { in: studentIds },
        viewerRole: 'RECRUITER',
        viewerCompany: { not: null },
        createdAt: { gte: sevenDaysAgo },
      },
      select: { viewerCompany: true, profileUserId: true },
    })

    // Contacts this week
    const recentContacts = await prisma.contactUsage.findMany({
      where: {
        recipientId: { in: studentIds },
        firstContactAt: { gte: sevenDaysAgo },
      },
      select: {
        recipientId: true,
        outcome: true,
        recruiter: { select: { company: true } },
      },
    })

    // Aggregate by company
    const companyAlerts: Record<string, {
      views: number
      contacts: number
      hires: number
      degrees: Set<string>
      studentIds: Set<string>
    }> = {}

    for (const v of recentViews) {
      const company = v.viewerCompany || 'Unknown'
      if (!companyAlerts[company]) {
        companyAlerts[company] = { views: 0, contacts: 0, hires: 0, degrees: new Set(), studentIds: new Set() }
      }
      companyAlerts[company].views++
      companyAlerts[company].studentIds.add(v.profileUserId)
      const degree = studentDegrees.get(v.profileUserId)
      if (degree) companyAlerts[company].degrees.add(degree)
    }

    for (const c of recentContacts) {
      const company = c.recruiter?.company || 'Unknown'
      if (!companyAlerts[company]) {
        companyAlerts[company] = { views: 0, contacts: 0, hires: 0, degrees: new Set(), studentIds: new Set() }
      }
      companyAlerts[company].contacts++
      if (c.outcome === 'hired') companyAlerts[company].hires++
      companyAlerts[company].studentIds.add(c.recipientId)
      const degree = studentDegrees.get(c.recipientId)
      if (degree) companyAlerts[company].degrees.add(degree)
    }

    // Build alerts sorted by engagement
    const alerts = Object.entries(companyAlerts)
      .map(([company, data]) => ({
        company,
        views: data.views,
        contacts: data.contacts,
        hires: data.hires,
        uniqueStudents: data.studentIds.size,
        degrees: Array.from(data.degrees),
        engagement: data.views + data.contacts * 5 + data.hires * 20,
      }))
      .sort((a, b) => b.engagement - a.engagement)

    const totalViews = recentViews.length
    const totalContacts = recentContacts.length
    const activeCompanies = Object.keys(companyAlerts).length

    return NextResponse.json({
      period: 'last_7_days',
      alerts,
      summary: { totalViews, totalContacts, activeCompanies },
    })
  } catch (error) {
    console.error('Engagement alerts error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
