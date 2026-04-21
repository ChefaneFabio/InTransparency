import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

/**
 * GET /api/dashboard/university/recruiter-engagement
 *
 * Shows university / ITS admins which companies and recruiters are
 * actively engaging with THEIR students — saves, outreach sequences,
 * matches, replies, and contact payments.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const role = session.user.role
    if (role !== 'UNIVERSITY' && role !== 'UNIVERSITY_ADMIN' && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Resolve the target university name: prefer session.user.university,
    // fall back to admin user's company/university fields.
    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { university: true, company: true },
    })
    const universityName =
      session.user.university || adminUser?.university || adminUser?.company || ''

    if (!universityName) {
      return NextResponse.json({ error: 'University not configured' }, { status: 400 })
    }

    // 1. Students on this university (case-insensitive contains match)
    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        university: { contains: universityName, mode: 'insensitive' },
      },
      select: { id: true, firstName: true, lastName: true },
    })

    const studentIds = students.map(s => s.id)
    const studentMap = new Map(
      students.map(s => {
        const first = s.firstName || 'Student'
        const lastInit = s.lastName ? `${s.lastName.charAt(0).toUpperCase()}.` : ''
        return [s.id, `${first} ${lastInit}`.trim()]
      })
    )

    if (studentIds.length === 0) {
      return NextResponse.json({
        totals: { activeRecruiters: 0, studentsEngaged: 0, sequencesStarted: 0, conversionToReply: 0 },
        topCompanies: [],
        funnel: { matched: 0, saved: 0, contacted: 0, replied: 0, hired: 0 },
        recentActivity: [],
      })
    }

    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    // 2. SavedCandidate — recruiters who saved any of our students
    const savedCandidates = await prisma.savedCandidate.findMany({
      where: { candidateId: { in: studentIds } },
      select: {
        recruiterId: true,
        candidateId: true,
        createdAt: true,
      },
    })

    // 3. OutreachSequence — outreach targeting our students
    const outreachSequences = await prisma.outreachSequence.findMany({
      where: { candidateId: { in: studentIds } },
      select: {
        recruiterId: true,
        candidateId: true,
        status: true,
        createdAt: true,
      },
    })

    // 4. MatchExplanation — matches where our student is the subject
    const matchExplanations = await prisma.matchExplanation.findMany({
      where: {
        subjectId: { in: studentIds },
        counterpartyType: 'RECRUITER',
      },
      select: {
        counterpartyId: true,
        subjectId: true,
        createdAt: true,
      },
    })

    // 5. ContactPayment — paid contacts made by recruiters that target our students
    //    ContactPayment schema doesn't directly reference the recipient; it records
    //    a recruiter buying credits. We treat successful (PAID) payments as the
    //    "hired/paid contact" signal for the funnel.
    //    We scope this loosely to recruiters who also showed up in our saves /
    //    outreach / matches, so it reflects this university's pipeline.
    const recruiterIdSet = new Set<string>()
    for (const s of savedCandidates) recruiterIdSet.add(s.recruiterId)
    for (const o of outreachSequences) recruiterIdSet.add(o.recruiterId)
    for (const m of matchExplanations) recruiterIdSet.add(m.counterpartyId)

    const recruiterIds = Array.from(recruiterIdSet)

    let hiredCount = 0
    if (recruiterIds.length > 0) {
      hiredCount = await prisma.contactPayment.count({
        where: {
          userId: { in: recruiterIds },
          status: 'SUCCEEDED',
        },
      })
    }

    // 6. Active recruiters (distinct) in last 90 days from saves + outreach
    const activeRecruiterSet = new Set<string>()
    for (const s of savedCandidates) {
      if (s.createdAt >= ninetyDaysAgo) activeRecruiterSet.add(s.recruiterId)
    }
    for (const o of outreachSequences) {
      if (o.createdAt >= ninetyDaysAgo) activeRecruiterSet.add(o.recruiterId)
    }
    const activeRecruiters = activeRecruiterSet.size

    // 7. Students engaged (distinct)
    const engagedStudents = new Set<string>()
    for (const s of savedCandidates) engagedStudents.add(s.candidateId)
    for (const o of outreachSequences) engagedStudents.add(o.candidateId)
    for (const m of matchExplanations) engagedStudents.add(m.subjectId)
    const studentsEngaged = engagedStudents.size

    // 8. Sequences started last 90 days + replies
    const sequencesStartedRecent = outreachSequences.filter(o => o.createdAt >= ninetyDaysAgo).length
    const repliesRecent = outreachSequences.filter(
      o => o.createdAt >= ninetyDaysAgo && o.status === 'REPLIED'
    ).length
    const conversionToReply =
      sequencesStartedRecent > 0 ? Math.round((repliesRecent / sequencesStartedRecent) * 100) : 0

    // 9. Funnel (all-time)
    const totalReplies = outreachSequences.filter(o => o.status === 'REPLIED').length
    const funnel = {
      matched: matchExplanations.length,
      saved: savedCandidates.length,
      contacted: outreachSequences.length,
      replied: totalReplies,
      hired: hiredCount,
    }

    // 10. Recruiter user lookup for names / companies
    const recruiterUsers =
      recruiterIds.length > 0
        ? await prisma.user.findMany({
            where: { id: { in: recruiterIds } },
            select: { id: true, firstName: true, lastName: true, company: true },
          })
        : []
    const recruiterMap = new Map(recruiterUsers.map(u => [u.id, u]))

    // 11. Top companies — aggregate per recruiter
    type CompanyAgg = {
      recruiterId: string
      studentsSaved: Set<string>
      outreachStarted: number
      replies: number
    }
    const perRecruiter = new Map<string, CompanyAgg>()
    const getAgg = (id: string): CompanyAgg => {
      let a = perRecruiter.get(id)
      if (!a) {
        a = { recruiterId: id, studentsSaved: new Set(), outreachStarted: 0, replies: 0 }
        perRecruiter.set(id, a)
      }
      return a
    }
    for (const s of savedCandidates) {
      getAgg(s.recruiterId).studentsSaved.add(s.candidateId)
    }
    for (const o of outreachSequences) {
      const a = getAgg(o.recruiterId)
      a.outreachStarted++
      if (o.status === 'REPLIED') a.replies++
    }

    const topCompanies = Array.from(perRecruiter.values())
      .map(a => {
        const u = recruiterMap.get(a.recruiterId)
        const recruiterName =
          [u?.firstName, u?.lastName].filter(Boolean).join(' ').trim() || 'Recruiter'
        return {
          recruiterName,
          companyName: u?.company ?? null,
          studentsSaved: a.studentsSaved.size,
          outreachStarted: a.outreachStarted,
          replies: a.replies,
        }
      })
      .sort(
        (a, b) =>
          b.studentsSaved + b.outreachStarted * 2 + b.replies * 5 -
          (a.studentsSaved + a.outreachStarted * 2 + a.replies * 5)
      )
      .slice(0, 20)

    // 12. Recent activity — merge + sort, take last 30
    type ActivityItem = {
      timestamp: string
      recruiterName: string
      companyName: string | null
      action: 'saved' | 'outreach_started' | 'match_generated'
      studentName: string
      _ts: number
    }
    const activity: ActivityItem[] = []

    const recruiterLabel = (id: string) => {
      const u = recruiterMap.get(id)
      const name = [u?.firstName, u?.lastName].filter(Boolean).join(' ').trim() || 'Recruiter'
      return { recruiterName: name, companyName: u?.company ?? null }
    }

    for (const s of savedCandidates) {
      const { recruiterName, companyName } = recruiterLabel(s.recruiterId)
      activity.push({
        timestamp: s.createdAt.toISOString(),
        _ts: s.createdAt.getTime(),
        recruiterName,
        companyName,
        action: 'saved',
        studentName: studentMap.get(s.candidateId) || 'Student',
      })
    }
    for (const o of outreachSequences) {
      const { recruiterName, companyName } = recruiterLabel(o.recruiterId)
      activity.push({
        timestamp: o.createdAt.toISOString(),
        _ts: o.createdAt.getTime(),
        recruiterName,
        companyName,
        action: 'outreach_started',
        studentName: studentMap.get(o.candidateId) || 'Student',
      })
    }
    for (const m of matchExplanations) {
      const { recruiterName, companyName } = recruiterLabel(m.counterpartyId)
      activity.push({
        timestamp: m.createdAt.toISOString(),
        _ts: m.createdAt.getTime(),
        recruiterName,
        companyName,
        action: 'match_generated',
        studentName: studentMap.get(m.subjectId) || 'Student',
      })
    }

    activity.sort((a, b) => b._ts - a._ts)
    const recentActivity = activity.slice(0, 30).map(a => ({
      timestamp: a.timestamp,
      recruiterName: a.recruiterName,
      companyName: a.companyName,
      action: a.action,
      studentName: a.studentName,
    }))

    return NextResponse.json({
      totals: {
        activeRecruiters,
        studentsEngaged,
        sequencesStarted: sequencesStartedRecent,
        conversionToReply,
      },
      topCompanies,
      funnel,
      recentActivity,
    })
  } catch (error) {
    console.error('Recruiter engagement error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
