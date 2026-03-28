'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Link } from '@/navigation'
import { BRAND_IMAGES } from '@/lib/brand-images'
import { FAQ } from '@/components/engagement/FAQ'
import { TypewriterText } from '@/components/engagement/TypewriterText'
import { StickyCTA } from '@/components/engagement/StickyCTA'
import VideoEmbed from '@/components/engagement/VideoEmbed'
import {
  Upload,
  ShieldCheck,
  Users,
  ScanSearch,
  BadgeCheck,
  Compass,
  TrendingUp,
  ArrowRight,
  Award,
  GraduationCap,
  School,
  BookOpen,
  Play,
  ChevronRight,
  FileVideo,
  Code,
  FileText,
  Megaphone,
  CheckCircle2
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
  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 600)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const steps = [
    { icon: Upload, color: 'from-blue-500 to-cyan-500' },
    { icon: ShieldCheck, color: 'from-emerald-500 to-teal-500' },
    { icon: Megaphone, color: 'from-violet-500 to-purple-500' }
  ]

  const features = [
    { icon: ScanSearch, color: 'text-blue-600 bg-blue-50' },
    { icon: BadgeCheck, color: 'text-emerald-600 bg-emerald-50' },
    { icon: Users, color: 'text-violet-600 bg-violet-50' },
    { icon: ShieldCheck, color: 'text-amber-600 bg-amber-50' },
    { icon: FileVideo, color: 'text-rose-600 bg-rose-50' },
    { icon: Compass, color: 'text-cyan-600 bg-cyan-50' }
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
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-28 pb-16 lg:pt-32 lg:pb-20">
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
                <Award className="mr-1.5 h-3.5 w-3.5" />
                {t('hero.badge')}
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
            >
              {t('hero.title')}{' '}
              <TypewriterText text={t('hero.titleHighlight')} speed={60} delay={800} />
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
              <Link href="/demo/ai-search">
                <Button variant="outline" size="lg" className="gap-2 rounded-full px-8 text-base">
                  <Play className="h-4 w-4" />
                  {t('cta.secondaryButton')}
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero image with ken-burns and play overlay */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 mx-auto max-w-4xl relative overflow-hidden rounded-2xl shadow-xl group"
          >
            <img
              src={BRAND_IMAGES.forStudents.hero}
              alt="Students collaborating on projects"
              className="w-full h-[280px] sm:h-[360px] object-cover animate-kenburns"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <Link href="/demo/ai-search">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="flex items-center gap-3 rounded-full bg-white/90 px-6 py-3 shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <Play className="h-5 w-5 text-slate-900" fill="currentColor" />
                  <span className="text-sm font-semibold text-slate-900">{t('demo.cta')}</span>
                </motion.div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="bg-white py-16 lg:py-20">
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
            className="mt-16 grid gap-6 md:grid-cols-3"
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

      {/* ─── SEE IT IN ACTION ─── */}
      <section className="bg-slate-900 py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} custom={0} className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {t('demo.title')}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-400">
                {t('demo.subtitle')}
              </p>
            </motion.div>

            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <motion.div variants={fadeUp} custom={1}>
                <VideoEmbed
                  thumbnailSrc={BRAND_IMAGES.forStudents.presenting}
                  title={t('demo.title')}
                  description={t('demo.subtitle')}
                  onClick={() => { window.location.href = '/demo/ai-search' }}
                />
              </motion.div>

              <motion.div variants={fadeUp} custom={2} className="space-y-6">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                      <CheckCircle2 className="h-5 w-5 text-blue-400" />
                    </div>
                    <p className="text-base text-slate-300">
                      {t(`demo.bullet${i + 1}`)}
                    </p>
                  </div>
                ))}

                <Link href="/demo/ai-search">
                  <Button size="lg" className="mt-4 gap-2 rounded-full bg-white px-8 text-base text-slate-900 hover:bg-slate-100">
                    {t('demo.cta')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── KEY FEATURES ─── */}
      <section className="bg-slate-50 py-16 lg:py-20">
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
      <section className="bg-white py-16 lg:py-20">
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
            className="mt-14 grid gap-6 md:grid-cols-3"
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

      {/* ─── FAQ ─── */}
      <section className="bg-slate-50 py-16 lg:py-20">
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
              {t('faq.title')}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mx-auto mt-4 max-w-xl text-slate-600"
            >
              {t('faq.subtitle')}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
            custom={2}
            className="mt-12"
          >
            <FAQ
              items={Array.from({ length: 5 }, (_, i) => ({
                question: t(`faq.items.${i}.question`),
                answer: t(`faq.items.${i}.answer`),
              }))}
            />
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 lg:py-20">
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
            <Link href="/demo/ai-search">
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
      <StickyCTA show={showSticky} text={t('cta.primaryButton')} href="/auth/register" />
    </div>
  )
}
