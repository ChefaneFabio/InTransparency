'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  Euro,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Calculator,
  TrendingDown
} from 'lucide-react'
import Link from 'next/link'

interface AgencyComparisonProps {
  locale?: string
}

export function AgencyComparison({ locale = 'it' }: AgencyComparisonProps) {
  const isItalian = locale === 'it'

  const content = {
    it: {
      badge: 'Confronto Costi',
      title: 'Risparmia il 98% vs Agenzie Interinali',
      subtitle: 'Le agenzie tradizionali costano €4.500-7.500 per assunzione. Con InTransparency paghi solo €10 per contatto.',
      agencyTitle: 'Agenzia Interinale',
      agencyPrice: '€4.500 - €7.500',
      agencyPer: 'per assunzione',
      agencyNote: '15-25% dello stipendio annuale',
      ourTitle: 'InTransparency',
      ourPrice: '€10',
      ourPer: 'per contatto',
      ourNote: 'Paga solo quando contatti',
      savingsTitle: 'Il Tuo Risparmio',
      savingsAmount: '€4.490+',
      savingsPercent: '98%',
      savingsNote: 'per ogni assunzione',
      comparisonTitle: 'Perché le Aziende Scelgono InTransparency',
      agencyFeatures: [
        { text: 'Costi elevati (15-25% stipendio)', negative: true },
        { text: 'Cicli di assunzione lunghi', negative: true },
        { text: 'Pool di candidati limitato', negative: true },
        { text: 'Nessuna verifica competenze', negative: true },
        { text: 'Contratti annuali vincolanti', negative: true },
        { text: 'Intermediari tra te e il candidato', negative: true }
      ],
      ourFeatures: [
        { text: 'Solo €10 per contatto diretto', negative: false },
        { text: 'Accesso immediato ai candidati', negative: false },
        { text: 'Migliaia di studenti verificati', negative: false },
        { text: 'Competenze certificate dall\'università', negative: false },
        { text: 'Zero contratti, paga quando vuoi', negative: false },
        { text: 'Contatto diretto con lo studente', negative: false }
      ],
      exampleTitle: 'Esempio Pratico',
      exampleScenario: 'Devi assumere 5 sviluppatori junior (stipendio €30.000)',
      agencyTotal: '€22.500 - €37.500',
      agencyCalc: '5 assunzioni × €4.500-7.500',
      ourTotal: '€250 - €500',
      ourCalc: '25-50 contatti × €10',
      realSavings: '€22.000+',
      cta: 'Inizia a Risparmiare',
      learnMore: 'Calcola il Tuo Risparmio'
    },
    en: {
      badge: 'Cost Comparison',
      title: 'Save 98% vs Staffing Agencies',
      subtitle: 'Traditional agencies charge €4,500-7,500 per hire. With InTransparency you pay only €10 per contact.',
      agencyTitle: 'Staffing Agency',
      agencyPrice: '€4,500 - €7,500',
      agencyPer: 'per hire',
      agencyNote: '15-25% of annual salary',
      ourTitle: 'InTransparency',
      ourPrice: '€10',
      ourPer: 'per contact',
      ourNote: 'Pay only when you reach out',
      savingsTitle: 'Your Savings',
      savingsAmount: '€4,490+',
      savingsPercent: '98%',
      savingsNote: 'per hire',
      comparisonTitle: 'Why Companies Choose InTransparency',
      agencyFeatures: [
        { text: 'High costs (15-25% of salary)', negative: true },
        { text: 'Long hiring cycles', negative: true },
        { text: 'Limited candidate pool', negative: true },
        { text: 'No skills verification', negative: true },
        { text: 'Binding annual contracts', negative: true },
        { text: 'Intermediaries between you and candidate', negative: true }
      ],
      ourFeatures: [
        { text: 'Only €10 per direct contact', negative: false },
        { text: 'Immediate candidate access', negative: false },
        { text: 'Thousands of verified students', negative: false },
        { text: 'University-certified skills', negative: false },
        { text: 'Zero contracts, pay when you want', negative: false },
        { text: 'Direct contact with students', negative: false }
      ],
      exampleTitle: 'Real Example',
      exampleScenario: 'You need to hire 5 junior developers (€30,000 salary)',
      agencyTotal: '€22,500 - €37,500',
      agencyCalc: '5 hires × €4,500-7,500',
      ourTotal: '€250 - €500',
      ourCalc: '25-50 contacts × €10',
      realSavings: '€22,000+',
      cta: 'Start Saving Now',
      learnMore: 'Calculate Your Savings'
    }
  }

  const t = content[isItalian ? 'it' : 'en']

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200">
            <Calculator className="h-3 w-3 mr-1" />
            {t.badge}
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Price Comparison Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          {/* Agency Card */}
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6 text-center">
              <Building2 className="h-10 w-10 text-red-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">{t.agencyTitle}</h3>
              <p className="text-3xl font-bold text-red-600 mb-1">{t.agencyPrice}</p>
              <p className="text-sm text-red-700">{t.agencyPer}</p>
              <p className="text-xs text-red-600 mt-2">{t.agencyNote}</p>
            </CardContent>
          </Card>

          {/* Savings Card */}
          <Card className="border-blue-300 bg-gradient-to-br from-blue-100 to-purple-100 shadow-lg scale-105">
            <CardContent className="pt-6 text-center">
              <TrendingDown className="h-10 w-10 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">{t.savingsTitle}</h3>
              <p className="text-4xl font-bold text-blue-600 mb-1">{t.savingsPercent}</p>
              <p className="text-sm text-blue-700">{t.savingsNote}</p>
              <Badge className="mt-2 bg-green-500">{t.savingsAmount}</Badge>
            </CardContent>
          </Card>

          {/* Our Card */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6 text-center">
              <Euro className="h-10 w-10 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">{t.ourTitle}</h3>
              <p className="text-3xl font-bold text-green-600 mb-1">{t.ourPrice}</p>
              <p className="text-sm text-green-700">{t.ourPer}</p>
              <p className="text-xs text-green-600 mt-2">{t.ourNote}</p>
            </CardContent>
          </Card>
        </div>

        {/* Feature Comparison */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Agency Features */}
          <Card className="border-red-200">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-lg mb-4 flex items-center gap-2 text-red-700">
                <Building2 className="h-5 w-5" />
                {t.agencyTitle}
              </h4>
              <ul className="space-y-3">
                {t.agencyFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Our Features */}
          <Card className="border-green-200">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-lg mb-4 flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                {t.ourTitle}
              </h4>
              <ul className="space-y-3">
                {t.ourFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Real Example */}
        <Card className="max-w-3xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 mb-12">
          <CardContent className="pt-6">
            <h4 className="font-bold text-lg mb-4 text-center">{t.exampleTitle}</h4>
            <p className="text-center text-gray-700 mb-6">{t.exampleScenario}</p>

            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-red-100 rounded-lg p-4">
                <p className="text-xs text-red-600 mb-1">{t.agencyTitle}</p>
                <p className="text-xl font-bold text-red-700">{t.agencyTotal}</p>
                <p className="text-xs text-red-600">{t.agencyCalc}</p>
              </div>

              <div className="bg-green-100 rounded-lg p-4">
                <p className="text-xs text-green-600 mb-1">{t.ourTitle}</p>
                <p className="text-xl font-bold text-green-700">{t.ourTotal}</p>
                <p className="text-xs text-green-600">{t.ourCalc}</p>
              </div>

              <div className="bg-blue-100 rounded-lg p-4">
                <p className="text-xs text-blue-600 mb-1">{t.savingsTitle}</p>
                <p className="text-xl font-bold text-blue-700">{t.realSavings}</p>
                <p className="text-xs text-blue-600">{t.savingsPercent} {isItalian ? 'di risparmio' : 'savings'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href={`/${locale}/auth/register?role=company`}>
              {t.cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <p className="mt-4">
            <Link
              href={`/${locale}/pricing`}
              className="text-sm text-blue-600 hover:underline"
            >
              {t.learnMore} →
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
