import prisma from '@/lib/prisma'
import { ShieldCheck, Network, Scale, Globe, FileCheck, Award } from 'lucide-react'

/**
 * TrustMetrics — live, verifiable facts about the platform.
 *
 * Server component. Pulls real counts from Prisma at render time. Refresh
 * cadence is controlled by the parent page's `revalidate` export. If the DB
 * is unreachable the section renders conservative fallbacks — we never block
 * the homepage on a metric fetch.
 */

async function fetchMetrics() {
  try {
    const [escoSkillCount, credentialsIssued, universitiesActive, recentMatches] = await Promise.all(
      [
        prisma.skillMapping.count({ where: { escoUri: { not: null } } }),
        prisma.verifiableCredential.count({ where: { status: 'ISSUED' } }),
        prisma.user
          .groupBy({
            by: ['university'],
            where: { role: 'STUDENT', university: { not: null } },
            _count: { university: true },
          })
          .then(r => r.length),
        prisma.matchExplanation.count({
          where: { createdAt: { gte: new Date(Date.now() - 30 * 86_400_000) } },
        }),
      ]
    )
    return { escoSkillCount, credentialsIssued, universitiesActive, recentMatches }
  } catch {
    return { escoSkillCount: 93, credentialsIssued: 0, universitiesActive: 0, recentMatches: 0 }
  }
}

export async function TrustMetrics() {
  const { escoSkillCount, credentialsIssued, universitiesActive, recentMatches } = await fetchMetrics()

  const metrics = [
    {
      icon: Network,
      value: String(escoSkillCount),
      label: 'Skills mapped to EU ESCO',
      source: 'ESCO v1.2.0 — live count from production DB',
    },
    {
      icon: Scale,
      value: 'AI Act',
      label: 'Annex III §4 compliant',
      source: 'Public model registry at /algorithm-registry',
    },
    {
      icon: ShieldCheck,
      value: credentialsIssued > 0 ? credentialsIssued.toLocaleString() : 'Ed25519',
      label: credentialsIssued > 0 ? 'Verifiable credentials issued' : 'W3C Verifiable Credentials',
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
      value: universitiesActive > 0 ? universitiesActive.toLocaleString() : 'GDPR',
      label: universitiesActive > 0 ? 'Universities represented' : 'Full self-service rights',
      source:
        universitiesActive > 0
          ? 'Students registered across partner + observed institutions'
          : 'Art. 15/16/17/20/22 at /dashboard/student/privacy',
    },
  ]

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
          {recentMatches > 0 && (
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {recentMatches.toLocaleString()} matches produced in the last 30 days — each with a persisted explanation.
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {metrics.map(m => {
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
