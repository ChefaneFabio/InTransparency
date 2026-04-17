'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Send, Loader2, Sparkles, FileText, DollarSign, Users,
  Scale, Lightbulb, MessageSquare, RefreshCw, Bot, User,
  Briefcase, Shield, Heart, ArrowRight
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { SimpleMarkdown } from '@/components/ui/simple-markdown'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_PROMPTS = [
  { icon: FileText, labelKey: 'prompts.writeJd', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' },
  { icon: DollarSign, labelKey: 'prompts.salaryBenchmark', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
  { icon: Users, labelKey: 'prompts.interviewQuestions', color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40' },
  { icon: Scale, labelKey: 'prompts.contractTypes', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
  { icon: Lightbulb, labelKey: 'prompts.employerBranding', color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40' },
  { icon: RefreshCw, labelKey: 'prompts.reduceTimeToHire', color: 'text-slate-600 bg-slate-50 dark:bg-slate-950/40' },
]

const TOPICS = [
  { icon: FileText, label: 'topics.jobDescriptions', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/40' },
  { icon: DollarSign, label: 'topics.salaryBenchmarks', color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/40' },
  { icon: Users, label: 'topics.interviewStrategy', color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/40' },
  { icon: MessageSquare, label: 'topics.candidateEval', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/40' },
  { icon: Heart, label: 'topics.employerBranding', color: 'text-rose-600', bg: 'bg-rose-100 dark:bg-rose-900/40' },
  { icon: Scale, label: 'topics.italianLaw', color: 'text-slate-600', bg: 'bg-slate-100 dark:bg-slate-900/40' },
]

export default function HiringAdvisorPage() {
  const t = useTranslations('hiringAdvisor')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
      textareaRef.current?.focus()
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
      <MetricHero gradient="dark">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 border border-white/10"
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">{t('title')}</h1>
            <p className="text-white/60 mt-1">{t('subtitle')}</p>
          </div>
        </div>
      </MetricHero>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Chat Area */}
        <GlassCard delay={0.1} hover={false} gradient="primary">
          <div className="flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Welcome state */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center py-8 space-y-8"
                >
                  <div>
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 border border-primary/10"
                    >
                      <Bot className="h-10 w-10 text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-bold">{t('welcomeTitle')}</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto leading-relaxed">{t('welcomeMessage')}</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 max-w-xl mx-auto">
                    {QUICK_PROMPTS.map((prompt, i) => (
                      <motion.button
                        key={prompt.labelKey}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                        onClick={() => sendMessage(t(prompt.labelKey))}
                        className="flex items-center gap-3 p-4 rounded-2xl border bg-white/50 dark:bg-slate-800/50 text-left text-sm hover:border-primary/40 hover:shadow-md transition-all group"
                      >
                        <div className={`p-2 rounded-xl ${prompt.color} transition-transform group-hover:scale-110`}>
                          <prompt.icon className="h-4 w-4" />
                        </div>
                        <span className="flex-1 font-medium">{t(prompt.labelKey)}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Messages */}
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20'
                        : 'bg-white/80 dark:bg-slate-800/80 border shadow-sm'
                    }`}>
                      {msg.role === 'assistant' ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_ul]:my-2 [&_li]:my-0.5">
                          <SimpleMarkdown content={msg.content} />
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      )}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-white/80 dark:bg-slate-800/80 border rounded-2xl px-5 py-4 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-2 h-2 rounded-full bg-primary/60" />
                      <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} className="w-2 h-2 rounded-full bg-primary/40" />
                      <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} className="w-2 h-2 rounded-full bg-primary/20" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="border-t bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-4 rounded-b-2xl">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t('placeholder')}
                    rows={1}
                    className="resize-none min-h-[48px] max-h-[120px] pr-4 rounded-xl border-muted-foreground/20 focus:border-primary/50 bg-white dark:bg-slate-800"
                  />
                </div>
                <Button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  size="icon"
                  className="h-[48px] w-[48px] rounded-xl shadow-lg shadow-primary/25 flex-shrink-0"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Sidebar */}
        <div className="space-y-4">
          <GlassCard delay={0.15} gradient="blue">
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-600" />
                <h3 className="font-semibold text-sm">{t('topics.title')}</h3>
              </div>
              <div className="space-y-1">
                {TOPICS.map((topic, i) => (
                  <motion.button
                    key={topic.label}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    onClick={() => { setInput(t(topic.label)); textareaRef.current?.focus() }}
                    className="flex items-center gap-2.5 w-full p-2.5 rounded-xl text-sm hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all text-left group"
                  >
                    <div className={`p-1.5 rounded-lg ${topic.bg} transition-transform group-hover:scale-110`}>
                      <topic.icon className={`h-3.5 w-3.5 ${topic.color}`} />
                    </div>
                    <span className="font-medium">{t(topic.label)}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard delay={0.2} gradient="amber">
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-600" />
                <h3 className="font-semibold text-sm">{t('tips.title')}</h3>
              </div>
              <ul className="text-xs text-muted-foreground space-y-2.5">
                {['tip1', 'tip2', 'tip3'].map((tip, i) => (
                  <motion.li
                    key={tip}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <span>{t(`tips.${tip}`)}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </GlassCard>

          {messages.length > 0 && (
            <GlassCard delay={0.25}>
              <div className="p-5">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setMessages([])}
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-2" />
                  {t('topics.title') === 'I can help with' ? 'New conversation' : 'Nuova conversazione'}
                </Button>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  )
}
