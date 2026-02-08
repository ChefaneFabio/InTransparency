import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

// GET /api/dashboard/university/recruiters
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = user.company || ''

    // Get students at this university
    const students = await prisma.user.findMany({
      where: { university: universityName, role: 'STUDENT' },
      select: { id: true },
    })
    const studentIds = students.map(s => s.id)

    if (studentIds.length === 0) {
      return NextResponse.json({ recruiters: [], stats: { total: 0, partners: 0, totalHired: 0, activeThisMonth: 0 } })
    }

    // Get profile views from recruiters
    const profileViews = await prisma.profileView.findMany({
      where: {
        profileUserId: { in: studentIds },
        viewerRole: 'RECRUITER',
      },
      select: {
        viewerCompany: true,
        viewerId: true,
        createdAt: true,
      },
    })

    // Get contacts from recruiters
    const contacts = await prisma.contactUsage.findMany({
      where: {
        recipientId: { in: studentIds },
      },
      select: {
        recruiterId: true,
        createdAt: true,
      },
    })

    // Get placements (hires)
    const placements = await prisma.placement.findMany({
      where: {
        universityName,
        status: 'CONFIRMED',
      },
      select: {
        companyName: true,
        salaryAmount: true,
      },
    })

    // Get recruiter details
    const recruiterIds = new Set<string>()
    for (const v of profileViews) {
      if (v.viewerId) recruiterIds.add(v.viewerId)
    }
    for (const c of contacts) {
      recruiterIds.add(c.recruiterId)
    }

    const recruiterUsers = await prisma.user.findMany({
      where: { id: { in: Array.from(recruiterIds) }, role: 'RECRUITER' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        company: true,
        jobTitle: true,
        photo: true,
        lastLoginAt: true,
      },
    })

    // Aggregate per company
    const companyData: Record<string, {
      contacts: string[]
      views: number
      contacted: number
      hired: number
      salaries: number[]
      lastActivity: Date | null
    }> = {}

    for (const v of profileViews) {
      const company = v.viewerCompany || 'Unknown'
      if (!companyData[company]) {
        companyData[company] = { contacts: [], views: 0, contacted: 0, hired: 0, salaries: [], lastActivity: null }
      }
      companyData[company].views++
      if (!companyData[company].lastActivity || v.createdAt > companyData[company].lastActivity!) {
        companyData[company].lastActivity = v.createdAt
      }
    }

    for (const c of contacts) {
      const recruiter = recruiterUsers.find(r => r.id === c.recruiterId)
      const company = recruiter?.company || 'Unknown'
      if (!companyData[company]) {
        companyData[company] = { contacts: [], views: 0, contacted: 0, hired: 0, salaries: [], lastActivity: null }
      }
      companyData[company].contacted++
    }

    for (const p of placements) {
      if (!companyData[p.companyName]) {
        companyData[p.companyName] = { contacts: [], views: 0, contacted: 0, hired: 0, salaries: [], lastActivity: null }
      }
      companyData[p.companyName].hired++
      if (p.salaryAmount) companyData[p.companyName].salaries.push(p.salaryAmount)
    }

    // Map to recruiter cards
    const now = new Date()
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

    const recruiters = Object.entries(companyData)
      .map(([companyName, data]) => {
        const recruiter = recruiterUsers.find(r => r.company === companyName)
        const avgSalary = data.salaries.length > 0
          ? Math.round(data.salaries.reduce((a, b) => a + b, 0) / data.salaries.length)
          : 0
        const isActive = data.lastActivity && data.lastActivity > oneMonthAgo

        return {
          id: recruiter?.id || companyName,
          companyName,
          contactName: recruiter ? [recruiter.firstName, recruiter.lastName].filter(Boolean).join(' ') : '',
          contactEmail: recruiter?.email || '',
          location: '',
          industry: '',
          studentsHired: data.hired,
          studentsContacted: data.contacted,
          avgSalaryOffered: avgSalary,
          isPartner: data.hired >= 3,
          lastActivity: data.lastActivity?.toISOString() || '',
          status: isActive ? 'active' : 'inactive',
        }
      })
      .sort((a, b) => b.studentsHired - a.studentsHired)

    const totalHired = recruiters.reduce((sum, r) => sum + r.studentsHired, 0)
    const partners = recruiters.filter(r => r.isPartner).length
    const activeThisMonth = recruiters.filter(r => r.status === 'active').length

    return NextResponse.json({
      recruiters,
      stats: {
        total: recruiters.length,
        partners,
        totalHired,
        activeThisMonth,
      },
    })
  } catch (error) {
    console.error('Error fetching recruiters:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
