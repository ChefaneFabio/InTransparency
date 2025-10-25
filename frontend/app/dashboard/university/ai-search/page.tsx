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
  TrendingUp,
  Briefcase,
  Calendar,
  Building2,
  Users,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Zap,
  Target,
  DollarSign,
  Clock,
  Search
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
  gpa: number
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

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Marco Rossi',
    major: 'Computer Science',
    gpa: 3.85,
    graduationYear: '2024',
    location: 'Milan, IT',
    skills: ['Python', 'Machine Learning', 'React', 'SQL'],
    softSkills: ['Leadership', 'Communication', 'Problem-solving'],
    projectCount: 8,
    aiScore: 94,
    contacted: 5,
    hired: false,
    availability: 'Immediately'
  },
  {
    id: '2',
    name: 'Sofia Bianchi',
    major: 'Data Science',
    gpa: 3.92,
    graduationYear: '2024',
    location: 'Rome, IT',
    skills: ['Python', 'R', 'TensorFlow', 'Statistics'],
    softSkills: ['Analytical thinking', 'Teamwork', 'Presentation'],
    projectCount: 10,
    aiScore: 96,
    contacted: 8,
    hired: true,
    availability: 'Hired at TechCorp'
  },
  {
    id: '3',
    name: 'Luca Ferrari',
    major: 'Software Engineering',
    gpa: 3.78,
    graduationYear: '2025',
    location: 'Turin, IT',
    skills: ['Java', 'Spring', 'AWS', 'Docker'],
    softSkills: ['Innovation', 'Collaboration', 'Time management'],
    projectCount: 7,
    aiScore: 89,
    contacted: 2,
    hired: false,
    availability: 'June 2025'
  }
]

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'ML Engineer',
    company: 'TechCorp Italy',
    location: 'Milan, IT',
    salary: '€45,000 - €60,000',
    jobType: 'Full-time',
    postedDate: '2 days ago',
    matchedStudents: 12,
    requirements: ['Python', 'Machine Learning', 'TensorFlow'],
    companySize: 'Large (500+)'
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'StartupXYZ',
    location: 'Remote',
    salary: '€35,000 - €45,000',
    jobType: 'Full-time',
    postedDate: '1 week ago',
    matchedStudents: 8,
    requirements: ['React', 'TypeScript', 'CSS'],
    companySize: 'Startup (10-50)'
  },
  {
    id: '3',
    title: 'Data Analyst Intern',
    company: 'DataCo',
    location: 'Rome, IT',
    salary: '€1,200/month',
    jobType: 'Internship',
    postedDate: '3 days ago',
    matchedStudents: 15,
    requirements: ['Python', 'SQL', 'Excel', 'Statistics'],
    companySize: 'Medium (100-500)'
  }
]

export default function UniversityAISearchPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm your university AI assistant. I can help you with:\n\n🎓 **Student Queries**: Track placement, identify high performers, find students with specific skills\n💼 **Job Opportunities**: Find companies and positions that match your students\n\nJust tell me what you need in plain English!",
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

  const parseStudentQuery = (query: string) => {
    const criteria: any = {}
    const lowerQuery = query.toLowerCase()

    // GPA
    const gpaMatch = lowerQuery.match(/(\d+\.\d+)\+?\s*gpa/)
    if (gpaMatch) criteria.gpaMin = parseFloat(gpaMatch[1])

    // Major
    if (lowerQuery.includes('cs') || lowerQuery.includes('computer science')) criteria.major = 'Computer Science'
    if (lowerQuery.includes('engineering')) criteria.major = 'Engineering'
    if (lowerQuery.includes('data science')) criteria.major = 'Data Science'

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

    return criteria
  }

  const parseJobQuery = (query: string) => {
    const criteria: any = {}
    const lowerQuery = query.toLowerCase()

    // Skills/roles
    if (lowerQuery.includes('ml') || lowerQuery.includes('machine learning')) criteria.role = 'ML Engineer'
    if (lowerQuery.includes('frontend')) criteria.role = 'Frontend Developer'
    if (lowerQuery.includes('data')) criteria.role = 'Data Analyst'

    // Location
    if (lowerQuery.includes('milan')) criteria.location = 'Milan'
    if (lowerQuery.includes('rome')) criteria.location = 'Rome'
    if (lowerQuery.includes('remote')) criteria.location = 'Remote'

    // Job type
    if (lowerQuery.includes('internship') || lowerQuery.includes('intern')) criteria.jobType = 'Internship'
    if (lowerQuery.includes('entry-level')) criteria.experienceLevel = 'Entry Level'

    return criteria
  }

  const filterStudents = (criteria: any): Student[] => {
    return mockStudents.filter(student => {
      if (criteria.gpaMin && student.gpa < criteria.gpaMin) return false
      if (criteria.major && !student.major.includes(criteria.major)) return false
      if (criteria.maxContacted && student.contacted > criteria.maxContacted) return false
      if (criteria.hired !== undefined && student.hired !== criteria.hired) return false
      if (criteria.softSkills && !criteria.softSkills.some((s: string) => student.softSkills.includes(s))) return false
      if (criteria.availableNow && !student.availability.includes('Immediately')) return false
      return true
    })
  }

  const filterJobs = (criteria: any): Job[] => {
    return mockJobs.filter(job => {
      if (criteria.role && !job.title.includes(criteria.role)) return false
      if (criteria.location && !job.location.includes(criteria.location)) return false
      if (criteria.jobType && job.jobType !== criteria.jobType) return false
      return true
    })
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const searchType = detectSearchType(input)
      let responseContent = ''
      let results: Student[] | Job[] = []

      if (searchType === 'students') {
        const criteria = parseStudentQuery(input)
        const matchedStudents = filterStudents(criteria)
        results = matchedStudents

        if (matchedStudents.length > 0) {
          responseContent = `📊 Found **${matchedStudents.length} student${matchedStudents.length > 1 ? 's' : ''}** matching your criteria:\n\n`

          if (criteria.gpaMin) responseContent += `✅ GPA: ${criteria.gpaMin}+\n`
          if (criteria.major) responseContent += `✅ Major: ${criteria.major}\n`
          if (criteria.maxContacted !== undefined) responseContent += `✅ Low contact rate\n`
          if (criteria.hired) responseContent += `✅ Successfully placed\n`
          if (criteria.softSkills) responseContent += `✅ Soft skills: ${criteria.softSkills.join(', ')}\n`

          responseContent += `\n💡 You can refine by asking about specific skills, graduation year, or contact status.`
        } else {
          responseContent = "No students match those exact criteria. Try:\n\n1. Broadening the GPA range\n2. Looking at different majors\n3. Including more graduation years"
        }
      } else {
        const criteria = parseJobQuery(input)
        const matchedJobs = filterJobs(criteria)
        results = matchedJobs

        if (matchedJobs.length > 0) {
          responseContent = `💼 Found **${matchedJobs.length} job opportunity${matchedJobs.length > 1 ? 's' : ''}** for your students:\n\n`

          if (criteria.role) responseContent += `✅ Role: ${criteria.role}\n`
          if (criteria.location) responseContent += `✅ Location: ${criteria.location}\n`
          if (criteria.jobType) responseContent += `✅ Type: ${criteria.jobType}\n`

          responseContent += `\n💡 I can show you which of your students match each position!`
        } else {
          responseContent = "No jobs match those criteria. Try:\n\n1. Different locations\n2. Related job titles\n3. Various company sizes"
        }
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
    }, 1500)
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
                                      {student.hired ? '✓ Hired' : `${student.contacted} contacts`}
                                    </Badge>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                    <div className="flex items-center text-gray-600">
                                      <Award className="h-4 w-4 mr-2" />
                                      GPA: {student.gpa}
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                      <Calendar className="h-4 w-4 mr-2" />
                                      Class of {student.graduationYear}
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                      <MapPin className="h-4 w-4 mr-2" />
                                      {student.location}
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                      <Star className="h-4 w-4 mr-2" />
                                      {student.aiScore}% AI Score
                                    </div>
                                  </div>

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
                                      {job.matchedStudents} matches
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
                  />
                  <Button
                    onClick={handleSend}
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
                  <p className="font-semibold text-gray-900 mb-2">🎓 Student Searches:</p>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Track placement outcomes</li>
                    <li>• Identify high performers</li>
                    <li>• Monitor contact rates</li>
                    <li>• Find available graduates</li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-indigo-100">
                  <p className="font-semibold text-gray-900 mb-2">💼 Job Searches:</p>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Find hiring companies</li>
                    <li>• Match jobs to students</li>
                    <li>• Track opportunities</li>
                    <li>• Identify placements</li>
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
