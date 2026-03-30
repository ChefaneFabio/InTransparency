'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Plus, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface JobForm {
  title: string
  description: string
  location: string
  jobType: string
  workLocation: string
  skills: string[]
  salaryMin: string
  salaryMax: string
}

interface ChatMessage {
  role: 'system' | 'user'
  content: string
}

const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'TEMPORARY', 'FREELANCE'] as const
const WORK_LOCATIONS = ['REMOTE', 'HYBRID', 'ON_SITE'] as const

export default function PostJobPage() {
  const router = useRouter()
  const t = useTranslations('postJob')
  const bottomRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'system', content: t('chat.welcome') },
  ])
  const [input, setInput] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [posting, setPosting] = useState(false)
  const [postError, setPostError] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [newSkill, setNewSkill] = useState('')

  const [form, setForm] = useState<JobForm>({
    title: '',
    description: '',
    location: '',
    jobType: 'FULL_TIME',
    workLocation: 'ON_SITE',
    skills: [],
    salaryMin: '',
    salaryMax: '',
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, showResult])

  const update = (field: keyof JobForm, value: string | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSend = async () => {
    const text = input.trim()
    if (!text || analyzing) return

    setMessages(prev => [...prev, { role: 'user', content: text }])
    setInput('')
    setAnalyzing(true)

    try {
      const res = await fetch('/api/ai/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: text }),
      })
      if (res.ok) {
        const data = await res.json()
        setForm({
          title: data.title || '',
          description: data.description || text,
          location: data.location || '',
          jobType: data.jobType || 'FULL_TIME',
          workLocation: data.workLocation || 'ON_SITE',
          skills: data.skills || [],
          salaryMin: data.salaryMin ? String(data.salaryMin) : '',
          salaryMax: data.salaryMax ? String(data.salaryMax) : '',
        })
      } else {
        setForm(prev => ({ ...prev, description: text }))
      }
    } catch {
      setForm(prev => ({ ...prev, description: text }))
    } finally {
      setAnalyzing(false)
      setMessages(prev => [
        ...prev,
        { role: 'system', content: t('chat.result') },
      ])
      setShowResult(true)
    }
  }

  const handleRefine = async () => {
    const text = input.trim()
    if (!text || analyzing) return

    setMessages(prev => [...prev, { role: 'user', content: text }])
    setInput('')
    setAnalyzing(true)

    const fullContext = `Previous job: ${form.title} - ${form.description}. Location: ${form.location}. Skills: ${form.skills.join(', ')}. User update: ${text}`

    try {
      const res = await fetch('/api/ai/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: fullContext }),
      })
      if (res.ok) {
        const data = await res.json()
        setForm({
          title: data.title || form.title,
          description: data.description || form.description,
          location: data.location || form.location,
          jobType: data.jobType || form.jobType,
          workLocation: data.workLocation || form.workLocation,
          skills: data.skills || form.skills,
          salaryMin: data.salaryMin ? String(data.salaryMin) : form.salaryMin,
          salaryMax: data.salaryMax ? String(data.salaryMax) : form.salaryMax,
        })
      }
    } catch {
      // keep current form
    } finally {
      setAnalyzing(false)
      setMessages(prev => [
        ...prev,
        { role: 'system', content: t('chat.followUp') },
      ])
    }
  }

  const addSkill = () => {
    const s = newSkill.trim()
    if (s && !form.skills.includes(s)) {
      update('skills', [...form.skills, s])
    }
    setNewSkill('')
  }

  const removeSkill = (skill: string) => {
    update('skills', form.skills.filter(s => s !== skill))
  }

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); addSkill() }
  }

  const handlePost = async () => {
    if (!form.title.trim() || !form.description.trim()) return
    setPosting(true)
    setPostError('')
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          location: form.location || null,
          jobType: form.jobType,
          workLocation: form.workLocation,
          requiredSkills: form.skills,
          salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
          salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
          salaryCurrency: 'EUR',
          salaryPeriod: 'yearly',
          showSalary: !!(form.salaryMin || form.salaryMax),
          companyName: '',
          internalApply: true,
        }),
      })
      if (!res.ok) throw new Error()
      router.push('/dashboard/recruiter')
    } catch {
      setPostError(t('review.error'))
    } finally {
      setPosting(false)
    }
  }

  const handleInputKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (showResult) { handleRefine() } else { handleSend() }
    }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto space-y-3 py-4 px-1">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {analyzing && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl px-4 py-2.5 text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {t('chat.analyzing')}
            </div>
          </div>
        )}

        {/* Editable result card */}
        {showResult && (
          <Card className="mt-2">
            <CardContent className="space-y-4 pt-5">
              <div>
                <Label>{t('review.jobTitle')}</Label>
                <Input value={form.title} onChange={e => update('title', e.target.value)} placeholder={t('review.jobTitlePlaceholder')} className="mt-1" />
              </div>
              <div>
                <Label>{t('review.description')}</Label>
                <Textarea value={form.description} onChange={e => update('description', e.target.value)} rows={4} className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{t('review.location')}</Label>
                  <Input value={form.location} onChange={e => update('location', e.target.value)} placeholder={t('review.locationPlaceholder')} className="mt-1" />
                </div>
                <div>
                  <Label>{t('review.jobType')}</Label>
                  <Select value={form.jobType} onValueChange={v => update('jobType', v)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {JOB_TYPES.map(jt => (
                        <SelectItem key={jt} value={jt}>{t(`review.types.${jt}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>{t('review.workLocation')}</Label>
                <Select value={form.workLocation} onValueChange={v => update('workLocation', v)}>
                  <SelectTrigger className="mt-1 w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {WORK_LOCATIONS.map(wl => (
                      <SelectItem key={wl} value={wl}>{t(`review.locations.${wl}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t('review.skills')}</Label>
                <div className="flex flex-wrap gap-1.5 mt-1 mb-2">
                  {form.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="gap-1">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="ml-0.5 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={handleSkillKeyDown} placeholder={t('review.addSkill')} className="flex-1" />
                  <Button variant="outline" size="icon" onClick={addSkill} disabled={!newSkill.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label>{t('review.salary')}</Label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <Input type="number" value={form.salaryMin} onChange={e => update('salaryMin', e.target.value)} placeholder={t('review.salaryMin')} />
                  <Input type="number" value={form.salaryMax} onChange={e => update('salaryMax', e.target.value)} placeholder={t('review.salaryMax')} />
                </div>
              </div>
              {postError && <p className="text-sm text-destructive">{postError}</p>}
              <Button onClick={handlePost} disabled={!form.title.trim() || !form.description.trim() || posting} className="w-full">
                {posting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('chat.posting')}</> : t('chat.post')}
              </Button>
            </CardContent>
          </Card>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t bg-background p-3">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={t('chat.placeholder')}
            rows={1}
            className="flex-1 min-h-[40px] max-h-[120px] resize-none"
          />
          <Button
            onClick={showResult ? handleRefine : handleSend}
            disabled={!input.trim() || analyzing}
            size="sm"
            className="self-end"
          >
            {t('chat.send')}
          </Button>
        </div>
      </div>
    </div>
  )
}
