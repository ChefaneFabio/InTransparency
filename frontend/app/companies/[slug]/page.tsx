'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { companiesApi } from '@/lib/api'
import { Loader2 } from 'lucide-react'
import {
  Building,
  MapPin,
  Users,
  Star,
  TrendingUp,
  Award,
  Globe,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Target,
  BarChart3,
  Eye,
  MessageSquare,
  ExternalLink,
  Heart,
  Share2,
  Briefcase,
  BookOpen,
  Shield,
  Zap
} from 'lucide-react'

interface Company {
  id: string
  name: string
  slug: string
  logo?: string
  tagline: string
  description: string
  industry: string
  founded: number
  size: string
  headquarters: string
  locations: string[]
  website: string
  socialMedia: {
    linkedin: string
    twitter: string
    instagram?: string
  }
  contact: {
    email: string
    phone?: string
  }
  stats: {
    employees: number
    openJobs: number
    rating: number
    reviews: number
    [key: string]: number
  }
  values: Array<{
    name: string
    description: string
  }>
  benefits: string[]
  techStack: string[]
  jobsCount: number
  averageSalary: string
  workCulture: {
    remote: boolean
    diversity: number
    workLifeBalance: number
    careerGrowth: number
  }
  recentNews: Array<{
    title: string
    date: string
  }>
}

interface CompanyPageProps {
  params: {
    slug: string
  }
}

export default function CompanyPage({ params }: CompanyPageProps) {
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await companiesApi.getBySlug(params.slug)
        setCompany(response.data)
      } catch (err: any) {
        if (err.response?.status === 404) {
          notFound()
        } else {
          setError('Failed to load company data')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCompany()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-lg">Loading company...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Company</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!company) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                {company.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{company.name}</h1>
                <p className="text-xl text-gray-600 mb-4">{company.tagline}</p>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {company.headquarters}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Founded {company.founded}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {company.size}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    {company.stats.rating} ({company.stats.reviews} reviews)
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Heart className="h-4 w-4 mr-2" />
                Follow
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button>
                <Briefcase className="h-4 w-4 mr-2" />
                View Jobs ({company.jobsCount})
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Company Overview */}
            <Card>
              <CardHeader>
                <CardTitle>About {company.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6">{company.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{company.stats.employees?.toLocaleString() || company.size}</div>
                    <div className="text-sm text-gray-600">Employees</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{company.jobsCount}</div>
                    <div className="text-sm text-gray-600">Open Positions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{company.stats.rating}</div>
                    <div className="text-sm text-gray-600">Company Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{company.locations?.length || 0}</div>
                    <div className="text-sm text-gray-600">Global Offices</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Values */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Our Values
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(company.values || []).map((value: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">{value.name}</h3>
                      <p className="text-gray-600 text-sm">{value.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Benefits & Perks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Benefits & Perks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(company.benefits || []).map((benefit: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <Shield className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tech Stack */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Technology Stack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(company.techStack || []).map((tech: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-sm py-1 px-3">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Work Culture */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Work Culture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Remote Work</span>
                    <Badge className={company.workCulture.remote ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {company.workCulture.remote ? 'Available' : 'Office-based'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Diversity Score</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${company.workCulture.diversity}%` }}
                        />
                      </div>
                      <span className="font-semibold">{company.workCulture.diversity}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Work-Life Balance</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-semibold">{company.workCulture.workLifeBalance}/5</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Career Growth</span>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="font-semibold">{company.workCulture.careerGrowth}/5</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent News */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Recent News
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(company.recentNews || []).map((news: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{news.title}</h3>
                        <p className="text-sm text-gray-600">{new Date(news.date).toLocaleDateString()}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Read
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  <Briefcase className="h-4 w-4 mr-2" />
                  View All Jobs ({company.jobsCount})
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Recruiter
                </Button>
                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Company Insights
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href={company.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Website
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Company Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Company Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Industry</span>
                  <span className="font-semibold">{company.industry}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Salary</span>
                  <span className="font-semibold">{company.averageSalary}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Global Offices</span>
                  <span className="font-semibold">{company.locations?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Company Size</span>
                  <span className="font-semibold">{company.size}</span>
                </div>
              </CardContent>
            </Card>

            {/* Global Locations */}
            <Card>
              <CardHeader>
                <CardTitle>Global Presence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {company.locations?.map((location: string, index: number) => (
                    <Badge key={index} variant="secondary">{location}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-600 mr-2" />
                  <p className="text-sm text-gray-900">{company.contact.email}</p>
                </div>
                {company.contact.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-600 mr-2" />
                    <p className="text-sm text-gray-900">{company.contact.phone}</p>
                  </div>
                )}
                <div className="flex items-center">
                  <Globe className="h-4 w-4 text-gray-600 mr-2" />
                  <a href={company.website} className="text-sm text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                    {company.website}
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <a href={`https://linkedin.com/company/${company.socialMedia.linkedin}`} className="flex items-center text-blue-700 hover:text-blue-900" target="_blank" rel="noopener noreferrer">
                    <span className="mr-2">💼</span>
                    LinkedIn
                  </a>
                  <a href={`https://twitter.com/${company.socialMedia.twitter}`} className="flex items-center text-blue-500 hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                    <span className="mr-2">🐦</span>
                    {company.socialMedia.twitter}
                  </a>
                  {company.socialMedia.instagram && (
                    <a href={`https://instagram.com/${company.socialMedia.instagram}`} className="flex items-center text-pink-600 hover:text-pink-800" target="_blank" rel="noopener noreferrer">
                      <span className="mr-2">📷</span>
                      {company.socialMedia.instagram}
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}