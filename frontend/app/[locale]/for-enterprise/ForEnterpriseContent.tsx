'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Building2,
  Shield,
  Zap,
  FileCheck,
  Workflow,
  ArrowRight,
  MessageSquare,
  Code2,
} from 'lucide-react'
import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import HeroVisual from '@/components/3d/HeroVisual'
import HeroCTA from '@/components/ui/HeroCTA'
import { StickyCTA } from '@/components/engagement/StickyCTA'

interface Capability {
  titleKey: string
  descriptionKey: string
  icon: any
  concreteKey: string
  endpoint?: string
}

// Order matters: discovery + realEvidence lead because they articulate
// what an ATS *can't* do. atsIntegration is intentionally last —
// "and yes, we feed your existing ATS too" — not the headline pitch.
const CAPABILITIES: Capability[] = [
  {
    titleKey: 'capabilities.discovery.title',
    descriptionKey: 'capabilities.discovery.description',
    concreteKey: 'capabilities.discovery.concrete',
    endpoint: '/demo/ai-search',
    icon: MessageSquare,
  },
  {
    titleKey: 'capabilities.realEvidence.title',
    descriptionKey: 'capabilities.realEvidence.description',
    concreteKey: 'capabilities.realEvidence.concrete',
    endpoint: '/algorithm-registry',
    icon: Code2,
  },
  {
    titleKey: 'capabilities.aiActShift.title',
    descriptionKey: 'capabilities.aiActShift.description',
    concreteKey: 'capabilities.aiActShift.concrete',
    endpoint: '/algorithm-registry',
    icon: FileCheck,
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
    endpoint: '/eu-compliance',
    icon: Shield,
  },
  {
    titleKey: 'capabilities.atsIntegration.title',
    descriptionKey: 'capabilities.atsIntegration.description',
    concreteKey: 'capabilities.atsIntegration.concrete',
    endpoint: '/integrations/agents',
    icon: Workflow,
  },
]

export default function ForEnterpriseContent() {
  const t = useTranslations('forEnterprise')
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ── Hero — text + visual side-by-side, brings parity with siblings ── */}
      <section className="container max-w-6xl mx-auto px-4 pt-28 pb-12">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4">
              <Building2 className="h-3 w-3 mr-1" />
              {t('badge')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-5">
              {t('hero.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <HeroCTA href="/contact?role=enterprise&subject=pilot" variant="primary">
                {t('cta.pilot')}
              </HeroCTA>
              <HeroCTA href="/integrations/agents" variant="secondary">
                {t('cta.agentGuide')}
              </HeroCTA>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="hidden lg:block"
          >
            <HeroVisual className="max-w-[460px] ml-auto" />
          </motion.div>
        </div>
      </section>

      <main className="container max-w-5xl mx-auto px-4 pb-16">
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
          <HeroCTA href="/contact?role=enterprise&subject=pilot" variant="primary">
            {t('cta.pilot')}
          </HeroCTA>
          <HeroCTA href="/integrations/agents" variant="secondary">
            {t('cta.agentGuide')}
          </HeroCTA>
          <HeroCTA href="/eu-compliance" variant="secondary">
            {t('cta.compliance')}
          </HeroCTA>
        </div>
      </main>

      <StickyCTA
        href="/contact?role=enterprise&subject=pilot"
        text={t('cta.pilot')}
        show
      />

      <Footer />
    </div>
  )
}
