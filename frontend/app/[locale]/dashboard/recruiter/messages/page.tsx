'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  RefreshCw
} from 'lucide-react'

interface Message {
  id: string
  candidateName: string
  candidateEmail: string
  candidateAvatar?: string
  candidateUniversity: string
  subject: string
  preview: string
  content: string
  timestamp: string
  isRead: boolean
  isStarred: boolean
  isArchived: boolean
  thread: {
    id: string
    sender: 'recruiter' | 'candidate'
    content: string
    timestamp: string
  }[]
}

const mockMessages: Message[] = [
  {
    id: '1',
    candidateName: 'Marco Rossi',
    candidateEmail: 'marco.rossi@polimi.it',
    candidateAvatar: '',
    candidateUniversity: 'Politecnico di Milano',
    subject: 'Re: Opportunità Full Stack Developer',
    preview: 'Grazie per avermi contattato! Sono molto interessato alla posizione...',
    content: 'Grazie per avermi contattato! Sono molto interessato alla posizione di Full Stack Developer. Ho esperienza con React, Node.js e PostgreSQL, come potete vedere dal mio portfolio. Sarei disponibile per un colloquio la prossima settimana.',
    timestamp: '2 ore fa',
    isRead: false,
    isStarred: true,
    isArchived: false,
    thread: [
      {
        id: 't1',
        sender: 'recruiter',
        content: 'Ciao Marco, abbiamo visto il tuo profilo su InTransparency e siamo interessati a parlarti di una posizione aperta nel nostro team.',
        timestamp: '1 giorno fa'
      },
      {
        id: 't2',
        sender: 'candidate',
        content: 'Grazie per avermi contattato! Sono molto interessato alla posizione di Full Stack Developer. Ho esperienza con React, Node.js e PostgreSQL, come potete vedere dal mio portfolio. Sarei disponibile per un colloquio la prossima settimana.',
        timestamp: '2 ore fa'
      }
    ]
  },
  {
    id: '2',
    candidateName: 'Sofia Bianchi',
    candidateEmail: 'sofia.bianchi@unibo.it',
    candidateAvatar: '',
    candidateUniversity: 'Università di Bologna',
    subject: 'Candidatura Data Scientist',
    preview: 'Ho visto la vostra offerta per Data Scientist e credo di avere...',
    content: 'Ho visto la vostra offerta per Data Scientist e credo di avere le competenze richieste. Ho completato diversi progetti di machine learning durante il mio percorso universitario.',
    timestamp: '5 ore fa',
    isRead: true,
    isStarred: false,
    isArchived: false,
    thread: [
      {
        id: 't3',
        sender: 'candidate',
        content: 'Ho visto la vostra offerta per Data Scientist e credo di avere le competenze richieste. Ho completato diversi progetti di machine learning durante il mio percorso universitario.',
        timestamp: '5 ore fa'
      }
    ]
  },
  {
    id: '3',
    candidateName: 'Alessandro Costa',
    candidateEmail: 'a.costa@unimi.it',
    candidateAvatar: '',
    candidateUniversity: 'Università degli Studi di Milano',
    subject: 'Informazioni stage estivo',
    preview: 'Buongiorno, vorrei avere maggiori informazioni riguardo lo stage...',
    content: 'Buongiorno, vorrei avere maggiori informazioni riguardo lo stage estivo che avete pubblicato. È possibile iniziare a giugno?',
    timestamp: '1 giorno fa',
    isRead: true,
    isStarred: false,
    isArchived: false,
    thread: []
  }
]

export default function RecruiterMessagesPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [replyContent, setReplyContent] = useState('')
  const [activeTab, setActiveTab] = useState('inbox')

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         msg.subject.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === 'inbox') return !msg.isArchived && matchesSearch
    if (activeTab === 'starred') return msg.isStarred && !msg.isArchived && matchesSearch
    if (activeTab === 'archived') return msg.isArchived && matchesSearch
    return matchesSearch
  })

  const unreadCount = messages.filter(m => !m.isRead && !m.isArchived).length

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message)
    // Mark as read
    setMessages(prev => prev.map(m =>
      m.id === message.id ? { ...m, isRead: true } : m
    ))
  }

  const handleToggleStar = (messageId: string) => {
    setMessages(prev => prev.map(m =>
      m.id === messageId ? { ...m, isStarred: !m.isStarred } : m
    ))
  }

  const handleArchive = (messageId: string) => {
    setMessages(prev => prev.map(m =>
      m.id === messageId ? { ...m, isArchived: true } : m
    ))
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null)
    }
  }

  const handleSendReply = () => {
    if (!replyContent.trim() || !selectedMessage) return

    const newThread = {
      id: `t${Date.now()}`,
      sender: 'recruiter' as const,
      content: replyContent,
      timestamp: 'Adesso'
    }

    setMessages(prev => prev.map(m =>
      m.id === selectedMessage.id
        ? { ...m, thread: [...m.thread, newThread] }
        : m
    ))

    setSelectedMessage(prev => prev ? {
      ...prev,
      thread: [...prev.thread, newThread]
    } : null)

    setReplyContent('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messaggi</h1>
            <p className="text-gray-600">Comunica con i candidati</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Aggiorna
            </Button>
            <Button>
              <MessageSquare className="h-4 w-4 mr-2" />
              Nuovo Messaggio
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
                    placeholder="Cerca messaggi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="mt-4 space-y-2 max-h-[500px] overflow-y-auto">
                  {filteredMessages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Nessun messaggio</p>
                    </div>
                  ) : (
                    filteredMessages.map(message => (
                      <div
                        key={message.id}
                        onClick={() => handleSelectMessage(message)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedMessage?.id === message.id
                            ? 'bg-blue-50 border border-blue-200'
                            : message.isRead
                              ? 'hover:bg-gray-50'
                              : 'bg-blue-50/50 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={message.candidateAvatar} />
                            <AvatarFallback>
                              {message.candidateName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className={`text-sm truncate ${!message.isRead ? 'font-semibold' : ''}`}>
                                {message.candidateName}
                              </span>
                              <span className="text-xs text-gray-500">{message.timestamp}</span>
                            </div>
                            <p className={`text-sm truncate ${!message.isRead ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                              {message.subject}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{message.preview}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Content */}
          <div className="col-span-9">
            {selectedMessage ? (
              <Card className="h-full">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={selectedMessage.candidateAvatar} />
                        <AvatarFallback>
                          {selectedMessage.candidateName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{selectedMessage.candidateName}</CardTitle>
                        <CardDescription>
                          {selectedMessage.candidateUniversity} • {selectedMessage.candidateEmail}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStar(selectedMessage.id)}
                      >
                        <Star className={`h-4 w-4 ${selectedMessage.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleArchive(selectedMessage.id)}
                      >
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
                    <h3 className="text-lg font-semibold">{selectedMessage.subject}</h3>
                  </div>

                  {/* Thread */}
                  <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6">
                    {selectedMessage.thread.map(msg => (
                      <div
                        key={msg.id}
                        className={`p-4 rounded-lg ${
                          msg.sender === 'recruiter'
                            ? 'bg-blue-50 ml-8'
                            : 'bg-gray-50 mr-8'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {msg.sender === 'recruiter' ? 'Tu' : selectedMessage.candidateName}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {msg.timestamp}
                          </span>
                        </div>
                        <p className="text-gray-700">{msg.content}</p>
                      </div>
                    ))}
                  </div>

                  {/* Reply */}
                  <div className="border-t pt-4">
                    <Textarea
                      placeholder="Scrivi una risposta..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      rows={4}
                      className="mb-4"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">
                        Allega File
                      </Button>
                      <Button onClick={handleSendReply} disabled={!replyContent.trim()}>
                        <Send className="h-4 w-4 mr-2" />
                        Invia
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center py-16">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Seleziona un messaggio
                  </h3>
                  <p className="text-gray-600">
                    Scegli una conversazione dalla lista per visualizzarla
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
