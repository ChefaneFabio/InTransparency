'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'
import {
  Search,
  Send,
  Inbox,
  Archive,
  Star,
  Trash2,
  MoreHorizontal,
  Clock,
  CheckCheck,
  MessageSquare,
  Users,
  Filter,
  RefreshCw,
  AlertCircle
} from 'lucide-react'

interface Conversation {
  threadId: string
  subject: string
  lastMessage: string
  unreadCount: number
  participants: {
    id: string
    firstName: string
    lastName: string
    email: string
    photo?: string
    company?: string
  }[]
  updatedAt: string
}

interface ThreadMessage {
  id: string
  senderId: string
  recipientId: string
  subject: string
  content: string
  threadId: string
  read: boolean
  createdAt: string
  sender: {
    firstName: string
    lastName: string
    email: string
    photo?: string
    company?: string
  }
}

export default function RecruiterMessagesPage() {
  const t = useTranslations('dashboard.recruiter.messages')
  const { data: session } = useSession()
  const currentUserId = session?.user?.id

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loadingConversations, setLoadingConversations] = useState(true)
  const [errorConversations, setErrorConversations] = useState<string | null>(null)

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [threadMessages, setThreadMessages] = useState<ThreadMessage[]>([])
  const [loadingThread, setLoadingThread] = useState(false)
  const [errorThread, setErrorThread] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [replyContent, setReplyContent] = useState('')
  const [sendingReply, setSendingReply] = useState(false)
  const [activeTab, setActiveTab] = useState('inbox')

  // Fetch conversations
  const fetchConversations = useCallback(() => {
    setLoadingConversations(true)
    setErrorConversations(null)
    fetch('/api/messages/conversations')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load conversations')
        return res.json()
      })
      .then(data => {
        setConversations(data.conversations || [])
        setLoadingConversations(false)
      })
      .catch(err => {
        setErrorConversations(err.message)
        setLoadingConversations(false)
      })
  }, [])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  // Fetch thread messages when a conversation is selected
  const fetchThread = useCallback((threadId: string) => {
    setLoadingThread(true)
    setErrorThread(null)
    fetch(`/api/messages?threadId=${threadId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load messages')
        return res.json()
      })
      .then(data => {
        setThreadMessages(data.messages || [])
        setLoadingThread(false)
      })
      .catch(err => {
        setErrorThread(err.message)
        setLoadingThread(false)
      })
  }, [])

  // Get the "other" participant (the candidate) from a conversation
  const getOtherParticipant = (conv: Conversation) => {
    const other = conv.participants.find(p => p.id !== currentUserId)
    return other || conv.participants[0]
  }

  const filteredConversations = conversations.filter(conv => {
    const other = getOtherParticipant(conv)
    const name = `${other?.firstName || ''} ${other?.lastName || ''}`.toLowerCase()
    const matchesSearch = name.includes(searchQuery.toLowerCase()) ||
                         conv.subject.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const unreadCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv)
    fetchThread(conv.threadId)
  }

  const handleSendReply = async () => {
    if (!replyContent.trim() || !selectedConversation) return

    const other = getOtherParticipant(selectedConversation)
    if (!other) return

    setSendingReply(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: other.id,
          recipientEmail: other.email,
          subject: selectedConversation.subject,
          content: replyContent,
          threadId: selectedConversation.threadId
        })
      })

      if (!res.ok) throw new Error('Failed to send message')

      setReplyContent('')
      // Refresh thread and conversations
      fetchThread(selectedConversation.threadId)
      fetchConversations()
    } catch (err) {
      alert('Failed to send message. Please try again.')
    } finally {
      setSendingReply(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-gray-600">{t('subtitle')}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchConversations}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('refresh')}
            </Button>
            <Button>
              <MessageSquare className="h-4 w-4 mr-2" />
              {t('newMessage')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <Card>
              <CardContent className="p-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="inbox" className="relative">
                      <Inbox className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                          {unreadCount}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="starred">
                      <Star className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="archived">
                      <Archive className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="mt-4 space-y-2 max-h-[500px] overflow-y-auto">
                  {loadingConversations ? (
                    <div className="space-y-3">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="p-3 space-y-2">
                          <div className="flex items-start gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-1">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-3 w-32" />
                              <Skeleton className="h-3 w-full" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : errorConversations ? (
                    <div className="text-center py-8 text-red-500">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">{errorConversations}</p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={fetchConversations}>
                        {t('retry')}
                      </Button>
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    <EmptyState icon={MessageSquare} title={t('noMessages')} description={t('selectMessageDesc')} />
                  ) : (
                    filteredConversations.map(conv => {
                      const other = getOtherParticipant(conv)
                      const name = `${other?.firstName || ''} ${other?.lastName || ''}`
                      const initials = name.trim().split(' ').map(n => n[0]).join('')

                      return (
                        <div
                          key={conv.threadId}
                          onClick={() => handleSelectConversation(conv)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedConversation?.threadId === conv.threadId
                              ? 'bg-blue-50 border border-blue-200'
                              : conv.unreadCount > 0
                                ? 'bg-blue-50/50 hover:bg-blue-50'
                                : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={other?.photo || ''} />
                              <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-semibold' : ''}`}>
                                  {name}
                                </span>
                                <span className="text-xs text-gray-500">{formatDate(conv.updatedAt)}</span>
                              </div>
                              <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                                {conv.subject}
                              </p>
                              <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                            </div>
                            {conv.unreadCount > 0 && (
                              <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs shrink-0">
                                {conv.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Content */}
          <div className="col-span-9">
            {selectedConversation ? (
              <Card className="h-full">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {(() => {
                        const other = getOtherParticipant(selectedConversation)
                        const name = `${other?.firstName || ''} ${other?.lastName || ''}`
                        const initials = name.trim().split(' ').map(n => n[0]).join('')
                        return (
                          <>
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={other?.photo || ''} />
                              <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle>{name}</CardTitle>
                              <CardDescription>
                                {other?.company ? `${other.company} - ` : ''}{other?.email || ''}
                              </CardDescription>
                            </div>
                          </>
                        )
                      })()}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">{selectedConversation.subject}</h3>
                  </div>

                  {/* Thread */}
                  <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6">
                    {loadingThread ? (
                      <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className={`p-4 rounded-lg bg-gray-50 ${i % 2 === 0 ? 'mr-8' : 'ml-8'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                            <Skeleton className="h-4 w-full mb-1" />
                            <Skeleton className="h-4 w-3/4" />
                          </div>
                        ))}
                      </div>
                    ) : errorThread ? (
                      <div className="text-center py-8 text-red-500">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                        <p>{errorThread}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => fetchThread(selectedConversation.threadId)}
                        >
                          {t('retry')}
                        </Button>
                      </div>
                    ) : threadMessages.length === 0 ? (
                      <EmptyState icon={MessageSquare} title={t('noMessagesInThread')} description="" />
                    ) : (
                      threadMessages.map(msg => {
                        const isMe = msg.senderId === currentUserId
                        const senderName = isMe
                          ? t('you')
                          : `${msg.sender.firstName} ${msg.sender.lastName}`
                        return (
                          <div
                            key={msg.id}
                            className={`p-4 rounded-lg ${
                              isMe
                                ? 'bg-blue-50 ml-8'
                                : 'bg-gray-50 mr-8'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">
                                {senderName}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDate(msg.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-700">{msg.content}</p>
                          </div>
                        )
                      })
                    )}
                  </div>

                  {/* Reply */}
                  <div className="border-t pt-4">
                    <Textarea
                      placeholder={t('replyPlaceholder')}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      rows={4}
                      className="mb-4"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">
                        {t('attachFile')}
                      </Button>
                      <Button
                        onClick={handleSendReply}
                        disabled={!replyContent.trim() || sendingReply}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {sendingReply ? t('sending') : t('send')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <EmptyState icon={MessageSquare} title={t('selectMessage')} description={t('selectMessageDesc')} />
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
