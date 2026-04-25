'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Send,
  X,
  Minimize2,
  Sparkles,
  Shield,
  User,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { chatApi, ChatUserRole } from '@/lib/api'
import { useTranslations } from 'next-intl'

export type ChatbotRole = 'student' | 'company' | 'institution'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  intent?: string
  isStreaming?: boolean
}

interface SuggestedAction {
  label: string
  action: string
}

interface ChatbotWidgetProps {
  userRole: ChatbotRole
  userName?: string
  userId?: string
  isOpen?: boolean
  onClose?: () => void
  enableStreaming?: boolean
}

const chatbotApiRoles: Record<ChatbotRole, ChatUserRole> = {
  student: 'student',
  company: 'recruiter',
  institution: 'institution',
}

// ── Segment theming — matches PremiumBadge so users recognize the audience ──
const SEGMENT_THEME: Record<
  ChatbotRole,
  {
    /** Header gradient. */
    headerGradient: string
    /** Launcher button gradient. */
    launcherGradient: string
    /** Halo color around assistant avatar (rgba). */
    haloRgba: string
    /** Primary accent for chips, links, status dot. */
    accent: string
    /** User-bubble gradient. */
    userBubbleGradient: string
    /** Quick-action chip hover ring. */
    ringHover: string
    /** Vibe label shown under the title. */
    vibeLabel: string
  }
> = {
  student: {
    headerGradient: 'from-violet-600 via-purple-600 to-fuchsia-600',
    launcherGradient: 'from-violet-500 to-fuchsia-600',
    haloRgba: 'rgba(139, 92, 246, 0.45)',
    accent: 'text-violet-600 dark:text-violet-300',
    userBubbleGradient: 'from-violet-500 to-purple-600',
    ringHover: 'hover:border-violet-400 hover:bg-violet-50',
    vibeLabel: 'Tu × InTransparency',
  },
  company: {
    headerGradient: 'from-blue-600 via-cyan-600 to-teal-500',
    launcherGradient: 'from-blue-500 to-cyan-500',
    haloRgba: 'rgba(59, 130, 246, 0.45)',
    accent: 'text-blue-600 dark:text-blue-300',
    userBubbleGradient: 'from-blue-500 to-cyan-500',
    ringHover: 'hover:border-blue-400 hover:bg-blue-50',
    vibeLabel: 'Hiring Advisor',
  },
  institution: {
    headerGradient: 'from-amber-500 via-orange-500 to-rose-500',
    launcherGradient: 'from-amber-500 to-orange-500',
    haloRgba: 'rgba(245, 158, 11, 0.45)',
    accent: 'text-amber-600 dark:text-amber-300',
    userBubbleGradient: 'from-amber-500 to-orange-500',
    ringHover: 'hover:border-amber-400 hover:bg-amber-50',
    vibeLabel: 'Staff Assistant',
  },
}

const SESSION_STORAGE_KEY = 'intransparency_chat_session'
const ATTRACTOR_DISMISSED_KEY = 'intransparency_chat_attractor_dismissed'

/**
 * Branded assistant avatar — InTransparency logo on a segment-tinted halo.
 * Used in header, launcher, and per-message.
 */
function AssistantAvatar({
  size,
  haloRgba,
  pulse = false,
}: {
  size: number
  haloRgba: string
  pulse?: boolean
}) {
  return (
    <div
      className="relative rounded-full bg-white flex items-center justify-center shadow-lg"
      style={{
        width: size,
        height: size,
        boxShadow: `0 0 0 2px rgba(255,255,255,0.9), 0 8px 24px -6px ${haloRgba}`,
      }}
    >
      {pulse && (
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{ background: haloRgba, opacity: 0.4 }}
        />
      )}
      <Image
        src="/logo.png"
        alt="InTransparency"
        width={size - 8}
        height={size - 8}
        className="rounded-full relative z-10"
        priority={size > 32}
      />
    </div>
  )
}

export function ChatbotWidget({
  userRole,
  userName,
  isOpen: initialIsOpen = false,
  onClose,
  enableStreaming = true,
}: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(initialIsOpen)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string>('')
  const [suggestedActions, setSuggestedActions] = useState<SuggestedAction[]>([])
  const [showAttractor, setShowAttractor] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const t = useTranslations('chat.chatbot')

  const theme = SEGMENT_THEME[userRole]
  const configTitle = t(`${userRole}.title`)
  const configGreeting = t(`${userRole}.greeting`)
  const configApiRole = chatbotApiRoles[userRole]
  const configExamples = [
    t(`${userRole}.examples.0`),
    t(`${userRole}.examples.1`),
    t(`${userRole}.examples.2`),
    t(`${userRole}.examples.3`),
  ]

  // Initialize session ID on mount
  useEffect(() => {
    let storedSessionId = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (!storedSessionId) {
      storedSessionId = chatApi.generateSessionId()
      sessionStorage.setItem(SESSION_STORAGE_KEY, storedSessionId)
    }
    setSessionId(storedSessionId)
  }, [])

  // Show "How can I help?" attractor bubble after 5s on first visit per session
  useEffect(() => {
    if (isOpen) return
    if (sessionStorage.getItem(ATTRACTOR_DISMISSED_KEY)) return
    const timer = setTimeout(() => setShowAttractor(true), 5000)
    return () => clearTimeout(timer)
  }, [isOpen])

  // Initialize greeting message
  useEffect(() => {
    if (isOpen && messages.length === 0 && sessionId) {
      const greeting: Message = {
        id: '1',
        role: 'assistant',
        content: configGreeting,
        timestamp: new Date(),
      }
      setMessages([greeting])
    }
  }, [isOpen, configGreeting, messages.length, sessionId])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading || !sessionId) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setError(null)
    setIsTyping(true)
    setIsLoading(true)
    setSuggestedActions([])

    try {
      if (enableStreaming) {
        const assistantMessageId = (Date.now() + 1).toString()
        setMessages(prev => [
          ...prev,
          {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            timestamp: new Date(),
            isStreaming: true,
          },
        ])

        await chatApi.streamMessage(
          sessionId,
          input,
          configApiRole,
          chunk => {
            setMessages(prev =>
              prev.map(msg =>
                msg.id === assistantMessageId
                  ? { ...msg, content: msg.content + chunk }
                  : msg
              )
            )
          },
          () => {
            setMessages(prev =>
              prev.map(msg =>
                msg.id === assistantMessageId ? { ...msg, isStreaming: false } : msg
              )
            )
            setIsTyping(false)
            setIsLoading(false)
          },
          err => {
            console.error('Streaming error:', err)
            setError(t('errorResponse'))
            setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId))
            setIsTyping(false)
            setIsLoading(false)
          }
        )
      } else {
        const response = await chatApi.sendMessage(sessionId, input, configApiRole)
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
          intent: response.intent,
        }
        setMessages(prev => [...prev, assistantMessage])
        if (response.suggested_actions?.length > 0) {
          setSuggestedActions(response.suggested_actions)
        }
        setIsTyping(false)
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Chat error:', err)
      setError(t('errorSend'))
      setIsTyping(false)
      setIsLoading(false)
    }
  }, [input, isLoading, sessionId, configApiRole, enableStreaming, t])

  const handleExampleClick = (example: string) => {
    setInput(example)
    inputRef.current?.focus()
  }

  const handleActionClick = (action: SuggestedAction) => {
    setInput(`I want to ${(action.label || '').toLowerCase()}`)
  }

  const handleToggle = () => {
    if (isOpen && onClose) onClose()
    setIsOpen(!isOpen)
    setShowAttractor(false)
    sessionStorage.setItem(ATTRACTOR_DISMISSED_KEY, '1')
  }

  const handleDismissAttractor = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowAttractor(false)
    sessionStorage.setItem(ATTRACTOR_DISMISSED_KEY, '1')
  }

  const handleNewChat = () => {
    const newSessionId = chatApi.generateSessionId()
    sessionStorage.setItem(SESSION_STORAGE_KEY, newSessionId)
    setSessionId(newSessionId)
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: configGreeting,
        timestamp: new Date(),
      },
    ])
    setSuggestedActions([])
    setError(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // CLOSED STATE — branded launcher with optional attractor bubble
  // ──────────────────────────────────────────────────────────────────────────
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {showAttractor && (
            <motion.button
              initial={{ opacity: 0, y: 8, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.92 }}
              onClick={handleToggle}
              className="group relative flex items-center gap-2 max-w-[260px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl px-4 py-3 text-left hover:shadow-2xl transition-shadow"
            >
              <Sparkles className={`h-4 w-4 ${theme.accent} shrink-0`} />
              <span className="text-sm text-slate-800 dark:text-slate-200 leading-tight">
                {t(`${userRole}.attractor`, {
                  defaultValue:
                    userRole === 'student'
                      ? 'Vuoi esplorare le tue skill verificate? Chiedimelo.'
                      : userRole === 'company'
                      ? 'Cerchi un profilo specifico? Te lo trovo.'
                      : 'Domanda su placement, M1-M4, AI Act? Sono qui.',
                })}
              </span>
              <button
                onClick={handleDismissAttractor}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-300 transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute -bottom-1 right-6 w-3 h-3 bg-white dark:bg-slate-900 border-r border-b border-slate-200 dark:border-slate-700 rotate-45" />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 280, damping: 18 }}
          onClick={handleToggle}
          className={`relative h-16 w-16 rounded-full bg-gradient-to-br ${theme.launcherGradient} shadow-2xl flex items-center justify-center group`}
          aria-label={configTitle}
        >
          {/* Slow pulse halo — signals "alive, ready" */}
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-40"
            style={{ background: theme.haloRgba }}
          />
          <div className="relative z-10 w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="InTransparency"
              width={36}
              height={36}
              className="rounded-full"
              priority
            />
          </div>
          {/* Online dot */}
          <span className="absolute bottom-1 right-1 z-20 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
        </motion.button>
      </div>
    )
  }

  // ──────────────────────────────────────────────────────────────────────────
  // OPEN STATE — branded conversation panel
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      className={`fixed bottom-6 right-6 z-50 ${
        isMinimized ? 'w-80' : 'w-[400px]'
      } max-h-[640px] flex flex-col`}
    >
      <Card className="shadow-2xl border-0 flex flex-col h-full overflow-hidden rounded-2xl bg-white dark:bg-slate-900">
        {/* Header — segment-tinted gradient with brand logo */}
        <CardHeader
          className={`bg-gradient-to-br ${theme.headerGradient} text-white p-4 flex-shrink-0 relative overflow-hidden`}
        >
          {/* Subtle decorative orbs */}
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/10 blur-xl" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <AssistantAvatar size={44} haloRgba="rgba(255,255,255,0.4)" />
              <div className="min-w-0">
                <h3 className="text-base font-bold truncate">{configTitle}</h3>
                <div className="flex items-center gap-1.5 text-xs text-white/85 mt-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="truncate">{theme.vibeLabel}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewChat}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                title={t('newConversation')}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
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
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950 max-h-[380px]">
              {/* Transparency notice — softer, brand-aware */}
              <div className="flex items-start gap-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 text-xs text-slate-700 dark:text-slate-300">
                <Shield className={`h-4 w-4 mt-0.5 flex-shrink-0 ${theme.accent}`} />
                <span dangerouslySetInnerHTML={{ __html: t('transparencyNotice') }} />
              </div>

              {error && (
                <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl p-3 text-sm text-rose-700 dark:text-rose-300">
                  {error}
                </div>
              )}

              <AnimatePresence initial={false}>
                {messages.map(message => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-2 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <AssistantAvatar size={32} haloRgba={theme.haloRgba} />
                    )}
                    <div
                      className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                        message.role === 'user'
                          ? `bg-gradient-to-br ${theme.userBubbleGradient} text-white rounded-br-sm`
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-sm'
                      }`}
                    >
                      <p className="whitespace-pre-line">
                        {message.content}
                        {message.isStreaming && (
                          <span
                            className="inline-block w-1.5 h-3.5 ml-1 align-middle animate-pulse"
                            style={{ background: theme.haloRgba }}
                          />
                        )}
                      </p>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && !messages.some(m => m.isStreaming) && (
                <div className="flex gap-2 items-center">
                  <AssistantAvatar size={32} haloRgba={theme.haloRgba} pulse />
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-sm px-3.5 py-3">
                    <div className="flex gap-1 items-center">
                      <motion.div
                        className="w-2 h-2 rounded-full"
                        style={{ background: theme.haloRgba }}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full"
                        style={{ background: theme.haloRgba }}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full"
                        style={{ background: theme.haloRgba }}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            {/* Suggested actions */}
            {suggestedActions.length > 0 && (
              <div className="px-4 py-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                  {t('suggestedActions')}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleActionClick(action)}
                      className={`text-xs px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-all ${theme.ringHover} dark:hover:bg-slate-700`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Example questions on first open */}
            {messages.length <= 1 && (
              <div className="px-4 py-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className={`h-3 w-3 ${theme.accent}`} />
                  {t('quickActions')}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {configExamples.map((example, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      onClick={() => handleExampleClick(example)}
                      className={`text-xs px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-all ${theme.ringHover} dark:hover:bg-slate-700`}
                    >
                      {example}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
              <div className="flex gap-2 items-center bg-slate-50 dark:bg-slate-800 rounded-full pr-1 pl-4 py-1 border border-slate-200 dark:border-slate-700 focus-within:border-slate-400 dark:focus-within:border-slate-500 transition-colors">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('inputPlaceholder')}
                  className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 text-sm"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  size="sm"
                  className={`h-9 w-9 p-0 rounded-full bg-gradient-to-br ${theme.launcherGradient} hover:opacity-90 shadow-md`}
                  disabled={!input.trim() || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-center">
                {userName ? `${userName} · ` : ''}Powered by InTransparency AI
              </p>
            </div>
          </>
        )}
      </Card>
    </motion.div>
  )
}
