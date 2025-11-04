'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'
import { universitiesApi } from '@/lib/api'
import { Loader2 } from 'lucide-react'
import {
  GraduationCap,
  MapPin,
  Users,
  Star,
  TrendingUp,
  Award,
  Globe,
  Phone,
  Mail,
  Calendar,
  BookOpen,
  Building,
  Target,
  BarChart3,
  Eye,
  MessageSquare,
  ExternalLink,
  Heart,
  Share2,
  Download
} from 'lucide-react'
import { useTranslations } from 'next-intl'

interface University {
  id: string
  name: string
  shortName: string
  slug: string
  logo?: string
  ranking: {
    global: number
    national: number
    engineering: number
  }
  location: {
    city: string
    state: string
    country: string
    coordinates: { lat: number; lng: number }
  }
  stats: {
    students: number
    undergrad: number
    graduate: number
    faculty: number
    internationalStudents: number
    acceptanceRate: number
  }
  programs: Array<{
    name: string
    ranking: number
    students: number
  }>
  topSkills: string[]
  companies: string[]
  avgSalary: string
  employmentRate: number
  description: string
  founded: number
  website: string
  contact: {
    phone: string
    email: string
    address: string
  }
  socialMedia: {
    twitter: string
    linkedin: string
    facebook: string
  }
}

interface UniversityPageProps {
  params: {
    slug: string
  }
}

export default function UniversityPage({ params }: UniversityPageProps) {
  const [university, setUniversity] = useState<University | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const t = useTranslations('universityProfile')

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await universitiesApi.getBySlug(params.slug)
        setUniversity(response.data)
      } catch (err: any) {
        if (err.response?.status === 404) {
          notFound()
        } else {
          setError('Failed to load university data')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUniversity()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-lg">{t('loading')}</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('error.title')}</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>{t('error.tryAgain')}</Button>
        </div>
      </div>
    )
  }

  if (!university) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                {university.shortName.charAt(0)}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{university.name}</h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {university.location.city}, {university.location.state}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {t('header.founded', { year: university.founded })}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    {t('header.globalRanking', { rank: university.ranking.global })}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Heart className="h-4 w-4 mr-2" />
                {t('header.actions.save')}
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                {t('header.actions.share')}
              </Button>
              <Button>
                <MessageSquare className="h-4 w-4 mr-2" />
                {t('header.actions.contact')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle>{t('overview.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6">{university.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{university.stats.students.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{t('overview.stats.totalStudents')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{university.stats.faculty.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{t('overview.stats.faculty')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{university.stats.acceptanceRate}%</div>
                    <div className="text-sm text-gray-600">{t('overview.stats.acceptanceRate')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{university.employmentRate}%</div>
                    <div className="text-sm text-gray-600">{t('overview.stats.employmentRate')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rankings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  {t('rankings.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">#{university.ranking.global}</div>
                    <div className="text-sm text-gray-600">{t('rankings.global')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">#{university.ranking.national}</div>
                    <div className="text-sm text-gray-600">{t('rankings.national')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">#{university.ranking.engineering}</div>
                    <div className="text-sm text-gray-600">{t('rankings.engineering')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Programs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  {t('programs.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {university.programs.map((program: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-gray-900">{program.name}</h3>
                        <p className="text-sm text-gray-600">{t('programs.students', { count: program.students })}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-yellow-600 mb-1">
                          <Star className="h-4 w-4 mr-1" />
                          <span className="font-semibold">#{program.ranking}</span>
                        </div>
                        <p className="text-xs text-gray-700">{t('programs.nationalRanking')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Student Outcomes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  {t('outcomes.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">{t('outcomes.careerStats')}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('outcomes.employmentRate')}</span>
                        <span className="font-semibold">{university.employmentRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('outcomes.avgSalary')}</span>
                        <span className="font-semibold">{university.avgSalary}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">{t('outcomes.topEmployers')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {university.companies.slice(0, 4).map((company: string, index: number) => (
                        <Badge key={index} variant="outline">{company}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('quickActions.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  {t('quickActions.browseStudents')}
                </Button>
                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  {t('quickActions.viewPrograms')}
                </Button>
                <Button variant="outline" className="w-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {t('quickActions.seeAnalytics')}
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href={university.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t('quickActions.visitWebsite')}
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t('contact.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-gray-600 mr-2 mt-1" />
                  <div>
                    <p className="text-sm text-gray-900">{university.contact.address}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-600 mr-2" />
                  <p className="text-sm text-gray-900">{university.contact.phone}</p>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-600 mr-2" />
                  <p className="text-sm text-gray-900">{university.contact.email}</p>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 text-gray-600 mr-2" />
                  <a href={university.website} className="text-sm text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                    {t('quickActions.officialWebsite')}
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Top Skills */}
            <Card>
              <CardHeader>
                <CardTitle>{t('topSkills.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {university.topSkills.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>{t('socialMedia.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <a href={`https://twitter.com/${university.socialMedia.twitter}`} className="flex items-center text-blue-500 hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                    <span className="mr-2">🐦</span>
                    {university.socialMedia.twitter}
                  </a>
                  <a href={`https://linkedin.com/company/${university.socialMedia.linkedin}`} className="flex items-center text-blue-700 hover:text-blue-900" target="_blank" rel="noopener noreferrer">
                    <span className="mr-2">💼</span>
                    {t('socialMedia.linkedin')}
                  </a>
                  <a href={`https://facebook.com/${university.socialMedia.facebook}`} className="flex items-center text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                    <span className="mr-2">👥</span>
                    {t('socialMedia.facebook')}
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
