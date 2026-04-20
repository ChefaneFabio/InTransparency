import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbList, service } from '@/lib/schema-org'
import type { Metadata } from 'next'
import {
  Building2,
  Shield,
  Users,
  Zap,
  FileCheck,
  Workflow,
  ArrowRight,
  Lock,
} from 'lucide-react'
import { Link } from '@/navigation'

/**
 * /en/for-enterprise — for companies 200+ employees.
 *
 * Positioning: we don't replace your ATS. We become the verified-skill
 * layer that feeds it. Different conversation from SME (replacement) or
 * startup (first tool).
 */

export const metadata: Metadata = {
  title: 'For enterprise — verified skill layer for your existing ATS',
  description:
    'Enterprises don\'t need another ATS. You need verified candidate data feeding the ATS you already run. InTransparency integrates with Greenhouse, Lever, Workday via webhooks; exposes an agent API for your internal AI tools; and comes with the procurement documentation your legal team wants.',
  alternates: { canonical: 'https://www.in-transparency.com/en/for-enterprise' },
  openGraph: {
    title: 'For enterprise — verified skill layer for your ATS',
    description: 'Feed your Greenhouse/Lever/Workday with evidence-backed candidates.',
    type: 'article',
    siteName: 'InTransparency',
  },
}

interface Capability {
  title: string
  description: string
  icon: any
  concrete: string
  endpoint?: string
}

const CAPABILITIES: Capability[] = [
  {
    title: 'ATS integration, not replacement',
    description:
      'We feed verified candidates into the ATS you already run — Greenhouse, Lever, Workday, Recruitee, SmartRecruiters. Webhooks push shortlists as applications; evidence packets attach as candidate notes.',
    concrete: 'Webhook events: match.created, credential.issued, stage.completed.',
    endpoint: '/en/integrations/agents',
    icon: Workflow,
  },
  {
    title: 'Your internal AI can call us as a tool',
    description:
      'Running a Claude-powered recruiting copilot in-house? Import our OpenAPI spec into your agent framework. Every candidate lookup returns verified evidence your copilot can cite.',
    concrete: 'MCP + OpenAPI 3.1 + scoped API keys. Read, watchlist, webhook, write scopes.',
    endpoint: '/openapi.yaml',
    icon: Zap,
  },
  {
    title: 'EU sovereignty + data residency',
    description:
      'All storage in EU Central. GDPR-compliant sub-processors (Vercel, Neon, Cloudflare R2). DPIA + DPA available on request. Your data never leaves the EU.',
    concrete: 'Full compliance matrix at /en/eu-compliance — 17 standards with deployed endpoints.',
    endpoint: '/en/eu-compliance',
    icon: Shield,
  },
  {
    title: 'AI Act responsibility shift',
    description:
      'Running candidate-evaluation AI internally makes YOU the high-risk-AI deployer (Annex III §4). Route those decisions through InTransparency and we\'re the registered provider — your compliance burden drops.',
    concrete: 'Public algorithm registry, human oversight endpoint, audit log, bias tests on record.',
    endpoint: '/en/algorithm-registry',
    icon: FileCheck,
  },
  {
    title: 'Team seats with role controls',
    description:
      'Admins invite recruiters, scope access, enforce the seat limit on your plan. Audit log tracks every sensitive action. Disable accounts without losing history.',
    concrete: 'Organization model supports billing tier, seat limit, owner role, admin delegation.',
    icon: Users,
  },
  {
    title: 'SSO + eIDAS 2.0 identity',
    description:
      'Italian enterprises: SPID/CIE integration for employee SSO. Pan-European: eIDAS 2.0 node support on roadmap. SAML 2.0 for generic IdP federations.',
    concrete: 'SPID metadata at /api/auth/spid/metadata. Enterprise SSO on request.',
    icon: Lock,
  },
]

export default function ForEnterprisePage() {
  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', url: '/' },
          { name: 'For enterprise', url: '/for-enterprise' },
        ])}
      />
      <JsonLd
        data={service({
          name: 'InTransparency for Enterprise',
          description:
            'Verified candidate data layer that feeds existing ATS systems. EU-sovereignty, AI Act-native, agent-callable.',
          audience: 'Employers',
          url: '/en/for-enterprise',
        })}
      />
      <Header />
      <main className="container max-w-5xl mx-auto px-4 pt-32 pb-16">
        <div className="mb-10">
          <Badge variant="outline" className="mb-3">
            <Building2 className="h-3 w-3 mr-1" />
            For enterprise (200+ employees)
          </Badge>
          <h1 className="text-4xl font-bold mb-3">
            You don&apos;t need another ATS. You need verified data feeding the ATS you already run.
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            InTransparency is the verified-skill layer for European higher education. We don&apos;t
            compete with Greenhouse, Lever, or Workday — we feed them. Every candidate we send
            your pipeline comes with cryptographic evidence, AI Act-compliant explanations, and
            audit-ready provenance. Your recruiters work in the tools they already know; your
            compliance officers get documents they can actually use.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {CAPABILITIES.map(c => {
            const Icon = c.icon
            return (
              <Card key={c.title} className="hover:border-primary/40 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    {c.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{c.description}</p>
                  <p className="text-xs text-foreground/80 mb-2">
                    <span className="font-semibold">What that means in practice:</span> {c.concrete}
                  </p>
                  {c.endpoint && (
                    <a
                      href={c.endpoint}
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                    >
                      See it
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="mb-6 bg-primary/5 border-primary/30">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-lg font-semibold mb-2">How an enterprise deal typically works</h2>
            <ol className="list-decimal pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>
                Procurement sends us their standard vendor questionnaire. We return it with our{' '}
                <Link href="/for-public-sector" className="text-primary hover:underline">
                  procurement page
                </Link>{' '}
                attached plus any gap answers.
              </li>
              <li>
                IT/security reviews our{' '}
                <Link href="/eu-compliance" className="text-primary hover:underline">
                  compliance matrix
                </Link>{' '}
                (17 EU standards with deployed endpoints) and the sub-processor list.
              </li>
              <li>
                We scope the ATS integration — typically Greenhouse / Lever / Workday webhooks.
                InTransparency pushes shortlists; your ATS owns the candidate record from there.
              </li>
              <li>
                30-day technical pilot: free for up to 5 recruiter seats. At the end, you decide
                whether the verified-skill layer actually lifted quality of hire.
              </li>
              <li>
                Multi-year framework agreement if you want it. Per-seat or consumption-based
                pricing — your choice.
              </li>
            </ol>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <Link href="/contact?role=enterprise&subject=pilot">
              Request enterprise pilot
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/integrations/agents">See agent integration guide</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/eu-compliance">EU compliance matrix</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
