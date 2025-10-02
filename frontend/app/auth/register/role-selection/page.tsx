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
  Users,
  ArrowRight,
  Check,
  Star,
  Target,
  Briefcase,
  Award,
  Globe,
  TrendingUp,
  Sparkles,
  Shield,
  Zap
} from 'lucide-react'

interface UserType {
  id: string
  title: string
  subtitle: string
  description: string
  icon: any
  color: string
  features: string[]
  pricing: string
  popular?: boolean
  registrationPath: string
}

const userTypes: UserType[] = [
  {
    id: 'student',
    title: 'Student / New Graduate',
    subtitle: 'Launch your career with verified credentials',
    description: 'Connect your university profile, showcase your projects, and get discovered by top companies with complete transparency.',
    icon: GraduationCap,
    color: 'bg-gradient-to-br from-teal-400 via-teal-500 to-blue-500',
    features: [
      'Free forever - no hidden costs',
      'University transcript integration',
      'AI-powered project portfolio',
      'Direct messages from recruiters',
      'CV optimization and templates',
      'Job matching algorithm',
      'Analytics dashboard'
    ],
    pricing: 'FREE',
    popular: true,
    registrationPath: '/auth/register/student'
  },
  {
    id: 'recruiter',
    title: 'Company / Recruiter',
    subtitle: 'Find verified talent from any university',
    description: 'Access verified graduates with real project portfolios and academic credentials through our transparent platform.',
    icon: Building2,
    color: 'bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600',
    features: [
      '7-day free trial',
      'Search verified student profiles',
      'Advanced AI matching algorithms',
      'Direct messaging and InMail',
      'Project portfolio analysis',
      'University GPA verification',
      'Advanced analytics & reporting'
    ],
    pricing: 'From €97/month',
    registrationPath: '/auth/register/recruiter'
  },
  {
    id: 'university',
    title: 'University / Career Services',
    subtitle: 'Enhance your students\' career outcomes',
    description: 'Integrate with our platform to boost student placement rates and build stronger industry partnerships through transparent career services.',
    icon: School,
    color: 'bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-500',
    features: [
      'Free trial for universities',
      'Student placement tracking',
      'Industry partnership tools',
      'Real-time employment analytics',
      'Career outcome measurement',
      'Custom university branding',
      'API integration with SIS'
    ],
    pricing: 'Custom pricing',
    registrationPath: '/auth/register/university'
  }
]

export default function RoleSelectionPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const handleRoleSelect = (userType: UserType) => {
    setSelectedRole(userType.id)
    // Navigate to role-specific registration
    router.push(userType.registrationPath)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-blue-50/50 relative overflow-hidden">
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
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                InTransparency
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Already have an account?</span>
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="mb-8">
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 mb-6">
              <Shield className="h-3 w-3 mr-1" />
              Trusted by Universities Worldwide
            </Badge>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
              Join InTransparency
            </span>
          </h1>

          <p className="text-2xl text-gray-700 max-w-4xl mx-auto mb-10 leading-relaxed">
            The bridge between universities and industry.
            <span className="text-blue-600 font-semibold"> Complete transparency</span> in connecting talent with opportunity.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 text-base text-gray-600 mb-8">
            <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Check className="h-5 w-5 mr-3 text-blue-500" />
              <span className="font-medium">Verified student profiles</span>
            </div>
            <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Check className="h-5 w-5 mr-3 text-blue-500" />
              <span className="font-medium">Direct university integration</span>
            </div>
            <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Check className="h-5 w-5 mr-3 text-blue-500" />
              <span className="font-medium">AI-powered matching</span>
            </div>
          </div>

          <div className="text-lg text-gray-700">
            Choose your path and experience complete transparency in your journey.
          </div>
        </div>

        {/* User Type Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {userTypes.map((userType) => {
            const Icon = userType.icon
            return (
              <Card
                key={userType.id}
                className={`relative overflow-hidden border transition-all duration-500 hover:shadow-2xl hover:scale-105 cursor-pointer group bg-white/70 backdrop-blur-sm ${
                  userType.popular
                    ? 'border-blue-400 shadow-xl ring-2 ring-blue-200/50'
                    : 'border-blue-100 hover:border-blue-300 hover:shadow-blue-100/50'
                }`}
                onClick={() => handleRoleSelect(userType)}
              >
                {userType.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg px-4 py-1">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-transparent rounded-full transform rotate-45"></div>
                </div>

                <CardHeader className="pb-6 pt-8">
                  <div className={`w-18 h-18 rounded-2xl ${userType.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-9 w-9 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900 mb-2">{userType.title}</CardTitle>
                  <CardDescription className="text-lg text-gray-600 leading-relaxed">{userType.subtitle}</CardDescription>
                  <div className="mt-6">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                      {userType.pricing}
                    </div>
                    {userType.id === 'student' && (
                      <p className="text-sm text-blue-600 font-semibold mt-1">Always free • Complete transparency</p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">{userType.description}</p>

                  {/* Features */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 text-lg">What you get:</h4>
                    <div className="space-y-3">
                      {userType.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                            <Check className="h-3 w-3 text-blue-600" />
                          </div>
                          <span className="text-gray-700 leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    className={`w-full group text-lg py-6 shadow-lg ${
                      userType.popular
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                    }`}
                    size="lg"
                  >
                    Get Started as {userType.title.split(' /')[0]}
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  {userType.id === 'student' && (
                    <p className="text-sm text-center text-blue-600 font-medium">
                      No credit card required • Set up in 2 minutes
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Value Propositions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center group">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200/80 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Shield className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Complete Transparency</h3>
            <p className="text-gray-600 leading-relaxed">
              Direct university integration ensures all academic records are authentic and verified with complete transparency.
            </p>
          </div>
          <div className="text-center group">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200/80 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Award className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Project-Based Assessment</h3>
            <p className="text-gray-600 leading-relaxed">
              Go beyond grades with real project portfolios that demonstrate actual skills and capabilities with full transparency.
            </p>
          </div>
          <div className="text-center group">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200/80 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Zap className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Matching</h3>
            <p className="text-gray-600 leading-relaxed">
              Advanced algorithms ensure the best fits between student skills and company needs through transparent matching processes.
            </p>
          </div>
        </div>

        {/* Universal Survey Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 text-white shadow-2xl">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Help Us Build the Perfect Platform</h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Shape the future of transparent education-to-career connections.
                Your insights drive our development for students, companies, and universities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center group hover:bg-white/15 transition-colors">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Students & Graduates</h3>
                <p className="text-blue-100">Share how you want to showcase your academic achievements and find opportunities</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center group hover:bg-white/15 transition-colors">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Companies & Recruiters</h3>
                <p className="text-blue-100">Tell us your recruitment challenges and ideal candidate discovery process</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center group hover:bg-white/15 transition-colors">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <School className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Universities & Career Services</h3>
                <p className="text-blue-100">Help us understand how to best support student placement and industry partnerships</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <h3 className="text-xl font-bold mb-4">What We Want to Learn From You:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-blue-100">Current challenges in your field</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-blue-100">Most important features for your needs</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-blue-100">How you currently solve problems</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-blue-100">What transparency means to you</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-blue-100">Ideal platform experience</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-blue-100">Features you'd pay for vs expect free</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-lg text-blue-100">
                <strong>7-minute survey</strong> • Early access to platform • Influence feature development • Beta testing opportunities
              </p>
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg text-lg px-8 py-4 group"
                asChild
              >
                <Link href="/survey">
                  Take Platform Survey
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <p className="text-sm text-blue-200">
                Survey responses from all user types help us build a platform that works perfectly for everyone
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}