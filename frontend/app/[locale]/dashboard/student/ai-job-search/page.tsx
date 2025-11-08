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
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Building2,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Zap,
  Clock,
  Users,
  Target,
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
  industry?: string
  companyCulture?: string[]
  contractType?: string
  workArrangement?: string
}

const exampleQueries = [
  "Find me software engineering internships in Milan with flexible hours",
  "I want remote frontend developer roles with good work-life balance",
  "Looking for data science jobs in Rome with learning opportunities",
  "Show me consulting positions in Bologna, full-time with competitive salary"
]

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Junior Software Engineer',
    company: 'Intesa Sanpaolo',
    location: 'Milan, Italy',
    salary: '€35,000 - €45,000',
    jobType: 'Full-time',
    postedDate: '2 days ago',
    applicants: 45,
    matchScore: 94,
    description: "We're looking for a passionate junior engineer to join our digital innovation team...",
    requirements: ['Python', 'React', 'Problem-solving', 'Team collaboration'],
    benefits: ['Health insurance', 'Meal vouchers', 'Flexible hours', 'Smart working'],
    industry: 'Finance',
    companyCulture: ['Innovation', 'Work-life balance'],
    contractType: 'Permanent',
    workArrangement: 'Hybrid'
  },
  {
    id: '2',
    title: 'Frontend Developer Intern',
    company: 'Bending Spoons',
    location: 'Milan, Italy',
    salary: '€1,200/month',
    jobType: 'Internship',
    postedDate: '1 week ago',
    applicants: 28,
    matchScore: 89,
    description: 'Stage curriculare per sviluppatori frontend con passione per le app...',
    requirements: ['React', 'TypeScript', 'CSS', 'Communication'],
    benefits: ['Mentorship', 'Learning budget', 'Flexible schedule', 'Free lunch'],
    industry: 'Technology',
    companyCulture: ['Startup culture', 'Innovation', 'Fast-paced'],
    contractType: 'Stage',
    workArrangement: 'Hybrid'
  },
  {
    id: '3',
    title: 'Data Science Associate',
    company: 'UniCredit',
    location: 'Rome, Italy',
    salary: '€32,000 - €42,000',
    jobType: 'Full-time',
    postedDate: '3 days ago',
    applicants: 67,
    matchScore: 92,
    description: 'Join our data science team to work on cutting-edge ML projects in banking...',
    requirements: ['Python', 'Machine Learning', 'SQL', 'Analytics'],
    benefits: ['Pension plan', 'Health insurance', 'Learning stipend', 'Smart working'],
    industry: 'Finance',
    companyCulture: ['Work-life balance', 'Professional growth'],
    contractType: 'Permanent',
    workArrangement: 'Hybrid'
  },
  {
    id: '4',
    title: 'Business Consultant',
    company: 'McKinsey & Company',
    location: 'Bologna, Italy',
    salary: '€45,000 - €55,000',
    jobType: 'Full-time',
    postedDate: '5 days ago',
    applicants: 82,
    matchScore: 88,
    description: 'Join our Italian consulting team working with Fortune 500 clients...',
    requirements: ['Strategy', 'Analytics', 'Communication', 'Problem-solving'],
    benefits: ['Travel opportunities', 'Learning budget', 'Health insurance', 'Performance bonus'],
    industry: 'Consulting',
    companyCulture: ['Fast-paced', 'Learning culture', 'Global exposure'],
    contractType: 'Permanent',
    workArrangement: 'Office'
  },
  {
    id: '5',
    title: 'Full Stack Developer',
    company: 'Spotify',
    location: 'Remote',
    salary: '€40,000 - €50,000',
    jobType: 'Full-time',
    postedDate: '1 day ago',
    applicants: 156,
    matchScore: 96,
    description: 'Remote opportunity for full stack developers passionate about music tech...',
    requirements: ['JavaScript', 'Node.js', 'React', 'Python', 'AWS'],
    benefits: ['Remote work', 'Flexible hours', 'Learning budget', 'Premium Spotify', 'Wellness program'],
    industry: 'Technology',
    companyCulture: ['Innovation', 'Work-life balance', 'Creativity'],
    contractType: 'Permanent',
    workArrangement: 'Remote'
  },
  {
    id: '6',
    title: 'UX/UI Designer Intern',
    company: 'Luxottica',
    location: 'Turin, Italy',
    salary: '€900/month',
    jobType: 'Internship',
    postedDate: '4 days ago',
    applicants: 34,
    matchScore: 85,
    description: 'Stage in UX/UI design for our e-commerce and retail innovation team...',
    requirements: ['Figma', 'User research', 'Prototyping', 'Communication'],
    benefits: ['Mentorship', 'Product discounts', 'Flexible hours', 'Learning opportunities'],
    industry: 'Retail',
    companyCulture: ['Innovation', 'Design-focused', 'Global brand'],
    contractType: 'Stage',
    workArrangement: 'Hybrid'
  }
]

export default function AIJobSearchPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm your AI job search assistant. Tell me what kind of job you're looking for, and I'll find perfect matches for you!\n\nYou can mention:\n- Job title or role (software engineer, consultant, designer)\n- Location (Milan, Rome, Bologna, Turin, or remote)\n- Skills you want to use (Python, React, Figma, etc.)\n- Industries (finance, tech, consulting, retail)\n- Benefits (flexible hours, learning budget, smart working)\n- Company culture (work-life balance, innovation, startup)\n- Contract type (permanent, stage, internship)\n- Salary expectations",
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

    // Location - Italian cities
    if (lowerQuery.includes('remote') || lowerQuery.includes('remoto')) criteria.location = 'Remote'
    if (lowerQuery.includes('milan') || lowerQuery.includes('milano')) criteria.location = 'Milan'
    if (lowerQuery.includes('rome') || lowerQuery.includes('roma')) criteria.location = 'Rome'
    if (lowerQuery.includes('bologna')) criteria.location = 'Bologna'
    if (lowerQuery.includes('turin') || lowerQuery.includes('torino')) criteria.location = 'Turin'
    if (lowerQuery.includes('florence') || lowerQuery.includes('firenze')) criteria.location = 'Florence'

    // Job type
    if (lowerQuery.includes('internship') || lowerQuery.includes('intern') || lowerQuery.includes('stage')) criteria.jobType = 'Internship'
    if (lowerQuery.includes('full-time') || lowerQuery.includes('full time') || lowerQuery.includes('tempo pieno')) criteria.jobType = 'Full-time'
    if (lowerQuery.includes('part-time') || lowerQuery.includes('part time')) criteria.jobType = 'Part-time'

    // Experience level
    if (lowerQuery.includes('entry') || lowerQuery.includes('junior') || lowerQuery.includes('new grad')) {
      criteria.experienceLevel = 'Entry Level'
    }

    // Industries
    const industries = ['finance', 'finanza', 'tech', 'technology', 'consulting', 'consulenza', 'retail', 'healthcare', 'education']
    criteria.industries = industries.filter(ind => lowerQuery.includes(ind))

    // Benefits
    const benefitsList = [
      'flexible hours', 'flexible', 'orario flessibile',
      'remote work', 'smart working', 'lavoro remoto',
      'learning', 'formazione', 'learning budget',
      'health insurance', 'assicurazione',
      'meal vouchers', 'buoni pasto'
    ]
    criteria.benefits = benefitsList.filter(benefit => lowerQuery.includes(benefit))

    // Company culture
    const cultureTags = [
      'work-life balance', 'work life balance', 'equilibrio',
      'innovation', 'innovazione', 'innovative',
      'startup culture', 'startup',
      'fast-paced', 'dinamico',
      'learning culture', 'cultura apprendimento'
    ]
    criteria.companyCulture = cultureTags.filter(culture => lowerQuery.includes(culture))

    // Contract type
    if (lowerQuery.includes('permanent') || lowerQuery.includes('indeterminato') || lowerQuery.includes('tempo indeterminato')) {
      criteria.contractType = 'Permanent'
    }
    if (lowerQuery.includes('stage') || lowerQuery.includes('tirocinio')) {
      criteria.contractType = 'Stage'
    }

    // Work arrangement
    if (lowerQuery.includes('hybrid') || lowerQuery.includes('ibrido')) criteria.workArrangement = 'Hybrid'
    if (lowerQuery.includes('remote') || lowerQuery.includes('remoto')) criteria.workArrangement = 'Remote'
    if (lowerQuery.includes('office') || lowerQuery.includes('ufficio') || lowerQuery.includes('in presenza')) criteria.workArrangement = 'Office'

    // Company size
    if (lowerQuery.includes('startup')) criteria.companySize = 'Startup'
    if (lowerQuery.includes('big tech') || lowerQuery.includes('large company') || lowerQuery.includes('grande azienda')) criteria.companySize = 'Large Enterprise'

    // Salary
    const salaryMatch = lowerQuery.match(/€?\s*(\d+)[k,]/)
    if (salaryMatch) {
      criteria.salaryMin = parseInt(salaryMatch[1]) * 1000
    }

    return criteria
  }

  const filterJobs = (criteria: JobSearchCriteria): Job[] => {
    return mockJobs.filter(job => {
      // Role match
      if (criteria.role && !job.title.toLowerCase().includes(criteria.role.toLowerCase().split(' ')[0])) {
        return false
      }

      // Skills match
      if (criteria.skills && criteria.skills.length > 0) {
        const hasSkill = criteria.skills.some(skill =>
          job.requirements.some(req => req.toLowerCase().includes(skill.toLowerCase()))
        )
        if (!hasSkill) return false
      }

      // Location match
      if (criteria.location && !job.location.includes(criteria.location)) {
        return false
      }

      // Job type match
      if (criteria.jobType && job.jobType !== criteria.jobType) {
        return false
      }

      // Industry match
      if (criteria.industries && criteria.industries.length > 0) {
        const hasIndustry = criteria.industries.some(ind =>
          job.industry?.toLowerCase().includes(ind.toLowerCase())
        )
        if (!hasIndustry) return false
      }

      // Benefits match
      if (criteria.benefits && criteria.benefits.length > 0) {
        const hasBenefit = criteria.benefits.some(benefit =>
          job.benefits.some(jb => jb.toLowerCase().includes(benefit.toLowerCase()))
        )
        if (!hasBenefit) return false
      }

      // Company culture match
      if (criteria.companyCulture && criteria.companyCulture.length > 0) {
        const hasCulture = criteria.companyCulture.some(culture =>
          job.companyCulture?.some(jc => jc.toLowerCase().includes(culture.toLowerCase()))
        )
        if (!hasCulture) return false
      }

      // Contract type match
      if (criteria.contractType && job.contractType !== criteria.contractType) {
        return false
      }

      // Work arrangement match
      if (criteria.workArrangement && job.workArrangement !== criteria.workArrangement) {
        return false
      }

      // Salary match
      if (criteria.salaryMin) {
        const salaryNumbers = job.salary.match(/€(\d+,?\d*)/g)
        if (salaryNumbers) {
          const minSalary = parseInt(salaryNumbers[0].replace(/[€,]/g, ''))
          if (minSalary < criteria.salaryMin) return false
        }
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

    setTimeout(() => {
      const criteria = parseQuery(input)
      const matchedJobs = filterJobs(criteria)

      let responseContent = ''
      if (matchedJobs.length > 0) {
        responseContent = `Perfect! I found **${matchedJobs.length} job${matchedJobs.length > 1 ? 's' : ''}** matching your requirements:\n\n`

        if (criteria.role) responseContent += `✅ Role: ${criteria.role}\n`
        if (criteria.location) responseContent += `✅ Location: ${criteria.location}\n`
        if (criteria.jobType) responseContent += `✅ Type: ${criteria.jobType}\n`
        if (criteria.skills && criteria.skills.length > 0) {
          responseContent += `✅ Skills: ${criteria.skills.join(', ')}\n`
        }
        if (criteria.industries && criteria.industries.length > 0) {
          responseContent += `✅ Industries: ${criteria.industries.join(', ')}\n`
        }
        if (criteria.benefits && criteria.benefits.length > 0) {
          responseContent += `✅ Benefits: ${criteria.benefits.join(', ')}\n`
        }
        if (criteria.companyCulture && criteria.companyCulture.length > 0) {
          responseContent += `✅ Culture: ${criteria.companyCulture.join(', ')}\n`
        }
        if (criteria.contractType) {
          responseContent += `✅ Contract: ${criteria.contractType}\n`
        }
        if (criteria.workArrangement) {
          responseContent += `✅ Work Mode: ${criteria.workArrangement}\n`
        }
        if (criteria.salaryMin) {
          responseContent += `✅ Salary: €${criteria.salaryMin.toLocaleString()}+\n`
        }

        responseContent += `\n💡 Tip: Refine by asking about:\n- Specific companies or industries\n- Benefits (flexible hours, learning budget, remote work)\n- Company culture (work-life balance, innovation, startup)\n- Italian cities (Milan, Rome, Bologna, Turin)`
      } else {
        responseContent = "I couldn't find jobs matching those exact criteria. Would you like to:\n\n1. Expand to nearby locations?\n2. Consider related job titles?\n3. Look at different job types (full-time, internship, stage)?\n4. Broaden industry or company culture preferences?"
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
    }, 1500)
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

                                <div className="mb-3">
                                  <p className="text-xs text-gray-500 mb-2">Required Skills:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {job.requirements.map((req) => (
                                      <Badge key={req} variant="secondary" className="text-xs">
                                        {req}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div className="mb-3">
                                  <p className="text-xs text-gray-500 mb-2">Benefits:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {job.benefits.slice(0, 3).map((benefit) => (
                                      <Badge key={benefit} className="text-xs bg-teal-100 text-teal-800 border-teal-200">
                                        {benefit}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

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
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Describe your ideal job..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSend}
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
                    <p className="font-semibold text-gray-900">Smart Matching</p>
                    <p className="text-gray-600">AI finds jobs that fit your skills and preferences</p>
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
