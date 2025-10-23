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
  Code,
  Brain,
  MessageSquare,
  Search,
  Filter,
  Users,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Zap
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  searchCriteria?: SearchCriteria
  candidates?: Candidate[]
}

type SearchCriteria = {
  skills?: string[]
  universities?: string[]
  graduationYear?: string
  location?: string
  gpaMin?: number
  experienceLevel?: string
  softSkills?: string[]
}

type Candidate = {
  id: string
  name: string
  initials: string
  university: string
  major: string
  gpa: number
  graduationYear: string
  location: string
  skills: string[]
  softSkills: string[]
  projectCount: number
  aiScore: number
  availability: string
}

const exampleQueries = [
  "Find me Python developers with ML experience from top universities",
  "I need a frontend engineer with React skills, recent grad from California",
  "Looking for data scientists with strong communication skills, 3.5+ GPA",
  "Show me candidates with leadership experience and full-stack skills"
]

const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Sarah Martinez',
    initials: 'S.M.',
    university: 'Stanford University',
    major: 'Computer Science',
    gpa: 3.85,
    graduationYear: '2024',
    location: 'San Francisco, CA',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'React'],
    softSkills: ['Leadership', 'Communication', 'Teamwork'],
    projectCount: 8,
    aiScore: 94,
    availability: 'Immediately'
  },
  {
    id: '2',
    name: 'Michael Chen',
    initials: 'M.C.',
    university: 'MIT',
    major: 'AI & Decision Making',
    gpa: 3.92,
    graduationYear: '2024',
    location: 'Boston, MA',
    skills: ['Python', 'Deep Learning', 'PyTorch', 'NLP'],
    softSkills: ['Problem-solving', 'Innovation', 'Collaboration'],
    projectCount: 12,
    aiScore: 97,
    availability: 'Immediately'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    initials: 'E.R.',
    university: 'Berkeley',
    major: 'Data Science',
    gpa: 3.78,
    graduationYear: '2025',
    location: 'Oakland, CA',
    skills: ['Python', 'R', 'Machine Learning', 'SQL'],
    softSkills: ['Analytical thinking', 'Communication', 'Presentation'],
    projectCount: 7,
    aiScore: 89,
    availability: 'June 2025'
  }
]

export default function AISearchPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm your AI recruiting assistant. Tell me who you're looking for, and I'll find the perfect candidates for you. \n\nYou can describe your needs in plain English - mention skills, universities, experience level, location, soft skills, or anything else that matters to your company!",
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
    const skills = ['python', 'javascript', 'react', 'machine learning', 'ml', 'tensorflow', 'data science', 'java', 'aws', 'node.js', 'full-stack', 'frontend', 'backend']
    criteria.skills = skills.filter(skill => lowerQuery.includes(skill))

    // Soft skills detection
    const softSkillsMap = ['leadership', 'communication', 'teamwork', 'collaboration', 'problem-solving', 'analytical', 'innovation']
    criteria.softSkills = softSkillsMap.filter(skill => lowerQuery.includes(skill))

    // Universities
    if (lowerQuery.includes('top universit') || lowerQuery.includes('ivy league')) {
      criteria.universities = ['MIT', 'Stanford', 'Harvard', 'Berkeley']
    }

    // Location
    if (lowerQuery.includes('california') || lowerQuery.includes('ca')) criteria.location = 'California'
    if (lowerQuery.includes('bay area') || lowerQuery.includes('san francisco')) criteria.location = 'San Francisco Bay Area'
    if (lowerQuery.includes('boston')) criteria.location = 'Boston'
    if (lowerQuery.includes('remote')) criteria.location = 'Remote'

    // GPA
    const gpaMatch = lowerQuery.match(/(\d+\.\d+)\+?\s*gpa/)
    if (gpaMatch) criteria.gpaMin = parseFloat(gpaMatch[1])

    // Graduation year
    if (lowerQuery.includes('recent grad') || lowerQuery.includes('new grad')) {
      criteria.graduationYear = '2024-2025'
    }
    if (lowerQuery.match(/202[4-5]/)) {
      criteria.graduationYear = lowerQuery.match(/202[4-5]/)?.[0]
    }

    // Experience level
    if (lowerQuery.includes('junior') || lowerQuery.includes('entry')) criteria.experienceLevel = 'entry'
    if (lowerQuery.includes('senior')) criteria.experienceLevel = 'senior'

    return criteria
  }

  const filterCandidates = (criteria: SearchCriteria): Candidate[] => {
    return mockCandidates.filter(candidate => {
      // Skills match
      if (criteria.skills && criteria.skills.length > 0) {
        const hasSkill = criteria.skills.some(skill =>
          candidate.skills.some(cs => cs.toLowerCase().includes(skill.toLowerCase()))
        )
        if (!hasSkill) return false
      }

      // Soft skills match
      if (criteria.softSkills && criteria.softSkills.length > 0) {
        const hasSoftSkill = criteria.softSkills.some(skill =>
          candidate.softSkills.some(css => css.toLowerCase().includes(skill.toLowerCase()))
        )
        if (!hasSoftSkill) return false
      }

      // University match
      if (criteria.universities && criteria.universities.length > 0) {
        const hasUniversity = criteria.universities.some(uni =>
          candidate.university.includes(uni)
        )
        if (!hasUniversity) return false
      }

      // Location match
      if (criteria.location && !candidate.location.includes(criteria.location)) {
        return false
      }

      // GPA filter
      if (criteria.gpaMin && candidate.gpa < criteria.gpaMin) {
        return false
      }

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

    // Simulate AI processing
    setTimeout(() => {
      const criteria = parseQuery(input)
      const matchedCandidates = filterCandidates(criteria)

      let responseContent = ''
      if (matchedCandidates.length > 0) {
        responseContent = `Great! I found **${matchedCandidates.length} candidate${matchedCandidates.length > 1 ? 's' : ''}** matching your requirements:\n\n`

        if (criteria.skills && criteria.skills.length > 0) {
          responseContent += `✅ Skills: ${criteria.skills.join(', ')}\n`
        }
        if (criteria.softSkills && criteria.softSkills.length > 0) {
          responseContent += `✅ Soft Skills: ${criteria.softSkills.join(', ')}\n`
        }
        if (criteria.universities) {
          responseContent += `✅ From top universities\n`
        }
        if (criteria.location) {
          responseContent += `✅ Location: ${criteria.location}\n`
        }
        if (criteria.gpaMin) {
          responseContent += `✅ GPA: ${criteria.gpaMin}+\n`
        }

        responseContent += `\n💡 You can refine your search by asking me to:\n- Add more requirements\n- Filter by specific universities\n- Focus on particular soft skills\n- Adjust GPA or graduation year`
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
      setIsTyping(false)
    }, 1500)
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
                                      <h3 className="font-semibold text-gray-900">Contact Locked</h3>
                                      <p className="text-sm text-gray-600">{candidate.university}</p>
                                    </div>
                                  </div>
                                  <Badge className="bg-green-100 text-green-800 border-green-200">
                                    <Star className="h-3 w-3 mr-1" />
                                    {candidate.aiScore}% Match
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                  <div className="flex items-center text-gray-600">
                                    <GraduationCap className="h-4 w-4 mr-2" />
                                    {candidate.major}
                                  </div>
                                  <div className="flex items-center text-gray-600">
                                    <Award className="h-4 w-4 mr-2" />
                                    GPA: {candidate.gpa}
                                  </div>
                                  <div className="flex items-center text-gray-600">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Class of {candidate.graduationYear}
                                  </div>
                                  <div className="flex items-center text-gray-600">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    {candidate.location}
                                  </div>
                                </div>

                                <div className="mb-3">
                                  <p className="text-xs text-gray-500 mb-2">Hard Skills:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {candidate.skills.slice(0, 4).map((skill) => (
                                      <Badge key={skill} variant="secondary" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div className="mb-3">
                                  <p className="text-xs text-gray-500 mb-2">Soft Skills:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {candidate.softSkills.slice(0, 3).map((skill) => (
                                      <Badge key={skill} className="text-xs bg-purple-100 text-purple-800 border-purple-200">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                  Unlock Contact for €10
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
                  />
                  <Button
                    onClick={handleSend}
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
                    <p className="font-semibold text-gray-900">Complete Profiles</p>
                    <p className="text-gray-600">Matches hard skills AND soft skills automatically</p>
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
