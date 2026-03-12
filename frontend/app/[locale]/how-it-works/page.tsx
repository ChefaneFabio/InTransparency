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
import {
  Upload,
  Shield,
  Search,
  MessageSquare,
  ArrowRight,
  ArrowDown,
  CheckCircle,
  GraduationCap,
  Building2,
  Users,
  Brain,
  BarChart3,
  Zap,
  Euro,
  Clock,
  Eye,
  Target,
  Star,
} from 'lucide-react'

type Segment = 'student' | 'institution' | 'company'

export default function HowItWorksPage() {
  const t = useTranslations('howItWorksPage')
  const [activeSegment, setActiveSegment] = useState<Segment>('student')

  const segments: { id: Segment; icon: typeof GraduationCap; label: string }[] = [
    { id: 'student', icon: GraduationCap, label: t('segments.student') },
    { id: 'institution', icon: Building2, label: t('segments.institution') },
    { id: 'company', icon: Users, label: t('segments.company') },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">

        {/* ── Hero ── */}
        <section className="container max-w-5xl text-center mb-20">
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
        </section>

        {/* ── The Core Flow — 3 Steps ── */}
        <section className="container max-w-5xl mb-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-4">
              {t('coreFlow.title')}
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
              {t('coreFlow.subtitle')}
            </p>

            <div className="grid md:grid-cols-3 gap-0 md:gap-0 relative">
              {/* Connecting lines (desktop) */}
              <div className="hidden md:block absolute top-24 left-[33.3%] right-[33.3%] h-0.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40 z-0" />

              {[
                { icon: Upload, num: '1', titleKey: 'coreFlow.step1.title' as const, descKey: 'coreFlow.step1.desc' as const, timeKey: 'coreFlow.step1.time' as const, color: 'from-blue-500/10 to-primary/10' },
                { icon: Brain, num: '2', titleKey: 'coreFlow.step2.title' as const, descKey: 'coreFlow.step2.desc' as const, timeKey: 'coreFlow.step2.time' as const, color: 'from-primary/10 to-violet-500/10' },
                { icon: MessageSquare, num: '3', titleKey: 'coreFlow.step3.title' as const, descKey: 'coreFlow.step3.desc' as const, timeKey: 'coreFlow.step3.time' as const, color: 'from-violet-500/10 to-emerald-500/10' },
              ].map((step, i) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.15 }}
                    className="relative z-10 flex flex-col items-center text-center px-6 py-8"
                  >
                    {/* Number + Icon */}
                    <div className={`relative mb-6 w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-sm border border-primary/10`}>
                      <Icon className="h-9 w-9 text-primary" />
                      <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-md">
                        {step.num}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {t(step.titleKey)}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {t(step.descKey)}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {t(step.timeKey)}
                    </Badge>

                    {/* Mobile arrow */}
                    {i < 2 && (
                      <ArrowDown className="md:hidden h-6 w-6 text-primary/40 mt-4" />
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </section>

        {/* ── Segment Deep-Dive ── */}
        <section className="bg-muted/30 border-y py-20 mb-24">
          <div className="container max-w-6xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-3">
                {t('segmentDive.title')}
              </h2>
              <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
                {t('segmentDive.subtitle')}
              </p>

              {/* Segment Tabs */}
              <div className="flex justify-center mb-12">
                <div className="inline-flex bg-background rounded-xl p-1.5 shadow-sm border">
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
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {seg.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Segment Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSegment}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Headline */}
                  <div className="text-center mb-10">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                      {t(`segmentDive.${activeSegment}.headline`)}
                    </h3>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                      {t(`segmentDive.${activeSegment}.subheadline`)}
                    </p>
                  </div>

                  {/* Journey Cards */}
                  <div className="grid md:grid-cols-3 gap-6 mb-10">
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
                                {t(`segmentDive.${activeSegment}.steps.${i}.title`)}
                              </h4>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              {t(`segmentDive.${activeSegment}.steps.${i}.desc`)}
                            </p>
                            <ul className="space-y-2">
                              {[0, 1, 2].map((j) => (
                                <li key={j} className="flex items-start gap-2 text-sm text-foreground/80">
                                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                  <span>{t(`segmentDive.${activeSegment}.steps.${i}.features.${j}`)}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Outcome highlight */}
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
                    <p className="text-primary font-semibold text-lg">
                      {t(`segmentDive.${activeSegment}.outcome`)}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* ── What Makes Us Different ── */}
        <section className="container max-w-5xl mb-24">
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
                { icon: Shield, colorClass: 'bg-blue-500/10 text-blue-600' },
                { icon: Brain, colorClass: 'bg-violet-500/10 text-violet-600' },
                { icon: Euro, colorClass: 'bg-emerald-500/10 text-emerald-600' },
                { icon: Eye, colorClass: 'bg-amber-500/10 text-amber-600' },
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
        <section className="border-y bg-muted/20 py-12 mb-24">
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
        <section className="container max-w-3xl text-center mb-16">
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
