import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { auditFromRequest } from '@/lib/audit'

/**
 * GET /api/dashboard/university/placements/export?format=csv&from=YYYY-MM-DD&to=YYYY-MM-DD
 *
 * Per-placement CSV export shaped for MIUR / INDIRE reporting (ITS Academy
 * monitoring + university tirocinio reports). Columns labelled in Italian
 * because that's the regulator's expected format.
 *
 * Some MIUR fields (codice fiscale, data di nascita, P.IVA azienda) are
 * not in our schema yet — we emit empty columns with the right header so
 * the file slots straight into the institution's existing template; staff
 * fill the gaps for the first round and we'll add capture flows once we
 * see what they actually need.
 */

const MIUR_HEADERS = [
  'Codice Fiscale Studente',
  'Cognome',
  'Nome',
  'Data di Nascita',
  'Email',
  'Corso di Studi',
  'Anno di Iscrizione',
  'Denominazione Azienda',
  'P.IVA Azienda',
  'Settore Azienda',
  'Mansione',
  'Tipologia Offerta',
  'Modalità di Lavoro',
  'Data Inizio',
  'Data Fine',
  'Ore Previste',
  'Ore Svolte',
  'Compenso Mensile',
  'Tutor Accademico',
  'Tutor Aziendale',
  'Stato',
  'Esito',
  'Note Esito',
] as const

const OFFER_TYPE_LABELS: Record<string, string> = {
  TIROCINIO_CURRICULARE: 'Tirocinio curricolare',
  TIROCINIO_EXTRA: 'Tirocinio extracurricolare',
  APPRENDISTATO: 'Apprendistato',
  PLACEMENT: 'Contratto / placement',
  PART_TIME: 'Part-time',
}

const STATUS_LABELS: Record<string, string> = {
  CONFIRMED: 'Confermato',
  PENDING: 'In attesa',
  DECLINED: 'Rifiutato',
}

const OUTCOME_LABELS: Record<string, string> = {
  COMPLETED: 'Completato',
  HIRED: 'Assunto al termine',
  DROPPED: 'Interrotto',
  EXTENDED: 'Prolungato',
}

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function isoDate(d: Date | null | undefined): string {
  if (!d) return ''
  return d.toISOString().slice(0, 10)
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, company: true, university: true, email: true },
  })
  if (!user || (user.role !== 'UNIVERSITY' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const universityName = user.company || user.university || ''
  if (!universityName) {
    return NextResponse.json({ error: 'University not configured on your profile' }, { status: 400 })
  }

  const { searchParams } = new URL(req.url)
  const format = (searchParams.get('format') || 'csv').toLowerCase()
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const where: {
    universityName: string
    startDate?: { gte?: Date; lte?: Date }
  } = { universityName }
  if (from || to) {
    where.startDate = {}
    if (from) where.startDate.gte = new Date(from)
    if (to) where.startDate.lte = new Date(to)
  }

  const placements = await prisma.placement.findMany({
    where,
    orderBy: { startDate: 'desc' },
    select: {
      id: true,
      companyName: true,
      companyIndustry: true,
      jobTitle: true,
      jobType: true,
      offerType: true,
      salaryAmount: true,
      salaryCurrency: true,
      salaryPeriod: true,
      startDate: true,
      endDate: true,
      plannedHours: true,
      completedHours: true,
      status: true,
      outcome: true,
      outcomeNotes: true,
      student: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          degree: true,
          graduationYear: true,
        },
      },
      academicTutor: { select: { firstName: true, lastName: true } },
      companyTutor: { select: { firstName: true, lastName: true } },
    },
    take: 5000,
  })

  void auditFromRequest(req, {
    actorId: user.id,
    actorEmail: user.email ?? null,
    actorRole: user.role ?? null,
    action: 'EXPORT_PLACEMENT_DATA',
    targetType: 'Placement',
    context: {
      kind: 'MIUR_PLACEMENT_EXPORT',
      universityName,
      rows: placements.length,
      from,
      to,
    },
  })

  if (format === 'json') {
    return NextResponse.json({
      universityName,
      generatedAt: new Date().toISOString(),
      rows: placements.length,
      placements,
    })
  }

  const rows: string[] = []
  rows.push(MIUR_HEADERS.map(csvEscape).join(','))

  for (const p of placements) {
    const tutorAccademico = [p.academicTutor?.firstName, p.academicTutor?.lastName].filter(Boolean).join(' ')
    const tutorAziendale = [p.companyTutor?.firstName, p.companyTutor?.lastName].filter(Boolean).join(' ')
    const compensoMensile =
      p.salaryAmount && p.salaryPeriod === 'monthly'
        ? `${p.salaryAmount} ${p.salaryCurrency}`
        : p.salaryAmount && p.salaryPeriod === 'yearly'
          ? `${Math.round(p.salaryAmount / 12)} ${p.salaryCurrency}`
          : ''

    rows.push(
      [
        '', // Codice Fiscale — not yet captured
        p.student.lastName ?? '',
        p.student.firstName ?? '',
        '', // Data di Nascita — not yet captured
        p.student.email ?? '',
        p.student.degree ?? '',
        p.student.graduationYear ?? '',
        p.companyName,
        '', // P.IVA — not yet captured
        p.companyIndustry ?? '',
        p.jobTitle,
        OFFER_TYPE_LABELS[p.offerType] ?? p.offerType,
        p.jobType.toLowerCase().replace('_', ' '),
        isoDate(p.startDate),
        isoDate(p.endDate),
        p.plannedHours ?? '',
        p.completedHours ?? '',
        compensoMensile,
        tutorAccademico,
        tutorAziendale,
        STATUS_LABELS[p.status] ?? p.status,
        p.outcome ? (OUTCOME_LABELS[p.outcome] ?? p.outcome) : '',
        p.outcomeNotes ?? '',
      ]
        .map(csvEscape)
        .join(',')
    )
  }

  // BOM so Excel opens UTF-8 cleanly.
  const csv = '﻿' + rows.join('\r\n') + '\r\n'
  const dateStr = new Date().toISOString().slice(0, 10)
  const fileName = `placements_miur_${dateStr}.csv`

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Cache-Control': 'no-store',
    },
  })
}
