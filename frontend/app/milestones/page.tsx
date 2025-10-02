'use client'

import React, { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  Clock,
  Target,
  Sparkles,
  Rocket,
  Users,
  Building2,
  GraduationCap,
  Globe,
  Shield,
  Zap,
  Database,
  Brain,
  MessageSquare,
  Star,
  TrendingUp,
  Award,
  Search,
  Filter,
  BarChart3,
  Smartphone,
  Lock,
  FileText,
  ArrowRight
} from 'lucide-react'

interface Milestone {
  id: string
  title: string
  description: string
  status: 'completed' | 'in-progress' | 'planned'
  quarter: string
  icon: any
  color: string
  features: string[]
  impact?: string
  releaseDate?: string
}

const milestones: Milestone[] = [
  {
    id: 'm1',
    title: 'Platform Foundation',
    description: 'Core infrastructure and authentication system',
    status: 'completed',
    quarter: 'Q4 2024',
    icon: Rocket,
    color: 'bg-green-500',
    releaseDate: 'December 2024',
    features: [
      'User authentication & authorization',
      'Role-based access (Students, Recruiters, Universities)',
      'Profile management system',
      'Basic dashboard layouts',
      'Secure data storage'
    ],
    impact: 'Established secure foundation for 1000+ early users'
  },
  {
    id: 'm2',
    title: 'Advanced Security & Data Import',
    description: 'Security hardening and university data integration',
    status: 'completed',
    quarter: 'Q1 2025',
    icon: Shield,
    color: 'bg-green-500',
    releaseDate: 'January 2025',
    features: [
      'JWT authentication with refresh tokens',
      'Input validation & sanitization',
      'CORS & XSS protection',
      'University data import API',
      'Automated CV generation from academic data',
      'Course and grade tracking'
    ],
    impact: 'Protected user data with enterprise-grade security'
  },
  {
    id: 'm3',
    title: 'Geographic Search & AI Matching',
    description: 'Location-based candidate discovery with AI',
    status: 'completed',
    quarter: 'Q1 2025',
    icon: Globe,
    color: 'bg-green-500',
    releaseDate: 'February 2025',
    features: [
      'Interactive talent map with geographic search',
      '250+ advanced search filters',
      'AI-powered candidate matching',
      'Course and project-based filtering',
      'Real-time candidate ranking',
      'Match score calculation (0-100%)'
    ],
    impact: 'Reduced recruiter search time by 73%'
  },
  {
    id: 'm4',
    title: 'Interactive Case Studies',
    description: 'Live demonstrations of platform capabilities',
    status: 'completed',
    quarter: 'Q1 2025',
    icon: Award,
    color: 'bg-green-500',
    releaseDate: 'February 2025',
    features: [
      'Dynamic candidate search demo',
      'Real-time filtering visualization',
      'Banking case study with 3 positions',
      'Interactive match score display',
      'Custom filter builder'
    ],
    impact: 'Increased demo conversion rate by 45%'
  },
  {
    id: 'm5',
    title: 'Voice-Powered AI Recruitment Assistant',
    description: 'Talk to AI to find candidates - just describe what you need',
    status: 'in-progress',
    quarter: 'Q2 2025',
    icon: MessageSquare,
    color: 'bg-blue-500',
    features: [
      'Voice-to-text candidate search',
      'Natural language position description',
      'AI understanding of job requirements',
      'Conversational filtering refinement',
      'Multi-language voice support',
      'Hands-free candidate browsing'
    ],
    impact: 'Target: 90% faster job posting creation'
  },
  {
    id: 'm6',
    title: 'Mobile Experience',
    description: 'Native mobile apps for iOS and Android',
    status: 'in-progress',
    quarter: 'Q2 2025',
    icon: Smartphone,
    color: 'bg-blue-500',
    features: [
      'iOS and Android native apps',
      'Mobile-optimized search interface',
      'Push notifications for job matches',
      'Offline profile viewing',
      'Mobile document upload',
      'In-app messaging'
    ],
    impact: 'Target: 50% of users on mobile within 6 months'
  },
  {
    id: 'm7',
    title: 'AI-Powered Recommendations',
    description: 'Advanced ML for personalized job matching',
    status: 'in-progress',
    quarter: 'Q2 2025',
    icon: Brain,
    color: 'bg-blue-500',
    features: [
      'RAG-based job recommendations',
      'Skill gap analysis',
      'Career path suggestions',
      'Automated interview prep',
      'Resume optimization AI',
      'Salary prediction models'
    ],
    impact: 'Target: 90%+ match accuracy'
  },
  {
    id: 'm8',
    title: 'Real-Time Collaboration',
    description: 'Enhanced communication tools',
    status: 'planned',
    quarter: 'Q3 2025',
    icon: Users,
    color: 'bg-purple-500',
    features: [
      'Video interview integration',
      'Real-time chat with recruiters',
      'Collaborative hiring workflows',
      'Interview scheduling automation',
      'Team decision-making tools',
      'Candidate feedback system'
    ]
  },
  {
    id: 'm9',
    title: 'Advanced Analytics Dashboard',
    description: 'Data insights for recruiters and universities',
    status: 'planned',
    quarter: 'Q3 2025',
    icon: BarChart3,
    color: 'bg-purple-500',
    features: [
      'Recruitment pipeline analytics',
      'University placement metrics',
      'Industry trend analysis',
      'Candidate source tracking',
      'ROI calculators',
      'Custom report builder'
    ]
  },
  {
    id: 'm10',
    title: 'API & Integrations',
    description: 'Connect with existing HR systems',
    status: 'planned',
    quarter: 'Q4 2025',
    icon: Database,
    color: 'bg-purple-500',
    features: [
      'Public API for developers',
      'ATS integration (Greenhouse, Lever)',
      'HRIS connectors (Workday, BambooHR)',
      'LinkedIn data sync',
      'Calendar integrations',
      'Zapier automation'
    ]
  },
  {
    id: 'm11',
    title: 'Global Expansion',
    description: 'Multi-language and regional support',
    status: 'planned',
    quarter: 'Q1 2026',
    icon: Globe,
    color: 'bg-purple-500',
    features: [
      'Support for 15+ languages',
      'Regional university partnerships',
      'Local payment methods',
      'Compliance with GDPR, CCPA',
      'Currency conversion',
      'Time zone intelligence'
    ]
  }
]

export default function MilestonesPage() {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)

  const completedMilestones = milestones.filter(m => m.status === 'completed')
  const inProgressMilestones = milestones.filter(m => m.status === 'in-progress')
  const plannedMilestones = milestones.filter(m => m.status === 'planned')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200">
              <Rocket className="h-3 w-3 mr-1" />
              Product Roadmap
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Journey to Transform Recruitment
            </h1>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-8">
              Follow our path as we build the future of transparent, skill-based hiring. Each milestone brings us closer to connecting talent with opportunity.
            </p>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{completedMilestones.length}</div>
                <div className="text-sm text-gray-800 font-medium">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{inProgressMilestones.length}</div>
                <div className="text-sm text-gray-800 font-medium">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{plannedMilestones.length}</div>
                <div className="text-sm text-gray-800 font-medium">Planned</div>
              </div>
            </div>
          </div>

          {/* Milestone Path */}
          <div className="relative mb-16">
            {/* Path Line - Desktop */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-blue-500 to-purple-500 opacity-20 hidden md:block" />

            {/* Path Line - Mobile (thinner, different position) */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 via-blue-400 to-purple-400 opacity-30 md:hidden" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon
                const isSelected = selectedMilestone?.id === milestone.id

                return (
                  <div key={milestone.id} className="relative">
                    {/* Milestone Stone */}
                    <div className="flex items-start gap-4 md:gap-8">
                      {/* Stone/Icon - Desktop */}
                      <div className={`relative flex-shrink-0 hidden md:flex items-center justify-center w-16 h-16 rounded-full ${milestone.color} shadow-lg z-10 cursor-pointer hover:scale-110 transition-transform`}
                        onClick={() => setSelectedMilestone(isSelected ? null : milestone)}
                      >
                        {milestone.status === 'completed' ? (
                          <CheckCircle className="h-8 w-8 text-white" />
                        ) : milestone.status === 'in-progress' ? (
                          <Clock className="h-8 w-8 text-white animate-pulse" />
                        ) : (
                          <Target className="h-8 w-8 text-white opacity-70" />
                        )}
                      </div>

                      {/* Stone/Icon - Mobile (smaller) */}
                      <div className={`relative flex-shrink-0 flex md:hidden items-center justify-center w-10 h-10 rounded-full ${milestone.color} shadow-md z-10`}>
                        {milestone.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-white" />
                        ) : milestone.status === 'in-progress' ? (
                          <Clock className="h-5 w-5 text-white animate-pulse" />
                        ) : (
                          <Target className="h-5 w-5 text-white opacity-70" />
                        )}
                      </div>

                      {/* Milestone Card */}
                      <Card
                        className={`flex-1 cursor-pointer transition-all hover:shadow-xl ${
                          isSelected ? 'ring-2 ring-blue-500 shadow-xl' : ''
                        } ${
                          milestone.status === 'completed' ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50' :
                          milestone.status === 'in-progress' ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50' :
                          'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50'
                        }`}
                        onClick={() => setSelectedMilestone(isSelected ? null : milestone)}
                      >
                        <CardHeader>
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`p-2 rounded-lg flex-shrink-0 ${
                                milestone.status === 'completed' ? 'bg-green-100' :
                                milestone.status === 'in-progress' ? 'bg-blue-100' :
                                'bg-purple-100'
                              }`}>
                                <Icon className={`h-6 w-6 ${
                                  milestone.status === 'completed' ? 'text-green-700' :
                                  milestone.status === 'in-progress' ? 'text-blue-700' :
                                  'text-purple-700'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-lg md:text-xl">{milestone.title}</CardTitle>
                                <CardDescription className="mt-1">{milestone.description}</CardDescription>
                              </div>
                            </div>
                            <div className="flex flex-row md:flex-col items-start md:items-end gap-2 flex-shrink-0">
                              <Badge className={`font-semibold ${
                                milestone.status === 'completed' ? 'bg-green-100 text-green-800 border-green-300' :
                                milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                'bg-purple-100 text-purple-800 border-purple-300'
                              }`}>
                                {milestone.status === 'completed' ? '✓ Completed' :
                                 milestone.status === 'in-progress' ? '⏳ In Progress' :
                                 '📋 Planned'}
                              </Badge>
                              <span className="text-sm text-gray-800 font-medium whitespace-nowrap">{milestone.quarter}</span>
                              {milestone.releaseDate && (
                                <span className="text-xs text-gray-700 font-medium whitespace-nowrap">{milestone.releaseDate}</span>
                              )}
                            </div>
                          </div>
                        </CardHeader>

                        {isSelected && (
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                                <div className="grid md:grid-cols-2 gap-2">
                                  {milestone.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                      <span className="text-sm text-gray-700">{feature}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {milestone.impact && (
                                <div className="pt-4 border-t">
                                  <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="h-5 w-5 text-blue-600" />
                                    <h4 className="font-semibold text-gray-900">Impact</h4>
                                  </div>
                                  <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border">
                                    {milestone.impact}
                                  </p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Status Legend */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Milestone Status Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="bg-green-500 rounded-full p-3">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Completed</h4>
                    <p className="text-sm text-gray-700">Features live in production and available to all users</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 rounded-full p-3">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">In Progress</h4>
                    <p className="text-sm text-gray-700">Currently being developed and tested by our team</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-purple-500 rounded-full p-3">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Planned</h4>
                    <p className="text-sm text-gray-700">Scheduled for future development and release</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-12 border-2 border-blue-200">
            <Sparkles className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join Us on This Journey
            </h3>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Be part of the revolution in transparent hiring. Get early access to new features and help shape the future of recruitment.
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => window.location.href = '/auth/register/role-selection'}
              >
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/feedback'}
              >
                Share Your Ideas
                <Star className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
