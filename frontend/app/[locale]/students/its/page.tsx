'use client'

import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  ArrowRight,
  Briefcase,
  Shield,
  BookOpen,
  Wrench,
  FileCheck,
  Star,
  Award,
  TrendingUp
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Transparenty } from '@/components/mascot/Transparenty'

export default function ITSStudentsPage() {
  const t = useTranslations('studentsIts')

  return (
    <div className="min-h-screen hero-bg">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Transparenty size={90} mood="waving" />
            <Badge className="mt-4 mb-4 bg-primary text-white">
              {t('badge')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              {t('heroTitle')}{' '}
              <span className="text-primary">{t('heroTitleHighlight')}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
              {t('heroDescription')}
            </p>
            <p className="text-base text-muted-foreground max-w-xl mx-auto mb-8">
              {t('heroSubtext')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/auth/register?role=student">
                  {t('createProfile')}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/how-it-works">{t('howItWorks')}</Link>
              </Button>
            </div>
          </motion.div>

          {/* What you get */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center mb-8">
              {t('whatYouCanDo')}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Wrench,
                  title: t('card1Title'),
                  text: t('card1Text'),
                },
                {
                  icon: Star,
                  title: t('card2Title'),
                  text: t('card2Text'),
                },
                {
                  icon: Briefcase,
                  title: t('card3Title'),
                  text: t('card3Text'),
                },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <Card key={i} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="bg-primary/10 p-3 rounded-full w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </motion.div>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="py-10">
                <h3 className="text-2xl font-display font-bold text-center mb-8">
                  {t('stepsTitle')}
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                  {[
                    { step: '1', title: t('step1Title'), desc: t('step1Desc') },
                    { step: '2', title: t('step2Title'), desc: t('step2Desc') },
                    { step: '3', title: t('step3Title'), desc: t('step3Desc') },
                    { step: '4', title: t('step4Title'), desc: t('step4Desc') },
                  ].map((item) => (
                    <div key={item.step} className="text-center">
                      <div className="bg-white/20 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                        <span className="text-xl font-bold">{item.step}</span>
                      </div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm text-white/80">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ITS advantage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <Card className="bg-primary/5 border-2 border-primary/20">
              <CardContent className="py-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <Badge variant="secondary" className="mb-3">{t('itsLabel')}</Badge>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {t('itsTitle')}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {t('itsDescription')}
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>{t('itsCheck1')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>{t('itsCheck2')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>{t('itsCheck3')}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="text-center p-4">
                      <Award className="h-7 w-7 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">80%</div>
                      <div className="text-xs text-muted-foreground">{t('employmentRate')}</div>
                    </Card>
                    <Card className="text-center p-4">
                      <Wrench className="h-7 w-7 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">800h</div>
                      <div className="text-xs text-muted-foreground">{t('companyInternship')}</div>
                    </Card>
                    <Card className="text-center p-4">
                      <Shield className="h-7 w-7 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">100%</div>
                      <div className="text-xs text-muted-foreground">{t('verified')}</div>
                    </Card>
                    <Card className="text-center p-4">
                      <TrendingUp className="h-7 w-7 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">Free</div>
                      <div className="text-xs text-muted-foreground">{t('freeForever')}</div>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-2xl font-display font-bold mb-4">
              {t('ctaTitle')}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              {t('ctaDescription')}
            </p>
            <Button size="lg" asChild>
              <Link href="/auth/register?role=student">
                {t('createProfile')}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </motion.div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
