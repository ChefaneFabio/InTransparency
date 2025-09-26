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
    title: 'Import Your University Data',
    description: 'Connect your university profile to automatically populate your CV and academic information',
    icon: Database,
    color: 'bg-blue-50 border-blue-200',
    features: [
      'Academic transcripts',
      'Course information',
      'Projects and research',
      'Skills and certifications',
      'Contact details'
    ]
  },
  {
    id: 2,
    title: 'Build Your Profile',
    description: 'Complete your professional profile with additional skills and experiences',
    icon: User,
    color: 'bg-green-50 border-green-200',
    features: [
      'Professional summary',
      'Work experience',
      'Personal projects',
      'Achievements',
      'Portfolio links'
    ]
  },
  {
    id: 3,
    title: 'Get Discovered',
    description: 'Let recruiters find you based on your skills and interests',
    icon: Search,
    color: 'bg-purple-50 border-purple-200',
    features: [
      'Talent matching',
      'Job recommendations',
      'Direct recruiter contact',
      'Interview opportunities',
      'Career guidance'
    ]
  }
]

const recruiterSteps = [
  {
    id: 1,
    title: 'Post Opportunities',
    description: 'Create detailed job postings and internship opportunities',
    icon: Briefcase,
    color: 'bg-green-50 border-green-200',
    features: [
      'Job descriptions',
      'Skill requirements',
      'Company information',
      'Application tracking',
      'Automated matching'
    ]
  },
  {
    id: 2,
    title: 'Discover Talent',
    description: 'Use advanced search and geographic mapping to find candidates',
    icon: Globe,
    color: 'bg-blue-50 border-blue-200',
    features: [
      'Geographic talent search',
      'Skills-based filtering',
      'University partnerships',
      'Real-time availability',
      'Candidate analytics'
    ]
  },
  {
    id: 3,
    title: 'Engage & Hire',
    description: 'Connect directly with candidates and manage the hiring process',
    icon: MessageSquare,
    color: 'bg-purple-50 border-purple-200',
    features: [
      'Direct messaging',
      'Interview scheduling',
      'Application management',
      'Background checks',
      'Offer management'
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
          subtitle: 'Discover talent globally, post opportunities, and hire the best candidates'
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
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                          : 'text-gray-600 hover:text-gray-900 hover:bg-slate-100'
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
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
                <Card key={step.id} className={`${step.color} transition-all hover:shadow-lg`}>
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <div className="bg-white rounded-full p-3 mr-4 shadow-sm">
                        <Icon className="h-6 w-6 text-gray-700" />
                      </div>
                      <div className="bg-white rounded-full px-3 py-1 shadow-sm">
                        <span className="font-bold text-sm text-gray-700">Step {step.id}</span>
                      </div>
                    </div>
                    <CardTitle className="text-gray-900">{step.title}</CardTitle>
                    <p className="text-gray-700 text-sm">{step.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {step.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
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
                  title: 'AI-Powered Matching',
                  description: 'Intelligent algorithms match candidates with perfect opportunities'
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
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of students, recruiters, and universities already using InTransparency
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
                onClick={() => window.location.href = '/demo'}
              >
                Watch Demo
                <Eye className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}