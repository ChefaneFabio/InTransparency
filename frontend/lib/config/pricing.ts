/**
 * Pricing Configuration for InTransparency
 *
 * Simplified pricing model:
 * - Students: Free / Premium €9/mo
 * - Companies: Browse Free / Pay Per Contact €10/contact / Enterprise €99/mo
 * - Institutions: Free / Enterprise €2,000/yr
 */

import { SubscriptionTier } from '@prisma/client'

// Stripe Price IDs (Replace with actual Stripe price IDs after creating products)
export const STRIPE_PRICE_IDS = {
  // Student Plans
  STUDENT_PREMIUM_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_STUDENT_PREMIUM_MONTHLY || 'price_student_premium_monthly',

  // Company Plans
  RECRUITER_ENTERPRISE_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_RECRUITER_ENTERPRISE_MONTHLY || 'price_recruiter_enterprise_monthly',

  // Institution Plans
  INSTITUTION_ENTERPRISE_ANNUAL: process.env.NEXT_PUBLIC_STRIPE_INSTITUTION_ENTERPRISE_ANNUAL || 'price_institution_enterprise_annual',

  // Contact Credits (one-time payment)
  CONTACT_CREDITS: process.env.NEXT_PUBLIC_STRIPE_CONTACT_CREDITS || 'price_contact_credits',
} as const

// Pricing tiers with features
export interface PricingTier {
  id: SubscriptionTier
  name: string
  description: string
  pricingModel: 'free' | 'subscription' | 'pay_per_contact' | 'annual_subscription'
  price: {
    monthly: number  // in euros (0 for free / pay-per-contact)
    annual: number
    perContact?: number  // in euros, for pay-per-contact
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
    description: 'Get started with your portfolio',
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

// Company/Recruiter Pricing Tiers
export const RECRUITER_PRICING: PricingTier[] = [
  {
    id: 'RECRUITER_FREE' as SubscriptionTier,
    name: 'Browse Free',
    description: 'Explore the talent pool',
    pricingModel: 'free',
    price: {
      monthly: 0,
      annual: 0,
    },
    stripePriceIds: {},
    features: [
      'Unlimited browsing',
      'Advanced search',
      'Save candidates',
    ],
    limits: {
      contacts: 0,
    },
    cta: 'Start Browsing',
  },
  {
    id: 'RECRUITER_PAY_PER_CONTACT' as SubscriptionTier,
    name: 'Pay Per Contact',
    description: 'Only pay when you reach out',
    pricingModel: 'pay_per_contact',
    price: {
      monthly: 0,
      annual: 0,
      perContact: 10,
    },
    stripePriceIds: {
      perContact: STRIPE_PRICE_IDS.CONTACT_CREDITS,
    },
    features: [
      'Everything in Browse Free, plus:',
      'Full contact unlock (credit balance)',
    ],
    limits: {
      contacts: -1, // unlimited, but deducted from balance
      contactBalance: true,
    },
    popular: true,
    cta: 'Buy Credits',
  },
  {
    id: 'RECRUITER_ENTERPRISE' as SubscriptionTier,
    name: 'Enterprise',
    description: 'Unlimited hiring at scale',
    pricingModel: 'subscription',
    price: {
      monthly: 99,
      annual: 990,
    },
    stripePriceIds: {
      monthly: STRIPE_PRICE_IDS.RECRUITER_ENTERPRISE_MONTHLY,
    },
    features: [
      'Everything in Pay Per Contact, plus:',
      'Unlimited contact unlocks',
      'API access',
      'ATS integration',
      'Dedicated support',
    ],
    limits: {
      contacts: -1,
      apiAccess: true,
      atsIntegration: true,
      prioritySupport: true,
    },
    cta: 'Go Enterprise',
  },
]

// Institution Pricing Tiers
export const INSTITUTION_PRICING: PricingTier[] = [
  {
    id: 'FREE' as SubscriptionTier,
    name: 'Free',
    description: 'Essential tools for your institution',
    pricingModel: 'free',
    price: {
      monthly: 0,
      annual: 0,
    },
    stripePriceIds: {},
    features: [
      'Verify projects',
      'Batch approval',
      'Placement analytics',
    ],
    limits: {},
    cta: 'Get Started Free',
  },
  {
    id: 'INSTITUTION_ENTERPRISE' as SubscriptionTier,
    name: 'Enterprise',
    description: 'Full platform for your institution',
    pricingModel: 'annual_subscription',
    price: {
      monthly: 0,
      annual: 2000,
    },
    stripePriceIds: {
      annual: STRIPE_PRICE_IDS.INSTITUTION_ENTERPRISE_ANNUAL,
    },
    features: [
      'Everything in Free, plus:',
      'API integration',
      'White-label',
      'Multi-campus support',
    ],
    limits: {
      apiAccess: true,
      whiteLabel: true,
      multiCampus: true,
    },
    cta: 'Contact Sales',
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
  const tier = getPricingTier(userTier)
  if (!tier) return false

  const limit = tier.limits[feature]
  if (limit === undefined) return false
  if (limit === true) return true
  if (limit === false) return false
  if (limit === -1) return true  // unlimited

  return false
}

// Helper function to check if user has reached limit
export function hasReachedLimit(
  userTier: SubscriptionTier,
  feature: keyof PricingTier['limits'],
  currentUsage: number
): boolean {
  const tier = getPricingTier(userTier)
  if (!tier) return true

  const limit = tier.limits[feature]
  if (limit === undefined) return true
  if (typeof limit === 'boolean') return !limit
  if (limit === -1) return false  // unlimited

  return currentUsage >= limit
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
