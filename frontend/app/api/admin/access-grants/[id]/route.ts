import { NextRequest, NextResponse } from 'next/server'
import { getServerSession, type Session } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { auditFromRequest } from '@/lib/audit'
import { clearGrantCache } from '@/lib/access-grants'

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
 * DELETE /api/admin/access-grants/[id]
 * Soft-revoke a grant. Keeps the row for audit history; the active-grant
 * lookup filters on revokedAt = null so revoked grants stop applying
 * immediately.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  const auth = requireAdmin(session)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { id } = await params

  const existing = await prisma.institutionAccessGrant.findUnique({
    where: { id },
    select: { id: true, companyDisplayName: true, institutionId: true, revokedAt: true },
  })
  if (!existing) {
    return NextResponse.json({ error: 'Grant not found' }, { status: 404 })
  }
  if (existing.revokedAt) {
    return NextResponse.json({ error: 'Grant already revoked' }, { status: 400 })
  }

  const revoked = await prisma.institutionAccessGrant.update({
    where: { id },
    data: {
      revokedAt: new Date(),
      revokedById: auth.session.user.id,
    },
  })

  clearGrantCache()

  void auditFromRequest(req, {
    actorId: auth.session.user.id,
    actorEmail: auth.session.user.email ?? null,
    actorRole: auth.session.user.role ?? null,
    action: 'ACCESS_GRANT_REVOKED',
    targetType: 'InstitutionAccessGrant',
    targetId: id,
    context: {
      company: existing.companyDisplayName,
      institutionId: existing.institutionId,
    },
  })

  return NextResponse.json({ grant: revoked })
}
