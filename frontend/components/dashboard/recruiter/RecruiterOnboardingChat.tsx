'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, X, Loader2, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Conversational recruiter onboarding — a focused, modal-style chatbot that
 * extracts the company profile + a first job draft, then commits both with
 * a single confirmation. Uses the same branded look as <ChatbotWidget /> but
 * a larger centered surface (this is THE primary task on first visit).
 *
 * Mounted by <RecruiterOnboardingGate> only when the recruiter has no
 * RecruiterSettings yet AND has not opted out of the onboarding flow.
 */

const ONBOARDING_DISMISSED_KEY = 'intransparency_onboarding_dismissed'

interface ExtractedJob {
  title?: string
  description?: string
  jobType?: string
  workLocation?: string
  location?: string
  requiredSkills?: string[]
  [k: string]: any
}

interface Extracted {
  companyName?: string
  companyIndustry?: string
  companySize?: string
  companyLocation?: string
  companyDescription?: string
  seekingType?: string
  job?: ExtractedJob
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface Props {
  /** Pre-detected company name from email-domain enrichment, if available. */
  seedCompanyName?: string
  /** Called when the recruiter dismisses the onboarding (skips). */
  onDismiss: () => void
}

export default function RecruiterOnboardingChat({ seedCompanyName, onDismiss }: Props) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [accumulated, setAccumulated] = useState<Extracted>({})
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCommitting, setIsCommitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initial greeting — segment-aware, mentions the seeded company name
  useEffect(() => {
    if (messages.length > 0) return
    const greeting = seedCompanyName
      ? `Ciao! 👋 Sono qui per impostare velocemente il profilo di **${seedCompanyName}** e una prima offerta. Puoi raccontarmi in 1-2 frasi cosa fa l'azienda? (Italiano o inglese, come preferisci.)`
      : `Ciao! 👋 Sono il tuo Hiring Advisor. In 3-4 messaggi impostiamo il profilo aziendale e una prima offerta da pubblicare. Iniziamo: di che azienda parliamo e cosa fa, in 1-2 frasi?`
    setMessages([{ id: '1', role: 'assistant', content: greeting }])
  }, [seedCompanyName, messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const sendTurn = useCallback(
    async (userText: string) => {
      const userMsg: Message = { id: Date.now().toString(), role: 'user', content: userText }
      const nextMessages = [...messages, userMsg]
      setMessages(nextMessages)
      setInput('')
      setIsLoading(true)
      setError(null)

      try {
        const res = await fetch('/api/ai/recruiter-onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
            accumulated,
            seedCompanyName,
          }),
        })
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.error || 'Onboarding turn failed')
        }
        const turn = await res.json()
        // Merge what we learned this turn
        setAccumulated(prev => ({
          ...prev,
          ...turn.extracted,
          job: { ...(prev.job || {}), ...(turn.extracted?.job || {}) },
        }))
        setMessages(prev => [
          ...prev,
          { id: (Date.now() + 1).toString(), role: 'assistant', content: turn.reply || '…' },
        ])
        if (turn.complete) setIsComplete(true)
      } catch (e: any) {
        setError(e.message || 'Something went wrong')
      } finally {
        setIsLoading(false)
      }
    },
    [messages, accumulated, seedCompanyName]
  )

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    sendTurn(input.trim())
  }

  const handleConfirmAndCommit = async () => {
    setIsCommitting(true)
    setError(null)
    try {
      const res = await fetch('/api/ai/recruiter-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: true, accumulated }),
      })
      const data = await res.json()
      if (!res.ok || !data.committed) {
        throw new Error(data.error || 'Could not save')
      }
      sessionStorage.setItem(ONBOARDING_DISMISSED_KEY, '1')
      router.push(data.redirectTo || '/dashboard/recruiter')
      router.refresh()
    } catch (e: any) {
      setError(e.message || 'Save failed')
      setIsCommitting(false)
    }
  }

  const handleSkip = () => {
    sessionStorage.setItem(ONBOARDING_DISMISSED_KEY, '1')
    onDismiss()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Live summary of what the AI has extracted so far
  const knowsCompany = !!accumulated.companyName
  const knowsJob = !!accumulated.job?.title

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-0 overflow-hidden rounded-2xl bg-white dark:bg-slate-900">
          {/* Branded header — matches chatbot company segment (blue/cyan) */}
          <CardHeader className="bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500 text-white p-5 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/10 blur-xl" />
            <div className="relative flex items-center gap-3">
              <div
                className="rounded-full bg-white flex items-center justify-center shrink-0"
                style={{
                  width: 52,
                  height: 52,
                  boxShadow: '0 0 0 3px rgba(255,255,255,0.5), 0 8px 24px -6px rgba(59,130,246,0.5)',
                }}
              >
                <Image
                  src="/logo.png"
                  alt="InTransparency"
                  width={44}
                  height={44}
                  className="rounded-full"
                  priority
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold">Hiring Advisor</h2>
                <p className="text-xs text-white/85 mt-0.5">
                  Set up your company + first job in 3-4 messages
                </p>
              </div>
              <button
                onClick={handleSkip}
                className="text-white/80 hover:text-white hover:bg-white/15 rounded-full p-1.5 transition-colors"
                title="Skip — fill it in manually"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Live progress strip */}
            <div className="relative mt-4 flex items-center gap-2 text-[11px]">
              <span
                className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                  knowsCompany ? 'bg-emerald-500/30 text-white' : 'bg-white/15 text-white/70'
                }`}
              >
                {knowsCompany && <CheckCircle2 className="h-3 w-3" />}
                Company {knowsCompany && `· ${accumulated.companyName}`}
              </span>
              <span
                className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                  knowsJob ? 'bg-emerald-500/30 text-white' : 'bg-white/15 text-white/70'
                }`}
              >
                {knowsJob && <CheckCircle2 className="h-3 w-3" />}
                Role {knowsJob && `· ${accumulated.job?.title}`}
              </span>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col p-0">
            {/* Message thread */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50 dark:bg-slate-950 max-h-[420px]">
              <AnimatePresence initial={false}>
                {messages.map(m => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.role === 'assistant' && (
                      <div
                        className="rounded-full bg-white flex items-center justify-center shrink-0"
                        style={{
                          width: 32,
                          height: 32,
                          boxShadow: '0 0 0 2px rgba(255,255,255,0.9), 0 4px 12px -2px rgba(59,130,246,0.4)',
                        }}
                      >
                        <Image
                          src="/logo.png"
                          alt="InTransparency"
                          width={26}
                          height={26}
                          className="rounded-full"
                        />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                        m.role === 'user'
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-br-sm'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-sm'
                      }`}
                    >
                      <p className="whitespace-pre-line">{m.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <div className="flex gap-2 items-center">
                  <div
                    className="rounded-full bg-white flex items-center justify-center"
                    style={{ width: 32, height: 32 }}
                  >
                    <Image src="/logo.png" alt="InTransparency" width={26} height={26} className="rounded-full" />
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1 items-center">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-blue-500"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-cyan-500"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-teal-500"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {error && (
              <div className="px-5 py-2 bg-rose-50 dark:bg-rose-950/40 border-t border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
                {error}
              </div>
            )}

            {/* Action area: confirm-and-commit when complete, otherwise text input */}
            {isComplete ? (
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-800 dark:text-slate-200">Ready to save.</strong> I'll set up your
                  company profile and create the role as a draft you can edit before publishing.
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleSkip}
                    disabled={isCommitting}
                    className="flex-1"
                  >
                    Skip for now
                  </Button>
                  <Button
                    onClick={handleConfirmAndCommit}
                    disabled={isCommitting}
                    className="flex-[2] bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-white shadow-md"
                  >
                    {isCommitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Save profile + open job draft
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="flex gap-2 items-center bg-slate-50 dark:bg-slate-800 rounded-full pr-1 pl-4 py-1 border border-slate-200 dark:border-slate-700 focus-within:border-blue-400 transition-colors">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Rispondi qui…"
                    className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 text-sm"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSend}
                    size="sm"
                    className="h-9 w-9 p-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 hover:opacity-90 shadow-md"
                    disabled={!input.trim() || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <button
                  onClick={handleSkip}
                  className="mt-2 w-full text-center text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  Skip — I'll fill it in manually from Settings
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
