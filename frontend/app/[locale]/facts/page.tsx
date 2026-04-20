import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { JsonLd } from '@/components/seo/JsonLd'
import { dataset, breadcrumbList } from '@/lib/schema-org'
import type { Metadata } from 'next'
import { BarChart3 } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

/**
 * Facts / statistics page — hard numbers with citations.
 *
 * LLMs are reluctant to hallucinate specific numbers, so they cite
 * published-fact pages when asked quantitative questions. This page gives
 * them something to cite. Dataset JSON-LD makes it show up in Google Dataset
 * Search too.
 *
 * All numbers here must be defensible. Update them when they change.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'factsPage' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: 'https://www.in-transparency.com/en/facts',
      languages: {
        en: 'https://www.in-transparency.com/en/facts',
        it: 'https://www.in-transparency.com/it/facts',
        'x-default': 'https://www.in-transparency.com/en/facts',
      },
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      type: 'article',
      siteName: 'InTransparency',
    },
  }
}

interface Fact {
  categoryKey: 'coverage' | 'performance' | 'quality' | 'compliance'
  value: string
  labelKey: string
  source?: string
  asOf?: string
}

const FACTS: Fact[] = [
  // Platform coverage
  { categoryKey: 'coverage', value: '93', labelKey: 'labels.skillsMappedEsco', source: 'lib/esco-seed-data.ts; verified in production database', asOf: '2026-04-19' },
  { categoryKey: 'coverage', value: '18', labelKey: 'labels.ccnlCodes', source: 'lib/ccnl.ts' },
  { categoryKey: 'coverage', value: '11', labelKey: 'labels.spidProviders', source: 'lib/spid.ts' },
  { categoryKey: 'coverage', value: '27', labelKey: 'labels.euCountries', source: 'ESCO alignment' },
  { categoryKey: 'coverage', value: '2', labelKey: 'labels.locales', source: 'messages/' },

  // Performance (benchmarked against production Neon PostgreSQL)
  { categoryKey: 'performance', value: '14ms', labelKey: 'labels.matchExplanation', source: '__tests__/bench/db-benchmarks.test.ts', asOf: '2026-04-19' },
  { categoryKey: 'performance', value: '26ms', labelKey: 'labels.companyDirectory', source: '__tests__/bench/db-benchmarks.test.ts', asOf: '2026-04-19' },
  { categoryKey: 'performance', value: '29ms', labelKey: 'labels.userFindUnique', source: '__tests__/bench/db-benchmarks.test.ts', asOf: '2026-04-19' },
  { categoryKey: 'performance', value: '30ms', labelKey: 'labels.activeJobs', source: '__tests__/bench/db-benchmarks.test.ts', asOf: '2026-04-19' },
  { categoryKey: 'performance', value: '58ms', labelKey: 'labels.skillGraph', source: '__tests__/bench/db-benchmarks.test.ts', asOf: '2026-04-19' },
  { categoryKey: 'performance', value: '68ms', labelKey: 'labels.escoResolution', source: '__tests__/bench/db-benchmarks.test.ts', asOf: '2026-04-19' },

  // Quality
  { categoryKey: 'quality', value: '48', labelKey: 'labels.automatedTests', source: 'jest.config.js' },
  { categoryKey: 'quality', value: '100%', labelKey: 'labels.passRate', source: 'GitHub Actions, each push' },
  { categoryKey: 'quality', value: '~26s', labelKey: 'labels.suiteRuntime', source: '__tests__/' },
  { categoryKey: 'quality', value: '225+', labelKey: 'labels.staticPages', source: 'next build output' },
  { categoryKey: 'quality', value: '0%', labelKey: 'labels.errorRate', source: 'Vercel Observability', asOf: '2026-04-19' },

  // Compliance
  { categoryKey: 'compliance', value: 'Ed25519Signature2020', labelKey: 'labels.vcSigning', source: 'lib/verifiable-credentials.ts' },
  { categoryKey: 'compliance', value: 'Annex III §4', labelKey: 'labels.aiActClassification', source: 'Regulation 2024/1689' },
  { categoryKey: 'compliance', value: '2026-02-02', labelKey: 'labels.aiActEnforcement', source: 'Regulation 2024/1689 Art. 113' },
  { categoryKey: 'compliance', value: '€35M or 7%', labelKey: 'labels.aiActFine', source: 'Regulation 2024/1689 Art. 99' },
  { categoryKey: 'compliance', value: 'Art. 15/16/17/20/22', labelKey: 'labels.gdprRights', source: '/dashboard/student/privacy' },
]

const CATEGORY_ORDER: Array<Fact['categoryKey']> = ['coverage', 'performance', 'quality', 'compliance']

export default async function FactsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'factsPage' })

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={dataset({
          name: t('jsonLdName'),
          description: t('jsonLdDescription'),
          url: 'https://www.in-transparency.com/en/facts',
          dateModified: '2026-04-19',
          variables: [
            t('variables.escoCoverage'),
            t('variables.ccnlCoverage'),
            t('variables.performance'),
            t('variables.testCoverage'),
            t('variables.aiActClassification'),
            t('variables.gdprRights'),
          ],
        })}
      />
      <JsonLd
        data={breadcrumbList([
          { name: t('breadcrumbHome'), url: '/' },
          { name: t('breadcrumbFacts'), url: '/facts' },
        ])}
      />
      <Header />
      <main className="container max-w-4xl mx-auto px-4 pt-32 pb-16">
        <Badge variant="outline" className="mb-3">
          <BarChart3 className="h-3 w-3 mr-1" />
          {t('heroBadge')}
        </Badge>
        <h1 className="text-4xl font-bold mb-3">{t('h1')}</h1>
        <p className="text-lg text-muted-foreground mb-8">{t('intro')}</p>

        {CATEGORY_ORDER.map(cat => (
          <section key={cat} className="mb-8">
            <h2 className="text-xl font-bold mb-4">{t(`categories.${cat}`)}</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {FACTS.filter(f => f.categoryKey === cat).map((f, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-2xl font-bold text-primary">{f.value}</span>
                      <span className="text-sm text-foreground">{t(f.labelKey)}</span>
                    </div>
                    {f.source && (
                      <div className="text-xs text-muted-foreground">
                        {t('sourceLabel')}: <code className="bg-muted px-1">{f.source}</code>
                        {f.asOf && <> ({t('asOf')} {f.asOf})</>}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}

        <div className="text-xs text-muted-foreground italic border-t pt-4 mt-8">
          {t('license')}
        </div>
      </main>
      <Footer />
    </div>
  )
}
