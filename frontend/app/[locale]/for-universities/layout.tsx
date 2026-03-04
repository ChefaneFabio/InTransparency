import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'For Universities — Free Placement Analytics & Student Verification',
  description: 'Free placement analytics dashboard, student portfolio hosting, and institutional verification badges. Track graduate outcomes and connect students with employers across Europe.',
  keywords: ['university placement analytics', 'student verification platform', 'career services tools', 'graduate employment tracking'],
}

export default function ForUniversitiesLayout({ children }: { children: React.ReactNode }) {
  return children
}
