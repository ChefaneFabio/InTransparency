import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbList } from '@/lib/schema-org'
import type { Metadata } from 'next'
import {
  Landmark,
  ShieldCheck,
  MapPin,
  FileSignature,
  Lock,
  FileText,
  ArrowRight,
} from 'lucide-react'
import { Link } from '@/navigation'

/**
 * /en/for-public-sector — procurement-ready summary for EU ministries,
 * national agencies, regional authorities, and university consortia.
 *
 * Single page that addresses: data residency, EU sovereignty, DPIA
 * availability, conformity declarations, OJEU / TED suitability,
 * Italian PNRR alignment, GDPR DPO contact, and the concrete
 * attestations we can supply on request.
 */

export const metadata: Metadata = {
  title: 'For public sector — InTransparency procurement documentation',
  description:
    'Public-sector buyers: data residency, EU sovereignty, DPIA, conformity declarations, AI Act + GDPR compliance, OJEU-compatible documentation for InTransparency.',
  alternates: { canonical: 'https://www.in-transparency.com/en/for-public-sector' },
  openGraph: {
    title: 'For public sector — InTransparency',
    description: 'Procurement-ready documentation for EU ministries, agencies, and university consortia.',
    type: 'article',
    siteName: 'InTransparency',
  },
}

interface AttestationItem {
  label: string
  value: string
  detail?: string
}

const POSTURE: AttestationItem[] = [
  { label: 'Data residency', value: 'EU Central (Frankfurt)', detail: 'Neon Postgres hosted in the EU. No data leaves the EU for storage.' },
  { label: 'Processing jurisdiction', value: 'Italy / EU', detail: 'All processing operators subject to GDPR + Italian privacy law.' },
  { label: 'Data Protection Officer', value: 'Available on request', detail: 'Contact info@in-transparency.com for the current DPO assignment.' },
  { label: 'Sub-processors', value: 'Documented list', detail: 'Vercel (edge delivery), Neon (Postgres), Cloudflare R2 (file storage), Anthropic (LLM helpers). All EU-region, all GDPR DPA-bound.' },
  { label: 'Breach notification SLA', value: '≤ 72h', detail: 'GDPR Art. 33 timeline. Contractual commitment in our DPA.' },
  { label: 'Service Level', value: 'Best-effort public / 99.5% target', detail: 'Vercel edge + Neon autoscale. Enterprise SLAs available on request.' },
]

const DOCS: AttestationItem[] = [
  { label: 'DPIA', value: 'On request', detail: 'Data Protection Impact Assessment available under NDA. Summary on the privacy page.' },
  { label: 'ROPA', value: 'On request', detail: 'Records of Processing Activities per GDPR Art. 30.' },
  { label: 'DPA (Data Processing Agreement)', value: 'Standard template', detail: 'GDPR + SCC (Standard Contractual Clauses) for any non-EU sub-processor.' },
  { label: 'AI Act conformity declaration', value: 'Public algorithm registry', detail: 'See /algorithm-registry for every high-risk system documented per Annex III §4.' },
  { label: 'Security posture', value: 'SOC 2 Type I alignment', detail: 'Formal audit on 2026 H2 roadmap. Current posture documentation on request.' },
  { label: 'Accessibility (EAA 2025)', value: 'WCAG 2.2 AA target', detail: 'Formal audit scheduled; progressive improvements published per release.' },
  { label: 'PNRR (Italian recovery fund) alignment', value: 'Mission 4 eligible', detail: 'Higher-education digitalization components map to PNRR Mission 4 — Istruzione e Ricerca.' },
]

const PROCUREMENT: AttestationItem[] = [
  { label: 'TED / OJEU suitability', value: 'Compatible', detail: 'We accept standard EU public-procurement contract templates. EUR amounts invoiced ex-VAT from our Italian entity.' },
  { label: 'CPV codes', value: '72416000 / 80500000', detail: 'Application service providers / Training services — the codes most commonly used for platforms like ours.' },
  { label: 'Framework agreements', value: 'Available', detail: 'Multi-year framework + consumption-based pricing models on request.' },
  { label: 'Pilot terms', value: 'Free 30-day, no lock-in', detail: 'Universities pay nothing during pilot. No mandatory conversion.' },
]

function MatrixCard({ title, icon: Icon, items }: { title: string; icon: any; items: AttestationItem[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map(item => (
          <div key={item.label}>
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <span className="text-sm font-medium text-foreground">{item.label}</span>
              <span className="text-sm font-semibold text-primary">{item.value}</span>
            </div>
            {item.detail && <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default function PublicSectorPage() {
  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', url: '/' },
          { name: 'For public sector', url: '/for-public-sector' },
        ])}
      />
      <Header />
      <main className="container max-w-5xl mx-auto px-4 pt-32 pb-16">
        <div className="mb-8">
          <Badge variant="outline" className="mb-3 bg-primary/10 border-primary/30 text-primary">
            <Landmark className="h-3 w-3 mr-1" />
            For public sector
          </Badge>
          <h1 className="text-4xl font-bold mb-3">
            EU-ready procurement documentation
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            If you&apos;re buying for a ministry, a national agency, a regional authority, or a
            consortium of public universities — this page is what your procurement, legal, and
            privacy teams need. Everything is published in the open; anything you need under NDA
            we send on request within 5 working days.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-8">
          <MatrixCard title="Data posture" icon={MapPin} items={POSTURE} />
          <MatrixCard title="Documentation on request" icon={FileText} items={DOCS} />
        </div>

        <MatrixCard title="Procurement specifics" icon={FileSignature} items={PROCUREMENT} />

        <Card className="mt-8 bg-primary/5 border-primary/30">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              See also the EU compliance matrix
            </h2>
            <p className="text-sm text-muted-foreground mb-3">
              17 EU standards with deployed endpoints. Every row links to the API that proves the
              capability. Useful for technical annexes in public tenders.
            </p>
            <Button asChild>
              <Link href="/eu-compliance">
                Open EU compliance matrix
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-5">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              How to engage
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
              <li>
                Email{' '}
                <a href="mailto:info@in-transparency.com" className="text-primary hover:underline">
                  info@in-transparency.com
                </a>{' '}
                with your organisation + use case. We respond in ≤ 2 working days.
              </li>
              <li>
                We provide the DPA template, DPIA summary, sub-processor list, and conformity
                documents under NDA.
              </li>
              <li>
                Free 30-day pilot for universities. Procurement discussions only start when the
                institution confirms fit.
              </li>
              <li>
                For pan-European consortia (e.g. EUA, CESAER, league partnerships), we can scope
                multi-institution frameworks directly.
              </li>
            </ol>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
