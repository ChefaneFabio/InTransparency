'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2, Loader2, CheckCircle, Shield, Search, Clock, Zap, Users } from 'lucide-react'

export default function RecruiterRegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'RECRUITER'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (signInResult?.error) {
        router.push('/auth/login?registered=true')
      } else {
        router.push('/dashboard/recruiter')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const benefits = [
    {
      icon: Shield,
      title: 'Verified Skills Only',
      description: 'Every skill backed by university projects - zero resume inflation'
    },
    {
      icon: Search,
      title: 'AI-Powered Matching',
      description: '92% match accuracy with verified skill data'
    },
    {
      icon: Clock,
      title: '50% Faster Hiring',
      description: 'Skip resume screening - see verified work samples instantly'
    },
    {
      icon: Zap,
      title: 'Pay Per Contact',
      description: 'Browse 10,000+ graduates free. Pay only when you connect.'
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl w-full">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Value Proposition */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Search className="h-4 w-4" />
                Browse Free, Pay Per Contact
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Hire Verified Talent, Not Resumes
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Access 10,000+ university-verified graduates. Every skill is traceable to actual coursework and projects - no more guessing if candidates can deliver.
              </p>

              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon
                  return (
                    <div key={index} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
                      <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pricing */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Simple, Transparent Pricing</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Browse all candidates</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contact a candidate</span>
                    <span className="font-medium text-gray-900">€10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Post job listings</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="p-4 bg-white rounded-xl border border-gray-200">
                <p className="text-gray-600 italic text-sm mb-3">
                  "We hired 3 senior engineers in 2 months - faster than any other channel. The verified projects saved us hours of technical screening."
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    MB
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Marco Bianchi</p>
                    <p className="text-xs text-gray-500">Head of Talent, TechCorp Solutions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <div className="text-center mb-6 lg:text-left">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Create Company Account</h1>
              <p className="text-gray-600 mt-1">Start hiring verified talent today</p>
            </div>

            {/* Mobile Benefits */}
            <div className="lg:hidden mb-6 p-4 bg-white rounded-xl shadow-sm">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium text-sm">Why companies choose us:</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Browse 10,000+ candidates free</li>
                <li>• University-verified skills only</li>
                <li>• 50% faster time-to-hire</li>
                <li>• Pay €10 per contact only</li>
              </ul>
            </div>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Your Details</CardTitle>
                <CardDescription>Create your recruiter account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Work Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="At least 8 characters"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      minLength={8}
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Start Hiring - Free to Browse'
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    No credit card required. Browse candidates immediately.
                  </p>
                </form>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-blue-600 hover:text-blue-500">
                      Sign in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
