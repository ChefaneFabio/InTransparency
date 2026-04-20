import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbList } from '@/lib/schema-org'
import type { Metadata } from 'next'
import { ShieldCheck, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

/**
 * EU compliance matrix — every European standard we speak, status per standard,
 * and the concrete surface where each is implemented.
 *
 * This is the page institutional procurement officers ask for.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'euCompliance' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: 'https://www.in-transparency.com/en/eu-compliance',
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      type: 'article',
      siteName: 'InTransparency',
    },
  }
}

type Status = 'live' | 'partial' | 'planned'
type Category = 'Regulation' | 'Skills & credentials' | 'Identity' | 'Recognition' | 'AI governance'
type CategoryKey = 'regulation' | 'skillsCredentials' | 'identity' | 'recognition' | 'aiGovernance'

interface Standard {
  key: string
  name: string
  version?: string
  categoryKey: CategoryKey
  issuerKey: string
  status: Status
  hasStatusNote?: boolean
  endpoint?: string
  reference: string
}

const STANDARDS: Standard[] = [
  // Regulation
  {
    key: 'aiAct',
    name: 'EU AI Act',
    version: 'Regulation 2024/1689',
    categoryKey: 'regulation',
    issuerKey: 'europeanCommission',
    status: 'live',
    endpoint: 'https://www.in-transparency.com/en/algorithm-registry',
    reference: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj',
  },
  {
    key: 'gdpr',
    name: 'GDPR',
    version: 'Regulation 2016/679',
    categoryKey: 'regulation',
    issuerKey: 'europeanCommission',
    status: 'live',
    endpoint: 'https://www.in-transparency.com/en/dashboard/student/privacy',
    reference: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj',
  },

  // Skills & credentials
  {
    key: 'esco',
    name: 'ESCO',
    version: 'v1.2.0',
    categoryKey: 'skillsCredentials',
    issuerKey: 'ecDgEmpl',
    status: 'live',
    endpoint: 'https://www.in-transparency.com/api/agents/esco/python',
    reference: 'https://esco.ec.europa.eu/',
  },
  {
    key: 'europass',
    name: 'Europass',
    version: 'v3',
    categoryKey: 'skillsCredentials',
    issuerKey: 'ecDgEacCedefop',
    status: 'live',
    endpoint: 'https://www.in-transparency.com/api/student/europass',
    reference: 'https://europass.europa.eu/en',
  },
  {
    key: 'edci',
    name: 'EDCI',
    categoryKey: 'skillsCredentials',
    issuerKey: 'ecEuropass',
    status: 'live',
    endpoint: 'https://www.in-transparency.com/api/credentials/{id}/edci',
    reference: 'https://europa.eu/europass/en/europass-digital-credentials-learning',
  },
  {
    key: 'w3cVc',
    name: 'W3C Verifiable Credentials',
    version: 'Data Model 1.1',
    categoryKey: 'skillsCredentials',
    issuerKey: 'w3c',
    status: 'live',
    endpoint: 'https://www.in-transparency.com/api/credentials/public-key',
    reference: 'https://www.w3.org/TR/vc-data-model/',
  },
  {
    key: 'openBadges',
    name: 'Open Badges / IMS Global',
    version: '3.0',
    categoryKey: 'skillsCredentials',
    issuerKey: 'imsGlobal',
    status: 'live',
    endpoint: 'https://www.in-transparency.com/api/student/open-badges',
    reference: 'https://www.imsglobal.org/spec/ob/v3p0/',
  },
  {
    key: 'digComp',
    name: 'DigComp',
    version: '2.2',
    categoryKey: 'skillsCredentials',
    issuerKey: 'jrc',
    status: 'live',
    endpoint: 'https://www.in-transparency.com/api/agents/frameworks',
    reference: 'https://joint-research-centre.ec.europa.eu/digcomp_en',
  },
  {
    key: 'entreComp',
    name: 'EntreComp',
    version: '1.0',
    categoryKey: 'skillsCredentials',
    issuerKey: 'jrc',
    status: 'live',
    endpoint: 'https://www.in-transparency.com/api/agents/frameworks',
    reference: 'https://joint-research-centre.ec.europa.eu/entrecomp_en',
  },
  {
    key: 'greenComp',
    name: 'GreenComp',
    version: '1.0',
    categoryKey: 'skillsCredentials',
    issuerKey: 'jrc',
    status: 'live',
    endpoint: 'https://www.in-transparency.com/api/agents/frameworks',
    reference: 'https://joint-research-centre.ec.europa.eu/greencomp_en',
  },
  {
    key: 'eqf',
    name: 'EQF',
    categoryKey: 'skillsCredentials',
    issuerKey: 'europeanCommission',
    status: 'live',
    reference: 'https://europa.eu/europass/en/europass-tools/european-qualifications-framework',
  },

  // Identity
  {
    key: 'eidas2',
    name: 'eIDAS 2.0',
    version: 'Regulation 2024/1183',
    categoryKey: 'identity',
    issuerKey: 'europeanCommission',
    status: 'partial',
    hasStatusNote: true,
    endpoint: 'https://www.in-transparency.com/api/auth/spid/metadata',
    reference: 'https://ec.europa.eu/digital-building-blocks/sites/display/EUDIGITALIDENTITYWALLET/Home',
  },
  {
    key: 'eudiw',
    name: 'EU Digital Identity Wallet (EUDIW)',
    categoryKey: 'identity',
    issuerKey: 'europeanCommission',
    status: 'planned',
    hasStatusNote: true,
    reference: 'https://ec.europa.eu/digital-building-blocks/sites/display/EUDIGITALIDENTITYWALLET/Home',
  },

  // Recognition
  {
    key: 'bologna',
    name: 'Bologna Process (ECTS)',
    categoryKey: 'recognition',
    issuerKey: 'ehea',
    status: 'live',
    reference: 'https://ehea.info/',
  },
  {
    key: 'ola',
    name: 'Erasmus+ Online Learning Agreement (OLA)',
    categoryKey: 'recognition',
    issuerKey: 'ecDgEac',
    status: 'live',
    endpoint: 'https://www.in-transparency.com/api/dashboard/university/exchanges/{id}/ola',
    reference: 'https://www.learning-agreement.eu/',
  },
  {
    key: 'ewp',
    name: 'EWP — Erasmus Without Paper',
    categoryKey: 'recognition',
    issuerKey: 'ecErasmus',
    status: 'partial',
    hasStatusNote: true,
    reference: 'https://www.erasmuswithoutpaper.eu/',
  },
  {
    key: 'enicNaric',
    name: 'ENIC-NARIC',
    categoryKey: 'recognition',
    issuerKey: 'enicNaric',
    status: 'planned',
    hasStatusNote: true,
    reference: 'https://www.enic-naric.net/',
  },

  // AI governance
  {
    key: 'iso42001',
    name: 'ISO/IEC 42001',
    categoryKey: 'aiGovernance',
    issuerKey: 'isoIec',
    status: 'planned',
    hasStatusNote: true,
    reference: 'https://www.iso.org/standard/81230.html',
  },
]

function StatusBadge({
  status,
  note,
  labels,
}: {
  status: Status
  note?: string
  labels: { live: string; partial: string; planned: string }
}) {
  if (status === 'live')
    return (
      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-100" title={note}>
        <CheckCircle2 className="h-3 w-3 mr-1" />
        {labels.live}
      </Badge>
    )
  if (status === 'partial')
    return (
      <Badge className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-100" title={note}>
        <AlertCircle className="h-3 w-3 mr-1" />
        {labels.partial}
      </Badge>
    )
  return (
    <Badge variant="outline" className="text-muted-foreground" title={note}>
      {labels.planned}
    </Badge>
  )
}

export default async function EuCompliancePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'euCompliance' })

  const categories: CategoryKey[] = [
    'regulation',
    'aiGovernance',
    'skillsCredentials',
    'identity',
    'recognition',
  ]

  const liveCount = STANDARDS.filter(s => s.status === 'live').length
  const partialCount = STANDARDS.filter(s => s.status === 'partial').length
  const plannedCount = STANDARDS.filter(s => s.status === 'planned').length

  const statusLabels = {
    live: t('status.live'),
    partial: t('status.partial'),
    planned: t('status.planned'),
  }

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={breadcrumbList([
          { name: t('breadcrumb.home'), url: '/' },
          { name: t('breadcrumb.euCompliance'), url: '/eu-compliance' },
        ])}
      />
      <Header />
      <main className="container max-w-5xl mx-auto px-4 pt-32 pb-16">
        <div className="mb-8">
          <Badge variant="outline" className="mb-3 bg-primary/10 border-primary/30 text-primary">
            <ShieldCheck className="h-3 w-3 mr-1" />
            {t('badge')}
          </Badge>
          <h1 className="text-4xl font-bold mb-3">{t('h1')}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {t('intro')}
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3 max-w-md">
            <Card>
              <CardContent className="pt-5 pb-5">
                <div className="text-3xl font-bold text-emerald-600">{liveCount}</div>
                <div className="text-xs text-muted-foreground">{t('status.live')}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-5">
                <div className="text-3xl font-bold text-amber-600">{partialCount}</div>
                <div className="text-xs text-muted-foreground">{t('status.partial')}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-5">
                <div className="text-3xl font-bold text-muted-foreground">{plannedCount}</div>
                <div className="text-xs text-muted-foreground">{t('status.planned')}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {categories.map(cat => (
          <div key={cat} className="mb-10">
            <h2 className="text-2xl font-bold mb-4">{t(`categories.${cat}`)}</h2>
            <div className="space-y-3">
              {STANDARDS.filter(s => s.categoryKey === cat).map(s => {
                const statusNote = s.hasStatusNote ? t(`standards.${s.key}.statusNote`) : undefined
                return (
                  <Card key={s.key}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                            {t(`standards.${s.key}.name`)}
                            {s.version && (
                              <Badge variant="secondary" className="text-xs font-normal">
                                {s.version}
                              </Badge>
                            )}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground mt-1">
                            {t('issuedBy', { issuer: t(`issuers.${s.issuerKey}`) })}
                          </p>
                        </div>
                        <StatusBadge status={s.status} note={statusNote} labels={statusLabels} />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">{t(`standards.${s.key}.whatWeDo`)}</p>
                      {statusNote && s.status !== 'live' && (
                        <p className="text-xs text-amber-700 mb-3">
                          <AlertCircle className="h-3 w-3 inline mr-1" />
                          {statusNote}
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
                            {t('endpoint')}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        <a
                          href={s.reference}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary"
                        >
                          {t('officialReference')}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}

        <Card className="mt-8 bg-primary/5 border-primary/30">
          <CardContent className="pt-5 pb-5 text-sm text-muted-foreground">
            <p className="mb-2 font-semibold text-foreground">{t('procurement.title')}</p>
            <p>
              {t('procurement.body1')}{' '}
              <a href="/en/for-public-sector" className="text-primary hover:underline">
                {t('procurement.linkText')}
              </a>{' '}
              {t('procurement.body2')}{' '}
              <a href="mailto:info@in-transparency.com" className="text-primary hover:underline">
                info@in-transparency.com
              </a>{' '}
              {t('procurement.body3')}
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
