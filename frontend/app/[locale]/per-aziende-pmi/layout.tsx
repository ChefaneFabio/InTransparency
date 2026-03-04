import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Per PMI — Assumi Laureati a €10 per Contatto, Senza Abbonamento',
  description: 'La piattaforma di recruiting pensata per le PMI italiane. Cerca gratis, paga solo €10 per contatto. Profili verificati dall\'universit\u00e0, nessun abbonamento annuale.',
  keywords: ['recruiting PMI Italia', 'assumere laureati', 'costo per assunzione basso', 'alternativa AlmaLaurea PMI', 'recruiting senza abbonamento'],
}

export default function PerAziendePMILayout({ children }: { children: React.ReactNode }) {
  return children
}
