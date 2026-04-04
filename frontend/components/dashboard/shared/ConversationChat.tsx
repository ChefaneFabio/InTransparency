'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Loader2, Plus, X, Paperclip, Image as ImageIcon, FileText,
  Send, ChevronDown, ChevronUp, Pencil, Check,
} from 'lucide-react'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  attachments?: Array<{ type: 'image' | 'document'; url: string; name: string }>
}

export interface ProfileField {
  key: string
  label: string
  type: 'text' | 'array' | 'number' | 'badge'
}

interface ConversationChatProps {
  welcomeMessage: string
  placeholder: string
  analyzingText: string
  createButtonText: string
  creatingText: string
  incompleteText: string
  errorText: string
  profileTitle: string
  completenessLabel: string
  addSkillPlaceholder?: string
  addToolPlaceholder?: string

  // Profile config
  profileFields: ProfileField[]
  profile: Record<string, any>
  completeness: number

  // Callbacks
  onSendMessage: (text: string, attachments: Array<{ type: 'image' | 'document'; url: string; name: string }>) => Promise<void>
  onProfileChange: (field: string, value: any) => void
  onArrayAdd: (field: string, value: string) => void
  onArrayRemove: (field: string, index: number) => void
  onCreate: () => Promise<void>
  canCreate: boolean

  // Optional: file upload support
  allowImages?: boolean
  allowDocuments?: boolean
  uploadImage?: (file: File) => Promise<{ url: string } | null>
  uploadDocument?: (file: File) => Promise<{ url: string; type: string } | null>

  // Messages from parent
  messages: ChatMessage[]
  analyzing: boolean
  submitting: boolean
}

export function ConversationChat({
  welcomeMessage,
  placeholder,
  analyzingText,
  createButtonText,
  creatingText,
  incompleteText,
  errorText,
  profileTitle,
  completenessLabel,
  addSkillPlaceholder = 'Add...',
  addToolPlaceholder = 'Add...',
  profileFields,
  profile,
  completeness,
  onSendMessage,
  onProfileChange,
  onArrayAdd,
  onArrayRemove,
  onCreate,
  canCreate,
  allowImages = false,
  allowDocuments = false,
  uploadImage,
  uploadDocument,
  messages,
  analyzing,
  submitting,
}: ConversationChatProps) {
  const [input, setInput] = useState('')
  const [attachments, setAttachments] = useState<Array<{ type: 'image' | 'document'; url: string; name: string; mimeType: string }>>([])
  const [uploading, setUploading] = useState(false)
  const [profileExpanded, setProfileExpanded] = useState(true)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [arrayInputs, setArrayInputs] = useState<Record<string, string>>({})

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, analyzing])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !uploadImage) return
    setUploading(true)
    try {
      const result = await uploadImage(file)
      if (result) {
        setAttachments(prev => [...prev, { type: 'image', url: result.url, name: file.name, mimeType: file.type }])
      }
    } finally {
      setUploading(false)
      if (e.target) e.target.value = ''
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !uploadDocument) return
    setUploading(true)
    try {
      const result = await uploadDocument(file)
      if (result) {
        setAttachments(prev => [...prev, { type: 'document', url: result.url, name: file.name, mimeType: result.type }])
      }
    } finally {
      setUploading(false)
      if (e.target) e.target.value = ''
    }
  }

  const handleSend = async () => {
    const text = input.trim()
    if ((!text && attachments.length === 0) || analyzing) return
    const currentAttachments = attachments.map(({ type, url, name }) => ({ type, url, name }))
    setInput('')
    setAttachments([])
    await onSendMessage(text, currentAttachments)
  }

  const hasProfile = Object.keys(profile).length > 0 && Object.values(profile).some(v =>
    v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0)
  )

  return (
    <div className="max-w-4xl mx-auto pb-12 px-4">
      <div className={`flex flex-col ${hasProfile ? 'lg:flex-row' : ''} gap-6`}>
        {/* Chat */}
        <div className={`flex-1 flex flex-col ${hasProfile ? 'lg:max-w-[55%]' : 'max-w-2xl mx-auto w-full'}`}>
          <div className="flex-1 space-y-3 py-6 min-h-[40vh]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.attachments.map((att, ai) => (
                        <div key={ai}>
                          {att.type === 'image' ? (
                            <img src={att.url} alt={att.name} className="h-20 w-20 object-cover rounded-lg" />
                          ) : (
                            <div className="flex items-center gap-1.5 bg-background/50 rounded-lg px-2.5 py-1.5 text-xs">
                              <FileText className="h-3.5 w-3.5" />
                              <span className="truncate max-w-[120px]">{att.name}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {analyzing && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> {analyzingText}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Create button */}
          {hasProfile && (
            <div className="pb-3">
              <Button onClick={onCreate} disabled={submitting || !canCreate} className="w-full" size="lg">
                {submitting ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{creatingText}</>
                ) : (
                  <>{createButtonText} ({completeness}%)</>
                )}
              </Button>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-border pt-4 space-y-3">
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attachments.map((att, i) => (
                  <div key={i} className="relative group">
                    {att.type === 'image' ? (
                      <img src={att.url} alt={att.name} className="h-14 w-14 object-cover rounded-lg" />
                    ) : (
                      <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-2 text-xs">
                        <FileText className="h-3.5 w-3.5" /><span className="truncate max-w-[100px]">{att.name}</span>
                      </div>
                    )}
                    <button onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2 items-end">
              <Textarea value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                placeholder={placeholder} rows={2} className="resize-none flex-1" disabled={analyzing || submitting} />
              <div className="flex flex-col gap-1.5">
                {allowImages && <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />}
                {allowDocuments && <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip" onChange={handleFileUpload} className="hidden" />}
                <div className="flex gap-1">
                  {allowImages && (
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => imageInputRef.current?.click()} disabled={uploading || analyzing}>
                      {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageIcon className="h-3.5 w-3.5" />}
                    </Button>
                  )}
                  {allowDocuments && (
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => fileInputRef.current?.click()} disabled={uploading || analyzing}>
                      <Paperclip className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                <Button onClick={handleSend} disabled={(!input.trim() && attachments.length === 0) || analyzing} size="sm" className="h-8">
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile panel */}
        {hasProfile && (
          <div className="lg:w-[45%] lg:sticky lg:top-4 lg:self-start">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{profileTitle}</h3>
                  <button onClick={() => setProfileExpanded(!profileExpanded)}>
                    {profileExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{completenessLabel}</span><span>{completeness}%</span>
                  </div>
                  <Progress value={completeness} className="h-2" />
                </div>

                {profileExpanded && (
                  <div className="space-y-3">
                    {profileFields.map((field) => {
                      const value = profile[field.key]
                      if (field.type === 'array') {
                        const arr = (value as string[]) || []
                        if (arr.length === 0 && editingField !== field.key) return null
                        const inputVal = arrayInputs[field.key] || ''
                        return (
                          <div key={field.key}>
                            <p className="text-xs font-medium text-muted-foreground mb-1.5">{field.label}</p>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {arr.map((item, i) => (
                                <Badge key={item} variant="secondary" className="gap-1">
                                  {item}
                                  <button onClick={() => onArrayRemove(field.key, i)} className="ml-0.5 hover:text-destructive"><X className="h-3 w-3" /></button>
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-1.5">
                              <Input value={inputVal}
                                onChange={(e) => setArrayInputs(prev => ({ ...prev, [field.key]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    onArrayAdd(field.key, inputVal)
                                    setArrayInputs(prev => ({ ...prev, [field.key]: '' }))
                                  }
                                }}
                                placeholder={`Add...`} className="h-7 text-xs flex-1" />
                              <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => {
                                onArrayAdd(field.key, inputVal)
                                setArrayInputs(prev => ({ ...prev, [field.key]: '' }))
                              }}><Plus className="h-3 w-3" /></Button>
                            </div>
                          </div>
                        )
                      }

                      if (field.type === 'badge') {
                        if (!value) return null
                        return (
                          <div key={field.key} className="flex gap-2 flex-wrap">
                            <Badge variant="secondary">{value}</Badge>
                          </div>
                        )
                      }

                      // Text/number field
                      if (!value && editingField !== field.key) return null

                      if (editingField === field.key) {
                        return (
                          <div key={field.key} className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground shrink-0">{field.label}:</span>
                            <Input value={editValue} onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') { onProfileChange(field.key, editValue); setEditingField(null) } }}
                              className="h-7 text-xs flex-1" autoFocus />
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { onProfileChange(field.key, editValue); setEditingField(null) }}>
                              <Check className="h-3 w-3" />
                            </Button>
                          </div>
                        )
                      }

                      return (
                        <div key={field.key} className="flex items-center gap-1.5 group text-xs">
                          <span className="text-muted-foreground">{field.label}:</span>
                          <span className="font-medium truncate">{String(value)}</span>
                          <button onClick={() => { setEditingField(field.key); setEditValue(String(value || '')) }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Pencil className="h-3 w-3 text-muted-foreground" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
