import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Features — Verified Portfolios, AI Search & Placement Analytics',
  description: 'AI-powered project analysis, institution-verified skills, DISC personality profiles, advanced recruiter search, and free placement analytics for universities.',
  keywords: ['AI project analysis', 'verified student skills', 'recruiter search tools', 'placement analytics', 'DISC personality profile'],
}

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return children
}
