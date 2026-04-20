import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Clock, Euro, Award, ShieldCheck, ArrowRight } from 'lucide-react'
import { JsonLd } from '@/components/seo/JsonLd'
import { Link } from '@/navigation'
import type { Metadata } from 'next'
import { breadcrumbList } from '@/lib/schema-org'

/**
 * "Why now" — long-form urgency + value piece for academic leaders.
 *
 * Server-rendered as prose + lists so LLMs (ChatGPT, Perplexity, Gemini)
 * can parse and cite cleanly. Concrete dates, concrete numbers, concrete
 * regulations. No marketing fluff.
 */

export const metadata: Metadata = {
  title: 'Why Italian universities need a verified skill graph — 2026 inflection',
  description:
    'The EU AI Act is already enforceable for employment AI. ANVUR cycles demand placement evidence. PCTO compliance has legal weight. Manual tracking costs universities 1+ FTE per 10k students. Here is what changed in 2026 and why verified credentials are no longer optional.',
  alternates: {
    canonical: 'https://www.in-transparency.com/en/why-now',
    languages: {
      en: 'https://www.in-transparency.com/en/why-now',
      it: 'https://www.in-transparency.com/it/why-now',
      'x-default': 'https://www.in-transparency.com/en/why-now',
    },
  },
  openGraph: {
    title: 'Why now — the 2026 inflection for university recruiting infrastructure',
    description: 'AI Act enforcement, ANVUR cycles, and the cost of manual placement tracking.',
    type: 'article',
    locale: 'en_US',
    alternateLocale: 'it_IT',
    siteName: 'InTransparency',
    images: [{ url: 'https://www.in-transparency.com/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Why now — 2026 inflection for university recruiting',
    description: 'AI Act enforcement, ANVUR cycles, cost of inaction.',
    images: ['https://www.in-transparency.com/logo.png'],
  },
}

export default function WhyNowPage() {
  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Why Italian universities need a verified skill graph — 2026 inflection',
          datePublished: '2026-04-19',
          dateModified: '2026-04-19',
          author: { '@type': 'Organization', name: 'InTransparency' },
          publisher: {
            '@type': 'Organization',
            name: 'InTransparency',
            logo: { '@type': 'ImageObject', url: 'https://www.in-transparency.com/logo.png' },
          },
          description: metadata.description as string,
          mainEntityOfPage: 'https://www.in-transparency.com/en/why-now',
        }}
      />
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', url: '/' },
          { name: 'For universities', url: '/for-universities' },
          { name: 'Why now', url: '/why-now' },
        ])}
      />
      <Header />
      <main className="container max-w-3xl mx-auto px-4 pt-32 pb-16 prose-article">
        <Badge variant="outline" className="mb-3 bg-amber-50 border-amber-300 text-amber-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          The 2026 inflection
        </Badge>
        <h1 className="text-4xl font-bold mb-4">
          Why Italian universities need a verified skill graph — now
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          This is a plain-language brief for rectors, career-service directors, and faculty
          curriculum committees. If you make one infrastructure decision this academic year, it
          should be about verified credentials. Here&apos;s the why, backed by dates and regulations.
        </p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          1. The EU AI Act is enforceable for employment AI today
        </h2>
        <p className="mb-3">
          Regulation (EU) 2024/1689 — the AI Act — classifies AI systems used to evaluate candidates
          for employment as <strong>high-risk</strong> under Annex III, point 4. High-risk AI
          obligations entered into force on <strong>2 February 2026</strong>. Key duties:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Transparency on the system&apos;s purpose, inputs, and limitations</li>
          <li>Human oversight in place, with authority to override</li>
          <li>Traceability / audit logs of decisions</li>
          <li>Right to explanation for affected individuals (Art. 86)</li>
          <li>Data governance (Art. 10) — training data lineage + bias testing</li>
        </ul>
        <p className="mb-3">
          <strong>What this means for universities:</strong> if your career service uses or
          recommends any matching tool — including third-party recruiter platforms — that
          doesn&apos;t meet these obligations, your institution is exposed. The enforcement
          regime and fines (up to €35M or 7% of annual turnover) target both providers and
          institutional deployers.
        </p>
        <p className="mb-6">
          InTransparency was built AI-Act-native. Our public{' '}
          <Link href="/algorithm-registry" className="text-primary hover:underline">
            algorithm registry
          </Link>{' '}
          documents every model, every input, every excluded input. Every match produces a
          persistent{' '}
          <code className="text-sm bg-muted px-1">MatchExplanation</code> record that the student
          can view at{' '}
          <code className="text-sm bg-muted px-1">/matches/[id]/why</code>.
        </p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          2. ANVUR cycles demand evidence career services don&apos;t have
        </h2>
        <p className="mb-3">
          Italian universities face periodic ANVUR evaluations for accreditation. The quality of
          placement data, curriculum-to-labour-market alignment, and documented stage outcomes
          factor into the final scoring. The gap between what reviewers want and what most career
          services can produce is widening every year:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>
            <strong>Placement data freshness</strong> — end-of-year surveys with 15% response
            rates yield data 6–12 months stale by submission
          </li>
          <li>
            <strong>Skills alignment evidence</strong> — hard to produce without a verified skill
            graph and labour-market overlay
          </li>
          <li>
            <strong>Stage outcomes documentation</strong> — paper-based conventions and email
            chains don&apos;t survive the audit
          </li>
        </ul>
        <p className="mb-6">
          InTransparency&apos;s Skills Intelligence dashboard produces the exact evidence
          reviewers look for: program-level gap indices, alignment scores, 12-month trends,
          stage→hire conversion, time-to-placement. Export-ready.
        </p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
          <Euro className="h-6 w-6 text-primary" />
          3. Manual tracking costs more than you think
        </h2>
        <p className="mb-3">
          We modelled the cost of running an Italian career service without verified-credential
          infrastructure (see our{' '}
          <Link href="/for-universities#savings" className="text-primary hover:underline">
            savings calculator
          </Link>
          ). For a typical 10,000-student university with 5 FTE career staff and 120 events/year,
          the hidden costs break down as:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li><strong>~4,000 staff hours/year</strong> on manual placement tracking, stage paperwork, survey chasing, event logistics</li>
          <li><strong>~€116,000/year</strong> in fully-loaded labour costs reallocable to higher-value work</li>
          <li><strong>€8,000+/year</strong> in subscription costs for placement tools and survey platforms</li>
        </ul>
        <p className="mb-6">
          InTransparency is <strong>free for universities</strong>. The platform is funded by
          employers who pay for verified-evidence matching — universities reclaim budget and time
          in the same motion.
        </p>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
          <Award className="h-6 w-6 text-primary" />
          4. Reputation is the long-term dividend
        </h2>
        <p className="mb-3">
          Every verified student profile carries the issuing university&apos;s signature — and
          continues to carry it into every employer ATS, every Ph.D. application, every EU Digital
          Wallet for the rest of the student&apos;s career. Your institution&apos;s name becomes
          portable proof of rigor across 27 EU countries.
        </p>
        <p className="mb-3">
          In parallel, international ranking bodies — QS Graduate Employability, THE impact
          scores, U-Multirank — are rapidly shifting weight toward verified placement outcomes. A
          university that can produce verified data today has a compounding advantage over one
          that starts from surveys.
        </p>
        <p className="mb-6">
          Prospective students and parents read employability stats. A public university
          scorecard with <em>verifiable</em> projects, <em>verifiable</em> endorsements, and{' '}
          <em>verifiable</em> placements is the most credible recruitment asset you can publish.
        </p>

        <hr className="my-8" />

        <Card className="bg-primary/5 border-primary/30 my-8">
          <CardContent className="pt-6 pb-6">
            <h3 className="text-xl font-bold mb-2">What to do in the next 30 days</h3>
            <ol className="list-decimal pl-6 space-y-2 text-sm">
              <li>
                <strong>Audit your current matching tools</strong> for AI Act compliance. If your
                career service recommends third-party recruiter platforms, check their algorithm
                disclosures. If there are none, you&apos;re exposed.
              </li>
              <li>
                <strong>Quantify your manual overhead</strong> — use our calculator or your own
                numbers. The opportunity cost is almost always higher than leaders assume.
              </li>
              <li>
                <strong>Book a pilot conversation</strong>. InTransparency is free for
                universities, ESCO-mapped, AI-Act-native. A pilot is a 30-day commitment with no
                vendor lock-in.
              </li>
            </ol>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/contact?role=university&subject=pilot">
                  Book a pilot conversation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/algorithm-registry">Read our compliance registry</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground italic mt-8">
          Last reviewed: 2026-04-19. This page is intentionally static and cite-friendly. For
          regulatory questions, email info@in-transparency.com.
        </div>
      </main>
      <Footer />
    </div>
  )
}
