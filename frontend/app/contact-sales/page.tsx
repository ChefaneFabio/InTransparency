'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  Users,
  CheckCircle,
  Calendar,
  Phone,
  Mail,
  ArrowRight,
  Star,
  Award,
  Shield,
  TrendingUp,
  Zap
} from 'lucide-react'

export default function ContactSalesPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    jobTitle: '',
    companySize: '',
    useCase: '',
    phone: '',
    message: '',
    timeline: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const enterpriseFeatures = [
    {
      icon: Users,
      title: 'Institution-wide Access',
      description: 'Unlimited student and faculty accounts with centralized management'
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Comprehensive dashboards for tracking student outcomes and placements'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SSO integration, advanced security controls, and compliance features'
    },
    {
      icon: Award,
      title: 'Custom Branding',
      description: 'White-label solutions with your institution\'s branding and domain'
    },
    {
      icon: Zap,
      title: 'API Integration',
      description: 'Seamless integration with existing LMS and student information systems'
    },
    {
      icon: Building2,
      title: 'Dedicated Support',
      description: '24/7 priority support with dedicated customer success manager'
    }
  ]

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      title: 'Director of Career Services',
      company: 'Stanford University',
      quote: 'InTransparency has transformed how our students showcase their work. We\'ve seen a 40% increase in successful job placements.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      title: 'Head of Talent Acquisition',
      company: 'TechCorp',
      quote: 'The quality of candidates we find through InTransparency is exceptional. Their AI analysis saves us countless hours in screening.',
      rating: 5
    }
  ]

  const stats = [
    { label: 'Universities', value: '200+' },
    { label: 'Companies', value: '500+' },
    { label: 'Students Served', value: '100K+' },
    { label: 'Placement Rate', value: '78%' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Enterprise Solutions for Universities
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Empower your institution with AI-powered career services and industry connections
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule a Demo
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Download Brochure
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* Left: Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Get Started with Enterprise</CardTitle>
                    <p className="text-gray-600">
                      Let's discuss how InTransparency can transform your institution's career services
                    </p>
                  </CardHeader>
                  <CardContent>
                    {isSubmitted ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Request Submitted!</h3>
                        <p className="text-gray-600 mb-4">
                          Thank you for your interest. Our enterprise team will contact you within 24 hours.
                        </p>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p className="flex items-center justify-center">
                            <Mail className="h-4 w-4 mr-2" />
                            Check your email for confirmation
                          </p>
                          <p className="flex items-center justify-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Demo scheduling link included
                          </p>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              First Name *
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              required
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="John"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Last Name *
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              required
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Doe"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Work Email *
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="john.doe@university.edu"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Institution/Company *
                            </label>
                            <input
                              type="text"
                              name="company"
                              required
                              value={formData.company}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="University of Example"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Job Title *
                            </label>
                            <input
                              type="text"
                              name="jobTitle"
                              required
                              value={formData.jobTitle}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Director of Career Services"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Institution Size
                            </label>
                            <select
                              name="companySize"
                              value={formData.companySize}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Select size</option>
                              <option value="small">1-1,000 students</option>
                              <option value="medium">1,000-10,000 students</option>
                              <option value="large">10,000-50,000 students</option>
                              <option value="enterprise">50,000+ students</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Implementation Timeline
                            </label>
                            <select
                              name="timeline"
                              value={formData.timeline}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Select timeline</option>
                              <option value="immediate">Immediate (within 1 month)</option>
                              <option value="quarter">This quarter (1-3 months)</option>
                              <option value="semester">Next semester (3-6 months)</option>
                              <option value="exploring">Just exploring</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Primary Use Case
                          </label>
                          <select
                            name="useCase"
                            value={formData.useCase}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select primary use case</option>
                            <option value="career-services">Enhance career services</option>
                            <option value="industry-partnerships">Strengthen industry partnerships</option>
                            <option value="placement-tracking">Track student placements</option>
                            <option value="portfolio-management">Student portfolio management</option>
                            <option value="recruitment">Campus recruitment</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Information
                          </label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Tell us more about your needs and challenges..."
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              Submit Request
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>

                        <p className="text-xs text-gray-500 text-center">
                          By submitting this form, you agree to our privacy policy and terms of service.
                        </p>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right: Features & Benefits */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Enterprise Features
                  </h2>
                  <div className="space-y-6">
                    {enterpriseFeatures.map((feature, index) => {
                      const Icon = feature.icon
                      return (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                            <p className="text-gray-600 text-sm">{feature.description}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Testimonials */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    What Our Partners Say
                  </h3>
                  <div className="space-y-6">
                    {testimonials.map((testimonial, index) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <div className="flex items-center mb-4">
                            {Array.from({ length: testimonial.rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <blockquote className="text-gray-700 italic mb-4">
                            "{testimonial.quote}"
                          </blockquote>
                          <div>
                            <div className="font-semibold text-gray-900">{testimonial.name}</div>
                            <div className="text-sm text-gray-600">{testimonial.title}</div>
                            <div className="text-sm text-gray-600">{testimonial.company}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Prefer to Talk?</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-blue-600 mr-3" />
                        <span className="text-gray-700">+1 (555) 123-4567</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-blue-600 mr-3" />
                        <span className="text-gray-700">enterprise@intransparency.com</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-4">
                      Our enterprise team is available Monday-Friday, 9AM-6PM PST
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 bg-gray-100">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Trusted by Leading Institutions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
              <div className="text-xl font-bold text-gray-400">Stanford</div>
              <div className="text-xl font-bold text-gray-400">MIT</div>
              <div className="text-xl font-bold text-gray-400">Berkeley</div>
              <div className="text-xl font-bold text-gray-400">Harvard</div>
              <div className="text-xl font-bold text-gray-400">CMU</div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}