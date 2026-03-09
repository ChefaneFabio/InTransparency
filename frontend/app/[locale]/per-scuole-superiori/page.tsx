'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  Target,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Users,
  TrendingUp,
  Zap,
  Award,
  Briefcase,
  Code,
  Hammer,
  Palette,
  Search,
  Euro,
  Clock,
  FileCheck,
  Building2,
  GraduationCap,
  Sparkles,
  BookOpen,
  Wrench,
  HeartHandshake,
  CalendarDays
} from 'lucide-react'
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
    icon: Code,
    skills: ['Web Development', 'Database', 'Networking', 'Cybersecurity'],
    companies: ['Accenture', 'Reply', 'Engineering', 'Capgemini'],
    avgPlacement: 72,
    pctoHours: 210
  },
  {
    area: 'Meccanica e Meccatronica',
    icon: Hammer,
    skills: ['CAD/CAM', 'CNC', 'Automazione', 'Manutenzione'],
    companies: ['FCA', 'Ducati', 'Brembo', 'Dallara'],
    avgPlacement: 68,
    pctoHours: 210
  },
  {
    area: 'Chimica e Biotecnologie',
    icon: Award,
    skills: ['Analisi Chimica', 'Controllo Qualità', 'Laboratorio', 'Ambiente'],
    companies: ['BASF', 'Sanofi', 'Chiesi', 'Hera'],
    avgPlacement: 65,
    pctoHours: 210
  },
  {
    area: 'Grafica e Comunicazione',
    icon: Palette,
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
                    <ul className="space-y-2 text-sm text-foreground/80">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>{t('pctoCheck1')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>{t('pctoCheck2')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>{t('pctoCheck3')}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>{t('pctoCheck4')}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="text-center p-4">
                      <CalendarDays className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">210h</div>
                      <div className="text-xs text-muted-foreground">{t('techHoursLabel')}</div>
                    </Card>
                    <Card className="text-center p-4">
                      <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">90h</div>
                      <div className="text-xs text-muted-foreground">{t('liceiHoursLabel')}</div>
                    </Card>
                    <Card className="text-center p-4">
                      <Briefcase className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">3°-5°</div>
                      <div className="text-xs text-muted-foreground">{t('yearsInvolved')}</div>
                    </Card>
                    <Card className="text-center p-4">
                      <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
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
                  <div className="bg-primary p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <HeartHandshake className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{t('card1Title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('card1Check1')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('card1Check2')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('card1Check3')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('card1Check4')}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="bg-primary p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <FileCheck className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{t('card2Title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('card2Check1')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('card2Check2')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('card2Check3')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('card2Check4')}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="bg-primary/80 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{t('card3Title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <BarChart3 className="h-4 w-4 text-primary/70 mr-2 mt-0.5" />
                      <span>{t('card3Check1')}</span>
                    </li>
                    <li className="flex items-start">
                      <BarChart3 className="h-4 w-4 text-primary/70 mr-2 mt-0.5" />
                      <span>{t('card3Check2')}</span>
                    </li>
                    <li className="flex items-start">
                      <BarChart3 className="h-4 w-4 text-primary/70 mr-2 mt-0.5" />
                      <span>{t('card3Check3')}</span>
                    </li>
                    <li className="flex items-start">
                      <BarChart3 className="h-4 w-4 text-primary/70 mr-2 mt-0.5" />
                      <span>{t('card3Check4')}</span>
                    </li>
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
                  <div className="bg-primary p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Search className="h-8 w-8 text-white" />
                  </div>
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
                  <div className="bg-primary p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Target className="h-8 w-8 text-white" />
                  </div>
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
                  <div className="bg-muted-foreground p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
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
                  <div className="bg-muted-foreground p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
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
              {pctoAreas.map((area) => {
                const Icon = area.icon
                return (
                  <button
                    key={area.area}
                    onClick={() => setSelectedArea(area)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedArea.area === area.area
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted bg-card border border-border'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {area.area}
                  </button>
                )
              })}
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
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 rounded-full p-2">
                            <GraduationCap className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{t('studentStep1')}</p>
                            <p className="text-xs text-muted-foreground">{t('studentStep1Desc').replace('{skill}', selectedArea.skills[0])}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 rounded-full p-2">
                            <Shield className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{t('studentStep2')}</p>
                            <p className="text-xs text-muted-foreground">{t('studentStep2Desc').replace('{area}', selectedArea.area.split(' ')[0])}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 rounded-full p-2">
                            <Search className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{t('studentStep3')}</p>
                            <p className="text-xs text-muted-foreground">{t('studentStep3Desc').replace('{skill}', selectedArea.skills[0])}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 rounded-full p-2">
                            <Briefcase className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{t('studentStep4')}</p>
                            <p className="text-xs text-muted-foreground">{t('studentStep4Desc')}</p>
                          </div>
                        </div>
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
                  <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{t('why1Title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('why1Check1')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('why1Check2')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('why1Check3')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('why1Check4')}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardHeader className="text-center">
                  <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Euro className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{t('why2Title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('why2Check1')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('why2Check2')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('why2Check3')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('why2Check4')}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardHeader className="text-center">
                  <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{t('why3Title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('why3Check1')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('why3Check2')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('why3Check3')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('why3Check4')}</span>
                    </li>
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
                  <div className="text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl font-bold">1</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">{t('gs1Title')}</h4>
                    <p className="text-white/90 text-sm">
                      {t('gs1Desc')}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl font-bold">2</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">{t('gs2Title')}</h4>
                    <p className="text-white/90 text-sm">
                      {t('gs2Desc')}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl font-bold">3</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">{t('gs3Title')}</h4>
                    <p className="text-white/90 text-sm">
                      {t('gs3Desc')}
                    </p>
                  </div>
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
                      <Building2 className="h-8 w-8 text-primary" />
                      <Badge variant="secondary">{school.students} {t('studentsLabel')}</Badge>
                    </div>
                    <CardTitle className="text-base">{school.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{school.area}</p>
                    <p className="text-xs text-muted-foreground">{school.location}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs font-semibold text-foreground mb-2">{t('pctoActivities')}</p>
                    <div className="space-y-1">
                      {school.topActivities.map((activity) => (
                        <div key={activity} className="flex items-center text-xs text-foreground/80">
                          <CheckCircle className="h-3 w-3 text-primary mr-1" />
                          {activity}
                        </div>
                      ))}
                    </div>
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
