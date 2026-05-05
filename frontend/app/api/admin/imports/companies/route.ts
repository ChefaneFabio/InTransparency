import { NextRequest, NextResponse } from 'next/server'
import { getServerSession, type Session } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import crypto from 'crypto'
import { z } from 'zod'
import { auditFromRequest } from '@/lib/audit'
import { parseCsv } from '@/lib/csv'
import { clearGrantCache, normalizeCompanyName } from '@/lib/access-grants'

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
 * POST /api/admin/imports/companies
 *
 * Bulk-import companies + auto-create access grants targeting one
 * institution. Concierge tooling — pre-loads a partner's existing
 * convenzionati so day-one their recruiters can browse the talent pool.
 *
 * Body:
 *   {
 *     institutionId: string
 *     csv: string                  // raw CSV text
 *     dryRun?: boolean
 *     expiresAt?: string | null    // ISO datetime; null = indefinite
 *     allowSearch?: boolean        // defaults true
 *     allowProfile?: boolean       // defaults true
 *     allowContact?: boolean       // defaults true
 *   }
 *
 * Expected CSV columns (case-insensitive):
 *   companyName, website (optional), industry (optional)
 *
 * Behavior per row:
 *   - Upsert CompanyProfile by slug (derived from companyName).
 *   - Upsert InstitutionAccessGrant on (companyNameKey, institutionId).
 *   - No outbound emails.
 */

const bodySchema = z.object({
  institutionId: z.string().cuid(),
  csv: z.string().min(1),
  dryRun: z.boolean().optional().default(false),
  expiresAt: z.string().datetime().nullable().optional(),
  allowSearch: z.boolean().optional().default(true),
  allowProfile: z.boolean().optional().default(true),
  allowContact: z.boolean().optional().default(true),
})

interface RowResult {
  company: string
  status: 'created' | 'updated' | 'skipped' | 'error'
  reason?: string
  profileCreated?: boolean
  grantCreated?: boolean
}

const REQUIRED_HEADERS = ['companyname']

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

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60) || 'company'
}

async function uniqueSlug(base: string, existingProfileId?: string): Promise<string> {
  const taken = await prisma.companyProfile.findUnique({
    where: { slug: base },
    select: { id: true },
  })
  if (!taken || taken.id === existingProfileId) return base
  const suffix = crypto.randomBytes(3).toString('hex')
  return `${base}-${suffix}`
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
  const expiresAt = body.expiresAt ? new Date(body.expiresAt) : null
  const results: RowResult[] = []
  let createdCount = 0
  let updatedCount = 0
  let skippedCount = 0
  let errorCount = 0

  const seenKeys = new Set<string>()

  for (const row of rows) {
    const companyName = pickField(row, ['companyName', 'name', 'azienda', 'company']).trim()
    const websiteRaw = pickField(row, ['website', 'sitoWeb', 'site'])
    const industry = pickField(row, ['industry', 'sector', 'settore']) || null

    if (!companyName) {
      results.push({ company: '(blank)', status: 'error', reason: 'Missing companyName' })
      errorCount++
      continue
    }
    const companyKey = normalizeCompanyName(companyName)
    if (seenKeys.has(companyKey)) {
      results.push({ company: companyName, status: 'skipped', reason: 'Duplicate row in CSV' })
      skippedCount++
      continue
    }
    seenKeys.add(companyKey)

    const websiteUrl = websiteRaw && /^https?:\/\//i.test(websiteRaw)
      ? websiteRaw
      : websiteRaw
        ? `https://${websiteRaw.replace(/^\/\//, '')}`
        : null

    if (body.dryRun) {
      results.push({ company: companyName, status: 'created', reason: 'dry-run' })
      createdCount++
      continue
    }

    try {
      const existingProfile = await prisma.companyProfile.findUnique({
        where: { companyName },
        select: { id: true, slug: true },
      })

      let profileId: string
      let profileCreated = false
      if (existingProfile) {
        profileId = existingProfile.id
        // Only enrich missing fields — don't overwrite a claimed profile.
        await prisma.companyProfile.update({
          where: { id: existingProfile.id },
          data: {
            ...(websiteUrl ? { websiteUrl } : {}),
            ...(industry ? { industries: { push: industry } } : {}),
          },
        })
      } else {
        const slug = await uniqueSlug(slugify(companyName))
        const created = await prisma.companyProfile.create({
          data: {
            companyName,
            slug,
            websiteUrl,
            industries: industry ? [industry] : [],
            published: false,
            verified: false,
          },
          select: { id: true },
        })
        profileId = created.id
        profileCreated = true
      }

      const existingGrant = await prisma.institutionAccessGrant.findUnique({
        where: {
          companyNameKey_institutionId: {
            companyNameKey: companyKey,
            institutionId: institution.id,
          },
        },
        select: { id: true, revokedAt: true },
      })

      let grantCreated = false
      if (!existingGrant) {
        await prisma.institutionAccessGrant.create({
          data: {
            companyNameKey: companyKey,
            companyDisplayName: companyName,
            companyProfileId: profileId,
            institutionId: institution.id,
            allowSearch: body.allowSearch ?? true,
            allowProfile: body.allowProfile ?? true,
            allowContact: body.allowContact ?? true,
            grantedById: auth.session.user.id,
            expiresAt,
          },
        })
        grantCreated = true
      } else if (existingGrant.revokedAt) {
        // Resurrect a revoked grant — admin re-imports it intentionally.
        await prisma.institutionAccessGrant.update({
          where: { id: existingGrant.id },
          data: {
            revokedAt: null,
            revokedById: null,
            companyDisplayName: companyName,
            companyProfileId: profileId,
            allowSearch: body.allowSearch ?? true,
            allowProfile: body.allowProfile ?? true,
            allowContact: body.allowContact ?? true,
            grantedById: auth.session.user.id,
            grantedAt: new Date(),
            expiresAt,
          },
        })
        grantCreated = true
      } else {
        // Active grant already exists — refresh metadata only.
        await prisma.institutionAccessGrant.update({
          where: { id: existingGrant.id },
          data: {
            companyDisplayName: companyName,
            companyProfileId: profileId,
            ...(expiresAt !== null ? { expiresAt } : {}),
          },
        })
      }

      if (profileCreated || grantCreated) {
        createdCount++
        results.push({
          company: companyName,
          status: 'created',
          profileCreated,
          grantCreated,
        })
      } else {
        updatedCount++
        results.push({ company: companyName, status: 'updated' })
      }
    } catch (rowErr) {
      console.error('[imports/companies] row failed:', companyName, rowErr)
      results.push({ company: companyName, status: 'error', reason: 'Database error' })
      errorCount++
    }
  }

  if (!body.dryRun) {
    clearGrantCache()
    void auditFromRequest(req, {
      actorId: auth.session.user.id,
      actorEmail: auth.session.user.email ?? null,
      actorRole: auth.session.user.role ?? null,
      action: 'OTHER',
      targetType: 'Institution',
      targetId: institution.id,
      context: {
        kind: 'BULK_IMPORT_COMPANIES',
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
