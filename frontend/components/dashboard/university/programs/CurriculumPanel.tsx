'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Users,
  Target,
  Lightbulb,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { useTranslations } from 'next-intl'

interface TopSkill {
  name: string
  studentCount: number
}

interface CourseAlignment {
  courseName: string
  courseCode: string | null
  studentCount: number
  primaryDiscipline: string
  alignmentScore: number
  topSkills: TopSkill[]
  alignedSkills: string[]
  missingSkills: string[]
  suggestions: string[]
}

interface DemandedSkill {
  name: string
  demand: number
  covered: boolean
  studentCount: number
}

interface CurriculumData {
  overview: {
    totalCourses: number
    avgAlignment: number
    coursesNeedingAttention: number
    totalStudents: number
  }
  courses: CourseAlignment[]
  topDemandedSkills: DemandedSkill[]
}

function getAlignmentColor(score: number): string {
  if (score >= 70) return 'text-green-600'
  if (score >= 50) return 'text-yellow-600'
  return 'text-red-600'
}

function getAlignmentBg(score: number): string {
  if (score >= 70) return 'bg-green-500'
  if (score >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}

function getAlignmentBadge(score: number): 'default' | 'secondary' | 'destructive' {
  if (score >= 70) return 'secondary'
  if (score >= 50) return 'default'
  return 'destructive'
}

export default function CurriculumPanel({ embedded = false }: { embedded?: boolean } = {}) {
  const t = useTranslations('curriculumAlignment')
  const [data, setData] = useState<CurriculumData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard/university/curriculum-alignment')
        if (!res.ok) throw new Error(t('errorTitle'))
        setData(await res.json())
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [t])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <BookOpen className="h-10 w-10 mx-auto text-blue-300 animate-pulse mb-4" />
          <p className="text-muted-foreground">Analyzing curriculum data...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
        <p className="text-muted-foreground">{error || t('errorTitle')}</p>
      </div>
    )
  }

  const { overview, courses, topDemandedSkills } = data

  return (
    <div className="space-y-6">
      {!embedded && (
        <MetricHero gradient="blue">
          <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
        </MetricHero>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard delay={0.1}>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{overview.totalCourses}</p>
                <p className="text-sm text-muted-foreground">{t('totalCourses')}</p>
              </div>
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
          </div>
        </GlassCard>
        <GlassCard delay={0.15}>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-2xl font-bold ${getAlignmentColor(overview.avgAlignment)}`}>
                  {overview.avgAlignment}%
                </p>
                <p className="text-sm text-muted-foreground">{t('avgAlignment')}</p>
              </div>
              <Target className="h-5 w-5 text-primary" />
            </div>
          </div>
        </GlassCard>
        <GlassCard delay={0.2}>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {overview.coursesNeedingAttention}
                </p>
                <p className="text-sm text-muted-foreground">{t('needsAttention')}</p>
              </div>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
          </div>
        </GlassCard>
        <GlassCard delay={0.25}>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{overview.totalStudents}</p>
                <p className="text-sm text-muted-foreground">{t('totalStudents')}</p>
              </div>
              <Users className="h-5 w-5 text-primary" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Top Demanded Skills */}
      <GlassCard delay={0.15}>
        <div className="p-5">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-1">
            <TrendingUp className="h-5 w-5 text-primary" />
            {t('topDemandedSkills')}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('topDemandedSkillsDescription')}
          </p>
          {topDemandedSkills.length > 0 ? (
            <div className="space-y-3">
              {topDemandedSkills.map((skill) => (
                <div key={skill.name} className="flex items-center gap-3">
                  <div className="w-36 text-sm font-medium truncate capitalize">{skill.name}</div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-blue-500/70 rounded-full"
                        style={{ width: `${Math.min((skill.demand / (topDemandedSkills[0]?.demand || 1)) * 100, 100)}%` }}
                      />
                      {skill.covered && (
                        <div
                          className="absolute top-0 left-0 h-full bg-green-500/50 rounded-full"
                          style={{ width: `${Math.min((skill.studentCount / (topDemandedSkills[0]?.demand || 1)) * 50, 100)}%` }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    {skill.covered ? (
                      <Badge variant="secondary" className="text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {skill.studentCount}
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        Gap
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500/70 rounded" />
                  {t('demand')}
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500/50 rounded" />
                  {t('supply')}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm py-8 text-center">
              No market demand data available yet.
            </p>
          )}
        </div>
      </GlassCard>

      {/* Course Cards */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          {t('coursesList')}
        </h3>
        {courses.length > 0 ? (
          <div className="space-y-4">
            {courses.map((course, i) => (
              <GlassCard key={course.courseName} delay={0.1 + i * 0.05}>
                <div className="p-5">
                  {/* Course Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-base">{course.courseName}</h4>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        {course.courseCode && <span>{course.courseCode}</span>}
                        <span>{course.studentCount} {t('students')}</span>
                        <Badge variant="outline" className="text-xs">
                          {course.primaryDiscipline}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getAlignmentColor(course.alignmentScore)}`}>
                        {course.alignmentScore}%
                      </p>
                      <Badge variant={getAlignmentBadge(course.alignmentScore)}>
                        alignment
                      </Badge>
                    </div>
                  </div>

                  {/* Alignment Progress Bar */}
                  <Progress value={course.alignmentScore} className={`h-2 mb-4`} />

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Top Skills Taught */}
                    <div>
                      <p className="text-sm font-medium mb-2 text-muted-foreground">{t('skillsTaught')}</p>
                      <div className="flex flex-wrap gap-1">
                        {course.topSkills.slice(0, 6).map((skill) => (
                          <Badge key={skill.name} variant="outline" className="text-xs capitalize">
                            {skill.name} ({skill.studentCount})
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Aligned with Market */}
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        {t('alignedSkills')}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {course.alignedSkills.length > 0 ? (
                          course.alignedSkills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs capitalize text-green-700 bg-green-50 border-green-200">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">None found</span>
                        )}
                      </div>
                    </div>

                    {/* Missing from Curriculum */}
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-red-500" />
                        {t('missingSkills')}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {course.missingSkills.length > 0 ? (
                          course.missingSkills.map((skill) => (
                            <Badge key={skill} variant="destructive" className="text-xs capitalize">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">All covered</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Suggestions */}
                  {course.suggestions.length > 0 && (
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        {t('suggestions')}
                      </p>
                      <ul className="space-y-1">
                        {course.suggestions.map((suggestion, j) => (
                          <li key={j} className="text-sm text-muted-foreground">
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <GlassCard>
            <div className="p-8 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
              <h4 className="font-semibold mb-1">{t('noCourses')}</h4>
              <p className="text-sm text-muted-foreground">{t('noCoursesDescription')}</p>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  )
}
