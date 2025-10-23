'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageCircle, Gift, Clock, Users, CheckCircle2, Calendar, Video } from 'lucide-react'
import { motion } from 'framer-motion'

type ParticipantType = 'student' | 'recruiter' | ''

export default function InterviewRecruitmentPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [participantType, setParticipantType] = useState<ParticipantType>('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    company: '',
    university: '',
    graduationYear: '',
    availability: '',
    motivation: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Protect this page - admin only
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/')
    }
  }, [user, isLoading, router])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not admin
  if (!user || user.role !== 'admin') {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const interviewData = {
        ...formData,
        participantType,
        timestamp: new Date().toISOString()
      }

      console.log('INTERVIEW_RECRUITMENT:', interviewData)

      // Store in localStorage
      const interviews = JSON.parse(localStorage.getItem('interview_participants') || '[]')
      interviews.push(interviewData)
      localStorage.setItem('interview_participants', JSON.stringify(interviews))

      // In production, would call API
      // await fetch('/api/validation/interviews', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(interviewData)
      // })

      setSubmitted(true)
    } catch (error) {
      console.error('Interview recruitment error:', error)
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
                    Thank You!
                  </h1>

                  <p className="text-xl text-gray-700 mb-8">
                    We've received your application. We'll contact you at{' '}
                    <span className="font-semibold text-blue-600">{formData.email}</span> within 2-3 business days
                    to schedule your interview.
                  </p>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">What to expect:</h3>
                    <ul className="text-left space-y-3">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          <span className="font-semibold">Email confirmation</span> with scheduling link
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          <span className="font-semibold">30-minute video call</span> via Google Meet or Zoom
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          <span className="font-semibold">€25 Amazon gift card</span> sent after the interview
                        </span>
                      </li>
                      {participantType === 'student' && (
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">
                            <span className="font-semibold">Bonus:</span> Free soft skills certification when we launch (€99 value)
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>

                  <Button size="lg" onClick={() => window.location.href = '/'}>
                    Back to Home
                  </Button>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white text-sm px-6 py-2 border-0">
                <MessageCircle className="inline h-4 w-4 mr-2" />
                User Research
              </Badge>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Help Shape the Future of Soft Skills Certification
              </h1>

              <p className="text-xl text-gray-700 mb-4 max-w-3xl mx-auto">
                We're building a soft skills certification platform for students and we need your insights.
                Participate in a 30-minute interview and get rewarded.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: Gift,
                  title: '€25 Amazon Gift Card',
                  description: 'Compensation for your time'
                },
                {
                  icon: Clock,
                  title: '30 Minutes',
                  description: 'Quick video call at your convenience'
                },
                {
                  icon: Video,
                  title: 'Remote Interview',
                  description: 'Join from anywhere via Zoom/Meet'
                }
              ].map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full text-center hover:shadow-lg transition-shadow border-gray-200">
                      <CardContent className="p-6">
                        <div className="mx-auto mb-4 rounded-full bg-blue-100 p-4 w-16 h-16 flex items-center justify-center">
                          <Icon className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            {/* Participant Type Selection */}
            {!participantType && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="border-2 border-gray-200 shadow-xl mb-8">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Who are you?</CardTitle>
                    <p className="text-gray-600 mt-2">Select your role to get started</p>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Button
                        size="lg"
                        variant="outline"
                        className="h-auto py-8 flex flex-col items-center gap-4 hover:border-blue-500 hover:bg-blue-50"
                        onClick={() => setParticipantType('student')}
                      >
                        <Users className="h-12 w-12 text-blue-600" />
                        <div>
                          <div className="font-bold text-lg mb-2">I'm a Student</div>
                          <div className="text-sm text-gray-600">
                            Currently enrolled or recent graduate
                          </div>
                        </div>
                      </Button>

                      <Button
                        size="lg"
                        variant="outline"
                        className="h-auto py-8 flex flex-col items-center gap-4 hover:border-purple-500 hover:bg-purple-50"
                        onClick={() => setParticipantType('recruiter')}
                      >
                        <Users className="h-12 w-12 text-purple-600" />
                        <div>
                          <div className="font-bold text-lg mb-2">I'm a Recruiter</div>
                          <div className="text-sm text-gray-600">
                            Hiring manager or talent professional
                          </div>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Form */}
            {participantType && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-2 border-gray-200 shadow-xl">
                  <CardHeader className={`${participantType === 'student' ? 'bg-blue-50' : 'bg-purple-50'}`}>
                    <CardTitle className="text-2xl text-center">
                      {participantType === 'student' ? 'Student Interview Application' : 'Recruiter Interview Application'}
                    </CardTitle>
                    <p className="text-center text-gray-600 mt-2">
                      Fill out the form below and we'll be in touch
                    </p>
                  </CardHeader>

                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            placeholder="John"
                          />
                        </div>

                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            placeholder="Doe"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder={participantType === 'student' ? 'john.doe@university.edu' : 'john.doe@company.com'}
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+39 123 456 7890"
                        />
                      </div>

                      {participantType === 'student' ? (
                        <>
                          <div>
                            <Label htmlFor="university">University *</Label>
                            <Input
                              id="university"
                              required
                              value={formData.university}
                              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                              placeholder="e.g., Politecnico di Milano"
                            />
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <Label htmlFor="role">Major/Field of Study *</Label>
                              <Input
                                id="role"
                                required
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                placeholder="e.g., Computer Science"
                              />
                            </div>

                            <div>
                              <Label htmlFor="graduationYear">Graduation Year *</Label>
                              <Select
                                value={formData.graduationYear}
                                onValueChange={(value) => setFormData({ ...formData, graduationYear: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="2024">2024</SelectItem>
                                  <SelectItem value="2025">2025</SelectItem>
                                  <SelectItem value="2026">2026</SelectItem>
                                  <SelectItem value="2027">2027</SelectItem>
                                  <SelectItem value="2028">2028</SelectItem>
                                  <SelectItem value="graduated">Already Graduated</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <Label htmlFor="company">Company *</Label>
                            <Input
                              id="company"
                              required
                              value={formData.company}
                              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                              placeholder="e.g., Acme Corp"
                            />
                          </div>

                          <div>
                            <Label htmlFor="role">Your Role/Title *</Label>
                            <Input
                              id="role"
                              required
                              value={formData.role}
                              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                              placeholder="e.g., Senior Recruiter, Hiring Manager"
                            />
                          </div>
                        </>
                      )}

                      <div>
                        <Label htmlFor="availability">Availability *</Label>
                        <Textarea
                          id="availability"
                          required
                          value={formData.availability}
                          onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                          placeholder="e.g., Weekday afternoons, flexible schedule, prefer mornings"
                          rows={2}
                        />
                      </div>

                      <div>
                        <Label htmlFor="motivation">Why do you want to participate? *</Label>
                        <Textarea
                          id="motivation"
                          required
                          value={formData.motivation}
                          onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                          placeholder="Tell us briefly why you're interested in this research..."
                          rows={3}
                        />
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <Gift className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-green-900">Your Reward</p>
                            <p className="text-sm text-green-700 mt-1">
                              €25 Amazon gift card + {participantType === 'student' && 'free soft skills certification (€99 value) + '}early access to our platform
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white text-lg py-6"
                      >
                        {isSubmitting ? 'Submitting...' : 'Apply for Interview'}
                      </Button>

                      <p className="text-xs text-center text-gray-500">
                        By applying, you consent to participate in user research and agree to our{' '}
                        <a href="/legal" className="underline">privacy policy</a>.
                      </p>

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setParticipantType('')}
                        className="w-full"
                      >
                        ← Change participant type
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* FAQ */}
            {participantType && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-12"
              >
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                  Frequently Asked Questions
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      question: "How long is the interview?",
                      answer: "Approximately 30 minutes via video call (Zoom or Google Meet)."
                    },
                    {
                      question: "When will I get the gift card?",
                      answer: "We'll send the €25 Amazon gift card within 5 business days after your interview."
                    },
                    {
                      question: "What will we discuss?",
                      answer: participantType === 'student'
                        ? "Your job search experience, how you showcase your skills, and interest in soft skills certification."
                        : "Your hiring process, what you look for in candidates, and how you evaluate soft skills."
                    },
                    {
                      question: "Will my data be confidential?",
                      answer: "Yes. All responses are anonymized and used only for product research. We won't share your personal information."
                    }
                  ].map((faq, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-base">{faq.question}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700">{faq.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
