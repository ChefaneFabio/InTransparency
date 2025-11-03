/**
 * Feature Gates & Subscription Limit Checks
 *
 * Centralized logic for checking if users have access to features based on their subscription tier.
 */

import { SubscriptionTier } from '@prisma/client'
import { getPricingTier, hasFeature, hasReachedLimit } from '@/lib/config/pricing'

export interface FeatureGateResult {
  allowed: boolean
  reason?: string
  upgradeUrl?: string
  currentUsage?: number
  limit?: number
}

/**
 * Check if user can add more projects
 */
export function canAddProject(
  userTier: SubscriptionTier,
  currentProjectCount: number
): FeatureGateResult {
  const tier = getPricingTier(userTier)

  if (!tier) {
    return {
      allowed: false,
      reason: 'Invalid subscription tier'
    }
  }

  const projectLimit = tier.limits.projects

  // Unlimited projects
  if (projectLimit === -1) {
    return { allowed: true }
  }

  // No projects allowed (shouldn't happen, but handle it)
  if (projectLimit === 0) {
    return {
      allowed: false,
      reason: 'Your current plan does not include project uploads',
      upgradeUrl: '/dashboard/student/upgrade'
    }
  }

  // Check if limit reached
  if (currentProjectCount >= (projectLimit || 0)) {
    return {
      allowed: false,
      reason: `You've reached your project limit (${projectLimit} projects). Upgrade to add unlimited projects.`,
      upgradeUrl: '/dashboard/student/upgrade',
      currentUsage: currentProjectCount,
      limit: projectLimit
    }
  }

  return {
    allowed: true,
    currentUsage: currentProjectCount,
    limit: projectLimit
  }
}

/**
 * Check if user can contact a candidate/company
 */
export function canContact(
  userTier: SubscriptionTier,
  currentContactCount: number
): FeatureGateResult {
  const tier = getPricingTier(userTier)

  if (!tier) {
    return {
      allowed: false,
      reason: 'Invalid subscription tier'
    }
  }

  const contactLimit = tier.limits.contacts

  // Unlimited contacts
  if (contactLimit === -1) {
    return { allowed: true }
  }

  // No contacts allowed (free tier)
  if (contactLimit === 0) {
    return {
      allowed: false,
      reason: 'Upgrade to contact candidates directly',
      upgradeUrl: '/dashboard/student/upgrade'
    }
  }

  // Check if limit reached
  if (currentContactCount >= (contactLimit || 0)) {
    return {
      allowed: false,
      reason: `You've reached your monthly contact limit (${contactLimit} contacts)`,
      upgradeUrl: '/dashboard/student/upgrade',
      currentUsage: currentContactCount,
      limit: contactLimit
    }
  }

  return {
    allowed: true,
    currentUsage: currentContactCount,
    limit: contactLimit
  }
}

/**
 * Check if user can use AI search
 */
export function canUseAISearch(
  userTier: SubscriptionTier,
  currentAISearchCount: number
): FeatureGateResult {
  const tier = getPricingTier(userTier)

  if (!tier) {
    return {
      allowed: false,
      reason: 'Invalid subscription tier'
    }
  }

  const aiSearchLimit = tier.limits.aiSearches

  // Unlimited AI searches
  if (aiSearchLimit === -1) {
    return { allowed: true }
  }

  // No AI searches allowed
  if (aiSearchLimit === 0) {
    return {
      allowed: false,
      reason: 'AI-powered search is a premium feature. Upgrade to unlock it.',
      upgradeUrl: '/dashboard/student/upgrade'
    }
  }

  // Check if limit reached
  if (currentAISearchCount >= (aiSearchLimit || 0)) {
    return {
      allowed: false,
      reason: `You've used all your AI searches this month (${aiSearchLimit} searches)`,
      upgradeUrl: '/dashboard/student/upgrade',
      currentUsage: currentAISearchCount,
      limit: aiSearchLimit
    }
  }

  return {
    allowed: true,
    currentUsage: currentAISearchCount,
    limit: aiSearchLimit
  }
}

/**
 * Check if user can download CVs
 */
export function canDownloadCV(
  userTier: SubscriptionTier,
  currentDownloadCount: number
): FeatureGateResult {
  const tier = getPricingTier(userTier)

  if (!tier) {
    return {
      allowed: false,
      reason: 'Invalid subscription tier'
    }
  }

  const downloadLimit = tier.limits.cvDownloads

  // Unlimited downloads
  if (downloadLimit === -1) {
    return { allowed: true }
  }

  // No downloads allowed
  if (downloadLimit === 0) {
    return {
      allowed: false,
      reason: 'CV downloads require a paid plan',
      upgradeUrl: '/dashboard/student/upgrade'
    }
  }

  // Check if limit reached
  if (currentDownloadCount >= (downloadLimit || 0)) {
    return {
      allowed: false,
      reason: `You've reached your monthly download limit (${downloadLimit} downloads)`,
      upgradeUrl: '/dashboard/student/upgrade',
      currentUsage: currentDownloadCount,
      limit: downloadLimit
    }
  }

  return {
    allowed: true,
    currentUsage: currentDownloadCount,
    limit: downloadLimit
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
    if (result.limit && result.limit !== -1) {
      const remaining = result.limit - (result.currentUsage || 0)
      return `${remaining} of ${result.limit} remaining`
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
      return 'Upgrade to Pro for unlimited projects and priority matching'
    case 'STUDENT_PRO':
      return 'Upgrade to Elite for exclusive features and career coaching'
    case 'STUDENT_ELITE':
      return 'You\'re on the best plan! Enjoy all premium features.'
    case 'RECRUITER_FREE':
      return 'Upgrade to Starter to contact candidates and use advanced filters'
    case 'RECRUITER_STARTER':
      return 'Upgrade to Growth for market intelligence and bulk messaging'
    case 'RECRUITER_GROWTH':
      return 'Upgrade to Enterprise for unlimited contacts and dedicated support'
    default:
      return 'Upgrade your plan for more features'
  }
}
