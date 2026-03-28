'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const universityFaculties = [
  {
    name: 'Ingegneria e STEM',
    skills: ['Software Development', 'Data Science', 'Machine Learning', 'Cloud Computing'],
    avgPlacement: 89
  },
  {
    name: 'Economia e Management',
    skills: ['Financial Analysis', 'Business Strategy', 'Marketing', 'Consulting'],
    avgPlacement: 82
  },
  {
    name: 'Giurisprudenza',
    skills: ['Legal Research', 'Contract Law', 'Corporate Law', 'Compliance'],
    avgPlacement: 75
  },
  {
    name: 'Design e Comunicazione',
    skills: ['UX/UI Design', 'Graphic Design', 'Digital Marketing', 'Brand Strategy'],
    avgPlacement: 78
  },
  {
    name: 'Scienze Umanistiche',
    skills: ['Content Writing', 'Research', 'Cultural Analysis', 'Education'],
    avgPlacement: 68
  }
]

export default function PerUniversitaPage() {
  const t = useTranslations('perUniversita')
  const [selectedFaculty, setSelectedFaculty] = useState(universityFaculties[0])

  return (
    <div className="min-h-screen segment-university hero-bg">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-primary text-white">
              {t('heroBadge')}
            </Badge>
            <h1 className="text-5xl font-display font-bold mb-6">
              {t('heroTitle')}{' '}
              <span className="text-primary">
                {t('heroTitleHighlight')}
              </span>
            </h1>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto mb-4">
              {t('heroDescription')}
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {t('heroSubtext')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 shadow-lg"
                asChild
              >
                <Link href="/auth/register?role=institution">
                  {t('registerInstitution')}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
              >
                <Link href="/pricing">
                  {t('seeHowItWorks')}
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* How It Benefits Universities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-8">
              {t('howMarketplaceHelps')}
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{t('mp1Title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <ul className="space-y-2 list-disc list-inside">
                    <li>{t('mp1Check1')}</li>
                    <li>{t('mp1Check2')}</li>
                    <li>{t('mp1Check3')}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{t('mp2Title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <ul className="space-y-2 list-disc list-inside">
                    <li>{t('mp2Check1')}</li>
                    <li>{t('mp2Check2')}</li>
                    <li>{t('mp2Check3')}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{t('mp3Title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <ul className="space-y-2 list-disc list-inside">
                    <li>{t('mp3Check1')}</li>
                    <li>{t('mp3Check2')}</li>
                    <li>{t('mp3Check3')}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Faculty Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-4">
              {t('facultiesTitle')}
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('facultiesSubtitle')}
            </p>

            {/* Faculty Selector */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {universityFaculties.map((faculty) => (
                <button
                  key={faculty.name}
                  onClick={() => setSelectedFaculty(faculty)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedFaculty.name === faculty.name
                      ? 'bg-primary text-white shadow-md'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted bg-card border border-border'
                  }`}
                >
                  {faculty.name}
                </button>
              ))}
            </div>

            {/* Selected Faculty Details */}
            <Card className="bg-primary/5 border-2 border-primary/20">
              <CardContent className="py-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                      {selectedFaculty.name}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold text-foreground mb-2">{t('skillsCompaniesSeek')}</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedFaculty.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="bg-card">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">{t('howGradsGetHired')}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-3">
                        {[
                          { title: t('hireStep1'), desc: t('hireStep1Desc') },
                          { title: t('hireStep2'), desc: t('hireStep2Desc') },
                          { title: t('hireStep3'), desc: t('hireStep3Desc', { skill: selectedFaculty.skills[0] }) },
                          { title: t('hireStep4'), desc: t('hireStep4Desc') },
                        ].map((step, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <span className="text-lg font-bold text-primary/30 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                            <div>
                              <p className="font-semibold">{step.title}</p>
                              <p className="text-xs text-muted-foreground">{step.desc}</p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Why Choose Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-8">
              {t('whyChooseTitle')}
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-primary/20">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{t('why1Title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <ul className="space-y-2 list-disc list-inside">
                    <li>{t('why1Check1')}</li>
                    <li>{t('why1Check2')}</li>
                    <li>{t('why1Check3')}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{t('why2Title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <ul className="space-y-2 list-disc list-inside">
                    <li>{t('why2Check1')}</li>
                    <li>{t('why2Check2')}</li>
                    <li>{t('why2Check3')}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{t('why3Title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <ul className="space-y-2 list-disc list-inside">
                    <li>{t('why3Check1')}</li>
                    <li>{t('why3Check2')}</li>
                    <li>{t('why3Check3')}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Get Started */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <Card className="bg-primary border-0 text-white">
              <CardContent className="py-12">
                <h3 className="text-3xl font-display font-bold text-center mb-8">
                  {t('getStartedSteps')}
                </h3>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {[
                    { num: '01', title: t('gs1Title'), desc: t('gs1Desc') },
                    { num: '02', title: t('gs2Title'), desc: t('gs2Desc') },
                    { num: '03', title: t('gs3Title'), desc: t('gs3Desc') },
                  ].map((step) => (
                    <div key={step.num} className="text-center">
                      <div className="text-5xl font-bold text-white/15 mb-2">{step.num}</div>
                      <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                      <p className="text-white/90 text-sm">{step.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <Button
                    size="lg"
                    variant="secondary"
                    asChild
                    className="shadow-lg"
                  >
                    <Link href="/auth/register?role=institution">
                      {t('registerFree')}
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  <p className="text-sm text-white/80 mt-4">
                    {t('setupNote')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Card className="bg-primary/5 border-2 border-primary/20">
              <CardContent className="py-12">
                <h3 className="text-3xl font-display font-bold text-foreground mb-4">
                  {t('finalCtaTitle')}
                </h3>
                <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
                  {t('finalCtaDescription')}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 shadow-lg"
                    asChild
                  >
                    <Link href="/auth/register?role=institution">
                      {t('registerInstitutionFree')}
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                  >
                    <Link href="/contact">
                      {t('talkToUs')}
                    </Link>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-6">
                  {t('finalNote')}
                </p>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
