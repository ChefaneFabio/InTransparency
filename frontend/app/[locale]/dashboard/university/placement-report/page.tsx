'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Link } from '@/navigation'
import {
  GraduationCap,
  FolderOpen,
  ShieldCheck,
  Brain,
  Eye,
  Users,
  TrendingUp,
  Star,
  Building2,
  Printer,
  ArrowLeft,
  AlertTriangle,
  Percent
} from 'lucide-react'

interface HiringCompany {
  name: string
  contacts: number
  hires: number
}

interface SkillCount {
  name: string
  count: number
}

interface ProgramBreakdown {
  degree: string
  students: number
  contacted: number
  hired: number
  contactRate: number
  placementRate: number
}

interface PlacementData {
  universityName: string
  generatedAt: string
  overview: {
    totalStudents: number
    totalProjects: number
    verifiedPercent: number
    aiAnalyzed: number
  }
  engagement: {
    profileViews: number
    uniqueRecruiters: number
    contactRate: number
    placementRate: number
  }
  quality: {
    avgInnovation: number
    avgComplexity: number
  }
  topHiringCompanies: HiringCompany[]
  topSkills: SkillCount[]
  programBreakdown: ProgramBreakdown[]
}

export default function PlacementReportPage() {
  const t = useTranslations('placementReport')
  const [data, setData] = useState<PlacementData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard/university/placement-report')
        if (!response.ok) {
          throw new Error('Failed to fetch placement report data')
        }
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        <div className="flex items-center gap-3 pt-2">
          <Skeleton className="h-8 w-8 rounded" />
          <div>
            <Skeleton className="h-8 w-72 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-7 w-24 rounded-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto pt-12">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-3" />
            <h3 className="font-medium text-red-800 mb-1">{t('errorTitle')}</h3>
            <p className="text-sm text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="print:hidden">
            <Link href="/dashboard/university">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {data.universityName} — {t('title')}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {t('generatedAt')}: {formatDate(data.generatedAt)}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="print:hidden shrink-0"
          onClick={() => window.print()}
        >
          <Printer className="h-4 w-4 mr-2" />
          {t('printReport')}
        </Button>
      </div>

      {/* Overview Stats */}
      <div>
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">{t('overview')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{data.overview.totalStudents}</p>
                  <p className="text-sm text-gray-600">{t('totalStudents')}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{data.overview.totalProjects}</p>
                  <p className="text-sm text-gray-600">{t('totalProjects')}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FolderOpen className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{data.overview.verifiedPercent}%</p>
                  <p className="text-sm text-gray-600">{t('verified')}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{data.overview.aiAnalyzed}</p>
                  <p className="text-sm text-gray-600">{t('aiAnalyzed')}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Engagement Stats */}
      <div>
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">{t('engagementStats')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{data.engagement.profileViews}</p>
                  <p className="text-sm text-gray-600">{t('profileViews')}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{data.engagement.uniqueRecruiters}</p>
                  <p className="text-sm text-gray-600">{t('uniqueRecruiters')}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{data.engagement.contactRate}%</p>
                  <p className="text-sm text-gray-600">{t('contactRate')}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-600">{data.engagement.placementRate}%</p>
                  <p className="text-sm text-gray-600">{t('placementRate')}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Percent className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quality Scores */}
      <div>
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">{t('qualityScores')}</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{data.quality.avgInnovation.toFixed(1)}</p>
                  <p className="text-sm text-gray-600">{t('avgInnovation')}</p>
                </div>
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Star className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{data.quality.avgComplexity.toFixed(1)}</p>
                  <p className="text-sm text-gray-600">{t('avgComplexity')}</p>
                </div>
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <Brain className="h-5 w-5 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top Hiring Companies */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              {t('topHiringCompanies')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.topHiringCompanies.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-2 font-medium text-gray-500">{t('company')}</th>
                      <th className="pb-2 font-medium text-gray-500 text-right">{t('contacts')}</th>
                      <th className="pb-2 font-medium text-gray-500 text-right">{t('hires')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topHiringCompanies.map((company, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="py-2.5 font-medium text-gray-900">{company.name}</td>
                        <td className="py-2.5 text-right text-gray-600">{company.contacts}</td>
                        <td className="py-2.5 text-right">
                          <Badge variant="secondary" className="text-xs">
                            {company.hires}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-6">{t('noHiringData')}</p>
            )}
          </CardContent>
        </Card>

        {/* Top Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              {t('topSkills')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.topSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.topSkills.map((skill, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-sm px-3 py-1"
                  >
                    {skill.name}
                    <span className="ml-1.5 text-xs text-gray-500">({skill.count})</span>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-6">{t('noSkillsData')}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Program Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            {t('programBreakdown')}
          </CardTitle>
          <CardDescription>{t('programBreakdownDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          {data.programBreakdown.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium text-gray-500">{t('degree')}</th>
                    <th className="pb-2 font-medium text-gray-500 text-right">{t('students')}</th>
                    <th className="pb-2 font-medium text-gray-500 text-right">{t('contacted')}</th>
                    <th className="pb-2 font-medium text-gray-500 text-right">{t('hired')}</th>
                    <th className="pb-2 font-medium text-gray-500 text-right">{t('contactRateShort')}</th>
                    <th className="pb-2 font-medium text-gray-500 text-right">{t('placementRateShort')}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.programBreakdown.map((program, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="py-2.5 font-medium text-gray-900">{program.degree}</td>
                      <td className="py-2.5 text-right text-gray-600">{program.students}</td>
                      <td className="py-2.5 text-right text-gray-600">{program.contacted}</td>
                      <td className="py-2.5 text-right text-gray-600">{program.hired}</td>
                      <td className="py-2.5 text-right">
                        <span className={program.contactRate >= 50 ? 'text-green-600 font-medium' : 'text-gray-600'}>
                          {program.contactRate}%
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <span className={program.placementRate >= 30 ? 'text-green-600 font-medium' : 'text-gray-600'}>
                          {program.placementRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-6">{t('noProgramData')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
