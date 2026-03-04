import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'For Engineering & Manufacturing — Hire Verified Engineers',
  description: 'Find engineers with verified project portfolios from Italian universities and ITS academies. CAD, FEA, mechatronics, automation — see actual work, not just CVs. Pay €10 per contact.',
  keywords: ['hire engineers Italy', 'engineering graduates', 'mechatronics ITS', 'manufacturing recruitment', 'verified engineering portfolios'],
}

export default function ForEngineeringLayout({ children }: { children: React.ReactNode }) {
  return children
}
