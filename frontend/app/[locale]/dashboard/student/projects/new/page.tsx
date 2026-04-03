'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Loader2, Plus, X, Paperclip, Image as ImageIcon, FileText } from 'lucide-react'
import { Link } from '@/navigation'

interface ProjectData {
  discipline: string
  projectType: string
  skills: string[]
  tools: string[]
  competencies: string[]
  companyInfo?: string
}

interface Attachment {
  type: 'image' | 'document'
  url: string
  name: string
  mimeType: string
}

interface Message {
  role: 'system' | 'user'
  content: string
  data?: ProjectData
  attachments?: Attachment[]
}

export default function NewProjectPage() {
  const t = useTranslations('newProject')
  const router = useRouter()

  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: t('chat.welcome') },
  ])
  const [input, setInput] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Extracted project data (editable)
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [tools, setTools] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [newTool, setNewTool] = useState('')

  // Attachments
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [uploading, setUploading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, analyzing])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { alert('Max 10MB'); return }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await fetch('/api/upload/image', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        setAttachments(prev => [...prev, {
          type: 'image',
          url: data.url,
          name: file.name,
          mimeType: file.type,
        }])
      }
    } catch {
      // Silent fail
    } finally {
      setUploading(false)
      if (e.target) e.target.value = ''
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 25 * 1024 * 1024) { alert('Max 25MB'); return }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('document', file)
      const res = await fetch('/api/upload/document', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        setAttachments(prev => [...prev, {
          type: 'document',
          url: data.url,
          name: file.name,
          mimeType: file.type || data.type,
        }])
      }
    } catch {
      // Silent fail
    } finally {
      setUploading(false)
      if (e.target) e.target.value = ''
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleSend = async () => {
    const text = input.trim()
    if ((!text && attachments.length === 0) || analyzing) return

    const currentAttachments = [...attachments]
    const userMessage: Message = {
      role: 'user',
      content: text,
      attachments: currentAttachments.length > 0 ? currentAttachments : undefined,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setAttachments([])

    // If no analysis yet, this is the first message — analyze it
    if (!projectData) {
      setAnalyzing(true)
      if (text) {
        setTitle(text.split(/[.\n]/)[0].slice(0, 100))
        setDescription(text)
      }

      try {
        const imageUrls = currentAttachments
          .filter(a => a.type === 'image')
          .map(a => a.url)
        const documentUrls = currentAttachments
          .filter(a => a.type === 'document')
          .map(a => ({ url: a.url, name: a.name }))

        const res = await fetch('/api/ai/analyze-project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: text ? text.split(/[.\n]/)[0].slice(0, 100) : '',
            description: text,
            imageUrls,
            documentUrls,
            searchWeb: true,
          }),
        })

        const data: ProjectData = res.ok
          ? await res.json()
          : { discipline: 'TECHNOLOGY', projectType: 'Project', skills: [], tools: [], competencies: [] }

        setProjectData(data)
        setSkills(data.skills || [])
        setTools(data.tools || [])
        if (!text && data.companyInfo) {
          setDescription(data.companyInfo)
        }

        const resultMessages: Message[] = [
          { role: 'system', content: t('chat.result'), data },
        ]
        if (data.companyInfo) {
          resultMessages.push({ role: 'system', content: data.companyInfo })
        }
        resultMessages.push({ role: 'system', content: t('chat.followUp') })

        setMessages((prev) => [...prev, ...resultMessages])
      } catch {
        const fallback: ProjectData = { discipline: 'TECHNOLOGY', projectType: 'Project', skills: [], tools: [], competencies: [] }
        setProjectData(fallback)
        setSkills([])
        setTools([])
        setMessages((prev) => [
          ...prev,
          { role: 'system', content: t('chat.result'), data: fallback },
          { role: 'system', content: t('chat.followUp') },
        ])
      } finally {
        setAnalyzing(false)
      }
    } else {
      // Follow-up message — re-analyze with additional context
      setAnalyzing(true)
      const newDescription = description + '\n' + text
      setDescription(newDescription)

      try {
        const imageUrls = currentAttachments
          .filter(a => a.type === 'image')
          .map(a => a.url)

        const res = await fetch('/api/ai/analyze-project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            description: newDescription,
            imageUrls,
            searchWeb: true,
            isFollowUp: true,
            existingSkills: skills,
            existingTools: tools,
          }),
        })

        if (res.ok) {
          const data: ProjectData = await res.json()
          // Merge new skills/tools with existing
          const mergedSkills = Array.from(new Set([...skills, ...(data.skills || [])]))
          const mergedTools = Array.from(new Set([...tools, ...(data.tools || [])]))
          setSkills(mergedSkills)
          setTools(mergedTools)
          setProjectData(data)

          const followUpMessages: Message[] = []
          if (data.companyInfo) {
            followUpMessages.push({ role: 'system', content: data.companyInfo })
          }
          followUpMessages.push({
            role: 'system',
            content: t('chat.followUp'),
            data: { ...data, skills: mergedSkills, tools: mergedTools },
          })
          setMessages((prev) => [...prev, ...followUpMessages])
        } else {
          setMessages((prev) => [
            ...prev,
            { role: 'system', content: t('chat.followUp') },
          ])
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: 'system', content: t('chat.followUp') },
        ])
      } finally {
        setAnalyzing(false)
      }
    }
  }

  const addItem = (value: string, list: string[], setter: (v: string[]) => void, inputSetter: (v: string) => void) => {
    if (value.trim() && !list.includes(value.trim())) {
      setter([...list, value.trim()])
      inputSetter('')
    }
  }

  const removeItem = (index: number, list: string[], setter: (v: string[]) => void) => {
    setter(list.filter((_, i) => i !== index))
  }

  const handleCreate = async () => {
    setSubmitting(true)
    try {
      // Collect all attachment URLs
      const allAttachments = messages
        .filter(m => m.attachments)
        .flatMap(m => m.attachments || [])
      const imageUrl = allAttachments.find(a => a.type === 'image')?.url
      const images = allAttachments.filter(a => a.type === 'image').map(a => a.url)
      const documents = allAttachments.filter(a => a.type === 'document').map(a => a.url)

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          discipline: projectData?.discipline || 'TECHNOLOGY',
          projectType: projectData?.projectType || 'Project',
          skills,
          tools,
          competencies: projectData?.competencies || [],
          imageUrl: imageUrl || undefined,
          images,
          isPublic: true,
          featured: false,
        }),
      })
      if (!res.ok) throw new Error('Failed')

      // If there are documents, upload them to the project
      if (documents.length > 0) {
        const projectRes = await res.json()
        // Documents are already uploaded to R2, we'd link them to the project
        // via the project files endpoint if needed
        router.push('/dashboard/student/projects')
      } else {
        router.push('/dashboard/student/projects')
      }
      router.refresh()
    } catch {
      alert(t('error'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="max-w-2xl mx-auto pb-12 flex flex-col min-h-[80vh]">
      {/* Messages */}
      <div className="flex-1 space-y-4 py-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>

              {/* User attachments */}
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

              {/* Structured data card */}
              {msg.data && (
                <Card className="mt-3 border-border/50">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex gap-2">
                      <Badge variant="secondary">{msg.data.discipline}</Badge>
                      <Badge variant="outline">{msg.data.projectType}</Badge>
                    </div>

                    {/* Skills */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">{t('review.skills')}</p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {skills.map((s, si) => (
                          <Badge key={s} variant="secondary" className="gap-1">
                            {s}
                            <button onClick={() => removeItem(si, skills, setSkills)} className="ml-1 hover:text-destructive">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-1.5">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(newSkill, skills, setSkills, setNewSkill))}
                          placeholder={t('review.addSkill')}
                          className="h-8 text-xs flex-1"
                        />
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => addItem(newSkill, skills, setSkills, setNewSkill)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Tools */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">{t('review.tools')}</p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {tools.map((tool, ti) => (
                          <Badge key={tool} variant="secondary" className="gap-1">
                            {tool}
                            <button onClick={() => removeItem(ti, tools, setTools)} className="ml-1 hover:text-destructive">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-1.5">
                        <Input
                          value={newTool}
                          onChange={(e) => setNewTool(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(newTool, tools, setTools, setNewTool))}
                          placeholder={t('review.addTool')}
                          className="h-8 text-xs flex-1"
                        />
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => addItem(newTool, tools, setTools, setNewTool)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {analyzing && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {t('chat.analyzing')}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Create project button — shown after analysis */}
      {projectData && (
        <div className="pb-4">
          <Button onClick={handleCreate} disabled={submitting} className="w-full" size="lg">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('review.creating')}
              </>
            ) : (
              t('chat.looksGood')
            )}
          </Button>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-border pt-4 space-y-3">
        {/* Attachment previews */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {attachments.map((att, i) => (
              <div key={i} className="relative group">
                {att.type === 'image' ? (
                  <img src={att.url} alt={att.name} className="h-16 w-16 object-cover rounded-lg" />
                ) : (
                  <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-2 text-xs">
                    <FileText className="h-4 w-4" />
                    <span className="truncate max-w-[100px]">{att.name}</span>
                  </div>
                )}
                <button
                  onClick={() => removeAttachment(i)}
                  className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('chat.placeholder')}
              rows={2}
              className="resize-none"
              disabled={analyzing || submitting}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            {/* Image upload */}
            <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            {/* Document upload */}
            <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar" onChange={handleFileUpload} className="hidden" />

            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploading || analyzing}
                title={t('chat.attachImage')}
              >
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageIcon className="h-3.5 w-3.5" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || analyzing}
                title={t('chat.attachFile')}
              >
                <Paperclip className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Button onClick={handleSend} disabled={(!input.trim() && attachments.length === 0) || analyzing} size="sm" className="h-8">
              {t('chat.send')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
