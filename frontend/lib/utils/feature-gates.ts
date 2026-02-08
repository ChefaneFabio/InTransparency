/**
 * Feature Gates & Subscription Limit Checks
 *
 * Centralized logic for checking if users have access to features based on their subscription tier.
 */

import { SubscriptionTier } from '@prisma/client'
import { getPricingTier, hasFeature } from '@/lib/config/pricing'

export interface FeatureGateResult {
  allowed: boolean
  reason?: string
  upgradeUrl?: string
  currentUsage?: number
  limit?: number
  balance?: number
}

/**
 * Check if user can add more projects
 * Both student tiers have unlimited projects.
 */
export function canAddProject(
  userTier: SubscriptionTier,
  currentProjectCount: number
): FeatureGateResult {
  // All tiers have unlimited projects
  return { allowed: true }
}

/**
 * Check if recruiter can contact a candidate.
 * - RECRUITER_FREE: blocked
 * - RECRUITER_PAY_PER_CONTACT: requires contactBalance >= 1000
 * - RECRUITER_ENTERPRISE: unlimited
 */
export function canContact(
  userTier: SubscriptionTier,
  contactBalance: number = 0
): FeatureGateResult {
  switch (userTier) {
    case 'RECRUITER_ENTERPRISE':
      return { allowed: true }

    case 'RECRUITER_PAY_PER_CONTACT':
      if (contactBalance >= 1000) {
        return {
          allowed: true,
          balance: contactBalance,
        }
      }
      return {
        allowed: false,
        reason: 'Insufficient credits. Purchase more contact credits to continue.',
        upgradeUrl: '/pricing?for=recruiters',
        balance: contactBalance,
      }

    case 'RECRUITER_FREE':
    default:
      return {
        allowed: false,
        reason: 'Upgrade to contact candidates directly',
        upgradeUrl: '/pricing?for=recruiters',
      }
  }
}

/**
 * Check if user has priority support
 */
export function hasPrioritySupport(userTier: SubscriptionTier): boolean {
  return hasFeature(userTier, 'prioritySupport')
}

/**
 * Check if user can use custom branding
 */
export function canUseCustomBranding(userTier: SubscriptionTier): boolean {
  return hasFeature(userTier, 'customBranding')
}

/**
 * Get feature gate message for UI display
 */
export function getFeatureGateMessage(result: FeatureGateResult): string {
  if (result.allowed) {
    if (result.balance !== undefined) {
      const credits = Math.floor(result.balance / 1000)
      return `${credits} contact credit${credits !== 1 ? 's' : ''} remaining`
    }
    return 'Unlimited'
  }

  return result.reason || 'This feature is not available on your current plan'
}

/**
 * Check if subscription is active
 */
export function isSubscriptionActive(
  status: string | null | undefined,
  premiumUntil: Date | null | undefined
): boolean {
  if (!status) return false

  // Check if status is active or trialing
  if (status === 'ACTIVE' || status === 'TRIALING') {
    // Also check if premium hasn't expired
    if (premiumUntil) {
      return new Date(premiumUntil) > new Date()
    }
    return true
  }

  return false
}

/**
 * Get upgrade message based on user's current tier
 */
export function getUpgradeMessage(userTier: SubscriptionTier): string {
  switch (userTier) {
    case 'FREE':
      return 'Upgrade to Premium for priority in search and custom portfolio URL'
    case 'STUDENT_PREMIUM':
      return 'You\'re on the best student plan! Enjoy all premium features.'
    case 'RECRUITER_FREE':
      return 'Get Pay Per Contact credits or subscribe to Enterprise to reach candidates'
    case 'RECRUITER_PAY_PER_CONTACT':
      return 'Upgrade to Enterprise for unlimited contacts, API access, and ATS integration'
    case 'RECRUITER_ENTERPRISE':
      return 'You\'re on the best plan! Enjoy all enterprise features.'
    case 'INSTITUTION_ENTERPRISE':
      return 'You\'re on the best plan! Enjoy all enterprise features.'
    default:
      return 'Upgrade your plan for more features'
  }
}
