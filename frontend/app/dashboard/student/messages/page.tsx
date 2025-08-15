'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Search, Send, Paperclip, MoreVertical, Star, Archive } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const conversations = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'HR Manager at TechCorp',
    lastMessage: 'Thanks for your interest! We\'d like to schedule an interview.',
    timestamp: '2 hours ago',
    unread: 2,
    avatar: 'SJ',
    online: true,
    starred: true
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Engineering Manager at StartupXYZ',
    lastMessage: 'Your portfolio looks impressive. Let\'s discuss the role.',
    timestamp: '1 day ago',
    unread: 0,
    avatar: 'MC',
    online: false,
    starred: false
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    title: 'Recruiter at BigTech Solutions',
    lastMessage: 'We have a few questions about your React experience.',
    timestamp: '2 days ago',
    unread: 1,
    avatar: 'ER',
    online: true,
    starred: false
  },
  {
    id: '4',
    name: 'David Kim',
    title: 'CTO at InnovateTech',
    lastMessage: 'Congratulations! We\'d like to extend an offer.',
    timestamp: '3 days ago',
    unread: 0,
    avatar: 'DK',
    online: false,
    starred: true
  }
]

const messages = [
  {
    id: '1',
    sender: 'Sarah Johnson',
    content: 'Hi! I came across your portfolio on InTransparency and I\'m really impressed with your projects, especially the AI Task Manager.',
    timestamp: '10:30 AM',
    isMe: false
  },
  {
    id: '2',
    sender: 'You',
    content: 'Thank you! I\'m really passionate about building AI-powered applications. I\'d love to learn more about the frontend developer position.',
    timestamp: '10:45 AM',
    isMe: true
  },
  {
    id: '3',
    sender: 'Sarah Johnson',
    content: 'Perfect! Your skills align well with what we\'re looking for. We use React and TypeScript primarily, which I see you have experience with.',
    timestamp: '11:00 AM',
    isMe: false
  },
  {
    id: '4',
    sender: 'Sarah Johnson',
    content: 'Would you be available for a quick call this Thursday at 2 PM to discuss the role in more detail?',
    timestamp: '11:01 AM',
    isMe: false
  },
  {
    id: '5',
    sender: 'You',
    content: 'That sounds great! Thursday at 2 PM works perfectly for me. Should I prepare anything specific for the call?',
    timestamp: '11:15 AM',
    isMe: true
  },
  {
    id: '6',
    sender: 'Sarah Johnson',
    content: 'Thanks for your interest! We\'d like to schedule an interview. Just be ready to discuss your experience with React and any challenges you faced in your projects.',
    timestamp: '2 hours ago',
    isMe: false
  }
]

export default function StudentMessages() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [messageInput, setMessageInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sendMessage = () => {
    if (messageInput.trim()) {
      // Add message logic here
      setMessageInput('')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">
          Communicate with recruiters and potential employers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer hover:bg-muted transition-colors ${
                    selectedConversation.id === conversation.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>{conversation.avatar}</AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{conversation.name}</h3>
                        <div className="flex items-center space-x-1">
                          {conversation.starred && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                          {conversation.unread > 0 && (
                            <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conversation.title}</p>
                      <p className="text-sm text-muted-foreground truncate mt-1">{conversation.lastMessage}</p>
                      <p className="text-xs text-muted-foreground mt-1">{conversation.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="lg:col-span-2 flex flex-col">
          {/* Header */}
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>{selectedConversation.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedConversation.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedConversation.title}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Star className="h-4 w-4 mr-2" />
                    {selectedConversation.starred ? 'Unstar' : 'Star'}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.isMe
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex items-end space-x-2">
              <Button variant="ghost" size="sm">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Textarea
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
              />
              <Button onClick={sendMessage} disabled={!messageInput.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}