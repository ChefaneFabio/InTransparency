'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const TABLE_ROWS = 6

export default function CompareAlmaLaureaPage() {
  const t = useTranslations('compareAlmaLaurea')

  return (
    <div className="min-h-screen">
      <Header />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-foreground text-white">
        <img src="/images/brand/campus.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-primary/60" />
        <div className="relative mx-auto max-w-5xl px-4 pt-32 pb-16 lg:pt-36 lg:pb-20 text-center min-h-[420px] flex flex-col justify-center sm:px-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t('hero.title')}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100 sm:text-xl">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      {/* ─── COMPARISON TABLE ─── */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-center mb-8">{t('table.title')}</h2>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground"></th>
                  <th className="text-center p-4 text-sm font-medium text-muted-foreground">{t('table.themLabel')}</th>
                  <th className="text-center p-4 text-sm font-medium text-primary">{t('table.usLabel')}</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: TABLE_ROWS }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-4 text-sm font-medium">{t(`table.rows.${i}.feature`)}</td>
                    <td className="p-4 text-sm text-center text-muted-foreground">{t(`table.rows.${i}.them`)}</td>
                    <td className="p-4 text-sm text-center text-primary font-medium">{t(`table.rows.${i}.us`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── KEY DIFFERENTIATORS ─── */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-center mb-10">{t('differentiators.title')}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
                      {i + 1}
                    </span>
                    <h3 className="font-semibold">{t(`differentiators.cards.${i}.title`)}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{t(`differentiators.cards.${i}.description`)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 bg-primary text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-lg text-blue-100 mb-8">{t('cta.subtitle')}</p>
          <Link href="/contact?subject=university-pilot">
            <Button size="lg" variant="secondary" className="gap-2">
              {t('cta.button')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
