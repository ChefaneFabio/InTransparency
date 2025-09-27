'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Book,
  Code,
  Users,
  Zap,
  Shield,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Download,
  Github,
  FileText,
  Play
} from 'lucide-react'

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('getting-started')

  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: Play },
    { id: 'api', name: 'API Reference', icon: Code },
    { id: 'integrations', name: 'Integrations', icon: Zap },
    { id: 'student-guide', name: 'Student Guide', icon: Users },
    { id: 'recruiter-guide', name: 'Recruiter Guide', icon: Users },
    { id: 'security', name: 'Security', icon: Shield }
  ]

  const quickStart = [
    {
      title: 'Create Your Account',
      description: 'Sign up and choose your role (Student, Recruiter, or University)',
      time: '2 min'
    },
    {
      title: 'Upload Your First Project',
      description: 'Add your code repository or project files for AI analysis',
      time: '5 min'
    },
    {
      title: 'Optimize Your Profile',
      description: 'Complete your profile to increase visibility and matches',
      time: '10 min'
    },
    {
      title: 'Start Connecting',
      description: 'Browse opportunities or candidates based on your role',
      time: '5 min'
    }
  ]

  const documentation = {
    'getting-started': [
      {
        title: 'Welcome to InTransparency',
        description: 'Learn about our platform and how it works',
        category: 'Overview',
        readTime: '5 min'
      },
      {
        title: 'Account Setup and Verification',
        description: 'Step-by-step guide to setting up your account',
        category: 'Setup',
        readTime: '8 min'
      },
      {
        title: 'Understanding AI Analysis',
        description: 'How our AI evaluates projects and generates insights',
        category: 'AI Features',
        readTime: '12 min'
      },
      {
        title: 'Privacy and Data Protection',
        description: 'How we protect your data and maintain privacy',
        category: 'Security',
        readTime: '6 min'
      }
    ],
    'api': [
      {
        title: 'API Authentication',
        description: 'How to authenticate with our API using API keys',
        category: 'Authentication',
        readTime: '10 min'
      },
      {
        title: 'Projects API',
        description: 'Upload, analyze, and manage projects programmatically',
        category: 'Endpoints',
        readTime: '15 min'
      },
      {
        title: 'Users API',
        description: 'Manage user profiles and preferences',
        category: 'Endpoints',
        readTime: '12 min'
      },
      {
        title: 'Webhooks',
        description: 'Receive real-time notifications about events',
        category: 'Webhooks',
        readTime: '8 min'
      }
    ],
    'integrations': [
      {
        title: 'GitHub Integration',
        description: 'Connect your GitHub repositories for automatic analysis',
        category: 'Version Control',
        readTime: '7 min'
      },
      {
        title: 'GitLab Integration',
        description: 'Sync projects from GitLab repositories',
        category: 'Version Control',
        readTime: '6 min'
      },
      {
        title: 'LinkedIn Integration',
        description: 'Import professional information from LinkedIn',
        category: 'Professional Networks',
        readTime: '5 min'
      },
      {
        title: 'University LMS Integration',
        description: 'Connect with learning management systems',
        category: 'Education',
        readTime: '10 min'
      }
    ],
    'student-guide': [
      {
        title: 'Optimizing Your Portfolio',
        description: 'Best practices for showcasing your projects',
        category: 'Portfolio',
        readTime: '15 min'
      },
      {
        title: 'Getting Discovered by Recruiters',
        description: 'Tips to increase your visibility and match rate',
        category: 'Visibility',
        readTime: '10 min'
      },
      {
        title: 'Understanding Your Scores',
        description: 'What your AI analysis scores mean and how to improve them',
        category: 'AI Analysis',
        readTime: '12 min'
      },
      {
        title: 'CV Generation and Export',
        description: 'How to generate and customize your AI-powered CV',
        category: 'CV Tools',
        readTime: '8 min'
      }
    ],
    'recruiter-guide': [
      {
        title: 'Finding the Right Candidates',
        description: 'Advanced search and filtering techniques',
        category: 'Search',
        readTime: '12 min'
      },
      {
        title: 'Evaluating Student Projects',
        description: 'How to assess technical skills through projects',
        category: 'Evaluation',
        readTime: '15 min'
      },
      {
        title: 'Managing Your Pipeline',
        description: 'Organizing and tracking candidate interactions',
        category: 'Management',
        readTime: '10 min'
      },
      {
        title: 'Company Profile Optimization',
        description: 'Making your company attractive to top talent',
        category: 'Branding',
        readTime: '8 min'
      }
    ],
    'security': [
      {
        title: 'Data Protection Overview',
        description: 'How we protect your sensitive information',
        category: 'Privacy',
        readTime: '8 min'
      },
      {
        title: 'GDPR Compliance',
        description: 'Our commitment to European data protection standards',
        category: 'Compliance',
        readTime: '6 min'
      },
      {
        title: 'Two-Factor Authentication',
        description: 'Securing your account with 2FA',
        category: 'Account Security',
        readTime: '5 min'
      },
      {
        title: 'Code Security and IP Protection',
        description: 'How we protect your intellectual property',
        category: 'IP Protection',
        readTime: '10 min'
      }
    ]
  }

  const resources = [
    {
      title: 'API Playground',
      description: 'Interactive API testing environment',
      icon: Code,
      link: '/api/playground',
      external: false
    },
    {
      title: 'GitHub Repository',
      description: 'Sample code and SDK downloads',
      icon: Github,
      link: 'https://github.com/intransparency',
      external: true
    },
    {
      title: 'Postman Collection',
      description: 'Ready-to-use API collection',
      icon: Download,
      link: '/downloads/postman-collection.json',
      external: false
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      icon: Play,
      link: '/help#videos',
      external: false
    }
  ]

  const currentDocs = documentation[selectedCategory as keyof typeof documentation] || []

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Documentation
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Everything you need to build, integrate, and succeed with InTransparency
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Quick Start Guide
              </h2>
              <p className="text-lg text-gray-600">
                Get up and running in under 20 minutes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStart.map((step, index) => (
                <Card key={index} className="relative">
                  <CardContent className="p-6">
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 mt-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {step.time}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Main Documentation */}
        <section className="py-16 bg-white">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                  <nav className="space-y-2">
                    {categories.map((category) => {
                      const Icon = category.icon
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                            selectedCategory === category.id
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-600 hover:bg-slate-100'
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {category.name}
                        </button>
                      )
                    })}
                  </nav>
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-3">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {categories.find(c => c.id === selectedCategory)?.name}
                  </h2>
                  <p className="text-gray-600">
                    {selectedCategory === 'getting-started' && 'Start your journey with InTransparency'}
                    {selectedCategory === 'api' && 'Complete API reference and examples'}
                    {selectedCategory === 'integrations' && 'Connect with your favorite tools'}
                    {selectedCategory === 'student-guide' && 'Maximize your profile and opportunities'}
                    {selectedCategory === 'recruiter-guide' && 'Find and hire the best talent'}
                    {selectedCategory === 'security' && 'Security, privacy, and compliance information'}
                  </p>
                </div>

                {/* Documentation Articles */}
                <div className="space-y-4">
                  {currentDocs.map((doc, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {doc.category}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{doc.description}</p>
                            <div className="flex items-center text-xs text-gray-700">
                              <FileText className="h-3 w-3 mr-1" />
                              {doc.readTime}
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-600" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="py-16 bg-blue-50/30">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Developer Resources
              </h2>
              <p className="text-lg text-gray-600">
                Tools and resources to accelerate your development
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resources.map((resource, index) => {
                const Icon = resource.icon
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                      <Button variant="outline" size="sm" className="w-full">
                        {resource.external ? (
                          <>
                            Open <ExternalLink className="ml-2 h-3 w-3" />
                          </>
                        ) : (
                          <>
                            View <ArrowRight className="ml-2 h-3 w-3" />
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Help CTA */}
        <section className="py-16">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Need More Help?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Book className="h-5 w-5 mr-2" />
                Browse Help Center
              </Button>
              <Button size="lg" variant="outline">
                <Users className="h-5 w-5 mr-2" />
                Join Community
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}