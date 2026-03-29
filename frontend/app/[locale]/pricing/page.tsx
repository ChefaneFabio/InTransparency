'use client'

import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/navigation'

export default function PricingPage() {
  const t = useTranslations('pricingPage')

  const tiers = [
    {
      key: 'students',
      price: t('tiers.students.price'),
      period: t('tiers.students.period'),
      href: '/auth/register/student',
      featured: false,
      features: [0, 1, 2, 3, 4],
    },
    {
      key: 'companies',
      price: t('tiers.companies.price'),
      period: t('tiers.companies.period'),
      href: '/auth/register/recruiter',
      featured: true,
      features: [0, 1, 2, 3, 4, 5],
    },
    {
      key: 'universities',
      price: t('tiers.universities.price'),
      period: t('tiers.universities.period'),
      href: '/contact?subject=university-pilot',
      featured: false,
      features: [0, 1, 2, 3, 4],
    },
  ]

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground text-white">
        <img src="/images/brand/meeting.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-primary/60" />
        <div className="relative container max-w-4xl mx-auto px-4 pt-32 pb-16 lg:pt-36 lg:pb-20 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">{t('hero.title')}</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">{t('hero.subtitle')}</p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <Card
                key={tier.key}
                className={`relative ${tier.featured ? 'border-2 border-primary shadow-xl' : 'border-2'}`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-white">{t('tiers.companies.badge')}</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-lg">{t(`tiers.${tier.key}.name`)}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.period && (
                      <span className="text-sm text-muted-foreground ml-1">{tier.period}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{t(`tiers.${tier.key}.description`)}</p>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((i) => (
                      <li key={i} className="flex items-start text-sm">
                        <span className="text-primary font-bold mr-2 flex-shrink-0">✓</span>
                        <span>{t(`tiers.${tier.key}.features.${i}`)}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${tier.featured ? 'bg-primary' : ''}`}
                    variant={tier.featured ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href={tier.href}>
                      {t(`tiers.${tier.key}.cta`)}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Honest note */}
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              {t('note')}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('faq.title')}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[0, 1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-base">{t(`faq.questions.${i}.q`)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{t(`faq.questions.${i}.a`)}</p>
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
