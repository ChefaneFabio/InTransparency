'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/navigation'
import {
  HelpCircle,
  MessageSquare,
  Mail,
  Book,
  Video,
  Users,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

const faqs = [
  {
    category: 'general',
    questions: [
      {
        q: 'What is InTransparency?',
        a: 'InTransparency is an AI-powered platform that connects students with recruiters through verified academic portfolios and intelligent matching.'
      },
      {
        q: 'How much does it cost?',
        a: 'We offer a free tier for students and universities. Recruiters have access to basic features for free, with premium plans starting at €99/month.'
      },
      {
        q: 'Is my data secure?',
        a: 'Yes! We are GDPR compliant and use industry-standard encryption. Your data is never shared without your explicit consent.'
      }
    ]
  },
  {
    category: 'students',
    questions: [
      {
        q: 'How do I create my portfolio?',
        a: 'Simply sign up, upload your academic projects, and our AI will help create a professional portfolio automatically.'
      },
      {
        q: 'Can I control who sees my profile?',
        a: 'Absolutely! You have full control over your privacy settings and can choose what information to share.'
      },
      {
        q: 'How does verification work?',
        a: 'We verify your academic credentials through your university or through documentation you provide. Verified profiles get a special badge.'
      }
    ]
  },
  {
    category: 'recruiters',
    questions: [
      {
        q: 'How do I search for candidates?',
        a: 'Use our advanced AI search to find candidates by skills, projects, location, and more. You can also use geographic and course-based filters.'
      },
      {
        q: 'Can I export candidate data?',
        a: 'Yes, premium plans include ATS export functionality to seamlessly integrate with your existing recruiting tools.'
      },
      {
        q: 'What is the verification process?',
        a: 'All student profiles on our platform are verified through their universities or documentation, ensuring authentic credentials.'
      }
    ]
  }
]

export default function SupportPage() {
  const t = useTranslations('nav')
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('general')

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  const currentFaqs = faqs.find(f => f.category === selectedCategory)?.questions || []

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
              Support Center
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              How can we help you?
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Find answers to common questions or get in touch with our support team
            </p>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Book className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Browse our comprehensive guides and tutorials
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/how-it-works">
                    View Guides
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-secondary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Contact Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Get personalized help from our support team
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/contact">
                    Contact Us
                    <Mail className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Join our community and connect with other users
                </p>
                <Button variant="outline" asChild className="w-full">
                  <a href="https://github.com/intransparency" target="_blank" rel="noopener noreferrer">
                    Join Community
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <HelpCircle className="mr-2 h-6 w-6" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Category Selector */}
              <div className="flex gap-2 mb-6 flex-wrap">
                <Button
                  variant={selectedCategory === 'general' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('general')}
                  size="sm"
                >
                  General
                </Button>
                <Button
                  variant={selectedCategory === 'students' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('students')}
                  size="sm"
                >
                  For Students
                </Button>
                <Button
                  variant={selectedCategory === 'recruiters' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('recruiters')}
                  size="sm"
                >
                  For Recruiters
                </Button>
              </div>

              {/* FAQ List */}
              <div className="space-y-4">
                {currentFaqs.map((faq, index) => {
                  const faqId = `${selectedCategory}-${index}`
                  const isExpanded = expandedFaq === faqId

                  return (
                    <div
                      key={faqId}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(faqId)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900">{faq.q}</span>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                          <p className="text-gray-700">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Still Need Help */}
          <Card className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="py-12 text-center">
              <h3 className="text-2xl font-bold mb-4">Still need help?</h3>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Our support team is here to help you. Send us a message and we'll get back to you as soon as possible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/contact">
                    Contact Support
                    <MessageSquare className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="mailto:in.transparency.job@gmail.com">
                    Email Us
                    <Mail className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
