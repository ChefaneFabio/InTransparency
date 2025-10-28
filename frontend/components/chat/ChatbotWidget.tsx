'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  MessageSquare,
  Send,
  X,
  Minimize2,
  Sparkles,
  Shield,
  Bot,
  User
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export type ChatbotRole = 'student' | 'company' | 'institution'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatbotWidgetProps {
  userRole: ChatbotRole
  userName?: string
  isOpen?: boolean
  onClose?: () => void
}

const chatbotConfig = {
  student: {
    title: 'Career Assistant',
    greeting: "👋 Hi! I'm Transparenty, your AI career assistant. I can help you:\n\n• Build your profile from projects\n• Find jobs matching your skills\n• Get career advice\n• Understand what companies are looking for\n\nWhat would you like to do?",
    color: 'from-primary to-secondary',
    badge: 'Student Assistant',
    examples: [
      "Help me build my profile",
      "Find jobs in Milan",
      "What skills are companies searching for?",
      "Career advice for Computer Science"
    ]
  },
  company: {
    title: 'Recruiting Assistant',
    greeting: "👋 Hi! I'm Transparenty, your AI recruiting assistant. I can help you:\n\n• Find verified candidates (all disciplines)\n• Understand match explanations\n• Get sourcing tips\n• See skill demand trends\n\nHow can I assist your search?",
    color: 'from-primary to-secondary',
    badge: 'Recruiting Assistant',
    examples: [
      "Find cybersecurity students in Rome",
      "Marketing intern with creative portfolio",
      "Explain match scores",
      "What makes a good job description?"
    ]
  },
  institution: {
    title: 'Partnership Assistant',
    greeting: "👋 Hi! I'm Transparenty, your institutional assistant. I can help you:\n\n• Set up free partnership\n• Understand dashboard analytics\n• Get early intervention alerts\n• Explore European job opportunities\n\nWhat would you like to know?",
    color: 'from-primary to-secondary',
    badge: 'Institution Assistant',
    examples: [
      "How does the free partnership work?",
      "Show me company search trends",
      "Help with at-risk students",
      "European job opportunities"
    ]
  }
}

export function ChatbotWidget({ userRole, userName, isOpen: initialIsOpen = false, onClose }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(initialIsOpen)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const config = chatbotConfig[userRole]

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      const greeting: Message = {
        id: '1',
        role: 'assistant',
        content: config.greeting,
        timestamp: new Date()
      }
      setMessages([greeting])
    }
  }, [isOpen, config.greeting, messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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

    // Simulate AI response (in production, this would call your API)
    setTimeout(() => {
      const response = generateResponse(input, userRole)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000)
  }

  const handleExampleClick = (example: string) => {
    setInput(example)
  }

  const handleToggle = () => {
    if (isOpen && onClose) {
      onClose()
    }
    setIsOpen(!isOpen)
  }

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={handleToggle}
          size="lg"
          className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-secondary hover:shadow-2xl shadow-lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-6 right-6 z-50 ${isMinimized ? 'w-80' : 'w-96'} max-h-[600px] flex flex-col`}
    >
      <Card className="shadow-2xl border-2 border-primary/20 flex flex-col h-full">
        {/* Header */}
        <CardHeader className={`bg-gradient-to-r ${config.color} text-white p-4 flex-shrink-0`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">{config.title}</CardTitle>
                <Badge className="bg-white/20 text-white border-0 text-xs mt-1">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {config.badge}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggle}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {/* Transparency Notice */}
              <div className="bg-white border border-primary/20 rounded-lg p-3 text-xs text-gray-700">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-primary">Transparent AI:</strong> This conversation helps refine your experience. Data is GDPR-compliant and used to improve matches. You can opt out anytime.
                  </div>
                </div>
              </div>

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-primary to-secondary text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            {/* Example Questions */}
            {messages.length <= 1 && (
              <div className="p-4 bg-white border-t">
                <p className="text-xs text-gray-600 mb-2">Quick actions:</p>
                <div className="flex flex-wrap gap-2">
                  {config.examples.map((example, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => handleExampleClick(example)}
                      className="text-xs"
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white border-t flex-shrink-0">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  className="bg-gradient-to-r from-primary to-secondary"
                  disabled={!input.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </motion.div>
  )
}

// Mock response generator (in production, this would call your AI API)
function generateResponse(input: string, role: ChatbotRole): string {
  const lowerInput = input.toLowerCase()

  // Student responses
  if (role === 'student') {
    if (lowerInput.includes('profile') || lowerInput.includes('build')) {
      return "Great! Let's build your profile. I'll need to know:\n\n1. What projects have you worked on? (thesis, code, designs, etc.)\n2. What's your major and university?\n3. What type of work are you looking for?\n\nTell me about your most recent project - what did you build and what skills did you use?"
    }
    if (lowerInput.includes('job') || lowerInput.includes('milan') || lowerInput.includes('rome')) {
      return "I can help you find jobs! Based on your profile, I found:\n\n• **Frontend Developer** at TechStartup, Milan (€35-45K) - 94% match\n• **Stage Curriculare** at Microsoft Italia, Milan (€800/mo) - 96% match\n\nThese match your skills in [Python, React]. Want to see why these are good matches?"
    }
    if (lowerInput.includes('skill') || lowerInput.includes('trend') || lowerInput.includes('companies')) {
      return "Great question! Based on company searches:\n\n📈 **Top Skills in Demand:**\n• Python - searched 127 times this month\n• Excel + PowerBI - 89 searches\n• AutoCAD - 76 searches\n• React - 54 searches\n\nFor your field (Computer Science), companies are especially looking for: Machine Learning, Cloud Computing, and Docker.\n\nWant tips on how to showcase these skills?"
    }
    if (lowerInput.includes('advice') || lowerInput.includes('career') || lowerInput.includes('help')) {
      return "I'd love to give you career advice! What field are you in?\n\n• Computer Science / Tech\n• Business / Economics\n• Engineering\n• Law\n• Design / Creative\n• Other\n\nOr tell me what you're struggling with and I'll provide specific guidance."
    }
  }

  // Company responses
  if (role === 'company') {
    if (lowerInput.includes('cybersecurity') || lowerInput.includes('security') || lowerInput.includes('rome')) {
      return "Found **4 verified candidates** matching your search:\n\n👤 **M.R.** - Politecnico Milano, Cybersecurity, 30/30 GPA\n   Skills: Network Security, Python, Cryptography\n   Projects: ML Model, Capstone Project\n   **96% match** - €10 to unlock\n\n👤 **S.B.** - Sapienza Roma, Computer Science, 29/30\n   Skills: Cybersecurity, Linux, Ethical Hacking\n   Projects: Web App, Thesis\n   **92% match** - €10 to unlock\n\nWant to see why these candidates match your requirements?"
    }
    if (lowerInput.includes('marketing') || lowerInput.includes('creative') || lowerInput.includes('portfolio')) {
      return "Searching for marketing talent with creative portfolios...\n\nI found **6 candidates** across Business and Design:\n\n📊 **C.R.** - Università di Firenze, Marketing\n   Skills: Digital Marketing, SEO, Social Media\n   Projects: Market Research, Social Impact\n   **90% match**\n\nThese candidates have **verified portfolios** you can preview. Browse free, pay €10 only to contact.\n\nWant filtering tips to narrow down?"
    }
    if (lowerInput.includes('match') || lowerInput.includes('explain') || lowerInput.includes('why')) {
      return "**Match Explanation (Transparent AI):**\n\nWhen we show a 92% match, here's what it means:\n\n✅ **Skills Alignment (40 points):**\n   Your requirement: Python, Network Security\n   Candidate: Python (verified via web app), Network Security (30/30 grade)\n\n✅ **Project Relevance (30 points):**\n   Your need: Experience with security projects\n   Candidate: Capstone on cryptography\n\n✅ **Soft Skills (20 points):**\n   Your preference: Problem-solving, teamwork\n   Candidate: Both detected in group projects\n\n✅ **Location/Availability (10 points):**\n   Match: Both seeking Milan area\n\n**Total: 92/100 = 92% match**\n\nThis is why we're different - no black boxes!"
    }
    if (lowerInput.includes('job') || lowerInput.includes('description') || lowerInput.includes('write')) {
      return "Great question! Here's how to write transparent job descriptions that attract 25% more qualified candidates:\n\n**1. Be Specific About Skills:**\n   ❌ \"Proficient in programming\"\n   ✅ \"Python + React for web development\"\n\n**2. Show Real Requirements:**\n   ❌ \"Junior Analyst needed\"\n   ✅ \"Excel modeling + PowerBI visualization for market research\"\n\n**3. Include Soft Skills:**\n   ✅ \"Teamwork from group projects\"\n   ✅ \"Communication for client presentations\"\n\n**4. Be Honest About Level:**\n   ✅ \"Stage curriculare (6 months, €800/mo)\"\n   ✅ \"Entry-level (0-1 year experience)\"\n\nWant me to review your job post?"
    }
  }

  // Institution responses
  if (role === 'institution') {
    if (lowerInput.includes('partnership') || lowerInput.includes('free') || lowerInput.includes('work')) {
      return "**Free Partnership - How It Works:**\n\n✅ **Zero Cost Forever** (vs AlmaLaurea €2,500/year)\n   No setup fees, no monthly costs\n\n✅ **Automatic Profile Creation**\n   Integrate with Esse3/Moodle\n   Students get instant verified profiles\n\n✅ **What You Get:**\n   • Real-time placement dashboard\n   • Company search intelligence (\"Deloitte viewed 31 students\")\n   • Early intervention alerts (\"87 seniors with zero views\")\n   • European job opportunities search\n   • Save 40+ hours/month on manual matching\n\n✅ **Optional Add-Ons** (custom pricing):\n   • API integrations\n   • White-label branding\n   • Custom analytics\n\nWant to set up a demo?"
    }
    if (lowerInput.includes('trend') || lowerInput.includes('companies') || lowerInput.includes('search')) {
      return "**Company Search Intelligence - This Month:**\n\n📊 **Top Companies Viewing Your Students:**\n1. Deloitte - 31 Economics students\n2. Microsoft Italia - 18 Computer Science students\n3. Leonardo SpA - 12 Engineering students\n\n📈 **Most-Searched Skills:**\n1. Excel + PowerBI - 89 searches\n2. Python - 67 searches\n3. AutoCAD - 54 searches\n4. Contract Law - 43 searches\n\n🎯 **Actionable Insights:**\n• **Warm Lead:** Deloitte is active - time for outreach!\n• **Curriculum:** Add data visualization to Economics courses\n• **Career Advice:** Tell Engineering students to showcase CAD portfolios\n\nWant detailed reports by department?"
    }
    if (lowerInput.includes('at-risk') || lowerInput.includes('intervention') || lowerInput.includes('students')) {
      return "**Early Intervention Alert - At-Risk Students:**\n\n⚠️ **Graduating Soon, Zero Visibility:**\n• 87 seniors graduating in 60 days\n• Zero company views\n• Profiles incomplete or missing projects\n\n**Suggested Actions:**\n1. **Contact students** - \"Add your thesis project!\"\n2. **Profile audit** - Check for missing skills/courses\n3. **Workshop** - \"How to showcase your work\"\n4. **1-on-1 support** - Career center consultations\n\n**Success Story:**\nPolitecnico Milano intervened with 45 at-risk students:\n• 38 improved profiles within 2 weeks\n• 23 got company views\n• 11 secured interviews\n\nWant a list of your at-risk students?"
    }
    if (lowerInput.includes('european') || lowerInput.includes('job') || lowerInput.includes('opportunities')) {
      return "**European Job Opportunities for Your Students:**\n\n🌍 **Current Openings (18,934 total):**\n\n**Germany:**\n• SAP Berlin - Software Engineer (€50-65K)\n• BMW Munich - Data Analyst (€48-60K)\n\n**France:**\n• Criteo Paris - ML Engineer (€50-70K)\n• BlaBlaCar Paris - Full Stack Dev (€42-55K)\n\n**Netherlands:**\n• Booking.com Amsterdam - Backend Dev (€55-70K)\n\n**Spain:**\n• Glovo Barcelona - UX Designer (€35-45K)\n\n**UK:**\n• Revolut London - DevOps (£50-65K)\n\nYou can search by:\n• Location (18 European cities)\n• Job type (Full-time, Internship, Remote)\n• Salary range\n• Field (STEM, Business, etc.)\n\nWant to filter for specific programs?"
    }
  }

  // Default response
  return "That's a great question! I'm here to help with:\n\n• Profile building and optimization\n• Job/candidate matching\n• Career/recruiting advice\n• Platform features and transparency\n\nCould you tell me more about what you're looking for? Or ask me something specific!"
}
