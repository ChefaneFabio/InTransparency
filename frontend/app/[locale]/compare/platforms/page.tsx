import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, MinusCircle, ShieldCheck, Sparkles } from 'lucide-react'
import { JsonLd } from '@/components/seo/JsonLd'
import type { Metadata } from 'next'
import { breadcrumbList } from '@/lib/schema-org'

/**
 * Competitor comparison — InTransparency vs JobTeaser vs Handshake.
 * Server-component so LLMs (Perplexity, ChatGPT with browsing, Gemini) can
 * parse the full content without executing JS. Generative Engine Optimization.
 */

export const metadata: Metadata = {
  title: 'InTransparency vs JobTeaser vs Handshake — honest comparison',
  description:
    'Side-by-side comparison of InTransparency, JobTeaser, and Handshake across verification, AI Act compliance, cross-border Erasmus support, Italian academic context, and pricing for entry-level recruiting in Europe.',
  alternates: {
    canonical: 'https://www.in-transparency.com/en/compare/platforms',
    languages: {
      en: 'https://www.in-transparency.com/en/compare/platforms',
      it: 'https://www.in-transparency.com/it/compare/platforms',
      'x-default': 'https://www.in-transparency.com/en/compare/platforms',
    },
  },
  openGraph: {
    title: 'InTransparency vs JobTeaser vs Handshake',
    description: 'Honest comparison of EU entry-level recruiting platforms.',
    type: 'article',
    locale: 'en_US',
    alternateLocale: 'it_IT',
    siteName: 'InTransparency',
    images: [{ url: 'https://www.in-transparency.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InTransparency vs JobTeaser vs Handshake',
    description: 'Fact-by-fact comparison of EU entry-level recruiting platforms.',
    images: ['https://www.in-transparency.com/logo.png'],
  },
}

interface ComparisonRow {
  category: string
  feature: string
  it: 'yes' | 'partial' | 'no'
  jt: 'yes' | 'partial' | 'no'
  hs: 'yes' | 'partial' | 'no'
  detail?: string
}

const COMPARISON: ComparisonRow[] = [
  { category: 'Verification', feature: 'Skill verification via professor endorsement', it: 'yes', jt: 'no', hs: 'no', detail: 'Each endorsement tied to a specific project, per-competency ratings, signed.' },
  { category: 'Verification', feature: 'Supervisor evaluation from stage/tirocinio', it: 'yes', jt: 'no', hs: 'no' },
  { category: 'Verification', feature: 'Cryptographic Verifiable Credentials (W3C VC)', it: 'yes', jt: 'no', hs: 'no', detail: 'Ed25519Signature2020. Public key at /api/credentials/public-key.' },
  { category: 'Verification', feature: 'ESCO taxonomy alignment', it: 'yes', jt: 'partial', hs: 'no' },

  { category: 'EU AI Act', feature: 'Public algorithm registry (model cards)', it: 'yes', jt: 'no', hs: 'no', detail: '/algorithm-registry — full inputs, weights, excluded inputs per model.' },
  { category: 'EU AI Act', feature: 'Right to explanation endpoint', it: 'yes', jt: 'no', hs: 'no' },
  { category: 'EU AI Act', feature: 'Human oversight + override (Art. 14)', it: 'yes', jt: 'no', hs: 'no' },
  { category: 'EU AI Act', feature: 'Audit log for sensitive operations (Art. 12)', it: 'yes', jt: 'no', hs: 'no' },

  { category: 'Italian compliance', feature: 'ANVUR / INDIRE / PCTO awareness', it: 'yes', jt: 'no', hs: 'no' },
  { category: 'Italian compliance', feature: 'CCNL reference in stage conventions', it: 'yes', jt: 'no', hs: 'no' },
  { category: 'Italian compliance', feature: 'INAIL insurance tracking', it: 'yes', jt: 'no', hs: 'no' },
  { category: 'Italian compliance', feature: 'SPID / CIE authentication', it: 'partial', jt: 'no', hs: 'no', detail: 'AgID accreditation in progress.' },
  { category: 'Italian compliance', feature: 'Esse3 student record integration', it: 'partial', jt: 'no', hs: 'no' },

  { category: 'Cross-border', feature: 'Erasmus / bilateral exchange tracking', it: 'yes', jt: 'no', hs: 'no' },
  { category: 'Cross-border', feature: 'Host institution → home skill graph sync', it: 'yes', jt: 'no', hs: 'no' },
  { category: 'Cross-border', feature: 'Europass v3 export', it: 'yes', jt: 'partial', hs: 'no' },

  { category: 'Recruiting', feature: 'Company branded profiles', it: 'yes', jt: 'yes', hs: 'yes' },
  { category: 'Recruiting', feature: 'Talent matching / candidate search', it: 'yes', jt: 'yes', hs: 'yes' },
  { category: 'Recruiting', feature: 'Evidence-weighted match scoring', it: 'yes', jt: 'no', hs: 'no', detail: 'Verified skills weighted 1.0×, self-declared 0.6×. Advanced/Expert depth bonus.' },
  { category: 'Recruiting', feature: 'Exportable hiring evidence packet', it: 'yes', jt: 'partial', hs: 'partial' },

  { category: 'Universities', feature: 'Program-level skills gap analytics', it: 'yes', jt: 'no', hs: 'partial' },
  { category: 'Universities', feature: 'AI-assisted curriculum recommendations', it: 'yes', jt: 'no', hs: 'no' },
  { category: 'Universities', feature: 'Professor portal (no account required)', it: 'yes', jt: 'no', hs: 'no' },
  { category: 'Universities', feature: 'Free for universities', it: 'yes', jt: 'yes', hs: 'no', detail: 'Handshake charges universities $1K–$20K/year.' },

  { category: 'Privacy', feature: 'Self-service data export (GDPR Art. 20)', it: 'yes', jt: 'partial', hs: 'partial' },
  { category: 'Privacy', feature: 'Self-service account deletion (GDPR Art. 17)', it: 'yes', jt: 'partial', hs: 'partial' },
  { category: 'Privacy', feature: 'Cookie consent with per-category toggle', it: 'yes', jt: 'yes', hs: 'partial' },
]

function StatusIcon({ v }: { v: 'yes' | 'partial' | 'no' }) {
  if (v === 'yes') return <CheckCircle className="h-5 w-5 text-emerald-600" aria-label="Yes" />
  if (v === 'partial') return <MinusCircle className="h-5 w-5 text-amber-600" aria-label="Partial" />
  return <XCircle className="h-5 w-5 text-red-500" aria-label="No" />
}

export default function PlatformsComparePage() {
  const categories = Array.from(new Set(COMPARISON.map(r => r.category)))

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'InTransparency vs JobTeaser vs Handshake',
          datePublished: '2026-04-19',
          author: { '@type': 'Organization', name: 'InTransparency' },
          publisher: {
            '@type': 'Organization',
            name: 'InTransparency',
            logo: { '@type': 'ImageObject', url: 'https://www.in-transparency.com/logo.png' },
          },
          description:
            'Side-by-side comparison of InTransparency, JobTeaser, and Handshake across verification, AI Act compliance, cross-border Erasmus, Italian academic context, and pricing.',
          mainEntityOfPage: 'https://www.in-transparency.com/en/compare/platforms',
        }}
      />
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', url: '/' },
          { name: 'Compare', url: '/compare' },
          { name: 'Platforms', url: '/compare/platforms' },
        ])}
      />
      <Header />
      <main className="container max-w-5xl mx-auto px-4 pt-32 pb-16">
        <div className="mb-8">
          <Badge variant="outline" className="mb-2">Honest comparison</Badge>
          <h1 className="text-4xl font-bold mb-3">InTransparency vs JobTeaser vs Handshake</h1>
          <p className="text-lg text-muted-foreground">
            The three platforms universities and employers most often compare for entry-level hiring
            in Europe. Fact-by-fact, as of 2026-04-19. We mark where we&apos;re not a fit too —
            nothing hidden.
          </p>
        </div>

        <Card className="mb-8 bg-primary/5 border-primary/30">
          <CardContent className="pt-5 pb-5 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-semibold mb-1">TL;DR</h2>
              <p className="text-sm text-muted-foreground">
                <strong>JobTeaser</strong> is a polished EU job board with strong company branding.{' '}
                <strong>Handshake</strong> is the US network-effect leader with ATS integrations.{' '}
                <strong>InTransparency</strong> is the verified skill graph + AI Act-native matching
                platform — built for EU labor law, designed around evidence instead of self-declaration.
                Choose us if you want skills you can <em>trust</em> and a recruiting flow that&apos;s
                audit-trail compliant under the AI Act. Choose JobTeaser for a polished job board.
                Choose Handshake if you&apos;re in the US.
              </p>
            </div>
          </CardContent>
        </Card>

        {categories.map(cat => (
          <Card key={cat} className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{cat}</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-muted-foreground uppercase">
                    <th className="text-left pb-2 font-semibold">Feature</th>
                    <th className="pb-2 font-semibold">InTransparency</th>
                    <th className="pb-2 font-semibold">JobTeaser</th>
                    <th className="pb-2 font-semibold">Handshake</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.filter(r => r.category === cat).map((r, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="py-3 pr-4">
                        <div className="font-medium">{r.feature}</div>
                        {r.detail && (
                          <div className="text-xs text-muted-foreground mt-0.5">{r.detail}</div>
                        )}
                      </td>
                      <td className="text-center"><StatusIcon v={r.it} /></td>
                      <td className="text-center"><StatusIcon v={r.jt} /></td>
                      <td className="text-center"><StatusIcon v={r.hs} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        ))}

        <Card className="mt-8 bg-muted/30">
          <CardContent className="pt-5 pb-5 text-sm text-muted-foreground">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              How this comparison is kept honest
            </h3>
            <ul className="space-y-1 list-disc pl-5">
              <li>&quot;Yes&quot; means live and publicly documented. &quot;Partial&quot; means available in some markets or tiers. &quot;No&quot; means not available as of the date above.</li>
              <li>JobTeaser and Handshake claims are based on their public documentation. If we got something wrong, email info@in-transparency.com — we&apos;ll fix it within 48 hours.</li>
              <li>Our own &quot;Yes&quot; claims are backed by deployed endpoints. Verify at /algorithm-registry and /api/credentials/public-key.</li>
            </ul>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
