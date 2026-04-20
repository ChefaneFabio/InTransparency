'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bot, GraduationCap, Building2, School, Send, Shield, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

type ChatbotRole = 'student' | 'company' | 'institution'

const chatbotIcons = {
  student: GraduationCap,
  company: Building2,
  institution: School,
}

export default function ChatPage() {
  const t = useTranslations('chatPage')
  const [selectedRole, setSelectedRole] = useState<ChatbotRole>('student')

  const chatbotConfig: Record<ChatbotRole, { title: string; icon: typeof GraduationCap; color: string; greeting: string; examples: string[] }> = {
    student: {
      title: t('student.title'),
      icon: chatbotIcons.student,
      color: 'bg-primary',
      greeting: t('student.greeting'),
      examples: [
        t('student.example1'),
        t('student.example2'),
        t('student.example3'),
        t('student.example4'),
      ]
    },
    company: {
      title: t('company.title'),
      icon: chatbotIcons.company,
      color: 'bg-primary',
      greeting: t('company.greeting'),
      examples: [
        t('company.example1'),
        t('company.example2'),
        t('company.example3'),
        t('company.example4'),
      ]
    },
    institution: {
      title: t('institution.title'),
      icon: chatbotIcons.institution,
      color: 'bg-primary',
      greeting: t('institution.greeting'),
      examples: [
        t('institution.example1'),
        t('institution.example2'),
        t('institution.example3'),
        t('institution.example4'),
      ]
    }
  }

  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
    { role: 'assistant', content: chatbotConfig[selectedRole].greeting }
  ])
  const [inputMessage, setInputMessage] = useState('')

  const config = chatbotConfig[selectedRole]

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    // Add user message
    const userMessage = { role: 'user' as const, content: inputMessage }
    setMessages(prev => [...prev, userMessage])

    // Mock AI response (in production, this would call your API)
    setTimeout(() => {
      const mockResponse = generateMockResponse(inputMessage, selectedRole)
      setMessages(prev => [...prev, { role: 'assistant', content: mockResponse }])
    }, 500)

    setInputMessage('')
  }

  const handleExampleClick = (example: string) => {
    setInputMessage(example)
  }

  const handleRoleChange = (role: ChatbotRole) => {
    setSelectedRole(role)
    setMessages([{ role: 'assistant', content: chatbotConfig[role].greeting }])
    setInputMessage('')
  }

  return (
    <div className="min-h-screen hero-bg">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Bot className="h-12 w-12 text-primary" />
              <h1 className="text-5xl font-bold text-primary">
                {t('heroTitle')}
              </h1>
            </div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              {t('heroSubtitle')}
            </p>

            {/* Role Selector */}
            <div className="inline-flex bg-white rounded-full p-1.5 shadow-lg border border-gray-200">
              {(['student', 'company', 'institution'] as ChatbotRole[]).map((role) => {
                const Icon = chatbotConfig[role].icon
                return (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedRole === role
                        ? 'bg-primary text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {role === 'student' && t('roleStudent')}
                    {role === 'company' && t('roleCompany')}
                    {role === 'institution' && t('roleInstitution')}
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Chat Interface */}
          <div className="max-w-5xl mx-auto">
            <motion.div
              key={selectedRole}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-lg border-2 border-primary/20 overflow-hidden">
                {/* Chat Header */}
                <CardHeader className={`${config.color} text-white`}>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-full">
                      <config.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Transparenty - {config.title}</CardTitle>
                      <p className="text-white/90 text-sm mt-1">{t('poweredBy')}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  {/* Messages Area */}
                  <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gray-50">
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            message.role === 'user'
                              ? 'bg-primary text-white'
                              : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                          }`}
                        >
                          {message.role === 'assistant' && (
                            <div className="flex items-center gap-2 mb-2">
                              <Bot className="h-4 w-4 text-primary" />
                              <span className="font-semibold text-primary text-sm">Transparenty</span>
                            </div>
                          )}
                          <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Transparency Notice */}
                  <div className="bg-primary/5 border-t border-primary/20 p-4">
                    <div className="flex items-start gap-3 max-w-4xl mx-auto">
                      <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-gray-700">
                        <strong className="text-primary">{t('transparentAiLabel')}</strong> {t('transparentAiDesc')}
                      </div>
                    </div>
                  </div>

                  {/* Example Quick Actions */}
                  {messages.length === 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="p-6 bg-white border-t border-gray-200"
                    >
                      <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        {t('tryAsking')}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {config.examples.map((example, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            onClick={() => handleExampleClick(example)}
                            className="justify-start text-left h-auto py-2 hover:bg-primary/5 hover:border-primary/30"
                          >
                            <span className="text-xs">{example}</span>
                          </Button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Input Area */}
                  <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder={t('inputPlaceholder', { role: config.title.toLowerCase() })}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim()}
                        className="bg-primary text-white rounded-full px-6"
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid md:grid-cols-3 gap-6 mt-12"
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    {t('card1Title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm">
                    {t('card1Desc')}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    {t('card2Title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm">
                    {t('card2Desc')}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    {t('card3Title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm">
                    {t('card3Desc')}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

// Mock response generator (replace with actual API call in production)
function generateMockResponse(input: string, role: ChatbotRole): string {
  const lowerInput = input.toLowerCase()

  // Student responses
  if (role === 'student') {
    if (lowerInput.includes('profile') || lowerInput.includes('build')) {
      return `Great! Let's build an outstanding profile. Here's what I recommend:

1. **Add your best projects** - Include GitHub repos, design portfolios, or research papers
2. **Select relevant courses** - Choose courses that showcase your expertise
3. **Verify your skills** - I'll analyze your projects to validate your competencies
4. **Write a compelling bio** - Tell your story in 2-3 sentences

Want me to walk you through adding your first project?`
    }
    if (lowerInput.includes('job') || lowerInput.includes('find')) {
      return `I can help you discover perfect-fit opportunities! Based on verified profiles like yours, here's what works:

**Top matches for your profile:**
- Software Developer positions in Milan (89% match)
- Frontend roles requiring React/TypeScript (high match)

**What companies are asking for:**
- Excel + Power BI: 89 job posts require this combo
- Python: 127 job postings mention it
- Data visualization: 64 companies explicitly need this

**Company Feedback Example:** "Great profile! Add AWS certification and you're a perfect fit."

Would you like me to refine the search by location or skills?`
    }
    if (lowerInput.includes('skill') || lowerInput.includes('companies')) {
      return `Based on explicit company requirements and job postings, here are the most in-demand skills this month:

**Top 5 Skills (from company job postings):**
1. Python (127 job posts) - +23% from last month
2. Excel & Data Analysis (89 job posts)
3. React/TypeScript (78 job posts)
4. Figma/UI Design (64 job posts)
5. SQL databases (52 job posts)

**Sample Company Note:** "Looking for candidates with strong Python skills and ML experience. Your profile is 85% there - add a TensorFlow project!"

**Career Tip:** Adding verified projects with these skills increases your visibility by 3x!`
    }
    return `I'm here to help with profile building, job search, career advice, or skill trends. What would you like to explore?`
  }

  // Company responses
  if (role === 'company') {
    if (lowerInput.includes('find') || lowerInput.includes('cybersecurity') || lowerInput.includes('marketing')) {
      return `Perfect! Let me help you find the ideal candidate. Here's how our AI-powered search works:

**Search Strategy:**
1. Enter requirements (e.g., "cybersecurity student, Rome, graduation 2025")
2. AI analyzes verified portfolios and project work
3. Get transparent match scores with explanations

**Sample Results:**
- 23 cybersecurity students in Rome (high avg match)
- All with verified projects (penetration testing, network security)
- Explainable scores: "85% match - 3/4 required skills, strong portfolio"

Want to run a specific search?`
    }
    if (lowerInput.includes('match') || lowerInput.includes('explain') || lowerInput.includes('score')) {
      return `Great question! Match scores are 100% transparent. Here's how they work:

**Match Score Breakdown:**
- **Skills Match:** Does their verified work align with your requirements?
- **Project Quality:** Real work analyzed by AI, not self-reported
- **Availability:** Location, graduation date, work preferences
- **Cultural Fit:** Based on career goals and work style

**Example:**
"Sarah - High match"
- Python expert (3 verified projects)
- Located in Rome (your requirement)
- Graduates May 2025 (perfect timing)
⚠️ No experience with AWS (your nice-to-have)

This transparency builds trust and improves hiring decisions by 40%!`
    }
    return `I can help you source candidates, explain match scores, or craft better job descriptions. What would you like to do?`
  }

  // Institution responses
  if (role === 'institution') {
    if (lowerInput.includes('partnership') || lowerInput.includes('free') || lowerInput.includes('work')) {
      return `Excellent question! Here's how our free partnership works:

- **What You Do:**
- Share student data (courses, grades, basic info) - one-time setup
- Optional: Enable automatic profile creation via API

- **What We Do:**
- Create verified profiles for ALL students (not just top 5%)
- Handle all company outreach and matching
- Provide real-time analytics dashboard

**Cost:** Free for institutions, no hidden fees

**Your Benefits:**
- Better placement statistics
- Modern "AI-powered career services" image
- Company search intelligence
- Save 40+ hours/month

Ready to get started? I can walk you through the setup!`
    }
    if (lowerInput.includes('trend') || lowerInput.includes('company') || lowerInput.includes('search')) {
      return `Here's what companies are explicitly asking for from YOUR students:

**This Month's Company Requirements:**
- Deloitte left notes on 31 Economics profiles: "Need financial modeling + Excel"
- Tech startups posted 47 jobs requiring Python + ML → Tell CS students to showcase projects
- 12 companies explicitly need Marketing interns with Adobe Creative Suite

**Action Items from Company Feedback:**
1. **Hot Skills (from job posts):** Excel (89 posts), Python (127 posts), React (78 posts)
2. **Geographic Demand:** Milan (234 job openings), Rome (187), Bologna (94)
3. **At-Risk:** 87 seniors missing top 3 requested skills → Flag for intervention

**Sample Company Note:** "Great Economics program! Students need more SQL and Power BI exposure for our roles."

Want me to dig deeper into a specific program or skill?`
    }
    if (lowerInput.includes('at-risk') || lowerInput.includes('zero') || lowerInput.includes('help')) {
      return `Smart move on early intervention! Here's what I found:

🚨 **At-Risk Students (Missing Key Skills):**
- 87 seniors graduating in 3 months lacking top-requested skills
- 34 have incomplete profiles (missing projects)
- 53 have profiles but missing skills companies explicitly need

**Recommended Actions (based on company feedback):**
1. **Missing Projects (34 students):** Email template: "Add your thesis/capstone project before graduation!"
2. **Skill Gaps (53 students):** Companies need AWS/Python - run workshops!
3. **Company Note Example:** "Strong theoretical background, needs practical Excel/SQL projects"

Want me to generate outreach templates for each group?`
    }
    return `I can help with partnership setup, analytics, student interventions, or European job opportunities. What interests you?`
  }

  return "I'm not sure I understood that. Could you rephrase or try one of the example questions?"
}
