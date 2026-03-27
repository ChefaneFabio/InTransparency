'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from '@/navigation'
import {
  BookOpen,
  AlertTriangle,
  Users,
  Target,
  TrendingUp,
  Lightbulb,
  CheckCircle2,
  XCircle,
  ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CourseSkill {
  name: string
  type: 'taught' | 'aligned' | 'missing'
}

interface Course {
  id: string
  name: string
  code: string
  studentCount: number
  discipline: string
  alignmentScore: number
  skillsTaught: string[]
  alignedSkills: string[]
  missingSkills: string[]
  suggestions: string[]
}

interface DemandedSkill {
  name: string
  demand: number
  supply: number
}

interface CurriculumData {
  overview: {
    totalCourses: number
    avgAlignment: number
    coursesNeedingAttention: number
    totalStudents: number
  }
  courses: Course[]
  topDemandedSkills: DemandedSkill[]
}

const getAlignmentColor = (score: number): string => {
  if (score < 40) return 'bg-red-500'
  if (score < 70) return 'bg-amber-500'
  return 'bg-green-500'
}

const getAlignmentTextColor = (score: number): string => {
  if (score < 40) return 'text-red-600'
  if (score < 70) return 'text-amber-600'
  return 'text-green-600'
}

export default function CurriculumAlignmentPage() {
  const t = useTranslations('curriculumAlignment')
  const [data, setData] = useState<CurriculumData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard/university/curriculum-alignment')
        if (!response.ok) {
          throw new Error('Failed to fetch curriculum alignment data')
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
          <Skeleton className="h-8 w-64" />
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
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-6 w-48 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-full mb-4" />
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-6 w-20 rounded-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
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

  const sortedCourses = Array.from(data.courses).sort((a, b) => a.alignmentScore - b.alignmentScore)

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3 pt-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/university">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-1">{t('subtitle')}</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{data.overview.totalCourses}</p>
                <p className="text-sm text-gray-600">{t('totalCourses')}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-2xl font-bold ${getAlignmentTextColor(data.overview.avgAlignment)}`}>
                  {data.overview.avgAlignment}%
                </p>
                <p className="text-sm text-gray-600">{t('avgAlignment')}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-amber-600">{data.overview.coursesNeedingAttention}</p>
                <p className="text-sm text-gray-600">{t('needsAttention')}</p>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{data.overview.totalStudents}</p>
                <p className="text-sm text-gray-600">{t('totalStudents')}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">{t('coursesList')}</h2>
        {sortedCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900">{course.name}</h3>
                    <Badge variant="secondary" className="text-xs">{course.code}</Badge>
                    <Badge variant="outline" className="text-xs">{course.discipline}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {course.studentCount} {t('students')}
                  </p>
                </div>
                <div className="flex items-center gap-3 min-w-[180px]">
                  <div className="flex-1">
                    <Progress
                      value={course.alignmentScore}
                      className={`h-2 [&>div]:${getAlignmentColor(course.alignmentScore)}`}
                    />
                  </div>
                  <span className={`text-sm font-bold ${getAlignmentTextColor(course.alignmentScore)}`}>
                    {course.alignmentScore}%
                  </span>
                </div>
              </div>

              {/* Skills taught */}
              {course.skillsTaught.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1.5">{t('skillsTaught')}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {course.skillsTaught.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Aligned vs Missing Skills */}
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                {course.alignedSkills.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1.5 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      {t('alignedSkills')}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {course.alignedSkills.map((skill, idx) => (
                        <Badge key={idx} className="text-xs bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {course.missingSkills.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1.5 flex items-center gap-1">
                      <XCircle className="h-3 w-3 text-red-500" />
                      {t('missingSkills')}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {course.missingSkills.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-red-300 text-red-700">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* AI Suggestions */}
              {course.suggestions.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-xs font-medium text-blue-700 uppercase mb-1.5 flex items-center gap-1">
                    <Lightbulb className="h-3 w-3" />
                    {t('suggestions')}
                  </p>
                  <ul className="space-y-1">
                    {course.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                        <span className="text-blue-400 mt-1">&#8226;</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {sortedCourses.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-1">{t('noCourses')}</h3>
              <p className="text-sm text-gray-600">{t('noCoursesDescription')}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Top Demanded Skills */}
      {data.topDemandedSkills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {t('topDemandedSkills')}
            </CardTitle>
            <CardDescription>{t('topDemandedSkillsDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topDemandedSkills.map((skill, idx) => {
                const gapPercent = skill.demand > 0 ? Math.round((skill.supply / skill.demand) * 100) : 0
                return (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-medium text-gray-900 truncate">{skill.name}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 bg-gray-100 rounded-full h-2 relative overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 bg-blue-400 rounded-full"
                            style={{ width: `${Math.min(100, gapPercent)}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium min-w-[3rem] text-right ${getAlignmentTextColor(gapPercent)}`}>
                          {gapPercent}%
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{t('demand')}: {skill.demand}</span>
                        <span>{t('supply')}: {skill.supply}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
