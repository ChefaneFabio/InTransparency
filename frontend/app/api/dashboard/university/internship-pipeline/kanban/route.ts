import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'

export const maxDuration = 15

/**
 * GET /api/dashboard/university/internship-pipeline/kanban
 *
 * Reads the tirocinio pipeline from `InternshipDeal`. On first call for an
 * institution that has zero deals, auto-backfills from legacy signals
 * (ContactUsage → LEAD, Application → CONVENZIONE/MATCHING, Placement →
 * MATCHING/ATTIVO/COMPLETATO, HiringConfirmation → ASSUNTO) so the board
 * is populated on day one. After the first load the kanban is fully
 * interactive — drag-and-drop calls PATCH /deals/[id].
 */
type Stage = 'LEAD' | 'CONVENZIONE' | 'MATCHING' | 'ATTIVO' | 'COMPLETATO' | 'ASSUNTO' | 'LOST'
const STAGE_ORDER: Stage[] = ['LEAD', 'CONVENZIONE', 'MATCHING', 'ATTIVO', 'COMPLETATO', 'ASSUNTO']

async function backfillFromLegacy(ownerId: string, universityName: string) {
  const students = await prisma.user.findMany({
    where: { university: universityName, role: 'STUDENT' },
    select: { id: true },
  })
  const studentIds = students.map(s => s.id)
  if (studentIds.length === 0) return 0

  const now = new Date()
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())

  const [placements, contacts, applications, hirings] = await Promise.all([
    prisma.placement.findMany({
      where: { universityName, studentId: { in: studentIds } },
      select: {
        id: true, studentId: true, companyName: true, jobTitle: true, companyIndustry: true,
        status: true, startDate: true, salaryAmount: true, salaryCurrency: true, createdAt: true,
      },
    }),
    prisma.contactUsage.findMany({
      where: { recipientId: { in: studentIds } },
      select: {
        id: true, recipientId: true, createdAt: true,
        recruiter: { select: { firstName: true, lastName: true, email: true, company: true } },
      },
      take: 200,
    }),
    prisma.application.findMany({
      where: { applicantId: { in: studentIds } },
      select: {
        id: true, applicantId: true, status: true, createdAt: true,
        job: { select: { title: true, companyName: true } },
      },
      take: 200,
    }),
    prisma.hiringConfirmation.findMany({
      where: { studentId: { in: studentIds } },
      select: { id: true, studentId: true, companyName: true, jobTitle: true, status: true, createdAt: true },
    }),
  ])

  type DealSeed = {
    companyName: string
    studentId: string | null
    stage: Stage
    role?: string | null
    industry?: string | null
    contactName?: string | null
    contactEmail?: string | null
    salaryAmount?: number | null
    salaryCurrency?: string | null
    startDate?: Date | null
    stageChangedAt?: Date
    sourceType: string
    sourceId: string
  }

  // Dedup key: (studentId||none)::company — priority: hiring > placement > application > contact
  const map = new Map<string, DealSeed>()

  for (const c of contacts) {
    const company = c.recruiter?.company || null
    if (!company) continue
    const key = `${c.recipientId}::${company.toLowerCase()}`
    map.set(key, {
      companyName: company,
      studentId: c.recipientId,
      stage: 'LEAD',
      contactName: [c.recruiter?.firstName, c.recruiter?.lastName].filter(Boolean).join(' ') || null,
      contactEmail: c.recruiter?.email || null,
      stageChangedAt: c.createdAt,
      sourceType: 'CONTACT',
      sourceId: c.id,
    })
  }

  for (const a of applications) {
    const company = a.job?.companyName || null
    if (!company) continue
    const key = `${a.applicantId}::${company.toLowerCase()}`
    const existing = map.get(key)
    if (existing && ['MATCHING', 'ATTIVO', 'COMPLETATO', 'ASSUNTO'].includes(existing.stage)) continue
    map.set(key, {
      companyName: company,
      studentId: a.applicantId,
      stage: a.status === 'INTERVIEW' ? 'MATCHING' : 'CONVENZIONE',
      role: a.job?.title || null,
      stageChangedAt: a.createdAt,
      sourceType: 'APPLICATION',
      sourceId: a.id,
    })
  }

  for (const p of placements) {
    if (!p.companyName) continue
    const key = `${p.studentId}::${p.companyName.toLowerCase()}`
    const existing = map.get(key)
    if (existing && existing.stage === 'ASSUNTO') continue

    let stage: Stage
    if (p.status === 'PENDING') stage = 'CONVENZIONE'
    else if (p.status === 'CONFIRMED') {
      const start = p.startDate
      if (!start || start > now) stage = 'MATCHING'
      else if (start > sixMonthsAgo) stage = 'ATTIVO'
      else stage = 'COMPLETATO'
    } else stage = 'COMPLETATO'

    map.set(key, {
      companyName: p.companyName,
      studentId: p.studentId,
      stage,
      role: p.jobTitle || null,
      industry: p.companyIndustry || null,
      salaryAmount: p.salaryAmount || null,
      salaryCurrency: p.salaryCurrency || 'EUR',
      startDate: p.startDate || null,
      stageChangedAt: p.startDate || p.createdAt,
      sourceType: 'PLACEMENT',
      sourceId: p.id,
    })
  }

  for (const h of hirings) {
    if (!h.companyName || h.status !== 'CONFIRMED_HIRED') continue
    const key = `${h.studentId}::${h.companyName.toLowerCase()}`
    const existing = map.get(key)
    map.set(key, {
      companyName: h.companyName,
      studentId: h.studentId,
      stage: 'ASSUNTO',
      role: h.jobTitle || existing?.role || null,
      industry: existing?.industry || null,
      salaryAmount: existing?.salaryAmount || null,
      salaryCurrency: existing?.salaryCurrency || null,
      startDate: existing?.startDate || null,
      stageChangedAt: h.createdAt,
      sourceType: 'HIRING',
      sourceId: h.id,
    })
  }

  if (map.size === 0) return 0

  const created = await prisma.internshipDeal.createMany({
    data: Array.from(map.values()).map(d => ({
      universityName,
      ownerId,
      companyName: d.companyName,
      contactName: d.contactName || null,
      contactEmail: d.contactEmail || null,
      role: d.role || null,
      industry: d.industry || null,
      studentId: d.studentId || null,
      stage: d.stage as any,
      stageChangedAt: d.stageChangedAt || new Date(),
      startDate: d.startDate || null,
      salaryAmount: d.salaryAmount || null,
      salaryCurrency: d.salaryCurrency || null,
      sourceType: d.sourceType,
      sourceId: d.sourceId,
    })),
    skipDuplicates: true,
  })
  return created.count
}

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const universityName = user.university || user.company || ''
    if (!universityName) return NextResponse.json({ stages: [], summary: { total: 0, conversionRate: 0, activeStages: 0, atRisk: 0 } })

    // If this owner has zero deals, backfill from legacy records.
    const existingCount = await prisma.internshipDeal.count({
      where: { ownerId: session.user.id },
    })
    if (existingCount === 0) {
      const backfilled = await backfillFromLegacy(session.user.id, universityName)
      if (backfilled > 0) console.log(`Backfilled ${backfilled} internship deals for ${session.user.id}`)
    }

    // Read all deals for this owner, join student.
    const deals = await prisma.internshipDeal.findMany({
      where: { ownerId: session.user.id },
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true, degree: true, photo: true },
        },
      },
      orderBy: { stageChangedAt: 'desc' },
    })

    const now = new Date()
    const cards = deals.map(d => {
      const stageRef = d.stageChangedAt || d.createdAt
      const daysInStage = Math.max(0, Math.round((now.getTime() - stageRef.getTime()) / 86_400_000))
      return {
        id: d.id,
        stage: d.stage as Stage,
        company: d.companyName,
        role: d.role,
        industry: d.industry,
        contactName: d.contactName,
        contactEmail: d.contactEmail,
        tutorName: d.tutorName,
        tutorEmail: d.tutorEmail,
        salary: d.salaryAmount,
        salaryCurrency: d.salaryCurrency,
        notes: d.notes,
        startDate: d.startDate?.toISOString() || null,
        endDate: d.endDate?.toISOString() || null,
        updatedAt: d.updatedAt.toISOString(),
        daysInStage,
        student: d.student
          ? {
              id: d.student.id,
              name: [d.student.firstName, d.student.lastName].filter(Boolean).join(' ') || 'Studente',
              degree: d.student.degree,
              photo: d.student.photo,
            }
          : null,
      }
    })

    // Group by stage, order columns
    const byStage: Record<Stage, typeof cards> = {
      LEAD: [], CONVENZIONE: [], MATCHING: [], ATTIVO: [], COMPLETATO: [], ASSUNTO: [], LOST: [],
    }
    for (const c of cards) byStage[c.stage].push(c)

    const stages = STAGE_ORDER.map(stage => ({
      stage,
      count: byStage[stage].length,
      cards: byStage[stage].slice(0, 60),
    }))

    const total = cards.length
    const assunto = byStage.ASSUNTO.length
    const summary = {
      total,
      conversionRate: total > 0 ? Math.round((assunto / total) * 100) : 0,
      activeStages: byStage.ATTIVO.length,
      atRisk: byStage.ATTIVO.filter(c => c.daysInStage > 150).length,
    }

    return NextResponse.json({ stages, summary })
  } catch (error) {
    console.error('Internship kanban error:', error)
    return NextResponse.json({ error: 'Failed to build kanban' }, { status: 500 })
  }
}
