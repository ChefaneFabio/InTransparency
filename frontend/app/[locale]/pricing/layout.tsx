import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — Pay Per Contact, No Annual Commitment',
  description: 'Free for students and universities. Companies pay just €10 per contact — no subscription, no annual fee. Compare with AlmaLaurea (€2,500/yr) and LinkedIn Recruiter (€8,000/yr).',
  keywords: ['pay per contact recruiting', 'no subscription recruitment', 'cheap graduate hiring', 'university recruitment pricing Italy'],
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
