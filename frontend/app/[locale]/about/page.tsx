'use client'

import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileX2, Code2, TrendingUp, Users, Shield, Zap, Target, Heart } from 'lucide-react'
import { Link } from '@/navigation'
import Image from 'next/image'
import { IMAGES } from '@/lib/images'
import { motion } from 'framer-motion'

export default function AboutPage() {
  const t = useTranslations('about')
  return (
    <div className="min-h-screen hero-bg">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section - The Problem */}
        <section className="hero-bg py-20 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-5">
            <Image
              src={IMAGES.students.student2}
              alt="Background pattern"
              fill
              className="object-cover"
            />
          </div>
          <div className="container max-w-4xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                {t('hero.badge')}
              </div>
              <h1 className="text-5xl font-display font-bold text-foreground mb-6">
                {t('hero.title')}
              </h1>
              <p className="text-xl text-foreground/80 leading-relaxed whitespace-pre-line">
                {t('hero.description')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
              <Card className="bg-card hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-8">
                  <div className="relative w-16 h-16 mb-4 rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={IMAGES.students.student3}
                      alt="Resume Problem"
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{t('resumeProblem.title')}</h3>
                  <ul className="space-y-2 text-foreground/80">
                    <li>{t('resumeProblem.items.0')}</li>
                    <li>{t('resumeProblem.items.1')}</li>
                    <li>{t('resumeProblem.items.2')}</li>
                    <li>{t('resumeProblem.items.3')}</li>
                    <li>{t('resumeProblem.items.4')}</li>
                  </ul>
                </CardContent>
              </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
              <Card className="bg-primary/5 border-2 border-primary/20 hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-8">
                  <div className="relative w-16 h-16 mb-4 rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={IMAGES.features.aiAnalysis}
                      alt="InTransparency Way"
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{t('intransparencyWay.title')}</h3>
                  <ul className="space-y-2 text-foreground/80">
                    <li>{t('intransparencyWay.items.0')}</li>
                    <li>{t('intransparencyWay.items.1')}</li>
                    <li>{t('intransparencyWay.items.2')}</li>
                    <li>{t('intransparencyWay.items.3')}</li>
                    <li>{t('intransparencyWay.items.4')}</li>
                  </ul>
                </CardContent>
              </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why We're Different - Against Opaque Competitors */}
        <section className="py-20 bg-gradient-to-br from-muted/50 to-white">
          <div className="container max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                {t('whyDifferent.badge')}
              </div>
              <h2 className="text-4xl font-display font-bold text-foreground mb-4">
                {t('whyDifferent.title')}{' '}
                <span className="text-primary">
                  {t('whyDifferent.titleHighlight')}
                </span>
              </h2>
              <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
                {t('whyDifferent.subtitle')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="bg-muted border-2 border-border h-full">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                      <FileX2 className="h-6 w-6" />
                      {t('whyDifferent.challenge.title')}
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <span className="text-muted-foreground font-bold">→</span>
                        <div>
                          <strong className="text-foreground">{t('whyDifferent.challenge.items.0.title')}</strong>
                          <p className="text-foreground/80 text-sm">{t('whyDifferent.challenge.items.0.description')}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-muted-foreground font-bold">→</span>
                        <div>
                          <strong className="text-foreground">{t('whyDifferent.challenge.items.1.title')}</strong>
                          <p className="text-foreground/80 text-sm">{t('whyDifferent.challenge.items.1.description')}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-muted-foreground font-bold">→</span>
                        <div>
                          <strong className="text-foreground">{t('whyDifferent.challenge.items.2.title')}</strong>
                          <p className="text-foreground/80 text-sm">{t('whyDifferent.challenge.items.2.description')}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-muted-foreground font-bold">→</span>
                        <div>
                          <strong className="text-foreground">{t('whyDifferent.challenge.items.3.title')}</strong>
                          <p className="text-foreground/80 text-sm">{t('whyDifferent.challenge.items.3.description')}</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="bg-primary/5 border-2 border-primary/20 h-full">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                      <Shield className="h-6 w-6" />
                      {t('whyDifferent.solution.title')}
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold">✅</span>
                        <div>
                          <strong className="text-foreground">{t('whyDifferent.solution.items.0.title')}</strong>
                          <p className="text-foreground/80 text-sm">{t('whyDifferent.solution.items.0.description')}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold">✅</span>
                        <div>
                          <strong className="text-foreground">{t('whyDifferent.solution.items.1.title')}</strong>
                          <p className="text-foreground/80 text-sm">{t('whyDifferent.solution.items.1.description')}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold">✅</span>
                        <div>
                          <strong className="text-foreground">{t('whyDifferent.solution.items.2.title')}</strong>
                          <p className="text-foreground/80 text-sm">{t('whyDifferent.solution.items.2.description')}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold">✅</span>
                        <div>
                          <strong className="text-foreground">{t('whyDifferent.solution.items.3.title')}</strong>
                          <p className="text-foreground/80 text-sm">{t('whyDifferent.solution.items.3.description')}</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-display font-bold mb-4">{t('whyDifferent.result.title')}</h3>
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <div className="text-4xl font-bold mb-2">{t('whyDifferent.result.metrics.0.value')}</div>
                      <div className="text-white/90">{t('whyDifferent.result.metrics.0.label')}</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold mb-2">{t('whyDifferent.result.metrics.1.value')}</div>
                      <div className="text-white/90">{t('whyDifferent.result.metrics.1.label')}</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold mb-2">{t('whyDifferent.result.metrics.2.value')}</div>
                      <div className="text-white/90">{t('whyDifferent.result.metrics.2.label')}</div>
                    </div>
                  </div>
                  <p className="text-white/90 text-lg">
                    {t('whyDifferent.result.tagline')}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-20 hero-bg relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-5">
            <Image
              src={IMAGES.hero.students}
              alt="Background pattern"
              fill
              className="object-cover"
            />
          </div>
          <div className="container max-w-4xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-display font-bold text-foreground mb-4">
                {t('mission.title')}
              </h2>
              <p className="text-xl text-foreground/80 leading-relaxed">
                {t('mission.description')}
              </p>
            </motion.div>

            <div className="bg-primary rounded-2xl p-12 text-white text-center mb-16">
              <blockquote className="text-2xl font-medium italic mb-4">
                {t('mission.quote')}
              </blockquote>
              <p className="text-white/80">
                {t('mission.quoteAuthor')}
              </p>
            </div>

            {/* Our Story */}
            <div className="prose prose-lg max-w-none">
              <h3 className="text-2xl font-display font-bold text-foreground mb-4">{t('mission.story.title')}</h3>
              <p className="text-foreground/80 leading-relaxed mb-4">
                {t('mission.story.paragraphs.0')}
              </p>
              <p className="text-foreground/80 leading-relaxed mb-4">
                {t('mission.story.paragraphs.1')}
              </p>
              <p className="text-foreground/80 leading-relaxed mb-8">
                {t('mission.story.paragraphs.2')}
              </p>
              <p className="text-foreground/80 leading-relaxed font-semibold">
                {t('mission.story.paragraphs.3')}
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 hero-bg">
          <div className="container max-w-6xl">
            <h2 className="text-4xl font-display font-bold text-foreground text-center mb-16">
              {t('values.title')}
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  image: IMAGES.students.student5,
                  title: t('values.items.0.title'),
                  description: t('values.items.0.description')
                },
                {
                  image: IMAGES.companies.office2,
                  title: t('values.items.1.title'),
                  description: t('values.items.1.description')
                },
                {
                  image: IMAGES.features.collaboration,
                  title: t('values.items.2.title'),
                  description: t('values.items.2.description')
                },
                {
                  image: IMAGES.success.handshake,
                  title: t('values.items.3.title'),
                  description: t('values.items.3.description')
                }
              ].map((value, idx) => {
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}

                  >
                  <Card className="text-center hover:shadow-lg transition-shadow h-full">
                    <CardContent className="p-8">
                      <div className="relative w-16 h-16 mx-auto mb-4 rounded-lg overflow-hidden shadow-md">
                        <Image
                          src={value.image}
                          alt={value.title}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        {value.title}
                      </h3>
                      <p className="text-foreground/80 leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Our Business Model */}
        <section className="py-20 hero-bg">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
            <h2 className="text-4xl font-display font-bold text-foreground text-center mb-4">
              {t('businessModel.title')}
            </h2>
            <p className="text-xl text-foreground/80 text-center mb-12">
              {t('businessModel.subtitle')}
            </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="bg-card">
                <CardContent className="p-8 text-center">
                  <div className="relative w-16 h-16 mx-auto mb-4 rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={IMAGES.students.student5}
                      alt={t('businessModel.students.title')}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {t('businessModel.students.title')}
                  </h3>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    {t('businessModel.students.description')}
                  </p>
                  <div className="text-sm text-muted-foreground bg-primary/5 rounded-lg p-3">
                    <strong>{t('businessModel.students.premiumLabel')}</strong> {t('businessModel.students.premiumDescription')}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardContent className="p-8 text-center">
                  <div className="relative w-16 h-16 mx-auto mb-4 rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={IMAGES.companies.office2}
                      alt={t('businessModel.universities.title')}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {t('businessModel.universities.title')}
                  </h3>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    {t('businessModel.universities.description')}
                  </p>
                  <div className="text-sm text-muted-foreground bg-primary/5 rounded-lg p-3">
                    <strong>{t('businessModel.universities.enterpriseLabel')}</strong> {t('businessModel.universities.enterpriseDescription')}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardContent className="p-8 text-center">
                  <div className="relative w-16 h-16 mx-auto mb-4 rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={IMAGES.success.handshake}
                      alt={t('businessModel.companies.title')}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {t('businessModel.companies.title')}
                  </h3>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    {t('businessModel.companies.description')}
                  </p>
                  <div className="text-sm text-muted-foreground bg-primary/5 rounded-lg p-3">
                    <strong>{t('businessModel.companies.enterpriseLabel')}</strong> {t('businessModel.companies.enterpriseDescription')}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-8">
                <h3 className="text-2xl font-display font-bold mb-4 text-center">{t('businessModel.philosophy.title')}</h3>
                <div className="space-y-4 text-white">
                  <p className="leading-relaxed">
                    <strong>{t('businessModel.philosophy.studentsBold')}</strong> {t('businessModel.philosophy.studentsText')}
                  </p>
                  <p className="leading-relaxed">
                    <strong>{t('businessModel.philosophy.universitiesBold')}</strong> {t('businessModel.philosophy.universitiesText')}
                  </p>
                  <p className="leading-relaxed">
                    <strong>{t('businessModel.philosophy.companiesBold')}</strong> {t('businessModel.philosophy.companiesText')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Our Vision */}
        <section className="py-20 hero-bg">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
            <h2 className="text-4xl font-display font-bold text-foreground text-center mb-4">
              {t('vision.title')}
            </h2>
            <p className="text-xl text-foreground/80 text-center mb-16">
              {t('vision.subtitle')}
            </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                { icon: <Zap className="h-8 w-8 text-primary" />, label: t('vision.stats.0.label'), sublabel: t('vision.stats.0.sublabel') },
                { icon: <Target className="h-8 w-8 text-primary" />, label: t('vision.stats.1.label'), sublabel: t('vision.stats.1.sublabel') },
                { icon: <Users className="h-8 w-8 text-primary" />, label: t('vision.stats.2.label'), sublabel: t('vision.stats.2.sublabel') }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">{stat.icon}</div>
                  <div className="text-lg font-semibold text-foreground mb-1">{stat.label}</div>
                  <div className="text-sm text-foreground/80">{stat.sublabel}</div>
                </motion.div>
              ))}
            </div>

            {/* Early Access CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
            <Card className="bg-primary/5 border-primary/20 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-display font-bold text-foreground mb-4">
                  {t('vision.cta.title')}
                </h3>
                <p className="text-foreground mb-6 leading-relaxed max-w-2xl mx-auto">
                  {t('vision.cta.description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-primary hover:bg-primary/90" asChild>
                    <Link href="/auth/register">{t('vision.cta.primaryButton')}</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/contact">{t('vision.cta.secondaryButton')}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </div>
        </section>

        {/* The Enemy: Resumes */}
        <section className="py-20 bg-foreground text-white">
          <div className="container max-w-4xl text-center">
            <h2 className="text-4xl font-bold mb-6">
              {t('killResume.title')}
            </h2>
            <p className="text-xl text-gray-100 leading-relaxed mb-8 max-w-2xl mx-auto">
              {t('killResume.description')}
            </p>

            <div className="bg-white bg-opacity-10 rounded-xl p-8 backdrop-blur-sm mb-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="text-red-400 text-4xl font-bold mb-2">{t('killResume.oldYear')}</div>
                  <div className="text-gray-100">{t('killResume.oldLabel')}</div>
                </div>
                <div>
                  <div className="text-green-400 text-4xl font-bold mb-2">{t('killResume.newYear')}</div>
                  <div className="text-gray-100">{t('killResume.newLabel')}</div>
                </div>
              </div>
            </div>

            <p className="text-lg text-gray-100 mb-8">
              {t('killResume.closing')}
            </p>

            <Button size="lg" className="bg-card text-foreground hover:bg-muted" asChild>
              <Link href="/auth/register">
                {t('killResume.cta')}
              </Link>
            </Button>
          </div>
        </section>

        {/* Join Us */}
        <section className="py-20 hero-bg">
          <div className="container max-w-4xl text-center">
            <h2 className="text-4xl font-display font-bold text-foreground mb-6">
              {t('joinMovement.title')}
            </h2>
            <p className="text-xl text-foreground/80 mb-12 max-w-2xl mx-auto">
              {t('joinMovement.description')}
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                <Link href="/auth/register">{t('joinMovement.primaryButton')}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/how-it-works">{t('joinMovement.secondaryButton')}</Link>
              </Button>
            </div>

            <p className="mt-8 text-sm text-foreground/80">
              {t('joinMovement.companiesPrefix')} <Link href="/auth/register" className="text-primary hover:underline font-medium">{t('joinMovement.companiesLink')}</Link>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
