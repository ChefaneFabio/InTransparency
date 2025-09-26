'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'
import { coursesApi, filesApi } from '@/lib/api'
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
  FileText,
  Trash2,
  Edit3,
  CheckCircle,
  Database,
  RefreshCw,
  ExternalLink,
  Building as University
} from 'lucide-react'

export default function CoursesPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showTranscriptUpload, setShowTranscriptUpload] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  const [universityConnection, setUniversityConnection] = useState({
    isConnected: true,
    university: user?.university || 'Stanford University',
    status: 'connected',
    lastSync: '2 hours ago'
  })

  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    semester: '',
    year: new Date().getFullYear(),
    credits: 3,
    grade: '',
    instructor: '',
    isCompleted: false
  })

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await coursesApi.getAll()
      setCourses(response.data.data.courses || [])
    } catch (error: any) {
      console.error('Failed to fetch courses:', error)
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
      
      await coursesApi.create(formData)
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
        isCompleted: false
      })
      
      fetchCourses()
    } catch (error: any) {
      console.error('Failed to create course:', error)
      setError(error.response?.data?.error || 'Failed to add course')
    }
  }

  const handleTranscriptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setError('')
      setMessage('')
      setLoading(true)

      const response = await filesApi.parseTranscript(file)
      const parsedData = response.data.data.parsed

      if (parsedData.courses && parsedData.courses.length > 0) {
        const bulkResponse = await coursesApi.bulkCreate(parsedData.courses)
        setMessage(`Successfully imported ${parsedData.courses.length} courses from transcript!`)
        fetchCourses()
      } else {
        setMessage('Transcript uploaded but no courses were detected.')
      }
      
      setShowTranscriptUpload(false)
    } catch (error: any) {
      console.error('Failed to upload transcript:', error)
      setError(error.response?.data?.error || 'Failed to upload transcript')
    } finally {
      setLoading(false)
    }
  }

  const deleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return

    try {
      await coursesApi.delete(id)
      setMessage('Course deleted successfully!')
      fetchCourses()
    } catch (error: any) {
      console.error('Failed to delete course:', error)
      setError(error.response?.data?.error || 'Failed to delete course')
    }
  }

  const syncWithUniversity = async () => {
    try {
      setSyncStatus('syncing')
      setError('')

      // Simulate university API sync
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock sync response
      const syncedCourses = [
        {
          id: 'sync-1',
          courseCode: 'CS106A',
          courseName: 'Programming Methodology',
          semester: 'Fall',
          year: 2023,
          credits: 3,
          grade: 'A',
          instructor: 'Prof. Smith',
          isCompleted: true,
          source: 'university'
        },
        {
          id: 'sync-2',
          courseCode: 'MATH51',
          courseName: 'Linear Algebra and Differential Calculus',
          semester: 'Fall',
          year: 2023,
          credits: 5,
          grade: 'A-',
          instructor: 'Prof. Johnson',
          isCompleted: true,
          source: 'university'
        }
      ]

      // Merge with existing courses (avoid duplicates)
      setCourses(prev => {
        const existing = prev.filter(c => !syncedCourses.find(sc => sc.courseCode === c.courseCode))
        return [...existing, ...syncedCourses]
      })

      setSyncStatus('success')
      setLastSyncTime(new Date())
      setMessage('Successfully synced with university records!')
      setUniversityConnection(prev => ({
        ...prev,
        lastSync: 'Just now'
      }))

    } catch (error) {
      setSyncStatus('error')
      setError('Failed to sync with university. Please try again.')
    }
  }

  const calculateGPA = () => {
    const gradePoints: any = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0
    }

    const completedCourses = courses.filter(c => c.isCompleted && c.grade && gradePoints[c.grade] !== undefined)
    if (completedCourses.length === 0) return 'N/A'

    const totalPoints = completedCourses.reduce((sum, course) => {
      return sum + (gradePoints[course.grade] * course.credits)
    }, 0)

    const totalCredits = completedCourses.reduce((sum, course) => sum + course.credits, 0)

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 'N/A'
  }

  if (loading && courses.length === 0) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-8">
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
          <Button
            variant="outline"
            onClick={() => setShowTranscriptUpload(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Transcript
          </Button>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        </div>
      </div>

      {/* University Connection Status */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <University className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {universityConnection.university}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Connected</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">
                    Last sync: {universityConnection.lastSync}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="mr-1 h-3 w-3" />
                Verified
              </Badge>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {syncStatus === 'syncing' && (
            <div className="mt-4">
              <div className="flex items-center space-x-2 mb-2">
                <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-sm text-gray-600">Syncing with university database...</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
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
              <GraduationCap className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {courses.filter(c => c.isCompleted).length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{calculateGPA()}</div>
                <div className="text-sm text-gray-600">Current GPA</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {courses.reduce((sum, c) => sum + c.credits, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Credits</div>
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
                    placeholder="e.g. A, B+, 3.7"
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

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="completed"
                  checked={formData.isCompleted}
                  onChange={(e) => setFormData({...formData, isCompleted: e.target.checked})}
                />
                <Label htmlFor="completed">Course completed</Label>
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

      {/* Transcript Upload */}
      {showTranscriptUpload && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Transcript</CardTitle>
            <CardDescription>Upload your official transcript to automatically import courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="transcript">Select Transcript File (PDF, JPG, PNG)</Label>
                <Input
                  id="transcript"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleTranscriptUpload}
                />
              </div>
              <div className="flex space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowTranscriptUpload(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Courses List */}
      {courses.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-600 mb-6">
              Start by adding your courses or uploading your transcript.
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Course
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: any) => (
            <Card key={course.id} className={`hover:shadow-md transition-shadow ${
              course.source === 'university' ? 'border-l-4 border-l-blue-500' : ''
            }`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <CardTitle className="text-lg">{course.courseCode}</CardTitle>
                      {course.source === 'university' && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          <Database className="mr-1 h-3 w-3" />
                          Synced
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="mt-1">{course.courseName}</CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    {course.source !== 'university' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Simple edit functionality - in production this would open a modal or form
                          const newName = prompt('Edit course name:', course.courseName)
                          if (newName && newName.trim()) {
                            // Update course name locally (in production this would call API)
                            setCourses(courses.map(c =>
                              c.id === course.id
                                ? { ...c, courseName: newName.trim() }
                                : c
                            ))
                          }
                        }}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    )}
                    {course.source !== 'university' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCourse(course.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Semester:</span>
                    <span>{course.semester} {course.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Credits:</span>
                    <span>{course.credits}</span>
                  </div>
                  {course.grade && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Grade:</span>
                      <span className="font-medium">{course.grade}</span>
                    </div>
                  )}
                  {course.instructor && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Instructor:</span>
                      <span>{course.instructor}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      course.isCompleted 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {course.isCompleted ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}