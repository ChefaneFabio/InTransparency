'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
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
  User,
  Loader2,
  RefreshCw
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
  institution: 'institution'
}

// Session storage key for chat session ID
const SESSION_STORAGE_KEY = 'intransparency_chat_session'

export function ChatbotWidget({
  userRole,
  userName,
  userId,
  isOpen: initialIsOpen = false,
  onClose,
  enableStreaming = true
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const t = useTranslations('chat.chatbot')

  const configTitle = t(`${userRole}.title`)
  const configGreeting = t(`${userRole}.greeting`)
  const configBadge = t(`${userRole}.title`)
  const configApiRole = chatbotApiRoles[userRole]
  const configExamples = [
    t(`${userRole}.examples.0`),
    t(`${userRole}.examples.1`),
    t(`${userRole}.examples.2`),
    t(`${userRole}.examples.3`)
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

  // Initialize greeting message
  useEffect(() => {
    if (isOpen && messages.length === 0 && sessionId) {
      const greeting: Message = {
        id: '1',
        role: 'assistant',
        content: configGreeting,
        timestamp: new Date()
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
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setError(null)
    setIsTyping(true)
    setIsLoading(true)
    setSuggestedActions([])

    try {
      if (enableStreaming) {
        // Streaming response
        const assistantMessageId = (Date.now() + 1).toString()

        // Add empty assistant message that will be filled by streaming
        setMessages(prev => [...prev, {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          isStreaming: true
        }])

        await chatApi.streamMessage(
          sessionId,
          input,
          configApiRole,
          // onChunk - update the streaming message
          (chunk) => {
            setMessages(prev => prev.map(msg =>
              msg.id === assistantMessageId
                ? { ...msg, content: msg.content + chunk }
                : msg
            ))
          },
          // onComplete
          () => {
            setMessages(prev => prev.map(msg =>
              msg.id === assistantMessageId
                ? { ...msg, isStreaming: false }
                : msg
            ))
            setIsTyping(false)
            setIsLoading(false)
          },
          // onError
          (err) => {
            console.error('Streaming error:', err)
            setError(t('errorResponse'))
            setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId))
            setIsTyping(false)
            setIsLoading(false)
          }
        )
      } else {
        // Non-streaming response
        const response = await chatApi.sendMessage(
          sessionId,
          input,
          configApiRole
        )

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
          intent: response.intent
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
    // Handle suggested action clicks
    // This could navigate to different pages or trigger specific actions
    console.log('Action clicked:', action)
    setInput(`I want to ${action.label.toLowerCase()}`)
  }

  const handleToggle = () => {
    if (isOpen && onClose) {
      onClose()
    }
    setIsOpen(!isOpen)
  }

  const handleNewChat = () => {
    // Clear session and start fresh
    const newSessionId = chatApi.generateSessionId()
    sessionStorage.setItem(SESSION_STORAGE_KEY, newSessionId)
    setSessionId(newSessionId)
    setMessages([{
      id: '1',
      role: 'assistant',
      content: configGreeting,
      timestamp: new Date()
    }])
    setSuggestedActions([])
    setError(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
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
          className="h-14 w-14 rounded-full bg-primary shadow-lg"
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
      <Card className="shadow-lg border-2 border-primary/20 flex flex-col h-full">
        {/* Header */}
        <CardHeader className="bg-primary text-white p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">{configTitle}</CardTitle>
                <Badge className="bg-white/20 text-white border-0 text-xs mt-1">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {configBadge}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
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
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 max-h-[350px]">
              {/* Transparency Notice */}
              <div className="bg-white border border-primary/20 rounded-lg p-3 text-xs text-gray-700">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span dangerouslySetInnerHTML={{ __html: t('transparencyNotice') }} />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">
                      {message.content}
                      {message.isStreaming && (
                        <span className="inline-block w-2 h-4 bg-primary/50 ml-1 animate-pulse" />
                      )}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && !messages.some(m => m.isStreaming) && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
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

            {/* Suggested Actions */}
            {suggestedActions.length > 0 && (
              <div className="p-3 bg-white border-t">
                <p className="text-xs text-gray-600 mb-2">{t('suggestedActions')}</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedActions.map((action, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => handleActionClick(action)}
                      className="text-xs"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Example Questions */}
            {messages.length <= 1 && (
              <div className="p-4 bg-white border-t">
                <p className="text-xs text-gray-600 mb-2">{t('quickActions')}</p>
                <div className="flex flex-wrap gap-2">
                  {configExamples.map((example, idx) => (
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
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('inputPlaceholder')}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  className="bg-primary"
                  disabled={!input.trim() || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </motion.div>
  )
}
