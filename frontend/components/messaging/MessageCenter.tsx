'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  MessageSquare,
  Send,
  Users,
  Briefcase,
  GraduationCap,
  Circle,
  X
} from 'lucide-react'
import { useWebSocket } from '@/lib/websocket/useWebSocket'
import { useAuth } from '@/lib/auth/AuthContext'

interface Message {
  id: string
  type: 'message' | 'notification' | 'system'
  content: string
  senderId: string
  senderName: string
  senderType: 'student' | 'recruiter' | 'university' | 'admin'
  conversationId: string
  timestamp: number
  read: boolean
}

interface Conversation {
  id: string
  participants: Array<{
    id: string
    name: string
    type: 'student' | 'recruiter' | 'university' | 'admin'
    avatar?: string
  }>
  lastMessage?: Message
  unreadCount: number
  type: 'direct' | 'group'
  subject?: string
}

export function MessageCenter() {
  const { user, isAuthenticated } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // WebSocket connection for real-time messaging
  const { isConnected, sendMessage, lastMessage } = useWebSocket(
    process.env.NODE_ENV === 'production'
      ? 'wss://api-intransparency.onrender.com/ws'
      : 'ws://localhost:3001/ws',
    {
      onMessage: handleWebSocketMessage,
      onConnect: () => {
        console.log('[MessageCenter] WebSocket connected')
        // Request conversation list
        sendMessage({
          type: 'GET_CONVERSATIONS',
          data: { userId: user?.id }
        })
      },
      onDisconnect: () => {
        console.log('[MessageCenter] WebSocket disconnected')
      }
    }
  )

  function handleWebSocketMessage(wsMessage: any) {
    switch (wsMessage.type) {
      case 'NEW_MESSAGE':
        const message = wsMessage.data as Message

        // Add to messages if it's for the active conversation
        if (message.conversationId === activeConversation) {
          setMessages(prev => [...prev, message])
          scrollToBottom()
        }

        // Update conversation list
        updateConversationLastMessage(message)
        break

      case 'CONVERSATIONS_LIST':
        setConversations(wsMessage.data || [])
        break

      case 'CONVERSATION_MESSAGES':
        setMessages(wsMessage.data || [])
        scrollToBottom()
        break

      case 'MESSAGE_READ':
        markMessagesAsRead(wsMessage.data.conversationId, wsMessage.data.messageIds)
        break
    }
  }

  const updateConversationLastMessage = (message: Message) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === message.conversationId) {
        return {
          ...conv,
          lastMessage: message,
          unreadCount: conv.id === activeConversation ? conv.unreadCount : conv.unreadCount + 1
        }
      }
      return conv
    }))
  }

  const markMessagesAsRead = (conversationId: string, messageIds: string[]) => {
    if (conversationId === activeConversation) {
      setMessages(prev => prev.map(msg =>
        messageIds.includes(msg.id) ? { ...msg, read: true } : msg
      ))
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation || !isConnected) return

    const message = {
      type: 'SEND_MESSAGE',
      data: {
        conversationId: activeConversation,
        content: newMessage.trim(),
        senderId: user?.id,
        senderName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
        senderType: user?.role || 'student'
      }
    }

    if (sendMessage(message)) {
      setNewMessage('')
    }
  }

  const selectConversation = (conversationId: string) => {
    setActiveConversation(conversationId)

    // Mark messages as read
    sendMessage({
      type: 'MARK_READ',
      data: { conversationId }
    })

    // Get conversation messages
    sendMessage({
      type: 'GET_MESSAGES',
      data: { conversationId }
    })

    // Update unread count locally
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ))
  }

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case 'student':
        return <GraduationCap className="h-4 w-4" />
      case 'recruiter':
        return <Briefcase className="h-4 w-4" />
      case 'university':
        return <Users className="h-4 w-4" />
      default:
        return <Circle className="h-4 w-4" />
    }
  }

  const getTotalUnreadCount = () => {
    return conversations.reduce((total, conv) => total + conv.unreadCount, 0)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (!isAuthenticated) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isExpanded ? (
        <Button
          onClick={() => setIsExpanded(true)}
          className="h-12 w-12 rounded-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 shadow-lg relative"
        >
          <MessageSquare className="h-5 w-5" />
          {getTotalUnreadCount() > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 bg-red-500 text-xs">
              {getTotalUnreadCount()}
            </Badge>
          )}
        </Button>
      ) : (
        <Card className="w-80 h-96 shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 h-full flex">
            {/* Conversations List */}
            <div className={`${activeConversation ? 'w-1/3' : 'w-full'} border-r overflow-y-auto`}>
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-700 text-sm">
                  No conversations yet
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => selectConversation(conv.id)}
                    className={`p-3 cursor-pointer border-b hover:bg-gray-50 ${
                      activeConversation === conv.id ? 'bg-teal-50 border-l-2 border-l-teal-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        {getUserTypeIcon(conv.participants[0]?.type || 'student')}
                        <span className="text-sm font-medium truncate">
                          {conv.participants.find(p => p.id !== user?.id)?.name || 'Unknown'}
                        </span>
                      </div>
                      {conv.unreadCount > 0 && (
                        <Badge className="h-4 w-4 rounded-full p-0 bg-teal-500 text-xs">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                    {conv.lastMessage && (
                      <p className="text-xs text-gray-700 truncate">
                        {conv.lastMessage.content}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Active Conversation */}
            {activeConversation && (
              <div className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === user?.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${
                          message.senderId === user?.id
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {message.senderId !== user?.id && (
                          <div className="text-xs opacity-75 mb-1">
                            {message.senderName}
                          </div>
                        )}
                        <div>{message.content}</div>
                        <div className="text-xs opacity-75 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-3 border-t">
                  <div className="flex space-x-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 min-h-0 h-8 resize-none text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || !isConnected}
                      className="h-8 w-8 p-0"
                    >
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}