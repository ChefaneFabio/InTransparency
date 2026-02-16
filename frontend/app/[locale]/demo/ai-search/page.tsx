'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Sparkles,
  Send,
  User,
  Bot,
  GraduationCap,
  MapPin,
  Building2,
  Users,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Zap,
  DollarSign,
  Clock,
  Map as MapIcon,
  List,
  SlidersHorizontal
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { GoogleMapComponent, MapMarker } from '@/components/maps/GoogleMapComponent'

type DemoType = 'student' | 'company' | 'university'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  results?: any[]
}

export default function AISearchDemoPage() {
  const t = useTranslations('aiSearchDemo')
  const [activeDemo, setActiveDemo] = useState<DemoType>('student')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 42.5, lng: 12.5 }) // Center of Italy
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  const demoConfigs = {
    student: {
      title: t('demoConfigs.student.title'),
      subtitle: t('demoConfigs.student.subtitle'),
      color: 'from-primary to-secondary',
      icon: GraduationCap,
      placeholder: t('demoConfigs.student.placeholder'),
      initialMessage: t('demoConfigs.student.initialMessage'),
      registrationLink: '/auth/register/student'
    },
    company: {
      title: t('demoConfigs.company.title'),
      subtitle: t('demoConfigs.company.subtitle'),
      color: 'from-primary to-secondary',
      icon: Building2,
      placeholder: t('demoConfigs.company.placeholder'),
      initialMessage: t('demoConfigs.company.initialMessage'),
      registrationLink: '/auth/register/recruiter'
    },
    university: {
      title: t('demoConfigs.university.title'),
      subtitle: t('demoConfigs.university.subtitle'),
      color: 'from-primary to-secondary',
      icon: Users,
      placeholder: t('demoConfigs.university.placeholder'),
      initialMessage: t('demoConfigs.university.initialMessage'),
      registrationLink: '/auth/register/university'
    }
  }

  const exampleQueries = {
    student: t.raw('exampleQueries.student') as string[],
    company: t.raw('exampleQueries.company') as string[],
    university: t.raw('exampleQueries.university') as string[]
  }

  const config = demoConfigs[activeDemo]

  useEffect(() => {
    // Reset messages and session when demo type changes
    setSessionId(null)
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

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/public/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: currentInput, type: activeDemo, sessionId }),
      })

      if (response.status === 429) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'You\'ve reached the demo query limit. Please try again later or register for unlimited access!',
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, assistantMessage])
        return
      }

      if (!response.ok) throw new Error('Search failed')

      const data = await response.json()
      if (data.sessionId) setSessionId(data.sessionId)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        results: data.results,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const getCurrentResults = () => {
    const lastMessage = messages[messages.length - 1]
    return lastMessage?.results || []
  }

  const handleExampleClick = (example: string) => {
    setInput(example)
  }

  const Icon = config.icon

  return (
    <div className="min-h-screen hero-bg">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        {/* Hero Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border-2 border-primary/30 rounded-full px-6 py-2 mb-4 shadow-sm">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">{t('banner.badge')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            {t('banner.title')}{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('banner.titleHighlight')}
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            {t('banner.description')}
          </p>

          {/* Alternative Search Banner */}
          <div className="max-w-2xl mx-auto mt-6">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-primary/20 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <SlidersHorizontal className="h-6 w-6 text-primary" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">{t('banner.alternativeTitle')}</p>
                      <p className="text-sm text-gray-600">{t('banner.alternativeDescription')}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-primary/30 hover:bg-primary/10 hover:text-primary" asChild>
                    <Link href="/demo/advanced-search">
                      {t('banner.alternativeButton')}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Demo Selector */}
        <Tabs value={activeDemo} onValueChange={(v) => setActiveDemo(v as DemoType)} className="mb-6">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
            <TabsTrigger value="student" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              {t('tabs.student')}
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {t('tabs.company')}
            </TabsTrigger>
            <TabsTrigger value="university" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('tabs.university')}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* View Toggle */}
        {getCurrentResults().length > 0 && (
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center bg-white border-2 border-gray-200 rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  viewMode === 'list'
                    ? `bg-gradient-to-r ${config.color} text-white shadow-sm`
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <List className="h-4 w-4" />
                <span className="font-medium">{t('viewToggle.chatView')}</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  viewMode === 'map'
                    ? `bg-gradient-to-r ${config.color} text-white shadow-sm`
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MapIcon className="h-4 w-4" />
                <span className="font-medium">{t('viewToggle.mapView')}</span>
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          {viewMode === 'list' && (
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
                              {message.results.slice(0, 3).map((result: any) => (
                                <div key={result.id} className="bg-white border border-gray-200 rounded-lg p-3 text-sm">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      {result.title && (
                                        <div>
                                          <p className="font-semibold text-gray-900">{result.title}</p>
                                          {result.type === 'Internship' && result.validForDegree && (
                                            <Badge className="bg-purple-100 text-purple-800 text-xs mt-1">
                                              {t('results.validForDegree')}
                                            </Badge>
                                          )}
                                        </div>
                                      )}
                                      {result.name && <p className="font-semibold text-gray-900">{result.name}</p>}
                                      {result.initials && (
                                        <div className="flex items-center gap-2">
                                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-xs">
                                            {result.initials}
                                          </div>
                                          <span className="text-gray-600">{t('results.contactLocked')}</span>
                                        </div>
                                      )}
                                      <p className="text-gray-600 text-xs mt-1">
                                        {result.company && `${result.company} • `}
                                        {result.university && `${result.university} • `}
                                        {result.location}
                                        {result.major && ` • ${result.major}`}
                                        {result.salary && ` • ${result.salary}`}
                                        {result.type && ` • ${result.type}`}
                                      </p>
                                      {result.skills && result.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {result.skills.slice(0, 3).map((skill: string) => (
                                            <Badge key={skill} variant="secondary" className="text-xs px-1.5 py-0">
                                              {skill}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    {result.match && (
                                      <Badge className="bg-green-100 text-green-800 text-xs">
                                        {t('results.match', { score: result.match })}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                              <Button className={`w-full bg-gradient-to-r ${config.color}`} size="sm" asChild>
                                <Link href={config.registrationLink}>
                                  {t('ui.registerToSeeAll')}
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
          )}

          {/* Map View */}
          {viewMode === 'map' && (
            <div className="lg:col-span-2">
              <Card className="shadow-xl">
                <CardHeader className={`bg-gradient-to-r ${config.color} text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-6 w-6" />
                      <div>
                        <CardTitle>{t('ui.geographicView')}</CardTitle>
                        <p className="text-sm text-white/90">
                          {t('ui.resultsOnMap', { count: getCurrentResults().length })}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4 mr-2" />
                      {t('ui.backToChat')}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="h-[600px] relative">
                    {apiKey ? (
                      <GoogleMapComponent
                        apiKey={apiKey}
                        center={mapCenter}
                        zoom={7}
                        className="h-full w-full"
                      >
                        {getCurrentResults().map((result: any) => {
                          if (!result.coordinates) return null

                          const isStudent = activeDemo === 'student' || (activeDemo === 'university' && result.name)
                          const isCandidate = activeDemo === 'company'
                          const isJob = result.title && (activeDemo === 'student' || activeDemo === 'university')

                          let markerColor = '#3B82F6' // default blue
                          if (isStudent || isCandidate) markerColor = '#10B981' // green for students/candidates
                          if (isJob) markerColor = '#8B5CF6' // purple for jobs

                          return (
                            <MapMarker
                              key={result.id}
                              position={result.coordinates}
                              title={result.title || result.name || result.initials}
                              icon={
                                window.google?.maps?.SymbolPath
                                  ? {
                                      path: window.google.maps.SymbolPath.CIRCLE,
                                      scale: 12,
                                      fillColor: markerColor,
                                      fillOpacity: 0.9,
                                      strokeColor: '#ffffff',
                                      strokeWeight: 3,
                                    }
                                  : undefined
                              }
                              onClick={() => setSelectedMarker(result.id)}
                              zIndex={selectedMarker === result.id ? 1000 : 1}
                            />
                          )
                        })}
                      </GoogleMapComponent>
                    ) : (
                      <div className="h-full flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">Google Maps API key not configured</p>
                        </div>
                      </div>
                    )}

                    {/* Selected Marker Info Overlay */}
                    {selectedMarker && (
                      <div className="absolute bottom-4 left-4 right-4 max-w-md">
                        <Card className="shadow-2xl">
                          <CardContent className="p-4">
                            {(() => {
                              const selected = getCurrentResults().find((r: any) => r.id === selectedMarker)
                              if (!selected) return null

                              if (selected.title) {
                                // Job or Internship result
                                const isInternship = selected.type === 'Internship'
                                return (
                                  <div>
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <h3 className="font-bold text-lg">{selected.title}</h3>
                                        <p className="text-gray-600">{selected.company}</p>
                                        {isInternship && selected.validForDegree && (
                                          <Badge className="bg-purple-100 text-purple-800 mt-1 text-xs">
                                            {t('results.validForUniversityDegree')}
                                          </Badge>
                                        )}
                                      </div>
                                      <button
                                        onClick={() => setSelectedMarker(null)}
                                        className="text-gray-500 hover:text-gray-700"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                    <div className="space-y-1 text-sm">
                                      <p className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        {selected.location}
                                      </p>
                                      {selected.salary && (
                                      <p className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4" />
                                        {selected.salary}
                                      </p>
                                      )}
                                      {selected.duration && (
                                        <p className="flex items-center gap-2">
                                          <Clock className="h-4 w-4" />
                                          {selected.duration}
                                        </p>
                                      )}
                                      {selected.type && (
                                        <Badge className="bg-blue-100 text-blue-800 mt-2">
                                          {selected.type}
                                        </Badge>
                                      )}
                                      {selected.match && (
                                        <Badge className="bg-green-100 text-green-800 mt-2">
                                          {t('results.match', { score: selected.match })}
                                        </Badge>
                                      )}
                                      {selected.matchedStudents && (
                                        <Badge className="bg-blue-100 text-blue-800 mt-2">
                                          {t('results.studentsMatch', { count: selected.matchedStudents })}
                                        </Badge>
                                      )}
                                    </div>
                                    <Button className={`w-full mt-3 bg-gradient-to-r ${config.color}`} size="sm" asChild>
                                      <Link href={config.registrationLink}>
                                        {isInternship ? t('results.applyForStage') : t('results.registerToApply')}
                                      </Link>
                                    </Button>
                                  </div>
                                )
                              } else if (selected.initials) {
                                // Candidate result
                                return (
                                  <div>
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
                                          {selected.initials}
                                        </div>
                                        <div>
                                          <p className="font-bold">{t('results.contactLocked')}</p>
                                          <p className="text-sm text-gray-600">{selected.university}</p>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => setSelectedMarker(null)}
                                        className="text-gray-500 hover:text-gray-700"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                      {selected.major && <p><strong>{t('mapInfo.major')}:</strong> {selected.major}</p>}
                                      {selected.gpa != null && <p><strong>{t('mapInfo.gpa')}:</strong> {selected.gpa}/30</p>}
                                      {selected.skills && selected.skills.length > 0 && <p><strong>{t('mapInfo.skills')}:</strong> {selected.skills.slice(0, 3).join(', ')}</p>}
                                      {selected.match && (
                                      <Badge className="bg-green-100 text-green-800 mt-2">
                                        {t('results.match', { score: selected.match })}
                                      </Badge>
                                      )}
                                    </div>
                                    <Button className={`w-full mt-3 bg-gradient-to-r ${config.color}`} size="sm" asChild>
                                      <Link href={config.registrationLink}>{t('results.unlockContact')}</Link>
                                    </Button>
                                  </div>
                                )
                              } else {
                                // Student result
                                return (
                                  <div>
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <h3 className="font-bold text-lg">{selected.name}</h3>
                                        <p className="text-gray-600">{selected.major}</p>
                                      </div>
                                      <button
                                        onClick={() => setSelectedMarker(null)}
                                        className="text-gray-500 hover:text-gray-700"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                    <div className="space-y-1 text-sm">
                                      <p><strong>{t('mapInfo.gpa')}:</strong> {selected.gpa}/4.0</p>
                                      <p><strong>{t('mapInfo.contacted')}:</strong> {selected.contacted} {t('mapInfo.times')}</p>
                                      {selected.hired && (
                                        <Badge className="bg-green-100 text-green-800 mt-2">
                                          {t('results.hiredAt', { company: selected.company })}
                                        </Badge>
                                      )}
                                    </div>
                                    <Button className={`w-full mt-3 bg-gradient-to-r ${config.color}`} size="sm" asChild>
                                      <Link href={config.registrationLink}>{t('results.viewFullProfile')}</Link>
                                    </Button>
                                  </div>
                                )
                              }
                            })()}
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Example Queries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                  {t('ui.exampleQueriesTitle')}
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
                  {t('ui.likeWhatYouSee')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{t('features.accessFullResults')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{t('features.saveSearches')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>
                      {activeDemo === 'student' && t('features.studentFeature')}
                      {activeDemo === 'company' && t('features.companyFeature')}
                      {activeDemo === 'university' && t('features.universityFeature')}
                    </span>
                  </div>
                </div>

                <Button className={`w-full bg-gradient-to-r ${config.color}`} size="lg" asChild>
                  <Link href={config.registrationLink}>
                    {t('ui.registerFree')}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>

                <p className="text-xs text-center text-gray-600">
                  {activeDemo === 'student' && t('pricing.studentTagline')}
                  {activeDemo === 'company' && t('pricing.companyTagline')}
                  {activeDemo === 'university' && t('pricing.universityTagline')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
