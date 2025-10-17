'use client'

import React, { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  Settings
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
    id: 'recruiter',
    label: 'Recruiter',
    icon: Users,
    color: 'bg-green-100 text-green-700',
    description: 'Discover talent, post jobs, track applications'
  },
  {
    id: 'university',
    label: 'University',
    icon: Building2,
    color: 'bg-purple-100 text-purple-700',
    description: 'Connect students with opportunities, track alumni'
  }
]

const studentSteps = [
  {
    id: 1,
    title: 'Upload Your Projects',
    description: 'Import projects from GitHub or upload directly. Our AI analyzes what you\'ve built.',
    icon: Upload,
    color: 'bg-blue-50 border-blue-200',
    duration: '2 minutes',
    features: [
      'GitHub integration (auto-import)',
      'AI project analysis & scoring',
      'Complexity & innovation metrics',
      'Technology stack detection',
      'Verified commit history'
    ],
    example: '→ Example: Upload your ML Trading Bot, get 92/100 innovation score'
  },
  {
    id: 2,
    title: 'Get AI-Powered Analysis',
    description: 'Our AI analyzes your projects and creates a verified skill profile',
    icon: Zap,
    color: 'bg-purple-50 border-purple-200',
    duration: '30 seconds',
    features: [
      'Project complexity scoring',
      'Market relevance analysis',
      'Skills extracted automatically',
      'Career readiness score',
      'Benchmark vs peers'
    ],
    example: '→ "Your React skills rank in top 15% at Stanford"'
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
      'Get matched to 5.2 jobs/month avg',
      'Direct messages from companies',
      '87% get interviews within 30 days',
      'Share portfolio on LinkedIn'
    ],
    example: '→ "Google recruiter wants to chat about your AI project"'
  }
]

const recruiterSteps = [
  {
    id: 1,
    title: 'Proactive Candidate Discovery',
    description: 'Search for candidates even if they haven\'t applied to your jobs. Find talent based on skills, education, and experience',
    icon: Search,
    color: 'bg-blue-50 border-blue-200',
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
    features: [
      'Direct messaging with AI insights',
      'Interview scheduling',
      'Application tracking',
      'Offer management',
      'Hiring analytics'
    ]
  }
]

const universitySteps = [
  {
    id: 1,
    title: 'Connect Students',
    description: 'Enable students to import their academic data seamlessly',
    icon: Link,
    color: 'bg-purple-50 border-purple-200',
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
      case 'recruiter': return recruiterSteps
      case 'university': return universitySteps
      default: return studentSteps
    }
  }

  const getHeaderContent = () => {
    switch (selectedUserType) {
      case 'student':
        return {
          title: 'How Students Use InTransparency',
          subtitle: 'Import your university data, build your profile, and get discovered by top employers'
        }
      case 'recruiter':
        return {
          title: 'How Recruiters Use InTransparency',
          subtitle: 'Proactively search for candidates, leverage AI matching to find perfect fits, and hire based on industry knowledge and profile compatibility'
        }
      case 'university':
        return {
          title: 'How Universities Use InTransparency',
          subtitle: 'Connect students with opportunities and track career outcomes'
        }
      default:
        return {
          title: 'How Students Use InTransparency',
          subtitle: 'Import your university data, build your profile, and get discovered by top employers'
        }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">How InTransparency Works</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              A transparent platform connecting students, recruiters, and universities worldwide
            </p>
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

          {/* Dynamic Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {getHeaderContent().title}
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              {getHeaderContent().subtitle}
            </p>
          </div>

          {/* Student Data Import Feature (only for students) */}
          {selectedUserType === 'student' && (
            <div className="mb-16">
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center text-blue-900 mb-2">
                    <Database className="h-6 w-6 mr-2" />
                    Automatic Profile Creation
                  </CardTitle>
                  <p className="text-blue-700">
                    Import all your academic data from your university profile to create a complete CV instantly
                  </p>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    onClick={() => setShowDataImport(!showDataImport)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
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
            {(getCurrentSteps() || []).map((step, index) => {
              const Icon = step.icon
              return (
                <Card key={step.id} className={`${step.color} transition-all hover:shadow-lg relative overflow-hidden`}>
                  {/* Step Number Badge */}
                  <div className="absolute top-4 right-4 bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-md">
                    <span className="text-2xl font-bold text-gray-700">{step.id}</span>
                  </div>

                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-3 mr-4 shadow-md">
                        <Icon className="h-6 w-6 text-white" />
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
              )
            })}
          </div>

          {/* Platform Benefits */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-16">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Why Choose InTransparency?
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  icon: Shield,
                  title: 'Transparent Process',
                  description: 'Complete visibility into hiring and application processes'
                },
                {
                  icon: Globe,
                  title: 'Global Reach',
                  description: 'Connect with opportunities and talent worldwide'
                },
                {
                  icon: Zap,
                  title: 'AI-Powered Matching & RAG',
                  description: 'AI analyzes profiles to find common ground between companies and candidates based on industry knowledge and compatibility'
                },
                {
                  icon: Clock,
                  title: 'Real-time Updates',
                  description: 'Get instant notifications about applications and opportunities'
                }
              ].map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div key={index} className="text-center">
                    <div className="bg-blue-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                    <p className="text-sm text-gray-700">{benefit.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* See It In Action */}
          {selectedUserType === 'student' && (
            <div className="mb-16">
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-gray-900 mb-2">
                    See Real Student Portfolios
                  </CardTitle>
                  <p className="text-gray-700">
                    Check out how other students are showcasing their work and getting hired
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { name: 'Alex Chen', uni: 'MIT', views: '1,234', projects: 7, hired: 'Google' },
                      { name: 'Sarah Kim', uni: 'Stanford', views: '892', projects: 5, hired: 'Meta' },
                      { name: 'Mike Torres', uni: 'Berkeley', views: '2,103', projects: 9, hired: 'Stripe' }
                    ].map((student, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ml-3">
                            <div className="font-semibold text-gray-900">{student.name}</div>
                            <div className="text-xs text-gray-800">{student.uni}</div>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Profile views:</span>
                            <span className="font-semibold">{student.views}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Projects:</span>
                            <span className="font-semibold">{student.projects}</span>
                          </div>
                          <div className="pt-2 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-800">Hired by:</span>
                              <Badge className="bg-green-100 text-green-800 border-green-200">{student.hired}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-6">
                    <Button variant="outline" onClick={() => window.location.href = '/students/explore'}>
                      Browse More Portfolios
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Viral CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white mb-16">
            <h3 className="text-3xl font-bold mb-4">
              Stop Applying. Start Getting Discovered.
            </h3>
            <p className="text-lg text-blue-50 mb-8 max-w-2xl mx-auto">
              {selectedUserType === 'student' && '1,247 students got hired in the last 30 days. Your turn.'}
              {selectedUserType === 'recruiter' && 'Join 423 companies finding verified talent on InTransparency.'}
              {selectedUserType === 'university' && 'Partner with 50+ universities improving student placement rates.'}
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => window.location.href = '/auth/register/role-selection'}
              >
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              {selectedUserType === 'student' && (
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                  onClick={() => window.location.href = '/students/explore'}
                >
                  See Portfolios
                  <Eye className="h-5 w-5 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Social Proof Stats */}
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              { value: '15,247', label: 'Active Students', icon: Users },
              { value: '87%', label: 'Get Interviews', icon: Target },
              { value: '423', label: 'Companies Hiring', icon: Briefcase },
              { value: '2x', label: 'Faster Hiring', icon: Clock }
            ].map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div key={idx} className="bg-white rounded-lg p-6 shadow-sm">
                  <Icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-700">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}