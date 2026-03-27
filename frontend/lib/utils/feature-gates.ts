/**
 * Feature Gates & Subscription Limit Checks
 *
 * Phase 1 (Launch): All features unlocked for everyone.
 * Stripe infrastructure and tier logic preserved for Phase 2.
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
 */
export function canAddProject(
  userTier: SubscriptionTier,
  currentProjectCount: number
): FeatureGateResult {
  return { allowed: true }
}

/**
 * Check if recruiter can contact a candidate.
 * Phase 1: Always allowed — no limits.
 */
export function canContact(
  userTier: SubscriptionTier,
  contactBalance: number = 0
): FeatureGateResult {
  return { allowed: true }
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
    return 'Unlimited'
  }
  return result.reason || 'This feature is not available on your current plan'
}

/**
 * Check if subscription is active
 * Phase 1: Always active for all users.
 */
export function isSubscriptionActive(
  status: string | null | undefined,
  premiumUntil: Date | null | undefined
): boolean {
  return true
}

/**
 * Get upgrade message based on user's current tier
 * Phase 1: Everyone has full access.
 */
export function getUpgradeMessage(userTier: SubscriptionTier): string {
  return 'You have full access to all features — free during launch.'
}
