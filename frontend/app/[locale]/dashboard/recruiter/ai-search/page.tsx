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
  Calendar,
  ArrowRight,
  Lightbulb,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type SearchCriteria = {
  skills?: string[]
  universities?: string[]
  graduationYear?: string
  location?: string
  gpaMin?: number
  experienceLevel?: string
  softSkills?: string[]
  fieldOfStudy?: string[]
  languages?: string[]
  availability?: string
  verificationLevel?: string
  search?: string
}

type StudentProject = {
  id: string
  title: string
  technologies: string[]
  innovationScore: number | null
}

type APIStudent = {
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

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  searchCriteria?: SearchCriteria
  candidates?: APIStudent[]
  loading?: boolean
  error?: string
}

const exampleQueries = [
  "Find me Computer Science grads from Milan who speak English and Italian",
  "I need Data Science students from Politecnico di Milano, available immediately",
  "Looking for Engineering students with Python and ML, 100% verified profiles",
  "Show me Business Administration candidates who speak 3+ languages, remote work"
]

export default function AISearchPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI recruiting assistant. Tell me who you're looking for, and I'll find the perfect candidates for you. \n\nYou can describe your needs in plain English - mention skills, universities, experience level, location, soft skills, or anything else that matters to your company!",
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

  const parseQuery = (query: string): SearchCriteria => {
    // Simple AI-like parsing (in production, this would use real NLP/LLM)
    const criteria: SearchCriteria = {}
    const lowerQuery = query.toLowerCase()

    // Skills detection
    const skills = ['python', 'javascript', 'react', 'machine learning', 'ml', 'tensorflow', 'data science', 'java', 'aws', 'node.js', 'full-stack', 'frontend', 'backend', 'docker', 'kubernetes', 'analytics', 'marketing', 'strategy']
    criteria.skills = skills.filter(skill => lowerQuery.includes(skill))

    // Soft skills detection
    const softSkillsMap = ['leadership', 'communication', 'teamwork', 'collaboration', 'problem-solving', 'analytical', 'innovation', 'adaptability', 'creativity']
    criteria.softSkills = softSkillsMap.filter(skill => lowerQuery.includes(skill))

    // Field of Study detection
    const fields = ['engineering', 'computer science', 'data science', 'business', 'economics', 'mathematics', 'physics', 'design', 'law', 'medicine']
    criteria.fieldOfStudy = fields.filter(field => lowerQuery.includes(field))

    // Universities - Italian universities
    if (lowerQuery.includes('politecnico') || lowerQuery.includes('polimi')) {
      criteria.universities = ['Politecnico di Milano', 'Politecnico di Torino']
    }
    if (lowerQuery.includes('bologna')) criteria.universities = ['Universita di Bologna']
    if (lowerQuery.includes('sapienza') || lowerQuery.includes('roma')) criteria.universities = ['Sapienza Universita di Roma']
    if (lowerQuery.includes('top universit') || lowerQuery.includes('best universit')) {
      criteria.universities = ['Politecnico di Milano', 'Universita di Bologna', 'Sapienza Universita di Roma']
    }

    // Location - Italian cities
    if (lowerQuery.includes('milan') || lowerQuery.includes('milano')) criteria.location = 'Milan'
    if (lowerQuery.includes('rome') || lowerQuery.includes('roma')) criteria.location = 'Rome'
    if (lowerQuery.includes('bologna')) criteria.location = 'Bologna'
    if (lowerQuery.includes('turin') || lowerQuery.includes('torino')) criteria.location = 'Turin'
    if (lowerQuery.includes('florence') || lowerQuery.includes('firenze')) criteria.location = 'Florence'
    if (lowerQuery.includes('remote')) criteria.location = 'Remote'

    // Languages detection
    const languagesList = ['italian', 'italiano', 'english', 'inglese', 'spanish', 'spagnolo', 'french', 'francese', 'german', 'tedesco', 'chinese', 'cinese']
    criteria.languages = languagesList.filter(lang => lowerQuery.includes(lang))
    if (lowerQuery.includes('bilingual')) criteria.languages = ['Italian', 'English']
    if (lowerQuery.includes('multilingual') || lowerQuery.match(/\d+\+?\s*language/)) {
      criteria.languages = ['Italian', 'English', 'Spanish']
    }

    // Availability detection
    if (lowerQuery.includes('immediately') || lowerQuery.includes('asap')) criteria.availability = 'Available immediately'
    if (lowerQuery.includes('available now')) criteria.availability = 'Available'
    if (lowerQuery.includes('open to offers')) criteria.availability = 'Open to offers'

    // Verification level
    if (lowerQuery.includes('100%') || lowerQuery.includes('fully verified')) criteria.verificationLevel = '100'
    if (lowerQuery.includes('verified') || lowerQuery.includes('90%')) criteria.verificationLevel = '90+'

    // GPA
    const gpaMatch = lowerQuery.match(/(\d+\.\d+)\+?\s*gpa/)
    if (gpaMatch) criteria.gpaMin = parseFloat(gpaMatch[1])

    // Graduation year
    if (lowerQuery.includes('recent grad') || lowerQuery.includes('new grad')) {
      criteria.graduationYear = '2024'
    }
    if (lowerQuery.match(/202[4-7]/)) {
      criteria.graduationYear = lowerQuery.match(/202[4-7]/)?.[0]
    }

    // Experience level
    if (lowerQuery.includes('junior') || lowerQuery.includes('entry')) criteria.experienceLevel = 'entry'
    if (lowerQuery.includes('senior')) criteria.experienceLevel = 'senior'

    // Build general search term from the query for broader matching
    criteria.search = query.slice(0, 100)

    return criteria
  }

  const searchAPI = async (criteria: SearchCriteria): Promise<APIStudent[]> => {
    const params = new URLSearchParams()

    // Map parsed criteria to API query params
    if (criteria.search) params.set('search', criteria.search)
    if (criteria.universities && criteria.universities.length > 0) {
      params.set('university', criteria.universities[0])
    }
    if (criteria.skills && criteria.skills.length > 0) {
      params.set('skills', criteria.skills.join(','))
    }
    if (criteria.gpaMin) params.set('gpaMin', String(criteria.gpaMin))
    if (criteria.graduationYear) params.set('graduationYear', criteria.graduationYear)
    if (criteria.location) params.set('location', criteria.location)
    if (criteria.fieldOfStudy && criteria.fieldOfStudy.length > 0) {
      params.set('major', criteria.fieldOfStudy[0])
    }

    params.set('limit', '10')

    const res = await fetch(`/api/dashboard/recruiter/search/students?${params.toString()}`)
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.error || `Search failed (${res.status})`)
    }

    const data = await res.json()
    return data.students || []
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

    try {
      const criteria = parseQuery(input)
      const matchedCandidates = await searchAPI(criteria)

      let responseContent = ''
      if (matchedCandidates.length > 0) {
        responseContent = `Great! I found **${matchedCandidates.length} candidate${matchedCandidates.length > 1 ? 's' : ''}** matching your requirements:\n\n`

        if (criteria.fieldOfStudy && criteria.fieldOfStudy.length > 0) {
          responseContent += `Field: ${criteria.fieldOfStudy.join(', ')}\n`
        }
        if (criteria.skills && criteria.skills.length > 0) {
          responseContent += `Skills: ${criteria.skills.join(', ')}\n`
        }
        if (criteria.softSkills && criteria.softSkills.length > 0) {
          responseContent += `Soft Skills: ${criteria.softSkills.join(', ')}\n`
        }
        if (criteria.universities) {
          responseContent += `Universities: ${criteria.universities.join(', ')}\n`
        }
        if (criteria.location) {
          responseContent += `Location: ${criteria.location}\n`
        }
        if (criteria.languages && criteria.languages.length > 0) {
          responseContent += `Languages: ${criteria.languages.join(', ')}\n`
        }
        if (criteria.availability) {
          responseContent += `Availability: ${criteria.availability}\n`
        }
        if (criteria.gpaMin) {
          responseContent += `GPA: ${criteria.gpaMin}+\n`
        }

        responseContent += `\nYou can refine your search by asking me to:\n- Add field of study or language requirements\n- Filter by specific universities or cities\n- Focus on verification level or availability\n- Adjust GPA, soft skills, or technical skills`
      } else {
        responseContent = "I couldn't find any candidates matching those exact criteria. Would you like to:\n\n1. Broaden the search parameters?\n2. Try different skills or qualifications?\n3. Search across more universities?"
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        searchCriteria: criteria,
        candidates: matchedCandidates.length > 0 ? matchedCandidates : undefined
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I encountered an error while searching: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date(),
        error: err instanceof Error ? err.message : 'Unknown error'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleExampleClick = (example: string) => {
    setInput(example)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Candidate Search</h1>
              <p className="text-gray-600">Describe who you need in plain English</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-200px)] flex flex-col shadow-xl">
              {/* Messages */}
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
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                      )}

                      <div className={`flex flex-col max-w-[70%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                            : message.error
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                        </div>

                        {/* Show matched candidates */}
                        {message.candidates && message.candidates.length > 0 && (
                          <div className="mt-4 space-y-3 w-full">
                            {message.candidates.map((candidate) => (
                              <motion.div
                                key={candidate.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold">
                                      {candidate.initials}
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                                      <p className="text-sm text-gray-600">{candidate.university || 'University N/A'}</p>
                                    </div>
                                  </div>
                                  <Badge className="bg-green-100 text-green-800 border-green-200">
                                    <Star className="h-3 w-3 mr-1" />
                                    {candidate.projectCount} project{candidate.projectCount !== 1 ? 's' : ''}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                  <div className="flex items-center text-gray-600">
                                    <GraduationCap className="h-4 w-4 mr-2" />
                                    {candidate.degree || 'Degree N/A'}
                                  </div>
                                  {candidate.gpa !== null && (
                                    <div className="flex items-center text-gray-600">
                                      <Award className="h-4 w-4 mr-2" />
                                      GPA: {candidate.gpa}
                                    </div>
                                  )}
                                  <div className="flex items-center text-gray-600">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Class of {candidate.graduationYear || 'N/A'}
                                  </div>
                                  {candidate.tagline && (
                                    <div className="flex items-center text-gray-600">
                                      <MapPin className="h-4 w-4 mr-2" />
                                      {candidate.tagline}
                                    </div>
                                  )}
                                </div>

                                {candidate.topProjects.length > 0 && (
                                  <div className="mb-3">
                                    <p className="text-xs text-gray-500 mb-2">Top Projects:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {candidate.topProjects.slice(0, 3).map((project) => (
                                        <Badge key={project.id} variant="secondary" className="text-xs">
                                          {project.title}
                                          {project.innovationScore !== null && ` (${project.innovationScore}/10)`}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                  View Full Profile
                                  <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
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
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
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

              {/* Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Describe who you're looking for..."
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={isTyping || !input.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Example Queries */}
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
                    className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-gray-200 transition-colors text-sm"
                  >
                    {example}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Zap className="h-5 w-5 mr-2 text-blue-600" />
                  Why Use AI Search?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Natural Language</p>
                    <p className="text-gray-600">Describe requirements like talking to a person</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Real Database</p>
                    <p className="text-gray-600">Searches actual student profiles, not mock data</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Instant Results</p>
                    <p className="text-gray-600">Get matched candidates in seconds</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Refine Easily</p>
                    <p className="text-gray-600">Ask follow-up questions to narrow down</p>
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
