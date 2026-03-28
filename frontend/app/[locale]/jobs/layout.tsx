import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Job Opportunities | InTransparency',
  description: 'Discover job opportunities from verified employers looking for talented graduates with proven skills.',
}

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return children
}
