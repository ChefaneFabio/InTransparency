'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Link } from '@/navigation'
import {
  Upload,
  ShieldCheck,
  Users,
  Brain,
  FileCheck,
  Eye,
  TrendingUp,
  ArrowRight,
  Sparkles,
  GraduationCap,
  School,
  BookOpen,
  Play,
  ChevronRight,
  FileVideo,
  Code,
  FileText
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const }
  })
}

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } }
}

export default function ForStudentsPage() {
  const t = useTranslations('forStudents')

  const steps = [
    { icon: Upload, color: 'from-blue-500 to-cyan-500' },
    { icon: ShieldCheck, color: 'from-emerald-500 to-teal-500' },
    { icon: Users, color: 'from-violet-500 to-purple-500' }
  ]

  const features = [
    { icon: Brain, color: 'text-blue-600 bg-blue-50' },
    { icon: FileCheck, color: 'text-emerald-600 bg-emerald-50' },
    { icon: Users, color: 'text-violet-600 bg-violet-50' },
    { icon: ShieldCheck, color: 'text-amber-600 bg-amber-50' },
    { icon: FileVideo, color: 'text-rose-600 bg-rose-50' },
    { icon: Eye, color: 'text-cyan-600 bg-cyan-50' }
  ]

  const audiences = [
    { icon: School, gradient: 'from-amber-500 to-orange-500' },
    { icon: BookOpen, gradient: 'from-blue-500 to-indigo-500' },
    { icon: GraduationCap, gradient: 'from-emerald-500 to-teal-500' }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-32 pb-20 lg:pt-40 lg:pb-28">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-violet-100/30 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeUp} custom={0}>
              <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                {t('hero.badge')}
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
            >
              {t('hero.title')}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={3}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link href="/auth/register">
                <Button size="lg" className="gap-2 rounded-full px-8 text-base">
                  {t('cta.primaryButton')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="outline" size="lg" className="gap-2 rounded-full px-8 text-base">
                  <Play className="h-4 w-4" />
                  {t('cta.secondaryButton')}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            >
              {t('steps.title')}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mx-auto mt-4 max-w-xl text-slate-600"
            >
              {t('steps.subtitle')}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="mt-16 grid gap-8 md:grid-cols-3"
          >
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div key={i} variants={fadeUp} custom={i + 2} className="relative text-center">
                  {/* connector line */}
                  {i < steps.length - 1 && (
                    <div className="pointer-events-none absolute top-10 left-[60%] hidden h-0.5 w-[80%] bg-gradient-to-r from-slate-200 to-transparent md:block" />
                  )}

                  <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} shadow-lg shadow-slate-200`}>
                    <Icon className="h-9 w-9 text-white" />
                  </div>

                  <div className="mt-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    {i + 1}
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    {t(`steps.${i}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {t(`steps.${i}.desc`)}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── KEY FEATURES ─── */}
      <section className="bg-slate-50 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            >
              {t('features.title')}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mx-auto mt-4 max-w-xl text-slate-600"
            >
              {t('features.subtitle')}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={stagger}
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feat, i) => {
              const Icon = feat.icon
              return (
                <motion.div key={i} variants={fadeUp} custom={i + 2}>
                  <Card className="h-full border-0 bg-white shadow-sm transition-shadow hover:shadow-md">
                    <CardContent className="p-6">
                      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${feat.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 text-base font-semibold text-slate-900">
                        {t(`features.${i}.title`)}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500">
                        {t(`features.${i}.desc`)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── WHO IT'S FOR ─── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            >
              {t('audience.title')}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mx-auto mt-4 max-w-xl text-slate-600"
            >
              {t('audience.subtitle')}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={stagger}
            className="mt-14 grid gap-8 md:grid-cols-3"
          >
            {audiences.map((aud, i) => {
              const Icon = aud.icon
              return (
                <motion.div key={i} variants={fadeUp} custom={i + 2}>
                  <Card className="h-full border-0 bg-white shadow-sm text-center">
                    <CardContent className="p-8">
                      <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${aud.gradient} shadow-md`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="mt-5 text-lg font-semibold text-slate-900">
                        {t(`audience.${i}.title`)}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-500">
                        {t(`audience.${i}.desc`)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="relative mx-auto max-w-3xl px-4 text-center sm:px-6"
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            {t('cta.title')}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="mx-auto mt-4 max-w-lg text-slate-300"
          >
            {t('cta.subtitle')}
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={2}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/auth/register">
              <Button size="lg" className="gap-2 rounded-full bg-white px-8 text-base text-slate-900 hover:bg-slate-100">
                {t('cta.primaryButton')}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/explore">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 rounded-full border-slate-600 px-8 text-base text-slate-200 hover:bg-slate-800"
              >
                {t('cta.secondaryButton')}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
