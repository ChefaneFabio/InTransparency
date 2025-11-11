'use client'

import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Send,
  User
} from 'lucide-react'

interface Message {
  id: string
  senderId: string
  recipientId?: string
  recipientEmail: string
  subject?: string
  content: string
  read: boolean
  readAt?: string
  createdAt: string
  sender: {
    id: string
    firstName: string
    lastName: string
    email: string
    photo?: string
    company?: string
    role: string
  }
}

export default function MessageThreadPage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [replyContent, setReplyContent] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const threadId = params.threadId as string

  useEffect(() => {
    fetchMessages()
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [threadId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?threadId=${threadId}`)
      const data = await response.json()

      if (data.messages) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!replyContent.trim()) {
      toast({
        title: 'Validation error',
        description: 'Message content cannot be empty',
        variant: 'destructive'
      })
      return
    }

    if (!session) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to send messages',
        variant: 'destructive'
      })
      return
    }

    // Get recipient from the first message in thread
    const firstMessage = messages[0]
    if (!firstMessage) {
      toast({
        title: 'Error',
        description: 'Cannot determine recipient',
        variant: 'destructive'
      })
      return
    }

    // Determine recipient (the other person in the conversation)
    const recipientEmail = firstMessage.senderId === session.user.id
      ? firstMessage.recipientEmail
      : firstMessage.sender.email

    const recipientId = firstMessage.senderId === session.user.id
      ? firstMessage.recipientId
      : firstMessage.senderId

    setSending(true)
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientEmail,
          recipientId: recipientId || undefined,
          content: replyContent.trim(),
          threadId,
          subject: firstMessage.subject,
          replyToId: messages[messages.length - 1]?.id,
        })
      })

      const data = await response.json()

      if (response.ok) {
        setReplyContent('')
        fetchMessages()
        toast({
          title: 'Message sent!',
          description: 'Your reply has been sent'
        })
      } else {
        toast({
          title: 'Send failed',
          description: data.error || 'Failed to send message',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      })
    } finally {
      setSending(false)
    }
  }

  const formatTime = (date: string) => {
    const messageDate = new Date(date)
    const now = new Date()
    const diffInMs = now.getTime() - messageDate.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`

    // For older messages, show full date
    const timeStr = messageDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })

    if (diffInDays === 0) return `Today at ${timeStr}`
    if (diffInDays === 1) return `Yesterday at ${timeStr}`
    if (diffInDays < 7) return `${diffInDays} days ago`

    return messageDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: messageDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  // Get the other participant in the conversation
  const getOtherParticipant = () => {
    if (!messages.length || !session) return null

    const firstMessage = messages[0]

    if (firstMessage.senderId === session.user.id) {
      return {
        email: firstMessage.recipientEmail,
        id: firstMessage.recipientId,
        firstName: undefined,
        lastName: undefined,
        photo: undefined,
        company: undefined,
      }
    } else {
      return firstMessage.sender
    }
  }

  const otherParticipant = getOtherParticipant()

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
        <p className="text-muted-foreground mb-4">You need to be signed in to view messages</p>
        <Link href="/auth/signin">
          <Button>Sign In</Button>
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <Card>
          <CardContent className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!messages.length) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/messages">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Messages
          </Button>
        </Link>

        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-xl font-semibold mb-2">No messages found</h3>
            <p className="text-muted-foreground">This conversation does not exist or you don't have access to it</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <Link href="/messages">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Messages
        </Button>
      </Link>

      {/* Conversation Header */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            {otherParticipant?.photo ? (
              <img
                src={otherParticipant.photo}
                alt={otherParticipant.email}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                {otherParticipant?.firstName && otherParticipant?.lastName ? (
                  <span className="text-lg font-semibold text-primary">
                    {otherParticipant.firstName[0]}{otherParticipant.lastName[0]}
                  </span>
                ) : (
                  <User className="w-6 h-6 text-primary" />
                )}
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold">
                {otherParticipant?.firstName && otherParticipant?.lastName
                  ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
                  : otherParticipant?.email || 'Unknown'}
              </h2>
              {otherParticipant?.company && (
                <p className="text-sm text-muted-foreground">{otherParticipant.company}</p>
              )}
            </div>
          </div>

          {messages[0]?.subject && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-sm text-muted-foreground">Subject:</p>
              <p className="font-medium">{messages[0].subject}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="space-y-6 max-h-[500px] overflow-y-auto">
            {messages.map((message, index) => {
              const isCurrentUser = message.senderId === session.user?.id
              const showDateSeparator = index === 0 || (
                new Date(messages[index - 1].createdAt).toDateString() !== new Date(message.createdAt).toDateString()
              )

              return (
                <div key={message.id}>
                  {showDateSeparator && (
                    <div className="flex items-center gap-4 my-4">
                      <Separator className="flex-1" />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(message.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <Separator className="flex-1" />
                    </div>
                  )}

                  <div className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {message.sender.photo ? (
                        <img
                          src={message.sender.photo}
                          alt={`${message.sender.firstName} ${message.sender.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {message.sender.firstName[0]}{message.sender.lastName[0]}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={`flex-1 max-w-[75%] ${isCurrentUser ? 'items-end' : ''}`}>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className={`text-sm font-medium ${isCurrentUser ? 'text-right' : ''}`}>
                          {isCurrentUser ? 'You' : `${message.sender.firstName} ${message.sender.lastName}`}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(message.createdAt)}
                        </span>
                      </div>

                      <div
                        className={`rounded-lg p-3 ${
                          isCurrentUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>

                      {message.read && isCurrentUser && message.readAt && (
                        <p className="text-xs text-muted-foreground mt-1 text-right">
                          Read
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Reply Form */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSendReply} className="space-y-4">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Type your message..."
              rows={3}
              disabled={sending}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={sending || !replyContent.trim()}>
                <Send className="w-4 h-4 mr-2" />
                {sending ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
