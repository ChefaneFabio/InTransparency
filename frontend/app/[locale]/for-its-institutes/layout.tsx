import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Per ITS Academy — Piattaforma Digitale Gratuita per Studenti ITS',
  description: 'L\'unica piattaforma digitale pensata per gli ITS Academy italiani. Portfolio verificati, analisi progetti AI, analytics di placement gratuiti. Meccatronica, biotech, ICT e altro.',
  keywords: ['ITS Academy piattaforma', 'ITS Italia digitale', 'portfolio studenti ITS', 'meccatronica ITS', 'placement ITS Academy'],
}

export default function ForITSLayout({ children }: { children: React.ReactNode }) {
  return children
}
