'use client'

import { useState } from 'react'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight, GraduationCap, Building2, Briefcase } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'

type Segment = 'students' | 'universities' | 'companies'

const segmentIcons = {
  students: GraduationCap,
  universities: Building2,
  companies: Briefcase,
}

export function Hero() {
  const [selectedSegment, setSelectedSegment] = useState<Segment>('companies')
  const t = useTranslations('home.hero')

  const segment = selectedSegment

  return (
    <section className="py-20 sm:py-28">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          {/* Social proof — earned, not decorative */}
          <p className="mb-6 text-sm font-medium tracking-wide text-primary uppercase">
            {t('serviceBadge')}
          </p>

          {/* Headline — typography does the work, no gradients */}
          <h1 className="text-4xl font-display font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t('unifiedHeadline1')}{' '}
            <span className="text-primary">{t('unifiedHeadline2')}</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            {t('unifiedSubheadline')}
          </p>

          {/* CTAs — clean, no hover-scale */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="shadow-sm">
              <Link href="/auth/register">
                {t('unifiedPrimaryCTA')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/how-it-works">
                {t('unifiedSecondaryCTA')}
              </Link>
            </Button>
          </div>

          {/* Trust signals — simple text, no pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {[0, 1, 2].map((index) => (
              <span key={index} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {t(`unifiedBenefits.${index}`)}
              </span>
            ))}
          </div>

          {/* Social proof — specific achievements */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {t('socialProof.startCup')}
            </span>
            <span className="hidden sm:inline text-border">|</span>
            <span>{t('socialProof.unibgPilot')}</span>
          </div>
        </div>

        {/* Segment explorer — below the fold */}
        <div className="mt-20 mx-auto max-w-4xl">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t('exploreByRole')}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Segment tabs — no gradient active state */}
          <div className="mb-10 flex justify-center">
            <div className="inline-flex bg-muted/50 rounded-lg p-1 border border-border">
              {(['companies', 'universities', 'students'] as Segment[]).map((seg) => {
                const Icon = segmentIcons[seg]
                return (
                  <button
                    key={seg}
                    onClick={() => setSelectedSegment(seg)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedSegment === seg
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {t(`segmentLabels.${seg === 'universities' ? 'institutes' : seg}`)}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Segment content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSegment}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-display font-bold text-foreground text-center mb-8">
                {t(`${segment}.headlinePart1`)}{' '}
                <span className="text-primary">{t(`${segment}.headlinePart2`)}</span>
                {segment === 'companies' && ` ${t(`${segment}.headlinePart3`)}`}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[0, 1, 2].map((index) => (
                  <div
                    key={`${selectedSegment}-${index}`}
                    className="bg-card rounded-xl border border-border p-6"
                  >
                    <h3 className="text-base font-semibold text-foreground mb-2">
                      {t(`${segment}.features.${index}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`${segment}.features.${index}.description`)}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-sm text-muted-foreground text-center">
                {t(`${segment}.statsLabel`)} {t(`${segment}.statsValue`)}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
