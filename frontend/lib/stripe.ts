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
  STUDENT_PREMIUM_MONTHLY: process.env.STRIPE_STUDENT_PREMIUM_MONTHLY_PRICE_ID || '',
  RECRUITER_ENTERPRISE_MONTHLY: process.env.STRIPE_RECRUITER_ENTERPRISE_MONTHLY_PRICE_ID || '',
  INSTITUTION_ENTERPRISE_ANNUAL: process.env.STRIPE_INSTITUTION_ENTERPRISE_ANNUAL_PRICE_ID || '',
  CONTACT_CREDITS: process.env.STRIPE_CONTACT_CREDITS_PRICE_ID || '',
}

// Pricing configuration (amounts in cents)
export const PRICING = {
  STUDENT_PREMIUM: {
    monthly: 900, // €9
  },
  RECRUITER_ENTERPRISE: {
    monthly: 9900, // €99
  },
  INSTITUTION_ENTERPRISE: {
    annual: 200000, // €2,000
  },
  CONTACT_CREDITS: {
    perCredit: 1000, // €10 per contact credit
  },
}
