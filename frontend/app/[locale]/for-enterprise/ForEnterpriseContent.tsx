'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { useTranslations } from 'next-intl'

interface Capability {
  titleKey: string
  descriptionKey: string
  icon: any
  concreteKey: string
  endpoint?: string
}

const CAPABILITIES: Capability[] = [
  {
    titleKey: 'capabilities.atsIntegration.title',
    descriptionKey: 'capabilities.atsIntegration.description',
    concreteKey: 'capabilities.atsIntegration.concrete',
    endpoint: '/en/integrations/agents',
    icon: Workflow,
  },
  {
    titleKey: 'capabilities.internalAi.title',
    descriptionKey: 'capabilities.internalAi.description',
    concreteKey: 'capabilities.internalAi.concrete',
    endpoint: '/openapi.yaml',
    icon: Zap,
  },
  {
    titleKey: 'capabilities.euSovereignty.title',
    descriptionKey: 'capabilities.euSovereignty.description',
    concreteKey: 'capabilities.euSovereignty.concrete',
    endpoint: '/en/eu-compliance',
    icon: Shield,
  },
  {
    titleKey: 'capabilities.aiActShift.title',
    descriptionKey: 'capabilities.aiActShift.description',
    concreteKey: 'capabilities.aiActShift.concrete',
    endpoint: '/en/algorithm-registry',
    icon: FileCheck,
  },
  {
    titleKey: 'capabilities.teamSeats.title',
    descriptionKey: 'capabilities.teamSeats.description',
    concreteKey: 'capabilities.teamSeats.concrete',
    icon: Users,
  },
  {
    titleKey: 'capabilities.ssoEidas.title',
    descriptionKey: 'capabilities.ssoEidas.description',
    concreteKey: 'capabilities.ssoEidas.concrete',
    icon: Lock,
  },
]

export default function ForEnterpriseContent() {
  const t = useTranslations('forEnterprise')
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-5xl mx-auto px-4 pt-32 pb-16">
        <div className="mb-10">
          <Badge variant="outline" className="mb-3">
            <Building2 className="h-3 w-3 mr-1" />
            {t('badge')}
          </Badge>
          <h1 className="text-4xl font-bold mb-3">{t('hero.title')}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">{t('hero.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {CAPABILITIES.map(c => {
            const Icon = c.icon
            return (
              <Card key={c.titleKey} className="hover:border-primary/40 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    {t(c.titleKey)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{t(c.descriptionKey)}</p>
                  <p className="text-xs text-foreground/80 mb-2">
                    <span className="font-semibold">{t('practiceLabel')}</span> {t(c.concreteKey)}
                  </p>
                  {c.endpoint && (
                    <a
                      href={c.endpoint}
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {t('seeIt')}
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
            <h2 className="text-lg font-semibold mb-2">{t('process.title')}</h2>
            <ol className="list-decimal pl-5 space-y-1.5 text-sm text-muted-foreground">
              <li>
                {t('process.step1.before')}{' '}
                <Link href="/for-public-sector" className="text-primary hover:underline">
                  {t('process.step1.link')}
                </Link>{' '}
                {t('process.step1.after')}
              </li>
              <li>
                {t('process.step2.before')}{' '}
                <Link href="/eu-compliance" className="text-primary hover:underline">
                  {t('process.step2.link')}
                </Link>{' '}
                {t('process.step2.after')}
              </li>
              <li>{t('process.step3')}</li>
              <li>{t('process.step4')}</li>
              <li>{t('process.step5')}</li>
            </ol>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <Link href="/contact?role=enterprise&subject=pilot">
              {t('cta.pilot')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/integrations/agents">{t('cta.agentGuide')}</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/eu-compliance">{t('cta.compliance')}</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
