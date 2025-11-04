'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { IMAGES, getAvatarUrl } from '@/lib/images'
import {
  Users,
  Building2,
  Search,
  FileText,
  Upload,
  Download,
  ArrowRight,
  CheckCircle,
  Star,
  Globe,
  Shield,
  Zap,
  Database,
  Link,
  User,
  GraduationCap,
  Award,
  Briefcase,
  Eye,
  MessageSquare,
  TrendingUp,
  Clock,
  Target,
  Settings,
  BarChart3
} from 'lucide-react'
import { StudentDataImportComponent } from '@/components/how-it-works/StudentDataImportComponent'

const getUserTypes = (t: any) => [
  {
    id: 'student',
    label: t('userTypes.student.label'),
    icon: GraduationCap,
    color: 'bg-blue-100 text-blue-700',
    description: t('userTypes.student.description')
  },
  {
    id: 'institute',
    label: t('userTypes.institute.label'),
    icon: Building2,
    color: 'bg-purple-100 text-purple-700',
    description: t('userTypes.institute.description')
  },
  {
    id: 'recruiter',
    label: t('userTypes.recruiter.label'),
    icon: Users,
    color: 'bg-green-100 text-green-700',
    description: t('userTypes.recruiter.description')
  }
]

const getStudentSteps = (t: any) => [
  {
    id: 1,
    title: t('studentSteps.step1.title'),
    description: t('studentSteps.step1.description'),
    icon: Upload,
    color: 'bg-blue-50 border-blue-200',
    duration: t('studentSteps.step1.duration'),
    features: t.raw('studentSteps.step1.features'),
    example: t('studentSteps.step1.example')
  },
  {
    id: 2,
    title: t('studentSteps.step2.title'),
    description: t('studentSteps.step2.description'),
    icon: Zap,
    color: 'bg-purple-50 border-purple-200',
    duration: t('studentSteps.step2.duration'),
    features: t.raw('studentSteps.step2.features'),
    example: t('studentSteps.step2.example')
  },
  {
    id: 3,
    title: t('studentSteps.step3.title'),
    description: t('studentSteps.step3.description'),
    icon: MessageSquare,
    color: 'bg-green-50 border-green-200',
    duration: t('studentSteps.step3.duration'),
    features: t.raw('studentSteps.step3.features'),
    example: t('studentSteps.step3.example')
  }
]

const getRecruiterSteps = (t: any) => [
  {
    id: 1,
    title: t('recruiterSteps.step1.title'),
    description: t('recruiterSteps.step1.description'),
    icon: Search,
    color: 'bg-blue-50 border-blue-200',
    duration: undefined,
    example: undefined,
    features: t.raw('recruiterSteps.step1.features')
  },
  {
    id: 2,
    title: t('recruiterSteps.step2.title'),
    description: t('recruiterSteps.step2.description'),
    icon: Target,
    color: 'bg-green-50 border-green-200',
    duration: undefined,
    example: undefined,
    features: t.raw('recruiterSteps.step2.features')
  },
  {
    id: 3,
    title: t('recruiterSteps.step3.title'),
    description: t('recruiterSteps.step3.description'),
    icon: MessageSquare,
    color: 'bg-purple-50 border-purple-200',
    duration: undefined,
    example: undefined,
    features: t.raw('recruiterSteps.step3.features')
  }
]

const getInstituteSteps = (t: any) => [
  {
    id: 1,
    title: t('instituteSteps.step1.title'),
    description: t('instituteSteps.step1.description'),
    icon: Link,
    color: 'bg-purple-50 border-purple-200',
    duration: undefined,
    example: undefined,
    features: t.raw('instituteSteps.step1.features')
  },
  {
    id: 2,
    title: t('instituteSteps.step2.title'),
    description: t('instituteSteps.step2.description'),
    icon: TrendingUp,
    color: 'bg-green-50 border-green-200',
    duration: undefined,
    example: undefined,
    features: t.raw('instituteSteps.step2.features')
  },
  {
    id: 3,
    title: t('instituteSteps.step3.title'),
    description: t('instituteSteps.step3.description'),
    icon: Award,
    color: 'bg-blue-50 border-blue-200',
    duration: undefined,
    example: undefined,
    features: t.raw('instituteSteps.step3.features')
  }
]

// Workflow data for each persona
const getWorkflows = (t: any) => ({
  student: {
    steps: [
      {
        icon: Upload,
        title: t('workflow.student.step1.title'),
        description: t('workflow.student.step1.description'),
        color: 'text-primary'
      },
      {
        icon: Shield,
        title: t('workflow.student.step2.title'),
        description: t('workflow.student.step2.description'),
        color: 'text-primary'
      },
      {
        icon: Target,
        title: t('workflow.student.step3.title'),
        description: t('workflow.student.step3.description'),
        color: 'text-secondary'
      },
      {
        icon: CheckCircle,
        title: t('workflow.student.step4.title'),
        description: t('workflow.student.step4.description'),
        color: 'text-green-600'
      }
    ],
    result: t('workflow.student.result')
  },
  institute: {
    steps: [
      {
        icon: Database,
        title: t('workflow.institute.step1.title'),
        description: t('workflow.institute.step1.description'),
        color: 'text-purple-600'
      },
      {
        icon: Shield,
        title: t('workflow.institute.step2.title'),
        description: t('workflow.institute.step2.description'),
        color: 'text-purple-600'
      },
      {
        icon: BarChart3,
        title: t('workflow.institute.step3.title'),
        description: t('workflow.institute.step3.description'),
        color: 'text-blue-600'
      },
      {
        icon: TrendingUp,
        title: t('workflow.institute.step4.title'),
        description: t('workflow.institute.step4.description'),
        color: 'text-green-600'
      }
    ],
    result: t('workflow.institute.result')
  },
  recruiter: {
    steps: [
      {
        icon: Search,
        title: t('workflow.recruiter.step1.title'),
        description: t('workflow.recruiter.step1.description'),
        color: 'text-green-600'
      },
      {
        icon: Target,
        title: t('workflow.recruiter.step2.title'),
        description: t('workflow.recruiter.step2.description'),
        color: 'text-green-600'
      },
      {
        icon: Eye,
        title: t('workflow.recruiter.step3.title'),
        description: t('workflow.recruiter.step3.description'),
        color: 'text-blue-600'
      },
      {
        icon: MessageSquare,
        title: t('workflow.recruiter.step4.title'),
        description: t('workflow.recruiter.step4.description'),
        color: 'text-primary'
      }
    ],
    result: t('workflow.recruiter.result')
  }
})

export default function HowItWorksPage() {
  const t = useTranslations('howItWorksPage')
  const [selectedUserType, setSelectedUserType] = useState('student')
  const [showDataImport, setShowDataImport] = useState(false)
  const userTypes = getUserTypes(t)
  const workflows = getWorkflows(t)
  const studentSteps = getStudentSteps(t)
  const recruiterSteps = getRecruiterSteps(t)
  const instituteSteps = getInstituteSteps(t)

  const getCurrentSteps = () => {
    switch (selectedUserType) {
      case 'student': return studentSteps
      case 'institute': return instituteSteps
      case 'recruiter': return recruiterSteps
      default: return studentSteps
    }
  }

  const getCurrentWorkflow = () => {
    return workflows[selectedUserType as keyof typeof workflows] || workflows.student
  }

  const getHeaderContent = () => {
    switch (selectedUserType) {
      case 'student':
        return {
          title: t('userTypes.student.title'),
          subtitle: t('userTypes.student.subtitle')
        }
      case 'institute':
        return {
          title: t('userTypes.institute.title'),
          subtitle: t('userTypes.institute.subtitle')
        }
      case 'recruiter':
        return {
          title: t('userTypes.recruiter.title'),
          subtitle: t('userTypes.recruiter.subtitle')
        }
      default:
        return {
          title: t('userTypes.student.title'),
          subtitle: t('userTypes.student.subtitle')
        }
    }
  }

  return (
    <div className="min-h-screen hero-bg">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-gradient-to-r from-primary to-secondary text-white">
              {t('hero.badge')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-2">
              {t('hero.subtitle')}
            </p>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              {t('hero.tagline')}
            </p>
          </motion.div>

          {/* Four Services Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Verification Service */}
              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{t('services.verification.title')}</CardTitle>
                  <Badge variant="secondary" className="mt-2">{t('services.verification.badge')}</Badge>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-2">
                  <p className="font-semibold text-primary">{t('services.verification.heading')}</p>
                  <ul className="space-y-1 text-xs">
                    <li>• {t('services.verification.features.0')}</li>
                    <li>• {t('services.verification.features.1')}</li>
                    <li>• {t('services.verification.features.2')}</li>
                    <li>• {t('services.verification.features.3')}</li>
                  </ul>
                  <p className="text-xs italic pt-2 border-t">
                    {t('services.verification.comparison')}
                  </p>
                </CardContent>
              </Card>

              {/* Matching Service */}
              <Card className="border-2 border-secondary/20 hover:border-secondary/40 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="bg-gradient-to-br from-secondary to-primary p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{t('services.matching.title')}</CardTitle>
                  <Badge variant="secondary" className="mt-2">{t('services.matching.badge')}</Badge>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-2">
                  <p className="font-semibold text-secondary">{t('services.matching.heading')}</p>
                  <ul className="space-y-1 text-xs">
                    <li>• {t('services.matching.features.0')}</li>
                    <li>• {t('services.matching.features.1')}</li>
                    <li>• {t('services.matching.features.2')}</li>
                    <li>• {t('services.matching.features.3')}</li>
                  </ul>
                  <p className="text-xs italic pt-2 border-t">
                    {t('services.matching.comparison')}
                  </p>
                </CardContent>
              </Card>

              {/* Discovery Service */}
              <Card className="border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Search className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{t('services.discovery.title')}</CardTitle>
                  <Badge variant="secondary" className="mt-2">{t('services.discovery.badge')}</Badge>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-2">
                  <p className="font-semibold text-green-700">{t('services.discovery.heading')}</p>
                  <ul className="space-y-1 text-xs">
                    <li>• {t('services.discovery.features.0')}</li>
                    <li>• {t('services.discovery.features.1')}</li>
                    <li>• {t('services.discovery.features.2')}</li>
                    <li>• {t('services.discovery.features.3')}</li>
                  </ul>
                  <p className="text-xs italic pt-2 border-t">
                    {t('services.discovery.comparison')}
                  </p>
                </CardContent>
              </Card>

              {/* Analytics Service */}
              <Card className="border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{t('services.analytics.title')}</CardTitle>
                  <Badge variant="secondary" className="mt-2">{t('services.analytics.badge')}</Badge>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-2">
                  <p className="font-semibold text-purple-700">{t('services.analytics.heading')}</p>
                  <ul className="space-y-1 text-xs">
                    <li>• {t('services.analytics.features.0')}</li>
                    <li>• {t('services.analytics.features.1')}</li>
                    <li>• {t('services.analytics.features.2')}</li>
                    <li>• {t('services.analytics.features.3')}</li>
                  </ul>
                  <p className="text-xs italic pt-2 border-t">
                    {t('services.analytics.comparison')}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* User Type Selector */}
            <div className="flex justify-center mb-12">
              <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200">
                <div className="flex space-x-2">
                  {(userTypes || []).map((type) => {
                    const Icon = type.icon
                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedUserType(type.id)}
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          selectedUserType === type.id
                            ? type.color
                            : 'text-gray-800 hover:text-gray-900 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {type.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Service Flow Diagram - Dynamic based on persona */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedUserType}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20">
                  <CardContent className="py-8">
                    <h3 className="text-xl font-bold text-center mb-6">{t('workflow.title')}</h3>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-5xl mx-auto">
                      {getCurrentWorkflow().steps.map((step, index) => {
                        const Icon = step.icon
                        return (
                          <React.Fragment key={index}>
                            <div className="flex flex-col items-center text-center">
                              <div className="bg-white p-4 rounded-lg shadow-md mb-2 w-48 hover:shadow-lg transition-shadow">
                                <Icon className={`h-8 w-8 mx-auto mb-2 ${step.color}`} />
                                <p className="text-sm font-semibold">{step.title}</p>
                                <p className="text-xs text-gray-600">{step.description}</p>
                              </div>
                            </div>
                            {index < getCurrentWorkflow().steps.length - 1 && (
                              <ArrowRight className="h-6 w-6 text-gray-400 rotate-90 md:rotate-0" />
                            )}
                          </React.Fragment>
                        )
                      })}
                    </div>
                    <div className="text-center mt-6">
                      <p className="text-sm text-gray-700">
                        <strong>{t('workflow.result')}</strong> {getCurrentWorkflow().result}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Dynamic Header */}
          <motion.div
            key={selectedUserType}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              {getHeaderContent().title}
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              {getHeaderContent().subtitle}
            </p>
          </motion.div>

          {/* Student Data Import Feature (only for students) */}
          {selectedUserType === 'student' && (
            <div className="mb-16">
              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center text-primary mb-2">
                    <Database className="h-6 w-6 mr-2" />
                    {t('studentDataImport.title')}
                  </CardTitle>
                  <p className="text-gray-700">
                    {t('studentDataImport.description')}
                  </p>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    onClick={() => setShowDataImport(!showDataImport)}
                    className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg text-white"
                  >
                    {showDataImport ? t('studentDataImport.buttonHide') : t('studentDataImport.buttonShow')}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Student Data Import Component */}
              {showDataImport && (
                <div className="mt-8">
                  <StudentDataImportComponent />
                </div>
              )}
            </div>
          )}

          {/* Dynamic Steps */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <AnimatePresence mode="wait">
              {(getCurrentSteps() || []).map((step, index) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={`${selectedUserType}-${step.id}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <Card className={`${step.color} transition-all hover:shadow-lg relative overflow-hidden h-full`}>
                  {/* Step Number Badge */}
                  <div className="absolute top-4 right-4 bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-md">
                    <span className="text-2xl font-bold text-gray-700">{step.id}</span>
                  </div>

                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <div className="relative w-16 h-16 mr-4 rounded-lg overflow-hidden shadow-md">
                        <Image
                          src={
                            step.id === 1 ? (selectedUserType === 'student' ? IMAGES.companies.office1 : selectedUserType === 'recruiter' ? IMAGES.features.search : IMAGES.universities.campus1) :
                            step.id === 2 ? (selectedUserType === 'student' ? IMAGES.features.aiAnalysis : selectedUserType === 'recruiter' ? IMAGES.features.matching : IMAGES.features.dataAnalytics) :
                            selectedUserType === 'student' ? IMAGES.success.handshake : selectedUserType === 'recruiter' ? IMAGES.features.collaboration : IMAGES.companies.team
                          }
                          alt={step.title}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      {step.duration && (
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {step.duration}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-gray-900 text-xl mb-2">{step.title}</CardTitle>
                    <p className="text-gray-700 text-sm leading-relaxed">{step.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {(step.features || []).map((feature: string, featureIndex: number) => (
                        <li key={featureIndex} className="flex items-start text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Example */}
                    {step.example && (
                      <div className="bg-white bg-opacity-70 rounded-lg p-3 border border-gray-200">
                        <p className="text-xs font-mono text-gray-700 italic">
                          {step.example}
                        </p>
                      </div>
                    )}

                    {/* Arrow connector (except last step) */}
                    {index < getCurrentSteps().length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                        <ArrowRight className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Platform Benefits */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-16">
            <h3 className="text-2xl font-display font-bold text-foreground text-center mb-8">
              {t('benefits.title')}
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  image: IMAGES.students.student4,
                  title: t('benefits.0.title'),
                  description: t('benefits.0.description')
                },
                {
                  image: IMAGES.universities.campus1,
                  title: t('benefits.1.title'),
                  description: t('benefits.1.description')
                },
                {
                  image: IMAGES.features.aiAnalysis,
                  title: t('benefits.2.title'),
                  description: t('benefits.2.description')
                },
                {
                  image: IMAGES.features.collaboration,
                  title: t('benefits.3.title'),
                  description: t('benefits.3.description')
                }
              ].map((benefit, index) => {
                return (
                  <div key={index} className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden shadow-md">
                      <Image
                        src={benefit.image}
                        alt={benefit.title}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                    <p className="text-sm text-gray-700">{benefit.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Viral CTA Section */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-12 text-center text-white mb-16">
            <h3 className="text-3xl font-display font-bold mb-4">
              {t('cta.title')}
            </h3>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              {selectedUserType === 'student' && t('cta.student')}
              {selectedUserType === 'institute' && t('cta.institute')}
              {selectedUserType === 'recruiter' && t('cta.recruiter')}
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
                onClick={() => window.location.href = '/auth/register'}
              >
                {t('cta.primaryButton')}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              {selectedUserType === 'student' && (
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary"
                  onClick={() => window.location.href = '/students/explore'}
                >
                  {t('cta.secondaryButton')}
                  <Eye className="h-5 w-5 ml-2" />
                </Button>
              )}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}