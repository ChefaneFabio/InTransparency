import { NextRequest, NextResponse } from 'next/server'
import { getServerSession, type Session } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { auditFromRequest } from '@/lib/audit'
import { issueClaimToken } from '@/lib/claim-account'
import { sendAccountClaimEmail } from '@/lib/email'

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
 * POST /api/admin/imports/send-invites
 *
 * Issues claim tokens + sends activation emails to every active student
 * affiliated with the chosen institution. Idempotent — re-running invalidates
 * any prior token (only the latest invite link works) and resends.
 *
 * Body:
 *   {
 *     institutionId: string
 *     locale?: 'en' | 'it'         // default 'it'
 *     onlyUnclaimed?: boolean      // default true — skip users who have logged in
 *     userIds?: string[]           // optional restrict to a subset
 *   }
 */

const bodySchema = z.object({
  institutionId: z.string().cuid(),
  locale: z.enum(['en', 'it']).optional().default('it'),
  onlyUnclaimed: z.boolean().optional().default(true),
  userIds: z.array(z.string().cuid()).optional(),
})

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
    select: { id: true, name: true },
  })
  if (!institution) return NextResponse.json({ error: 'Institution not found' }, { status: 404 })

  // Resolve target students through the affiliation table.
  const affiliations = await prisma.institutionAffiliation.findMany({
    where: {
      institutionId: institution.id,
      status: 'ACTIVE',
      ...(body.userIds ? { studentId: { in: body.userIds } } : {}),
    },
    select: {
      student: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastLoginAt: true,
        },
      },
    },
  })

  // Dedup students (a student can have multiple affiliations to the same institution).
  const seen = new Set<string>()
  const candidates = affiliations
    .map(a => a.student)
    .filter(s => {
      if (seen.has(s.id)) return false
      seen.add(s.id)
      return true
    })
    .filter(s => (body.onlyUnclaimed ? !s.lastLoginAt : true))

  let sent = 0
  let failed = 0
  const errors: Array<{ email: string; reason: string }> = []

  for (const student of candidates) {
    try {
      const token = await issueClaimToken(student.email)
      await sendAccountClaimEmail(
        student.email,
        token,
        student.firstName ?? '',
        institution.name,
        body.locale
      )
      sent++
    } catch (err) {
      failed++
      errors.push({ email: student.email, reason: (err as Error).message ?? 'unknown' })
      console.error('[imports/send-invites] failed for', student.email, err)
    }
  }

  void auditFromRequest(req, {
    actorId: auth.session.user.id,
    actorEmail: auth.session.user.email ?? null,
    actorRole: auth.session.user.role ?? null,
    action: 'OTHER',
    targetType: 'Institution',
    targetId: institution.id,
    context: {
      kind: 'BULK_INVITE_STUDENTS',
      institutionName: institution.name,
      candidates: candidates.length,
      sent,
      failed,
      onlyUnclaimed: body.onlyUnclaimed,
    },
  })

  return NextResponse.json({
    institution: { id: institution.id, name: institution.name },
    candidates: candidates.length,
    sent,
    failed,
    errors: errors.slice(0, 20),
  })
}
