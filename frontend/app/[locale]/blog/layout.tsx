import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights on verified credentials, career development, and the future of university-to-work transitions in Italy and Europe.',
  openGraph: {
    title: 'Blog | InTransparency',
    description: 'Insights on verified credentials, career development, and the future of university-to-work transitions.',
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
