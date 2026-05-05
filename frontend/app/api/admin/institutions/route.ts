import { NextRequest, NextResponse } from 'next/server'
import { getServerSession, type Session } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { auditFromRequest } from '@/lib/audit'

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
 * POST /api/admin/institutions
 *
 * Create a real Institution row from the admin imports UI. Lets the
 * concierge onboard a new prospect (e.g. AMMI Monza) without running
 * the seed script against prod. Slug is auto-generated from name.
 *
 * Body: { name, type, city?, region?, country?, plan? }
 */

const bodySchema = z.object({
  name: z.string().trim().min(2).max(200),
  type: z.enum(['UNIVERSITY_PUBLIC', 'UNIVERSITY_PRIVATE', 'ITS', 'SCHOOL']),
  city: z.string().trim().max(120).optional(),
  region: z.string().trim().max(120).optional(),
  country: z.string().trim().length(2).optional().default('IT'),
  plan: z.enum(['CORE', 'PREMIUM']).optional().default('CORE'),
  isDemo: z.boolean().optional().default(false),
})

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
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

  const baseSlug = slugify(body.name)
  if (!baseSlug) return NextResponse.json({ error: 'Could not derive a slug from name' }, { status: 400 })

  // Make slug unique by suffixing a counter if needed.
  let slug = baseSlug
  for (let i = 0; i < 20; i++) {
    const existing = await prisma.institution.findUnique({ where: { slug }, select: { id: true } })
    if (!existing) break
    slug = `${baseSlug}-${i + 2}`
  }

  const institution = await prisma.institution.create({
    data: {
      name: body.name,
      slug,
      type: body.type,
      plan: body.plan,
      country: body.country.toUpperCase(),
      city: body.city ?? null,
      region: body.region ?? null,
      isDemo: body.isDemo,
    },
    select: { id: true, name: true, slug: true, type: true, country: true, isDemo: true },
  })

  void auditFromRequest(req, {
    actorId: auth.session.user.id,
    actorEmail: auth.session.user.email ?? null,
    actorRole: auth.session.user.role ?? null,
    action: 'OTHER',
    targetType: 'Institution',
    targetId: institution.id,
    context: { kind: 'INSTITUTION_CREATED', name: institution.name, slug: institution.slug },
  })

  return NextResponse.json({ institution })
}
