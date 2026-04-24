import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

/**
 * Institutional workspace gating — DISABLED 2026-04-24.
 *
 * Business model pivot: ITS and universities are now fully freemium with
 * access to the complete M1–M4 workspace. Companies (recruiters) are the
 * revenue side — they pay per-contact or flat subscription, gated elsewhere
 * (see contact-usage limits + saved-candidate caps).
 *
 * The PREMIUM/CORE plan enum on Institution stays on the schema as a
 * capability-flag for *potential* future add-ons (enterprise analytics,
 * bulk endorsement, white-label instance). For now `checkPremium()` is a
 * no-op that always allows, so every route that previously gated writes
 * continues to work but without blocking. The 11 call sites don't need
 * individual edits.
 *
 * If/when a specific feature moves back behind a paywall, re-gate by
 * returning the 402 response for that feature key only.
 */

export const PREMIUM_FEATURES = [
  'mediation.message.submit',
  'mediation.message.approve',
  'mediation.message.edit',
  'mediation.message.reject',
  'mediation.message.note',
  'mediation.message.reply',
  'job.approve',
  'job.reject',
  'lead.create',
  'lead.update',
  'lead.delete',
  'lead.stage_change',
  'lead.activity.log',
  'placement.create',
  'placement.update',
  'placement.delete',
  'placement.stage_change',
  'placement.evaluation.submit',
  'placement.hours.log',
  'convention.generate',
  'reminder.send',
  'reminder.rule.edit',
  'assistant.query',
] as const

export type PremiumFeature = typeof PREMIUM_FEATURES[number]

export async function getInstitutionPlan(institutionId: string): Promise<'CORE' | 'PREMIUM' | null> {
  const i = await prisma.institution.findUnique({
    where: { id: institutionId },
    select: { plan: true },
  })
  return i?.plan ?? null
}

/**
 * Currently a no-op: institutions are fully freemium. Kept as a pass-through
 * so call sites don't need to change. To re-enable a paywall, restore the
 * original PREMIUM check for specific features.
 */
export async function checkPremium(
  _institutionId: string,
  _feature?: PremiumFeature
): Promise<NextResponse | null> {
  return null
}

/**
 * Non-throwing variant. Returns true for freemium institutions too — used
 * in GETs to annotate `canEdit`, which should be true for everyone now.
 */
export async function isInstitutionPremium(_institutionId: string): Promise<boolean> {
  return true
}
