'use client'

import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileX2, Code2, TrendingUp, Users, Shield, Zap, Target, Heart } from 'lucide-react'
import Link from 'next/link'
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
              <p className="text-xl text-gray-700 leading-relaxed whitespace-pre-line">
                {t('hero.description')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
              <Card className="bg-white hover:shadow-lg transition-shadow h-full">
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
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{t('resumeProblem.title')}</h3>
                  <ul className="space-y-2 text-gray-700">
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
              <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 hover:shadow-lg transition-shadow h-full">
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
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{t('intransparencyWay.title')}</h3>
                  <ul className="space-y-2 text-gray-700">
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
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
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
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {t('whyDifferent.titleHighlight')}
                </span>
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
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
                <Card className="bg-gray-50 border-2 border-gray-200 h-full">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <FileX2 className="h-6 w-6" />
                      {t('whyDifferent.challenge.title')}
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <span className="text-gray-600 font-bold">→</span>
                        <div>
                          <strong className="text-gray-900">{t('whyDifferent.challenge.items.0.title')}</strong>
                          <p className="text-gray-700 text-sm">{t('whyDifferent.challenge.items.0.description')}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gray-600 font-bold">→</span>
                        <div>
                          <strong className="text-gray-900">{t('whyDifferent.challenge.items.1.title')}</strong>
                          <p className="text-gray-700 text-sm">{t('whyDifferent.challenge.items.1.description')}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gray-600 font-bold">→</span>
                        <div>
                          <strong className="text-gray-900">{t('whyDifferent.challenge.items.2.title')}</strong>
                          <p className="text-gray-700 text-sm">{t('whyDifferent.challenge.items.2.description')}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gray-600 font-bold">→</span>
                        <div>
                          <strong className="text-gray-900">{t('whyDifferent.challenge.items.3.title')}</strong>
                          <p className="text-gray-700 text-sm">{t('whyDifferent.challenge.items.3.description')}</p>
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
                <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300 h-full">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-green-900 mb-6 flex items-center gap-2">
                      <Shield className="h-6 w-6" />
                      {t('whyDifferent.solution.title')}
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 font-bold">✅</span>
                        <div>
                          <strong className="text-green-900">{t('whyDifferent.solution.items.0.title')}</strong>
                          <p className="text-gray-700 text-sm">{t('whyDifferent.solution.items.0.description')}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 font-bold">✅</span>
                        <div>
                          <strong className="text-green-900">{t('whyDifferent.solution.items.1.title')}</strong>
                          <p className="text-gray-700 text-sm">{t('whyDifferent.solution.items.1.description')}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 font-bold">✅</span>
                        <div>
                          <strong className="text-green-900">{t('whyDifferent.solution.items.2.title')}</strong>
                          <p className="text-gray-700 text-sm">{t('whyDifferent.solution.items.2.description')}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 font-bold">✅</span>
                        <div>
                          <strong className="text-green-900">{t('whyDifferent.solution.items.3.title')}</strong>
                          <p className="text-gray-700 text-sm">{t('whyDifferent.solution.items.3.description')}</p>
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
              <Card className="bg-gradient-to-r from-primary to-secondary text-white">
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
              <p className="text-xl text-gray-700 leading-relaxed">
                {t('mission.description')}
              </p>
            </motion.div>

            <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-12 text-white text-center mb-16">
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
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('mission.story.paragraphs.0')}
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                {t('mission.story.paragraphs.1')}
              </p>
              <p className="text-gray-700 leading-relaxed mb-8">
                {t('mission.story.paragraphs.2')}
              </p>
              <p className="text-gray-700 leading-relaxed font-semibold">
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
                    whileHover={{ y: -5 }}
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
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {value.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
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
        {/* TODO: Add translations for businessModel section */}
        <section className="py-20 hero-bg">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
            <h2 className="text-4xl font-display font-bold text-foreground text-center mb-4">
              Why Is Everything Free?
            </h2>
            <p className="text-xl text-gray-700 text-center mb-12">
              We believe talent shouldn't be locked behind paywalls
            </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="bg-white">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-4">🎓</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Students: Freemium
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Core features included. Build your verified portfolio.
                  </p>
                  <div className="text-sm text-gray-600 bg-green-50 rounded-lg p-3">
                    <strong>Premium options:</strong> Priority visibility, advanced analytics
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-4">🏫</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Universities: Freemium
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Verify student projects. Track placements.
                  </p>
                  <div className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3">
                    <strong>Enterprise:</strong> API integrations, white-label, custom features
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-4">💼</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Companies: Pay Per Contact
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Browse profiles. Pay when you reach out.
                  </p>
                  <div className="text-sm text-gray-600 bg-purple-50 rounded-lg p-3">
                    <strong>Enterprise:</strong> API access, ATS integration
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-primary to-secondary text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-display font-bold mb-4 text-center">The Philosophy</h3>
                <div className="space-y-4 text-white">
                  <p className="leading-relaxed">
                    <strong>Students shouldn't pay to get hired.</strong> Traditional platforms charge students for premium features to be visible. We believe that's backwards. Students create the value—they should access everything for free.
                  </p>
                  <p className="leading-relaxed">
                    <strong>Universities shouldn't pay to help students.</strong> Institutions want to support their students' career success. Our core platform is always free—not "year 1 free." Save 40+ hours/month on manual matching. Pay only for optional customizations (API, white-label, custom features).
                  </p>
                  <p className="leading-relaxed">
                    <strong>Companies should pay only for results.</strong> No more $8,000/year subscriptions before finding anyone. Browse our entire database free. Pay €10 only when you find someone worth contacting. Fair, transparent, performance-based.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Our Vision */}
        {/* TODO: Add translations for vision section */}
        <section className="py-20 hero-bg">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
            <h2 className="text-4xl font-display font-bold text-foreground text-center mb-4">
              Join Us in Early Access
            </h2>
            <p className="text-xl text-gray-700 text-center mb-16">
              We're building the future of student recruitment - be among the first to shape it
            </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                { emoji: '🚀', label: 'Launch in 2025', sublabel: 'Be among the first users' },
                { emoji: '🎓', label: 'Students First', sublabel: 'Freemium for students' },
                { emoji: '🤝', label: 'Build Together', sublabel: 'Shape features with us' }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="text-center"
                >
                  <div className="text-5xl mb-4">{stat.emoji}</div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-700">{stat.sublabel}</div>
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
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-4">
                  Help Us Build the Platform
                </h3>
                <p className="text-gray-800 mb-6 leading-relaxed max-w-2xl mx-auto">
                  We're in early development and looking for students, universities, and companies to help shape the platform. Your feedback will directly influence what we build.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg" asChild>
                    <Link href="/auth/register">Get Started Free</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/contact">Partner With Us</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </div>
        </section>

        {/* The Enemy: Resumes */}
        {/* TODO: Add translations for killResume section */}
        <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="container max-w-4xl text-center">
            <h2 className="text-4xl font-bold mb-6">
              It's Time to Kill the Resume
            </h2>
            <p className="text-xl text-gray-100 leading-relaxed mb-8 max-w-2xl mx-auto">
              Resumes were invented in 1482. We have AI, complete skill analysis, and institution verification now. Why are we still using a 500-year-old tool to hire for 21st-century jobs?
            </p>

            <div className="bg-white bg-opacity-10 rounded-xl p-8 backdrop-blur-sm mb-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="text-red-400 text-4xl font-bold mb-2">1482</div>
                  <div className="text-gray-100">Year resumes were invented</div>
                </div>
                <div>
                  <div className="text-green-400 text-4xl font-bold mb-2">2025</div>
                  <div className="text-gray-100">Time for verified project portfolios</div>
                </div>
              </div>
            </div>

            <p className="text-lg text-gray-100 mb-8">
              Students deserve to be judged on what they've built, not how well they write bullet points. Companies deserve to hire based on verified skills, not polished claims.
            </p>

            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100" asChild>
              <Link href="/auth/register">
                Get Started Free - Show Your Work
              </Link>
            </Button>
          </div>
        </section>

        {/* Join Us */}
        {/* TODO: Add translations for joinMovement section */}
        <section className="py-20 hero-bg">
          <div className="container max-w-4xl text-center">
            <h2 className="text-4xl font-display font-bold text-foreground mb-6">
              Join the Movement
            </h2>
            <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
              We're just getting started. Help us build a world where talent beats pedigree, and proof beats promises.
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg" asChild>
                <Link href="/auth/register">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/how-it-works">See How It Works</Link>
              </Button>
            </div>

            <p className="mt-8 text-sm text-gray-700">
              For companies: <Link href="/auth/register" className="text-primary hover:underline font-medium">Browse free, pay only for contacts →</Link>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
