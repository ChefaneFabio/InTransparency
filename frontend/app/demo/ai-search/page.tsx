'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Users,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Zap,
  DollarSign,
  Clock,
  Target,
  Shield
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type DemoType = 'student' | 'company' | 'university'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  results?: any[]
}

const exampleQueries = {
  student: [
    "Find me entry-level frontend developer jobs in Milan",
    "Remote data science internships with good mentorship",
    "Startup jobs in Rome with React and Node.js"
  ],
  company: [
    "Cybersecurity students from Politecnico with Network Security 30/30",
    "Data engineers with Python and Spark, 27+ GPA, Milan area",
    "Frontend developers with React and TypeScript, strong communication skills"
  ],
  university: [
    "Show me CS students with 3.8+ GPA who haven't been contacted yet",
    "Which students got hired at tech companies this month?",
    "Find tech companies hiring ML engineers in Milan"
  ]
}

const demoConfigs = {
  student: {
    title: 'AI Job Search Demo',
    subtitle: 'For Students',
    color: 'from-teal-600 to-blue-600',
    icon: GraduationCap,
    placeholder: 'Describe your ideal job...',
    initialMessage: "👋 Hi! I'm your AI job search assistant. Tell me what kind of job you're looking for in plain English!\n\nTry: \"Find me frontend developer jobs in Milan at startups\"",
    registrationLink: '/auth/register/student'
  },
  company: {
    title: 'AI Candidate Search Demo',
    subtitle: 'For Companies',
    color: 'from-blue-600 to-purple-600',
    icon: Building2,
    placeholder: 'Describe who you\'re looking for...',
    initialMessage: "👋 Hi! I'm your AI recruiting assistant. Describe the candidate you need in plain English!\n\nTry: \"Cybersecurity students Roma Network Security 30/30\"",
    registrationLink: '/auth/register/recruiter'
  },
  university: {
    title: 'AI Search Hub Demo',
    subtitle: 'For Universities',
    color: 'from-indigo-600 to-purple-600',
    icon: Users,
    placeholder: 'Search students or jobs...',
    initialMessage: "👋 Hi! I'm your university AI assistant. I can search BOTH students and job opportunities!\n\nTry: \"Show me CS students with 3.8+ GPA\" or \"Find tech companies hiring\"",
    registrationLink: '/auth/register/university'
  }
}

const mockResults = {
  studentJobs: [
    { id: '1', title: 'Frontend Developer', company: 'TechStartup', location: 'Milan, IT', salary: '€35,000 - €45,000', type: 'Full-time', match: 94 },
    { id: '2', title: 'Junior Software Engineer', company: 'InnovateCo', location: 'Remote', salary: '€30,000 - €40,000', type: 'Full-time', match: 89 }
  ],
  companyResults: [
    { id: '1', initials: 'M.R.', university: 'Politecnico di Milano', major: 'Cybersecurity', gpa: 30, skills: ['Network Security', 'Python', 'Cryptography'], softSkills: ['Problem-solving', 'Teamwork'], match: 96 },
    { id: '2', initials: 'S.B.', university: 'Sapienza Roma', major: 'Computer Science', gpa: 29, skills: ['Cybersecurity', 'Linux', 'Ethical Hacking'], softSkills: ['Leadership', 'Communication'], match: 92 }
  ],
  universityStudents: [
    { id: '1', name: 'Marco Rossi', major: 'Computer Science', gpa: 3.85, contacted: 2, hired: false },
    { id: '2', name: 'Sofia Bianchi', major: 'Data Science', gpa: 3.92, contacted: 8, hired: true, company: 'TechCorp' }
  ],
  universityJobs: [
    { id: '1', title: 'ML Engineer', company: 'TechCorp Italy', location: 'Milan', salary: '€45,000 - €60,000', matchedStudents: 12 },
    { id: '2', title: 'Data Analyst', company: 'DataCo', location: 'Rome', salary: '€35,000 - €45,000', matchedStudents: 8 }
  ]
}

export default function AISearchDemoPage() {
  const [activeDemo, setActiveDemo] = useState<DemoType>('student')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const config = demoConfigs[activeDemo]

  useEffect(() => {
    // Reset messages when demo type changes
    setMessages([{
      id: '1',
      role: 'assistant',
      content: config.initialMessage,
      timestamp: new Date()
    }])
  }, [activeDemo])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
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
      let results: any[] = []
      let responseContent = ''

      if (activeDemo === 'student') {
        results = mockResults.studentJobs
        responseContent = `Perfect! I found **${results.length} jobs** matching your search:\n\n💼 Frontend Developer at TechStartup - €35k-45k\n💼 Junior Software Engineer at InnovateCo - €30k-40k\n\n✨ Register free to apply and get more matches!`
      } else if (activeDemo === 'company') {
        results = mockResults.companyResults
        responseContent = `Great! I found **${results.length} verified candidates** matching your requirements:\n\n🎓 M.R. - Politecnico di Milano, Cybersecurity, 30/30 GPA\n🎓 S.B. - Sapienza Roma, Computer Science, 29/30 GPA\n\nBoth have Network Security skills + AI-analyzed soft skills.\n\n💡 Register to unlock contacts for €10 each!`
      } else {
        const isStudentQuery = input.toLowerCase().includes('student') || input.toLowerCase().includes('gpa')
        if (isStudentQuery) {
          results = mockResults.universityStudents
          responseContent = `📊 Found **${results.length} students** matching your criteria:\n\n👤 Marco Rossi - CS, 3.85 GPA, 2 contacts\n👤 Sofia Bianchi - Data Science, 3.92 GPA, hired at TechCorp\n\n✨ Register free to see full details!`
        } else {
          results = mockResults.universityJobs
          responseContent = `💼 Found **${results.length} job opportunities** for your students:\n\n🏢 ML Engineer at TechCorp - 12 students match\n🏢 Data Analyst at DataCo - 8 students match\n\n✨ Register free to connect students!`
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        results: results.slice(0, 2)
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleExampleClick = (example: string) => {
    setInput(example)
  }

  const Icon = config.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-blue-100/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  InTransparency
                </span>
                <Badge className="ml-2 bg-purple-100 text-purple-800 border-purple-300">DEMO</Badge>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Button variant="outline" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button className={`bg-gradient-to-r ${config.color}`} asChild>
                <Link href="/auth/register/role-selection">Register Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300 rounded-full px-6 py-2 mb-4">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span className="font-bold text-purple-900">Try AI Conversational Search - No Login Required</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Experience AI-Powered Search
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ask in plain English what you need. Our AI understands and finds exactly what you're looking for.
          </p>
        </div>

        {/* Demo Selector */}
        <Tabs value={activeDemo} onValueChange={(v) => setActiveDemo(v as DemoType)} className="mb-8">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
            <TabsTrigger value="student" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Student Demo
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Company Demo
            </TabsTrigger>
            <TabsTrigger value="university" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              University Demo
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader className={`bg-gradient-to-r ${config.color} text-white`}>
                <div className="flex items-center gap-3">
                  <Icon className="h-6 w-6" />
                  <div>
                    <CardTitle>{config.title}</CardTitle>
                    <p className="text-sm text-white/90">{config.subtitle}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="h-[500px] flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.role === 'assistant' && (
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r ${config.color} flex items-center justify-center`}>
                            <Bot className="h-5 w-5 text-white" />
                          </div>
                        )}

                        <div className={`flex flex-col max-w-[70%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className={`rounded-2xl px-4 py-3 ${
                            message.role === 'user'
                              ? `bg-gradient-to-r ${config.color} text-white`
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                          </div>

                          {/* Show preview results */}
                          {message.results && message.results.length > 0 && (
                            <div className="mt-3 space-y-2 w-full">
                              {message.results.map((result: any) => (
                                <div key={result.id} className="bg-white border border-gray-200 rounded-lg p-3 text-sm">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      {result.title && <p className="font-semibold text-gray-900">{result.title}</p>}
                                      {result.name && <p className="font-semibold text-gray-900">{result.name}</p>}
                                      {result.initials && (
                                        <div className="flex items-center gap-2">
                                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                                            {result.initials}
                                          </div>
                                          <span className="text-gray-600">Contact Locked</span>
                                        </div>
                                      )}
                                      <p className="text-gray-600 text-xs mt-1">
                                        {result.company && `${result.company} • `}
                                        {result.university && `${result.university} • `}
                                        {result.location}
                                        {result.major && ` • ${result.major}`}
                                      </p>
                                    </div>
                                    {result.match && (
                                      <Badge className="bg-green-100 text-green-800 text-xs">
                                        {result.match}% Match
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                              <Button className={`w-full bg-gradient-to-r ${config.color}`} size="sm" asChild>
                                <Link href={config.registrationLink}>
                                  Register Free to See All Results
                                  <ArrowRight className="h-3 w-3 ml-2" />
                                </Link>
                              </Button>
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
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r ${config.color} flex items-center justify-center`}>
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder={config.placeholder}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSend}
                      className={`bg-gradient-to-r ${config.color}`}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
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
                {exampleQueries[activeDemo].map((example, index) => (
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

            {/* CTA Card */}
            <Card className={`bg-gradient-to-br ${config.color.replace('from-', 'from-').replace('to-', 'to-')}/10 border-2`}>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Zap className="h-5 w-5 mr-2" />
                  Like What You See?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Access full search results</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Save searches and favorites</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      {activeDemo === 'student' && 'Apply to jobs and get discovered'}
                      {activeDemo === 'company' && 'Unlock contacts for €10 each'}
                      {activeDemo === 'university' && 'Track placements in real-time'}
                    </span>
                  </div>
                </div>

                <Button className={`w-full bg-gradient-to-r ${config.color}`} size="lg" asChild>
                  <Link href={config.registrationLink}>
                    Register Free Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>

                <p className="text-xs text-center text-gray-600">
                  {activeDemo === 'student' && 'Free forever • No credit card required'}
                  {activeDemo === 'company' && 'No subscriptions • Pay only for results'}
                  {activeDemo === 'university' && 'Always free • Pay only for customizations'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
