import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works — From Portfolio to Placement in 3 Steps',
  description: 'Students build verified portfolios, universities validate skills, companies discover talent. See how InTransparency connects graduates with employers through transparent, verified profiles.',
}

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return children
}
