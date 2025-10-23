// Client-side analytics utility

export type AnalyticsEventType =
  | 'PAGE_VIEW'
  | 'PROFILE_VIEW'
  | 'PROJECT_VIEW'
  | 'SHARE_EVENT'
  | 'REFERRAL_CLICK'
  | 'REFERRAL_SIGNUP'
  | 'SUBSCRIPTION_STARTED'
  | 'SUBSCRIPTION_CANCELED'
  | 'MESSAGE_SENT'
  | 'JOB_APPLICATION'
  | 'SEARCH_PERFORMED'
  | 'BUTTON_CLICK'
  | 'FAKE_DOOR_CLICK'
  | 'WAITLIST_SIGNUP'
  | 'INTERVIEW_SIGNUP'
  | 'PRICING_SURVEY'
  | 'CUSTOM'

interface AnalyticsEvent {
  eventType: AnalyticsEventType
  eventName: string
  properties?: Record<string, any>
  pageUrl?: string
  pagePath?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
}

// Track analytics event
export async function trackEvent(event: AnalyticsEvent) {
  try {
    // Get UTM parameters from URL
    const urlParams = new URLSearchParams(window.location.search)
    const utmParams = {
      utmSource: urlParams.get('utm_source') || undefined,
      utmMedium: urlParams.get('utm_medium') || undefined,
      utmCampaign: urlParams.get('utm_campaign') || undefined,
      utmTerm: urlParams.get('utm_term') || undefined,
      utmContent: urlParams.get('utm_content') || undefined
    }

    // Get session ID from localStorage
    let sessionId = localStorage.getItem('sessionId')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('sessionId', sessionId)
    }

    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId
      },
      body: JSON.stringify({
        ...event,
        pageUrl: window.location.href,
        pagePath: window.location.pathname,
        ...utmParams
      })
    })
  } catch (error) {
    console.error('Error tracking event:', error)
  }
}

// Track page view
export function trackPageView() {
  trackEvent({
    eventType: 'PAGE_VIEW',
    eventName: 'page_view'
  })
}

// Track share event
export async function trackShare(
  shareType: 'profile' | 'project' | 'referral',
  platform: 'linkedin' | 'twitter' | 'facebook' | 'email' | 'copy',
  contentId?: string
) {
  try {
    let sessionId = localStorage.getItem('sessionId')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('sessionId', sessionId)
    }

    await fetch('/api/analytics/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId
      },
      body: JSON.stringify({
        shareType,
        platform,
        contentType: shareType,
        contentId
      })
    })
  } catch (error) {
    console.error('Error tracking share:', error)
  }
}

// Track referral click
export function trackReferralClick(referralCode: string) {
  trackEvent({
    eventType: 'REFERRAL_CLICK',
    eventName: 'referral_click',
    properties: {
      referralCode
    }
  })
}

// Track button click
export function trackButtonClick(buttonName: string, properties?: Record<string, any>) {
  trackEvent({
    eventType: 'BUTTON_CLICK',
    eventName: `button_click_${buttonName}`,
    properties
  })
}

// Track search
export function trackSearch(query: string, filters?: Record<string, any>) {
  trackEvent({
    eventType: 'SEARCH_PERFORMED',
    eventName: 'search_performed',
    properties: {
      query,
      filters
    }
  })
}

// Track project view
export function trackProjectView(projectId: string, projectTitle: string) {
  trackEvent({
    eventType: 'PROJECT_VIEW',
    eventName: 'project_view',
    properties: {
      projectId,
      projectTitle
    }
  })
}

// Track message sent
export function trackMessageSent(recipientId: string, messageType: 'direct' | 'application') {
  trackEvent({
    eventType: 'MESSAGE_SENT',
    eventName: 'message_sent',
    properties: {
      recipientId,
      messageType
    }
  })
}

// ==========================================
// VALIDATION EXPERIMENT TRACKING
// ==========================================

/**
 * Track fake door click (user clicked on feature that doesn't exist yet)
 */
export function trackFakeDoorClick(page: string, price: number, variant?: 'A' | 'B' | 'C' | 'D') {
  // Store in localStorage for validation analysis
  const clicks = JSON.parse(localStorage.getItem('fake_door_clicks') || '[]')
  clicks.push({
    timestamp: new Date().toISOString(),
    page,
    price,
    variant
  })
  localStorage.setItem('fake_door_clicks', JSON.stringify(clicks))

  // Also track via standard analytics
  trackEvent({
    eventType: 'FAKE_DOOR_CLICK',
    eventName: 'fake_door_click',
    properties: {
      page,
      price,
      variant
    }
  })
}

/**
 * Track waitlist signup
 */
export function trackWaitlistSignup(email: string, source: string, price: number, variant?: 'A' | 'B' | 'C' | 'D') {
  const signups = JSON.parse(localStorage.getItem('waitlist_signups') || '[]')
  signups.push({
    timestamp: new Date().toISOString(),
    email,
    source,
    price,
    variant
  })
  localStorage.setItem('waitlist_signups', JSON.stringify(signups))

  trackEvent({
    eventType: 'WAITLIST_SIGNUP',
    eventName: 'waitlist_signup',
    properties: {
      source,
      price,
      variant
    }
  })
}

/**
 * Track interview participant signup
 */
export function trackInterviewSignup(email: string, participantType: 'student' | 'recruiter') {
  const signups = JSON.parse(localStorage.getItem('interview_signups') || '[]')
  signups.push({
    timestamp: new Date().toISOString(),
    email,
    participantType
  })
  localStorage.setItem('interview_signups', JSON.stringify(signups))

  trackEvent({
    eventType: 'INTERVIEW_SIGNUP',
    eventName: 'interview_signup',
    properties: {
      participantType
    }
  })
}

/**
 * Track pricing survey completion
 */
export function trackPricingSurveyComplete(data: {
  email: string
  tooExpensive: number
  expensive: number
  bargain: number
  tooCheap: number
  willingToPay: string
  paymentPreference: string
}) {
  const surveys = JSON.parse(localStorage.getItem('pricing_surveys') || '[]')
  surveys.push({
    timestamp: new Date().toISOString(),
    ...data
  })
  localStorage.setItem('pricing_surveys', JSON.stringify(surveys))

  trackEvent({
    eventType: 'PRICING_SURVEY',
    eventName: 'pricing_survey_complete',
    properties: data
  })
}

/**
 * Get validation analytics summary
 */
export function getValidationAnalytics() {
  const clicks = JSON.parse(localStorage.getItem('fake_door_clicks') || '[]')
  const signups = JSON.parse(localStorage.getItem('waitlist_signups') || '[]')
  const interviews = JSON.parse(localStorage.getItem('interview_signups') || '[]')
  const surveys = JSON.parse(localStorage.getItem('pricing_surveys') || '[]')

  const conversionRate = clicks.length > 0 ? (signups.length / clicks.length) * 100 : 0

  return {
    fakeDoorClicks: clicks.length,
    waitlistSignups: signups.length,
    interviewSignups: interviews.length,
    pricingSurveys: surveys.length,
    conversionRate: conversionRate.toFixed(2) + '%',
    clicks,
    signups,
    interviews,
    surveys
  }
}

/**
 * Assign A/B test variant
 */
export function getABTestVariant(): 'A' | 'B' | 'C' | 'D' {
  if (typeof window === 'undefined') return 'A'

  let variant = localStorage.getItem('ab_test_variant') as 'A' | 'B' | 'C' | 'D' | null

  if (!variant) {
    const random = Math.random()
    if (random < 0.25) variant = 'A'
    else if (random < 0.5) variant = 'B'
    else if (random < 0.75) variant = 'C'
    else variant = 'D'

    localStorage.setItem('ab_test_variant', variant)
  }

  return variant
}

/**
 * Get pricing config for A/B test variant
 */
export function getVariantPricing(variant: 'A' | 'B' | 'C' | 'D') {
  const configs = {
    A: { price: 99, model: 'one-time', label: '€99 One-Time' },
    B: { price: 49, model: 'one-time', label: '€49 One-Time' },
    C: { price: 9, model: 'subscription', label: '€9/month' },
    D: { price: 149, model: 'one-time', label: '€149 One-Time' }
  }
  return configs[variant]
}
