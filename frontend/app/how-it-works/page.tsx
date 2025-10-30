'use client'

import React, { useState } from 'react'
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

const userTypes = [
  {
    id: 'student',
    label: 'Student',
    icon: GraduationCap,
    color: 'bg-blue-100 text-blue-700',
    description: 'Create profile, showcase skills, find opportunities'
  },
  {
    id: 'institute',
    label: 'Institute',
    icon: Building2,
    color: 'bg-purple-100 text-purple-700',
    description: 'Connect students with opportunities, track alumni'
  },
  {
    id: 'recruiter',
    label: 'Recruiter',
    icon: Users,
    color: 'bg-green-100 text-green-700',
    description: 'Discover talent, post jobs, track applications'
  }
]

const studentSteps = [
  {
    id: 1,
    title: 'Upload Your Projects',
    description: 'Upload projects in any format - code, documents, presentations, reports. Our AI analyzes everything you\'ve built.',
    icon: Upload,
    color: 'bg-blue-50 border-blue-200',
    duration: '2 minutes',
    features: [
      'All formats accepted (code, PDFs, docs, videos)',
      'Institution collaboration for verified data',
      'AI project analysis & scoring',
      'Complexity & innovation metrics',
      'Technology and skill detection'
    ],
    example: '→ Example: Upload your thesis, capstone project, or group work'
  },
  {
    id: 2,
    title: 'Get AI-Powered Analysis',
    description: 'Our AI analyzes your projects and creates a complete profile with both hard skills and soft skills',
    icon: Zap,
    color: 'bg-purple-50 border-purple-200',
    duration: '30 seconds',
    features: [
      'Hard skills: Technical abilities & tools',
      'Soft skills: Teamwork, leadership, communication',
      'Project complexity scoring',
      'Market relevance analysis',
      'Career readiness score & benchmarking'
    ],
    example: '→ Example: "Strong Python + Excellent team collaboration skills"'
  },
  {
    id: 3,
    title: 'Recruiters Message You First',
    description: 'Companies discover you based on what you\'ve built, not your resume',
    icon: MessageSquare,
    color: 'bg-green-50 border-green-200',
    duration: 'Ongoing',
    features: [
      'Appear in recruiter searches',
      'Get matched to relevant opportunities',
      'Direct messages from companies',
      'Receive interview invitations',
      'Share portfolio on LinkedIn'
    ],
    example: '→ Example: "Recruiter wants to chat about your AI project"'
  }
]

const recruiterSteps = [
  {
    id: 1,
    title: 'Proactive Candidate Discovery',
    description: 'Search for candidates even if they haven\'t applied to your jobs. Find talent based on skills, education, and experience',
    icon: Search,
    color: 'bg-blue-50 border-blue-200',
    duration: undefined,
    example: undefined,
    features: [
      'Search candidates without applications',
      'Filter by universities, courses, grades',
      'Find by projects and technologies',
      '250+ customizable search filters',
      'Geographic talent mapping'
    ]
  },
  {
    id: 2,
    title: 'AI-Powered Matching',
    description: 'Intelligent AI analyzes industry knowledge and finds common ground between your company profile and candidates',
    icon: Target,
    color: 'bg-green-50 border-green-200',
    duration: undefined,
    example: undefined,
    features: [
      'AI RAG for intelligent candidate matching',
      'Industry knowledge compatibility',
      'Profile alignment scoring',
      'Skills and culture fit analysis',
      'Automated compatibility reports'
    ]
  },
  {
    id: 3,
    title: 'Engage & Hire',
    description: 'Connect directly with matched candidates and manage the hiring process efficiently',
    icon: MessageSquare,
    color: 'bg-purple-50 border-purple-200',
    duration: undefined,
    example: undefined,
    features: [
      'Direct messaging with AI insights',
      'Interview scheduling',
      'Application tracking',
      'Offer management',
      'Hiring analytics'
    ]
  }
]

const instituteSteps = [
  {
    id: 1,
    title: 'Connect Students',
    description: 'Enable students to import their academic data seamlessly',
    icon: Link,
    color: 'bg-purple-50 border-purple-200',
    duration: undefined,
    example: undefined,
    features: [
      'API integration',
      'Student data sync',
      'Privacy controls',
      'Bulk enrollment',
      'Custom fields'
    ]
  },
  {
    id: 2,
    title: 'Track Outcomes',
    description: 'Monitor student career outcomes and placement rates',
    icon: TrendingUp,
    color: 'bg-green-50 border-green-200',
    duration: undefined,
    example: undefined,
    features: [
      'Employment analytics',
      'Salary insights',
      'Industry trends',
      'Alumni tracking',
      'Performance metrics'
    ]
  },
  {
    id: 3,
    title: 'Build Partnerships',
    description: 'Establish relationships with top employers and industry partners',
    icon: Award,
    color: 'bg-blue-50 border-blue-200',
    duration: undefined,
    example: undefined,
    features: [
      'Recruiter network',
      'Job fair coordination',
      'Industry events',
      'Partnership management',
      'Success stories'
    ]
  }
]

export default function HowItWorksPage() {
  const [selectedUserType, setSelectedUserType] = useState('student')
  const [showDataImport, setShowDataImport] = useState(false)

  const getCurrentSteps = () => {
    switch (selectedUserType) {
      case 'student': return studentSteps
      case 'institute': return instituteSteps
      case 'recruiter': return recruiterSteps
      default: return studentSteps
    }
  }

  const getHeaderContent = () => {
    switch (selectedUserType) {
      case 'student':
        return {
          title: 'How Students Use InTransparency',
          subtitle: 'Import your academic data, build your profile, and get discovered by top employers'
        }
      case 'institute':
        return {
          title: 'How Institutes Use InTransparency',
          subtitle: 'Connect students with opportunities and track career outcomes across universities, ITS, and higher education institutions'
        }
      case 'recruiter':
        return {
          title: 'How Recruiters Use InTransparency',
          subtitle: 'Proactively search for candidates, leverage AI matching to find perfect fits, and hire based on industry knowledge and profile compatibility'
        }
      default:
        return {
          title: 'How Students Use InTransparency',
          subtitle: 'Import your academic data, build your profile, and get discovered by top employers'
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
              Subscription-Free Service Model
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Four Services, One Ecosystem
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-2">
              Partner-enabled services connecting students, institutions, and companies via 100% verified competencies
            </p>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              No Subscriptions • Pay Only for What You Use
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
                  <CardTitle className="text-lg">Verification Service</CardTitle>
                  <Badge variant="secondary" className="mt-2">FREE for Institutions</Badge>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-2">
                  <p className="font-semibold text-primary">Auto-import & Authenticate</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Esse3/Moodle integration</li>
                    <li>• Institution endorses projects</li>
                    <li>• Batch approval: 50 in 1 hour</li>
                    <li>• "Verified by ITS G. Natta, 28/30"</li>
                  </ul>
                  <p className="text-xs italic pt-2 border-t">
                    vs AlmaLaurea: €2,500/year
                  </p>
                </CardContent>
              </Card>

              {/* Matching Service */}
              <Card className="border-2 border-secondary/20 hover:border-secondary/40 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="bg-gradient-to-br from-secondary to-primary p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">Matching Service</CardTitle>
                  <Badge variant="secondary" className="mt-2">FREE for Students</Badge>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-2">
                  <p className="font-semibold text-secondary">AI-Powered Connections</p>
                  <ul className="space-y-1 text-xs">
                    <li>• 92% verified accuracy</li>
                    <li>• Transparent explanations</li>
                    <li>• "92% fit: Python thesis matches"</li>
                    <li>• Bidirectional requirements</li>
                  </ul>
                  <p className="text-xs italic pt-2 border-t">
                    vs Manatal: Opaque resume parsing
                  </p>
                </CardContent>
              </Card>

              {/* Discovery Service */}
              <Card className="border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Search className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">Discovery Service</CardTitle>
                  <Badge variant="secondary" className="mt-2">Browse FREE, €10/contact</Badge>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-2">
                  <p className="font-semibold text-green-700">Reverse Recruitment</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Companies search verified pools</li>
                    <li>• Zero applications for students</li>
                    <li>• Project excerpts + stamps</li>
                    <li>• 80% faster screening</li>
                  </ul>
                  <p className="text-xs italic pt-2 border-t">
                    vs Indeed: 30% self-reported fakes
                  </p>
                </CardContent>
              </Card>

              {/* Analytics Service */}
              <Card className="border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">Analytics Service</CardTitle>
                  <Badge variant="secondary" className="mt-2">FREE Dashboards</Badge>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-2">
                  <p className="font-semibold text-purple-700">Career Intelligence</p>
                  <ul className="space-y-1 text-xs">
                    <li>• "Deloitte viewed 31 students"</li>
                    <li>• "Excel searched 89x"</li>
                    <li>• Early intervention alerts</li>
                    <li>• Prove 85% placement boost</li>
                  </ul>
                  <p className="text-xs italic pt-2 border-t">
                    vs Univariety: €500/year subs
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Service Flow Diagram */}
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20">
              <CardContent className="py-8">
                <h3 className="text-xl font-bold text-center mb-6">How Services Work Together</h3>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-5xl mx-auto">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-white p-4 rounded-lg shadow-md mb-2 w-48">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-semibold">1. Upload Projects</p>
                      <p className="text-xs text-gray-600">theses, stage curriculare</p>
                    </div>
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center text-center">
                    <div className="bg-white p-4 rounded-lg shadow-md mb-2 w-48">
                      <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-semibold">2. Institution Verifies</p>
                      <p className="text-xs text-gray-600">via Esse3/Moodle</p>
                    </div>
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center text-center">
                    <div className="bg-white p-4 rounded-lg shadow-md mb-2 w-48">
                      <Target className="h-8 w-8 mx-auto mb-2 text-secondary" />
                      <p className="text-sm font-semibold">3. AI Matches</p>
                      <p className="text-xs text-gray-600">92% verified accuracy</p>
                    </div>
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400 rotate-90 md:rotate-0" />

                  <div className="flex flex-col items-center text-center">
                    <div className="bg-white p-4 rounded-lg shadow-md mb-2 w-48">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p className="text-sm font-semibold">4. Companies Discover</p>
                      <p className="text-xs text-gray-600">Zero applications</p>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-700">
                    <strong>Result:</strong> Students get 25% higher responses • Institutions prove 85% placement boost • Companies save 80% screening time
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* User Type Selector */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-12"
          >
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
                    Streamlined Profile Creation (Consent-Based)
                  </CardTitle>
                  <p className="text-gray-700">
                    Consent via email, then import your verified academic data to create a complete profile
                  </p>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    onClick={() => setShowDataImport(!showDataImport)}
                    className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg text-white"
                  >
                    {showDataImport ? 'Hide' : 'Try'} Data Import Demo
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
                      {(step.features || []).map((feature, featureIndex) => (
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
              Why Choose InTransparency?
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  image: IMAGES.students.student4,
                  title: 'Transparent Process',
                  description: 'Complete visibility into hiring and application processes'
                },
                {
                  image: IMAGES.universities.campus1,
                  title: 'Global Reach',
                  description: 'Connect with opportunities and talent worldwide'
                },
                {
                  image: IMAGES.features.aiAnalysis,
                  title: 'AI-Powered Matching & RAG',
                  description: 'AI analyzes profiles to find common ground between companies and candidates based on industry knowledge and compatibility'
                },
                {
                  image: IMAGES.features.collaboration,
                  title: 'Real-time Updates',
                  description: 'Get instant notifications about applications and opportunities'
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
              Stop Applying. Start Getting Discovered.
            </h3>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              {selectedUserType === 'student' && 'Build your profile, showcase your work, and get discovered by top companies.'}
              {selectedUserType === 'institute' && 'Connect your students with career opportunities and track their success across all higher education institutions.'}
              {selectedUserType === 'recruiter' && 'Find verified talent based on real skills and projects, not resumes.'}
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
                onClick={() => window.location.href = '/auth/register/role-selection'}
              >
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              {selectedUserType === 'student' && (
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary"
                  onClick={() => window.location.href = '/students/explore'}
                >
                  See Portfolios
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