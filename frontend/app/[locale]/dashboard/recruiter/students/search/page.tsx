'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Search,
  Filter,
  Star,
  MapPin,
  GraduationCap,
  Calendar,
  Send,
  Heart,
  Eye,
  MessageCircle,
  Download,
  CheckCircle2,
  Users,
  TrendingUp,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface StudentProject {
  id: string
  title: string
  technologies: string[]
  innovationScore: number | null
}

interface Student {
  id: string
  name: string
  initials: string
  email: string
  university: string | null
  degree: string | null
  graduationYear: string | null
  gpa: number | null
  bio: string | null
  tagline: string | null
  photo: string | null
  projectCount: number
  topProjects: StudentProject[]
}

interface SearchResponse {
  students: Student[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function StudentSearchPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactStudent, setContactStudent] = useState<Student | null>(null)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [messageSuccess, setMessageSuccess] = useState<string | null>(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)

  const [searchFilters, setSearchFilters] = useState({
    skills: '',
    university: '',
    graduationYear: '',
    gpaMin: '',
    location: '',
    major: '',
    projectCount: '',
    availability: 'all'
  })

  const performSearch = useCallback(async (page = 1) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (searchFilters.skills) params.set('skills', searchFilters.skills)
      if (searchFilters.university && searchFilters.university !== 'all') params.set('university', searchFilters.university)
      if (searchFilters.graduationYear) params.set('graduationYear', searchFilters.graduationYear)
      if (searchFilters.gpaMin) params.set('gpaMin', searchFilters.gpaMin)
      if (searchFilters.major) params.set('major', searchFilters.major)
      if (searchFilters.projectCount) params.set('minProjects', searchFilters.projectCount)
      if (searchFilters.location) params.set('location', searchFilters.location)
      params.set('page', String(page))
      params.set('limit', '20')

      const res = await fetch(`/api/dashboard/recruiter/search/students?${params.toString()}`)
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || `Search failed (${res.status})`)
      }

      const data: SearchResponse = await res.json()
      setSearchResults(data.students)
      setCurrentPage(data.page)
      setTotalPages(data.totalPages)
      setTotalResults(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search students')
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }, [searchQuery, searchFilters])

  const handleContactStudent = (student: Student) => {
    setContactStudent(student)
    setShowContactModal(true)
    setMessageSuccess(null)
  }

  const sendMessage = async (message: string, subject: string) => {
    if (!contactStudent) return
    setSendingMessage(true)
    setMessageSuccess(null)

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: contactStudent.id,
          recipientEmail: contactStudent.email,
          subject,
          content: message,
        }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to send message')
      }

      setMessageSuccess(`Message sent successfully to ${contactStudent.name}!`)
      setTimeout(() => {
        setShowContactModal(false)
        setContactStudent(null)
        setMessageSuccess(null)
      }, 2000)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to send message. Please try again.')
    } finally {
      setSendingMessage(false)
    }
  }

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      performSearch(newPage)
    }
  }

  const StudentCard = ({ student }: { student: Student }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {student.initials}
            </div>
            <div>
              <CardTitle className="text-lg">
                {student.name}
              </CardTitle>
              <CardDescription className="flex items-center space-x-2">
                <GraduationCap className="h-4 w-4" />
                <span>{student.university || 'University not specified'}</span>
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-blue-600">
              {student.projectCount} project{student.projectCount !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-4 w-4 text-gray-700" />
            <span>{student.degree || 'Degree not specified'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-700" />
            <span>Grad {student.graduationYear || 'N/A'}</span>
          </div>
          {student.gpa !== null && (
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-gray-700" />
              <span>GPA: {student.gpa}</span>
            </div>
          )}
          {student.tagline && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-700" />
              <span className="truncate">{student.tagline}</span>
            </div>
          )}
        </div>

        {/* Bio excerpt */}
        {student.bio && (
          <p className="text-sm text-gray-600 line-clamp-2">{student.bio}</p>
        )}

        {/* Top Project */}
        {student.topProjects.length > 0 && (
          <div>
            <Label className="text-sm font-medium">Top Project</Label>
            <div className="mt-1 p-2 bg-gray-50 rounded">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{student.topProjects[0]?.title}</span>
                {student.topProjects[0]?.innovationScore !== null && (
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">
                      {student.topProjects[0]?.innovationScore}/10
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {student.topProjects[0]?.technologies?.map(tech => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleStudentSelection(student.id)}
              className={selectedStudents.includes(student.id) ? 'bg-blue-50' : ''}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              {selectedStudents.includes(student.id) ? 'Selected' : 'Select'}
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              View Profile
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => handleContactStudent(student)}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Contact
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-start space-x-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const ContactModal = () => (
    showContactModal && contactStudent && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-lg mx-4">
          <CardHeader>
            <CardTitle>
              Contact {contactStudent.name}
            </CardTitle>
            <CardDescription>
              Send a personalized message about opportunities at your company
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {messageSuccess ? (
              <div className="flex items-center space-x-2 text-green-600 p-4 bg-green-50 rounded">
                <CheckCircle2 className="h-5 w-5" />
                <span>{messageSuccess}</span>
              </div>
            ) : (
              <>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Exciting Frontend Developer Opportunity"
                    defaultValue={`Exciting opportunity at ${user?.company || 'our company'}`}
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    rows={6}
                    placeholder={`Hi ${contactStudent.name}! I came across your profile and was impressed by your skills...`}
                    defaultValue={`Hi ${contactStudent.name}! I came across your ${contactStudent.topProjects[0]?.title || 'project'} and was impressed by your skills. We have an exciting opportunity at ${user?.company || 'our company'} that would be perfect for your background. Would you be interested in learning more?`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setShowContactModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={sendingMessage}
                    onClick={() => {
                      const subject = (document.getElementById('subject') as HTMLInputElement)?.value
                      const message = (document.getElementById('message') as HTMLTextAreaElement)?.value
                      sendMessage(message, subject)
                    }}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    {sendingMessage ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Students</h1>
          <p className="text-gray-600 mt-1">
            Search and connect with talented students from any university
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-1" />
            Export Results
          </Button>
          {selectedStudents.length > 0 && (
            <Button>
              <Users className="h-4 w-4 mr-1" />
              Bulk Contact ({selectedStudents.length})
            </Button>
          )}
        </div>
      </div>

      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Search Students</CardTitle>
          <CardDescription>
            Find students by skills, university, graduation year, and more
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="simple" className="space-y-4">
            <TabsList>
              <TabsTrigger value="simple">Simple Search</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Filters</TabsTrigger>
              <TabsTrigger value="ai">AI Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="simple" className="space-y-4">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input
                    placeholder="Search by skills, university, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && performSearch(1)}
                    className="w-full"
                  />
                </div>
                <Button onClick={() => performSearch(1)} disabled={loading}>
                  <Search className="h-4 w-4 mr-1" />
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="skills">Required Skills</Label>
                  <Input
                    id="skills"
                    placeholder="JavaScript, React, Python"
                    value={searchFilters.skills}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, skills: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="university">University</Label>
                  <Input
                    id="university"
                    placeholder="Any university"
                    value={searchFilters.university}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, university: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Select onValueChange={(value) => setSearchFilters(prev => ({ ...prev, graduationYear: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2027">2027</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="major">Major</Label>
                  <Input
                    id="major"
                    placeholder="Computer Science, Engineering..."
                    value={searchFilters.major}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, major: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="San Francisco, CA"
                    value={searchFilters.location}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="gpaMin">Minimum GPA</Label>
                  <Select onValueChange={(value) => setSearchFilters(prev => ({ ...prev, gpaMin: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any GPA" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3.0">3.0+</SelectItem>
                      <SelectItem value="3.2">3.2+</SelectItem>
                      <SelectItem value="3.5">3.5+</SelectItem>
                      <SelectItem value="3.7">3.7+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="minProjects">Min Projects</Label>
                  <Select onValueChange={(value) => setSearchFilters(prev => ({ ...prev, projectCount: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                      <SelectItem value="10">10+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={() => performSearch(1)} disabled={loading} className="w-full">
                <Search className="h-4 w-4 mr-1" />
                {loading ? 'Searching...' : 'Search with Filters'}
              </Button>
            </TabsContent>

            <TabsContent value="ai" className="space-y-4">
              <div>
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  rows={4}
                  placeholder="Paste your job description here for AI-powered candidate recommendations..."
                />
              </div>
              <Button onClick={() => performSearch(1)} disabled={loading} className="w-full">
                <TrendingUp className="h-4 w-4 mr-1" />
                Get AI Recommendations
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Error state */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div>
              <p className="font-medium text-red-800">Search failed</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto" onClick={() => performSearch(currentPage)}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading state */}
      {loading && <LoadingSkeleton />}

      {/* Search Results */}
      {!loading && searchResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Search Results ({totalResults} student{totalResults !== 1 ? 's' : ''} found)
            </h2>
            <div className="flex items-center space-x-2">
              <Select defaultValue="relevance">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="gpa">GPA</SelectItem>
                  <SelectItem value="graduation">Graduation Date</SelectItem>
                  <SelectItem value="projects">Project Quality</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {searchResults.map(student => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* No results state */}
      {!loading && !error && searchResults.length === 0 && totalResults === 0 && currentPage > 0 && totalPages > 0 && (
        <Card className="p-12 text-center">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
          <p className="text-gray-600">
            Try broadening your search criteria or using different keywords
          </p>
        </Card>
      )}

      {/* Contact Modal */}
      <ContactModal />
    </div>
  )
}
