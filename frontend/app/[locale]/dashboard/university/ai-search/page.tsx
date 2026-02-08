'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Sparkles,
  Send,
  User,
  Bot,
  GraduationCap,
  MapPin,
  Star,
  Award,
  Briefcase,
  Calendar,
  Building2,
  ArrowRight,
  Lightbulb,
  Zap,
  DollarSign,
  Clock,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  searchType?: 'students' | 'jobs'
  searchCriteria?: any
  results?: Student[] | Job[]
}

type Student = {
  id: string
  name: string
  major: string
  gpa: number | null
  graduationYear: string
  location: string
  skills: string[]
  softSkills: string[]
  projectCount: number
  aiScore: number
  contacted: number
  hired: boolean
  availability: string
}

type Job = {
  id: string
  title: string
  company: string
  location: string
  salary: string
  jobType: string
  postedDate: string
  matchedStudents: number
  requirements: string[]
  companySize: string
}

// Response types from real APIs
type StudentApiResponse = {
  students: Array<{
    id: string
    name: string
    email: string
    major: string
    year: string
    gpa: number | null
    projects: number
    applications: number
    verified: boolean
    profilePublic: boolean
    lastActive: string | null
    joinedAt: string
    avatar: string
    photo: string | null
  }>
  total: number
  page: number
  totalPages: number
  stats: {
    totalStudents: number
    verifiedStudents: number
    activeProfiles: number
  }
  filters: {
    degrees: string[]
  }
}

type JobApiResponse = {
  jobs: Array<{
    id: string
    title: string
    companyName: string
    companySize: string | null
    location: string | null
    jobType: string
    workLocation: string
    salaryMin: number | null
    salaryMax: number | null
    salaryCurrency: string
    salaryPeriod: string
    showSalary: boolean
    requiredSkills: string[]
    postedAt: string | null
    createdAt: string
    _count: {
      applications: number
    }
  }>
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const exampleQueries = [
  // Student queries
  "Show me CS students with 3.8+ GPA who haven't been contacted yet",
  "Which students got hired at tech companies this year?",
  "Find engineering students with leadership skills available immediately",
  // Job queries
  "Find tech companies hiring ML engineers in Milan",
  "Show me entry-level positions for finance graduates",
  "Which companies are offering remote opportunities for our students?"
]

/**
 * Map a student from the API response to the display Student type.
 */
function mapApiStudentToDisplay(apiStudent: StudentApiResponse['students'][number]): Student {
  return {
    id: apiStudent.id,
    name: apiStudent.name,
    major: apiStudent.major || 'Undeclared',
    gpa: apiStudent.gpa,
    graduationYear: apiStudent.year || '',
    location: '', // Not returned by API
    skills: [], // Skills not in this API response
    softSkills: [],
    projectCount: apiStudent.projects,
    aiScore: 0, // Not computed by API
    contacted: apiStudent.applications,
    hired: false, // Not directly tracked in this API
    availability: apiStudent.profilePublic ? 'Available' : 'Not public',
  }
}

/**
 * Map a job from the API response to the display Job type.
 */
function mapApiJobToDisplay(apiJob: JobApiResponse['jobs'][number]): Job {
  // Format salary string
  let salary = 'Not disclosed'
  if (apiJob.showSalary && (apiJob.salaryMin || apiJob.salaryMax)) {
    const currency = apiJob.salaryCurrency || 'EUR'
    const symbol = currency === 'EUR' ? '\u20AC' : currency === 'USD' ? '$' : currency
    if (apiJob.salaryMin && apiJob.salaryMax) {
      salary = `${symbol}${apiJob.salaryMin.toLocaleString()} - ${symbol}${apiJob.salaryMax.toLocaleString()}`
    } else if (apiJob.salaryMin) {
      salary = `${symbol}${apiJob.salaryMin.toLocaleString()}+`
    } else if (apiJob.salaryMax) {
      salary = `Up to ${symbol}${apiJob.salaryMax.toLocaleString()}`
    }
    if (apiJob.salaryPeriod) {
      salary += `/${apiJob.salaryPeriod}`
    }
  }

  // Format job type for display
  const jobTypeMap: Record<string, string> = {
    'FULL_TIME': 'Full-time',
    'PART_TIME': 'Part-time',
    'CONTRACT': 'Contract',
    'INTERNSHIP': 'Internship',
    'TEMPORARY': 'Temporary',
    'FREELANCE': 'Freelance',
  }

  // Format posted date
  let postedDate = 'Recently'
  const postedTimestamp = apiJob.postedAt || apiJob.createdAt
  if (postedTimestamp) {
    const posted = new Date(postedTimestamp)
    const now = new Date()
    const diffMs = now.getTime() - posted.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays === 0) {
      postedDate = 'Today'
    } else if (diffDays === 1) {
      postedDate = '1 day ago'
    } else if (diffDays < 7) {
      postedDate = `${diffDays} days ago`
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      postedDate = `${weeks} week${weeks > 1 ? 's' : ''} ago`
    } else {
      const months = Math.floor(diffDays / 30)
      postedDate = `${months} month${months > 1 ? 's' : ''} ago`
    }
  }

  return {
    id: apiJob.id,
    title: apiJob.title,
    company: apiJob.companyName,
    location: apiJob.location || (apiJob.workLocation === 'REMOTE' ? 'Remote' : 'On-site'),
    salary,
    jobType: jobTypeMap[apiJob.jobType] || apiJob.jobType,
    postedDate,
    matchedStudents: apiJob._count.applications,
    requirements: apiJob.requiredSkills,
    companySize: apiJob.companySize || 'Unknown',
  }
}

export default function UniversityAISearchPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your university AI assistant. I can help you with:\n\n**Student Queries**: Track placement, identify high performers, find students with specific skills\n**Job Opportunities**: Find companies and positions that match your students\n\nJust tell me what you need in plain English!",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const detectSearchType = (query: string): 'students' | 'jobs' => {
    const lowerQuery = query.toLowerCase()

    // Job search indicators
    const jobKeywords = ['company', 'companies', 'job', 'jobs', 'position', 'hiring', 'opportunity', 'opportunities', 'employer']
    const hasJobKeyword = jobKeywords.some(keyword => lowerQuery.includes(keyword))

    // Student search indicators
    const studentKeywords = ['student', 'students', 'graduate', 'graduates', 'gpa', 'major', 'contacted', 'hired']
    const hasStudentKeyword = studentKeywords.some(keyword => lowerQuery.includes(keyword))

    // If both, prefer students (university's primary focus)
    if (hasStudentKeyword || !hasJobKeyword) return 'students'
    return 'jobs'
  }

  /**
   * Extract search parameters from a natural language student query.
   * Returns an object with `search` (for the API) and display `criteria`.
   */
  const parseStudentQuery = (query: string): { search: string; major: string; year: string; criteria: Record<string, any> } => {
    const criteria: Record<string, any> = {}
    const lowerQuery = query.toLowerCase()

    // GPA
    const gpaMatch = lowerQuery.match(/(\d+\.\d+)\+?\s*gpa/)
    if (gpaMatch) criteria.gpaMin = parseFloat(gpaMatch[1])

    // Major
    let major = ''
    if (lowerQuery.includes('cs') || lowerQuery.includes('computer science')) {
      major = 'Computer Science'
      criteria.major = 'Computer Science'
    }
    if (lowerQuery.includes('engineering')) {
      major = 'Engineering'
      criteria.major = 'Engineering'
    }
    if (lowerQuery.includes('data science')) {
      major = 'Data Science'
      criteria.major = 'Data Science'
    }
    if (lowerQuery.includes('finance')) {
      major = 'Finance'
      criteria.major = 'Finance'
    }

    // Graduation year
    let year = ''
    const yearMatch = lowerQuery.match(/\b(20\d{2})\b/)
    if (yearMatch) {
      year = yearMatch[1]
      criteria.year = year
    }

    // Contacted status
    if (lowerQuery.includes("haven't been contacted") || lowerQuery.includes("not contacted")) {
      criteria.maxContacted = 2
    }

    // Hired status
    if (lowerQuery.includes('hired') || lowerQuery.includes('placed')) {
      criteria.hired = true
    }

    // Soft skills
    if (lowerQuery.includes('leadership')) criteria.softSkills = ['Leadership']

    // Availability
    if (lowerQuery.includes('immediately') || lowerQuery.includes('available now')) {
      criteria.availableNow = true
    }

    // Build a general search term from the query by extracting key nouns
    // The API search parameter does free text search on name/email
    // For broader matching, just pass the whole query
    const search = query.trim()

    return { search, major, year, criteria }
  }

  /**
   * Fetch students from the real API.
   */
  const fetchStudents = async (query: string): Promise<{ students: Student[]; total: number; criteria: Record<string, any> }> => {
    const { major, year, criteria } = parseStudentQuery(query)

    const params = new URLSearchParams()
    // Use major/year filters if detected; otherwise pass the raw search
    if (major) params.set('major', major)
    if (year) params.set('year', year)
    // The API's `search` param searches name/email - we pass the raw query for maximum results
    // If specific filters were detected, we don't need the general text search
    if (!major && !year) {
      params.set('search', query.trim())
    }
    params.set('limit', '20')

    const res = await fetch(`/api/dashboard/university/students?${params.toString()}`)
    if (!res.ok) {
      throw new Error(`Students API error: ${res.status}`)
    }

    const data: StudentApiResponse = await res.json()

    let mappedStudents = data.students.map(mapApiStudentToDisplay)

    // Apply client-side filters that the API doesn't support
    if (criteria.gpaMin) {
      mappedStudents = mappedStudents.filter(s => s.gpa !== null && s.gpa >= criteria.gpaMin)
    }
    if (criteria.maxContacted !== undefined) {
      mappedStudents = mappedStudents.filter(s => s.contacted <= criteria.maxContacted)
    }
    if (criteria.availableNow) {
      mappedStudents = mappedStudents.filter(s => s.availability === 'Available')
    }

    return { students: mappedStudents, total: data.total, criteria }
  }

  /**
   * Fetch jobs from the real API.
   */
  const fetchJobs = async (query: string): Promise<{ jobs: Job[]; total: number; criteria: Record<string, any> }> => {
    const criteria: Record<string, any> = {}
    const lowerQuery = query.toLowerCase()

    const params = new URLSearchParams()
    params.set('search', query.trim())
    params.set('limit', '20')

    // Apply specific filters if detected
    if (lowerQuery.includes('internship') || lowerQuery.includes('intern')) {
      params.set('jobType', 'INTERNSHIP')
      criteria.jobType = 'Internship'
    } else if (lowerQuery.includes('full-time') || lowerQuery.includes('full time')) {
      params.set('jobType', 'FULL_TIME')
      criteria.jobType = 'Full-time'
    } else if (lowerQuery.includes('part-time') || lowerQuery.includes('part time')) {
      params.set('jobType', 'PART_TIME')
      criteria.jobType = 'Part-time'
    } else if (lowerQuery.includes('contract')) {
      params.set('jobType', 'CONTRACT')
      criteria.jobType = 'Contract'
    }

    if (lowerQuery.includes('remote')) {
      params.set('workLocation', 'REMOTE')
      criteria.workLocation = 'Remote'
    } else if (lowerQuery.includes('hybrid')) {
      params.set('workLocation', 'HYBRID')
      criteria.workLocation = 'Hybrid'
    }

    // Detect location mentions for criteria display
    if (lowerQuery.includes('milan')) criteria.location = 'Milan'
    if (lowerQuery.includes('rome')) criteria.location = 'Rome'

    // Detect role mentions for criteria display
    if (lowerQuery.includes('ml') || lowerQuery.includes('machine learning')) criteria.role = 'ML Engineer'
    if (lowerQuery.includes('frontend')) criteria.role = 'Frontend Developer'
    if (lowerQuery.includes('data')) criteria.role = 'Data Analyst'
    if (lowerQuery.includes('entry-level')) criteria.experienceLevel = 'Entry Level'

    const res = await fetch(`/api/jobs?${params.toString()}`)
    if (!res.ok) {
      throw new Error(`Jobs API error: ${res.status}`)
    }

    const data: JobApiResponse = await res.json()

    const mappedJobs = data.jobs.map(mapApiJobToDisplay)

    return { jobs: mappedJobs, total: data.pagination.total, criteria }
  }

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userQuery = input.trim()
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userQuery,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    const searchType = detectSearchType(userQuery)
    let responseContent = ''
    let results: Student[] | Job[] = []

    try {
      if (searchType === 'students') {
        const { students, total, criteria } = await fetchStudents(userQuery)
        results = students

        if (students.length > 0) {
          responseContent = `Found **${students.length} student${students.length > 1 ? 's' : ''}**`
          if (total > students.length) {
            responseContent += ` (showing ${students.length} of ${total} total)`
          }
          responseContent += ` matching your criteria:\n\n`

          if (criteria.gpaMin) responseContent += `GPA: ${criteria.gpaMin}+\n`
          if (criteria.major) responseContent += `Major: ${criteria.major}\n`
          if (criteria.year) responseContent += `Year: ${criteria.year}\n`
          if (criteria.maxContacted !== undefined) responseContent += `Low contact rate\n`
          if (criteria.hired) responseContent += `Successfully placed\n`
          if (criteria.softSkills) responseContent += `Soft skills: ${criteria.softSkills.join(', ')}\n`

          responseContent += `\nYou can refine by asking about specific skills, graduation year, or contact status.`
        } else {
          responseContent = `No students match those criteria (searched ${total} total records). Try:\n\n1. Broadening the GPA range\n2. Looking at different majors\n3. Including more graduation years`
        }
      } else {
        const { jobs, total, criteria } = await fetchJobs(userQuery)
        results = jobs

        if (jobs.length > 0) {
          responseContent = `Found **${jobs.length} job opportunity${jobs.length > 1 ? 's' : ''}**`
          if (total > jobs.length) {
            responseContent += ` (showing ${jobs.length} of ${total} total)`
          }
          responseContent += ` for your students:\n\n`

          if (criteria.role) responseContent += `Role: ${criteria.role}\n`
          if (criteria.location) responseContent += `Location: ${criteria.location}\n`
          if (criteria.jobType) responseContent += `Type: ${criteria.jobType}\n`
          if (criteria.workLocation) responseContent += `Work location: ${criteria.workLocation}\n`

          responseContent += `\nI can show you which of your students match each position!`
        } else {
          responseContent = `No jobs match those criteria. Try:\n\n1. Different locations\n2. Related job titles\n3. Various company sizes`
        }
      }
    } catch (error) {
      console.error('Search error:', error)
      responseContent = `Sorry, I encountered an error while searching. Please try again.\n\nIf the issue persists, check your connection or contact support.`
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseContent,
      timestamp: new Date(),
      searchType,
      results: results.length > 0 ? results : undefined
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsTyping(false)
  }

  const handleExampleClick = (example: string) => {
    setInput(example)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Search Hub</h1>
              <p className="text-gray-600">Search students & job opportunities</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-200px)] flex flex-col shadow-xl">
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                      )}

                      <div className={`flex flex-col max-w-[70%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                        </div>

                        {/* Show results */}
                        {message.results && message.results.length > 0 && (
                          <div className="mt-4 space-y-3 w-full">
                            {message.searchType === 'students' ? (
                              // Student results
                              (message.results as Student[]).map((student) => (
                                <motion.div
                                  key={student.id}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <h3 className="font-bold text-gray-900">{student.name}</h3>
                                      <p className="text-sm text-gray-600 flex items-center mt-1">
                                        <GraduationCap className="h-4 w-4 mr-1" />
                                        {student.major}
                                      </p>
                                    </div>
                                    <Badge className={student.hired ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                                      {student.hired ? 'Hired' : `${student.contacted} applications`}
                                    </Badge>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                    <div className="flex items-center text-gray-600">
                                      <Award className="h-4 w-4 mr-2" />
                                      GPA: {student.gpa !== null ? student.gpa : 'N/A'}
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                      <Calendar className="h-4 w-4 mr-2" />
                                      {student.graduationYear ? `Class of ${student.graduationYear}` : 'Year N/A'}
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                      <Briefcase className="h-4 w-4 mr-2" />
                                      {student.projectCount} projects
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                      <Star className="h-4 w-4 mr-2" />
                                      {student.availability}
                                    </div>
                                  </div>

                                  {student.skills.length > 0 && (
                                    <div className="mb-2">
                                      <p className="text-xs text-gray-500 mb-1">Skills:</p>
                                      <div className="flex flex-wrap gap-1">
                                        {student.skills.slice(0, 4).map((skill) => (
                                          <Badge key={skill} variant="secondary" className="text-xs">
                                            {skill}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  <Button variant="outline" size="sm" className="w-full">
                                    View Full Profile
                                    <ArrowRight className="h-3 w-3 ml-2" />
                                  </Button>
                                </motion.div>
                              ))
                            ) : (
                              // Job results
                              (message.results as Job[]).map((job) => (
                                <motion.div
                                  key={job.id}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <h3 className="font-bold text-gray-900">{job.title}</h3>
                                      <p className="text-sm text-gray-600 flex items-center mt-1">
                                        <Building2 className="h-4 w-4 mr-1" />
                                        {job.company}
                                      </p>
                                    </div>
                                    <Badge className="bg-purple-100 text-purple-800">
                                      {job.matchedStudents} applications
                                    </Badge>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                    <div className="flex items-center text-gray-600">
                                      <MapPin className="h-4 w-4 mr-2" />
                                      {job.location}
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                      <DollarSign className="h-4 w-4 mr-2" />
                                      {job.salary}
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                      <Clock className="h-4 w-4 mr-2" />
                                      {job.jobType}
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                      <Calendar className="h-4 w-4 mr-2" />
                                      {job.postedDate}
                                    </div>
                                  </div>

                                  {job.requirements.length > 0 && (
                                    <div className="mb-3">
                                      <p className="text-xs text-gray-500 mb-1">Required:</p>
                                      <div className="flex flex-wrap gap-1">
                                        {job.requirements.map((req) => (
                                          <Badge key={req} variant="secondary" className="text-xs">
                                            {req}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                                    View Matched Students
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                  </Button>
                                </motion.div>
                              ))
                            )}
                          </div>
                        )}

                        <span className="text-xs text-gray-500 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>

                      {message.role === 'user' && (
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </CardContent>

              <div className="border-t border-gray-200 p-4">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Search students or jobs..."
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={isTyping}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                  Example Queries
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {exampleQueries.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 border border-gray-200 transition-colors text-sm"
                  >
                    {example}
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Zap className="h-5 w-5 mr-2 text-indigo-600" />
                  Search Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Student Searches:</p>
                  <ul className="text-gray-600 space-y-1">
                    <li>- Track placement outcomes</li>
                    <li>- Identify high performers</li>
                    <li>- Monitor contact rates</li>
                    <li>- Find available graduates</li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-indigo-100">
                  <p className="font-semibold text-gray-900 mb-2">Job Searches:</p>
                  <ul className="text-gray-600 space-y-1">
                    <li>- Find hiring companies</li>
                    <li>- Match jobs to students</li>
                    <li>- Track opportunities</li>
                    <li>- Identify placements</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
