import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/university/placement-analytics
 * Aggregates ProfileView + ContactUsage + Placement for the university's students.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = user.company || ''
    if (!universityName) {
      return NextResponse.json({ error: 'University name not configured' }, { status: 400 })
    }

    // Find all students from this university
    const students = await prisma.user.findMany({
      where: { university: universityName, role: 'STUDENT' },
      select: { id: true, firstName: true, lastName: true },
    })
    const studentIds = students.map((s) => s.id)
    const studentMap = new Map(students.map((s) => [s.id, `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Anonymous']))

    if (studentIds.length === 0) {
      return NextResponse.json({
        funnel: { viewed: 0, contacted: 0, interviewed: 0, hired: 0 },
        timeToHire: { averageDays: 0, dataPoints: 0 },
        companyLeaderboard: [],
        gradeComparison: { universityAvg: 0, platformAvg: 0 },
        feed: [],
      })
    }

    // Funnel: Viewed
    const viewedCount = await prisma.profileView.count({
      where: { profileUserId: { in: studentIds }, viewerRole: 'RECRUITER' },
    })

    // Funnel: Contacted
    const contacts = await prisma.contactUsage.findMany({
      where: { recipientId: { in: studentIds } },
      select: {
        recruiterId: true,
        recipientId: true,
        outcome: true,
        outcomeAt: true,
        firstContactAt: true,
        hiringPosition: true,
        recruiter: { select: { company: true } },
      },
    })
    const contactedCount = contacts.length

    // Funnel: Interviewed & Hired
    let interviewedCount = 0
    let hiredCount = 0
    const hireDurations: number[] = []
    for (let i = 0; i < contacts.length; i++) {
      const c = contacts[i]
      if (c.outcome === 'interviewed' || c.outcome === 'hired') interviewedCount++
      if (c.outcome === 'hired') {
        hiredCount++
        if (c.outcomeAt && c.firstContactAt) {
          const days = Math.round((c.outcomeAt.getTime() - c.firstContactAt.getTime()) / (1000 * 60 * 60 * 24))
          hireDurations.push(days)
        }
      }
    }

    // Time to hire
    const avgDays = hireDurations.length > 0
      ? Math.round(hireDurations.reduce((a, b) => a + b, 0) / hireDurations.length)
      : 0

    // Company leaderboard
    const companyStats = new Map<string, { views: number; contacts: number; hires: number }>()

    // Views by company
    const companyViews = await prisma.profileView.groupBy({
      by: ['viewerCompany'],
      where: { profileUserId: { in: studentIds }, viewerRole: 'RECRUITER', viewerCompany: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 20,
    })
    for (let i = 0; i < companyViews.length; i++) {
      const cv = companyViews[i]
      const company = cv.viewerCompany || 'Unknown'
      companyStats.set(company, { views: cv._count.id, contacts: 0, hires: 0 })
    }

    // Contacts & hires by company
    for (let i = 0; i < contacts.length; i++) {
      const c = contacts[i]
      const company = c.recruiter?.company || 'Unknown'
      const existing = companyStats.get(company) || { views: 0, contacts: 0, hires: 0 }
      existing.contacts++
      if (c.outcome === 'hired') existing.hires++
      companyStats.set(company, existing)
    }

    const companyLeaderboard = Array.from(companyStats.entries())
      .map(([company, stats]) => ({ company, ...stats }))
      .sort((a, b) => (b.views + b.contacts * 3 + b.hires * 10) - (a.views + a.contacts * 3 + a.hires * 10))
      .slice(0, 10)

    // Grade comparison (simplified: use GPA if available)
    const uniStudentsWithGpa = await prisma.user.findMany({
      where: { university: universityName, role: 'STUDENT', gpa: { not: null } },
      select: { gpa: true },
    })
    const allStudentsWithGpa = await prisma.user.findMany({
      where: { role: 'STUDENT', gpa: { not: null } },
      select: { gpa: true },
    })

    const parseGpa = (gpa: string | null) => {
      if (!gpa) return null
      const n = parseFloat(gpa)
      return isNaN(n) ? null : n
    }

    const uniGpas = uniStudentsWithGpa.map((s) => parseGpa(s.gpa)).filter((g): g is number => g !== null)
    const allGpas = allStudentsWithGpa.map((s) => parseGpa(s.gpa)).filter((g): g is number => g !== null)

    const universityAvg = uniGpas.length > 0 ? Math.round((uniGpas.reduce((a, b) => a + b, 0) / uniGpas.length) * 10) / 10 : 0
    const platformAvg = allGpas.length > 0 ? Math.round((allGpas.reduce((a, b) => a + b, 0) / allGpas.length) * 10) / 10 : 0

    // Recent activity feed
    const recentViews = await prisma.profileView.findMany({
      where: { profileUserId: { in: studentIds }, viewerRole: 'RECRUITER' },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { profileUserId: true, viewerCompany: true, createdAt: true },
    })

    const recentContacts = await prisma.contactUsage.findMany({
      where: { recipientId: { in: studentIds } },
      orderBy: { firstContactAt: 'desc' },
      take: 10,
      select: {
        recipientId: true,
        outcome: true,
        firstContactAt: true,
        recruiter: { select: { company: true } },
      },
    })

    type FeedItem = { type: string; studentName: string; company: string; action: string; timestamp: string }
    const feed: FeedItem[] = []

    for (let i = 0; i < recentViews.length; i++) {
      const v = recentViews[i]
      feed.push({
        type: 'view',
        studentName: studentMap.get(v.profileUserId) || 'Student',
        company: v.viewerCompany || 'A recruiter',
        action: 'viewed profile',
        timestamp: v.createdAt.toISOString(),
      })
    }

    for (let i = 0; i < recentContacts.length; i++) {
      const c = recentContacts[i]
      const action = c.outcome === 'hired' ? 'hired' : c.outcome === 'interviewed' ? 'interviewed' : 'contacted'
      feed.push({
        type: action,
        studentName: studentMap.get(c.recipientId) || 'Student',
        company: c.recruiter?.company || 'A recruiter',
        action,
        timestamp: c.firstContactAt.toISOString(),
      })
    }

    feed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({
      funnel: { viewed: viewedCount, contacted: contactedCount, interviewed: interviewedCount, hired: hiredCount },
      timeToHire: { averageDays: avgDays, dataPoints: hireDurations.length },
      companyLeaderboard,
      gradeComparison: { universityAvg, platformAvg },
      feed: feed.slice(0, 20),
    })
  } catch (error) {
    console.error('Error fetching placement analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
