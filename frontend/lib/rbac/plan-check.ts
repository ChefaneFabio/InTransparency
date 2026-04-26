import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { INSTITUTIONAL_TIERS } from '@/lib/config/pricing'

/**
 * Institutional workspace gating — re-enabled 2026-04-26.
 *
 * Freemium-everywhere model (per pricing.ts INSTITUTIONAL_TIERS):
 *   Free Core (CORE plan):
 *     - Full M1–M4 workspace (mediation, offer moderation, CRM, placements)
 *     - Basic analytics + scorecard
 *     - Audit log (last 30 days, no CSV export)
 *     - AI Assistant up to 50 queries/month
 *     - Convention Builder (template-based)
 *     - Manual reminder send
 *
 *   Institutional Premium (PREMIUM plan, €39/mo · €390/yr, 30-day trial):
 *     - Everything in CORE, plus:
 *     - AI Assistant unlimited
 *     - Advanced analytics (cross-cohort, cross-program drills)
 *     - Audit log full history + CSV export
 *     - Reminder automation (rules + cron)
 *     - AI-personalized convention clauses
 *     - MIUR-format reports
 *     - Priority support
 *
 * Use checkPremium(institutionId, feature) at the entry of any premium-gated
 * route. Returns null when allowed, or a 402 NextResponse when not.
 */

export const PREMIUM_FEATURES = [
  // M1 Mediation Inbox — Free Core
  'mediation.message.submit',
  'mediation.message.approve',
  'mediation.message.edit',
  'mediation.message.reject',
  'mediation.message.note',
  'mediation.message.reply',

  // M2 Offer Moderation — Free Core
  'job.approve',
  'job.reject',

  // M3 Company CRM — Free Core
  'lead.create',
  'lead.update',
  'lead.delete',
  'lead.stage_change',
  'lead.activity.log',

  // M4 Placement Pipeline — Free Core
  'placement.create',
  'placement.update',
  'placement.delete',
  'placement.stage_change',
  'placement.evaluation.submit',
  'placement.hours.log',

  // Convention Builder — template is Free, AI-personalized is Premium
  'convention.generate',           // template — Free
  'convention.ai.generate',        // AI-personalized — Premium

  // Reminders — manual send Free, rule automation Premium
  'reminder.send',                 // manual — Free
  'reminder.rule.edit',            // automation — Premium

  // AI Assistant — quota-gated on Core (50/month), unlimited on Premium
  'assistant.query',

  // Advanced analytics, MIUR, CSV export — Premium
  'analytics.advanced.read',
  'audit.export.csv',
  'report.miur.generate',
] as const

export type PremiumFeature = typeof PREMIUM_FEATURES[number]

/**
 * Features that are entirely blocked on CORE — calling these from a CORE
 * institution returns 402. Anything not in this set (and not `assistant.query`)
 * is allowed for both plans.
 */
const PREMIUM_ONLY_FEATURES: ReadonlySet<PremiumFeature> = new Set<PremiumFeature>([
  'convention.ai.generate',
  'reminder.rule.edit',
  'analytics.advanced.read',
  'audit.export.csv',
  'report.miur.generate',
])

export async function getInstitutionPlan(institutionId: string): Promise<'CORE' | 'PREMIUM' | null> {
  const i = await prisma.institution.findUnique({
    where: { id: institutionId },
    select: { plan: true },
  })
  return i?.plan ?? null
}

/**
 * Counts AI Assistant turns in the current calendar month for this
 * institution. One turn = one POST to /api/dashboard/university/assistant
 * (which logs an `entityType: 'AssistantTurn'` audit event before running).
 * Tool invocations within a turn are NOT counted — those log under
 * `entityType: 'AssistantQuery'` and are unbounded.
 */
async function countAssistantTurnsThisMonth(institutionId: string): Promise<number> {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  return prisma.auditEvent.count({
    where: {
      institutionId,
      entityType: 'AssistantTurn',
      createdAt: { gte: startOfMonth },
    },
  })
}

function startOfNextMonth(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + 1, 1)
}

/**
 * Returns null if the action is allowed for this institution's plan,
 * or a 402 NextResponse describing the upgrade path if it isn't.
 */
export async function checkPremium(
  institutionId: string,
  feature?: PremiumFeature
): Promise<NextResponse | null> {
  // Defensive: if no feature is named, allow (caller-side bug should not hard-fail).
  if (!feature) return null

  const plan = (await getInstitutionPlan(institutionId)) ?? 'CORE'

  // Premium-only features — block CORE outright.
  if (PREMIUM_ONLY_FEATURES.has(feature) && plan !== 'PREMIUM') {
    return NextResponse.json(
      {
        error: 'This feature requires Institutional Premium.',
        code: 'PREMIUM_REQUIRED',
        feature,
        upgradeUrl: '/pricing?for=institutions',
      },
      { status: 402 }
    )
  }

  // AI Assistant — quota-gated on Core, unlimited on Premium.
  if (feature === 'assistant.query' && plan === 'PREMIUM') return null
  if (feature === 'assistant.query') {
    const limit = INSTITUTIONAL_TIERS.CORE.limits.aiAssistantQueries
    if (limit < 0) return null // sentinel for unlimited; not expected on CORE
    const used = await countAssistantTurnsThisMonth(institutionId)
    if (used >= limit) {
      return NextResponse.json(
        {
          error: `Your institution has used all ${limit} AI Assistant queries this month. Upgrade to Institutional Premium for unlimited queries.`,
          code: 'AI_QUOTA_EXHAUSTED',
          feature,
          used,
          limit,
          resetsOn: startOfNextMonth().toISOString(),
          upgradeUrl: '/pricing?for=institutions',
        },
        { status: 402 }
      )
    }
  }

  // All other features in PREMIUM_FEATURES are part of Free Core (M1–M4 ops).
  return null
}

/**
 * Non-throwing variant. Returns true if the institution is on PREMIUM —
 * use to flag premium-only UI affordances (e.g., enable a "CSV export" button).
 */
export async function isInstitutionPremium(institutionId: string): Promise<boolean> {
  const plan = await getInstitutionPlan(institutionId)
  return plan === 'PREMIUM'
}

/**
 * Aggregated usage snapshot for the institution dashboard. Powers the
 * "47/50 AI queries used this month" banner and any future quota UI.
 * Returns counts even for PREMIUM plans (limit = -1 indicates unlimited).
 */
export async function getInstitutionUsage(institutionId: string) {
  const plan = (await getInstitutionPlan(institutionId)) ?? 'CORE'
  const tier = INSTITUTIONAL_TIERS[plan]
  const aiUsed = await countAssistantTurnsThisMonth(institutionId)
  const aiLimit = tier.limits.aiAssistantQueries
  return {
    plan,
    aiAssistant: {
      used: aiUsed,
      limit: aiLimit, // -1 = unlimited
      remaining: aiLimit < 0 ? -1 : Math.max(0, aiLimit - aiUsed),
      resetsOn: startOfNextMonth().toISOString(),
    },
    auditLogDays: tier.limits.auditLogDays, // -1 = unlimited
    advancedAnalytics: tier.limits.advancedAnalytics,
    reminderAutomation: tier.limits.reminderAutomation,
    aiPersonalizedConventions: tier.limits.aiPersonalizedConventions,
    miurReports: tier.limits.miurReports,
    csvExports: tier.limits.csvExports,
  }
}
