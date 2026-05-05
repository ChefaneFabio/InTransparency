import { NextRequest, NextResponse } from 'next/server'
import { getServerSession, type Session } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { auditFromRequest } from '@/lib/audit'
import { clearGrantCache, normalizeCompanyName } from '@/lib/access-grants'

const FOUNDER_EMAIL = 'chefane.fabio@gmail.com'

type AdminAuthOk = { ok: true; session: Session & { user: NonNullable<Session['user']> & { id: string; role?: string; email?: string | null } } }
type AdminAuthFail = { ok: false; status: number; error: string }

function requireAdmin(session: Session | null): AdminAuthOk | AdminAuthFail {
  if (!session?.user?.id) return { ok: false, status: 401, error: 'Unauthorized' }
  if (
    session.user.role !== 'ADMIN' &&
    session.user.email?.toLowerCase() !== FOUNDER_EMAIL
  ) {
    return { ok: false, status: 403, error: 'Forbidden' }
  }
  return { ok: true, session: session as AdminAuthOk['session'] }
}

/**
 * GET /api/admin/access-grants
 * List all grants with related company + institution metadata. Optional
 * `?status=active|expired|revoked|all` filter (default: active).
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const auth = requireAdmin(session)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { searchParams } = new URL(req.url)
  const status = (searchParams.get('status') ?? 'active').toLowerCase()
  const now = new Date()

  const where: Record<string, unknown> = {}
  if (status === 'active') {
    where.revokedAt = null
    where.OR = [{ expiresAt: null }, { expiresAt: { gt: now } }]
  } else if (status === 'expired') {
    where.revokedAt = null
    where.expiresAt = { lte: now }
  } else if (status === 'revoked') {
    where.revokedAt = { not: null }
  }
  // status === 'all' — no filter

  const grants = await prisma.institutionAccessGrant.findMany({
    where,
    include: {
      institution: { select: { id: true, name: true, slug: true, type: true } },
      companyProfile: { select: { id: true, companyName: true, slug: true, logoUrl: true } },
    },
    orderBy: { grantedAt: 'desc' },
  })

  return NextResponse.json({ grants })
}

const createSchema = z.object({
  companyDisplayName: z.string().trim().min(2, 'Company name is required').max(200),
  companyProfileId: z.string().cuid().optional(),
  institutionIds: z.array(z.string().cuid()).min(1, 'At least one institution is required'),
  programs: z.array(z.string().trim().min(1)).optional().default([]),
  cohortYears: z.array(z.number().int().min(2000).max(2100)).optional().default([]),
  allowSearch: z.boolean().optional().default(true),
  allowProfile: z.boolean().optional().default(true),
  allowContact: z.boolean().optional().default(true),
  expiresAt: z.string().datetime().nullable().optional(),
  notes: z.string().trim().max(1000).optional(),
})

/**
 * POST /api/admin/access-grants
 * Create one grant per institutionId × company (the unique constraint is on
 * (companyNameKey, institutionId) so re-granting an existing pair is an
 * upsert that resurrects/refreshes the row).
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const auth = requireAdmin(session)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  let payload: z.infer<typeof createSchema>
  try {
    payload = createSchema.parse(await req.json())
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const companyNameKey = normalizeCompanyName(payload.companyDisplayName)
  const expiresAt = payload.expiresAt ? new Date(payload.expiresAt) : null
  const grantedById = auth.session.user.id

  const created = await Promise.all(
    payload.institutionIds.map(institutionId =>
      prisma.institutionAccessGrant.upsert({
        where: { companyNameKey_institutionId: { companyNameKey, institutionId } },
        create: {
          companyNameKey,
          companyDisplayName: payload.companyDisplayName.trim(),
          companyProfileId: payload.companyProfileId ?? null,
          institutionId,
          programs: payload.programs ?? [],
          cohortYears: payload.cohortYears ?? [],
          allowSearch: payload.allowSearch ?? true,
          allowProfile: payload.allowProfile ?? true,
          allowContact: payload.allowContact ?? true,
          grantedById,
          expiresAt,
          notes: payload.notes ?? null,
        },
        update: {
          companyDisplayName: payload.companyDisplayName.trim(),
          companyProfileId: payload.companyProfileId ?? null,
          programs: payload.programs ?? [],
          cohortYears: payload.cohortYears ?? [],
          allowSearch: payload.allowSearch ?? true,
          allowProfile: payload.allowProfile ?? true,
          allowContact: payload.allowContact ?? true,
          grantedById,
          grantedAt: new Date(),
          revokedAt: null,
          revokedById: null,
          expiresAt,
          notes: payload.notes ?? null,
        },
      })
    )
  )

  // Invalidate the in-memory cache so the next recruiter request sees the change.
  clearGrantCache()

  void auditFromRequest(req, {
    actorId: grantedById,
    actorEmail: auth.session.user.email ?? null,
    actorRole: auth.session.user.role ?? null,
    action: 'ACCESS_GRANT_CREATED',
    context: {
      company: payload.companyDisplayName,
      companyKey: companyNameKey,
      institutionIds: payload.institutionIds,
      programs: payload.programs,
      cohortYears: payload.cohortYears,
      scope: {
        search: payload.allowSearch,
        profile: payload.allowProfile,
        contact: payload.allowContact,
      },
      expiresAt,
    },
  })

  return NextResponse.json({ created, count: created.length }, { status: 201 })
}
