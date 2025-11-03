/**
 * Pricing Configuration for InTransparency
 *
 * Multi-tier subscription model:
 * - Students: Free (3 projects) / Pro €12/mo / Elite €29/mo
 * - Companies: Browse Free / Starter €149/mo / Growth €399/mo / Enterprise €999/mo
 * - Universities: Free / Professional €499/mo / Enterprise €1,499/mo
 */

import { SubscriptionTier } from '@prisma/client'

// Stripe Price IDs (Replace with actual Stripe price IDs after creating products)
export const STRIPE_PRICE_IDS = {
  // Student Plans
  STUDENT_PRO_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_STUDENT_PRO_MONTHLY || 'price_student_pro_monthly',
  STUDENT_PRO_ANNUAL: process.env.NEXT_PUBLIC_STRIPE_STUDENT_PRO_ANNUAL || 'price_student_pro_annual',
  STUDENT_ELITE_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_STUDENT_ELITE_MONTHLY || 'price_student_elite_monthly',
  STUDENT_ELITE_ANNUAL: process.env.NEXT_PUBLIC_STRIPE_STUDENT_ELITE_ANNUAL || 'price_student_elite_annual',

  // Company Plans
  RECRUITER_STARTER_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_RECRUITER_STARTER_MONTHLY || 'price_recruiter_starter_monthly',
  RECRUITER_STARTER_ANNUAL: process.env.NEXT_PUBLIC_STRIPE_RECRUITER_STARTER_ANNUAL || 'price_recruiter_starter_annual',
  RECRUITER_GROWTH_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_RECRUITER_GROWTH_MONTHLY || 'price_recruiter_growth_monthly',
  RECRUITER_GROWTH_ANNUAL: process.env.NEXT_PUBLIC_STRIPE_RECRUITER_GROWTH_ANNUAL || 'price_recruiter_growth_annual',
  RECRUITER_PRO_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_RECRUITER_PRO_MONTHLY || 'price_recruiter_pro_monthly',
  RECRUITER_PRO_ANNUAL: process.env.NEXT_PUBLIC_STRIPE_RECRUITER_PRO_ANNUAL || 'price_recruiter_pro_annual',
} as const

// Pricing tiers with features
export interface PricingTier {
  id: SubscriptionTier
  name: string
  description: string
  price: {
    monthly: number  // in euros
    annual: number   // in euros (or null if not available)
  }
  stripePriceIds: {
    monthly: string
    annual?: string
  }
  features: string[]
  limits: {
    projects?: number
    contacts?: number
    aiSearches?: number
    cvDownloads?: number
    teamMembers?: number
    customBranding?: boolean
    prioritySupport?: boolean
  }
  popular?: boolean
  cta: string
}

// Student Pricing Tiers
export const STUDENT_PRICING: PricingTier[] = [
  {
    id: 'FREE' as SubscriptionTier,
    name: 'Free',
    description: 'Get started with basic profile',
    price: {
      monthly: 0,
      annual: 0
    },
    stripePriceIds: {
      monthly: '',
      annual: ''
    },
    features: [
      'Up to 3 projects',
      'Basic profile page',
      'Manual project upload',
      'Public profile link',
      'Community support'
    ],
    limits: {
      projects: 3,
      aiSearches: 0
    },
    cta: 'Get Started Free'
  },
  {
    id: 'STUDENT_PRO' as SubscriptionTier,
    name: 'Pro',
    description: 'Stand out with unlimited projects',
    price: {
      monthly: 12,
      annual: 120  // 2 months free
    },
    stripePriceIds: {
      monthly: STRIPE_PRICE_IDS.STUDENT_PRO_MONTHLY,
      annual: STRIPE_PRICE_IDS.STUDENT_PRO_ANNUAL
    },
    features: [
      'Unlimited projects',
      'GitHub/GitLab auto-sync',
      'Custom portfolio subdomain',
      'AI project descriptions',
      'Analytics dashboard',
      'Priority in search results',
      'Remove InTransparency branding'
    ],
    limits: {
      projects: -1,  // unlimited
      customBranding: true
    },
    popular: true,
    cta: 'Upgrade to Pro'
  },
  {
    id: 'STUDENT_ELITE' as SubscriptionTier,
    name: 'Elite',
    description: 'Premium features for top talent',
    price: {
      monthly: 29,
      annual: 290  // 2 months free
    },
    stripePriceIds: {
      monthly: STRIPE_PRICE_IDS.STUDENT_ELITE_MONTHLY,
      annual: STRIPE_PRICE_IDS.STUDENT_ELITE_ANNUAL
    },
    features: [
      'Everything in Pro, plus:',
      'Featured profile badge',
      'Direct company messages',
      'Career coaching session (1x/month)',
      'Resume review by AI',
      'Interview prep resources',
      'Exclusive job opportunities',
      'Priority support'
    ],
    limits: {
      projects: -1,
      customBranding: true,
      prioritySupport: true
    },
    cta: 'Go Elite'
  }
]

// Company/Recruiter Pricing Tiers
export const RECRUITER_PRICING: PricingTier[] = [
  {
    id: 'RECRUITER_FREE' as SubscriptionTier,
    name: 'Browse Free',
    description: 'Explore talent pool at no cost',
    price: {
      monthly: 0,
      annual: 0
    },
    stripePriceIds: {
      monthly: '',
      annual: ''
    },
    features: [
      'Browse student profiles',
      'Basic search filters',
      'View up to 10 profiles/month',
      'Save favorite candidates'
    ],
    limits: {
      contacts: 0,
      aiSearches: 0,
      cvDownloads: 10
    },
    cta: 'Start Browsing'
  },
  {
    id: 'RECRUITER_STARTER' as SubscriptionTier,
    name: 'Starter',
    description: 'Perfect for small teams',
    price: {
      monthly: 149,
      annual: 1490  // 2 months free
    },
    stripePriceIds: {
      monthly: STRIPE_PRICE_IDS.RECRUITER_STARTER_MONTHLY,
      annual: STRIPE_PRICE_IDS.RECRUITER_STARTER_ANNUAL
    },
    features: [
      'Contact up to 50 candidates/month',
      'Advanced search filters',
      'Course-level filtering',
      'AI match explanations',
      'Download CVs & portfolios',
      'Email support'
    ],
    limits: {
      contacts: 50,
      aiSearches: 100,
      cvDownloads: 50,
      teamMembers: 2
    },
    cta: 'Start Free Trial'
  },
  {
    id: 'RECRUITER_GROWTH' as SubscriptionTier,
    name: 'Growth',
    description: 'Scale your recruiting',
    price: {
      monthly: 399,
      annual: 3990  // 2 months free
    },
    stripePriceIds: {
      monthly: STRIPE_PRICE_IDS.RECRUITER_GROWTH_MONTHLY,
      annual: STRIPE_PRICE_IDS.RECRUITER_GROWTH_ANNUAL
    },
    features: [
      'Contact up to 200 candidates/month',
      'Everything in Starter, plus:',
      'Market intelligence dashboard',
      'Bulk messaging',
      'ATS integration',
      'Team collaboration tools',
      'Priority support'
    ],
    limits: {
      contacts: 200,
      aiSearches: 500,
      cvDownloads: 200,
      teamMembers: 5,
      prioritySupport: true
    },
    popular: true,
    cta: 'Start Free Trial'
  },
  {
    id: 'RECRUITER_PRO' as SubscriptionTier,
    name: 'Enterprise',
    description: 'Unlimited hiring at scale',
    price: {
      monthly: 999,
      annual: 9990  // 2 months free
    },
    stripePriceIds: {
      monthly: STRIPE_PRICE_IDS.RECRUITER_PRO_MONTHLY,
      annual: STRIPE_PRICE_IDS.RECRUITER_PRO_ANNUAL
    },
    features: [
      'Unlimited candidate contacts',
      'Everything in Growth, plus:',
      'Dedicated account manager',
      'Custom integrations',
      'White-label option',
      'Unlimited team members',
      'API access',
      '24/7 priority support',
      'Custom contract terms'
    ],
    limits: {
      contacts: -1,  // unlimited
      aiSearches: -1,
      cvDownloads: -1,
      teamMembers: -1,
      customBranding: true,
      prioritySupport: true
    },
    cta: 'Contact Sales'
  }
]

// Helper function to get pricing tier by ID
export function getPricingTier(tierId: SubscriptionTier): PricingTier | undefined {
  return [...STUDENT_PRICING, ...RECRUITER_PRICING].find(tier => tier.id === tierId)
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

// Annual discount percentage
export const ANNUAL_DISCOUNT_PERCENT = 17  // ~2 months free

// Free trial period (days)
export const FREE_TRIAL_DAYS = 14

// Stripe configuration
export const STRIPE_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  successUrl: process.env.NEXT_PUBLIC_URL + '/dashboard/subscription/success',
  cancelUrl: process.env.NEXT_PUBLIC_URL + '/pricing',
  customerPortalUrl: process.env.NEXT_PUBLIC_URL + '/dashboard/subscription'
}
