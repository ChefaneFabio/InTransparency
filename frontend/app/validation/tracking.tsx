'use client'

import { useEffect } from 'react'

// Validation Tracking Implementation
export const ValidationTracking = {
  // 1. Landing Page Email Collection
  trackEmailSignup: (data: {
    email: string
    userType: 'company' | 'graduate' | 'university'
    source: string
  }) => {
    // Send to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'signup', {
        event_category: 'validation',
        event_label: data.userType,
        value: data.source
      })
    }

    // Store in database
    fetch('/api/validation/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  },

  // 2. A/B Test Tracking
  trackABTest: (variant: string, action: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ab_test', {
        event_category: 'validation',
        variant,
        action
      })
    }
  },

  // 3. Pre-Sales Tracking
  trackPreOrder: (plan: string, amount: number) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        currency: 'EUR',
        value: amount,
        items: [{
          item_id: plan,
          item_name: `InTransparency ${plan} Plan`,
          price: amount,
          quantity: 1
        }]
      })
    }
  },

  // 4. Interview Insights Tracking
  trackInterviewInsight: (segment: string, metric: string, value: number) => {
    console.log(`Interview Insight: ${segment} - ${metric}: ${value}`)
  }
}

// Google Ads Campaign Configuration
export const GoogleAdsCampaigns = [
  {
    id: 'campaign_a',
    name: 'Academic Excellence Focus',
    keywords: [
      'graduate recruitment platform',
      'university hiring software',
      'academic performance hiring',
      'graduate screening tools',
      'campus recruitment software'
    ],
    adCopy: {
      headline1: 'Find Top Academic Performers',
      headline2: 'See Real Grades & Projects',
      description: 'Reduce screening time by 70%. Access verified academic data, professor recommendations, and real project portfolios.',
      displayUrl: 'intransparency.com/hiring'
    },
    targetAudience: {
      jobTitles: ['HR Manager', 'Talent Acquisition', 'Recruiting Manager'],
      companySize: '50-500 employees',
      industries: ['Technology', 'Finance', 'Consulting']
    },
    budget: 50, // EUR per day
    bidStrategy: 'maximize_conversions'
  },
  {
    id: 'campaign_b',
    name: 'Time Saving Focus',
    keywords: [
      'reduce hiring time',
      'faster graduate screening',
      'automated candidate assessment',
      'recruitment efficiency tools'
    ],
    adCopy: {
      headline1: 'Cut Graduate Screening by 70%',
      headline2: 'AI-Powered Academic Insights',
      description: 'Stop wasting time on CVs. See verified grades, real projects, and professor endorsements instantly.',
      displayUrl: 'intransparency.com/demo'
    },
    targetAudience: {
      jobTitles: ['Startup Founder', 'CTO', 'Engineering Manager'],
      companySize: '10-200 employees',
      industries: ['Startups', 'Tech Scale-ups']
    },
    budget: 30, // EUR per day
    bidStrategy: 'target_cpa',
    targetCPA: 10 // EUR per conversion
  }
]

// Discovery Interview Script
export const InterviewScripts = {
  hiringManager: [
    {
      question: "Walk me through your last graduate hiring process from start to finish.",
      followUp: "What were the biggest pain points?",
      metrics: ['time_spent', 'candidates_screened', 'quality_of_hire']
    },
    {
      question: "How do you currently evaluate if a graduate's academic background matches your needs?",
      followUp: "How confident are you in CV accuracy?",
      metrics: ['evaluation_method', 'confidence_level', 'verification_process']
    },
    {
      question: "If you could see actual grades, course projects, and professor recommendations, how would that change your process?",
      followUp: "What specific data points would be most valuable?",
      metrics: ['value_perception', 'data_priorities', 'decision_impact']
    },
    {
      question: "What would you pay for a tool that reduces graduate screening time by 70% with verified academic data?",
      followUp: "What's your current cost per hire for graduates?",
      metrics: ['price_sensitivity', 'current_costs', 'budget_authority']
    },
    {
      question: "What would prevent you from using a platform like this?",
      followUp: "What features would make it a must-have?",
      metrics: ['objections', 'must_have_features', 'deal_breakers']
    }
  ],
  
  graduate: [
    {
      question: "Tell me about your job search experience so far.",
      followUp: "What's been most frustrating?",
      metrics: ['search_duration', 'applications_sent', 'response_rate']
    },
    {
      question: "How well do current job platforms let you showcase your academic achievements?",
      followUp: "What do you wish employers could see about you?",
      metrics: ['platform_satisfaction', 'showcase_gaps', 'desired_visibility']
    },
    {
      question: "Would you spend 30 minutes creating a detailed academic profile if it meant better job matches?",
      followUp: "What information would you be comfortable sharing?",
      metrics: ['effort_willingness', 'privacy_concerns', 'data_comfort']
    },
    {
      question: "Would you want your professors to endorse your profile?",
      followUp: "Which professors would you ask?",
      metrics: ['endorsement_interest', 'professor_relationships', 'credibility_value']
    }
  ],

  university: [
    {
      question: "How do you currently help students showcase their academic achievements to employers?",
      followUp: "What are the main challenges?",
      metrics: ['current_tools', 'support_level', 'challenges']
    },
    {
      question: "Would you be willing to verify student academic data for a recruitment platform?",
      followUp: "What would make this process easier for you?",
      metrics: ['verification_willingness', 'process_requirements', 'resource_needs']
    },
    {
      question: "What placement metrics are most important to your institution?",
      followUp: "How do you currently track these?",
      metrics: ['kpi_priorities', 'tracking_methods', 'reporting_needs']
    },
    {
      question: "Would you pay for better placement tools and analytics?",
      followUp: "What's your budget for career services tools?",
      metrics: ['payment_willingness', 'budget_range', 'decision_process']
    }
  ]
}

// Pre-Sales Validation Tiers
export const PreSalesTiers = [
  {
    name: 'Early Bird Startup',
    originalPrice: 39,
    preOrderPrice: 19,
    features: [
      '25 candidate searches/month',
      'Academic performance data',
      'Basic messaging',
      'Email support'
    ],
    limit: 50,
    sold: 18
  },
  {
    name: 'Early Bird Growth',
    originalPrice: 149,
    preOrderPrice: 74,
    features: [
      'Unlimited searches',
      'Professor recommendations',
      'Advanced filters',
      'API access',
      'Priority support',
      'Custom integrations'
    ],
    limit: 100,
    sold: 47,
    popular: true
  },
  {
    name: 'Founding Enterprise',
    originalPrice: 399,
    preOrderPrice: 199,
    features: [
      'Everything in Growth',
      'Dedicated account manager',
      'Custom onboarding',
      'SLA guarantee',
      'Feature request priority'
    ],
    limit: 20,
    sold: 8
  }
]

// Kickstarter-Style Rewards
export const CrowdfundingRewards = [
  {
    pledge: 29,
    reward: 'Graduate Early Access',
    description: 'Lifetime free access for graduates + premium features',
    backers: 89,
    limit: null
  },
  {
    pledge: 299,
    reward: 'Company 6-Month Access',
    description: '6 months of Growth plan + founder calls + feature input',
    backers: 42,
    limit: 50
  },
  {
    pledge: 999,
    reward: 'Company Annual Access',
    description: '12 months of Enterprise + advisory board seat',
    backers: 8,
    limit: 10
  },
  {
    pledge: 0,
    reward: 'University Partnership',
    description: 'Free platform for your students + analytics dashboard',
    backers: 12,
    limit: null
  }
]

// Validation Metrics Dashboard
export const ValidationMetrics = {
  emailSignups: {
    total: 1247,
    breakdown: {
      companies: 734,
      graduates: 421,
      universities: 92
    },
    conversionRate: 8.3,
    growthRate: 23 // % week over week
  },
  
  interviewInsights: {
    completed: 47,
    keyFindings: {
      willingToPay: 0.68, // 68%
      problemSeverity: 0.87, // 87% report significant problem
      solutionFit: 0.82 // 82% say solution would help
    }
  },
  
  adCampaigns: {
    spend: 2340, // EUR
    leads: 385,
    costPerLead: 6.08,
    bestPerforming: 'campaign_b',
    conversionRate: 0.12
  },
  
  preSales: {
    revenue: 10843, // EUR
    customers: 73,
    averageOrderValue: 148,
    projectedMRR: 7284
  },
  
  crowdfunding: {
    raised: 36420, // EUR
    goal: 50000,
    backers: 187,
    daysRemaining: 21,
    completionRate: 0.73
  }
}

// Validation Success Criteria
export const SuccessCriteria = {
  phase1_landing: {
    metric: 'Email signups',
    target: 500,
    achieved: 1247,
    success: true
  },
  phase2_interviews: {
    metric: 'Problem validation',
    target: 0.70, // 70% confirm problem
    achieved: 0.87,
    success: true
  },
  phase3_ads: {
    metric: 'Cost per lead',
    target: 15, // EUR
    achieved: 6.08,
    success: true
  },
  phase4_presales: {
    metric: 'Pre-order revenue',
    target: 5000, // EUR
    achieved: 10843,
    success: true
  },
  phase5_crowdfunding: {
    metric: 'Funding goal',
    target: 50000, // EUR
    achieved: 36420,
    success: false // Still in progress
  }
}

export default ValidationTracking