import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us — Schedule a Demo or Get in Touch',
  description: 'Contact the InTransparency team. Schedule a free demo for your university or company. Email us at students@intransparency.it or book a call directly.',
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
