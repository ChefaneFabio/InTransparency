'use client'

import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/navigation'
import {
  Building2,
  Shield,
  Search,
  ArrowRight,
  CheckCircle,
  Zap,
  Target,
  X,
} from 'lucide-react'

export default function PerAziendePMIPage() {
  const t = useTranslations('perAziendePmi')

  const competitors = [
    { name: 'AlmaLaurea', cost: '€2.500/anno', hasSubscription: true },
    { name: 'LinkedIn Recruiter', cost: '€8.000/anno', hasSubscription: true },
    { name: 'InTransparency', cost: '€10/contatto', hasSubscription: false },
  ]

  const benefits = [
    { icon: Search, title: t('benefits.searchFree.title'), desc: t('benefits.searchFree.desc') },
    { icon: Shield, title: t('benefits.verified.title'), desc: t('benefits.verified.desc') },
    { icon: Zap, title: t('benefits.aiSearch.title'), desc: t('benefits.aiSearch.desc') },
    { icon: Target, title: t('benefits.payPerContact.title'), desc: t('benefits.payPerContact.desc') },
  ]

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="py-20 bg-foreground text-white">
          <div className="container text-center max-w-4xl">
            <Badge className="mb-6 bg-primary/50/20 text-green-200 border-green-400/30">
              {t('badge')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-slate-900 hover:bg-gray-100">
                <Link href="/explore">
                  {t('hero.browseCta')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10">
                <Link href="/pricing">
                  {t('hero.pricingCta')}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Price Comparison */}
        <section className="py-16">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-8">{t('comparison.title')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {competitors.map((comp, i) => (
                <Card key={i} className={`${comp.name === 'InTransparency' ? 'border-2 border-primary shadow-lg' : ''}`}>
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-lg mb-2">{comp.name}</h3>
                    <div className={`text-3xl font-bold mb-3 ${comp.name === 'InTransparency' ? 'text-primary' : 'text-red-600'}`}>
                      {comp.cost}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      {comp.hasSubscription ? (
                        <><X className="h-4 w-4 text-red-500" /> {t('comparison.annualRequired')}</>
                      ) : (
                        <><CheckCircle className="h-4 w-4 text-primary" /> {t('comparison.noCommitment')}</>
                      )}
                    </div>
                    {comp.name === 'InTransparency' && (
                      <Badge className="mt-3 bg-primary/10 text-primary">{t('comparison.bestValue')}</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-gray-50">
          <div className="container max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-4">{t('benefits.title')}</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">{t('benefits.subtitle')}</p>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((ben, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <ben.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{ben.title}</h3>
                        <p className="text-gray-600">{ben.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
            <p className="text-gray-600 mb-8">{t('cta.subtitle')}</p>
            <Button size="lg" asChild>
              <Link href="/auth/register/recruiter">
                {t('cta.button')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
