'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle,
  HelpCircle,
  User,
  Building2
} from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { IMAGES } from '@/lib/images'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    subject: '',
    message: '',
    priority: 'medium'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

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
    <div className="min-h-screen hero-bg">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary to-secondary text-white relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-10">
            <Image
              src={IMAGES.companies.team}
              alt="Background pattern"
              fill
              className="object-cover"
            />
          </div>
          <div className="container max-w-4xl mx-auto px-4 text-center relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-display font-bold mb-6"
            >
              Contact & Support
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-white max-w-2xl mx-auto"
            >
              Have questions about InTransparency? Need technical support? We're here to help you transform your academic journey into career success.
            </motion.p>
          </div>
        </section>

        {/* Contact Information & Form */}
        <section className="py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                    Let's Start a Conversation
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Whether you're a student, recruiter, or university, we're excited to hear from you and help you succeed.
                  </p>
                </div>

                {/* Contact Methods */}
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Email Us</h3>
                          <p className="text-gray-600">hello@intransparency.com</p>
                          <p className="text-sm text-gray-700">We typically respond within 24 hours</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Phone className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Call Us</h3>
                          <p className="text-gray-600">+39 348 170 1615</p>
                          <p className="text-sm text-gray-700">Mon-Fri, 9AM-6PM CET</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <MapPin className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Based in</h3>
                          <p className="text-gray-600">Bergamo, Italy</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Support Resources */}
                <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <HelpCircle className="h-5 w-5 mr-2" />
                      Support Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Common Questions</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• How do I upload my projects?</li>
                          <li>• How does AI analysis work?</li>
                          <li>• How to access AI conversational search?</li>
                          <li>• What formats are supported?</li>
                        </ul>
                      </div>
                      <div className="pt-4 border-t border-primary/20">
                        <p className="text-sm text-gray-700 mb-3">
                          <strong>Students:</strong> Access AI Job Search from your dashboard
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>Recruiters:</strong> Access AI Candidate Search from your dashboard
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Send us a Message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isSubmitted ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                        <p className="text-gray-600 mb-4">
                          Thank you for reaching out. We'll get back to you within 24 hours.
                        </p>
                        <Button onClick={() => setIsSubmitted(false)} variant="outline">
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              name="name"
                              required
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Your full name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="your@email.com"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Company/University
                            </label>
                            <input
                              type="text"
                              name="company"
                              value={formData.company}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Your organization"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Role
                            </label>
                            <select
                              name="role"
                              value={formData.role}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Select your role</option>
                              <option value="student">Student</option>
                              <option value="recruiter">Recruiter</option>
                              <option value="university-admin">University Admin</option>
                              <option value="professor">Professor</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subject *
                          </label>
                          <input
                            type="text"
                            name="subject"
                            required
                            value={formData.subject}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="What can we help you with?"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Priority
                          </label>
                          <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="low">Low - General inquiry</option>
                            <option value="medium">Medium - Need assistance</option>
                            <option value="high">High - Urgent issue</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message *
                          </label>
                          <textarea
                            name="message"
                            required
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={5}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Please describe your question or issue in detail..."
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
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* AI Conversational Search - How to Access */}
        <section className="py-16 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-foreground mb-4">
                AI Conversational Search
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Use natural language to find exactly what you need - jobs for students, candidates for recruiters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* For Students */}
              <Card className="bg-white border-2 border-primary/20 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <User className="h-6 w-6 mr-2" />
                    For Students: AI Job Search
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    Search for jobs using natural language. Companies find YOU for specific competencies:
                  </p>
                  <div className="bg-primary/10 rounded-lg p-4 space-y-2 text-sm">
                    <p className="font-mono text-gray-800">"Frontend developer React 2 years Milan startup"</p>
                    <p className="font-mono text-gray-800">"Data science Python remote entry-level"</p>
                    <p className="font-mono text-gray-800">"UX designer portfolio healthcare remote"</p>
                  </div>
                  <div className="pt-4 border-t border-primary/10">
                    <h4 className="font-semibold text-gray-900 mb-2">How to Access:</h4>
                    <ol className="space-y-2 text-sm text-gray-700">
                      <li>1. Log in to your student account</li>
                      <li>2. Go to your Dashboard</li>
                      <li>3. Click <strong>"AI Job Search"</strong> in the Quick Actions menu</li>
                      <li>4. Start chatting with our AI to find perfect job matches</li>
                    </ol>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg" asChild>
                    <a href="/dashboard/student/ai-job-search">
                      Try AI Job Search →
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* For Recruiters */}
              <Card className="bg-white border-2 border-primary/20 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <Building2 className="h-6 w-6 mr-2" />
                    For Recruiters: AI Candidate Search
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    Find verified candidates with natural language. Zero screening CVs:
                  </p>
                  <div className="bg-primary/10 rounded-lg p-4 space-y-2 text-sm">
                    <p className="font-mono text-gray-800">"Cybersecurity Roma Network Security 30/30"</p>
                    <p className="font-mono text-gray-800">"Data engineer Python Spark 27+ GPA Milan"</p>
                    <p className="font-mono text-gray-800">"Frontend React TypeScript leadership Berlin"</p>
                  </div>
                  <div className="mt-4 bg-primary/20 rounded-lg p-3 text-sm">
                    <p className="text-primary">
                      <strong>Result:</strong> See 5-10 verified matches with actual projects + AI-analyzed soft skills → Pay €10 only per contact
                    </p>
                  </div>
                  <div className="pt-4 border-t border-primary/10">
                    <h4 className="font-semibold text-gray-900 mb-2">How to Access:</h4>
                    <ol className="space-y-2 text-sm text-gray-700">
                      <li>1. Register free (no credit card)</li>
                      <li>2. Go to your Dashboard</li>
                      <li>3. Click <strong>"AI Candidate Search"</strong> in Quick Actions</li>
                      <li>4. Type natural search, see verified matches, pay €10 only per contact</li>
                    </ol>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg" asChild>
                    <a href="/dashboard/recruiter/ai-search">
                      Try AI Candidate Search →
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Card className="inline-block bg-gradient-to-r from-primary to-secondary text-white">
                <CardContent className="p-6">
                  <p className="text-lg">
                    💡 <strong>Pro Tip:</strong> The AI understands natural language - just describe what you're looking for as if talking to a person!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Office Hours */}
        <section className="py-16 hero-bg">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-display font-bold text-foreground mb-8">Office Hours</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Support Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM CET</p>
                  <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM CET</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
                  <p className="text-gray-600">Email: Within 24 hours</p>
                  <p className="text-gray-600">Phone: Immediate during office hours</p>
                  <p className="text-gray-600">Chat: Within 2 hours</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}