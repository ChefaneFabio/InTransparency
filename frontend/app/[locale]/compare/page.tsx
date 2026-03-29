'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const comparisons = [
  { key: 'linkedin', href: '/compare/linkedin' },
  { key: 'almalaurea', href: '/compare/almalaurea' },
  { key: 'cv', href: '/compare/cv' },
] as const

export default function ComparePage() {
  const t = useTranslations('compare')

  return (
    <div className="min-h-screen">
      <Header />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-foreground text-white">
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative mx-auto max-w-5xl px-4 pt-32 pb-16 lg:pt-36 lg:pb-20 text-center min-h-[420px] flex flex-col justify-center sm:px-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t('hero.title')}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100 sm:text-xl">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      {/* ─── COMPARISON CARDS ─── */}
      <section className="py-10 bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {comparisons.map((comp) => (
              <Card key={comp.key} className="flex flex-col">
                <CardContent className="pt-6 flex flex-col flex-1">
                  <h2 className="text-xl font-bold mb-2">{t(`cards.${comp.key}.title`)}</h2>
                  <p className="text-sm text-muted-foreground mb-6 flex-1">{t(`cards.${comp.key}.description`)}</p>
                  <Link href={comp.href}>
                    <Button variant="outline" className="w-full gap-2">
                      {t(`cards.${comp.key}.button`)}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
