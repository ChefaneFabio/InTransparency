'use client'

import { useState } from 'react'
import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'
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
  AlertTriangle,
  Zap,
  Database,
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
  Sparkles
} from 'lucide-react'
import { motion } from 'framer-motion'

const itsAcademies = [
  {
    name: 'ITS G. Natta',
    area: 'Chimica e Biotecnologie',
    location: 'Bergamo',
    students: 120,
    topSkills: ['Process Engineering', 'Quality Control', 'Lab Analysis', 'Regulatory Compliance']
  },
  {
    name: 'ITS IFOA',
    area: 'Meccatronica e Automazione',
    location: 'Reggio Emilia',
    students: 150,
    topSkills: ['PLC Programming', 'Industrial Automation', 'Robotics', 'IoT']
  },
  {
    name: 'ITS Rizzoli',
    area: 'ICT e Tecnologie Digitali',
    location: 'Milano',
    students: 180,
    topSkills: ['Full-Stack Development', 'Cloud Computing', 'Cybersecurity', 'AI/ML']
  },
  {
    name: 'ITS Turismo e Ospitalità',
    area: 'Tourism Management',
    location: 'Venezia',
    students: 90,
    topSkills: ['Hospitality Management', 'Event Planning', 'Digital Marketing', 'Revenue Management']
  }
]

const itsFocusAreas = [
  {
    area: 'Meccanica e Meccatronica',
    icon: Hammer,
    color: 'from-orange-500 to-red-500',
    skills: ['CAD/CAM', 'CNC Programming', 'Industry 4.0', 'Maintenance'],
    companies: ['Leonardo', 'FCA', 'Siemens', 'Bosch'],
    avgPlacement: 87,
    searchVolume: 143
  },
  {
    area: 'ICT e Tecnologie Digitali',
    icon: Code,
    color: 'bg-primary',
    skills: ['Web Development', 'Cybersecurity', 'Cloud', 'IoT'],
    companies: ['Reply', 'Engineering', 'Accenture', 'IBM'],
    avgPlacement: 92,
    searchVolume: 198
  },
  {
    area: 'Chimica e Biotecnologie',
    icon: Award,
    color: 'bg-primary/80',
    skills: ['Process Control', 'GMP', 'Lab Techniques', 'Regulatory Affairs'],
    companies: ['Sanofi', 'Novartis', 'BASF', 'Enel Green Power'],
    avgPlacement: 85,
    searchVolume: 76
  },
  {
    area: 'Design e Comunicazione',
    icon: Palette,
    color: 'bg-primary/60',
    skills: ['Graphic Design', 'UX/UI', 'Video Editing', 'Social Media'],
    companies: ['Design Studios', 'Agencies', 'Media Companies'],
    avgPlacement: 78,
    searchVolume: 89
  }
]

export default function ITSInstitutesPage() {
  const [selectedArea, setSelectedArea] = useState(itsFocusAreas[0])
  const t = useTranslations('forItsInstitutes')

  return (
    <div className="min-h-screen segment-university hero-bg">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Section - MARKETPLACE FIRST */}
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
                className="bg-primary shadow-lg"
                asChild
              >
                <Link href="/auth/register">
                  {t('getStarted')}
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

          {/* How Marketplace Benefits ITS - NEW SECTION */}
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
              <Card className="border-2 border-primary/20 hover:border-green-400 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="bg-primary p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Briefcase className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{t('mp1Title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('mp1Check1')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('mp1Check2')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('mp1Check3')}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('mp1Check4')}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="bg-primary p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{t('mp2Title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Sparkles className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('mp2Check1')}</span>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('mp2Check2')}</span>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('mp2Check3')}</span>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <span>{t('mp2Check4')}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 hover:border-purple-400 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="bg-primary/80 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{t('mp3Title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <BarChart3 className="h-4 w-4 text-primary/70 mr-2 mt-0.5" />
                      <span>{t('mp3Check1')}</span>
                    </li>
                    <li className="flex items-start">
                      <BarChart3 className="h-4 w-4 text-primary/70 mr-2 mt-0.5" />
                      <span>{t('mp3Check2')}</span>
                    </li>
                    <li className="flex items-start">
                      <BarChart3 className="h-4 w-4 text-primary/70 mr-2 mt-0.5" />
                      <span>{t('mp3Check3')}</span>
                    </li>
                    <li className="flex items-start">
                      <BarChart3 className="h-4 w-4 text-primary/70 mr-2 mt-0.5" />
                      <span>{t('mp3Check4')}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Four Services - REORDERED (Marketplace First) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-center text-foreground mb-4">
              {t('fourServices')}
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('fourServicesSubtitle')}
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-6">
              {/* Discovery Service - PRIMARY (Larger card) */}
              <Card className="border-2 border-primary/20 hover:border-green-400 transition-all hover:shadow-xl">
                <CardHeader className="text-center pb-3">
                  <div className="bg-primary p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Search className="h-8 w-8 text-white" />
                  </div>
                  <Badge className="mb-2 bg-primary text-white">{t('primaryServiceLabel')}</Badge>
                  <CardTitle className="text-lg">{t('discoveryTitle')}</CardTitle>
                  <Badge variant="secondary" className="mt-2 text-xs">{t('discoveryBadge')}</Badge>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80 space-y-2">
                  <p className="font-semibold text-foreground">{t('discoverySubtitle')}</p>
                  <ul className="space-y-1.5">
                    <li>• {t('discoveryItem1')}</li>
                    <li>• {t('discoveryItem2')}</li>
                    <li>• {t('discoveryItem3')}</li>
                    <li>• {t('discoveryItem4')}</li>
                  </ul>
                  <p className="text-xs italic pt-2 border-t text-muted-foreground">
                    {t('discoveryNote')}
                  </p>
                </CardContent>
              </Card>

              {/* Matching Service - PRIMARY (Larger card) */}
              <Card className="border-2 border-primary/30 hover:border-primary/50 transition-all hover:shadow-xl">
                <CardHeader className="text-center pb-3">
                  <div className="bg-primary p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <Badge className="mb-2 bg-primary/80 text-white">{t('primaryServiceLabel')}</Badge>
                  <CardTitle className="text-lg">{t('matchingTitle')}</CardTitle>
                  <Badge variant="secondary" className="mt-2 text-xs">{t('matchingBadge')}</Badge>
                </CardHeader>
                <CardContent className="text-sm text-foreground/80 space-y-2">
                  <p className="font-semibold text-primary">{t('matchingSubtitle')}</p>
                  <ul className="space-y-1.5">
                    <li>• {t('matchingItem1')}</li>
                    <li>• {t('matchingItem2')}</li>
                    <li>• {t('matchingItem3')}</li>
                    <li>• {t('matchingItem4')}</li>
                  </ul>
                  <p className="text-xs italic pt-2 border-t text-muted-foreground">
                    {t('matchingNote')}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Verification Service - SECONDARY (Smaller card) */}
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
                    <li>• {t('verificationItem1')}</li>
                    <li>• {t('verificationItem2')}</li>
                    <li>• {t('verificationItem3')}</li>
                    <li>• {t('verificationItem4')}</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Analytics Service - SECONDARY (Smaller card) */}
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
                    <li>• {t('analyticsItem1')}</li>
                    <li>• {t('analyticsItem2')}</li>
                    <li>• {t('analyticsItem3')}</li>
                    <li>• {t('analyticsItem4')}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

          </motion.div>

          {/* ITS Focus Areas */}
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

            {/* Area Selector */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {itsFocusAreas.map((area) => {
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

            {/* Selected Area Details */}
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
                        <p className="font-semibold text-foreground mb-2">{t('verifiedSkillsSeek')}</p>
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
                          <strong className="text-primary">{selectedArea.searchVolume} {t('searchesPerMonth')}</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">{t('howStudentsGetHired')}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 rounded-full p-2">
                            <GraduationCap className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{t('hireStep1')}</p>
                            <p className="text-xs text-muted-foreground">{`${t('hireStep1Desc')} ${selectedArea.skills[0]}`}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 rounded-full p-2">
                            <Shield className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{t('hireStep2')}</p>
                            <p className="text-xs text-muted-foreground">{`${t('hireStep2Desc')} ${selectedArea.area.split(' ')[0]}`}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 rounded-full p-2">
                            <Search className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{t('hireStep3')}</p>
                            <p className="text-xs text-muted-foreground">{`${t('hireStep3Desc')} "${selectedArea.skills[0]}"`}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 rounded-full p-2">
                            <Briefcase className="h-4 w-4 text-primary/70" />
                          </div>
                          <div>
                            <p className="font-semibold">{t('hireStep4')}</p>
                            <p className="text-xs text-muted-foreground">{t('hireStep4Desc')}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Why Choose InTransparency - REFRAMED */}
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

          {/* Integration Workflow - SIMPLIFIED */}
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
                  {t('getStartedSteps')}
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
                  <Button
                    size="lg"
                    variant="secondary"
                    asChild
                    className="shadow-xl"
                  >
                    <Link href="/auth/register">
                      {t('getStarted')}
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  <p className="text-sm text-white/80 mt-4">
                    {t('quickSetup')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ITS Academies Examples */}
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
              {itsAcademies.map((its) => (
                <Card key={its.name} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Building2 className="h-8 w-8 text-primary" />
                      <Badge variant="secondary">{its.students} {t('studentsLabel')}</Badge>
                    </div>
                    <CardTitle className="text-base">{its.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{its.area}</p>
                    <p className="text-xs text-muted-foreground">{its.location}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs font-semibold text-foreground mb-2">{t('skillsSeek')}</p>
                    <div className="space-y-1">
                      {its.topSkills.map((skill) => (
                        <div key={skill} className="flex items-center text-xs text-foreground/80">
                          <CheckCircle className="h-3 w-3 text-primary mr-1" />
                          {skill}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* FAQ for ITS */}
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
                  <Button
                    size="lg"
                    className="bg-primary shadow-lg"
                    asChild
                  >
                    <Link href="/auth/register">
                      {t('joinMarketplace')}
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                  >
                    <Link href="/pricing">
                      {t('pricingAddons')}
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
