'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { BRAND_IMAGES } from '@/lib/brand-images'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
}

export default function ForAcademicPartnersPage() {
  const t = useTranslations('forAcademicPartners')

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-foreground text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative container max-w-6xl mx-auto px-4 py-20 lg:py-28">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <Badge
              variant="secondary"
              className="mb-6 bg-white/10 text-white border-white/20"
            >
              {t('hero.badge')}
            </Badge>

            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              {t('hero.title')}
            </h1>

            <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register?role=UNIVERSITY">
                <Button
                  size="lg"
                  className="bg-white text-blue-900 hover:bg-primary/5 w-full sm:w-auto"
                >
                  {t('cta.primaryButton')}
                </Button>
              </Link>
              <Link href="/contact?subject=academic-partner-demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  {t('cta.secondaryButton')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 mx-auto max-w-4xl"
          >
            <img
              src={BRAND_IMAGES.forUniversities.hero}
              alt="University campus — education meets opportunity"
              className="w-full h-[280px] sm:h-[360px] object-cover rounded-2xl shadow-xl"
            />
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {t('steps.title')}
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              {t('steps.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => {
              const stepNum = String(i + 1).padStart(2, '0')
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  variants={fadeUp}
                  custom={i + 1}
                >
                  <Card className="h-full text-center border-none shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="pt-8 pb-6 px-6">
                      <div className="text-5xl font-bold text-primary/15 mb-3">{stepNum}</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {t(`steps.${i}.title`)}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {t(`steps.${i}.desc`)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Key Features ── */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {t('features.title')}
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              {t('features.subtitle')}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                custom={i}
              >
                <Card className="h-full border hover:border-primary/30 transition-colors">
                  <CardContent className="pt-6 pb-5 px-6">
                    <h3 className="text-base font-bold mb-1">
                      {t(`features.${i}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`features.${i}.desc`)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who It's For ── */}
      <section className="py-20 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {t('audience.title')}
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              {t('audience.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => {
              const stepNum = String(i + 1).padStart(2, '0')
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  variants={fadeUp}
                  custom={i + 1}
                >
                  <Card className="h-full text-center border-none shadow-md">
                    <CardContent className="pt-8 pb-6 px-6">
                      <div className="text-5xl font-bold text-primary/15 mb-3">{stepNum}</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {t(`audience.${i}.title`)}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {t(`audience.${i}.desc`)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-primary text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
            <p className="text-blue-200 mb-8 max-w-xl mx-auto">
              {t('cta.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register?role=UNIVERSITY">
                <Button
                  size="lg"
                  className="bg-white text-blue-900 hover:bg-primary/5 w-full sm:w-auto"
                >
                  {t('cta.primaryButton')}
                </Button>
              </Link>
              <Link href="/contact?subject=academic-partner-demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  {t('cta.secondaryButton')}
                </Button>
              </Link>
            </div>

          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
