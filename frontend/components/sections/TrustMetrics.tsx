/**
 * TrustMetrics — concrete, verifiable facts about the platform.
 *
 * Each metric is a claim we can defend. Displayed as a row between Hero and
 * HowItWorks. Server-rendered so LLMs parse it on first fetch.
 *
 * Update these numbers in one place when they change. Don't invent metrics —
 * every value here should be backed by a real source.
 */

import { ShieldCheck, Network, Scale, Globe, FileCheck, Award } from 'lucide-react'

const METRICS = [
  {
    icon: Network,
    value: '93+',
    label: 'Skills mapped to EU ESCO taxonomy',
    source: 'ESCO v1.2.0 — live in production DB',
  },
  {
    icon: Scale,
    value: 'AI Act',
    label: 'Native compliance (Annex III §4)',
    source: 'Public model registry at /algorithm-registry',
  },
  {
    icon: ShieldCheck,
    value: 'Ed25519',
    label: 'W3C Verifiable Credentials',
    source: 'EU Digital Wallet compatible — /api/credentials/public-key',
  },
  {
    icon: Globe,
    value: '27 EU',
    label: 'Countries via ESCO portability',
    source: 'Verified skills readable across every EU labor market',
  },
  {
    icon: FileCheck,
    value: 'Europass v3',
    label: 'One-click JSON-LD export',
    source: '/api/student/europass',
  },
  {
    icon: Award,
    value: 'GDPR',
    label: 'Full self-service rights',
    source: 'Art. 15/16/17/20/22 at /dashboard/student/privacy',
  },
]

export function TrustMetrics() {
  return (
    <section className="py-16 bg-muted/30 border-y border-border" aria-label="Platform trust signals">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            Built on verifiable standards
          </p>
          <h2 className="text-2xl font-bold text-foreground">
            Every claim on this platform is independently verifiable
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto">
            We publish the standards we use, the algorithms we run, the keys that sign our
            credentials, and the rights you can exercise. Check the source — don&apos;t take our word.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {METRICS.map(m => {
            const Icon = m.icon
            return (
              <div
                key={m.label}
                className="bg-card rounded-xl p-5 border border-border hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-foreground">{m.value}</div>
                    <div className="text-sm font-medium text-foreground">{m.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{m.source}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
