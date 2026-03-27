import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/university/placement-report
 *
 * Generates a structured placement report with key metrics
 * for ANVUR accreditation, faculty presentations, or marketing.
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

    // All students
    const students = await prisma.user.findMany({
      where: { university: universityName, role: 'STUDENT' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        degree: true,
        graduationYear: true,
        _count: { select: { projects: { where: { isPublic: true } } } },
      },
    })
    const studentIds = students.map(s => s.id)
    const totalStudents = students.length

    if (totalStudents === 0) {
      return NextResponse.json({ error: 'No students found' }, { status: 404 })
    }

    // Projects stats
    const totalProjects = await prisma.project.count({
      where: { userId: { in: studentIds }, isPublic: true },
    })
    const verifiedProjects = await prisma.project.count({
      where: { userId: { in: studentIds }, isPublic: true, universityVerified: true },
    })
    const aiAnalyzedProjects = await prisma.project.count({
      where: { userId: { in: studentIds }, isPublic: true, aiAnalyzed: true },
    })

    // Profile views
    const totalViews = await prisma.profileView.count({
      where: { profileUserId: { in: studentIds }, viewerRole: 'RECRUITER' },
    })
    const uniqueViewers = await prisma.profileView.groupBy({
      by: ['viewerId'],
      where: { profileUserId: { in: studentIds }, viewerRole: 'RECRUITER' },
    })

    // Contacts
    const contacts = await prisma.contactUsage.findMany({
      where: { recipientId: { in: studentIds } },
      select: {
        recipientId: true,
        outcome: true,
        recruiter: { select: { company: true } },
      },
    })
    const contactedStudents = new Set(contacts.map(c => c.recipientId))
    const hiredStudents = new Set(contacts.filter(c => c.outcome === 'hired').map(c => c.recipientId))

    // Contact rate & placement rate
    const contactRate = totalStudents > 0 ? Math.round((contactedStudents.size / totalStudents) * 100) : 0
    const placementRate = totalStudents > 0 ? Math.round((hiredStudents.size / totalStudents) * 100) : 0

    // Top hiring companies
    const companyHires: Record<string, number> = {}
    const companyContacts: Record<string, number> = {}
    for (const c of contacts) {
      const company = c.recruiter?.company || 'Unknown'
      companyContacts[company] = (companyContacts[company] || 0) + 1
      if (c.outcome === 'hired') {
        companyHires[company] = (companyHires[company] || 0) + 1
      }
    }

    const topHiringCompanies = Object.entries(companyContacts)
      .map(([name, contactCount]) => ({
        name,
        contacts: contactCount,
        hires: companyHires[name] || 0,
      }))
      .sort((a, b) => b.contacts - a.contacts)
      .slice(0, 10)

    // Skills most in demand (from contacted students' projects)
    const contactedProjectSkills: Record<string, number> = {}
    if (contactedStudents.size > 0) {
      const contactedProjects = await prisma.project.findMany({
        where: { userId: { in: Array.from(contactedStudents) }, isPublic: true },
        select: { technologies: true, skills: true },
      })
      for (const p of contactedProjects) {
        for (const s of [...(p.technologies || []), ...(p.skills || [])]) {
          contactedProjectSkills[s] = (contactedProjectSkills[s] || 0) + 1
        }
      }
    }

    const topSkills = Object.entries(contactedProjectSkills)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }))

    // By degree program
    const byDegree: Record<string, { students: number; contacted: number; hired: number }> = {}
    for (const s of students) {
      const degree = s.degree || 'Not specified'
      if (!byDegree[degree]) byDegree[degree] = { students: 0, contacted: 0, hired: 0 }
      byDegree[degree].students++
      if (contactedStudents.has(s.id)) byDegree[degree].contacted++
      if (hiredStudents.has(s.id)) byDegree[degree].hired++
    }

    const programBreakdown = Object.entries(byDegree)
      .map(([degree, stats]) => ({
        degree,
        ...stats,
        contactRate: stats.students > 0 ? Math.round((stats.contacted / stats.students) * 100) : 0,
        placementRate: stats.students > 0 ? Math.round((stats.hired / stats.students) * 100) : 0,
      }))
      .sort((a, b) => b.students - a.students)

    // Average scores
    const projectScores = await prisma.project.aggregate({
      where: { userId: { in: studentIds }, isPublic: true, aiAnalyzed: true },
      _avg: { innovationScore: true, complexityScore: true },
    })

    return NextResponse.json({
      universityName,
      generatedAt: new Date().toISOString(),
      overview: {
        totalStudents,
        totalProjects,
        verifiedProjects,
        aiAnalyzedProjects,
        verificationRate: totalProjects > 0 ? Math.round((verifiedProjects / totalProjects) * 100) : 0,
      },
      engagement: {
        totalProfileViews: totalViews,
        uniqueRecruiters: uniqueViewers.length,
        totalContacts: contacts.length,
        contactedStudents: contactedStudents.size,
        hiredStudents: hiredStudents.size,
        contactRate,
        placementRate,
      },
      quality: {
        avgInnovationScore: Math.round(projectScores._avg.innovationScore || 0),
        avgComplexityScore: Math.round(projectScores._avg.complexityScore || 0),
      },
      topHiringCompanies,
      topSkills,
      programBreakdown,
    })
  } catch (error) {
    console.error('Placement report error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
