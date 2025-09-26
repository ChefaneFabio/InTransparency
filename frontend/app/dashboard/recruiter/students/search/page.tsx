'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
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
  ExternalLink,
  CheckCircle2,
  Users,
  TrendingUp
} from 'lucide-react'

interface Student {
  id: string
  firstName: string
  lastName: string
  university: string
  major: string
  graduationYear: number
  gpa: number
  skills: string[]
  projects: {
    title: string
    tech: string[]
    complexity: number
    github?: string
  }[]
  location: string
  isOpenToWork: boolean
  contactAllowed: boolean
  matchScore: number
  profileImage?: string
}

export default function StudentSearchPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactStudent, setContactStudent] = useState<Student | null>(null)

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

  // Mock search results
  const mockStudents: Student[] = [
    {
      id: 'student_123',
      firstName: 'Alex',
      lastName: 'Chen',
      university: 'Stanford University',
      major: 'Computer Science',
      graduationYear: 2024,
      gpa: 3.8,
      skills: ['JavaScript', 'React', 'Python', 'SQL', 'Node.js'],
      projects: [
        {
          title: 'E-commerce Platform',
          tech: ['React', 'Node.js', 'MongoDB'],
          complexity: 8.5,
          github: 'github.com/alexchen/ecommerce'
        },
        {
          title: 'AI Chat Bot',
          tech: ['Python', 'TensorFlow', 'Flask'],
          complexity: 9.2
        }
      ],
      location: 'San Francisco, CA',
      isOpenToWork: true,
      contactAllowed: true,
      matchScore: 95
    },
    {
      id: 'student_456',
      firstName: 'Maria',
      lastName: 'Rodriguez',
      university: 'MIT',
      major: 'Software Engineering',
      graduationYear: 2025,
      gpa: 3.9,
      skills: ['Java', 'Spring', 'React', 'AWS', 'Docker'],
      projects: [
        {
          title: 'Microservices Architecture',
          tech: ['Java', 'Spring Boot', 'Docker', 'AWS'],
          complexity: 9.0
        }
      ],
      location: 'Boston, MA',
      isOpenToWork: true,
      contactAllowed: true,
      matchScore: 88
    },
    {
      id: 'student_789',
      firstName: 'David',
      lastName: 'Kim',
      university: 'UC Berkeley',
      major: 'Computer Science',
      graduationYear: 2024,
      gpa: 3.7,
      skills: ['Python', 'Django', 'PostgreSQL', 'React', 'AWS'],
      projects: [
        {
          title: 'Social Media Analytics',
          tech: ['Python', 'Django', 'PostgreSQL', 'D3.js'],
          complexity: 8.7
        }
      ],
      location: 'San Francisco, CA',
      isOpenToWork: false,
      contactAllowed: true,
      matchScore: 82
    }
  ]

  const performSearch = async () => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setSearchResults(mockStudents)
      setLoading(false)
    }, 1000)
  }

  const handleContactStudent = (student: Student) => {
    setContactStudent(student)
    setShowContactModal(true)
  }

  const sendMessage = async (message: string, subject: string) => {
    try {
      // Simulate API call to send message
      await new Promise(resolve => setTimeout(resolve, 1000))

      // In production, this would call: await messagesApi.send({ recipientId: contactStudent.id, subject, message })
      console.log('Message sent successfully to', contactStudent?.firstName, ':', { subject, message })

      // Show success notification (you could use a toast library here)
      alert(`Message sent successfully to ${contactStudent?.firstName} ${contactStudent?.lastName}!`)

      setShowContactModal(false)
      setContactStudent(null)
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message. Please try again.')
    }
  }

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const StudentCard = ({ student }: { student: Student }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {student.firstName[0]}{student.lastName[0]}
            </div>
            <div>
              <CardTitle className="text-lg">
                {student.firstName} {student.lastName}
              </CardTitle>
              <CardDescription className="flex items-center space-x-2">
                <GraduationCap className="h-4 w-4" />
                <span>{student.university}</span>
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-green-600">
              {student.matchScore}% match
            </Badge>
            {student.isOpenToWork && (
              <Badge variant="default" className="bg-green-500">
                Open to work
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-4 w-4 text-gray-500" />
            <span>{student.major}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>Grad {student.graduationYear}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-gray-500" />
            <span>GPA: {student.gpa}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{student.location}</span>
          </div>
        </div>

        {/* Skills */}
        <div>
          <Label className="text-sm font-medium">Skills</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {student.skills.slice(0, 5).map(skill => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {student.skills.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{student.skills.length - 5} more
              </Badge>
            )}
          </div>
        </div>

        {/* Top Project */}
        {student.projects.length > 0 && (
          <div>
            <Label className="text-sm font-medium">Top Project</Label>
            <div className="mt-1 p-2 bg-gray-50 rounded">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{student.projects[0]?.title}</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">
                    {student.projects[0]?.complexity}/10
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {student.projects[0]?.tech?.map(tech => (
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
              disabled={!student.contactAllowed}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Contact
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const ContactModal = () => (
    showContactModal && contactStudent && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-lg mx-4">
          <CardHeader>
            <CardTitle>
              Contact {contactStudent.firstName} {contactStudent.lastName}
            </CardTitle>
            <CardDescription>
              Send a personalized message about opportunities at your company
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                placeholder={`Hi ${contactStudent.firstName}! I came across your ${contactStudent.projects[0]?.title} project and was impressed by your skills. We have an exciting role that would be perfect for your background...`}
                defaultValue={`Hi ${contactStudent.firstName}! I came across your ${contactStudent.projects[0]?.title} project and was impressed by your ${contactStudent.skills?.[0] || 'technical'} skills. We have an exciting opportunity at ${user?.company || 'our company'} that would be perfect for your background. Would you be interested in learning more?`}
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
                onClick={() => {
                  const subject = (document.getElementById('subject') as HTMLInputElement)?.value
                  const message = (document.getElementById('message') as HTMLTextAreaElement)?.value
                  sendMessage(message, subject)
                }}
              >
                <Send className="h-4 w-4 mr-1" />
                Send Message
              </Button>
            </div>
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
                    className="w-full"
                  />
                </div>
                <Button onClick={performSearch} disabled={loading}>
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
                  <Select onValueChange={(value) => setSearchFilters(prev => ({ ...prev, university: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any university" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any University</SelectItem>
                      <SelectItem value="stanford">Stanford University</SelectItem>
                      <SelectItem value="mit">MIT</SelectItem>
                      <SelectItem value="berkeley">UC Berkeley</SelectItem>
                      <SelectItem value="cmu">Carnegie Mellon</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Select onValueChange={(value) => setSearchFilters(prev => ({ ...prev, major: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any major" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="se">Software Engineering</SelectItem>
                      <SelectItem value="ee">Electrical Engineering</SelectItem>
                      <SelectItem value="ds">Data Science</SelectItem>
                    </SelectContent>
                  </Select>
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
              </div>
              <Button onClick={performSearch} disabled={loading} className="w-full">
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
              <Button onClick={performSearch} disabled={loading} className="w-full">
                <TrendingUp className="h-4 w-4 mr-1" />
                Get AI Recommendations
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Search Results ({searchResults.length} students found)
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
        </div>
      )}

      {/* Contact Modal */}
      <ContactModal />
    </div>
  )
}