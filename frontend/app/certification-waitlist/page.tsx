'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Award, CheckCircle2, Sparkles, Mail, User, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function CertificationWaitlistPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    university: '',
    graduationYear: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Track waitlist signup
      console.log('WAITLIST_SIGNUP:', formData)

      // Store in localStorage for now
      const waitlist = JSON.parse(localStorage.getItem('certification_waitlist') || '[]')
      waitlist.push({
        ...formData,
        timestamp: new Date().toISOString(),
        price: 99,
        source: 'certification-landing'
      })
      localStorage.setItem('certification_waitlist', JSON.stringify(waitlist))

      // In production, this would call an API endpoint
      // await fetch('/api/waitlist/certification', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })

      setSubmitted(true)
    } catch (error) {
      console.error('Waitlist error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />

        <main className="pt-24 pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-2 border-green-200 shadow-2xl">
                <CardContent className="p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mx-auto mb-6 rounded-full bg-green-100 p-6 w-24 h-24 flex items-center justify-center"
                  >
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                  </motion.div>

                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    You're on the Waitlist!
                  </h1>

                  <p className="text-xl text-gray-700 mb-8">
                    We'll notify you at <span className="font-semibold text-blue-600">{formData.email}</span> when
                    soft skills certification launches.
                  </p>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <h3 className="font-bold text-lg text-gray-900 mb-3">What happens next?</h3>
                    <ul className="text-left space-y-3">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          You'll receive an email confirmation in the next few minutes
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          We'll send you early access when certification launches (expected: 4-6 weeks)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          <span className="font-semibold">Early bird bonus:</span> First 100 signups get 20% off (€79 instead of €99)
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" asChild>
                      <Link href="/dashboard">
                        Go to Dashboard
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="/">
                        Back to Home
                      </Link>
                    </Button>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Want to help us shape the certification? We're looking for beta testers.
                    </p>
                    <Button variant="link" className="mt-2" asChild>
                      <Link href="/certification/beta-interest">
                        → Express interest in beta testing
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm px-6 py-2 border-0">
                <Sparkles className="inline h-4 w-4 mr-2" />
                Early Access
              </Badge>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Join the Waitlist
              </h1>

              <p className="text-xl text-gray-700 mb-2">
                Soft Skills Certification is launching soon
              </p>

              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Clock className="h-5 w-5" />
                <span>Expected launch: 4-6 weeks</span>
              </div>
            </div>

            <Card className="border-2 border-gray-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex items-center justify-center mb-4">
                  <Award className="h-12 w-12 text-purple-600" />
                </div>
                <CardTitle className="text-center text-2xl">
                  Reserve Your Spot
                </CardTitle>
                <p className="text-center text-gray-600 mt-2">
                  Be among the first to certify your soft skills
                </p>
              </CardHeader>

              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="mt-1"
                        placeholder="John"
                      />
                    </div>

                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="mt-1"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1"
                      placeholder="john.doe@university.edu"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      We'll send you early access when certification launches
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="university" className="text-sm font-medium">
                      University (Optional)
                    </Label>
                    <Input
                      id="university"
                      type="text"
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                      className="mt-1"
                      placeholder="e.g., Politecnico di Milano"
                    />
                  </div>

                  <div>
                    <Label htmlFor="graduationYear" className="text-sm font-medium">
                      Expected Graduation Year (Optional)
                    </Label>
                    <Input
                      id="graduationYear"
                      type="number"
                      min="2024"
                      max="2030"
                      value={formData.graduationYear}
                      onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                      className="mt-1"
                      placeholder="2026"
                    />
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-green-900">Early Bird Discount</p>
                        <p className="text-sm text-green-700 mt-1">
                          First 100 signups get 20% off: <span className="font-bold">€79</span> instead of €99
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg py-6"
                  >
                    {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    By joining, you agree to receive launch notifications and updates about soft skills certification.
                    You can unsubscribe anytime.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Why Join */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                Why Join Now?
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: '🎯',
                    title: 'Early Access',
                    description: 'Be first to certify before your peers'
                  },
                  {
                    icon: '💰',
                    title: '20% Discount',
                    description: 'Save €20 as an early bird (€79 vs €99)'
                  },
                  {
                    icon: '🚀',
                    title: 'Shape the Product',
                    description: 'Your feedback helps us improve'
                  }
                ].map((item, index) => (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow border-gray-200">
                    <CardContent className="p-6">
                      <div className="text-4xl mb-3">{item.icon}</div>
                      <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
