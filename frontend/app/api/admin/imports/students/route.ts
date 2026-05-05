import { NextRequest, NextResponse } from 'next/server'
import { getServerSession, type Session } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { z } from 'zod'
import { auditFromRequest } from '@/lib/audit'
import { parseCsv } from '@/lib/csv'

const FOUNDER_EMAIL = 'chefane.fabio@gmail.com'

function requireAdmin(session: Session | null) {
  if (!session?.user?.id) return { ok: false as const, status: 401, error: 'Unauthorized' }
  if (
    session.user.role !== 'ADMIN' &&
    session.user.email?.toLowerCase() !== FOUNDER_EMAIL
  ) {
    return { ok: false as const, status: 403, error: 'Forbidden' }
  }
  return { ok: true as const, session }
}

/**
 * POST /api/admin/imports/students
 *
 * Bulk-import students for an institution. Concierge tooling — used by us
 * to onboard a partner without making them touch the admin UI.
 *
 * Body:
 *   {
 *     institutionId: string
 *     csv: string                  // raw CSV text
 *     dryRun?: boolean             // when true, parse + validate only, no writes
 *     defaultGraduationYear?: number
 *   }
 *
 * Expected CSV columns (case-insensitive header match):
 *   firstName, lastName, email, program (optional), graduationYear (optional)
 *
 * Behavior per row:
 *   - If a User with the email exists → reuse it; create/update an
 *     InstitutionAffiliation linking them to the target institution.
 *   - If new → create User with role=STUDENT, emailVerified=true (institution
 *     is vouching), random placeholder password (force-reset on first claim).
 *   - NO welcome email sent. Magic-link invites are deferred until the
 *     student has a real reason to come in (e.g. first recruiter contact).
 *
 * Returns a summary: { created, updated, skipped, errors }, each with the
 * affected email, so we can report back to the partner.
 */

const bodySchema = z.object({
  institutionId: z.string().cuid(),
  csv: z.string().min(1),
  dryRun: z.boolean().optional().default(false),
  defaultGraduationYear: z.number().int().min(2000).max(2100).optional(),
})

interface RowResult {
  email: string
  status: 'created' | 'updated' | 'skipped' | 'error'
  reason?: string
}

const REQUIRED_HEADERS = ['firstname', 'lastname', 'email']

function pickField(row: Record<string, string>, keys: string[]): string {
  const lc = Object.fromEntries(
    Object.entries(row).map(([k, v]) => [k.toLowerCase().replace(/[\s_-]/g, ''), v])
  )
  for (const k of keys) {
    const norm = k.toLowerCase().replace(/[\s_-]/g, '')
    if (lc[norm]) return lc[norm]
  }
  return ''
}

function makeUsername(email: string): string {
  const local = email.split('@')[0]?.toLowerCase().replace(/[^a-z0-9-]/g, '-') || 'student'
  return `${local}-${crypto.randomBytes(3).toString('hex')}`
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const auth = requireAdmin(session)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  let body: z.infer<typeof bodySchema>
  try {
    body = bodySchema.parse(await req.json())
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const institution = await prisma.institution.findUnique({
    where: { id: body.institutionId },
    select: { id: true, name: true, slug: true },
  })
  if (!institution) {
    return NextResponse.json({ error: 'Institution not found' }, { status: 404 })
  }

  const { rows, headers } = parseCsv(body.csv)
  const headersLc = headers.map(h => h.toLowerCase().replace(/[\s_-]/g, ''))
  const missing = REQUIRED_HEADERS.filter(h => !headersLc.includes(h))
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required CSV columns: ${missing.join(', ')}` },
      { status: 400 }
    )
  }

  const batchId = crypto.randomBytes(6).toString('hex')
  const results: RowResult[] = []
  let createdCount = 0
  let updatedCount = 0
  let skippedCount = 0
  let errorCount = 0

  // Pre-check duplicate emails within the CSV itself — drop later occurrences.
  const seenEmails = new Set<string>()

  for (const row of rows) {
    const firstName = pickField(row, ['firstName'])
    const lastName = pickField(row, ['lastName'])
    const emailRaw = pickField(row, ['email'])
    const program = pickField(row, ['program', 'course', 'corso']) || null
    const graduationYearRaw = pickField(row, ['graduationYear', 'gradYear', 'annoDiploma'])

    const email = emailRaw.toLowerCase()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      results.push({ email: emailRaw || '(blank)', status: 'error', reason: 'Invalid email' })
      errorCount++
      continue
    }
    if (!firstName || !lastName) {
      results.push({ email, status: 'error', reason: 'Missing first or last name' })
      errorCount++
      continue
    }
    if (seenEmails.has(email)) {
      results.push({ email, status: 'skipped', reason: 'Duplicate row in CSV' })
      skippedCount++
      continue
    }
    seenEmails.add(email)

    const graduationYear = graduationYearRaw
      ? String(parseInt(graduationYearRaw, 10) || '')
      : body.defaultGraduationYear
        ? String(body.defaultGraduationYear)
        : null

    if (body.dryRun) {
      results.push({ email, status: 'created', reason: 'dry-run' })
      createdCount++
      continue
    }

    try {
      const existing = await prisma.user.findUnique({
        where: { email },
        select: { id: true, role: true },
      })

      let userId: string
      if (existing) {
        userId = existing.id
        // Don't downgrade an existing role; only enrich missing fields.
        await prisma.user.update({
          where: { id: existing.id },
          data: {
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            ...(graduationYear ? { graduationYear } : {}),
          },
        })
        updatedCount++
        results.push({ email, status: 'updated' })
      } else {
        const placeholderPassword = await bcrypt.hash(crypto.randomBytes(24).toString('hex'), 10)
        const created = await prisma.user.create({
          data: {
            email,
            firstName,
            lastName,
            username: makeUsername(email),
            passwordHash: placeholderPassword,
            role: 'STUDENT',
            emailVerified: true,
            profilePublic: false,
            ...(graduationYear ? { graduationYear } : {}),
          },
          select: { id: true },
        })
        userId = created.id
        createdCount++
        results.push({ email, status: 'created' })
      }

      // Affiliation upsert. Unique key is (studentId, institutionId, program)
      // — same student in two programs gets two rows, by design.
      await prisma.institutionAffiliation.upsert({
        where: {
          studentId_institutionId_program: {
            studentId: userId,
            institutionId: institution.id,
            program: program ?? '',
          },
        },
        create: {
          studentId: userId,
          institutionId: institution.id,
          program,
          status: 'ACTIVE',
        },
        update: { status: 'ACTIVE' },
      })
    } catch (rowErr) {
      console.error('[imports/students] row failed:', email, rowErr)
      results.push({ email, status: 'error', reason: 'Database error' })
      errorCount++
    }
  }

  if (!body.dryRun) {
    void auditFromRequest(req, {
      actorId: auth.session.user.id,
      actorEmail: auth.session.user.email ?? null,
      actorRole: auth.session.user.role ?? null,
      action: 'OTHER',
      targetType: 'Institution',
      targetId: institution.id,
      context: {
        kind: 'BULK_IMPORT_STUDENTS',
        batchId,
        institutionName: institution.name,
        totals: { created: createdCount, updated: updatedCount, skipped: skippedCount, errors: errorCount },
      },
    })
  }

  return NextResponse.json({
    institution: { id: institution.id, name: institution.name, slug: institution.slug },
    batchId,
    dryRun: body.dryRun,
    totals: {
      processed: rows.length,
      created: createdCount,
      updated: updatedCount,
      skipped: skippedCount,
      errors: errorCount,
    },
    results,
  })
}
