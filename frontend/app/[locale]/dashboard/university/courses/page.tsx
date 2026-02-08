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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Corsi</h1>
            <p className="text-gray-600">Gestisci i corsi del tuo ateneo</p>
          </div>
          <Link href="/dashboard/university/courses/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Aggiungi Corso
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-blue-600" />
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
                      <p className="text-sm text-gray-600">Corsi Totali</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
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
                      <p className="text-sm text-gray-600">Corsi Verificati</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Hash className="h-5 w-5 text-purple-600" />
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
                      <p className="text-sm text-gray-600">Crediti Totali</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
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
                      <p className="text-sm text-gray-600">Dipartimenti</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cerca corso, codice o docente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Dipartimento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti i dipartimenti</SelectItem>
              {filters.departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={semesterFilter} onValueChange={setSemesterFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Semestre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti i semestri</SelectItem>
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
          <Card className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nessun corso trovato
            </h3>
            <p className="text-gray-600 mb-6">
              Prova a modificare i filtri di ricerca oppure aggiungi un nuovo corso
            </p>
            <Link href="/dashboard/university/courses/new">
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Aggiungi il primo corso
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/dashboard/university/courses/${course.id}`}
                className="block group"
              >
                <Card className="h-full hover:shadow-md hover:border-blue-200 transition-all duration-200">
                  <CardContent className="p-5">
                    {/* Top row: course code + verified badge */}
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-mono text-xs">
                        {course.courseCode}
                      </Badge>
                      {course.verified ? (
                        <Badge className="bg-green-100 text-green-700 text-xs gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Verificato
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500 text-xs gap-1">
                          <Clock className="h-3 w-3" />
                          Non verificato
                        </Badge>
                      )}
                    </div>

                    {/* Course name */}
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-1">
                      {course.courseName}
                    </h3>

                    {/* Department */}
                    {course.department && (
                      <p className="text-sm text-gray-500 mb-3">
                        {course.department}
                      </p>
                    )}

                    {/* Details row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                      {course.professorName && (
                        <div className="flex items-center gap-1.5">
                          <GraduationCap className="h-3.5 w-3.5 text-gray-400" />
                          <span className="truncate max-w-[140px]">{course.professorName}</span>
                        </div>
                      )}
                      {course.credits !== null && (
                        <div className="flex items-center gap-1.5">
                          <Hash className="h-3.5 w-3.5 text-gray-400" />
                          <span>{course.credits} CFU</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-gray-400" />
                        <span>{course.projectCount} {course.projectCount === 1 ? 'progetto' : 'progetti'}</span>
                      </div>
                    </div>

                    {/* Semester + Academic Year */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <span className="bg-gray-100 px-2 py-0.5 rounded">{course.semester}</span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded">{course.academicYear}</span>
                      {course.level && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded">{course.level}</span>
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
                            className="text-xs font-normal text-gray-500"
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
