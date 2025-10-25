'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  GraduationCap,
  Building2,
  School,
  ArrowRight,
  Check,
  Star,
  Sparkles,
  Shield,
  Zap,
  ChevronRight,
  Play
} from 'lucide-react'
import { motion } from 'framer-motion'

interface UserType {
  id: string
  title: string
  subtitle: string
  description: string
  icon: any
  gradient: string
  features: string[]
  pricing: string
  popular?: boolean
  registrationPath: string
}

const userTypes: UserType[] = [
  {
    id: 'student',
    title: 'Student',
    subtitle: 'Launch your career with verified credentials',
    description: 'Upload projects in 2 min → AI analyzes skills → Companies find YOU → Zero endless applications',
    icon: GraduationCap,
    gradient: 'from-teal-500 to-blue-600',
    features: [
      'Free forever - all features included',
      'AI Job Search: "Find frontend jobs Milan startup"',
      'Companies find YOU - passive discovery',
      'Complete hard + soft skills analysis',
      'University verification (if partnered)',
      'Direct messages from recruiters'
    ],
    pricing: 'FREE',
    popular: true,
    registrationPath: '/auth/register/student'
  },
  {
    id: 'recruiter',
    title: 'Company',
    subtitle: 'Find verified talent instantly',
    description: 'AI search → "Cybersecurity Roma 30/30" → 8 verified matches → €10 per contact → Zero screening CVs',
    icon: Building2,
    gradient: 'from-blue-600 to-purple-600',
    features: [
      'Browse database FREE - unlimited',
      'AI Candidate Search with examples',
      'Verified projects + AI-analyzed soft skills',
      'Pay €10 only per contact',
      'No subscriptions, credits never expire',
      'University-verified grades & courses'
    ],
    pricing: 'Browse Free → €10/contact',
    registrationPath: '/auth/register/recruiter'
  },
  {
    id: 'institute',
    title: 'University',
    subtitle: 'Enhance student placement outcomes',
    description: 'Partner → Automatic profiles → Companies search autonomously → Save 40h/month → Zero manual work',
    icon: School,
    gradient: 'from-indigo-500 to-purple-600',
    features: [
      'Always free - pay only for customizations',
      'AI Search Hub: students AND jobs',
      'Automatic profile creation from data',
      'Save 40+ hours/month on matching',
      'Real-time placement analytics',
      'Industry partnership tools'
    ],
    pricing: 'Always Free',
    registrationPath: '/auth/register/university'
  }
]

export default function RoleSelectionPage() {
  const router = useRouter()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const handleRoleSelect = (userType: UserType) => {
    router.push(userType.registrationPath)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-100/20 via-transparent to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-purple-100/20 via-transparent to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative border-b border-white/50 backdrop-blur-xl bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                InTransparency
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">Already have an account?</span>
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-6 bg-white/80 backdrop-blur-sm text-blue-700 border-blue-200 shadow-sm">
            <Shield className="h-3 w-3 mr-1" />
            Trusted by 50+ universities worldwide
          </Badge>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Choose Your Path
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Complete transparency in connecting talent with opportunity
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
            {[
              { icon: Check, text: 'University-verified' },
              { icon: Zap, text: 'AI-powered search' },
              { icon: Shield, text: 'Complete transparency' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200/50">
                <item.icon className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">{item.text}</span>
              </div>
            ))}
          </div>

          {/* AI Demo Banner */}
          <Link href="/demo/ai-search">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <div className="relative overflow-hidden bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 bg-[length:200%_100%] animate-gradient rounded-2xl p-[2px] shadow-xl hover:shadow-2xl transition-all">
                <div className="bg-white rounded-2xl px-8 py-6">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <Play className="h-6 w-6 text-purple-600" />
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Try AI Search Demo
                    </span>
                  </div>
                  <p className="text-gray-700 font-medium">
                    No login required • Ask in plain English • See results instantly
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {userTypes.map((userType, index) => {
            const Icon = userType.icon
            return (
              <motion.div
                key={userType.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredCard(userType.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="relative"
              >
                <Card
                  className={`relative h-full overflow-hidden border-2 transition-all duration-300 cursor-pointer group ${
                    userType.popular
                      ? 'border-blue-300 shadow-xl'
                      : 'border-gray-200 hover:border-blue-200'
                  } ${hoveredCard === userType.id ? 'shadow-2xl scale-105' : 'shadow-lg'}`}
                  onClick={() => handleRoleSelect(userType)}
                >
                  {/* Popular Badge */}
                  {userType.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className={`bg-gradient-to-r ${userType.gradient} text-white shadow-lg px-4 py-1`}>
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  {/* Gradient Background Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${userType.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                  <CardHeader className="pb-4 pt-8 space-y-4">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${userType.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <CardTitle className="text-2xl text-gray-900 mb-2">{userType.title}</CardTitle>
                      <p className="text-sm text-gray-600">{userType.subtitle}</p>
                    </div>

                    {/* Pricing */}
                    <div className="pt-2">
                      <div className={`text-3xl font-bold bg-gradient-to-r ${userType.gradient} bg-clip-text text-transparent`}>
                        {userType.pricing}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Description */}
                    <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4">
                      {userType.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-3">
                      {userType.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${userType.gradient} flex items-center justify-center mt-0.5 flex-shrink-0`}>
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-3 pt-4">
                      <Button
                        className={`w-full group bg-gradient-to-r ${userType.gradient} hover:shadow-lg text-base py-6`}
                        size="lg"
                      >
                        Get Started
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full group border-2 hover:bg-gray-50"
                        size="lg"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/demo/ai-search${userType.id === 'student' ? '' : userType.id === 'recruiter' ? '?tab=company' : '?tab=university'}`)
                        }}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Try Demo First
                      </Button>
                    </div>

                    {/* Footer Note */}
                    <p className="text-xs text-center text-gray-500 pt-2">
                      {userType.id === 'student' && 'No credit card • 2 min setup'}
                      {userType.id === 'recruiter' && 'No subscription • Pay per result'}
                      {userType.id === 'institute' && 'Always free • Optional add-ons'}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="max-w-3xl mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Not sure which path to choose?
              </h2>

              <p className="text-lg text-gray-600 mb-8">
                Try our AI search demo to see the platform in action, or contact us for a personalized walkthrough
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg" asChild>
                  <Link href="/demo/ai-search">
                    <Play className="h-5 w-5 mr-2" />
                    Try Interactive Demo
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">
                    Contact Us
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </div>

              <p className="text-sm text-gray-500 mt-6">
                Join 50+ universities and 1,200+ students already on the platform
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  )
}
