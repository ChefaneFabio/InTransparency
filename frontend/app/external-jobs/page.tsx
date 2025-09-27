'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ExternalLink,
  MapPin,
  Calendar,
  Clock,
  Building,
  Users,
  Send,
  Briefcase,
  Globe,
  Filter,
  Search,
  Zap,
  CheckCircle,
  Heart,
  BookmarkPlus,
  Upload,
  FileText,
  Star,
  TrendingUp,
  AlertCircle,
  Eye,
  ArrowRight,
  Copy,
  Download
} from 'lucide-react'

export default function ExternalJobsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState<any>(null)

  const jobSources = [
    { name: 'LinkedIn', count: 1247, logo: '🔗' },
    { name: 'Indeed', count: 892, logo: '🔍' },
    { name: 'AngelList', count: 456, logo: '👼' },
    { name: 'Company Careers', count: 234, logo: '🏢' },
    { name: 'Stack Overflow', count: 178, logo: '📚' }
  ]

  const externalJobs = [
    {
      id: 1,
      title: 'AI Native Builder (People)',
      company: 'WeRoad',
      location: 'Milan (Hybrid)',
      type: 'Full-time',
      contractType: '12-months Fixed Term',
      salary: 'Competitive',
      description: 'Build and launch projects that reshape how our People Team operates, from recruitment and onboarding to performance and growth helping us scale faster and smarter.',
      fullDescription: `ABOUT WEROAD: CONNECTING PEOPLE, CULTURES, AND STORIES

Founded in 2017, WeRoad is a fast-growing startup that is disrupting the travel industry in Italy, Spain, UK, Germany, France and Switzerland!

With 200 team members and 3K Travel Coordinators, we're a community of travelers who turn every trip into a life-changing experience. We connect like-minded millennials and send them on adventures to 300+ destinations worldwide.

ABOUT THE ROLE

What you'll do:
• Build and launch projects that reshape how our People Team operates
• Automate and streamline People workflows, turning complexity into smooth, scalable systems
• Spot inefficiencies in how the People Team works and design creative, AI-powered solutions
• Partner with the People Team to translate their challenges into bold initiatives
• Drive experiments in engagement, and talent operations
• Use data and insights to track what's working and make evidence-based decisions

The Builder we are looking for:
• You're an HR Tech enthusiast who uses AI for fun, not just for work
• You believe the People function should be a strategic powerhouse
• You see yourself in our guiding principles: Agility, Ownership, Ambition`,
      requirements: [
        'HR Tech enthusiast who uses AI for fun, not just for work',
        'Believe People function should be strategic powerhouse',
        'Agility, Ownership, Ambition mindset',
        'Experience with AI/automation tools',
        'Strong problem-solving skills'
      ],
      benefits: [
        'Unlimited holiday – You are a master of your own time',
        'Opportunities to learn – Training and learning opportunities',
        'Meal vouchers (€8/day)',
        'Hybrid working – Flexible working arrangements',
        'Work from destination up to 1 month per year',
        'Vibrant co-working space, team buildings and meet-ups'
      ],
      matchScore: 94,
      applicationDeadline: '2024-02-15',
      posted: '3 days ago',
      applicants: 47,
      isExternal: true,
      externalUrl: 'https://career.weroad.it/jobs/2847419-ai-native-builder-people',
      source: 'Company Careers',
      companyLogo: null,
      tags: ['AI', 'HR Tech', 'Startup', 'Travel', 'Milan'],
      status: 'open',
      applicationRequirements: {
        cvRequired: false,
        portfolioRequired: true,
        coverLetterRequired: false,
        customFields: [
          { field: 'project_demo', label: 'Project/Demo/Video/Tool', required: true, type: 'file' },
          { field: 'salary_expectations', label: 'Salary Expectations', required: true, type: 'text' },
          { field: 'travel_coordinator', label: 'Are you a travel coordinator?', required: true, type: 'boolean' }
        ]
      }
    },
    {
      id: 2,
      title: 'Senior Machine Learning Engineer',
      company: 'Spotify',
      location: 'Stockholm, Sweden (Remote OK)',
      type: 'Full-time',
      contractType: 'Permanent',
      salary: '€80,000 - €120,000',
      description: 'Join our ML platform team to build scalable machine learning infrastructure that powers music recommendations for 500M+ users worldwide.',
      fullDescription: `Join Spotify's ML Platform team and help us build the infrastructure that powers music discovery for over 500 million users worldwide.

As a Senior ML Engineer, you'll work on:
• Designing and implementing scalable ML pipelines
• Building real-time recommendation systems
• Optimizing ML model performance at massive scale
• Collaborating with product teams to ship ML-powered features

We're looking for someone with:
• 5+ years of ML/data engineering experience
• Strong Python and distributed systems knowledge
• Experience with Kubernetes, Spark, and cloud platforms
• Passion for music and audio processing (bonus!)`,
      requirements: [
        'Masters in CS/ML or equivalent experience',
        '3+ years production ML experience',
        'Python, TensorFlow, Kubernetes expertise',
        'Distributed systems experience',
        'Music/audio processing knowledge (preferred)'
      ],
      benefits: [
        'Equity package with high growth potential',
        'Comprehensive health insurance',
        'Spotify Premium for you and family',
        'Learning budget €4000/year',
        '6 months parental leave',
        'Wellness stipend €1000/year'
      ],
      matchScore: 89,
      applicationDeadline: '2024-02-20',
      posted: '1 week ago',
      applicants: 234,
      isExternal: true,
      externalUrl: 'https://www.lifeatspotify.com/jobs/5847392',
      source: 'Company Careers',
      companyLogo: null,
      tags: ['Machine Learning', 'Music', 'Scale', 'Python', 'Stockholm'],
      status: 'open',
      applicationRequirements: {
        cvRequired: true,
        portfolioRequired: false,
        coverLetterRequired: true,
        customFields: []
      }
    },
    {
      id: 3,
      title: 'Senior Frontend Developer',
      company: 'Revolut',
      location: 'London, UK',
      type: 'Full-time',
      contractType: 'Permanent',
      salary: '£90,000 - £130,000',
      description: 'Build the next generation of financial products that millions of customers use daily. Work with React, TypeScript, and modern frontend technologies.',
      fullDescription: `Join Revolut's frontend team and help build the financial products that are changing how millions of people manage their money.

You'll be working on:
• Building responsive web applications with React and TypeScript
• Implementing complex financial features (payments, trading, crypto)
• Optimizing performance for high-traffic applications
• Collaborating with design and backend teams
• Mentoring junior developers

Requirements:
• 5+ years of frontend development experience
• Expert-level React and TypeScript skills
• Experience with state management (Redux/Zustand)
• Understanding of financial services (preferred)
• Experience with testing frameworks`,
      requirements: [
        '5+ years frontend development experience',
        'React and TypeScript expert level',
        'Financial services experience preferred',
        'State management expertise (Redux/Zustand)',
        'Testing frameworks experience'
      ],
      benefits: [
        'Share options with unicorn valuation',
        'Private health insurance',
        'Flexible working arrangements',
        'Learning stipend £2000/year',
        '25 days holiday + bank holidays',
        'Revolut products for free'
      ],
      matchScore: 91,
      applicationDeadline: '2024-02-25',
      posted: '2 days ago',
      applicants: 156,
      isExternal: true,
      externalUrl: 'https://www.revolut.com/careers/5847392',
      source: 'Company Careers',
      companyLogo: null,
      tags: ['React', 'FinTech', 'TypeScript', 'London', 'Senior'],
      status: 'open',
      applicationRequirements: {
        cvRequired: true,
        portfolioRequired: true,
        coverLetterRequired: false,
        customFields: [
          { field: 'github_portfolio', label: 'GitHub Portfolio', required: true, type: 'url' },
          { field: 'live_projects', label: 'Live Project URLs', required: false, type: 'textarea' }
        ]
      }
    }
  ]

  const filteredJobs = externalJobs.filter(job => {
    const matchesSearch = searchQuery === '' ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesFilters = selectedFilters.length === 0 ||
      selectedFilters.some(filter => job.tags.includes(filter))

    return matchesSearch && matchesFilters
  })

  const handleQuickApply = (job: any) => {
    setSelectedJob(job)
    setShowApplicationModal(true)
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">External Job Board</h1>
        <p className="text-gray-600 mt-2">
          Apply to external opportunities using your InTransparency profile and AI-generated CV
        </p>
      </div>

      {/* Job Sources Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Connected Job Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {jobSources.map((source, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">{source.logo}</div>
                <p className="font-medium text-gray-900">{source.name}</p>
                <p className="text-sm text-gray-600">{source.count} jobs</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
              <input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <div className="space-y-6">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-blue-500">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {job.company.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
                      <div className={`px-2 py-1 rounded-full text-sm font-semibold ${getMatchScoreColor(job.matchScore)}`}>
                        {job.matchScore}% Match
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        {job.company}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.type} • {job.contractType}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {job.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Quick Details Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-gray-900 mb-1">Salary</p>
                  <p className="text-gray-600">{job.salary}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-gray-900 mb-1">Applicants</p>
                  <p className="text-gray-600">{job.applicants} applied</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-gray-900 mb-1">Deadline</p>
                  <p className="text-gray-600">{job.applicationDeadline}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-gray-900 mb-1">Source</p>
                  <p className="text-gray-600">{job.source}</p>
                </div>
              </div>

              {/* Application Requirements */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Application Requirements
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <CheckCircle className={`h-3 w-3 mr-2 ${job.applicationRequirements.cvRequired ? 'text-green-500' : 'text-gray-600'}`} />
                      <span className={job.applicationRequirements.cvRequired ? 'text-green-700' : 'text-gray-600'}>
                        CV {job.applicationRequirements.cvRequired ? 'Required' : 'Optional'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className={`h-3 w-3 mr-2 ${job.applicationRequirements.portfolioRequired ? 'text-green-500' : 'text-gray-600'}`} />
                      <span className={job.applicationRequirements.portfolioRequired ? 'text-green-700' : 'text-gray-600'}>
                        Portfolio {job.applicationRequirements.portfolioRequired ? 'Required' : 'Optional'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className={`h-3 w-3 mr-2 ${job.applicationRequirements.coverLetterRequired ? 'text-green-500' : 'text-gray-600'}`} />
                      <span className={job.applicationRequirements.coverLetterRequired ? 'text-green-700' : 'text-gray-600'}>
                        Cover Letter {job.applicationRequirements.coverLetterRequired ? 'Required' : 'Optional'}
                      </span>
                    </div>
                  </div>
                  {job.applicationRequirements.customFields.length > 0 && (
                    <div>
                      <p className="font-medium text-blue-900 mb-1">Custom Fields:</p>
                      <ul className="space-y-1">
                        {job.applicationRequirements.customFields.map((field, index) => (
                          <li key={index} className="text-blue-800 flex items-center">
                            <ArrowRight className="h-3 w-3 mr-1" />
                            {field.label} {field.required && <span className="text-red-500 ml-1">*</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Posted {job.posted}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    High match
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickApply(job)}
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Quick Apply
                  </Button>
                  <Button size="sm" asChild>
                    <a href={job.externalUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Full Details
                    </a>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Application Modal */}
      {showApplicationModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Apply to {selectedJob.title}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowApplicationModal(false)}
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <p className="font-medium text-green-900">InTransparency Profile Ready</p>
                    <p className="text-sm text-green-700">Your AI-generated CV and profile will be used for this application</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    CV to Submit
                  </label>
                  <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-medium">InTransparency AI-Generated CV</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </div>

                {selectedJob.applicationRequirements.customFields.map((field: any, index: number) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'file' && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Upload your project, demo, video, or tool</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Choose File
                        </Button>
                      </div>
                    )}
                    {field.type === 'text' && (
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    )}
                    {field.type === 'textarea' && (
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    )}
                    {field.type === 'boolean' && (
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input type="radio" name={field.field} value="yes" className="mr-2" />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name={field.field} value="no" className="mr-2" />
                          No
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
                <Button
                  onClick={() => setShowApplicationModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}