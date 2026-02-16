'use client'

import { useState } from 'react'
import { Link } from '@/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, GraduationCap, Building2, Briefcase, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { IMAGES } from '@/lib/images'
import { useTranslations } from 'next-intl'

type Segment = 'students' | 'universities' | 'companies'

// Image mappings for each segment
const segmentImages = {
  students: {
    features: [
      IMAGES.features.aiAnalysis,
      IMAGES.students.student4,
      IMAGES.universityCampuses.graduation
    ]
  },
  universities: {
    features: [
      IMAGES.features.search,
      IMAGES.recruiters.recruiter2,
      IMAGES.universityCampuses.campus
    ]
  },
  companies: {
    features: [
      IMAGES.features.search,
      IMAGES.universityCampuses.library,
      IMAGES.success.handshake
    ]
  }
}

const segmentIcons = {
  students: GraduationCap,
  universities: Building2,
  companies: Briefcase
}

export function Hero() {
  const [selectedSegment, setSelectedSegment] = useState<Segment>('companies')
  const t = useTranslations('home.hero')

  const segment = selectedSegment
  const tFeatures = (index: number, key: string) => t(`${segment}.features.${index}.${key}`)

  return (
    <section className="relative overflow-hidden hero-bg py-16 sm:py-24">
      {/* Atmospheric orbs - teal and amber */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl text-center">

          {/* ── ABOVE FOLD: Unified content ── */}

          {/* Service Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4 flex justify-center"
          >
            <div className="text-xs text-muted-foreground bg-white/40 backdrop-blur-sm px-3 py-1 rounded-full border border-border/50">
              {t('serviceBadge')}
            </div>
          </motion.div>

          {/* Unified headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl font-display font-bold tracking-tight text-foreground sm:text-6xl">
              {t('unifiedHeadline1')}{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {t('unifiedHeadline2')}
              </span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-foreground/80 max-w-3xl mx-auto">
              {t('unifiedSubheadline')}
            </p>
          </motion.div>

          {/* Primary + Secondary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/auth/register">
                {t('unifiedPrimaryCTA')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button variant="outline" size="lg" asChild className="border-2">
              <Link href="/how-it-works">
                {t('unifiedSecondaryCTA')}
              </Link>
            </Button>
          </motion.div>

          {/* Unified benefit pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm"
          >
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-card/60 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-border"
              >
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-foreground/80">{t(`unifiedBenefits.${index}`)}</span>
              </div>
            ))}
          </motion.div>

          {/* ── BELOW FOLD: Segment-specific deep dive ── */}

          {/* Visual separator */}
          <div className="mt-16 mb-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t('exploreByRole')}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Segment Switcher */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-10 flex justify-center"
          >
            <div className="inline-flex bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-lg border border-border">
              {(['companies', 'universities', 'students'] as Segment[]).map((seg) => {
                const Icon = segmentIcons[seg]
                return (
                  <button
                    key={seg}
                    onClick={() => setSelectedSegment(seg)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedSegment === seg
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {t(`segmentLabels.${seg === 'universities' ? 'institutes' : seg}`)}
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Segment content with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSegment}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Segment headline */}
              <h2 className="text-2xl font-display font-bold text-foreground sm:text-3xl mb-2">
                {t(`${segment}.headlinePart1`)}{' '}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {t(`${segment}.headlinePart2`)}
                </span>
                {segment === 'companies' && ` ${t(`${segment}.headlinePart3`)}`}
              </h2>

              {/* Feature cards */}
              <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={`${selectedSegment}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex flex-col items-center group"
                  >
                    <motion.div
                      className="relative rounded-full overflow-hidden w-16 h-16 shadow-md group-hover:shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src={segmentImages[segment].features[index]}
                        alt={tFeatures(index, 'title')}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">{tFeatures(index, 'title')}</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      {tFeatures(index, 'description')}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-10 pt-6 border-t border-border">
                <p className="text-sm font-medium text-foreground/80 text-center flex items-center justify-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  {t(`${segment}.statsLabel`)} {t(`${segment}.statsValue`)}
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  {t('bottomText')}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
