/**
 * Pricing Configuration for InTransparency
 *
 * Revenue model:
 * - Students: Free forever. They are the product.
 * - Universities / Schools / ITS: Free forever. They are the distribution channel.
 * - Companies: Freemium. Free to search, paid to contact at scale.
 *
 * Company tiers:
 *   Starter (free): 3 talent unlocks at signup (one-time), 1 job post, basic pipeline
 *   Growth (€149/mo): 50 talent unlocks/mo, 10 job posts, full tools
 *   Enterprise (custom): unlimited everything, API, dedicated CSM
 */

import { SubscriptionTier } from '@prisma/client'

// Stripe Price IDs
export const STRIPE_PRICE_IDS = {
  // Student Plans
  STUDENT_PREMIUM_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_STUDENT_PREMIUM_MONTHLY || '',

  // Company Plans
  RECRUITER_GROWTH_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_RECRUITER_GROWTH_MONTHLY || '',
  RECRUITER_GROWTH_ANNUAL: process.env.NEXT_PUBLIC_STRIPE_RECRUITER_GROWTH_ANNUAL || '',

  // Legacy — kept for backward compatibility
  CONTACT_CREDITS: process.env.NEXT_PUBLIC_STRIPE_CONTACT_CREDITS || '',
  POSITION_LISTING_STANDARD: process.env.NEXT_PUBLIC_STRIPE_POSITION_LISTING || '',
} as const

// ─── Pricing Tiers ─────────────────────────────────────────────

export interface PricingTier {
  id: SubscriptionTier
  name: string
  pricingModel: 'free' | 'subscription' | 'custom'
  price: {
    monthly: number  // euros, 0 for free
    annual: number   // euros, 0 for free
  }
  limits: {
    contacts?: number        // -1 = unlimited
    jobPosts?: number        // -1 = unlimited
    documents?: number       // MB, -1 = unlimited
    hiringAdvisor?: number   // messages/mo, -1 = unlimited
    interviewKits?: number   // per month, -1 = unlimited
    decisionPacks?: number   // per month, -1 = unlimited
    apiAccess?: boolean
    dedicatedSupport?: boolean
  }
  popular?: boolean
}

// Company Tiers
export const COMPANY_TIERS = {
  STARTER: {
    id: 'RECRUITER_FREE' as SubscriptionTier,
    name: 'Starter',
    pricingModel: 'free' as const,
    price: { monthly: 0, annual: 0 },
    limits: {
      talentConnections: 3, // one-time at signup, not recurring
      jobPosts: 1,
      documents: 100,        // 100 MB
      hiringAdvisor: 3,
      interviewKits: 1,
      decisionPacks: 0,
      apiAccess: false,
      dedicatedSupport: false,
    },
  },
  GROWTH: {
    id: 'RECRUITER_PAY_PER_CONTACT' as SubscriptionTier,
    name: 'Growth',
    pricingModel: 'subscription' as const,
    price: { monthly: 149, annual: 1490 },
    limits: {
      talentConnections: 50,
      jobPosts: 10,
      documents: 5120,       // 5 GB
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
      talentConnections: -1,
      jobPosts: -1,
      documents: -1,
      hiringAdvisor: -1,
      interviewKits: -1,
      decisionPacks: -1,
      apiAccess: true,
      dedicatedSupport: true,
    },
  },
}

// ─── Feature gating ────────────────────────────────────────────

/**
 * Phase 1: Soft enforcement.
 * Show limits in UI but don't hard-block yet.
 * This will switch to hard enforcement in Phase 2.
 */
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

export function hasFeature(
  userTier: SubscriptionTier,
  feature: keyof PricingTier['limits']
): boolean {
  // Phase 1: grant access to everything — soft limits shown in UI
  return true
}

export function hasReachedLimit(
  userTier: SubscriptionTier,
  feature: keyof PricingTier['limits'],
  currentUsage: number
): boolean {
  // Phase 1: no hard limits — soft nudges only
  return false
}

// Stripe configuration
export const STRIPE_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  successUrl: process.env.NEXT_PUBLIC_URL + '/dashboard/subscription/success',
  cancelUrl: process.env.NEXT_PUBLIC_URL + '/pricing',
  customerPortalUrl: process.env.NEXT_PUBLIC_URL + '/dashboard/subscription',
}
