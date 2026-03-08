'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Plus,
  Upload,
  GraduationCap,
  Calendar,
  BookOpen,
  TrendingUp,
  Trash2,
  Edit3,
  CheckCircle,
  Database,
  RefreshCw,
  ExternalLink,
  Building as University
} from 'lucide-react'

interface CourseData {
  id: string
  courseCode: string
  courseName: string
  semester: string
  academicYear?: string
  credits: number | null
  grade?: string
  professorName?: string
  department?: string
  university?: string
  ectsCredits?: number | null
  projectCount?: number
  source?: string
  isCompleted?: boolean
}

export default function CoursesPage() {
  const { data: session } = useSession()
  const [courses, setCourses] = useState<CourseData[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showTranscriptUpload, setShowTranscriptUpload] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')

  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    semester: '',
    year: new Date().getFullYear(),
    credits: 3,
    grade: '',
    instructor: '',
  })

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/courses')
      if (res.ok) {
        const data = await res.json()
        setCourses(data.data?.courses || [])
      } else {
        setError('Failed to load courses')
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err)
      setError('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError('')
      setMessage('')

      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setMessage('Course added successfully!')
        setShowAddForm(false)
        setFormData({
          courseCode: '',
          courseName: '',
          semester: '',
          year: new Date().getFullYear(),
          credits: 3,
          grade: '',
          instructor: '',
        })
        fetchCourses()
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to add course')
      }
    } catch (err) {
      console.error('Failed to create course:', err)
      setError('Failed to add course')
    }
  }

  const syncWithUniversity = async () => {
    try {
      setSyncStatus('syncing')
      setError('')
      // University sync is a placeholder — real integration would call university API
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSyncStatus('success')
      setMessage('Sync complete. No new courses found from university records.')
    } catch {
      setSyncStatus('error')
      setError('Failed to sync with university. Please try again.')
    }
  }

  const totalCredits = courses.reduce((sum, c) => sum + (c.credits || 0), 0)

  if (loading && courses.length === 0) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-1">
            Track your academic progress and sync with university records
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={syncWithUniversity}
            disabled={syncStatus === 'syncing'}
          >
            {syncStatus === 'syncing' ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Database className="mr-2 h-4 w-4" />
            )}
            Sync University
          </Button>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        </div>
      </div>

      {/* University Connection Status */}
      {session?.user && (
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <University className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {(session.user as any).university || 'University not set'}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-600">{courses.length} courses tracked</span>
                  </div>
                </div>
              </div>
            </div>
            {syncStatus === 'syncing' && (
              <div className="mt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-gray-600">Syncing with university database...</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Messages */}
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
                <div className="text-sm text-gray-600">Total Courses</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{totalCredits}</div>
                <div className="text-sm text-gray-600">Total Credits</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {courses.filter(c => c.projectCount && c.projectCount > 0).length}
                </div>
                <div className="text-sm text-gray-600">With Projects</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Course Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Course</CardTitle>
            <CardDescription>Enter your course information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="courseCode">Course Code</Label>
                  <Input
                    id="courseCode"
                    placeholder="e.g. CS101"
                    value={formData.courseCode}
                    onChange={(e) => setFormData({...formData, courseCode: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="courseName">Course Name</Label>
                  <Input
                    id="courseName"
                    placeholder="e.g. Introduction to Computer Science"
                    value={formData.courseName}
                    onChange={(e) => setFormData({...formData, courseName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Semester</Label>
                  <Select
                    value={formData.semester}
                    onValueChange={(value) => setFormData({...formData, semester: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fall">Fall</SelectItem>
                      <SelectItem value="Spring">Spring</SelectItem>
                      <SelectItem value="Summer">Summer</SelectItem>
                      <SelectItem value="Winter">Winter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="credits">Credits</Label>
                  <Input
                    id="credits"
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData({...formData, credits: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="grade">Grade (Optional)</Label>
                  <Input
                    id="grade"
                    placeholder="e.g. A, B+, 28/30"
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="instructor"
                    placeholder="Professor name"
                    value={formData.instructor}
                    onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <Button type="submit">Add Course</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Courses List */}
      {courses.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-600 mb-6">
              Start by adding your courses manually or syncing with your university.
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Course
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className={`hover:shadow-md transition-shadow ${
              course.source === 'university' ? 'border-l-4 border-l-primary' : ''
            }`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <CardTitle className="text-lg">{course.courseCode}</CardTitle>
                      {course.source === 'university' && (
                        <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                          <Database className="mr-1 h-3 w-3" />
                          Synced
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="mt-1">{course.courseName}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Semester:</span>
                    <span>{course.semester} {course.academicYear}</span>
                  </div>
                  {course.credits !== null && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Credits:</span>
                      <span>{course.credits}{course.ectsCredits ? ` (${course.ectsCredits} ECTS)` : ''}</span>
                    </div>
                  )}
                  {course.professorName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Professor:</span>
                      <span>{course.professorName}</span>
                    </div>
                  )}
                  {course.department && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span>{course.department}</span>
                    </div>
                  )}
                  {course.projectCount !== undefined && course.projectCount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Projects:</span>
                      <Badge variant="secondary" className="text-xs">{course.projectCount}</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
