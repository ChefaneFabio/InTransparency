import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Mission — Making Hiring Transparent and Fair',
  description: 'We believe hiring should be based on verified skills, not self-reported CVs. InTransparency is building the European standard for transparent university-to-work transitions.',
}

export default function MissionLayout({ children }: { children: React.ReactNode }) {
  return children
}
