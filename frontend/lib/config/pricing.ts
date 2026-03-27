/**
 * Pricing Configuration for InTransparency
 *
 * Phase 1 — Growth / Land Grab:
 * Everyone gets full access for free. No paywalls.
 * Stripe infrastructure is preserved for Phase 2 monetization.
 *
 * - Students: Free (with optional Premium €9/mo)
 * - Companies: Free — unlimited access during launch
 * - Institutions: Free — unlimited access during launch
 */

import { SubscriptionTier } from '@prisma/client'

// Stripe Price IDs (kept for Phase 2 — not used during free launch)
export const STRIPE_PRICE_IDS = {
  // Student Plans
  STUDENT_PREMIUM_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_STUDENT_PREMIUM_MONTHLY || 'price_student_premium_monthly',

  // Company Plans (Phase 2)
  RECRUITER_PRO_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_RECRUITER_PRO_MONTHLY || 'price_recruiter_pro_monthly',
  RECRUITER_ENTERPRISE_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_RECRUITER_ENTERPRISE_MONTHLY || 'price_recruiter_enterprise_monthly',

  // Institution Plans (Phase 2)
  INSTITUTION_ENTERPRISE_ANNUAL: process.env.NEXT_PUBLIC_STRIPE_INSTITUTION_ENTERPRISE_ANNUAL || 'price_institution_enterprise_annual',

  // Legacy — kept for backward compatibility
  CONTACT_CREDITS: process.env.NEXT_PUBLIC_STRIPE_CONTACT_CREDITS || 'price_contact_credits',
  POSITION_LISTING_STANDARD: process.env.NEXT_PUBLIC_STRIPE_POSITION_LISTING || 'price_position_listing',
} as const

// Pricing tiers with features
export interface PricingTier {
  id: SubscriptionTier
  name: string
  description: string
  pricingModel: 'free' | 'subscription' | 'pay_per_contact' | 'pay_per_position' | 'annual_subscription'
  price: {
    monthly: number  // in euros (0 for free / pay-per-contact)
    annual: number
    perContact?: number  // in euros, for pay-per-contact
    perPosition?: number // in euros, for pay-per-position
  }
  stripePriceIds: {
    monthly?: string
    annual?: string
    perContact?: string
  }
  features: string[]
  limits: {
    projects?: number
    contacts?: number
    contactBalance?: boolean  // true for pay-per-contact tier
    customBranding?: boolean
    prioritySupport?: boolean
    apiAccess?: boolean
    atsIntegration?: boolean
    whiteLabel?: boolean
    multiCampus?: boolean
  }
  popular?: boolean
  cta: string
}

// Student Pricing Tiers
export const STUDENT_PRICING: PricingTier[] = [
  {
    id: 'FREE' as SubscriptionTier,
    name: 'Free',
    description: 'Build your verified portfolio and get discovered',
    pricingModel: 'free',
    price: {
      monthly: 0,
      annual: 0,
    },
    stripePriceIds: {},
    features: [
      'Unlimited projects',
      'University verification',
      'Public portfolio',
      'Profile analytics',
    ],
    limits: {
      projects: -1, // unlimited
    },
    cta: 'Get Started Free',
  },
  {
    id: 'STUDENT_PREMIUM' as SubscriptionTier,
    name: 'Premium',
    description: 'Stand out to recruiters',
    pricingModel: 'subscription',
    price: {
      monthly: 9,
      annual: 90,
    },
    stripePriceIds: {
      monthly: STRIPE_PRICE_IDS.STUDENT_PREMIUM_MONTHLY,
    },
    features: [
      'Everything in Free, plus:',
      'Priority in search results',
      'Custom portfolio URL',
      'Contact recruiters directly',
      'Advanced analytics',
    ],
    limits: {
      projects: -1,
      customBranding: true,
      prioritySupport: true,
    },
    popular: true,
    cta: 'Upgrade to Premium',
  },
]

// Company/Recruiter Pricing Tiers — Phase 1: Everything free
export const RECRUITER_PRICING: PricingTier[] = [
  {
    id: 'RECRUITER_FREE' as SubscriptionTier,
    name: 'Full Access',
    description: 'Everything you need to find verified talent — free during launch',
    pricingModel: 'free',
    price: {
      monthly: 0,
      annual: 0,
    },
    stripePriceIds: {},
    features: [
      'Unlimited portfolio browsing',
      'Advanced search & filters',
      'Unlimited candidate contacts',
      'AI-powered talent matching',
      'Save and compare candidates',
      'Post job listings',
      'Full project and skill data',
    ],
    limits: {
      contacts: -1, // unlimited during Phase 1
      apiAccess: false,
      atsIntegration: false,
    },
    popular: true,
    cta: 'Start Hiring',
  },
]

// Institution Pricing Tiers — Phase 1: Everything free
export const INSTITUTION_PRICING: PricingTier[] = [
  {
    id: 'FREE' as SubscriptionTier,
    name: 'Full Access',
    description: 'Everything you need to support your students — free during launch',
    pricingModel: 'free',
    price: {
      monthly: 0,
      annual: 0,
    },
    stripePriceIds: {},
    features: [
      'Verify student projects',
      'Batch approval dashboard',
      'Placement analytics',
      'Company visibility tracking',
      'Alumni management',
    ],
    limits: {},
    cta: 'Get Started',
  },
]

// Helper function to get pricing tier by ID
export function getPricingTier(tierId: SubscriptionTier): PricingTier | undefined {
  return [
    ...STUDENT_PRICING,
    ...RECRUITER_PRICING,
    ...INSTITUTION_PRICING,
  ].find(tier => tier.id === tierId)
}

// Helper function to check if user has access to a feature
export function hasFeature(
  userTier: SubscriptionTier,
  feature: keyof PricingTier['limits']
): boolean {
  // Phase 1: grant access to everything
  return true
}

// Helper function to check if user has reached limit
export function hasReachedLimit(
  userTier: SubscriptionTier,
  feature: keyof PricingTier['limits'],
  currentUsage: number
): boolean {
  // Phase 1: no limits
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
