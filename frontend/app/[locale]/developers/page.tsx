'use client'

import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/navigation'
import { motion } from 'framer-motion'
import {
  Users,
  Search,
  BarChart3,
  Bell,
  Key,
  Code2,
  FileJson,
  Server,
  Gauge,
} from 'lucide-react'

const endpointCards = [
  { key: 'students' as const, icon: Users },
  { key: 'search' as const, icon: Search },
  { key: 'placements' as const, icon: BarChart3 },
  { key: 'webhooks' as const, icon: Bell },
]

const comingSoonIcons = [Code2, FileJson, Server, Gauge]

export default function DevelopersPage() {
  const t = useTranslations('developers')

  return (
    <div className="min-h-screen hero-bg">
      <Header />

      <main className="pb-16">
        {/* Hero */}
        <section className="relative overflow-hidden bg-foreground text-white">
          <img
            src="/images/brand/office.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-primary/60" />
          <div className="relative container max-w-4xl mx-auto px-4 py-16 lg:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="inline-block bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                {t('hero.badge')}
              </div>
              <h1 className="text-5xl font-display font-bold text-white mb-6">
                {t('hero.title')}
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
                {t('hero.description')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* API Overview */}
        <section className="py-16 bg-background">
          <div className="container max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-display font-bold text-foreground mb-4">
                {t('apiOverview.title')}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('apiOverview.description')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Endpoints */}
        <section id="endpoints" className="py-16 bg-muted/30">
          <div className="container max-w-5xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-display font-bold text-foreground mb-3">
                {t('endpoints.title')}
              </h2>
              <p className="text-muted-foreground">
                {t('endpoints.subtitle')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {endpointCards.map((card, i) => {
                const Icon = card.icon
                return (
                  <motion.div
                    key={card.key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-2.5 rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground mb-1">
                              {t(`endpoints.${card.key}.title`)}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {t(`endpoints.${card.key}.description`)}
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

        {/* Authentication */}
        <section className="py-16 bg-background">
          <div className="container max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-3xl font-display font-bold text-foreground">
                  {t('authentication.title')}
                </h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {t('authentication.description')}
              </p>
              <div className="bg-muted/50 rounded-lg p-6 border border-border">
                <ol className="space-y-3">
                  {[0, 1, 2].map((i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="flex-shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {i + 1}
                      </span>
                      {t(`authentication.steps.${i}`)}
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="py-16 bg-muted/30">
          <div className="container max-w-5xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <Badge variant="secondary" className="mb-4">{t('comingSoon.title')}</Badge>
              <h2 className="text-3xl font-display font-bold text-foreground mb-3">
                {t('comingSoon.title')}
              </h2>
              <p className="text-muted-foreground">
                {t('comingSoon.subtitle')}
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[0, 1, 2, 3].map((i) => {
                const Icon = comingSoonIcons[i]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <Card className="h-full border-dashed">
                      <CardContent className="p-5 text-center">
                        <div className="mx-auto mb-3 p-2.5 rounded-lg bg-muted w-fit">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-foreground text-sm mb-1">
                          {t(`comingSoon.items.${i}.title`)}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {t(`comingSoon.items.${i}.description`)}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-background">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-display font-bold text-foreground mb-4">
                {t('cta.title')}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t('cta.description')}
              </p>
              <Link href="/contact?subject=api-access">
                <Button size="lg" className="text-base px-8">
                  {t('cta.button')}
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
