import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/university/company-engagement
 *
 * Shows university career offices which companies are actively
 * engaging with their students — views, contacts, hires — in real time.
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

    const students = await prisma.user.findMany({
      where: { university: universityName, role: 'STUDENT' },
      select: { id: true, firstName: true, lastName: true, degree: true },
    })
    const studentIds = students.map(s => s.id)
    const studentMap = new Map(students.map(s => [s.id, {
      name: `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Student',
      degree: s.degree,
    }]))

    if (studentIds.length === 0) {
      return NextResponse.json({ companies: [], recentActivity: [], summary: { totalCompanies: 0, activeThisMonth: 0, totalViews: 0, totalContacts: 0 } })
    }

    // Last 90 days
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Profile views by company
    const views = await prisma.profileView.findMany({
      where: {
        profileUserId: { in: studentIds },
        viewerRole: 'RECRUITER',
        viewerCompany: { not: null },
        createdAt: { gte: ninetyDaysAgo },
      },
      select: {
        viewerCompany: true,
        profileUserId: true,
        createdAt: true,
      },
    })

    // Contacts by company
    const contacts = await prisma.contactUsage.findMany({
      where: {
        recipientId: { in: studentIds },
        firstContactAt: { gte: ninetyDaysAgo },
      },
      select: {
        recipientId: true,
        outcome: true,
        firstContactAt: true,
        recruiter: { select: { company: true } },
      },
    })

    // Aggregate by company
    const companyData: Record<string, {
      views: number
      viewsThisMonth: number
      contacts: number
      hires: number
      studentsViewed: Set<string>
      studentsContacted: Set<string>
      lastActivity: Date
      degreesInterested: Record<string, number>
    }> = {}

    for (const v of views) {
      const company = v.viewerCompany || 'Unknown'
      if (!companyData[company]) {
        companyData[company] = { views: 0, viewsThisMonth: 0, contacts: 0, hires: 0, studentsViewed: new Set(), studentsContacted: new Set(), lastActivity: v.createdAt, degreesInterested: {} }
      }
      companyData[company].views++
      if (v.createdAt >= thirtyDaysAgo) companyData[company].viewsThisMonth++
      companyData[company].studentsViewed.add(v.profileUserId)
      if (v.createdAt > companyData[company].lastActivity) companyData[company].lastActivity = v.createdAt

      const degree = studentMap.get(v.profileUserId)?.degree || 'Unknown'
      companyData[company].degreesInterested[degree] = (companyData[company].degreesInterested[degree] || 0) + 1
    }

    for (const c of contacts) {
      const company = c.recruiter?.company || 'Unknown'
      if (!companyData[company]) {
        companyData[company] = { views: 0, viewsThisMonth: 0, contacts: 0, hires: 0, studentsViewed: new Set(), studentsContacted: new Set(), lastActivity: c.firstContactAt, degreesInterested: {} }
      }
      companyData[company].contacts++
      companyData[company].studentsContacted.add(c.recipientId)
      if (c.outcome === 'hired') companyData[company].hires++
      if (c.firstContactAt > companyData[company].lastActivity) companyData[company].lastActivity = c.firstContactAt
    }

    // Format companies
    const companies = Object.entries(companyData)
      .map(([name, data]) => ({
        name,
        views: data.views,
        viewsThisMonth: data.viewsThisMonth,
        contacts: data.contacts,
        hires: data.hires,
        uniqueStudentsViewed: data.studentsViewed.size,
        uniqueStudentsContacted: data.studentsContacted.size,
        lastActivity: data.lastActivity.toISOString(),
        topDegrees: Object.entries(data.degreesInterested)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([degree]) => degree),
        engagementScore: data.views + data.contacts * 5 + data.hires * 20,
      }))
      .sort((a, b) => b.engagementScore - a.engagementScore)

    // Recent activity feed (last 30 days)
    type ActivityItem = { type: string; company: string; studentName: string; degree: string | null | undefined; timestamp: string }
    const recentActivity: ActivityItem[] = []

    for (const v of views.filter(v => v.createdAt >= thirtyDaysAgo).slice(0, 15)) {
      const student = studentMap.get(v.profileUserId)
      recentActivity.push({
        type: 'view',
        company: v.viewerCompany || 'Unknown',
        studentName: student?.name || 'Student',
        degree: student?.degree,
        timestamp: v.createdAt.toISOString(),
      })
    }

    for (const c of contacts.filter(c => c.firstContactAt >= thirtyDaysAgo).slice(0, 15)) {
      const student = studentMap.get(c.recipientId)
      recentActivity.push({
        type: c.outcome === 'hired' ? 'hired' : 'contacted',
        company: c.recruiter?.company || 'Unknown',
        studentName: student?.name || 'Student',
        degree: student?.degree,
        timestamp: c.firstContactAt.toISOString(),
      })
    }

    recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Summary
    const totalCompanies = companies.length
    const activeThisMonth = companies.filter(c => c.viewsThisMonth > 0 || new Date(c.lastActivity) >= thirtyDaysAgo).length
    const totalViews = views.length
    const totalContacts = contacts.length

    return NextResponse.json({
      companies: companies.slice(0, 30),
      recentActivity: recentActivity.slice(0, 20),
      summary: { totalCompanies, activeThisMonth, totalViews, totalContacts },
    })
  } catch (error) {
    console.error('Company engagement error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
