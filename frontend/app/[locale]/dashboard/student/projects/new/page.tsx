'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Loader2, Plus, X } from 'lucide-react'
import { Link } from '@/navigation'

interface ProjectData {
  discipline: string
  projectType: string
  skills: string[]
  tools: string[]
  competencies: string[]
}

interface Message {
  role: 'system' | 'user'
  content: string
  data?: ProjectData
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

  // Image upload
  const [imageUrl, setImageUrl] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, analyzing])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { alert('Max 10MB'); return }

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await fetch('/api/upload/image', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        setImageUrl(data.url)
      }
    } catch {
      // Silent fail
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSend = async () => {
    const text = input.trim()
    if (!text || analyzing) return

    const userMessage: Message = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMessage])
    setInput('')

    // If no analysis yet, this is the first message — analyze it
    if (!projectData) {
      setAnalyzing(true)
      setTitle(text.split(/[.\n]/)[0].slice(0, 100))
      setDescription(text)

      try {
        const res = await fetch('/api/ai/analyze-project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: text.split(/[.\n]/)[0].slice(0, 100), description: text }),
        })

        const data: ProjectData = res.ok
          ? await res.json()
          : { discipline: 'TECHNOLOGY', projectType: 'Project', skills: [], tools: [], competencies: [] }

        setProjectData(data)
        setSkills(data.skills || [])
        setTools(data.tools || [])

        setMessages((prev) => [
          ...prev,
          { role: 'system', content: t('chat.result'), data },
          { role: 'system', content: t('chat.followUp') },
        ])
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
      // Follow-up message — append to description
      setDescription((prev) => prev + '\n' + text)
      setMessages((prev) => [
        ...prev,
        { role: 'system', content: t('chat.followUp') },
      ])
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
          isPublic: true,
          featured: false,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      router.push('/dashboard/student/projects')
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
        {/* Image preview */}
        {imageUrl && (
          <div className="relative inline-block">
            <img src={imageUrl} alt="" className="h-16 w-16 object-cover rounded-lg" />
            <button
              onClick={() => setImageUrl('')}
              className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
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
            <label className="cursor-pointer">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <Button variant="outline" size="sm" className="pointer-events-none h-8 text-xs" tabIndex={-1} asChild>
                <span>{uploadingImage ? t('chat.uploading') : t('chat.attach')}</span>
              </Button>
            </label>
            <Button onClick={handleSend} disabled={!input.trim() || analyzing} size="sm" className="h-8">
              {t('chat.send')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
