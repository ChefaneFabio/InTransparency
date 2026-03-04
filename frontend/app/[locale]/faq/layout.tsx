import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ — Common Questions About InTransparency',
  description: 'Frequently asked questions about InTransparency for students, universities, and companies. Learn about pricing, verification, privacy, and how to get started.',
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children
}
