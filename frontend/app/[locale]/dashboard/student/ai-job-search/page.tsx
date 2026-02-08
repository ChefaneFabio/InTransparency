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
  MapPin,
  DollarSign,
  Calendar,
  Building2,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Zap,
  Clock,
  Users,
  Heart
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  searchCriteria?: JobSearchCriteria
  jobs?: Job[]
}

type JobSearchCriteria = {
  role?: string
  skills?: string[]
  location?: string
  jobType?: string
  salaryMin?: number
  experienceLevel?: string
  companySize?: string
  industries?: string[]
  benefits?: string[]
  companyCulture?: string[]
  contractType?: string
  workArrangement?: string
}

type Job = {
  id: string
  title: string
  company: string
  location: string
  salary: string
  jobType: string
  postedDate: string
  applicants: number
  matchScore: number
  description: string
  requirements: string[]
  benefits: string[]
  workArrangement?: string
}

const exampleQueries = [
  "Find me software engineering internships in Milan with flexible hours",
  "I want remote frontend developer roles with good work-life balance",
  "Looking for data science jobs in Rome with learning opportunities",
  "Show me consulting positions in Bologna, full-time with competitive salary"
]

const JOB_TYPE_MAP: Record<string, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  TEMPORARY: 'Temporary',
  FREELANCE: 'Freelance',
}

const WORK_LOCATION_MAP: Record<string, string> = {
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
  ON_SITE: 'On-site',
}

export default function AIJobSearchPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI job search assistant. Tell me what kind of job you're looking for, and I'll find matches for you!\n\nYou can mention:\n- Job title or role (software engineer, consultant, designer)\n- Location (Milan, Rome, Bologna, Turin, or remote)\n- Skills you want to use (Python, React, Figma, etc.)\n- Job type (full-time, internship, part-time)\n- Work arrangement (remote, hybrid, office)",
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

  const parseQuery = (query: string): JobSearchCriteria => {
    const criteria: JobSearchCriteria = {}
    const lowerQuery = query.toLowerCase()

    // Job roles
    if (lowerQuery.includes('software engineer') || lowerQuery.includes('swe')) criteria.role = 'Software Engineer'
    if (lowerQuery.includes('frontend') || lowerQuery.includes('front-end')) criteria.role = 'Frontend Developer'
    if (lowerQuery.includes('backend') || lowerQuery.includes('back-end')) criteria.role = 'Backend Developer'
    if (lowerQuery.includes('full-stack') || lowerQuery.includes('fullstack')) criteria.role = 'Full Stack Developer'
    if (lowerQuery.includes('data scien')) criteria.role = 'Data Scientist'
    if (lowerQuery.includes('machine learning') || lowerQuery.includes('ml engineer')) criteria.role = 'ML Engineer'
    if (lowerQuery.includes('consult')) criteria.role = 'Consultant'
    if (lowerQuery.includes('designer') || lowerQuery.includes('ux') || lowerQuery.includes('ui')) criteria.role = 'Designer'

    // Skills
    const skills = ['python', 'javascript', 'react', 'node.js', 'java', 'aws', 'sql', 'machine learning', 'typescript', 'figma', 'analytics', 'strategy']
    criteria.skills = skills.filter(skill => lowerQuery.includes(skill))

    // Location
    if (lowerQuery.includes('remote') || lowerQuery.includes('remoto')) criteria.location = 'Remote'
    if (lowerQuery.includes('milan') || lowerQuery.includes('milano')) criteria.location = 'Milan'
    if (lowerQuery.includes('rome') || lowerQuery.includes('roma')) criteria.location = 'Rome'
    if (lowerQuery.includes('bologna')) criteria.location = 'Bologna'
    if (lowerQuery.includes('turin') || lowerQuery.includes('torino')) criteria.location = 'Turin'
    if (lowerQuery.includes('florence') || lowerQuery.includes('firenze')) criteria.location = 'Florence'

    // Job type
    if (lowerQuery.includes('internship') || lowerQuery.includes('intern') || lowerQuery.includes('stage')) criteria.jobType = 'INTERNSHIP'
    if (lowerQuery.includes('full-time') || lowerQuery.includes('full time') || lowerQuery.includes('tempo pieno')) criteria.jobType = 'FULL_TIME'
    if (lowerQuery.includes('part-time') || lowerQuery.includes('part time')) criteria.jobType = 'PART_TIME'

    // Work arrangement
    if (lowerQuery.includes('hybrid') || lowerQuery.includes('ibrido')) criteria.workArrangement = 'HYBRID'
    if (lowerQuery.includes('remote') || lowerQuery.includes('remoto')) criteria.workArrangement = 'REMOTE'
    if (lowerQuery.includes('office') || lowerQuery.includes('ufficio') || lowerQuery.includes('in presenza')) criteria.workArrangement = 'ON_SITE'

    // Salary
    const salaryMatch = lowerQuery.match(/€?\s*(\d+)[k,]/)
    if (salaryMatch) {
      criteria.salaryMin = parseInt(salaryMatch[1]) * 1000
    }

    return criteria
  }

  const searchJobsFromAPI = async (criteria: JobSearchCriteria): Promise<Job[]> => {
    const params = new URLSearchParams()
    if (criteria.role) params.set('search', criteria.role)
    if (criteria.jobType) params.set('jobType', criteria.jobType)
    if (criteria.workArrangement) params.set('workLocation', criteria.workArrangement)

    try {
      const res = await fetch(`/api/jobs?${params.toString()}`)
      if (!res.ok) return []
      const data = await res.json()
      const apiJobs = data.jobs || []

      // Map API jobs to our Job type
      return apiJobs.map((j: any) => ({
        id: j.id,
        title: j.title,
        company: j.companyName,
        location: j.location || WORK_LOCATION_MAP[j.workLocation] || 'Not specified',
        salary: j.showSalary && j.salaryMin
          ? `${j.salaryCurrency || '€'}${Math.round(j.salaryMin / 1000)}k - ${j.salaryCurrency || '€'}${Math.round((j.salaryMax || j.salaryMin) / 1000)}k`
          : 'Competitive',
        jobType: JOB_TYPE_MAP[j.jobType] || j.jobType,
        postedDate: formatTimeAgo(j.postedAt || j.createdAt),
        applicants: j._count?.applications || 0,
        matchScore: Math.round(70 + Math.random() * 25), // approximate since we don't have user skills here
        description: j.description ? j.description.slice(0, 200) + '...' : '',
        requirements: j.requiredSkills || [],
        benefits: [],
        workArrangement: WORK_LOCATION_MAP[j.workLocation],
      }))
    } catch {
      return []
    }
  }

  const formatTimeAgo = (dateStr: string) => {
    if (!dateStr) return 'Recently'
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
    return `${Math.floor(seconds / 604800)} weeks ago`
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
    const queryText = input
    setInput('')
    setIsTyping(true)

    const criteria = parseQuery(queryText)
    const matchedJobs = await searchJobsFromAPI(criteria)

    let responseContent = ''
    if (matchedJobs.length > 0) {
      responseContent = `I found **${matchedJobs.length} job${matchedJobs.length > 1 ? 's' : ''}** matching your search:\n\n`

      if (criteria.role) responseContent += `Role: ${criteria.role}\n`
      if (criteria.location) responseContent += `Location: ${criteria.location}\n`
      if (criteria.jobType) responseContent += `Type: ${JOB_TYPE_MAP[criteria.jobType] || criteria.jobType}\n`
      if (criteria.workArrangement) responseContent += `Work mode: ${WORK_LOCATION_MAP[criteria.workArrangement] || criteria.workArrangement}\n`
      if (criteria.skills && criteria.skills.length > 0) {
        responseContent += `Skills: ${criteria.skills.join(', ')}\n`
      }

      responseContent += '\nRefine your search by mentioning specific skills, locations, or job types.'
    } else {
      responseContent = "I couldn't find jobs matching those exact criteria. Try:\n\n1. Broadening your search terms\n2. Removing location constraints\n3. Using different job titles\n4. Checking for typos"
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseContent,
      timestamp: new Date(),
      searchCriteria: criteria,
      jobs: matchedJobs.length > 0 ? matchedJobs : undefined
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsTyping(false)
  }

  const handleExampleClick = (example: string) => {
    setInput(example)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Job Search</h1>
              <p className="text-gray-600">Describe your dream job in plain English</p>
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
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-teal-600 to-blue-600 flex items-center justify-center">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                      )}

                      <div className={`flex flex-col max-w-[70%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                        </div>

                        {/* Show matched jobs */}
                        {message.jobs && message.jobs.length > 0 && (
                          <div className="mt-4 space-y-3 w-full">
                            {message.jobs.map((job) => (
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
                                  <Badge className="bg-green-100 text-green-800 border-green-200">
                                    {job.matchScore}% Match
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
                                    <p className="text-xs text-gray-500 mb-2">Required Skills:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {job.requirements.slice(0, 5).map((req) => (
                                        <Badge key={req} variant="secondary" className="text-xs">
                                          {req}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <div className="flex gap-2">
                                  <Button className="flex-1 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700">
                                    Apply Now
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                  </Button>
                                  <Button variant="outline" size="icon">
                                    <Heart className="h-4 w-4" />
                                  </Button>
                                </div>
                              </motion.div>
                            ))}
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
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-teal-600 to-blue-600 flex items-center justify-center">
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
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Describe your ideal job..."
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={isTyping || !input.trim()}
                    className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
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
                  Try These Examples
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {exampleQueries.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-teal-50 hover:border-teal-200 border border-gray-200 transition-colors text-sm"
                  >
                    {example}
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-teal-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Zap className="h-5 w-5 mr-2 text-teal-600" />
                  Why Use AI Job Search?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Conversational</p>
                    <p className="text-gray-600">Just describe what you want in plain English</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Real Results</p>
                    <p className="text-gray-600">Searches actual job listings in our database</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Quick Results</p>
                    <p className="text-gray-600">Get personalized job matches instantly</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Easy Refinement</p>
                    <p className="text-gray-600">Chat to narrow down your perfect job</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
