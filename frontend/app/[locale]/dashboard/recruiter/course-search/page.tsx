'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  GraduationCap,
  MapPin,
  Award,
  Code,
  MessageSquare,
  Sparkles,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Building2,
  BookOpen,
  Users,
} from 'lucide-react'
import { Link } from '@/navigation'

interface CourseStudent {
  id: string
  name: string
  initials: string
  email: string
  university: string | null
  degree: string | null
  graduationYear: string | null
  gpa: number | null
  photo: string | null
  bio: string | null
  tagline: string | null
  courseGrade: string | null
  project: {
    id: string
    title: string
    technologies: string[]
    skills: string[]
    innovationScore: number | null
    complexityScore: number | null
  }
}

interface CourseGroup {
  courseId: string
  courseName: string
  courseCode: string
  department: string | null
  semester: string
  academicYear: string
  professorName: string | null
  students: CourseStudent[]
}

interface InstitutionGroup {
  institution: string
  courses: CourseGroup[]
}

export default function CourseSearchPage() {
  const [groups, setGroups] = useState<InstitutionGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalStudents, setTotalStudents] = useState(0)
  const [totalGroups, setTotalGroups] = useState(0)

  // Filters
  const [courseCategory, setCourseCategory] = useState('')
  const [minGrade, setMinGrade] = useState('')
  const [institutionType, setInstitutionType] = useState('')
  const [showFilters, setShowFilters] = useState(true)

  // Expanded state
  const [expandedInstitutions, setExpandedInstitutions] = useState<Record<string, boolean>>({})
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({})

  const fetchResults = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (courseCategory) params.set('courseCategory', courseCategory)
      if (minGrade) params.set('minGrade', minGrade)
      if (institutionType) params.set('institutionType', institutionType)

      const res = await fetch(`/api/dashboard/recruiter/search/by-course?${params.toString()}`)
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to search')
      }
      const data = await res.json()
      setGroups(data.groups || [])
      setTotalStudents(data.total || 0)
      setTotalGroups(data.totalGroups || 0)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch results')
    } finally {
      setLoading(false)
    }
  }, [courseCategory, minGrade, institutionType])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  const toggleInstitution = (institution: string) => {
    setExpandedInstitutions(prev => ({ ...prev, [institution]: !prev[institution] }))
  }

  const toggleCourse = (courseId: string) => {
    setExpandedCourses(prev => ({ ...prev, [courseId]: !prev[courseId] }))
  }

  const gradeOptions = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          Course-Level Search
        </h1>
        <p className="text-gray-600 mt-2">
          Search candidates by verified course grades from institutions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            {showFilters && (
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Department / Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Computer Science, Engineering..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder:text-gray-400"
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Minimum Grade
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={minGrade}
                    onChange={(e) => setMinGrade(e.target.value)}
                  >
                    <option value="">Any grade</option>
                    {gradeOptions.map(g => (
                      <option key={g} value={g}>{g} or higher</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    placeholder="Filter by institution name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder:text-gray-400"
                    value={institutionType}
                    onChange={(e) => setInstitutionType(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={fetchResults} className="flex-1" size="sm">
                    <Search className="h-4 w-4 mr-1" />
                    Search
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCourseCategory('')
                      setMinGrade('')
                      setInstitutionType('')
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Search Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Institutions</span>
                <span className="font-semibold">{totalGroups}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Students Found</span>
                <span className="font-semibold text-primary">{totalStudents}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active Filters</span>
                <span className="font-semibold">
                  {[courseCategory, minGrade, institutionType].filter(Boolean).length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {totalGroups} Institution{totalGroups !== 1 ? 's' : ''} Found
            </h2>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-6 w-64" />
                    <Skeleton className="h-4 w-48" />
                    <div className="space-y-2">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchResults}>Retry</Button>
            </Card>
          ) : groups.length === 0 ? (
            <Card className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters to see more results
              </p>
              <Button onClick={() => {
                setCourseCategory('')
                setMinGrade('')
                setInstitutionType('')
              }}>
                Reset Filters
              </Button>
            </Card>
          ) : (
            groups.map((group) => {
              const isExpanded = expandedInstitutions[group.institution] !== false
              const totalInstitutionStudents = group.courses.reduce(
                (sum, c) => sum + c.students.length, 0
              )

              return (
                <Card key={group.institution} className="overflow-hidden">
                  {/* Institution Header */}
                  <div
                    className="p-4 bg-gradient-to-r from-slate-50 to-white cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => toggleInstitution(group.institution)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{group.institution}</h3>
                          <p className="text-sm text-gray-600">
                            {group.courses.length} course{group.courses.length !== 1 ? 's' : ''} &middot; {totalInstitutionStudents} student{totalInstitutionStudents !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Courses */}
                  {isExpanded && (
                    <CardContent className="pt-0 space-y-3">
                      {group.courses.map((course) => {
                        const courseExpanded = expandedCourses[course.courseId] !== false

                        return (
                          <div key={course.courseId} className="border rounded-lg overflow-hidden">
                            {/* Course Header */}
                            <div
                              className="p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                              onClick={() => toggleCourse(course.courseId)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <BookOpen className="h-4 w-4 text-primary" />
                                  <span className="font-medium text-sm">{course.courseName}</span>
                                  {course.courseCode && (
                                    <Badge variant="outline" className="text-xs">{course.courseCode}</Badge>
                                  )}
                                  {course.department && (
                                    <Badge variant="secondary" className="text-xs">{course.department}</Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-gray-500">
                                    {course.semester} {course.academicYear}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    <Users className="h-3 w-3 mr-1" />
                                    {course.students.length}
                                  </Badge>
                                  {courseExpanded ? (
                                    <ChevronUp className="h-4 w-4 text-gray-400" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                  )}
                                </div>
                              </div>
                              {course.professorName && (
                                <p className="text-xs text-gray-500 mt-1 ml-6">
                                  Prof. {course.professorName}
                                </p>
                              )}
                            </div>

                            {/* Students */}
                            {courseExpanded && (
                              <div className="divide-y">
                                {course.students.map((student) => (
                                  <div key={`${student.id}-${course.courseId}`} className="p-3 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                          {student.photo && <AvatarImage src={student.photo} alt={student.name} />}
                                          <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-primary/20 to-primary/5">
                                            {student.initials}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <h4 className="font-medium text-sm">{student.name}</h4>
                                          <div className="flex items-center gap-2 text-xs text-gray-500">
                                            {student.degree && (
                                              <span className="flex items-center gap-1">
                                                <GraduationCap className="h-3 w-3" />
                                                {student.degree}
                                              </span>
                                            )}
                                            {student.graduationYear && (
                                              <span>Class of {student.graduationYear}</span>
                                            )}
                                            {student.gpa !== null && (
                                              <Badge variant="outline" className="text-xs">
                                                GPA: {student.gpa.toFixed(1)}
                                              </Badge>
                                            )}
                                          </div>
                                          {student.tagline && (
                                            <p className="text-xs text-gray-400 mt-1">{student.tagline}</p>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        {student.courseGrade && (
                                          <Badge className="bg-green-100 text-green-700">
                                            <Award className="h-3 w-3 mr-1" />
                                            {student.courseGrade}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>

                                    {/* Project */}
                                    <div className="mt-2 ml-13 bg-gray-50 rounded p-2">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <Code className="h-3 w-3 text-primary" />
                                          <span className="text-xs font-medium">{student.project.title}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          {student.project.innovationScore !== null && (
                                            <Badge variant="outline" className="text-xs">
                                              Innovation: {student.project.innovationScore}
                                            </Badge>
                                          )}
                                          {student.project.complexityScore !== null && (
                                            <Badge variant="outline" className="text-xs">
                                              Complexity: {student.project.complexityScore}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                      {(student.project.technologies.length > 0 || student.project.skills.length > 0) && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {student.project.technologies.slice(0, 4).map(tech => (
                                            <Badge key={tech} variant="secondary" className="text-xs">
                                              {tech}
                                            </Badge>
                                          ))}
                                          {student.project.skills.slice(0, 3).map(skill => (
                                            <Badge key={skill} variant="outline" className="text-xs">
                                              {skill}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-2 ml-13 flex items-center gap-2">
                                      <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
                                        <Link href={`/dashboard/recruiter/candidates/${student.id}`}>
                                          <ExternalLink className="h-3 w-3 mr-1" />
                                          Profile
                                        </Link>
                                      </Button>
                                      <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
                                        <Link href={`/dashboard/recruiter/messages?to=${student.id}`}>
                                          <MessageSquare className="h-3 w-3 mr-1" />
                                          Contact
                                        </Link>
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </CardContent>
                  )}
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
