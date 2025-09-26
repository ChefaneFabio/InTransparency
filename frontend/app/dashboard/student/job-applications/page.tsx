'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Briefcase,
  ExternalLink,
  MapPin,
  Calendar,
  Clock,
  Building,
  Users,
  Send,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Download,
  Filter,
  Search,
  Globe,
  Zap,
  TrendingUp,
  Heart,
  BookmarkPlus,
  ArrowUpRight,
  Upload
} from 'lucide-react'

export default function JobApplicationsPage() {
  const [activeTab, setActiveTab] = useState<'available' | 'applied' | 'saved'>('available')
  const [autoApplyEnabled, setAutoApplyEnabled] = useState(false)

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
      requirements: [
        'HR Tech enthusiast who uses AI for fun',
        'Believe People function should be strategic',
        'Agility, Ownership, Ambition mindset'
      ],
      benefits: [
        'Unlimited holiday',
        'Learning opportunities',
        'Meal vouchers (€8/day)',
        'Hybrid working',
        'Work from destination 1 month/year'
      ],
      matchScore: 94,
      applicationDeadline: '2024-02-15',
      posted: '3 days ago',
      applicants: 47,
      isExternal: true,
      externalUrl: 'https://career.weroad.it/jobs/2847419-ai-native-builder-people',
      companyLogo: null,
      tags: ['AI', 'HR Tech', 'Startup', 'Travel'],
      status: 'open'
    },
    {
      id: 2,
      title: 'Machine Learning Engineer',
      company: 'Spotify',
      location: 'Stockholm, Sweden',
      type: 'Full-time',
      contractType: 'Permanent',
      salary: '€80,000 - €120,000',
      description: 'Join our ML platform team to build scalable machine learning infrastructure that powers music recommendations for 500M+ users worldwide.',
      requirements: [
        'Masters in CS/ML or equivalent',
        '3+ years ML experience',
        'Python, TensorFlow, Kubernetes'
      ],
      benefits: [
        'Equity package',
        'Health insurance',
        'Spotify Premium',
        'Learning budget €4000/year'
      ],
      matchScore: 89,
      applicationDeadline: '2024-02-20',
      posted: '1 week ago',
      applicants: 234,
      isExternal: true,
      externalUrl: 'https://www.lifeatspotify.com/jobs',
      companyLogo: null,
      tags: ['Machine Learning', 'Music', 'Scale'],
      status: 'open'
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
      requirements: [
        '5+ years frontend experience',
        'React, TypeScript expert',
        'Financial services experience preferred'
      ],
      benefits: [
        'Share options',
        'Private health insurance',
        'Flexible working',
        'Learning stipend £2000/year'
      ],
      matchScore: 91,
      applicationDeadline: '2024-02-25',
      posted: '2 days ago',
      applicants: 156,
      isExternal: true,
      externalUrl: 'https://www.revolut.com/careers',
      companyLogo: null,
      tags: ['React', 'FinTech', 'TypeScript'],
      status: 'open'
    }
  ]

  const appliedJobs = [
    {
      id: 4,
      title: 'Full Stack Developer',
      company: 'Shopify',
      location: 'Toronto, Canada',
      appliedDate: '2024-01-20',
      status: 'interview_scheduled',
      interviewDate: '2024-02-01',
      matchScore: 87,
      cvUsed: 'InTransparency AI-Generated CV',
      applicationMethod: 'Direct Integration'
    },
    {
      id: 5,
      title: 'Data Scientist',
      company: 'Netflix',
      location: 'Los Gatos, CA',
      appliedDate: '2024-01-18',
      status: 'under_review',
      matchScore: 92,
      cvUsed: 'InTransparency AI-Generated CV',
      applicationMethod: 'External Portal'
    },
    {
      id: 6,
      title: 'Product Manager',
      company: 'Airbnb',
      location: 'San Francisco, CA',
      appliedDate: '2024-01-15',
      status: 'rejected',
      matchScore: 78,
      cvUsed: 'InTransparency AI-Generated CV',
      applicationMethod: 'Direct Integration',
      feedback: 'Great technical skills, but looking for more product experience'
    }
  ]

  const savedJobs = externalJobs.slice(1, 3)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'interview_scheduled': return <Calendar className="h-4 w-4 text-blue-600" />
      case 'under_review': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'accepted': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'interview_scheduled': return 'bg-blue-100 text-blue-800'
      case 'under_review': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-orange-600'
    return 'text-red-600'
  }

  const handleQuickApply = (job: any) => {
    console.log('Applying with InTransparency profile for:', job.title)
    // Integration logic would go here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
        <p className="text-gray-600 mt-2">
          Apply to external jobs using your InTransparency profile and track your applications
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Available Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{externalJobs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Send className="h-4 w-4 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Applied</p>
                <p className="text-2xl font-bold text-gray-900">{appliedJobs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appliedJobs.filter(j => j.status === 'under_review' || j.status === 'interview_scheduled').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Avg Match</p>
                <p className="text-2xl font-bold text-gray-900">89%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Auto-Apply Settings */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Auto-Apply with InTransparency Profile</p>
                <p className="text-sm text-gray-600">Automatically apply to jobs that match your criteria using your AI-generated profile</p>
              </div>
            </div>
            <Switch
              checked={autoApplyEnabled}
              onCheckedChange={setAutoApplyEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('available')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'available'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Globe className="h-4 w-4 mr-2 inline" />
          Available Jobs ({externalJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('applied')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'applied'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Send className="h-4 w-4 mr-2 inline" />
          Applied ({appliedJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'saved'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Heart className="h-4 w-4 mr-2 inline" />
          Saved ({savedJobs.length})
        </button>
      </div>

      {activeTab === 'available' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                External Job Opportunities
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
              {externalJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow border-l-4 border-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold">
                            {job.company.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Building className="h-4 w-4" />
                              <span>{job.company}</span>
                            </div>
                          </div>
                          <div className={`ml-auto font-bold text-lg ${getMatchScoreColor(job.matchScore)}`}>
                            {job.matchScore}% Match
                          </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {job.type} • {job.contractType}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {job.applicants} applicants
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Deadline: {job.applicationDeadline}
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4">{job.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Key Requirements</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {job.requirements.slice(0, 2).map((req, index) => (
                                <li key={index} className="flex items-start">
                                  <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Benefits</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {job.benefits.slice(0, 2).map((benefit, index) => (
                                <li key={index} className="flex items-start">
                                  <CheckCircle className="h-3 w-3 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Posted {job.posted}</span>
                        <span>•</span>
                        <span>{job.salary}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickApply(job)}
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          Quick Apply with InTransparency
                        </Button>
                        <Button size="sm" asChild>
                          <a href={job.externalUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Details
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
          </CardContent>
        </Card>
      )}

      {activeTab === 'applied' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="h-5 w-5 mr-2" />
              Your Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appliedJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                            {job.company.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{job.title}</h3>
                            <p className="text-gray-600 text-sm">{job.company} • {job.location}</p>
                          </div>
                          <div className="ml-auto">
                            <Badge className={getStatusColor(job.status)}>
                              {getStatusIcon(job.status)}
                              <span className="ml-1 capitalize">{job.status.replace('_', ' ')}</span>
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          <div>
                            <p className="font-medium">Applied</p>
                            <p>{job.appliedDate}</p>
                          </div>
                          <div>
                            <p className="font-medium">Match Score</p>
                            <p className={`font-semibold ${getMatchScoreColor(job.matchScore)}`}>{job.matchScore}%</p>
                          </div>
                          <div>
                            <p className="font-medium">CV Used</p>
                            <p>{job.cvUsed}</p>
                          </div>
                          <div>
                            <p className="font-medium">Method</p>
                            <p>{job.applicationMethod}</p>
                          </div>
                        </div>

                        {job.interviewDate && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                              <span className="text-sm font-medium text-blue-900">
                                Interview scheduled for {job.interviewDate}
                              </span>
                            </div>
                          </div>
                        )}

                        {job.feedback && (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                            <p className="text-sm text-gray-700">
                              <strong>Feedback:</strong> {job.feedback}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        Applied via InTransparency integration
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View Application
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-3 w-3 mr-1" />
                          Download CV
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'saved' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Saved Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {savedJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                          {job.company.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{job.title}</h3>
                          <p className="text-gray-600 text-sm">{job.company} • {job.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-semibold ${getMatchScoreColor(job.matchScore)}`}>
                          {job.matchScore}% Match
                        </span>
                        <Button variant="outline" size="sm">
                          <Upload className="h-3 w-3 mr-1" />
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}