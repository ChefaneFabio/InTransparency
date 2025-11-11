'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { Avatar } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Mail,
  MessageSquare,
  Plus,
  Search,
  Send,
  User
} from 'lucide-react'

interface Conversation {
  threadId: string
  latestMessage: {
    id: string
    subject?: string
    content: string
    createdAt: string
    read: boolean
    senderId: string
  }
  otherParticipant: {
    id?: string
    email: string
    firstName?: string
    lastName?: string
    photo?: string
    company?: string
  }
  unreadCount: number
}

export default function MessagesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // New message form
  const [recipientEmail, setRecipientEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/messages/conversations')
      const data = await response.json()

      if (data.conversations) {
        setConversations(data.conversations)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch conversations',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!recipientEmail.trim() || !content.trim()) {
      toast({
        title: 'Validation error',
        description: 'Recipient and message content are required',
        variant: 'destructive'
      })
      return
    }

    setSending(true)
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientEmail: recipientEmail.trim(),
          subject: subject.trim() || undefined,
          content: content.trim(),
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'Message sent!',
          description: 'Your message has been sent successfully'
        })
        setShowNewMessageDialog(false)
        setRecipientEmail('')
        setSubject('')
        setContent('')
        fetchConversations()

        // Navigate to the new thread
        if (data.message?.threadId) {
          router.push(`/messages/${data.message.threadId}`)
        }
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

  const getTimeSince = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const diffInMs = now.getTime() - past.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInDays < 7) return `${diffInDays}d ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`
    return `${Math.floor(diffInDays / 30)}mo ago`
  }

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true

    const otherParticipant = conv.otherParticipant
    const searchLower = searchQuery.toLowerCase()

    const nameMatch = otherParticipant.firstName?.toLowerCase().includes(searchLower) ||
                     otherParticipant.lastName?.toLowerCase().includes(searchLower)
    const emailMatch = otherParticipant.email.toLowerCase().includes(searchLower)
    const companyMatch = otherParticipant.company?.toLowerCase().includes(searchLower)
    const contentMatch = conv.latestMessage.content.toLowerCase().includes(searchLower)
    const subjectMatch = conv.latestMessage.subject?.toLowerCase().includes(searchLower)

    return nameMatch || emailMatch || companyMatch || contentMatch || subjectMatch
  })

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Messages</h1>
          <p className="text-muted-foreground">Communicate with recruiters and students</p>
        </div>

        <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
          <DialogTrigger asChild>
            <Button size="lg" className="mt-4 md:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              New Message
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Send a Message</DialogTitle>
              <DialogDescription>
                Send a message to a recruiter or student
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <Label htmlFor="recipientEmail">Recipient Email *</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="recipient@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Message subject (optional)"
                />
              </div>

              <div>
                <Label htmlFor="content">Message *</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  placeholder="Write your message..."
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={sending} className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  {sending ? 'Sending...' : 'Send Message'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewMessageDialog(false)}
                  disabled={sending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Conversations List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredConversations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">
              {conversations.length === 0 ? 'No conversations yet' : 'No conversations found'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {conversations.length === 0
                ? 'Start a conversation by sending a message'
                : 'Try adjusting your search query'}
            </p>
            {conversations.length === 0 && (
              <Button onClick={() => setShowNewMessageDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Message
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredConversations.map((conversation) => {
            const isUnread = conversation.unreadCount > 0
            const isSender = conversation.latestMessage.senderId === session.user?.id
            const otherParticipant = conversation.otherParticipant

            return (
              <Link
                key={conversation.threadId}
                href={`/messages/${conversation.threadId}`}
              >
                <Card className={`hover:shadow-md transition-shadow cursor-pointer ${isUnread && !isSender ? 'bg-primary/5 border-primary/20' : ''}`}>
                  <CardContent className="py-4">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {otherParticipant.photo ? (
                          <img
                            src={otherParticipant.photo}
                            alt={otherParticipant.email}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            {otherParticipant.firstName && otherParticipant.lastName ? (
                              <span className="text-lg font-semibold text-primary">
                                {otherParticipant.firstName[0]}{otherParticipant.lastName[0]}
                              </span>
                            ) : (
                              <User className="w-6 h-6 text-primary" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h3 className={`font-semibold ${isUnread && !isSender ? 'text-primary' : ''}`}>
                              {otherParticipant.firstName && otherParticipant.lastName
                                ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
                                : otherParticipant.email}
                            </h3>
                            {otherParticipant.company && (
                              <p className="text-sm text-muted-foreground">{otherParticipant.company}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                              {getTimeSince(conversation.latestMessage.createdAt)}
                            </span>
                            {isUnread && !isSender && (
                              <Badge variant="default" className="ml-2">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {conversation.latestMessage.subject && (
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            {conversation.latestMessage.subject}
                          </p>
                        )}

                        <p className={`text-sm line-clamp-2 ${isUnread && !isSender ? 'font-medium' : 'text-muted-foreground'}`}>
                          {isSender && <span className="text-primary">You: </span>}
                          {conversation.latestMessage.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
