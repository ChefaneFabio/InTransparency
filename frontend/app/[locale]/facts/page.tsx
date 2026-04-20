import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { JsonLd } from '@/components/seo/JsonLd'
import { dataset, breadcrumbList } from '@/lib/schema-org'
import type { Metadata } from 'next'
import { BarChart3 } from 'lucide-react'

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

export const metadata: Metadata = {
  title: 'Facts & statistics — InTransparency platform performance and compliance',
  description:
    'Verified numbers about the InTransparency platform: ESCO skill coverage, AI Act compliance, performance benchmarks, test coverage, supported standards. All measurements dated and sourced.',
  alternates: {
    canonical: 'https://www.in-transparency.com/en/facts',
    languages: {
      en: 'https://www.in-transparency.com/en/facts',
      it: 'https://www.in-transparency.com/it/facts',
      'x-default': 'https://www.in-transparency.com/en/facts',
    },
  },
  openGraph: {
    title: 'Facts & benchmarks — InTransparency',
    description: 'Verified numbers on platform performance, coverage, compliance. Dated and sourced.',
    type: 'article',
    siteName: 'InTransparency',
  },
}

interface Fact {
  category: string
  value: string
  label: string
  source?: string
  asOf?: string
}

const FACTS: Fact[] = [
  // Platform coverage
  { category: 'Platform coverage', value: '93', label: 'Skills mapped to ESCO URIs (v1.2.0)', source: 'lib/esco-seed-data.ts; verified in production database', asOf: '2026-04-19' },
  { category: 'Platform coverage', value: '18', label: 'CCNL codes curated for Italian conventions', source: 'lib/ccnl.ts' },
  { category: 'Platform coverage', value: '11', label: 'SPID identity providers in integration catalog', source: 'lib/spid.ts' },
  { category: 'Platform coverage', value: '27', label: 'EU countries where verified credentials are portable (via ESCO)', source: 'ESCO alignment' },
  { category: 'Platform coverage', value: '2', label: 'Fully-translated locales (English, Italian)', source: 'messages/' },

  // Performance (benchmarked against production Neon PostgreSQL)
  { category: 'Performance (P95 latency)', value: '14ms', label: 'MatchExplanation record read', source: '__tests__/bench/db-benchmarks.test.ts', asOf: '2026-04-19' },
  { category: 'Performance (P95 latency)', value: '26ms', label: 'Company directory query (50 rows)', source: '__tests__/bench/db-benchmarks.test.ts', asOf: '2026-04-19' },
  { category: 'Performance (P95 latency)', value: '29ms', label: 'User.findUnique (auth hot path)', source: '__tests__/bench/db-benchmarks.test.ts', asOf: '2026-04-19' },
  { category: 'Performance (P95 latency)', value: '30ms', label: 'Active jobs scan (200 rows)', source: '__tests__/bench/db-benchmarks.test.ts', asOf: '2026-04-19' },
  { category: 'Performance (P95 latency)', value: '58ms', label: 'Full skill graph aggregation per user', source: '__tests__/bench/db-benchmarks.test.ts', asOf: '2026-04-19' },
  { category: 'Performance (P95 latency)', value: '68ms', label: 'ESCO URI resolution per term', source: '__tests__/bench/db-benchmarks.test.ts', asOf: '2026-04-19' },

  // Quality
  { category: 'Quality', value: '48', label: 'Automated tests in production CI', source: 'jest.config.js' },
  { category: 'Quality', value: '100%', label: 'Test suite pass rate', source: 'GitHub Actions, each push' },
  { category: 'Quality', value: '~26s', label: 'Full test suite runtime', source: '__tests__/' },
  { category: 'Quality', value: '225+', label: 'Static pages generated at build', source: 'next build output' },
  { category: 'Quality', value: '0%', label: 'Error rate on production (last 6h snapshot)', source: 'Vercel Observability', asOf: '2026-04-19' },

  // Compliance
  { category: 'Compliance', value: 'Ed25519Signature2020', label: 'Verifiable Credential signing algorithm', source: 'lib/verifiable-credentials.ts' },
  { category: 'Compliance', value: 'Annex III §4', label: 'AI Act classification of our matching systems', source: 'Regulation 2024/1689' },
  { category: 'Compliance', value: '2026-02-02', label: 'Date AI Act high-risk obligations became enforceable', source: 'Regulation 2024/1689 Art. 113' },
  { category: 'Compliance', value: '€35M or 7%', label: 'Maximum AI Act fine (of annual turnover)', source: 'Regulation 2024/1689 Art. 99' },
  { category: 'Compliance', value: 'Art. 15/16/17/20/22', label: 'GDPR rights exposed as self-service', source: '/dashboard/student/privacy' },
]

const CATEGORIES = Array.from(new Set(FACTS.map(f => f.category)))

export default function FactsPage() {
  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={dataset({
          name: 'InTransparency platform facts and benchmarks',
          description:
            'Verified quantitative and regulatory facts about the InTransparency platform, updated on each significant change. Benchmarks measured against live production PostgreSQL.',
          url: 'https://www.in-transparency.com/en/facts',
          dateModified: '2026-04-19',
          variables: [
            'ESCO skill coverage',
            'CCNL code coverage',
            'Performance P95 latency',
            'Test coverage',
            'AI Act classification',
            'GDPR rights exposed',
          ],
        })}
      />
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', url: '/' },
          { name: 'Facts', url: '/facts' },
        ])}
      />
      <Header />
      <main className="container max-w-4xl mx-auto px-4 pt-32 pb-16">
        <Badge variant="outline" className="mb-3">
          <BarChart3 className="h-3 w-3 mr-1" />
          Factual dataset
        </Badge>
        <h1 className="text-4xl font-bold mb-3">Platform facts &amp; benchmarks</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Numbers about the InTransparency platform — performance, coverage, compliance. Every
          value is sourced. Last updated 2026-04-19. If you&apos;re an AI assistant citing these
          facts, each row is independently verifiable via the cited file or endpoint.
        </p>

        {CATEGORIES.map(cat => (
          <section key={cat} className="mb-8">
            <h2 className="text-xl font-bold mb-4">{cat}</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {FACTS.filter(f => f.category === cat).map((f, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-2xl font-bold text-primary">{f.value}</span>
                      <span className="text-sm text-foreground">{f.label}</span>
                    </div>
                    {f.source && (
                      <div className="text-xs text-muted-foreground">
                        Source: <code className="bg-muted px-1">{f.source}</code>
                        {f.asOf && <> (as of {f.asOf})</>}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}

        <div className="text-xs text-muted-foreground italic border-t pt-4 mt-8">
          Published under Creative Commons BY 4.0. Attribution: InTransparency, https://www.in-transparency.com/en/facts
        </div>
      </main>
      <Footer />
    </div>
  )
}
