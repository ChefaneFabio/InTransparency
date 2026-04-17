import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/university/employer-crm
 * Employer relationship management — combines profile views, contacts,
 * placements, and event RSVPs into a unified company view.
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
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const stage = searchParams.get('stage') || ''

    // Get all students
    const students = await prisma.user.findMany({
      where: { university: universityName, role: 'STUDENT' },
      select: { id: true },
    })
    const studentIds = students.map(s => s.id)

    if (studentIds.length === 0) {
      return NextResponse.json({ companies: [], pipeline: { prospect: 0, engaged: 0, partner: 0, inactive: 0 }, totalCompanies: 0 })
    }

    const now = new Date()
    const ninetyDaysAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
    const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

    // Aggregate company data from multiple sources
    const [views, contacts, placements, eventRsvps] = await Promise.all([
      prisma.profileView.findMany({
        where: { profileUserId: { in: studentIds }, viewerRole: 'RECRUITER', viewerCompany: { not: null } },
        select: { viewerCompany: true, createdAt: true },
      }),
      prisma.contactUsage.findMany({
        where: { recipientId: { in: studentIds } },
        select: { recruiter: { select: { company: true } }, createdAt: true },
      }),
      prisma.placement.findMany({
        where: { universityName, status: 'CONFIRMED' },
        select: { companyName: true, salaryAmount: true, startDate: true, jobTitle: true },
      }),
      prisma.universitySettings.findUnique({ where: { userId: session.user.id }, select: { id: true } }).then(async (settings) => {
        if (!settings) return []
        return prisma.eventRSVP.findMany({
          where: { event: { organizerId: settings.id }, companyName: { not: null } },
          select: { companyName: true, createdAt: true, status: true, event: { select: { title: true, startDate: true } } },
        })
      }),
    ])

    // Build company map
    const companyMap: Record<string, {
      views: number
      recentViews: number
      contacts: number
      hires: number
      totalSalary: number
      events: Array<{ title: string; date: string }>
      roles: string[]
      firstSeen: Date
      lastActivity: Date
    }> = {}

    const ensureCompany = (name: string) => {
      if (!name) return
      if (!companyMap[name]) {
        companyMap[name] = { views: 0, recentViews: 0, contacts: 0, hires: 0, totalSalary: 0, events: [], roles: [], firstSeen: now, lastActivity: new Date(0) }
      }
    }

    for (const v of views) {
      const name = v.viewerCompany!
      ensureCompany(name)
      companyMap[name].views++
      if (v.createdAt > thirtyDaysAgo) companyMap[name].recentViews++
      if (v.createdAt < companyMap[name].firstSeen) companyMap[name].firstSeen = v.createdAt
      if (v.createdAt > companyMap[name].lastActivity) companyMap[name].lastActivity = v.createdAt
    }

    for (const c of contacts) {
      const name = c.recruiter?.company
      if (!name) continue
      ensureCompany(name)
      companyMap[name].contacts++
      if (c.createdAt > companyMap[name].lastActivity) companyMap[name].lastActivity = c.createdAt
    }

    for (const p of placements) {
      ensureCompany(p.companyName)
      companyMap[p.companyName].hires++
      if (p.salaryAmount) companyMap[p.companyName].totalSalary += p.salaryAmount
      if (p.jobTitle && !companyMap[p.companyName].roles.includes(p.jobTitle)) {
        companyMap[p.companyName].roles.push(p.jobTitle)
      }
      if (p.startDate > companyMap[p.companyName].lastActivity) companyMap[p.companyName].lastActivity = p.startDate
    }

    for (const r of eventRsvps) {
      if (!r.companyName) continue
      ensureCompany(r.companyName)
      companyMap[r.companyName].events.push({
        title: r.event.title,
        date: r.event.startDate.toISOString(),
      })
    }

    // Classify pipeline stage
    const classifyStage = (data: typeof companyMap[string]): string => {
      if (data.hires >= 1) return 'partner'
      if (data.contacts >= 1 || data.events.length >= 1) return 'engaged'
      if (data.lastActivity < ninetyDaysAgo && data.views > 0) return 'inactive'
      return 'prospect'
    }

    // Build company list
    let companies = Object.entries(companyMap)
      .map(([name, data]) => {
        const pipelineStage = classifyStage(data)
        const avgSalary = data.hires > 0 ? Math.round(data.totalSalary / data.hires) : 0
        const engagementScore = data.views + data.contacts * 5 + data.hires * 20 + data.events.length * 3

        return {
          name,
          stage: pipelineStage,
          views: data.views,
          recentViews: data.recentViews,
          contacts: data.contacts,
          hires: data.hires,
          avgSalary,
          engagementScore,
          events: data.events.slice(0, 5),
          roles: data.roles,
          firstSeen: data.firstSeen.toISOString(),
          lastActivity: data.lastActivity.toISOString(),
        }
      })
      .sort((a, b) => b.engagementScore - a.engagementScore)

    // Apply filters
    if (search) {
      const q = search.toLowerCase()
      companies = companies.filter(c => c.name.toLowerCase().includes(q))
    }
    if (stage) {
      companies = companies.filter(c => c.stage === stage)
    }

    // Pipeline counts
    const allCompanies = Object.entries(companyMap).map(([, data]) => classifyStage(data))
    const pipeline = {
      prospect: allCompanies.filter(s => s === 'prospect').length,
      engaged: allCompanies.filter(s => s === 'engaged').length,
      partner: allCompanies.filter(s => s === 'partner').length,
      inactive: allCompanies.filter(s => s === 'inactive').length,
    }

    return NextResponse.json({
      companies,
      pipeline,
      totalCompanies: Object.keys(companyMap).length,
    })
  } catch (error) {
    console.error('Employer CRM error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
