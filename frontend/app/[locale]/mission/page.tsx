'use client'

import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from '@/navigation'
import { motion } from 'framer-motion'
import { BRAND_IMAGES } from '@/lib/brand-images'
import { Target, BadgeCheck, Heart, Scale, Award, DollarSign, Users, Building2, GraduationCap, Briefcase, TrendingUp, Compass } from 'lucide-react'
import { useSegment } from '@/lib/segment-context'
import { FloatingTransparenty } from '@/components/mascot/FloatingTransparenty'

const segmentHero = {
  students: {
    badge: 'For Students',
    badgeIt: 'Per gli Studenti',
    title: 'Your Skills Deserve',
    titleIt: 'Le Tue Competenze Meritano',
    highlight: 'to Be Seen',
    highlightIt: 'di Essere Viste',
    description: 'We believe every student should be valued for what they can actually do — not just where they studied. InTransparency makes your verified projects and real skills visible to companies looking for exactly what you offer.',
    descriptionIt: 'Crediamo che ogni studente debba essere valorizzato per ciò che sa fare davvero — non solo per dove ha studiato. InTransparency rende i tuoi progetti verificati e le tue competenze reali visibili alle aziende che cercano esattamente ciò che offri.',
    cta: '/auth/register?role=student',
    ctaLabel: 'Build Your Portfolio',
    ctaLabelIt: 'Crea il Tuo Portfolio',
  },
  institutions: {
    badge: 'For Institutions',
    badgeIt: 'Per le Istituzioni',
    title: 'Help Your Students',
    titleIt: 'Aiuta i Tuoi Studenti a',
    highlight: 'Launch Their Careers',
    highlightIt: 'Lanciare la Loro Carriera',
    description: 'Your institution invests in quality education. InTransparency helps you close the loop — verify student skills, connect them with employers, and track placement outcomes. All for free.',
    descriptionIt: 'La tua istituzione investe nella qualità della formazione. InTransparency ti aiuta a chiudere il cerchio — verifica le competenze degli studenti, collegali alle aziende e traccia i risultati di placement. Tutto gratuitamente.',
    cta: '/per-scuole-superiori',
    ctaLabel: 'See How It Works',
    ctaLabelIt: 'Scopri Come Funziona',
  },
  companies: {
    badge: 'For Companies',
    badgeIt: 'Per le Aziende',
    title: 'Find Talent Based on',
    titleIt: 'Trova Talenti Basandoti su',
    highlight: 'Real, Verified Skills',
    highlightIt: 'Competenze Reali e Verificate',
    description: 'Hiring shouldn\'t be guesswork. InTransparency gives you access to candidates with institution-verified skills and real project portfolios — so you can make confident decisions faster.',
    descriptionIt: 'Assumere non dovrebbe essere un\'incognita. InTransparency ti dà accesso a candidati con competenze verificate dalle istituzioni e portfolio di progetti reali — per decisioni più rapide e sicure.',
    cta: '/explore',
    ctaLabel: 'Search Verified Talent',
    ctaLabelIt: 'Cerca Talenti Verificati',
  },
}

export default function MissionPage() {
  const t = useTranslations('mission')
  const { segment } = useSegment()
  const hero = segmentHero[segment]

  // Detect language from translations
  const isItalian = t('hero.badge') === 'La Nostra Missione'

  const positionIcons = [Target, Scale, Heart, BadgeCheck]
  const valueIcons = [Compass, Award, Users, Target]

  return (
    <div className="min-h-screen hero-bg">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section — with real image */}
        <section className="py-16 relative overflow-hidden">
          <img src={BRAND_IMAGES.about.hero} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white/95" />
          <div className="container max-w-4xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                {isItalian ? hero.badgeIt : hero.badge}
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
                {isItalian ? hero.titleIt : hero.title}{' '}
                <span className="text-primary">
                  {isItalian ? hero.highlightIt : hero.highlight}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
                {isItalian ? hero.descriptionIt : hero.description}
              </p>
              <Button size="lg" asChild>
                <Link href={hero.cta}>
                  {isItalian ? hero.ctaLabelIt : hero.ctaLabel}
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* The Broader Mission — shared across segments */}
        <section className="py-16">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-display font-bold text-foreground mb-4">
                {isItalian ? 'Collegare Formazione e Lavoro' : 'Bridging Education and Work'}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {isItalian
                  ? 'Il passaggio dagli studi alla carriera dovrebbe valorizzare le competenze reali. InTransparency rende questo percorso più trasparente per tutti.'
                  : 'The transition from education to career should reward real skills. InTransparency makes this journey more transparent for everyone.'}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: GraduationCap,
                  title: isItalian ? 'Per gli Studenti' : 'For Students',
                  text: isItalian
                    ? 'Portfolio verificati che mostrano ciò che sai fare davvero, non solo dove hai studiato.'
                    : 'Verified portfolios that showcase what you can actually do, not just where you studied.',
                },
                {
                  icon: Building2,
                  title: isItalian ? 'Per le Istituzioni' : 'For Institutions',
                  text: isItalian
                    ? 'Strumenti gratuiti per verificare competenze, collegare studenti alle aziende e tracciare i risultati.'
                    : 'Free tools to verify skills, connect students to employers, and track placement outcomes.',
                },
                {
                  icon: Briefcase,
                  title: isItalian ? 'Per le Aziende' : 'For Companies',
                  text: isItalian
                    ? 'Accesso a talenti con competenze verificate dalle istituzioni. Assumi con fiducia.'
                    : 'Access talent with institution-verified skills. Hire with confidence.',
                },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="h-full text-center">
                      <CardContent className="p-6">
                        <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.text}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Our Vision */}
        <section className="py-16 bg-muted/30">
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
              <h2 className="text-3xl font-display font-bold text-foreground">
                {t('position.title')}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {[0, 1, 2, 3].map((i) => {
                const Icon = positionIcons[i]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {t(`position.points.${i}.title`)}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
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
        <section className="py-16">
          <div className="container max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-display font-bold text-foreground">
                {t('values.title')}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {[0, 1, 2, 3].map((i) => {
                const Icon = valueIcons[i]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="inline-flex p-3 rounded-xl bg-primary/10 flex-shrink-0">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground mb-2">
                              {t(`values.items.${i}.title`)}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
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
        <section className="py-16">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-primary text-white">
                <CardContent className="p-10 text-center">
                  <h2 className="text-3xl font-display font-bold mb-4">
                    {t('cta.title')}
                  </h2>
                  <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                    {t('cta.subtitle')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="bg-white text-foreground hover:bg-white/90" asChild>
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
      <FloatingTransparenty />
    </div>
  )
}
