'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { jobsApi } from '@/lib/api'
import { Loader2 } from 'lucide-react'
import {
  Building,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Star,
  Bookmark,
  Share2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Award,
  Target,
  Send,
  Eye,
  Heart,
  MessageSquare,
  FileText,
  Globe
} from 'lucide-react'

interface Job {
  id: string
  title: string
  company: {
    name: string
    logo?: string
    size: string
    industry: string
    website: string
    location: string
  }
  location: string
  type: string
  contractType: string
  salary: {
    min: number
    max: number
    currency: string
    period: string
  }
  posted: string
  deadline: string
  applicants: number
  views: number
  description: string
  fullDescription: string
  requirements: string[]
  niceToHave: string[]
  benefits: string[]
  skills: string[]
  level: string
  remote: boolean
  visa: boolean
  matchScore: number
  applicationUrl: string
  isExternal: boolean
  applicationRequirements: {
    cvRequired: boolean
    portfolioRequired: boolean
    coverLetterRequired: boolean
    customFields: Array<{
      field: string
      label: string
      required: boolean
      type: string
    }>
  }
}

interface JobPageProps {
  params: {
    id: string
  }
}

export default function JobPage({ params }: JobPageProps) {
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await jobsApi.getById(params.id)
        setJob(response.data)
      } catch (err: any) {
        if (err.response?.status === 404) {
          notFound()
        } else {
          setError('Failed to load job data')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-lg">Loading job...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Job</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!job) {
    notFound()
  }

  const formatSalary = (salary: any) => {
    if (salary.min && salary.max) {
      return `${salary.currency} ${salary.min.toLocaleString()}-${salary.max.toLocaleString()}/${salary.period}`
    }
    return 'Competitive'
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                {job.company.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <div className="flex items-center space-x-4 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-1" />
                    {job.company.name}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {job.type}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">{job.level}</Badge>
                  <Badge variant="secondary">{job.contractType}</Badge>
                  {job.remote && <Badge className="bg-green-100 text-green-800">Remote OK</Badge>}
                  {job.visa && <Badge className="bg-blue-100 text-blue-800">Visa Sponsored</Badge>}
                  <div className={`px-2 py-1 rounded-full text-sm font-semibold ${getMatchScoreColor(job.matchScore)}`}>
                    {job.matchScore}% Match
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="lg">
                <Send className="h-4 w-4 mr-2" />
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6">{job.description}</p>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-line text-gray-700">
                    {job.fullDescription}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Required Qualifications</h3>
                    <ul className="space-y-2">
                      {job.requirements.map((req: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {job.niceToHave.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Nice to Have</h3>
                      <ul className="space-y-2">
                        {job.niceToHave.map((nice: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <Star className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{nice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Benefits & Perks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.benefits.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <Award className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Application Requirements */}
            {job.isExternal && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
                    Application Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <CheckCircle className={`h-4 w-4 mr-2 ${job.applicationRequirements.cvRequired ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className={job.applicationRequirements.cvRequired ? 'text-green-700' : 'text-gray-600'}>
                          CV {job.applicationRequirements.cvRequired ? 'Required' : 'Optional'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className={`h-4 w-4 mr-2 ${job.applicationRequirements.portfolioRequired ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className={job.applicationRequirements.portfolioRequired ? 'text-green-700' : 'text-gray-600'}>
                          Portfolio {job.applicationRequirements.portfolioRequired ? 'Required' : 'Optional'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className={`h-4 w-4 mr-2 ${job.applicationRequirements.coverLetterRequired ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className={job.applicationRequirements.coverLetterRequired ? 'text-green-700' : 'text-gray-600'}>
                          Cover Letter {job.applicationRequirements.coverLetterRequired ? 'Required' : 'Optional'}
                        </span>
                      </div>
                    </div>

                    {job.applicationRequirements.customFields.length > 0 && (
                      <div>
                        <p className="font-medium text-gray-900 mb-2">Additional Requirements:</p>
                        <ul className="space-y-1">
                          {job.applicationRequirements.customFields.map((field: any, index: number) => (
                            <li key={index} className="text-sm text-gray-700 flex items-center">
                              <Target className="h-3 w-3 mr-2 text-blue-500" />
                              {field.label} {field.required && <span className="text-red-500 ml-1">*</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Apply */}
            <Card>
              <CardHeader>
                <CardTitle>Apply for this Job</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg">
                  <Send className="h-4 w-4 mr-2" />
                  Apply with InTransparency
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Apply on Company Site
                  </a>
                </Button>
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Your AI-generated CV will be used
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Salary</span>
                  <span className="font-semibold">{formatSalary(job.salary)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Job Type</span>
                  <span className="font-semibold">{job.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Experience Level</span>
                  <span className="font-semibold">{job.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Remote Work</span>
                  <span className={`font-semibold ${job.remote ? 'text-green-600' : 'text-gray-500'}`}>
                    {job.remote ? 'Available' : 'Not Available'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Visa Sponsorship</span>
                  <span className={`font-semibold ${job.visa ? 'text-green-600' : 'text-gray-500'}`}>
                    {job.visa ? 'Available' : 'Not Available'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Posted</span>
                  <span className="font-semibold">{new Date(job.posted).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Deadline</span>
                  <span className="font-semibold text-red-600">{new Date(job.deadline).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>About {job.company.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Industry</span>
                  <span className="font-semibold">{job.company.industry}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Company Size</span>
                  <span className="font-semibold">{job.company.size}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-semibold">{job.company.location}</span>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <a href={job.company.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4 mr-2" />
                    Company Website
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Skills Required */}
            <Card>
              <CardHeader>
                <CardTitle>Skills Required</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Application Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Application Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Applicants</span>
                  </div>
                  <span className="font-semibold">{job.applicants}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Views</span>
                  </div>
                  <span className="font-semibold">{job.views.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}