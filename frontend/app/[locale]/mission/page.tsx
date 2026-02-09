'use client'

import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from '@/navigation'
import { motion } from 'framer-motion'
import { AlertTriangle, TrendingDown, DollarSign, Target, Shield, Heart, Scale, Award } from 'lucide-react'

export default function MissionPage() {
  const t = useTranslations('mission')

  const statIcons = [AlertTriangle, TrendingDown, DollarSign]
  const statColors = ['text-red-600', 'text-orange-600', 'text-yellow-600']
  const statBgs = ['bg-red-100', 'bg-orange-100', 'bg-yellow-100']

  const positionIcons = [Target, Scale, Heart, Shield]
  const positionColors = ['text-blue-600', 'text-green-600', 'text-purple-600', 'text-primary']
  const positionBgs = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-primary/10']

  const valueIcons = [Shield, Award, DollarSign, Target]

  return (
    <div className="min-h-screen hero-bg">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 opacity-50" />
          <div className="container max-w-4xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                {t('hero.badge')}
              </div>
              <h1 className="text-5xl font-display font-bold text-foreground mb-4">
                {t('hero.title')}{' '}
                <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  {t('hero.titleHighlight')}
                </span>
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
                {t('hero.description')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* The Problem - Stats */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                {t('problem.badge')}
              </div>
              <h2 className="text-4xl font-display font-bold text-foreground">
                {t('problem.title')}
              </h2>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[0, 1, 2].map((i) => {
                const Icon = statIcons[i]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                  >
                    <Card className="text-center h-full">
                      <CardContent className="p-8">
                        <div className={`inline-flex p-3 rounded-xl ${statBgs[i]} mb-4`}>
                          <Icon className={`h-6 w-6 ${statColors[i]}`} />
                        </div>
                        <div className="text-4xl font-bold text-gray-900 mb-2">
                          {t(`problem.stats.${i}.value`)}
                        </div>
                        <div className="text-gray-600">
                          {t(`problem.stats.${i}.label`)}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            {/* Problem Description */}
            <div className="max-w-3xl mx-auto space-y-6">
              {[0, 1, 2].map((i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-lg text-gray-700 leading-relaxed"
                >
                  {t(`problem.paragraphs.${i}`)}
                </motion.p>
              ))}
            </div>
          </div>
        </section>

        {/* Our Position */}
        <section className="py-20 hero-bg">
          <div className="container max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                {t('position.badge')}
              </div>
              <h2 className="text-4xl font-display font-bold text-foreground">
                {t('position.title')}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {[0, 1, 2, 3].map((i) => {
                const Icon = positionIcons[i]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardContent className="p-8">
                        <div className={`inline-flex p-3 rounded-xl ${positionBgs[i]} mb-4`}>
                          <Icon className={`h-6 w-6 ${positionColors[i]}`} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {t(`position.points.${i}.title`)}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {t(`position.points.${i}.description`)}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-display font-bold text-foreground">
                {t('values.title')}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {[0, 1, 2, 3].map((i) => {
                const Icon = valueIcons[i]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="bg-gradient-to-br from-white to-gray-50 h-full hover:shadow-lg transition-shadow">
                      <CardContent className="p-8">
                        <div className="flex items-start gap-4">
                          <div className="inline-flex p-3 rounded-xl bg-primary/10 flex-shrink-0">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {t(`values.items.${i}.title`)}
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                              {t(`values.items.${i}.description`)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 hero-bg">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-r from-primary to-secondary text-white">
                <CardContent className="p-12 text-center">
                  <h2 className="text-3xl font-display font-bold mb-4">
                    {t('cta.title')}
                  </h2>
                  <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                    {t('cta.subtitle')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100" asChild>
                      <Link href="/auth/register">{t('cta.primaryCTA')}</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                      <Link href="/how-it-works">{t('cta.secondaryCTA')}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
