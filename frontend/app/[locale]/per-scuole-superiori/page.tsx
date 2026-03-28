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

const highSchoolExamples = [
  {
    name: 'ITIS Galileo Galilei',
    area: 'Informatica e Telecomunicazioni',
    location: 'Roma',
    students: 450,
    topActivities: ['Stage Aziendale', 'Progetto Web', 'Laboratorio IoT', 'Certificazione Cisco']
  },
  {
    name: 'IIS Leonardo da Vinci',
    area: 'Meccanica e Meccatronica',
    location: 'Milano',
    students: 380,
    topActivities: ['PCTO in Azienda', 'Progetto CAD/CAM', 'Automazione Industriale', 'Sicurezza']
  },
  {
    name: 'ITIS Enrico Fermi',
    area: 'Chimica e Biotecnologie',
    location: 'Bologna',
    students: 320,
    topActivities: ['Laboratorio Analisi', 'Stage Farmaceutico', 'Progetto Ambiente', 'Qualità']
  },
  {
    name: 'IIS Aldini Valeriani',
    area: 'Elettronica ed Elettrotecnica',
    location: 'Bologna',
    students: 410,
    topActivities: ['PCTO Energia', 'Domotica', 'Progetto Arduino', 'Manutenzione']
  }
]

const pctoAreas = [
  {
    area: 'Informatica e Digitale',
    skills: ['Web Development', 'Database', 'Networking', 'Cybersecurity'],
    companies: ['Accenture', 'Reply', 'Engineering', 'Capgemini'],
    avgPlacement: 72,
    pctoHours: 210
  },
  {
    area: 'Meccanica e Meccatronica',
    skills: ['CAD/CAM', 'CNC', 'Automazione', 'Manutenzione'],
    companies: ['FCA', 'Ducati', 'Brembo', 'Dallara'],
    avgPlacement: 68,
    pctoHours: 210
  },
  {
    area: 'Chimica e Biotecnologie',
    skills: ['Analisi Chimica', 'Controllo Qualità', 'Laboratorio', 'Ambiente'],
    companies: ['BASF', 'Sanofi', 'Chiesi', 'Hera'],
    avgPlacement: 65,
    pctoHours: 210
  },
  {
    area: 'Grafica e Comunicazione',
    skills: ['Graphic Design', 'Video Editing', 'Social Media', 'Stampa'],
    companies: ['Agenzie Creative', 'Tipografie', 'Media Company'],
    avgPlacement: 60,
    pctoHours: 210
  }
]

export default function HighSchoolsPage() {
  const [selectedArea, setSelectedArea] = useState(pctoAreas[0])
  const t = useTranslations('perScuoleSuperiori')

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

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-primary shadow-lg" asChild>
                <Link href="/auth/register">
                  {t('getStarted')}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/pricing">
                  {t('seeHowItWorks')}
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* What is PCTO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16"
          >
            <Card className="bg-primary/5 border-2 border-primary/20">
              <CardContent className="py-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <Badge variant="secondary" className="mb-3">{t('miurBadge')}</Badge>
                    <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                      {t('pctoFullTitle')}
                    </h2>
                    <p className="text-foreground/80 mb-4">
                      {t('pctoLawText').replace('{techHours}', '210').replace('{liceiHours}', '90')}
                    </p>
                    <ul className="space-y-2 text-sm text-foreground/80 list-disc list-inside">
                      <li>{t('pctoCheck1')}</li>
                      <li>{t('pctoCheck2')}</li>
                      <li>{t('pctoCheck3')}</li>
                      <li>{t('pctoCheck4')}</li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="text-center p-4">
                      <div className="text-2xl font-bold">210h</div>
                      <div className="text-xs text-muted-foreground">{t('techHoursLabel')}</div>
                    </Card>
                    <Card className="text-center p-4">
                      <div className="text-2xl font-bold">90h</div>
                      <div className="text-xs text-muted-foreground">{t('liceiHoursLabel')}</div>
                    </Card>
                    <Card className="text-center p-4">
                      <div className="text-2xl font-bold">3°-5°</div>
                      <div className="text-xs text-muted-foreground">{t('yearsInvolved')}</div>
                    </Card>
                    <Card className="text-center p-4">
                      <div className="text-2xl font-bold">100%</div>
                      <div className="text-xs text-muted-foreground">{t('verifiedSkills')}</div>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* How the Platform Helps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-8">
              {t('howPlatformHelps')}
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{t('card1Title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <ul className="space-y-2 list-disc list-inside">
                    <li>{t('card1Check1')}</li>
                    <li>{t('card1Check2')}</li>
                    <li>{t('card1Check3')}</li>
                    <li>{t('card1Check4')}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{t('card2Title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <ul className="space-y-2 list-disc list-inside">
                    <li>{t('card2Check1')}</li>
                    <li>{t('card2Check2')}</li>
                    <li>{t('card2Check3')}</li>
                    <li>{t('card2Check4')}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{t('card3Title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <ul className="space-y-2 list-disc list-inside">
                    <li>{t('card3Check1')}</li>
                    <li>{t('card3Check2')}</li>
                    <li>{t('card3Check3')}</li>
                    <li>{t('card3Check4')}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-4">
              {t('servicesTitle')}
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('servicesSubtitle')}
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-xl">
                <CardHeader className="text-center pb-3">
                  <Badge className="mb-2 bg-primary text-white">{t('primaryService')}</Badge>
                  <CardTitle className="text-lg">{t('service1Title')}</CardTitle>
                  <Badge variant="secondary" className="mt-2 text-xs">{t('service1Free')}</Badge>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80 space-y-2">
                  <p className="font-semibold text-foreground">{t('service1Subtitle')}</p>
                  <ul className="space-y-1.5">
                    <li>&#8226; {t('service1Item1')}</li>
                    <li>&#8226; {t('service1Item2')}</li>
                    <li>&#8226; {t('service1Item3')}</li>
                    <li>&#8226; {t('service1Item4')}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/30 hover:border-primary/50 transition-all hover:shadow-xl">
                <CardHeader className="text-center pb-3">
                  <Badge className="mb-2 bg-primary/80 text-white">{t('primaryService')}</Badge>
                  <CardTitle className="text-lg">{t('service2Title')}</CardTitle>
                  <Badge variant="secondary" className="mt-2 text-xs">{t('service2Free')}</Badge>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80 space-y-2">
                  <p className="font-semibold text-primary">{t('service2Subtitle')}</p>
                  <ul className="space-y-1.5">
                    <li>&#8226; {t('service2Item1')}</li>
                    <li>&#8226; {t('service2Item2')}</li>
                    <li>&#8226; {t('service2Item3')}</li>
                    <li>&#8226; {t('service2Item4')}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border border-border hover:border-border transition-all hover:shadow-md">
                <CardHeader className="text-center py-4">
                  <CardTitle className="text-base">{t('verificationTitle')}</CardTitle>
                  <Badge variant="outline" className="mt-1 text-xs">{t('verificationBadge')}</Badge>
                </CardHeader>
                <CardContent className="text-xs text-foreground/80 space-y-1.5">
                  <p className="font-semibold text-foreground">{t('verificationSubtitle')}</p>
                  <ul className="space-y-1">
                    <li>&#8226; {t('verificationItem1')}</li>
                    <li>&#8226; {t('verificationItem2')}</li>
                    <li>&#8226; {t('verificationItem3')}</li>
                    <li>&#8226; {t('verificationItem4')}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border border-border hover:border-border transition-all hover:shadow-md">
                <CardHeader className="text-center py-4">
                  <CardTitle className="text-base">{t('analyticsTitle')}</CardTitle>
                  <Badge variant="outline" className="mt-1 text-xs">{t('analyticsBadge')}</Badge>
                </CardHeader>
                <CardContent className="text-xs text-foreground/80 space-y-1.5">
                  <p className="font-semibold text-foreground">{t('analyticsSubtitle')}</p>
                  <ul className="space-y-1">
                    <li>&#8226; {t('analyticsItem1')}</li>
                    <li>&#8226; {t('analyticsItem2')}</li>
                    <li>&#8226; {t('analyticsItem3')}</li>
                    <li>&#8226; {t('analyticsItem4')}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* PCTO Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-4">
              {t('areasTitle')}
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('areasSubtitle')}
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {pctoAreas.map((area) => (
                <button
                  key={area.area}
                  onClick={() => setSelectedArea(area)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedArea.area === area.area
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted bg-card border border-border'
                  }`}
                >
                  {area.area}
                </button>
              ))}
            </div>

            <Card className="bg-primary/5 border-2 border-primary/20">
              <CardContent className="py-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                      {selectedArea.area}
                      <Badge className="bg-primary text-white">
                        {selectedArea.avgPlacement}% Placement
                      </Badge>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold text-foreground mb-2">{t('skillsCompaniesSeek')}</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedArea.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="bg-card">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground mb-2">{t('companiesHiring')}</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedArea.companies.map((company) => (
                            <Badge key={company} className="bg-primary/10 text-foreground">
                              {company}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="bg-card p-4 rounded-lg border border-border">
                        <p className="text-sm text-foreground/80">
                          <strong className="text-primary">{t('pctoHoursForArea').replace('{hours}', String(selectedArea.pctoHours))}</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">{t('howItWorksForStudent')}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-3">
                        {[
                          { title: t('studentStep1'), desc: t('studentStep1Desc').replace('{skill}', selectedArea.skills[0]) },
                          { title: t('studentStep2'), desc: t('studentStep2Desc').replace('{area}', selectedArea.area.split(' ')[0]) },
                          { title: t('studentStep3'), desc: t('studentStep3Desc').replace('{skill}', selectedArea.skills[0]) },
                          { title: t('studentStep4'), desc: t('studentStep4Desc') },
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

          {/* Why Choose */}
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
                    <li>{t('why1Check4')}</li>
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
                    <li>{t('why2Check4')}</li>
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
                    <li>{t('why3Check4')}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Get Started Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <Card className="bg-primary border-0 text-primary-foreground">
              <CardContent className="py-12">
                <h3 className="text-3xl font-display font-bold text-center mb-8">
                  {t('getStartedStepsTitle')}
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
                  <Button size="lg" variant="secondary" asChild className="shadow-xl">
                    <Link href="/auth/register">
                      {t('getStarted')}
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  <p className="text-sm text-white/80 mt-4">
                    {t('quickActivation')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* School Examples */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-4">
              {t('examplesTitle')}
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('examplesSubtitle')}
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {highSchoolExamples.map((school) => (
                <Card key={school.name} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary">{school.students} {t('studentsLabel')}</Badge>
                    </div>
                    <CardTitle className="text-base">{school.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{school.area}</p>
                    <p className="text-xs text-muted-foreground">{school.location}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs font-semibold text-foreground mb-2">{t('pctoActivities')}</p>
                    <ul className="space-y-1 list-disc list-inside">
                      {school.topActivities.map((activity) => (
                        <li key={activity} className="text-xs text-foreground/80">
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-8">
              {t('faqTitle')}
            </h2>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('faq1Q')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <p>{t('faq1A')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('faq2Q')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <p>{t('faq2A')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('faq3Q')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <p>{t('faq3A')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('faq4Q')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <p>{t('faq4A')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('faq5Q')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <p>{t('faq5A')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('faq6Q')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <p>{t('faq6A')}</p>
                </CardContent>
              </Card>
            </div>
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
                  <Button size="lg" className="bg-primary shadow-lg" asChild>
                    <Link href="/auth/register">
                      {t('getStarted')}
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/pricing">
                      {t('pricingOptions')}
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
