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
import {
  ArrowRight,
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

  const comparisonRows = [0, 1, 2, 3] as const

  return (
    <div className="min-h-screen segment-recruiter">
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-foreground text-white">
          <img src="/images/brand/meeting.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-primary/60" />
          <div className="relative container max-w-4xl text-center py-16 lg:py-20">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeUp} custom={0}>
                <Badge className="mb-6 bg-white/10 text-white border-white/20">
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
              <motion.p variants={fadeUp} custom={2} className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                {t('hero.subtitle')}
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center">
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

        {/* ── How It Works — text only, no icons ── */}
        <section className="py-16 bg-gray-50">
          <div className="container max-w-4xl">
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

            <div className="grid md:grid-cols-3 gap-8">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  variants={fadeUp}
                  custom={i}
                  className="text-center"
                >
                  <div className="text-5xl font-bold text-primary/15 mb-3">{String(i + 1).padStart(2, '0')}</div>
                  <h3 className="text-xl font-bold mb-2">{t(`steps.${i}.title`)}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{t(`steps.${i}.desc`)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Key Features — typography-driven, no icon grid ── */}
        <section className="py-16">
          <div className="container max-w-4xl">
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

            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  variants={fadeUp}
                  custom={i}
                >
                  <h3 className="text-base font-bold mb-1">{t(`features.${i}.title`)}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{t(`features.${i}.desc`)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comparison — clean, no icons ── */}
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
                    <div className="p-3 sm:p-4 border-r text-xs sm:text-sm text-muted-foreground line-through decoration-red-300">
                      {t(`comparison.rows.${row}.before`)}
                    </div>
                    <div className="p-3 sm:p-4 text-xs sm:text-sm font-medium text-emerald-700">
                      {t(`comparison.rows.${row}.after`)}
                    </div>
                  </div>
                ))}
              </Card>
            </motion.div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16">
          <div className="container max-w-3xl">
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
            </motion.div>

            <FAQ
              items={Array.from({ length: 5 }, (_, i) => ({
                question: t(`faq.items.${i}.question`),
                answer: t(`faq.items.${i}.answer`),
              }))}
            />
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
              <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold mb-4">
                {t('cta.title')}
              </motion.h2>
              <motion.p variants={fadeUp} custom={1} className="text-lg text-blue-100 mb-10 max-w-xl mx-auto">
                {t('cta.subtitle')}
              </motion.p>
              <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row gap-4 justify-center">
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
      <StickyCTA show={showSticky} text={t('cta.primaryButton')} href="/auth/register?role=recruiter" />
    </div>
  )
}
