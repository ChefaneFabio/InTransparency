'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import {
  GraduationCap,
  Upload,
  CheckCircle2,
  BarChart3,
  ClipboardCheck,
  Activity,
  Eye,
  Flame,
  ShieldCheck,
  BookOpen,
  Building2,
  School,
  ArrowRight,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
}

const steps = [
  { icon: Upload, key: 'onboard' },
  { icon: CheckCircle2, key: 'verify' },
  { icon: BarChart3, key: 'track' },
] as const

const features = [
  { icon: ClipboardCheck, key: 'batchVerification' },
  { icon: Activity, key: 'livePlacement' },
  { icon: Eye, key: 'studentVisibility' },
  { icon: Flame, key: 'skillsHeatmap' },
  { icon: ShieldCheck, key: 'gdpr' },
  { icon: BookOpen, key: 'ectsGrades' },
] as const

const audiences = [
  { icon: Building2, key: 'universities' },
  { icon: GraduationCap, key: 'its' },
  { icon: School, key: 'highSchools' },
] as const

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
              <GraduationCap className="h-3 w-3 mr-1" />
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
                  <GraduationCap className="h-5 w-5 mr-2" />
                  {t('hero.cta')}
                </Button>
              </Link>
              <Link href="/contact?subject=academic-partner-demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  {t('hero.demoCta')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
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
              {t('howItWorks.title')}
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              {t('howItWorks.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.key}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                custom={i + 1}
              >
                <Card className="h-full text-center border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-6 px-6">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <step.icon className="h-7 w-7 text-primary" />
                    </div>
                    <Badge variant="outline" className="mb-3 text-xs">
                      {t(`steps.${i}.badge`)}
                    </Badge>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t(`steps.${i}.title`)}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t(`steps.${i}.description`)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
            {features.map((feat, i) => (
              <motion.div
                key={feat.key}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                custom={i}
              >
                <Card className="h-full border hover:border-primary/30 transition-colors">
                  <CardContent className="pt-6 pb-5 px-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <feat.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1.5">
                      {t(`features.items.${feat.key}.title`)}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t(`features.items.${feat.key}.description`)}
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
            {audiences.map((aud, i) => (
              <motion.div
                key={aud.key}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                custom={i + 1}
              >
                <Card className="h-full text-center border-none shadow-md">
                  <CardContent className="pt-8 pb-6 px-6">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <aud.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t(`audience.types.${aud.key}.title`)}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t(`audience.types.${aud.key}.description`)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
                  <GraduationCap className="h-5 w-5 mr-2" />
                  {t('cta.registerButton')}
                </Button>
              </Link>
              <Link href="/contact?subject=academic-partner-demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  {t('cta.demoButton')}
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> {t('cta.badges.noIt')}
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> {t('cta.badges.gdpr')}
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> {t('cta.badges.quickSetup')}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
