import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { buildStudentSkillSet } from '@/lib/job-matching'

/**
 * GET /api/dashboard/student/international-opportunities
 * Returns international job/stage opportunities matching student's skills.
 * Combines platform jobs + curated Erasmus/international programmes.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get student skills
    const student = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        country: true,
        projects: {
          select: { skills: true, tools: true, technologies: true, competencies: true, discipline: true },
        },
      },
    })

    if (!student) return NextResponse.json({ opportunities: [] })

    const studentSkills = buildStudentSkillSet(student.projects)

    // Find international jobs on the platform (not in student's country)
    const studentCountry = (student.country || 'IT').toLowerCase()
    const countryTerms = studentCountry === 'it'
      ? ['italy', 'italia', 'milan', 'rome', 'turin', 'naples', 'bologna', 'firenze', 'venezia', 'padova', 'bergamo']
      : [studentCountry]

    const allJobs = await prisma.job.findMany({
      where: { status: 'ACTIVE', isPublic: true },
      select: {
        id: true, title: true, companyName: true, location: true,
        jobType: true, workLocation: true, requiredSkills: true,
        remoteOk: true,
      },
      take: 200,
    })

    // Filter for international + remote opportunities
    const international = allJobs.filter(job => {
      const loc = (job.location || '').toLowerCase()
      const isLocal = countryTerms.some(t => loc.includes(t))
      const isRemote = job.remoteOk || job.workLocation === 'REMOTE'
      return !isLocal || isRemote
    })

    // Score and sort
    const scored = international.map(job => {
      const jobSkills = job.requiredSkills.map(s => s.toLowerCase())
      const matched = jobSkills.filter(s => studentSkills.has(s))
      const matchScore = jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : 0
      return { ...job, matchScore, matchedSkills: matched }
    }).filter(j => j.matchScore >= 20)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 15)

    // Add curated international programmes
    const programmes = [
      {
        id: 'erasmus-traineeship',
        type: 'programme',
        title: 'Erasmus+ Traineeship',
        description: 'EU-funded internship abroad (2-12 months). Monthly grant up to €750. Apply through your university.',
        countries: ['All EU countries'],
        deadline: 'Rolling (check your university)',
        url: 'https://erasmus-plus.ec.europa.eu/opportunities/individuals/traineeships-abroad',
      },
      {
        id: 'vulcanus-japan',
        type: 'programme',
        title: 'Vulcanus in Japan',
        description: 'Industrial placement in Japanese companies. 4 months language + 8 months internship. Fully funded.',
        countries: ['Japan'],
        deadline: 'January (annual)',
        url: 'https://www.eu-japan.eu/events/vulcanus-japan',
      },
      {
        id: 'iaeste',
        type: 'programme',
        title: 'IAESTE Internships',
        description: 'International paid internships for STEM students. 8-52 weeks in 80+ countries.',
        countries: ['80+ countries'],
        deadline: 'November-February',
        url: 'https://www.iaeste.org',
      },
      {
        id: 'aiesec',
        type: 'programme',
        title: 'AIESEC Global Talent',
        description: 'Professional internships abroad (6-78 weeks) across business, IT, engineering, teaching.',
        countries: ['126 countries'],
        deadline: 'Rolling',
        url: 'https://aiesec.org',
      },
    ]

    return NextResponse.json({
      jobs: scored,
      programmes,
      totalInternational: international.length,
    })
  } catch (error) {
    console.error('International opportunities error:', error)
    return NextResponse.json({ opportunities: [], programmes: [] })
  }
}
