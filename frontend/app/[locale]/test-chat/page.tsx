'use client'

import { useState, useRef, useEffect } from 'react'
import { chatApi, ChatUserRole } from '@/lib/api'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function TestChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => chatApi.generateSessionId())
  const [userRole, setUserRole] = useState<ChatUserRole>('student')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      // Add placeholder for assistant response
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      let fullResponse = ''

      await chatApi.streamMessage(
        sessionId,
        userMessage,
        userRole,
        (chunk) => {
          fullResponse += chunk
          setMessages(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = { role: 'assistant', content: fullResponse }
            return updated
          })
        },
        () => {
          setIsLoading(false)
        },
        (error) => {
          console.error('Chat error:', error)
          setMessages(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = {
              role: 'assistant',
              content: 'Sorry, there was an error processing your message.'
            }
            return updated
          })
          setIsLoading(false)
        }
      )
    } catch (error) {
      console.error('Chat error:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Chat Test Page</h1>

        {/* Role selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">User Role:</label>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as ChatUserRole)}
            className="border rounded px-3 py-2"
          >
            <option value="student">Student</option>
            <option value="recruiter">Recruiter</option>
            <option value="institution">Institution</option>
          </select>
        </div>

        {/* Chat messages */}
        <div className="bg-white rounded-lg shadow-lg h-[500px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <p className="text-gray-500 text-center">
                Start a conversation! Try:
                <br />- "Find Python developers"
                <br />- "What jobs are available?"
                <br />- "Help me improve my profile"
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white ml-8'
                    : 'bg-gray-100 mr-8'
                }`}
              >
                {msg.content || (isLoading && i === messages.length - 1 ? '...' : '')}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 border rounded-lg px-4 py-2"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Session ID: {sessionId}
        </p>
      </div>
    </div>
  )
}
