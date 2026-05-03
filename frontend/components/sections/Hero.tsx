'use client'

import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight, GraduationCap, Building2, Briefcase } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useSegment } from '@/lib/segment-context'
import { BRAND_IMAGES } from '@/lib/brand-images'
import { AppPreview } from '@/components/sections/AppPreview'
import TiltCard from '@/components/3d/TiltCard'

const segmentIcons = {
  students: GraduationCap,
  institutions: Building2,
  companies: Briefcase,
}

// Map context segments to translation keys (translations still use 'universities' key)
const segmentToTranslationKey = {
  students: 'students',
  institutions: 'universities',
  companies: 'companies',
}

export function Hero() {
  const { segment: activeSegment, setSegment } = useSegment()
  const t = useTranslations('home.hero')
  const tBrand = useTranslations('brand')

  const segment = segmentToTranslationKey[activeSegment]

  const segmentCTAs: Record<string, { primary: string; secondary: string; primaryHref: string; secondaryHref: string }> = {
    students: { primary: t('segments.students.cta'), secondary: t('unifiedSecondaryCTA'), primaryHref: '/auth/register', secondaryHref: '/for-students' },
    institutions: { primary: t('segments.institutions.cta'), secondary: t('unifiedSecondaryCTA'), primaryHref: '/auth/register?role=UNIVERSITY', secondaryHref: '/for-universities' },
    companies: { primary: t('segments.companies.cta'), secondary: t('unifiedSecondaryCTA'), primaryHref: '/auth/register?role=recruiter', secondaryHref: '/for-companies' },
  }

  const cta = segmentCTAs[activeSegment]

  return (
    <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 overflow-hidden">
      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          {/* Brand spine — same line across the site (footer, hero, about) */}
          <p className="mb-3 text-lg sm:text-xl font-display italic text-foreground/85">
            {tBrand('tagline')}
          </p>

          {/* Social proof — earned, not decorative */}
          <p className="mb-8 text-sm font-medium tracking-widest text-primary uppercase">
            {t('serviceBadge')}
          </p>

          {/* Headline — changes per segment */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`hero-${activeSegment}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-7xl leading-[1.1]">
                {t(`segments.${activeSegment}.headline1`)}
                <br />
                <span className="text-primary font-display italic">{t(`segments.${activeSegment}.headline2`)}</span>
              </h1>

              <p className="mt-8 text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
                {t(`segments.${activeSegment}.subheadline`)}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* CTAs — change per segment */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="shadow-sm">
              <Link href={cta.primaryHref}>
                {cta.primary}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={cta.secondaryHref}>
                {cta.secondary}
              </Link>
            </Button>
          </div>

        </div>

        {/* Hero scene — product shot per segment. The HeroVisual photoreal
            slot was removed from here while waiting for a real Blender /
            AI-rendered asset; the CSS-only fallback didn't pull its weight.
            Drop a render in /public/hero/ and re-import HeroVisual when ready. */}
        <motion.div
          className="mt-16 mx-auto max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSegment}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <AppPreview segment={activeSegment} />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Segment explorer — below the fold */}
        <div className="mt-28 mx-auto max-w-4xl">
          <div className="mb-10 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t('exploreByRole')}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Segment tabs — no gradient active state */}
          <div className="mb-10 flex justify-center">
            <div className="inline-flex bg-muted/50 rounded-lg p-1 border border-border">
              {(['companies', 'institutions', 'students'] as const).map((seg) => {
                const Icon = segmentIcons[seg]
                return (
                  <button
                    key={seg}
                    onClick={() => setSegment(seg)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSegment === seg
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {t(`segmentLabels.${seg === 'institutions' ? 'institutes' : seg}`)}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Segment content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSegment}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-foreground text-center mb-8">
                {t(`${segment}.headlinePart1`)}{' '}
                <span className="text-primary font-display italic">{t(`${segment}.headlinePart2`)}</span>
                {segment === 'companies' && ` ${t(`${segment}.headlinePart3`)}`}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Feature cards — 3D tilt to reinforce engagement-as-progress */}
                <div className="space-y-4">
                  {[0, 1, 2].map((index) => (
                    <TiltCard
                      key={`${activeSegment}-${index}`}
                      intensity={6}
                      className="rounded-xl"
                    >
                      <div className="bg-card rounded-xl border border-border p-5 hover:border-primary/40 transition-colors">
                        <h3 className="text-base font-semibold text-foreground mb-2">
                          {t(`${segment}.features.${index}.title`)}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {t(`${segment}.features.${index}.description`)}
                        </p>
                      </div>
                    </TiltCard>
                  ))}
                </div>

                {/* Mini app preview */}
                <div className="hidden lg:block">
                  <AppPreview segment={activeSegment} />
                </div>
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
