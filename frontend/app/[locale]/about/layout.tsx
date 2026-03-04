import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — Fixing Recruitment Opacity with Verified Credentials',
  description: 'InTransparency replaces opaque CVs with institution-verified student profiles. Skills traced to source, AI-analyzed projects, and transparent hiring for all sectors.',
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
