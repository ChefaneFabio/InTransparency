'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/navigation'
import { GraduationCap, Building2, Users, ArrowRight, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

const roles = [
  {
    id: 'recruiter',
    name: 'Company',
    description: 'Find and connect with verified top talent from universities',
    icon: Users,
    color: 'from-green-500 to-emerald-500',
    href: '/auth/register/recruiter',
    benefits: [
      'Advanced AI search',
      'Verified candidates',
      'ATS integration',
      'Analytics dashboard'
    ]
  },
  {
    id: 'university',
    name: 'University / ITS',
    description: 'Showcase your students and boost their career opportunities',
    icon: Building2,
    color: 'from-purple-500 to-indigo-500',
    href: '/auth/register/university',
    benefits: [
      'Free for institutions',
      'Student analytics',
      'Placement tracking',
      'Career services tools'
    ]
  },
  {
    id: 'student',
    name: 'Student',
    description: 'Create your academic portfolio and get discovered by top companies',
    icon: GraduationCap,
    color: 'from-blue-500 to-cyan-500',
    href: '/auth/register/student',
    benefits: [
      'Free forever',
      'AI-powered portfolio',
      'Get matched with jobs',
      'Verified credentials'
    ]
  }
]

export default function RegisterPage() {
  const t = useTranslations('nav')
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get('role')

  // If role is specified in query params, redirect to specific registration
  useEffect(() => {
    if (role) {
      const roleMap: { [key: string]: string } = {
        'student': '/auth/register/student',
        'company': '/auth/register/recruiter',
        'recruiter': '/auth/register/recruiter',
        'university': '/auth/register/university',
        'institute': '/auth/register/university'
      }
      const targetPath = roleMap[role.toLowerCase()]
      if (targetPath) {
        router.push(targetPath)
      }
    }
  }, [role, router])

  return (
    <div className="min-h-screen hero-bg">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container max-w-6xl">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-gradient-to-r from-primary to-secondary text-white">
              Join InTransparency
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Choose Your Role
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Select the option that best describes you to get started
            </p>
          </motion.div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {roles.map((roleOption, index) => {
              const Icon = roleOption.icon
              return (
                <motion.div
                  key={roleOption.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                >
                  <Card className="h-full hover:shadow-2xl transition-all border-2 hover:border-primary/50">
                    <CardHeader>
                      <div className={`bg-gradient-to-r ${roleOption.color} p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl text-center">{roleOption.name}</CardTitle>
                      <CardDescription className="text-center">
                        {roleOption.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {roleOption.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start text-sm text-gray-700">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      <Button asChild className={`w-full bg-gradient-to-r ${roleOption.color}`}>
                        <Link href={roleOption.href}>
                          Sign Up as {roleOption.name}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Already Have Account */}
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary hover:underline font-semibold">
                Sign in
              </Link>
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-sm text-gray-600">
              <div>
                <div className="font-bold text-2xl text-primary mb-1">100%</div>
                <div>Free for Students</div>
              </div>
              <div>
                <div className="font-bold text-2xl text-primary mb-1">GDPR</div>
                <div>Compliant</div>
              </div>
              <div>
                <div className="font-bold text-2xl text-primary mb-1">AI-Powered</div>
                <div>Matching</div>
              </div>
              <div>
                <div className="font-bold text-2xl text-primary mb-1">Verified</div>
                <div>Credentials</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
