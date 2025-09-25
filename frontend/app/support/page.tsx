'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  MessageSquare,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Book,
  Video,
  Search,
  ArrowRight,
  Users,
  Zap,
  Shield
} from 'lucide-react'

export default function SupportPage() {
  const [ticketType, setTicketType] = useState('')
  const [urgency, setUrgency] = useState('medium')

  const supportOptions = [
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: 'Mon-Fri, 9AM-6PM PST',
      responseTime: 'Usually within 5 minutes',
      action: 'Start Chat',
      recommended: true
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us a detailed message',
      availability: '24/7',
      responseTime: 'Within 24 hours',
      action: 'Send Email'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our team',
      availability: 'Mon-Fri, 9AM-6PM PST',
      responseTime: 'Immediate',
      action: 'Call Now'
    },
    {
      icon: Book,
      title: 'Help Center',
      description: 'Browse our comprehensive guides',
      availability: '24/7',
      responseTime: 'Self-service',
      action: 'Browse Guides'
    }
  ]

  const quickActions = [
    {
      icon: AlertCircle,
      title: 'Report a Bug',
      description: 'Found something that isn\'t working?',
      link: '/bugs'
    },
    {
      icon: HelpCircle,
      title: 'Account Issues',
      description: 'Problems with login or account access',
      link: '/help#account'
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      link: '/help#videos'
    },
    {
      icon: Users,
      title: 'Community Forum',
      description: 'Connect with other users',
      link: '/community'
    }
  ]

  const statusItems = [
    {
      service: 'InTransparency Platform',
      status: 'Operational',
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      service: 'AI Analysis Engine',
      status: 'Operational',
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      service: 'File Upload Service',
      status: 'Operational',
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      service: 'Email Notifications',
      status: 'Operational',
      icon: CheckCircle,
      color: 'text-green-500'
    }
  ]

  const faqs = [
    {
      question: 'How do I reset my password?',
      answer: 'Go to the login page and click "Forgot Password". Enter your email address and we\'ll send you a reset link.'
    },
    {
      question: 'Why is my project analysis taking so long?',
      answer: 'Project analysis typically takes 5-10 minutes. Large projects or high server load may cause delays. You\'ll receive an email when analysis is complete.'
    },
    {
      question: 'How do I update my profile information?',
      answer: 'Go to your dashboard and click on "Profile" in the sidebar. You can edit your information and save changes there.'
    },
    {
      question: 'Can I delete my account?',
      answer: 'Yes, you can delete your account from the account settings page. Note that this action is permanent and cannot be undone.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Support Center
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              We're here to help you succeed. Get the support you need, when you need it.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
        </section>

        {/* Support Options */}
        <section className="py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How Can We Help You?
              </h2>
              <p className="text-lg text-gray-600">
                Choose the support method that works best for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportOptions.map((option, index) => {
                const Icon = option.icon
                return (
                  <Card key={index} className={`hover:shadow-lg transition-shadow cursor-pointer ${option.recommended ? 'ring-2 ring-blue-200' : ''}`}>
                    <CardContent className="p-6 text-center">
                      {option.recommended && (
                        <Badge className="mb-4 bg-blue-100 text-blue-800">
                          Recommended
                        </Badge>
                      )}
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{option.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{option.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="text-xs text-gray-500">
                          <Clock className="inline h-3 w-3 mr-1" />
                          {option.availability}
                        </div>
                        <div className="text-xs text-gray-500">
                          Response: {option.responseTime}
                        </div>
                      </div>

                      <Button className="w-full" variant={option.recommended ? "default" : "outline"}>
                        {option.action}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-16 bg-white">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                          <p className="text-gray-600 text-sm">{action.description}</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* System Status */}
        <section className="py-16 bg-gray-100">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                System Status
              </h2>
              <p className="text-lg text-gray-600">
                Current status of our services
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-500" />
                  All Systems Operational
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusItems.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <div key={index} className="flex items-center justify-between py-2">
                        <span className="font-medium text-gray-900">{item.service}</span>
                        <div className="flex items-center">
                          <Icon className={`h-4 w-4 mr-2 ${item.color}`} />
                          <span className="text-sm text-gray-600">{item.status}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last updated: 2 minutes ago</span>
                    <Button variant="outline" size="sm">
                      View Status Page
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600">
                Quick answers to common questions
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline">
                View All FAQs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 bg-gray-100">
          <div className="container max-w-2xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Submit a Support Ticket
              </h2>
              <p className="text-lg text-gray-600">
                Can't find what you're looking for? Send us a message.
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Issue Type
                      </label>
                      <select
                        value={ticketType}
                        onChange={(e) => setTicketType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select an issue type</option>
                        <option value="technical">Technical Issue</option>
                        <option value="account">Account Problem</option>
                        <option value="billing">Billing Question</option>
                        <option value="feature">Feature Request</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Urgency
                      </label>
                      <select
                        value={urgency}
                        onChange={(e) => setUrgency(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="low">Low - General question</option>
                        <option value="medium">Medium - Need assistance</option>
                        <option value="high">High - Service impacted</option>
                        <option value="urgent">Urgent - Critical issue</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="Brief description of your issue"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Please describe your issue in detail..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <Button className="w-full">
                    Submit Ticket
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}