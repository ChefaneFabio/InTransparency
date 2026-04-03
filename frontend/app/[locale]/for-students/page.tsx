'use client'

import { useState, useEffect } from 'react'
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
import {
  ArrowRight,
  Award,
  Play,
  ChevronRight,
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

  return (
    <div className="min-h-screen">
      <Header />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-foreground text-white">
        <img src="/images/brand/students.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-primary/60" />

        <div className="relative mx-auto max-w-5xl px-4 pt-32 pb-16 lg:pt-36 lg:pb-20 text-center min-h-[420px] flex flex-col justify-center sm:px-6">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} custom={0}>
              <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium bg-white/10 text-white border-white/20">
                <Award className="mr-1.5 h-3.5 w-3.5" />
                {t('hero.badge')}
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              {t('hero.title')}
              <br />
              <span className="text-blue-200">
                <TypewriterText text={t('hero.titleHighlight')} speed={60} delay={800} />
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="mx-auto mt-6 max-w-2xl text-lg text-blue-100 sm:text-xl">
              {t('hero.subtitle')}
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/register">
                <Button size="lg" className="gap-2 rounded-full px-8 text-base bg-white text-blue-900 hover:bg-blue-50">
                  {t('cta.primaryButton')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/demo/ai-search">
                <Button variant="outline" size="lg" className="gap-2 rounded-full px-8 text-base border-white/30 text-white hover:bg-white/10">
                  <Play className="h-4 w-4" />
                  {t('cta.secondaryButton')}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS — numbered, no icons ─── */}
      <section className="bg-white py-10 lg:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {t('steps.title')}
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mx-auto mt-4 max-w-xl text-base text-slate-600">
              {t('steps.subtitle')}
            </motion.p>
          </motion.div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                custom={i + 2}
                className="text-center"
              >
                <div className="text-5xl font-bold text-primary/15 mb-3">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{t(`steps.${i}.title`)}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{t(`steps.${i}.desc`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── KEY FEATURES — typography driven ─── */}
      <section className="bg-slate-50 py-10 lg:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {t('features.title')}
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mx-auto mt-4 max-w-xl text-base text-slate-600">
              {t('features.subtitle')}
            </motion.p>
          </motion.div>

          <div className="mt-14 grid sm:grid-cols-2 gap-x-12 gap-y-10">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                custom={i}
              >
                <h3 className="text-base font-bold text-slate-900 mb-1">{t(`features.${i}.title`)}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{t(`features.${i}.desc`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHO IT'S FOR — clean cards, no icons ─── */}
      <section className="bg-white py-10 lg:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {t('audience.title')}
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mx-auto mt-4 max-w-xl text-base text-slate-600">
              {t('audience.subtitle')}
            </motion.p>
          </motion.div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <motion.div key={i} variants={fadeUp} custom={i + 2}
                initial="hidden" whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
              >
                <Card className="h-full border-0 bg-slate-50 text-center">
                  <CardContent className="p-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">{t(`audience.${i}.title`)}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{t(`audience.${i}.desc`)}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="bg-slate-50 py-10 lg:py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {t('faq.title')}
            </motion.h2>
          </motion.div>

          <FAQ
            items={Array.from({ length: 5 }, (_, i) => ({
              question: t(`faq.items.${i}.question`),
              answer: t(`faq.items.${i}.answer`),
            }))}
          />
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 lg:py-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent" />

        <motion.div
          initial="hidden" whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="relative mx-auto max-w-3xl px-4 text-center sm:px-6"
        >
          <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold text-white sm:text-4xl">
            {t('cta.title')}
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="mx-auto mt-4 max-w-xl text-base text-slate-300">
            {t('cta.subtitle')}
          </motion.p>
          <motion.div variants={fadeUp} custom={2} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
