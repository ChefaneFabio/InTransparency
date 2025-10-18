import Stripe from 'stripe'

// Initialize Stripe only if the key is provided (optional for now)
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-09-30.clover',
      typescript: true
    })
  : null

// Product Price IDs (set these in your .env file)
export const STRIPE_PRICES = {
  STUDENT_PRO_MONTHLY: process.env.STRIPE_STUDENT_PRO_MONTHLY_PRICE_ID || '',
  STUDENT_PRO_ANNUAL: process.env.STRIPE_STUDENT_PRO_ANNUAL_PRICE_ID || '',
  RECRUITER_STARTER_MONTHLY: process.env.STRIPE_RECRUITER_STARTER_MONTHLY_PRICE_ID || '',
  RECRUITER_STARTER_ANNUAL: process.env.STRIPE_RECRUITER_STARTER_ANNUAL_PRICE_ID || '',
  RECRUITER_GROWTH_MONTHLY: process.env.STRIPE_RECRUITER_GROWTH_MONTHLY_PRICE_ID || '',
  RECRUITER_GROWTH_ANNUAL: process.env.STRIPE_RECRUITER_GROWTH_ANNUAL_PRICE_ID || '',
  RECRUITER_PRO_MONTHLY: process.env.STRIPE_RECRUITER_PRO_MONTHLY_PRICE_ID || '',
  RECRUITER_PRO_ANNUAL: process.env.STRIPE_RECRUITER_PRO_ANNUAL_PRICE_ID || ''
}

// Pricing configuration
export const PRICING = {
  STUDENT_PRO: {
    monthly: 900, // €9 in cents
    annual: 9000  // €90 in cents (save €18)
  },
  RECRUITER_STARTER: {
    monthly: 4900,  // €49
    annual: 49000   // €490 (save ~€98)
  },
  RECRUITER_GROWTH: {
    monthly: 14900, // €149
    annual: 149000  // €1490 (save ~€298)
  },
  RECRUITER_PRO: {
    monthly: 29700, // €297
    annual: 297000  // €2970 (save ~€594)
  }
}
