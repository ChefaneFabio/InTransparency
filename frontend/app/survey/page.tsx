'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  GraduationCap,
  Building2,
  School,
  ArrowRight,
  Users,
  Briefcase,
  Globe,
  CheckCircle
} from 'lucide-react'

interface SurveyType {
  id: string
  title: string
  subtitle: string
  description: string
  icon: any
  color: string
  estimatedTime: string
  questions: number
  targetUsers: string
  path: string
}

const surveyTypes: SurveyType[] = [
  {
    id: 'student',
    title: 'Student & Graduate Survey',
    subtitle: 'Shape your academic showcase platform',
    description: 'Help us understand how you want to present your academic achievements, projects, and skills to potential employers.',
    icon: GraduationCap,
    color: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
    estimatedTime: '7 minutes',
    questions: 18,
    targetUsers: 'Current students and recent graduates',
    path: '/survey/student'
  },
  {
    id: 'company',
    title: 'Company & Recruiter Survey',
    subtitle: 'Define the future of graduate hiring',
    description: 'Share your recruitment challenges, ideal candidate profiles, and pain points in evaluating graduate talent.',
    icon: Building2,
    color: 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800',
    estimatedTime: '8 minutes',
    questions: 22,
    targetUsers: 'HR professionals, recruiters, hiring managers',
    path: '/survey/company'
  },
  {
    id: 'university',
    title: 'University & Career Services Survey',
    subtitle: 'Enhance student career outcomes',
    description: 'Help us understand how to best support student placement, industry partnerships, and career service goals.',
    icon: School,
    color: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700',
    estimatedTime: '6 minutes',
    questions: 15,
    targetUsers: 'Career service staff, academic administrators',
    path: '/survey/university'
  }
]

export default function SurveySelectionPage() {
  const router = useRouter()
  const [selectedSurvey, setSelectedSurvey] = useState<string | null>(null)

  const handleSurveySelect = (survey: SurveyType) => {
    setSelectedSurvey(survey.id)
    router.push(survey.path)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-blue-50/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Header */}
      <div className="relative bg-white/90 backdrop-blur-md border-b border-blue-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                InTransparency Survey
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50" asChild>
                <Link href="/auth/register/role-selection">Back to Registration</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
              Help Shape InTransparency
            </span>
          </h1>
          <p className="text-2xl text-gray-700 max-w-4xl mx-auto mb-8 leading-relaxed">
            Your insights drive our platform development.
            <span className="text-blue-600 font-semibold"> Choose your survey</span> to help us build the perfect solution.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 text-base text-gray-600 mb-8">
            <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Users className="h-5 w-5 mr-3 text-blue-500" />
              <span className="font-medium">All perspectives valued</span>
            </div>
            <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Briefcase className="h-5 w-5 mr-3 text-blue-500" />
              <span className="font-medium">Industry insights needed</span>
            </div>
            <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Globe className="h-5 w-5 mr-3 text-blue-500" />
              <span className="font-medium">Anonymous & secure</span>
            </div>
          </div>
        </div>

        {/* Survey Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {surveyTypes.map((survey) => {
            const Icon = survey.icon
            return (
              <Card
                key={survey.id}
                className="relative overflow-hidden border transition-all duration-500 hover:shadow-2xl hover:scale-105 cursor-pointer group bg-white/70 backdrop-blur-sm border-blue-100 hover:border-blue-300 hover:shadow-blue-100/50"
                onClick={() => handleSurveySelect(survey)}
              >
                <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-transparent rounded-full transform rotate-45"></div>
                </div>

                <CardHeader className="pb-6 pt-8">
                  <div className={`w-18 h-18 rounded-2xl ${survey.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-9 w-9 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900 mb-2">{survey.title}</CardTitle>
                  <CardDescription className="text-lg text-gray-600 leading-relaxed">{survey.subtitle}</CardDescription>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {survey.estimatedTime}
                      </Badge>
                      <span className="text-sm text-gray-500">{survey.questions} questions</span>
                    </div>
                    <p className="text-sm text-blue-600 font-medium">{survey.targetUsers}</p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">{survey.description}</p>

                  {/* Benefits */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900">Your impact:</h4>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center mt-1 flex-shrink-0">
                          <CheckCircle className="h-2 w-2 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-700">Influence platform features</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center mt-1 flex-shrink-0">
                          <CheckCircle className="h-2 w-2 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-700">Early access to beta</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center mt-1 flex-shrink-0">
                          <CheckCircle className="h-2 w-2 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-700">Shape the future of hiring</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    className="w-full group text-lg py-6 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    size="lg"
                  >
                    Start {survey.title.split(' ')[0]} Survey
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional Info */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 text-center shadow-xl border border-blue-100/50">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Your Input Matters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Product Development</h3>
              <p>Your feedback directly influences which features we build first and how we design the user experience.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Market Validation</h3>
              <p>Help us understand real pain points and validate our assumptions about the education-to-career bridge.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Community Building</h3>
              <p>Join our early community of users shaping the future of transparent academic-professional connections.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}