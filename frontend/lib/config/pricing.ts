/**
 * Pricing Configuration for InTransparency — single source of truth.
 *
 * Freemium-everywhere model:
 *   Students:     Free + Premium (€5/mo · €45/yr) — 30-day trial
 *   Companies:    Free (5 contacts/mo) + Subscription (€89/mo · €890/yr) + Enterprise
 *   Institutions: Free Core + Institutional Premium (€39/mo · €390/yr)
 *
 * Visible prices are owned by the i18n files (`messages/en.json` +
 * `messages/it.json`, key `pricingPage`). The numbers here are the
 * implementation source of truth for gates, checkouts, and analytics.
 * Whenever you edit one, edit the other — they must agree.
 */

import { SubscriptionTier, InstitutionPlan } from '@prisma/client'

// ─── Stripe Price IDs ──────────────────────────────────────────

export const STRIPE_PRICE_IDS = {
  // Students — €5/mo · €45/yr
  STUDENT_PREMIUM_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_STUDENT_PREMIUM_MONTHLY || '',
  STUDENT_PREMIUM_ANNUAL:  process.env.NEXT_PUBLIC_STRIPE_STUDENT_PREMIUM_ANNUAL  || '',

  // Companies — €89/mo · €890/yr
  RECRUITER_GROWTH_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_RECRUITER_GROWTH_MONTHLY || '',
  RECRUITER_GROWTH_ANNUAL:  process.env.NEXT_PUBLIC_STRIPE_RECRUITER_GROWTH_ANNUAL  || '',

  // Institutions — €39/mo · €390/yr (Phase 1 of freemium-everywhere)
  INSTITUTIONAL_PREMIUM_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_INSTITUTIONAL_PREMIUM_MONTHLY || '',
  INSTITUTIONAL_PREMIUM_ANNUAL:  process.env.NEXT_PUBLIC_STRIPE_INSTITUTIONAL_PREMIUM_ANNUAL  || '',

  // Legacy — kept for backward compatibility with old position listings
  CONTACT_CREDITS: process.env.NEXT_PUBLIC_STRIPE_CONTACT_CREDITS || '',
  POSITION_LISTING_STANDARD: process.env.NEXT_PUBLIC_STRIPE_POSITION_LISTING || '',
} as const

// ─── Company Tiers ─────────────────────────────────────────────

export interface PricingTier {
  id: SubscriptionTier
  name: string
  pricingModel: 'free' | 'subscription' | 'custom'
  price: {
    monthly: number  // euros, 0 for free/custom
    annual: number   // euros, 0 for free/custom
  }
  limits: {
    contacts?: number              // -1 = unlimited; for company freemium gate
    monthlyFreeContacts?: number   // recurring monthly free quota (Starter only)
    jobPosts?: number              // -1 = unlimited
    documents?: number             // MB, -1 = unlimited
    hiringAdvisor?: number         // messages/mo, -1 = unlimited
    interviewKits?: number         // per month, -1 = unlimited
    decisionPacks?: number         // per month, -1 = unlimited
    apiAccess?: boolean
    dedicatedSupport?: boolean
  }
  popular?: boolean
}

export const COMPANY_TIERS = {
  STARTER: {
    id: 'RECRUITER_FREE' as SubscriptionTier,
    name: 'Free',
    pricingModel: 'free' as const,
    price: { monthly: 0, annual: 0 },
    limits: {
      monthlyFreeContacts: 5,  // recurring; resets on the 1st of each month
      jobPosts: 3,             // raised from 1 on 2026-04-28 — friction-free direction for company freemium
      documents: 100,           // 100 MB
      hiringAdvisor: 3,
      interviewKits: 1,
      decisionPacks: 1,
      apiAccess: false,
      dedicatedSupport: false,
    },
  },
  GROWTH: {
    id: 'RECRUITER_PAY_PER_CONTACT' as SubscriptionTier,
    name: 'Subscription',
    pricingModel: 'subscription' as const,
    price: { monthly: 89, annual: 890 },
    limits: {
      contacts: -1,
      jobPosts: 10,
      documents: 5120,          // 5 GB
      hiringAdvisor: -1,
      interviewKits: -1,
      decisionPacks: -1,
      apiAccess: false,
      dedicatedSupport: false,
    },
    popular: true,
  },
  ENTERPRISE: {
    id: 'RECRUITER_ENTERPRISE' as SubscriptionTier,
    name: 'Enterprise',
    pricingModel: 'custom' as const,
    price: { monthly: 0, annual: 0 }, // custom pricing
    limits: {
      contacts: -1,
      jobPosts: -1,
      documents: -1,
      hiringAdvisor: -1,
      interviewKits: -1,
      decisionPacks: -1,
      apiAccess: true,
      dedicatedSupport: true,
    },
  },
} as const

export function getCompanyTier(subscriptionTier: SubscriptionTier): PricingTier {
  switch (subscriptionTier) {
    case 'RECRUITER_ENTERPRISE':
      return COMPANY_TIERS.ENTERPRISE
    case 'RECRUITER_PAY_PER_CONTACT':
      return COMPANY_TIERS.GROWTH
    default:
      return COMPANY_TIERS.STARTER
  }
}

// ─── Student Tiers ─────────────────────────────────────────────

export interface StudentTier {
  id: 'FREE' | 'STUDENT_PREMIUM'
  name: string
  pricingModel: 'free' | 'subscription'
  price: { monthly: number; annual: number }
  trialDays?: number
}

export const STUDENT_TIERS = {
  FREE: {
    id: 'FREE' as const,
    name: 'Free',
    pricingModel: 'free' as const,
    price: { monthly: 0, annual: 0 },
  },
  PREMIUM: {
    id: 'STUDENT_PREMIUM' as const,
    name: 'Premium',
    pricingModel: 'subscription' as const,
    price: { monthly: 5, annual: 45 },
    trialDays: 30,
  },
} as const

// ─── Institutional Tiers ───────────────────────────────────────
// Mirrors the Prisma `InstitutionPlan` enum (CORE | PREMIUM).
// Universities, schools, ITS share the same freemium model.

export interface InstitutionalTier {
  id: InstitutionPlan
  name: string
  pricingModel: 'free' | 'subscription'
  price: { monthly: number; annual: number }
  trialDays?: number
  limits: {
    aiAssistantQueries: number      // per month, -1 = unlimited
    auditLogDays: number            // history retention, -1 = unlimited
    reminderAutomation: boolean     // cron-driven reminder rules
    advancedAnalytics: boolean      // cross-cohort, cross-program drills
    aiPersonalizedConventions: boolean
    miurReports: boolean            // basic MIUR-format export
    csvExports: boolean
    prioritySupport: boolean        // 24h SLA email
  }
}

export const INSTITUTIONAL_TIERS: Record<InstitutionPlan, InstitutionalTier> = {
  CORE: {
    id: 'CORE',
    name: 'Free Core',
    pricingModel: 'free',
    price: { monthly: 0, annual: 0 },
    limits: {
      aiAssistantQueries: 50,
      auditLogDays: 30,
      reminderAutomation: false,
      advancedAnalytics: false,
      aiPersonalizedConventions: false,
      miurReports: false,
      csvExports: false,
      prioritySupport: false,
    },
  },
  PREMIUM: {
    id: 'PREMIUM',
    name: 'Institutional Premium',
    pricingModel: 'subscription',
    price: { monthly: 39, annual: 390 },
    trialDays: 30,
    limits: {
      aiAssistantQueries: -1,
      auditLogDays: -1,
      reminderAutomation: true,
      advancedAnalytics: true,
      aiPersonalizedConventions: true,
      miurReports: true,
      csvExports: true,
      prioritySupport: true,
    },
  },
}

export function getInstitutionTier(plan: InstitutionPlan | null | undefined): InstitutionalTier {
  return INSTITUTIONAL_TIERS[plan ?? 'CORE']
}

// ─── Generic helpers (kept for backward compatibility) ─────────

export function hasFeature(
  _userTier: SubscriptionTier,
  _feature: keyof PricingTier['limits']
): boolean {
  // Soft enforcement on company side — the real gate lives in
  // /api/messages/route.ts (5-contact monthly quota). This helper is
  // intentionally permissive for UI-side optimistic checks.
  return true
}

export function hasReachedLimit(
  _userTier: SubscriptionTier,
  _feature: keyof PricingTier['limits'],
  _currentUsage: number
): boolean {
  return false
}

// ─── Stripe Configuration ──────────────────────────────────────

export const STRIPE_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  successUrl: process.env.NEXT_PUBLIC_URL + '/dashboard/subscription/success',
  cancelUrl: process.env.NEXT_PUBLIC_URL + '/pricing',
  customerPortalUrl: process.env.NEXT_PUBLIC_URL + '/dashboard/subscription',
}
