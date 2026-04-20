import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbList } from '@/lib/schema-org'
import type { Metadata } from 'next'
import { ShieldCheck, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react'

/**
 * EU compliance matrix — every European standard we speak, status per standard,
 * and the concrete surface where each is implemented.
 *
 * This is the page institutional procurement officers ask for.
 */

export const metadata: Metadata = {
  title: 'EU compliance matrix — every European standard InTransparency speaks',
  description:
    'Our compliance posture across EU standards: AI Act, GDPR, ESCO, Europass, EDCI, eIDAS 2.0, Bologna Process, DigComp, EntreComp, GreenComp, Open Badges 3.0, Erasmus+ OLA. Each entry links to the deployed endpoint.',
  alternates: {
    canonical: 'https://www.in-transparency.com/en/eu-compliance',
  },
  openGraph: {
    title: 'EU compliance matrix — InTransparency',
    description: 'The single page procurement officers request. Every EU standard we speak, status, and endpoint.',
    type: 'article',
    siteName: 'InTransparency',
  },
}

type Status = 'live' | 'partial' | 'planned'

interface Standard {
  name: string
  version?: string
  category: 'Regulation' | 'Skills & credentials' | 'Identity' | 'Recognition' | 'AI governance'
  issuer: string
  status: Status
  statusNote?: string
  whatWeDo: string
  endpoint?: string
  reference: string
}

const STANDARDS: Standard[] = [
  // Regulation
  {
    name: 'EU AI Act',
    version: 'Regulation 2024/1689',
    category: 'Regulation',
    issuer: 'European Commission',
    status: 'live',
    whatWeDo:
      'Our matching systems are classified as high-risk (Annex III §4). We publish a machine-readable algorithm registry, persist every match explanation, expose a right-to-explanation endpoint, keep an immutable audit log of sensitive operations, and run monthly bias tests.',
    endpoint: 'https://www.in-transparency.com/en/algorithm-registry',
    reference: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj',
  },
  {
    name: 'GDPR',
    version: 'Regulation 2016/679',
    category: 'Regulation',
    issuer: 'European Commission',
    status: 'live',
    whatWeDo:
      'Self-service exposure of Art. 15/16/17/20/22 rights. Per-category cookie consent (ePrivacy-aligned). Data residency in EU Central (Neon Postgres).',
    endpoint: 'https://www.in-transparency.com/en/dashboard/student/privacy',
    reference: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj',
  },

  // Skills & credentials
  {
    name: 'ESCO',
    version: 'v1.2.0',
    category: 'Skills & credentials',
    issuer: 'European Commission (DG EMPL)',
    status: 'live',
    whatWeDo:
      '93 curated skills mapped to ESCO URIs, live API fallback for unmapped terms, all cached in our SkillMapping table. All matching scores surface ESCO URIs for cross-border portability.',
    endpoint: 'https://www.in-transparency.com/api/agents/esco/python',
    reference: 'https://esco.ec.europa.eu/',
  },
  {
    name: 'Europass',
    version: 'v3',
    category: 'Skills & credentials',
    issuer: 'European Commission (DG EAC) / CEDEFOP',
    status: 'live',
    whatWeDo: 'Students export their verified profile as Europass v3 JSON-LD with a single click.',
    endpoint: 'https://www.in-transparency.com/api/student/europass',
    reference: 'https://europass.europa.eu/en',
  },
  {
    name: 'EDCI — European Digital Credentials for Learning',
    category: 'Skills & credentials',
    issuer: 'European Commission / Europass',
    status: 'live',
    whatWeDo: 'Every Verifiable Credential we issue is exportable in EDCI JSON-LD format with EQF level annotation, ISCED-F code, and Ed25519 proof preserved.',
    endpoint: 'https://www.in-transparency.com/api/credentials/{id}/edci',
    reference: 'https://europa.eu/europass/en/europass-digital-credentials-learning',
  },
  {
    name: 'W3C Verifiable Credentials',
    version: 'Data Model 1.1',
    category: 'Skills & credentials',
    issuer: 'W3C',
    status: 'live',
    whatWeDo: 'All credentials cryptographically signed with Ed25519Signature2020. Public key published for offline verification.',
    endpoint: 'https://www.in-transparency.com/api/credentials/public-key',
    reference: 'https://www.w3.org/TR/vc-data-model/',
  },
  {
    name: 'Open Badges / IMS Global',
    version: '3.0',
    category: 'Skills & credentials',
    issuer: 'IMS Global / 1EdTech',
    status: 'live',
    whatWeDo: 'Students export their Advanced/Expert verified skills as Open Badges 3.0 credentials — ingestible by Credly, Accredible, Badgr, Digital Promise, every LMS that speaks OB 3.0.',
    endpoint: 'https://www.in-transparency.com/api/student/open-badges',
    reference: 'https://www.imsglobal.org/spec/ob/v3p0/',
  },
  {
    name: 'DigComp',
    version: '2.2',
    category: 'Skills & credentials',
    issuer: 'JRC — EU Joint Research Centre',
    status: 'live',
    whatWeDo: '21 digital-competence references in our framework catalog. Relevant platform skills tagged with DigComp URIs.',
    endpoint: 'https://www.in-transparency.com/api/agents/frameworks',
    reference: 'https://joint-research-centre.ec.europa.eu/digcomp_en',
  },
  {
    name: 'EntreComp',
    version: '1.0',
    category: 'Skills & credentials',
    issuer: 'JRC — EU Joint Research Centre',
    status: 'live',
    whatWeDo: '15 entrepreneurship competences mapped into the same framework catalog.',
    endpoint: 'https://www.in-transparency.com/api/agents/frameworks',
    reference: 'https://joint-research-centre.ec.europa.eu/entrecomp_en',
  },
  {
    name: 'GreenComp',
    version: '1.0',
    category: 'Skills & credentials',
    issuer: 'JRC — EU Joint Research Centre',
    status: 'live',
    whatWeDo: '12 sustainability competences mapped alongside DigComp and EntreComp.',
    endpoint: 'https://www.in-transparency.com/api/agents/frameworks',
    reference: 'https://joint-research-centre.ec.europa.eu/greencomp_en',
  },
  {
    name: 'EQF — European Qualifications Framework',
    category: 'Skills & credentials',
    issuer: 'European Commission',
    status: 'live',
    whatWeDo: 'Our EDCI exports include EQF levels 3-6 for achievements based on proficiency + context.',
    reference: 'https://europa.eu/europass/en/europass-tools/european-qualifications-framework',
  },

  // Identity
  {
    name: 'eIDAS 2.0',
    version: 'Regulation 2024/1183',
    category: 'Identity',
    issuer: 'European Commission',
    status: 'partial',
    statusNote: 'Italian SPID/CIE node integrated at scaffold level, AgID accreditation in progress.',
    whatWeDo: 'SPID/CIE metadata endpoint published. Full SAML 2.0 auth flow pending AgID review.',
    endpoint: 'https://www.in-transparency.com/api/auth/spid/metadata',
    reference: 'https://ec.europa.eu/digital-building-blocks/sites/display/EUDIGITALIDENTITYWALLET/Home',
  },
  {
    name: 'EU Digital Identity Wallet (EUDIW)',
    category: 'Identity',
    issuer: 'European Commission',
    status: 'planned',
    statusNote: 'Credentials are EDCI-ready today. Wallet integration ships when reference implementations reach public beta.',
    whatWeDo:
      'Our EDCI + W3C VC credentials are consumable by EUDIW-compatible wallets once the reference implementation stabilizes in 2026.',
    reference: 'https://ec.europa.eu/digital-building-blocks/sites/display/EUDIGITALIDENTITYWALLET/Home',
  },

  // Recognition
  {
    name: 'Bologna Process (ECTS)',
    category: 'Recognition',
    issuer: 'EHEA — European Higher Education Area',
    status: 'live',
    whatWeDo: 'Grade normalization across EU academic systems. ECTS credit alignment captured per CourseEquivalency record in partnerships.',
    reference: 'https://ehea.info/',
  },
  {
    name: 'Erasmus+ Online Learning Agreement (OLA)',
    category: 'Recognition',
    issuer: 'European Commission (DG EAC)',
    status: 'live',
    whatWeDo: 'Exchange enrollments exportable in OLA JSON-LD. Production EWP (Erasmus Without Paper) network integration requires per-institution SAML onboarding.',
    endpoint: 'https://www.in-transparency.com/api/dashboard/university/exchanges/{id}/ola',
    reference: 'https://www.learning-agreement.eu/',
  },
  {
    name: 'EWP — Erasmus Without Paper',
    category: 'Recognition',
    issuer: 'European Commission / University ERASMUS Network',
    status: 'partial',
    statusNote: 'OLA JSON-LD shape is EWP-compatible; per-institution endpoint registration on request.',
    whatWeDo: 'InstitutionPartnership model stores EWP-compatible bilateral agreements.',
    reference: 'https://www.erasmuswithoutpaper.eu/',
  },
  {
    name: 'ENIC-NARIC',
    category: 'Recognition',
    issuer: 'ENIC-NARIC Networks',
    status: 'planned',
    statusNote: 'Roadmap: our verified credentials align with ENIC-NARIC\'s digital-first recognition guidance.',
    whatWeDo:
      'Platform architecture supports the digital-credential workflows ENIC-NARIC advocates. No direct integration yet.',
    reference: 'https://www.enic-naric.net/',
  },

  // AI governance
  {
    name: 'ISO/IEC 42001 — AI management systems',
    category: 'AI governance',
    issuer: 'ISO / IEC',
    status: 'planned',
    statusNote: 'Our architecture is 42001-ready; formal certification is a 2026 H2 target.',
    whatWeDo: 'Audit log, algorithm registry, human oversight, data governance, bias testing — all implemented per 42001 control families.',
    reference: 'https://www.iso.org/standard/81230.html',
  },
]

function StatusBadge({ status, note }: { status: Status; note?: string }) {
  if (status === 'live')
    return (
      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-100" title={note}>
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Live
      </Badge>
    )
  if (status === 'partial')
    return (
      <Badge className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-100" title={note}>
        <AlertCircle className="h-3 w-3 mr-1" />
        Partial
      </Badge>
    )
  return (
    <Badge variant="outline" className="text-muted-foreground" title={note}>
      Planned
    </Badge>
  )
}

export default function EuCompliancePage() {
  const categories: Standard['category'][] = [
    'Regulation',
    'AI governance',
    'Skills & credentials',
    'Identity',
    'Recognition',
  ]

  const liveCount = STANDARDS.filter(s => s.status === 'live').length
  const partialCount = STANDARDS.filter(s => s.status === 'partial').length
  const plannedCount = STANDARDS.filter(s => s.status === 'planned').length

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', url: '/' },
          { name: 'EU compliance', url: '/eu-compliance' },
        ])}
      />
      <Header />
      <main className="container max-w-5xl mx-auto px-4 pt-32 pb-16">
        <div className="mb-8">
          <Badge variant="outline" className="mb-3 bg-primary/10 border-primary/30 text-primary">
            <ShieldCheck className="h-3 w-3 mr-1" />
            EU compliance matrix
          </Badge>
          <h1 className="text-4xl font-bold mb-3">Every European standard we speak</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            No competitor in this category speaks every relevant EU standard. We do — and we expose
            the endpoint behind each one. This is the single page procurement officers ask for,
            rectors share with their legal departments, and agents use to verify that our
            conformity claims are backed by deployed code.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3 max-w-md">
            <Card>
              <CardContent className="pt-5 pb-5">
                <div className="text-3xl font-bold text-emerald-600">{liveCount}</div>
                <div className="text-xs text-muted-foreground">Live</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-5">
                <div className="text-3xl font-bold text-amber-600">{partialCount}</div>
                <div className="text-xs text-muted-foreground">Partial</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-5">
                <div className="text-3xl font-bold text-muted-foreground">{plannedCount}</div>
                <div className="text-xs text-muted-foreground">Planned</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {categories.map(cat => (
          <div key={cat} className="mb-10">
            <h2 className="text-2xl font-bold mb-4">{cat}</h2>
            <div className="space-y-3">
              {STANDARDS.filter(s => s.category === cat).map(s => (
                <Card key={s.name}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                          {s.name}
                          {s.version && (
                            <Badge variant="secondary" className="text-xs font-normal">
                              {s.version}
                            </Badge>
                          )}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">Issued by {s.issuer}</p>
                      </div>
                      <StatusBadge status={s.status} note={s.statusNote} />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3">{s.whatWeDo}</p>
                    {s.statusNote && s.status !== 'live' && (
                      <p className="text-xs text-amber-700 mb-3">
                        <AlertCircle className="h-3 w-3 inline mr-1" />
                        {s.statusNote}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 text-xs">
                      {s.endpoint && (
                        <a
                          href={s.endpoint}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline font-mono"
                        >
                          Endpoint
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      <a
                        href={s.reference}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary"
                      >
                        Official reference
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        <Card className="mt-8 bg-primary/5 border-primary/30">
          <CardContent className="pt-5 pb-5 text-sm text-muted-foreground">
            <p className="mb-2 font-semibold text-foreground">For procurement</p>
            <p>
              If you&apos;re a public-sector buyer (EU ministry, national agency, university
              consortium), see our{' '}
              <a href="/en/for-public-sector" className="text-primary hover:underline">
                procurement page
              </a>{' '}
              for data-residency, DPIA, and conformity declaration templates. Email{' '}
              <a href="mailto:info@in-transparency.com" className="text-primary hover:underline">
                info@in-transparency.com
              </a>{' '}
              for formal conformity attestation requests.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
