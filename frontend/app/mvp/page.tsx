'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { 
  GraduationCap, 
  Building2, 
  School, 
  Users, 
  Search, 
  FileText, 
  Award,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react'

export default function MVPDashboard() {
  const [userType, setUserType] = useState<'student' | 'company' | 'university'>('student')

  const features = {
    student: [
      {
        title: 'Academic Profile Creation',
        description: 'Create detailed profile with courses, grades, and projects',
        href: '/students/profile',
        icon: GraduationCap,
        status: 'ready'
      },
      {
        title: 'Course-to-Project Mapping',
        description: 'Link your coursework to real projects',
        href: '/students/profile#connections',
        icon: Award,
        status: 'ready'
      },
      {
        title: 'Job Opportunities Feed',
        description: 'See jobs matched to your academic profile',
        href: '/students/opportunities',
        icon: TrendingUp,
        status: 'ready'
      },
      {
        title: 'Academic Verification',
        description: 'Get your transcripts and achievements verified',
        href: '/students/verification',
        icon: CheckCircle2,
        status: 'coming-soon'
      }
    ],
    company: [
      {
        title: 'Academic-Based Search',
        description: 'Find candidates by courses, grades, and projects',
        href: '/companies/search',
        icon: Search,
        status: 'ready'
      },
      {
        title: 'Smart Job Posting',
        description: 'Post jobs with academic requirements',
        href: '/companies/jobs/create',
        icon: FileText,
        status: 'ready'
      },
      {
        title: 'Candidate Profiles',
        description: 'View detailed academic achievements',
        href: '/companies/candidates',
        icon: Users,
        status: 'ready'
      },
      {
        title: 'Hiring Analytics',
        description: 'Track recruitment performance',
        href: '/companies/analytics',
        icon: TrendingUp,
        status: 'coming-soon'
      }
    ],
    university: [
      {
        title: 'Student Management',
        description: 'Manage and verify student profiles',
        href: '/university/dashboard',
        icon: School,
        status: 'ready'
      },
      {
        title: 'Company Engagement',
        description: 'Track employer interactions',
        href: '/university/dashboard#companies',
        icon: Building2,
        status: 'ready'
      },
      {
        title: 'Placement Analytics',
        description: 'Monitor graduate placement rates',
        href: '/university/analytics',
        icon: TrendingUp,
        status: 'ready'
      },
      {
        title: 'Bulk Import/Export',
        description: 'Import student data from university systems',
        href: '/university/import',
        icon: FileText,
        status: 'coming-soon'
      }
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="secondary">
            InTransparency MVP
          </Badge>
          <h1 className="text-4xl font-bold mb-4">
            Academic Performance-Based Recruitment Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect students and companies through verified academic achievements, not just claims
          </p>
        </div>

        {/* User Type Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <Button
              variant={userType === 'student' ? 'default' : 'ghost'}
              onClick={() => setUserType('student')}
              className="px-6"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Student
            </Button>
            <Button
              variant={userType === 'company' ? 'default' : 'ghost'}
              onClick={() => setUserType('company')}
              className="px-6"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Company
            </Button>
            <Button
              variant={userType === 'university' ? 'default' : 'ghost'}
              onClick={() => setUserType('university')}
              className="px-6"
            >
              <School className="h-4 w-4 mr-2" />
              University
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features[userType].map((feature, i) => {
            const Icon = feature.icon
            return (
              <Card 
                key={i} 
                className={`hover:shadow-lg transition-shadow ${
                  feature.status === 'ready' ? 'hover:scale-105 cursor-pointer' : 'opacity-75'
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Icon className="h-8 w-8 text-blue-600" />
                    <Badge 
                      variant={feature.status === 'ready' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {feature.status === 'ready' ? 'Ready' : 'Coming Soon'}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {feature.status === 'ready' ? (
                    <Link href={feature.href}>
                      <Button className="w-full">
                        Try Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Button className="w-full" disabled>
                      Coming Soon
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Key Differentiators */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Key Differentiators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Academic Evidence</h3>
                <p className="text-sm text-gray-600">
                  Real grades, verified transcripts, and course-to-project connections
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">University Verified</h3>
                <p className="text-sm text-gray-600">
                  All academic data verified by university career services
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Smart Matching</h3>
                <p className="text-sm text-gray-600">
                  AI-powered matching based on academic performance and skills
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Data Notice */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
              <div>
                <h4 className="font-medium">MVP Demo Mode</h4>
                <p className="text-sm text-gray-600">
                  This MVP uses demo data. In production, all data will be verified and sourced from university systems.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="text-center mt-12">
          <h3 className="text-xl font-semibold mb-6">Quick Access</h3>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/validation">
              <Button variant="outline">
                View Validation Results
              </Button>
            </Link>
            <Link href="/students/profile">
              <Button variant="outline">
                Create Student Profile
              </Button>
            </Link>
            <Link href="/companies/search">
              <Button variant="outline">
                Search Candidates
              </Button>
            </Link>
            <Link href="/companies/jobs/create">
              <Button variant="outline">
                Create Smart Job Posting
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}