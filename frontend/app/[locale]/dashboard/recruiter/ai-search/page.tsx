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
  fieldOfStudy?: string[]
  languages?: string[]
  availability?: string
  verificationLevel?: string
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
  fieldOfStudy?: string
  languages?: string[]
  verificationScore?: number
}

const exampleQueries = [
  "Find me Computer Science grads from Milan who speak English and Italian",
  "I need Data Science students from Politecnico di Milano, available immediately",
  "Looking for Engineering students with Python and ML, 100% verified profiles",
  "Show me Business Administration candidates who speak 3+ languages, remote work"
]

const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Marco Rossi',
    initials: 'M.R.',
    university: 'Politecnico di Milano',
    major: 'Computer Science',
    gpa: 3.85,
    graduationYear: '2024',
    location: 'Milan, Italy',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'React'],
    softSkills: ['Leadership', 'Communication', 'Teamwork'],
    projectCount: 8,
    aiScore: 94,
    availability: 'Available immediately',
    fieldOfStudy: 'Engineering',
    languages: ['Italian', 'English', 'Spanish'],
    verificationScore: 100
  },
  {
    id: '2',
    name: 'Sofia Bianchi',
    initials: 'S.B.',
    university: 'Università di Bologna',
    major: 'Data Science',
    gpa: 3.92,
    graduationYear: '2024',
    location: 'Bologna, Italy',
    skills: ['Python', 'Deep Learning', 'PyTorch', 'NLP'],
    softSkills: ['Problem-solving', 'Innovation', 'Collaboration'],
    projectCount: 12,
    aiScore: 97,
    availability: 'Available immediately',
    fieldOfStudy: 'Data Science',
    languages: ['Italian', 'English', 'French'],
    verificationScore: 100
  },
  {
    id: '3',
    name: 'Giulia Ferrari',
    initials: 'G.F.',
    university: 'Sapienza Università di Roma',
    major: 'Business Administration',
    gpa: 3.78,
    graduationYear: '2025',
    location: 'Rome, Italy',
    skills: ['Marketing', 'Strategy', 'Analytics', 'Excel'],
    softSkills: ['Analytical thinking', 'Communication', 'Presentation'],
    projectCount: 7,
    aiScore: 89,
    availability: 'Open to offers',
    fieldOfStudy: 'Business Administration',
    languages: ['Italian', 'English', 'German', 'Chinese'],
    verificationScore: 95
  },
  {
    id: '4',
    name: 'Alessandro Conti',
    initials: 'A.C.',
    university: 'Politecnico di Torino',
    major: 'Engineering',
    gpa: 3.88,
    graduationYear: '2024',
    location: 'Remote',
    skills: ['Python', 'Java', 'AWS', 'Docker'],
    softSkills: ['Adaptability', 'Problem-solving', 'Teamwork'],
    projectCount: 10,
    aiScore: 92,
    availability: 'Available',
    fieldOfStudy: 'Engineering',
    languages: ['Italian', 'English'],
    verificationScore: 100
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
    if (lowerQuery.includes('bologna')) criteria.universities = ['Università di Bologna']
    if (lowerQuery.includes('sapienza') || lowerQuery.includes('roma')) criteria.universities = ['Sapienza Università di Roma']
    if (lowerQuery.includes('top universit') || lowerQuery.includes('best universit')) {
      criteria.universities = ['Politecnico di Milano', 'Università di Bologna', 'Sapienza Università di Roma']
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
      criteria.graduationYear = '2024-2025'
    }
    if (lowerQuery.match(/202[4-7]/)) {
      criteria.graduationYear = lowerQuery.match(/202[4-7]/)?.[0]
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

      // Field of study match
      if (criteria.fieldOfStudy && criteria.fieldOfStudy.length > 0) {
        const hasField = criteria.fieldOfStudy.some(field =>
          candidate.fieldOfStudy?.toLowerCase().includes(field.toLowerCase()) ||
          candidate.major.toLowerCase().includes(field.toLowerCase())
        )
        if (!hasField) return false
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

      // Languages match
      if (criteria.languages && criteria.languages.length > 0) {
        const hasLanguage = criteria.languages.some(lang =>
          candidate.languages?.some(cl => cl.toLowerCase().includes(lang.toLowerCase()))
        )
        if (!hasLanguage) return false
      }

      // Availability match
      if (criteria.availability && !candidate.availability.toLowerCase().includes(criteria.availability.toLowerCase())) {
        return false
      }

      // Verification level
      if (criteria.verificationLevel) {
        if (criteria.verificationLevel === '100' && candidate.verificationScore !== 100) return false
        if (criteria.verificationLevel === '90+' && (candidate.verificationScore || 0) < 90) return false
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

        if (criteria.fieldOfStudy && criteria.fieldOfStudy.length > 0) {
          responseContent += `✅ Field: ${criteria.fieldOfStudy.join(', ')}\n`
        }
        if (criteria.skills && criteria.skills.length > 0) {
          responseContent += `✅ Skills: ${criteria.skills.join(', ')}\n`
        }
        if (criteria.softSkills && criteria.softSkills.length > 0) {
          responseContent += `✅ Soft Skills: ${criteria.softSkills.join(', ')}\n`
        }
        if (criteria.universities) {
          responseContent += `✅ Universities: ${criteria.universities.join(', ')}\n`
        }
        if (criteria.location) {
          responseContent += `✅ Location: ${criteria.location}\n`
        }
        if (criteria.languages && criteria.languages.length > 0) {
          responseContent += `✅ Languages: ${criteria.languages.join(', ')}\n`
        }
        if (criteria.availability) {
          responseContent += `✅ Availability: ${criteria.availability}\n`
        }
        if (criteria.verificationLevel) {
          responseContent += `✅ Verification: ${criteria.verificationLevel}% verified\n`
        }
        if (criteria.gpaMin) {
          responseContent += `✅ GPA: ${criteria.gpaMin}+\n`
        }

        responseContent += `\n💡 You can refine your search by asking me to:\n- Add field of study or language requirements\n- Filter by specific Italian universities or cities\n- Focus on verification level or availability\n- Adjust GPA, soft skills, or technical skills`
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
