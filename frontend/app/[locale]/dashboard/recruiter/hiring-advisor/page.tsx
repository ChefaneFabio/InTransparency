'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Send, Loader2, Sparkles, FileText, DollarSign, Users,
  Scale, Lightbulb, MessageSquare, RefreshCw
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import ReactMarkdown from 'react-markdown'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_PROMPTS = [
  { icon: FileText, labelKey: 'prompts.writeJd' },
  { icon: DollarSign, labelKey: 'prompts.salaryBenchmark' },
  { icon: Users, labelKey: 'prompts.interviewQuestions' },
  { icon: Scale, labelKey: 'prompts.contractTypes' },
  { icon: Lightbulb, labelKey: 'prompts.employerBranding' },
  { icon: RefreshCw, labelKey: 'prompts.reduceTimeToHire' },
]

export default function HiringAdvisorPage() {
  const t = useTranslations('hiringAdvisor')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: Message = { role: 'user', content: text.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/dashboard/recruiter/hiring-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      const data = await res.json()
      if (res.ok && data.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: t('error') }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: t('error') }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="min-h-screen space-y-6">
      <MetricHero gradient="primary">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-white/20">
            <Sparkles className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
            <p className="text-muted-foreground">{t('subtitle')}</p>
          </div>
        </div>
      </MetricHero>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Chat Area */}
        <GlassCard delay={0.1} hover={false}>
          <div className="flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12 space-y-6">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{t('welcomeTitle')}</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">{t('welcomeMessage')}</p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 max-w-lg mx-auto">
                    {QUICK_PROMPTS.map((prompt) => (
                      <button
                        key={prompt.labelKey}
                        onClick={() => sendMessage(t(prompt.labelKey))}
                        className="flex items-center gap-2 p-3 rounded-xl border text-left text-sm hover:bg-primary/5 hover:border-primary/30 transition-colors"
                      >
                        <prompt.icon className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{t(prompt.labelKey)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted/50 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">{t('thinking')}</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('placeholder')}
                  rows={1}
                  className="resize-none min-h-[44px] max-h-[120px]"
                />
                <Button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  size="icon"
                  className="h-[44px] w-[44px] flex-shrink-0"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Sidebar — Topics */}
        <div className="space-y-4">
          <GlassCard delay={0.15}>
            <div className="p-5">
              <h3 className="font-semibold text-sm mb-3">{t('topics.title')}</h3>
              <div className="space-y-2">
                {[
                  { icon: FileText, label: t('topics.jobDescriptions'), color: 'text-blue-600' },
                  { icon: DollarSign, label: t('topics.salaryBenchmarks'), color: 'text-emerald-600' },
                  { icon: Users, label: t('topics.interviewStrategy'), color: 'text-purple-600' },
                  { icon: MessageSquare, label: t('topics.candidateEval'), color: 'text-amber-600' },
                  { icon: Lightbulb, label: t('topics.employerBranding'), color: 'text-rose-600' },
                  { icon: Scale, label: t('topics.italianLaw'), color: 'text-slate-600' },
                ].map(topic => (
                  <button
                    key={topic.label}
                    onClick={() => setInput(topic.label)}
                    className="flex items-center gap-2 w-full p-2 rounded-lg text-sm hover:bg-muted/50 transition-colors text-left"
                  >
                    <topic.icon className={`h-4 w-4 ${topic.color} flex-shrink-0`} />
                    <span>{topic.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard delay={0.2}>
            <div className="p-5">
              <h3 className="font-semibold text-sm mb-2">{t('tips.title')}</h3>
              <ul className="text-xs text-muted-foreground space-y-1.5">
                <li>{t('tips.tip1')}</li>
                <li>{t('tips.tip2')}</li>
                <li>{t('tips.tip3')}</li>
              </ul>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
