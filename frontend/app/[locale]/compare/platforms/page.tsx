import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, MinusCircle, ShieldCheck, Sparkles } from 'lucide-react'
import { JsonLd } from '@/components/seo/JsonLd'
import type { Metadata } from 'next'
import { breadcrumbList } from '@/lib/schema-org'
import { getTranslations } from 'next-intl/server'

/**
 * Competitor comparison — InTransparency vs JobTeaser vs Handshake vs LinkedIn vs Indeed.
 * Server-component so LLMs (Perplexity, ChatGPT with browsing, Gemini) can
 * parse the full content without executing JS. Generative Engine Optimization.
 *
 * 5-platform comparison locked 2026-04-28. LinkedIn + Indeed added so the
 * comparison covers what visitors actually evaluate alongside the
 * EU-academic-specific JobTeaser/Handshake pair.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'comparePlatforms' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: 'https://www.in-transparency.com/en/compare/platforms',
      languages: {
        en: 'https://www.in-transparency.com/en/compare/platforms',
        it: 'https://www.in-transparency.com/it/compare/platforms',
        'x-default': 'https://www.in-transparency.com/en/compare/platforms',
      },
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      type: 'article',
      locale: 'en_US',
      alternateLocale: 'it_IT',
      siteName: 'InTransparency',
      images: [{ url: 'https://www.in-transparency.com/logo.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('ogTitle'),
      description: t('twitterDescription'),
      images: ['https://www.in-transparency.com/logo.png'],
    },
  }
}

type Cell = 'yes' | 'partial' | 'no'

interface ComparisonRow {
  categoryKey: string
  featureKey: string
  it: Cell
  jt: Cell
  hs: Cell
  /** LinkedIn (LinkedIn Recruiter for hiring-side rows). */
  li: Cell
  /** Indeed. */
  ind: Cell
  hasDetail?: boolean
}

const COMPARISON: ComparisonRow[] = [
  { categoryKey: 'verification', featureKey: 'verification.professorEndorsement', it: 'yes', jt: 'no', hs: 'no', li: 'no', ind: 'no', hasDetail: true },
  { categoryKey: 'verification', featureKey: 'verification.supervisorEval', it: 'yes', jt: 'no', hs: 'no', li: 'no', ind: 'no' },
  { categoryKey: 'verification', featureKey: 'verification.w3cVc', it: 'yes', jt: 'no', hs: 'no', li: 'no', ind: 'no', hasDetail: true },
  { categoryKey: 'verification', featureKey: 'verification.esco', it: 'yes', jt: 'partial', hs: 'no', li: 'no', ind: 'no' },

  { categoryKey: 'aiAct', featureKey: 'aiAct.registry', it: 'yes', jt: 'no', hs: 'no', li: 'no', ind: 'no', hasDetail: true },
  { categoryKey: 'aiAct', featureKey: 'aiAct.explanation', it: 'yes', jt: 'no', hs: 'no', li: 'no', ind: 'no' },
  { categoryKey: 'aiAct', featureKey: 'aiAct.humanOversight', it: 'yes', jt: 'no', hs: 'no', li: 'no', ind: 'no' },
  { categoryKey: 'aiAct', featureKey: 'aiAct.auditLog', it: 'yes', jt: 'no', hs: 'no', li: 'no', ind: 'no' },

  { categoryKey: 'italianCompliance', featureKey: 'italianCompliance.anvur', it: 'yes', jt: 'no', hs: 'no', li: 'no', ind: 'no' },
  { categoryKey: 'italianCompliance', featureKey: 'italianCompliance.ccnl', it: 'yes', jt: 'no', hs: 'no', li: 'no', ind: 'no' },
  { categoryKey: 'italianCompliance', featureKey: 'italianCompliance.inail', it: 'yes', jt: 'no', hs: 'no', li: 'no', ind: 'no' },
  { categoryKey: 'italianCompliance', featureKey: 'italianCompliance.spid', it: 'partial', jt: 'no', hs: 'no', li: 'no', ind: 'no', hasDetail: true },
  { categoryKey: 'italianCompliance', featureKey: 'italianCompliance.esse3', it: 'partial', jt: 'no', hs: 'no', li: 'no', ind: 'no' },

  { categoryKey: 'crossBorder', featureKey: 'crossBorder.erasmus', it: 'yes', jt: 'no', hs: 'no', li: 'no', ind: 'no' },
  { categoryKey: 'crossBorder', featureKey: 'crossBorder.hostSkill', it: 'yes', jt: 'no', hs: 'no', li: 'no', ind: 'no' },
  { categoryKey: 'crossBorder', featureKey: 'crossBorder.europass', it: 'yes', jt: 'partial', hs: 'no', li: 'no', ind: 'no' },

  { categoryKey: 'recruiting', featureKey: 'recruiting.branding', it: 'yes', jt: 'yes', hs: 'yes', li: 'yes', ind: 'yes' },
  { categoryKey: 'recruiting', featureKey: 'recruiting.matching', it: 'yes', jt: 'yes', hs: 'yes', li: 'yes', ind: 'partial' },
  { categoryKey: 'recruiting', featureKey: 'recruiting.evidenceScoring', it: 'yes', jt: 'no', hs: 'no', li: 'no', ind: 'no', hasDetail: true },
  { categoryKey: 'recruiting', featureKey: 'recruiting.evidencePacket', it: 'yes', jt: 'partial', hs: 'partial', li: 'no', ind: 'no' },

  { categoryKey: 'universities', featureKey: 'universities.gap', it: 'yes', jt: 'no', hs: 'partial', li: 'no', ind: 'no' },
  { categoryKey: 'universities', featureKey: 'universities.curriculum', it: 'yes', jt: 'no', hs: 'no', li: 'no', ind: 'no' },
  { categoryKey: 'universities', featureKey: 'universities.professorPortal', it: 'yes', jt: 'no', hs: 'no', li: 'no', ind: 'no' },
  { categoryKey: 'universities', featureKey: 'universities.freeForUni', it: 'yes', jt: 'yes', hs: 'no', li: 'no', ind: 'yes', hasDetail: true },

  { categoryKey: 'privacy', featureKey: 'privacy.export', it: 'yes', jt: 'partial', hs: 'partial', li: 'partial', ind: 'partial' },
  { categoryKey: 'privacy', featureKey: 'privacy.deletion', it: 'yes', jt: 'partial', hs: 'partial', li: 'yes', ind: 'yes' },
  { categoryKey: 'privacy', featureKey: 'privacy.cookies', it: 'yes', jt: 'yes', hs: 'partial', li: 'yes', ind: 'yes' },
]

function StatusIcon({ v, labels }: { v: 'yes' | 'partial' | 'no'; labels: { yes: string; partial: string; no: string } }) {
  if (v === 'yes') return <CheckCircle className="h-5 w-5 text-emerald-600" aria-label={labels.yes} />
  if (v === 'partial') return <MinusCircle className="h-5 w-5 text-amber-600" aria-label={labels.partial} />
  return <XCircle className="h-5 w-5 text-red-500" aria-label={labels.no} />
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function PlatformsComparePage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'comparePlatforms' })
  const categories = Array.from(new Set(COMPARISON.map(r => r.categoryKey)))

  const statusLabels = {
    yes: t('statusYes'),
    partial: t('statusPartial'),
    no: t('statusNo'),
  }

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'InTransparency vs JobTeaser vs Handshake vs LinkedIn vs Indeed',
          datePublished: '2026-04-28',
          author: { '@type': 'Organization', name: 'InTransparency' },
          publisher: {
            '@type': 'Organization',
            name: 'InTransparency',
            logo: { '@type': 'ImageObject', url: 'https://www.in-transparency.com/logo.png' },
          },
          description: t('metaDescription'),
          mainEntityOfPage: 'https://www.in-transparency.com/en/compare/platforms',
        }}
      />
      <JsonLd
        data={breadcrumbList([
          { name: t('breadcrumb.home'), url: '/' },
          { name: t('breadcrumb.compare'), url: '/compare' },
          { name: t('breadcrumb.platforms'), url: '/compare/platforms' },
        ])}
      />
      <Header />
      <main className="container max-w-5xl mx-auto px-4 pt-32 pb-16">
        <div className="mb-8">
          <Badge variant="outline" className="mb-2">{t('badge')}</Badge>
          <h1 className="text-4xl font-bold mb-3">{t('h1')}</h1>
          <p className="text-lg text-muted-foreground">{t('intro')}</p>
        </div>

        <Card className="mb-8 bg-primary/5 border-primary/30">
          <CardContent className="pt-5 pb-5 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-semibold mb-1">{t('tldrH2')}</h2>
              <p className="text-sm text-muted-foreground">{t('tldr')}</p>
            </div>
          </CardContent>
        </Card>

        {categories.map(cat => (
          <Card key={cat} className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t(`categories.${cat}`)}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* overflow-x-auto so 5-column table doesn't crush on mobile */}
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm min-w-[640px]">
                  <thead>
                    <tr className="text-xs text-muted-foreground uppercase">
                      <th className="text-left pb-2 pr-4 font-semibold">{t('featureHead')}</th>
                      <th className="pb-2 px-2 font-semibold whitespace-nowrap">InTransparency</th>
                      <th className="pb-2 px-2 font-semibold">JobTeaser</th>
                      <th className="pb-2 px-2 font-semibold">Handshake</th>
                      <th className="pb-2 px-2 font-semibold">LinkedIn</th>
                      <th className="pb-2 px-2 font-semibold">Indeed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON.filter(r => r.categoryKey === cat).map((r, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="py-3 pr-4">
                          <div className="font-medium">{t(`features.${r.featureKey}.label`)}</div>
                          {r.hasDetail && (
                            <div className="text-xs text-muted-foreground mt-0.5">{t(`features.${r.featureKey}.detail`)}</div>
                          )}
                        </td>
                        <td className="text-center px-2"><StatusIcon v={r.it} labels={statusLabels} /></td>
                        <td className="text-center px-2"><StatusIcon v={r.jt} labels={statusLabels} /></td>
                        <td className="text-center px-2"><StatusIcon v={r.hs} labels={statusLabels} /></td>
                        <td className="text-center px-2"><StatusIcon v={r.li} labels={statusLabels} /></td>
                        <td className="text-center px-2"><StatusIcon v={r.ind} labels={statusLabels} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="mt-8 bg-muted/30">
          <CardContent className="pt-5 pb-5 text-sm text-muted-foreground">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              {t('honestH3')}
            </h3>
            <ul className="space-y-1 list-disc pl-5">
              <li>{t('honest.0')}</li>
              <li>{t('honest.1')}</li>
              <li>{t('honest.2')}</li>
            </ul>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
