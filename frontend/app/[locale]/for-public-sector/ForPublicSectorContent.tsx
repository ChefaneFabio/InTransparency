'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { useTranslations } from 'next-intl'

interface AttestationItem {
  labelKey: string
  valueKey: string
  detailKey?: string
}

const POSTURE: AttestationItem[] = [
  { labelKey: 'posture.residency.label', valueKey: 'posture.residency.value', detailKey: 'posture.residency.detail' },
  { labelKey: 'posture.jurisdiction.label', valueKey: 'posture.jurisdiction.value', detailKey: 'posture.jurisdiction.detail' },
  { labelKey: 'posture.dpo.label', valueKey: 'posture.dpo.value', detailKey: 'posture.dpo.detail' },
  { labelKey: 'posture.subprocessors.label', valueKey: 'posture.subprocessors.value', detailKey: 'posture.subprocessors.detail' },
  { labelKey: 'posture.breach.label', valueKey: 'posture.breach.value', detailKey: 'posture.breach.detail' },
  { labelKey: 'posture.sla.label', valueKey: 'posture.sla.value', detailKey: 'posture.sla.detail' },
]

const DOCS: AttestationItem[] = [
  { labelKey: 'docs.dpia.label', valueKey: 'docs.dpia.value', detailKey: 'docs.dpia.detail' },
  { labelKey: 'docs.ropa.label', valueKey: 'docs.ropa.value', detailKey: 'docs.ropa.detail' },
  { labelKey: 'docs.dpa.label', valueKey: 'docs.dpa.value', detailKey: 'docs.dpa.detail' },
  { labelKey: 'docs.aiAct.label', valueKey: 'docs.aiAct.value', detailKey: 'docs.aiAct.detail' },
  { labelKey: 'docs.security.label', valueKey: 'docs.security.value', detailKey: 'docs.security.detail' },
  { labelKey: 'docs.accessibility.label', valueKey: 'docs.accessibility.value', detailKey: 'docs.accessibility.detail' },
  { labelKey: 'docs.pnrr.label', valueKey: 'docs.pnrr.value', detailKey: 'docs.pnrr.detail' },
]

const PROCUREMENT: AttestationItem[] = [
  { labelKey: 'procurement.ted.label', valueKey: 'procurement.ted.value', detailKey: 'procurement.ted.detail' },
  { labelKey: 'procurement.cpv.label', valueKey: 'procurement.cpv.value', detailKey: 'procurement.cpv.detail' },
  { labelKey: 'procurement.framework.label', valueKey: 'procurement.framework.value', detailKey: 'procurement.framework.detail' },
  { labelKey: 'procurement.pilot.label', valueKey: 'procurement.pilot.value', detailKey: 'procurement.pilot.detail' },
]

function MatrixCard({
  title,
  icon: Icon,
  items,
  t,
}: {
  title: string
  icon: any
  items: AttestationItem[]
  t: (key: string) => string
}) {
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
          <div key={item.labelKey}>
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <span className="text-sm font-medium text-foreground">{t(item.labelKey)}</span>
              <span className="text-sm font-semibold text-primary">{t(item.valueKey)}</span>
            </div>
            {item.detailKey && (
              <p className="text-xs text-muted-foreground mt-0.5">{t(item.detailKey)}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default function ForPublicSectorContent() {
  const t = useTranslations('forPublicSector')
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-5xl mx-auto px-4 pt-32 pb-16">
        <div className="mb-8">
          <Badge variant="outline" className="mb-3 bg-primary/10 border-primary/30 text-primary">
            <Landmark className="h-3 w-3 mr-1" />
            {t('badge')}
          </Badge>
          <h1 className="text-4xl font-bold mb-3">{t('hero.title')}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">{t('hero.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-8">
          <MatrixCard title={t('sections.posture')} icon={MapPin} items={POSTURE} t={t} />
          <MatrixCard title={t('sections.docs')} icon={FileText} items={DOCS} t={t} />
        </div>

        <MatrixCard title={t('sections.procurement')} icon={FileSignature} items={PROCUREMENT} t={t} />

        <Card className="mt-8 bg-primary/5 border-primary/30">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              {t('complianceCard.title')}
            </h2>
            <p className="text-sm text-muted-foreground mb-3">{t('complianceCard.body')}</p>
            <Button asChild>
              <Link href="/eu-compliance">
                {t('complianceCard.cta')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-5">
          <CardContent className="pt-5 pb-5">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              {t('engage.title')}
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
              <li>
                {t('engage.step1.before')}{' '}
                <a
                  href="mailto:info@in-transparency.com"
                  className="text-primary hover:underline"
                >
                  info@in-transparency.com
                </a>{' '}
                {t('engage.step1.after')}
              </li>
              <li>{t('engage.step2')}</li>
              <li>{t('engage.step3')}</li>
              <li>{t('engage.step4')}</li>
            </ol>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
