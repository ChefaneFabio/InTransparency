'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

export default function ForStartupsPage() {
  const t = useTranslations('forStartups')

  const benefits = [
    { title: t('benefits.0.title'), description: t('benefits.0.description') },
    { title: t('benefits.1.title'), description: t('benefits.1.description') },
    { title: t('benefits.2.title'), description: t('benefits.2.description') },
    { title: t('benefits.3.title'), description: t('benefits.3.description') },
  ]

  return (
    <div className="min-h-screen">
      <Header />
      <section className="relative overflow-hidden bg-foreground text-white">
        <img src="/images/brand/meeting.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-primary/60" />
        <div className="relative container max-w-4xl mx-auto px-4 py-16 lg:py-20 text-center">
          <p className="text-sm text-blue-300 font-medium mb-4">{t('hero.badge')}</p>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">{t('hero.title')}</h1>
          <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">{t('hero.subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register/recruiter">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 w-full sm:w-auto">
                {t('hero.cta')}<ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/demo/ai-search">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                {t('hero.secondaryCta')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('benefits.title')}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((b, i) => (
              <Card key={i} className="border-2 hover:border-primary/30 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">{i + 1}</div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{b.title}</h3>
                      <p className="text-sm text-muted-foreground">{b.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-primary text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-blue-200 mb-8 max-w-xl mx-auto">{t('cta.subtitle')}</p>
          <Link href="/auth/register/recruiter">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
              {t('cta.button')}<ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  )
}
