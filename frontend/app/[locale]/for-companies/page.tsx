'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/navigation'
import { motion } from 'framer-motion'
import { BRAND_IMAGES } from '@/lib/brand-images'
import { FAQ } from '@/components/engagement/FAQ'
import { TypewriterText } from '@/components/engagement/TypewriterText'
import { StickyCTA } from '@/components/engagement/StickyCTA'
import VideoEmbed from '@/components/engagement/VideoEmbed'
import {
  Search,
  FolderOpen,
  MessageCircle,
  ScanSearch,
  BadgeCheck,
  FileBarChart,
  UserCheck,
  LineChart,
  Timer,
  ArrowRight,
  CheckCircle,
  CheckCircle2,
  XCircle,
  Play,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

export default function ForCompaniesPage() {
  const t = useTranslations('forCompanies')
  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 600)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const steps = [
    { icon: Search, color: 'text-blue-600', bg: 'bg-blue-100' },
    { icon: FolderOpen, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { icon: MessageCircle, color: 'text-purple-600', bg: 'bg-purple-100' },
  ]

  const features = [
    { icon: ScanSearch, color: 'text-violet-600', bg: 'bg-violet-50' },
    { icon: BadgeCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { icon: FileBarChart, color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: UserCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
    { icon: Timer, color: 'text-rose-600', bg: 'bg-rose-50' },
    { icon: LineChart, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  ]

  const comparisonRows = [0, 1, 2, 3] as const

  return (
    <div className="min-h-screen segment-recruiter">
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
          <div className="container max-w-4xl text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.div variants={fadeUp} custom={0}>
                <Badge className="mb-6 bg-blue-500/20 text-blue-200 border-blue-400/30">
                  {t('hero.badge')}
                </Badge>
              </motion.div>
              <motion.h1
                variants={fadeUp}
                custom={1}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              >
                {t('hero.title')}{' '}
                <TypewriterText text={t('hero.titleHighlight')} speed={60} delay={800} />
              </motion.h1>
              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto"
              >
                {t('hero.subtitle')}
              </motion.p>
              <motion.div
                variants={fadeUp}
                custom={3}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button size="lg" asChild className="bg-white text-slate-900 hover:bg-gray-100">
                  <Link href="/auth/register?role=recruiter">
                    {t('cta.primaryButton')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10">
                  <Link href="/demo/ai-search">
                    {t('cta.secondaryButton')}
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Hero image with ken-burns effect */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 mx-auto max-w-4xl relative overflow-hidden rounded-2xl shadow-xl group"
            >
              <img
                src={BRAND_IMAGES.forCompanies.hero}
                alt="Professional hiring — trust and confidence"
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

        {/* ── How It Works ── */}
        <section className="py-16 bg-gray-50">
          <div className="container max-w-5xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
              className="text-center mb-14"
            >
              <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold mb-4">
                {t('steps.title')}
              </motion.h2>
              <motion.p variants={fadeUp} custom={1} className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('steps.subtitle')}
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  variants={fadeUp}
                  custom={i}
                  className="text-center"
                >
                  <div className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl ${step.bg} mb-5`}>
                    <step.icon className={`h-8 w-8 ${step.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {t(`steps.${i}.title`)}
                  </h3>
                  <p className="text-muted-foreground">
                    {t(`steps.${i}.desc`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Key Features ── */}
        <section className="py-16">
          <div className="container max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
              className="text-center mb-14"
            >
              <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold mb-4">
                {t('features.title')}
              </motion.h2>
              <motion.p variants={fadeUp} custom={1} className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('features.subtitle')}
              </motion.p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feat, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  variants={fadeUp}
                  custom={i}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl ${feat.bg} mb-4`}>
                        <feat.icon className={`h-6 w-6 ${feat.color}`} />
                      </div>
                      <h3 className="text-lg font-bold mb-2">
                        {t(`features.${i}.title`)}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {t(`features.${i}.desc`)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── See the Platform ── */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="container max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} custom={0} className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t('demo.title')}
                </h2>
                <p className="text-slate-400 max-w-xl mx-auto">
                  {t('demo.subtitle')}
                </p>
              </motion.div>

              <div className="grid gap-10 lg:grid-cols-2 items-center">
                <motion.div variants={fadeUp} custom={1}>
                  <VideoEmbed
                    thumbnailSrc={BRAND_IMAGES.forCompanies.hero}
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
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Comparison ── */}
        <section className="py-16 bg-gray-50">
          <div className="container max-w-3xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
              className="text-center mb-12"
            >
              <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold mb-4">
                {t('comparison.title')}
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUp}
              custom={0}
            >
              <Card className="overflow-hidden">
                <div className="grid grid-cols-2">
                  <div className="p-4 bg-red-50 text-center font-bold text-red-800 border-b border-r">
                    {t('comparison.headers.before')}
                  </div>
                  <div className="p-4 bg-emerald-50 text-center font-bold text-emerald-800 border-b">
                    {t('comparison.headers.after')}
                  </div>
                </div>
                {comparisonRows.map((row) => (
                  <div key={row} className="grid grid-cols-2 border-b last:border-b-0">
                    <div className="p-3 sm:p-4 flex items-start gap-2 border-r text-xs sm:text-sm text-muted-foreground">
                      <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                      <span className="break-words">{t(`comparison.rows.${row}.before`)}</span>
                    </div>
                    <div className="p-3 sm:p-4 flex items-start gap-2 text-xs sm:text-sm font-medium">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="break-words">{t(`comparison.rows.${row}.after`)}</span>
                    </div>
                  </div>
                ))}
              </Card>
            </motion.div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16">
          <div className="container max-w-5xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
              className="text-center mb-12"
            >
              <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold mb-4">
                {t('faq.title')}
              </motion.h2>
              <motion.p variants={fadeUp} custom={1} className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('faq.subtitle')}
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUp}
              custom={2}
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

        {/* ── CTA ── */}
        <section className="py-16 bg-gradient-to-br from-blue-900 to-slate-900 text-white">
          <div className="container max-w-3xl text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
            >
              <motion.h2
                variants={fadeUp}
                custom={0}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                {t('cta.title')}
              </motion.h2>
              <motion.p
                variants={fadeUp}
                custom={1}
                className="text-lg text-blue-100 mb-10 max-w-xl mx-auto"
              >
                {t('cta.subtitle')}
              </motion.p>
              <motion.div
                variants={fadeUp}
                custom={2}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button size="lg" asChild className="bg-white text-slate-900 hover:bg-gray-100">
                  <Link href="/auth/register?role=recruiter">
                    {t('cta.primaryButton')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10">
                  <Link href="/demo/ai-search">
                    {t('cta.secondaryButton')}
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyCTA show={showSticky} text={t('cta.primaryButton')} href="/auth/register" />
    </div>
  )
}
