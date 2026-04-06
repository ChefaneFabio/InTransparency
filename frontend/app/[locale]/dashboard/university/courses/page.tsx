'use client'

import { useState, useEffect, useCallback } from 'react'
import { Link } from '@/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BookOpen,
  Search,
  Plus,
  GraduationCap,
  Users,
  CheckCircle,
  Clock,
  Hash,
  Layers,
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { useTranslations } from 'next-intl'

interface Course {
  id: string
  courseName: string
  courseCode: string
  department: string | null
  semester: string
  academicYear: string
  professorName: string | null
  professorEmail: string | null
  description: string | null
  credits: number | null
  level: string | null
  competencies: string[]
  learningOutcomes: string[]
  projectCount: number
  verified: boolean
}

interface Filters {
  departments: string[]
  semesters: string[]
}

export default function UniversityCoursesPage() {
  const t = useTranslations('universityDashboard.courses')
  const [courses, setCourses] = useState<Course[]>([])
  const [filters, setFilters] = useState<Filters>({ departments: [], semesters: [] })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [semesterFilter, setSemesterFilter] = useState('all')

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (departmentFilter && departmentFilter !== 'all') params.set('department', departmentFilter)
      if (semesterFilter && semesterFilter !== 'all') params.set('semester', semesterFilter)

      const qs = params.toString()
      const url = `/api/dashboard/university/courses${qs ? `?${qs}` : ''}`
      const res = await fetch(url)

      if (!res.ok) {
        console.error('Failed to fetch courses:', res.status)
        setCourses([])
        setFilters({ departments: [], semesters: [] })
        return
      }

      const data = await res.json()
      setCourses(data.courses ?? [])
      setFilters(data.filters ?? { departments: [], semesters: [] })
    } catch (err) {
      console.error('Error fetching courses:', err)
      setCourses([])
      setFilters({ departments: [], semesters: [] })
    } finally {
      setLoading(false)
    }
  }, [searchQuery, departmentFilter, semesterFilter])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  // Computed stats
  const totalCourses = courses.length
  const verifiedCourses = courses.filter(c => c.verified).length
  const totalCredits = courses.reduce((sum, c) => sum + (c.credits ?? 0), 0)
  const departmentsSet = new Set<string>()
  courses.forEach(c => {
    if (c.department) departmentsSet.add(c.department)
  })
  const departmentsCount = departmentsSet.size

  return (
    <div className="min-h-screen space-y-6 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <MetricHero gradient="primary">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
              <p className="text-muted-foreground">{t('subtitle')}</p>
            </div>
            <Link href="/dashboard/university/courses/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {t('addCourse')}
              </Button>
            </Link>
          </div>
        </MetricHero>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <GlassCard delay={0.1}>
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  {loading ? (
                    <>
                      <Skeleton className="h-7 w-12 mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold">{totalCourses}</p>
                      <p className="text-sm text-muted-foreground">{t('totalCourses')}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
          <GlassCard delay={0.15}>
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  {loading ? (
                    <>
                      <Skeleton className="h-7 w-12 mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold">{verifiedCourses}</p>
                      <p className="text-sm text-muted-foreground">{t('verifiedCourses')}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
          <GlassCard delay={0.2}>
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Hash className="h-5 w-5 text-primary" />
                </div>
                <div>
                  {loading ? (
                    <>
                      <Skeleton className="h-7 w-14 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold">{totalCredits}</p>
                      <p className="text-sm text-muted-foreground">{t('totalCredits')}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
          <GlassCard delay={0.25}>
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Layers className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  {loading ? (
                    <>
                      <Skeleton className="h-7 w-10 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold">{departmentsCount}</p>
                      <p className="text-sm text-muted-foreground">{t('departments')}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t('department')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allDepartments')}</SelectItem>
              {filters.departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={semesterFilter} onValueChange={setSemesterFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('semester')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allSemesters')}</SelectItem>
              {filters.semesters.map((sem) => (
                <SelectItem key={sem} value={sem}>
                  {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <GlassCard delay={0.1}>
            <div className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/60 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t('noCourseFound')}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t('tryClearFilters')}
              </p>
              <Link href="/dashboard/university/courses/new">
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t('addFirstCourse')}
                </Button>
              </Link>
            </div>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/dashboard/university/courses/${course.id}`}
                className="block group"
              >
                <Card className="h-full hover:shadow-md hover:border-primary/20 transition-all duration-200">
                  <CardContent className="p-5">
                    {/* Top row: course code + verified badge */}
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="bg-primary/5 text-primary font-mono text-xs">
                        {course.courseCode}
                      </Badge>
                      {course.verified ? (
                        <Badge className="bg-primary/10 text-primary text-xs gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {t('verifiedStatus')}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground text-xs gap-1">
                          <Clock className="h-3 w-3" />
                          {t('unverifiedStatus')}
                        </Badge>
                      )}
                    </div>

                    {/* Course name */}
                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                      {course.courseName}
                    </h3>

                    {/* Department */}
                    {course.department && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {course.department}
                      </p>
                    )}

                    {/* Details row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
                      {course.professorName && (
                        <div className="flex items-center gap-1.5">
                          <GraduationCap className="h-3.5 w-3.5 text-muted-foreground/60" />
                          <span className="truncate max-w-[140px]">{course.professorName}</span>
                        </div>
                      )}
                      {course.credits !== null && (
                        <div className="flex items-center gap-1.5">
                          <Hash className="h-3.5 w-3.5 text-muted-foreground/60" />
                          <span>{course.credits} CFU</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-muted-foreground/60" />
                        <span>{course.projectCount} {course.projectCount === 1 ? t('project') : t('projects')}</span>
                      </div>
                    </div>

                    {/* Semester + Academic Year */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <span className="bg-muted px-2 py-0.5 rounded">{course.semester}</span>
                      <span className="bg-muted px-2 py-0.5 rounded">{course.academicYear}</span>
                      {course.level && (
                        <span className="bg-muted px-2 py-0.5 rounded">{course.level}</span>
                      )}
                    </div>

                    {/* Competencies */}
                    {course.competencies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {course.competencies.slice(0, 3).map((comp, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-xs font-normal bg-slate-50"
                          >
                            {comp}
                          </Badge>
                        ))}
                        {course.competencies.length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-xs font-normal text-muted-foreground"
                          >
                            +{course.competencies.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
