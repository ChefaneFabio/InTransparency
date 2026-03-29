'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { BRAND_IMAGES } from '@/lib/brand-images'
import { ArrowRight } from 'lucide-react'

type Segment = 'student' | 'institution' | 'company'

export default function HowItWorksPage() {
  const t = useTranslations('howItWorksPage')
  const [activeSegment, setActiveSegment] = useState<Segment>('student')

  const segments: { id: Segment; label: string }[] = [
    { id: 'student', label: t('segments.student') },
    { id: 'institution', label: t('segments.institution') },
    { id: 'company', label: t('segments.company') },
  ]

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pb-16">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-foreground text-white">
          <img src="/images/brand/team.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-primary/60" />
          <div className="relative container max-w-4xl mx-auto px-4 py-16 lg:py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-5 bg-white/10 text-white border-white/20 text-sm px-4 py-1.5">
                {t('hero.badge')}
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-5 leading-tight">
                {t('hero.titleLine1')}
                <br />
                <span className="text-blue-200">{t('hero.titleLine2')}</span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
                {t('hero.subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Segment Selector ── */}
        <section className="container max-w-5xl mb-6">
          <div className="flex justify-center">
            <div className="inline-flex bg-muted/50 rounded-xl p-1.5 shadow-sm border">
              {segments.map((seg) => {
                const isActive = activeSegment === seg.id
                return (
                  <button
                    key={seg.id}
                    onClick={() => setActiveSegment(seg.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary text-white shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background'
                    }`}
                  >
                    {seg.label}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Dynamic Headline ── */}
        <AnimatePresence mode="wait">
          <motion.section
            key={`headline-${activeSegment}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="container max-w-3xl text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
              {t(`journey.${activeSegment}.headline`)}
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t(`journey.${activeSegment}.subheadline`)}
            </p>
          </motion.section>
        </AnimatePresence>

        {/* ── 3 Steps (Dynamic per segment) ── */}
        <AnimatePresence mode="wait">
          <motion.section
            key={`steps-${activeSegment}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="container max-w-5xl mb-8"
          >
            <div className="grid md:grid-cols-3 gap-0 relative">
              {/* Connecting line (desktop) */}
              <div className="hidden md:block absolute top-24 left-[33.3%] right-[33.3%] h-0.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40 z-0" />

              {[0, 1, 2].map((i) => {
                const stepNum = String(i + 1).padStart(2, '0')
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.12 }}
                    className="relative z-10 flex flex-col items-center text-center px-6 py-8"
                  >
                    <div className="text-5xl font-bold text-primary/15 mb-3">{stepNum}</div>

                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {t(`journey.${activeSegment}.steps.${i}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`journey.${activeSegment}.steps.${i}.desc`)}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </motion.section>
        </AnimatePresence>

        {/* ── Outcome Banner ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`outcome-${activeSegment}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="container max-w-3xl mb-12"
          >
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
              <p className="text-primary font-semibold text-lg">
                {t(`journey.${activeSegment}.outcome`)}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Details per step ── */}
        <section className="bg-muted/30 border-y py-16 mb-12">
          <div className="container max-w-6xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={`details-${activeSegment}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-3">
                  {t(`details.${activeSegment}.title`)}
                </h2>
                <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
                  {t(`details.${activeSegment}.subtitle`)}
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                      <Card className="h-full border-2 hover:border-primary/30 transition-all hover:shadow-md">
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                              {i + 1}
                            </div>
                            <h4 className="font-semibold text-foreground">
                              {t(`details.${activeSegment}.cards.${i}.title`)}
                            </h4>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            {t(`details.${activeSegment}.cards.${i}.desc`)}
                          </p>
                          <ul className="space-y-2">
                            {[0, 1, 2].map((j) => (
                              <li key={j} className="flex items-start gap-2 text-sm text-foreground/80">
                                <span className="text-primary font-bold mt-0.5">--</span>
                                <span>{t(`details.${activeSegment}.cards.${i}.features.${j}`)}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ── What Makes Us Different ── */}
        <section className="container max-w-5xl mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-3">
              {t('differentiators.title')}
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
              {t('differentiators.subtitle')}
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[0, 1, 2, 3].map((i) => {
                const stepNum = String(i + 1).padStart(2, '0')
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-5xl font-bold text-primary/15 mb-3">{stepNum}</div>
                    <h4 className="font-semibold text-foreground mb-1.5">
                      {t(`differentiators.items.${i}.title`)}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`differentiators.items.${i}.desc`)}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </section>

        {/* ── Social Proof Strip ── */}
        <section className="border-y bg-muted/20 py-12 mb-12">
          <div className="container max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <div className="text-3xl font-bold text-primary mb-1">
                    {t(`proof.${i}.value`)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t(`proof.${i}.label`)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="container max-w-3xl text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-primary rounded-2xl p-10 md:p-14"
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg" asChild>
                <Link href="/auth/register">
                  {t('cta.primaryButton')}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href="/explore">
                  {t('cta.secondaryButton')}
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
