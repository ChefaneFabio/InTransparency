'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Loader2, Plus, X, Paperclip, Image as ImageIcon, FileText,
  Send, ChevronDown, ChevronUp, Pencil, Check, AlertTriangle,
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

interface ProjectProfile {
  title?: string
  description?: string
  discipline?: string
  projectType?: string
  skills?: string[]
  tools?: string[]
  competencies?: string[]
  courseName?: string
  courseCode?: string
  grade?: string
  professor?: string
  duration?: string
  teamSize?: number
  role?: string
  client?: string
  outcome?: string
  githubUrl?: string
  liveUrl?: string
}

interface Attachment {
  type: 'image' | 'document'
  url: string
  name: string
  mimeType: string
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  attachments?: Attachment[]
}

export default function NewProjectPage() {
  const t = useTranslations('newProject')
  const tp = useTranslations('newProject.profile')
  const locale = useLocale()
  const router = useRouter()

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'system', content: t('chat.welcome') },
  ])
  // Conversation history sent to API (only user + assistant messages)
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [input, setInput] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Progressive project profile
  const [profile, setProfile] = useState<ProjectProfile>({})
  const [completeness, setCompleteness] = useState(0)

  // Editable fields
  const [newSkill, setNewSkill] = useState('')
  const [newTool, setNewTool] = useState('')
  const [profileExpanded, setProfileExpanded] = useState(true)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [showMissingDialog, setShowMissingDialog] = useState(false)
  const [missingFields, setMissingFields] = useState<string[]>([])


  // Attachments
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [allImageUrls, setAllImageUrls] = useState<string[]>([])
  const [allDocumentUrls, setAllDocumentUrls] = useState<Array<{ url: string; name: string }>>([])
  const [uploading, setUploading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, analyzing])

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
        const att: Attachment = { type: 'image', url: data.url, name: file.name, mimeType: file.type }
        setAttachments(prev => [...prev, att])
        setAllImageUrls(prev => [...prev, data.url])
      }
    } catch { /* silent */ } finally {
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
        const att: Attachment = { type: 'document', url: data.url, name: file.name, mimeType: file.type || data.type }
        setAttachments(prev => [...prev, att])
        setAllDocumentUrls(prev => [...prev, { url: data.url, name: file.name }])
      }
    } catch { /* silent */ } finally {
      setUploading(false)
      if (e.target) e.target.value = ''
    }
  }

  const handleSend = async () => {
    const text = input.trim()
    if ((!text && attachments.length === 0) || analyzing) return

    const currentAttachments = [...attachments]

    // Add user message to chat
    const userMsg: ChatMessage = {
      role: 'user',
      content: text || currentAttachments.map(a => a.name).join(', '),
      attachments: currentAttachments.length > 0 ? currentAttachments : undefined,
    }
    setChatMessages(prev => [...prev, userMsg])
    setInput('')
    setAttachments([])
    setAnalyzing(true)

    // Build conversation for API
    const newHistory = [...conversationHistory, { role: 'user' as const, content: text || `[Uploaded: ${currentAttachments.map(a => a.name).join(', ')}]` }]

    try {
      const res = await fetch('/api/ai/analyze-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory,
          currentProjectData: profile,
          imageUrls: allImageUrls,
          documentUrls: allDocumentUrls,
          locale,
        }),
      })

      if (res.ok) {
        const data = await res.json()

        // Update profile with new extracted data (merge, don't replace)
        if (data.projectData) {
          setProfile(prev => {
            const merged = { ...prev }
            for (const [key, value] of Object.entries(data.projectData)) {
              if (value !== undefined && value !== null && value !== '') {
                if (Array.isArray(value) && Array.isArray((prev as any)[key])) {
                  // Merge arrays, deduplicate
                  const existing: string[] = (prev as any)[key] || []
                  const merged_arr = Array.from(new Set([...existing, ...(value as string[])]))
                  ;(merged as any)[key] = merged_arr
                } else {
                  ;(merged as any)[key] = value
                }
              }
            }
            return merged
          })
        }

        if (data.completeness) setCompleteness(data.completeness)

        // Add AI response to chat and conversation history
        const aiMessage = data.message || t('chat.followUp')
        setChatMessages(prev => [...prev, { role: 'assistant', content: aiMessage }])
        setConversationHistory([...newHistory, { role: 'assistant', content: aiMessage }])
      } else {
        setChatMessages(prev => [...prev, { role: 'assistant', content: t('chat.error') }])
        setConversationHistory(newHistory)
      }
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: t('chat.error') }])
      setConversationHistory(newHistory)
    } finally {
      setAnalyzing(false)
    }
  }

  const getMissingFields = (): string[] => {
    const missing: string[] = []
    if (!profile.title) missing.push(tp('projectTitle'))
    if (!profile.description) missing.push(tp('description') || 'Description')
    if (!profile.discipline) missing.push('Discipline')
    if (!profile.skills || profile.skills.length === 0) missing.push(tp('skills'))
    if (!profile.role) missing.push(tp('role'))
    if (!profile.duration) missing.push(tp('duration'))
    if (!profile.outcome) missing.push(tp('outcome'))
    if (!profile.courseName && !profile.client) missing.push(tp('courseName') + ' / ' + tp('client'))
    return missing
  }

  const handleCreateClick = () => {
    if (!profile.title || !profile.description || !profile.discipline) {
      alert(t('chat.incompleteProfile'))
      return
    }
    const missing = getMissingFields()
    if (missing.length > 0) {
      setMissingFields(missing)
      setShowMissingDialog(true)
    } else {
      submitProject()
    }
  }

  const submitProject = async () => {
    setShowMissingDialog(false)
    setSubmitting(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: profile.title,
          description: profile.description,
          discipline: profile.discipline || 'TECHNOLOGY',
          projectType: profile.projectType || 'Project',
          skills: profile.skills || [],
          tools: profile.tools || [],
          competencies: profile.competencies || [],
          courseName: profile.courseName,
          courseCode: profile.courseCode,
          grade: profile.grade,
          professor: profile.professor,
          duration: profile.duration,
          teamSize: profile.teamSize,
          role: profile.role,
          client: profile.client,
          outcome: profile.outcome,
          githubUrl: profile.githubUrl,
          liveUrl: profile.liveUrl,
          images: allImageUrls,
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

  const startEdit = (field: string, value: string) => {
    setEditingField(field)
    setEditValue(value)
  }

  const saveEdit = (field: string) => {
    setProfile(prev => ({ ...prev, [field]: editValue }))
    setEditingField(null)
    setEditValue('')
  }

  const addArrayItem = (value: string, field: 'skills' | 'tools', inputSetter: (v: string) => void) => {
    if (!value.trim()) return
    setProfile(prev => ({
      ...prev,
      [field]: Array.from(new Set([...(prev[field] || []), value.trim()])),
    }))
    inputSetter('')
  }

  const removeArrayItem = (index: number, field: 'skills' | 'tools') => {
    setProfile(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }))
  }

  const hasProfile = Object.keys(profile).length > 0 && (profile.title || profile.skills?.length)

  return (
    <div className="max-w-4xl mx-auto pb-12 px-4">
      <div className={`flex flex-col ${hasProfile ? 'lg:flex-row' : ''} gap-6`}>
        {/* Chat area */}
        <div className={`flex-1 flex flex-col ${hasProfile ? 'lg:max-w-[55%]' : 'max-w-2xl mx-auto w-full'}`}>
          {/* Messages */}
          <div className="flex-1 space-y-3 py-6 min-h-[40vh]">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
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
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {t('chat.analyzing')}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Create button */}
          {hasProfile && (
            <div className="pb-3">
              <Button
                onClick={handleCreateClick}
                disabled={submitting || !profile.title || !profile.discipline}
                className="w-full"
                size="lg"
              >
                {submitting ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t('review.creating')}</>
                ) : (
                  <>{t('chat.looksGood')} ({completeness}%)</>
                )}
              </Button>
            </div>
          )}

          {/* Missing fields dialog */}
          <Dialog open={showMissingDialog} onOpenChange={setShowMissingDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  {t('missing.title')}
                </DialogTitle>
                <DialogDescription>{t('missing.description')}</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-2">
                {missingFields.map((field) => (
                  <div key={field} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    {field}
                  </div>
                ))}
              </div>
              <DialogFooter className="flex gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setShowMissingDialog(false)}>
                  {t('missing.goBack')}
                </Button>
                <Button onClick={submitProject}>
                  {t('missing.createAnyway')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Input area */}
          <div className="border-t border-border pt-4 space-y-3">
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attachments.map((att, i) => (
                  <div key={i} className="relative group">
                    {att.type === 'image' ? (
                      <img src={att.url} alt={att.name} className="h-14 w-14 object-cover rounded-lg" />
                    ) : (
                      <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-2 text-xs">
                        <FileText className="h-3.5 w-3.5" />
                        <span className="truncate max-w-[100px]">{att.name}</span>
                      </div>
                    )}
                    <button
                      onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
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
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
                  }}
                  placeholder={t('chat.placeholder')}
                  rows={2}
                  className="resize-none"
                  disabled={analyzing || submitting}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip" onChange={handleFileUpload} className="hidden" />
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => imageInputRef.current?.click()} disabled={uploading || analyzing}>
                    {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageIcon className="h-3.5 w-3.5" />}
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => fileInputRef.current?.click()} disabled={uploading || analyzing}>
                    <Paperclip className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Button onClick={handleSend} disabled={(!input.trim() && attachments.length === 0) || analyzing} size="sm" className="h-8">
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Project Profile Panel */}
        {hasProfile && (
          <div className="lg:w-[45%] lg:sticky lg:top-4 lg:self-start">
            <GlassCard hover={false}>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{tp('title')}</h3>
                  <button onClick={() => setProfileExpanded(!profileExpanded)}>
                    {profileExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>

                {/* Completeness bar */}
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{tp('completeness')}</span>
                    <span>{completeness}%</span>
                  </div>
                  <Progress value={completeness} className="h-2" />
                </div>

                {profileExpanded && (
                  <div className="space-y-3">
                    {/* Title */}
                    <ProfileField
                      label={tp('projectTitle')}
                      value={profile.title}
                      field="title"
                      editing={editingField}
                      editValue={editValue}
                      onStartEdit={startEdit}
                      onSaveEdit={saveEdit}
                      onEditChange={setEditValue}
                    />

                    {/* Discipline & Type */}
                    {(profile.discipline || profile.projectType) && (
                      <div className="flex gap-2 flex-wrap">
                        {profile.discipline && <Badge variant="secondary">{profile.discipline}</Badge>}
                        {profile.projectType && <Badge variant="outline">{profile.projectType}</Badge>}
                      </div>
                    )}

                    {/* Skills */}
                    {(profile.skills?.length || 0) > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1.5">{tp('skills')}</p>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {profile.skills?.map((s, i) => (
                            <Badge key={s} variant="secondary" className="gap-1">
                              {s}
                              <button onClick={() => removeArrayItem(i, 'skills')} className="ml-0.5 hover:text-destructive"><X className="h-3 w-3" /></button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-1.5">
                          <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem(newSkill, 'skills', setNewSkill))}
                            placeholder={tp('addSkill')} className="h-7 text-xs flex-1" />
                          <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => addArrayItem(newSkill, 'skills', setNewSkill)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Tools */}
                    {(profile.tools?.length || 0) > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1.5">{tp('tools')}</p>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {profile.tools?.map((t, i) => (
                            <Badge key={t} variant="secondary" className="gap-1">
                              {t}
                              <button onClick={() => removeArrayItem(i, 'tools')} className="ml-0.5 hover:text-destructive"><X className="h-3 w-3" /></button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-1.5">
                          <Input value={newTool} onChange={(e) => setNewTool(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem(newTool, 'tools', setNewTool))}
                            placeholder={tp('addTool')} className="h-7 text-xs flex-1" />
                          <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => addArrayItem(newTool, 'tools', setNewTool)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Context fields */}
                    <ProfileField label={tp('role')} value={profile.role} field="role" editing={editingField} editValue={editValue} onStartEdit={startEdit} onSaveEdit={saveEdit} onEditChange={setEditValue} />
                    <ProfileField label={tp('duration')} value={profile.duration} field="duration" editing={editingField} editValue={editValue} onStartEdit={startEdit} onSaveEdit={saveEdit} onEditChange={setEditValue} />
                    {profile.teamSize && <div className="text-xs"><span className="text-muted-foreground">{tp('teamSize')}:</span> <span className="font-medium">{profile.teamSize}</span></div>}

                    {/* Academic */}
                    <ProfileField label={tp('courseName')} value={profile.courseName} field="courseName" editing={editingField} editValue={editValue} onStartEdit={startEdit} onSaveEdit={saveEdit} onEditChange={setEditValue} />
                    <ProfileField label={tp('grade')} value={profile.grade} field="grade" editing={editingField} editValue={editValue} onStartEdit={startEdit} onSaveEdit={saveEdit} onEditChange={setEditValue} />
                    <ProfileField label={tp('professor')} value={profile.professor} field="professor" editing={editingField} editValue={editValue} onStartEdit={startEdit} onSaveEdit={saveEdit} onEditChange={setEditValue} />

                    {/* Outcome */}
                    <ProfileField label={tp('outcome')} value={profile.outcome} field="outcome" editing={editingField} editValue={editValue} onStartEdit={startEdit} onSaveEdit={saveEdit} onEditChange={setEditValue} />
                    <ProfileField label={tp('client')} value={profile.client} field="client" editing={editingField} editValue={editValue} onStartEdit={startEdit} onSaveEdit={saveEdit} onEditChange={setEditValue} />

                    {/* Links */}
                    <ProfileField label="GitHub" value={profile.githubUrl} field="githubUrl" editing={editingField} editValue={editValue} onStartEdit={startEdit} onSaveEdit={saveEdit} onEditChange={setEditValue} />
                    <ProfileField label={tp('liveUrl')} value={profile.liveUrl} field="liveUrl" editing={editingField} editValue={editValue} onStartEdit={startEdit} onSaveEdit={saveEdit} onEditChange={setEditValue} />
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  )
}

/** Inline-editable field */
function ProfileField({
  label, value, field, editing, editValue, onStartEdit, onSaveEdit, onEditChange,
}: {
  label: string
  value?: string
  field: string
  editing: string | null
  editValue: string
  onStartEdit: (field: string, value: string) => void
  onSaveEdit: (field: string) => void
  onEditChange: (value: string) => void
}) {
  if (!value && editing !== field) return null

  if (editing === field) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground shrink-0">{label}:</span>
        <Input
          value={editValue}
          onChange={(e) => onEditChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSaveEdit(field)}
          className="h-7 text-xs flex-1"
          autoFocus
        />
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onSaveEdit(field)}>
          <Check className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5 group text-xs">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium truncate">{value}</span>
      <button onClick={() => onStartEdit(field, value || '')} className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Pencil className="h-3 w-3 text-muted-foreground" />
      </button>
    </div>
  )
}
