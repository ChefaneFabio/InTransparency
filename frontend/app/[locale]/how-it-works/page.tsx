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
import {
  Upload,
  BadgeCheck,
  Search,
  MessageSquare,
  ArrowRight,
  ArrowDown,
  CheckCircle,
  GraduationCap,
  Building2,
  Users,
  ScanSearch,
  Compass,
  Clock,
  BarChart3,
  Star,
  Target,
  FileCheck,
  UserCheck,
} from 'lucide-react'

type Segment = 'student' | 'institution' | 'company'

const stepIcons = {
  student: [Upload, ScanSearch, MessageSquare],
  institution: [UserCheck, FileCheck, BarChart3],
  company: [Search, Compass, MessageSquare],
}

const stepColors = [
  'from-blue-500/10 to-primary/10',
  'from-primary/10 to-violet-500/10',
  'from-violet-500/10 to-emerald-500/10',
]

export default function HowItWorksPage() {
  const t = useTranslations('howItWorksPage')
  const [activeSegment, setActiveSegment] = useState<Segment>('student')

  const segments: { id: Segment; icon: typeof GraduationCap; label: string }[] = [
    { id: 'student', icon: GraduationCap, label: t('segments.student') },
    { id: 'institution', icon: Building2, label: t('segments.institution') },
    { id: 'company', icon: Users, label: t('segments.company') },
  ]

  const icons = stepIcons[activeSegment]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">

        {/* ── Hero ── */}
        <section className="container max-w-5xl text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-5 bg-primary/10 text-primary border-primary/20 text-sm px-4 py-1.5">
              {t('hero.badge')}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-5 leading-tight">
              {t('hero.titleLine1')}
              <br />
              <span className="text-primary">{t('hero.titleLine2')}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 mx-auto max-w-4xl"
          >
            <img
              src={BRAND_IMAGES.hero.main}
              alt="How InTransparency works"
              className="w-full h-[250px] sm:h-[320px] object-cover rounded-2xl shadow-lg"
            />
          </motion.div>
        </section>

        {/* ── Segment Selector ── */}
        <section className="container max-w-5xl mb-6">
          <div className="flex justify-center">
            <div className="inline-flex bg-muted/50 rounded-xl p-1.5 shadow-sm border">
              {segments.map((seg) => {
                const Icon = seg.icon
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
                    <Icon className="h-4 w-4" />
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
                const Icon = icons[i]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.12 }}
                    className="relative z-10 flex flex-col items-center text-center px-6 py-8"
                  >
                    <div className={`relative mb-6 w-20 h-20 rounded-2xl bg-gradient-to-br ${stepColors[i]} flex items-center justify-center shadow-sm border border-primary/10`}>
                      <Icon className="h-9 w-9 text-primary" />
                      <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-md">
                        {i + 1}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {t(`journey.${activeSegment}.steps.${i}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`journey.${activeSegment}.steps.${i}.desc`)}
                    </p>

                    {i < 2 && (
                      <ArrowDown className="md:hidden h-6 w-6 text-primary/40 mt-4" />
                    )}
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
                                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
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
              {[
                { icon: BadgeCheck, colorClass: 'bg-blue-500/10 text-blue-600' },
                { icon: ScanSearch, colorClass: 'bg-violet-500/10 text-violet-600' },
                { icon: Target, colorClass: 'bg-emerald-500/10 text-emerald-600' },
                { icon: Compass, colorClass: 'bg-amber-500/10 text-amber-600' },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="text-center"
                  >
                    <div className={`w-14 h-14 rounded-2xl ${item.colorClass} flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="h-7 w-7" />
                    </div>
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
