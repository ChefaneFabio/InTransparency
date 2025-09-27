'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  CheckCircle,
  GraduationCap,
  Building2,
  School,
  ArrowRight,
  Mail,
  Calendar
} from 'lucide-react'

export default function SurveyThankYouPage() {
  const searchParams = useSearchParams()
  const surveyType = searchParams.get('type') || 'platform'

  const getSurveyIcon = () => {
    switch (surveyType) {
      case 'student':
        return GraduationCap
      case 'company':
        return Building2
      case 'university':
        return School
      default:
        return CheckCircle
    }
  }

  const getSurveyTitle = () => {
    switch (surveyType) {
      case 'student':
        return 'Student Survey'
      case 'company':
        return 'Company Survey'
      case 'university':
        return 'University Survey'
      default:
        return 'Platform Survey'
    }
  }

  const Icon = getSurveyIcon()

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-blue-100/50">
          <CardContent className="p-12 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Thank You for Your Insights!
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-8">
              Your {getSurveyTitle().toLowerCase()} responses will help us build a platform that truly serves your needs.
            </p>

            {/* What Happens Next */}
            <div className="bg-blue-50/80 rounded-2xl p-8 mb-8 text-left">
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">What Happens Next</h2>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Survey Analysis</h3>
                    <p className="text-gray-600 text-sm">We'll analyze your responses along with others to identify key patterns and requirements.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Feature Prioritization</h3>
                    <p className="text-gray-600 text-sm">Your feedback will directly influence which features we build first and how we design them.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Early Access Invitation</h3>
                    <p className="text-gray-600 text-sm">You'll be among the first to receive access to our beta platform and early features.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Ongoing Collaboration</h3>
                    <p className="text-gray-600 text-sm">We may reach out for follow-up questions or to involve you in the development process.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-blue-100/50">
                <Mail className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Early Access</h3>
                <p className="text-sm text-gray-600">First to try new features</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-blue-100/50">
                <Icon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Feature Influence</h3>
                <p className="text-sm text-gray-600">Shape platform development</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-blue-100/50">
                <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Beta Testing</h3>
                <p className="text-sm text-gray-600">Exclusive testing opportunities</p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="space-y-4">
              <p className="text-gray-600">
                Interested in staying connected? We'll send updates on our progress and opportunities to get involved.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  asChild
                >
                  <Link href="/auth/register/role-selection">
                    Get Started with InTransparency
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>

                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50" asChild>
                  <Link href="/">
                    Back to Home
                  </Link>
                </Button>
              </div>
            </div>

            {/* Footer Note */}
            <p className="text-sm text-gray-500 mt-8">
              Your responses are confidential and will only be used to improve our platform development.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}