/**
 * Audit logging — GDPR Art. 5(2) accountability + AI Act Art. 12 traceability.
 *
 * Call from any sensitive operation: admin actions, human-oversight reviews,
 * credential revocations, data access by non-subjects.
 *
 * Fire-and-forget — failures are logged but never block the caller.
 */

import prisma from './prisma'
import type { Prisma } from '@prisma/client'

export type AuditAction =
  | 'READ_USER_DATA'
  | 'DELETE_USER'
  | 'EXPORT_USER_DATA'
  | 'OVERRIDE_MATCH'
  | 'REVIEW_MATCH'
  | 'REVOKE_CREDENTIAL'
  | 'ADMIN_LOGIN'
  | 'PUBLISH_COMPANY_PROFILE'
  | 'UNPUBLISH_COMPANY_PROFILE'
  | 'MARK_EXCHANGE_COMPLETE'
  | 'FORCE_VERIFY_PROJECT'
  | 'OTHER'

interface AuditParams {
  actorId?: string | null
  actorEmail?: string | null
  actorRole?: string | null
  action: AuditAction
  targetType?: string
  targetId?: string
  context?: Record<string, unknown>
}

export async function audit(params: AuditParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: params.actorId ?? null,
        actorEmail: params.actorEmail ?? null,
        actorRole: params.actorRole ?? null,
        action: params.action,
        targetType: params.targetType ?? null,
        targetId: params.targetId ?? null,
        context: (params.context ?? {}) as Prisma.InputJsonValue,
      },
    })
  } catch (err) {
    // Never block the caller on audit failure — but log so we notice outages
    console.error('[audit] failed to write audit log:', err)
  }
}

/**
 * Convenience wrapper for Next.js API routes — extracts IP, user-agent from
 * headers and merges into context.
 */
export async function auditFromRequest(
  req: Request,
  params: AuditParams
): Promise<void> {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    null
  const userAgent = req.headers.get('user-agent') ?? null
  const url = req.url
  return audit({
    ...params,
    context: { ...(params.context ?? {}), ip, userAgent, url },
  })
}
