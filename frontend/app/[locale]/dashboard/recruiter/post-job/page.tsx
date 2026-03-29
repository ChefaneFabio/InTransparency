'use client'

import { useState, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, ArrowLeft, Plus, X } from 'lucide-react'
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

const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'TEMPORARY', 'FREELANCE'] as const
const WORK_LOCATIONS = ['REMOTE', 'HYBRID', 'ON_SITE'] as const

export default function PostJobPage() {
  const router = useRouter()
  const t = useTranslations('postJob')

  const [step, setStep] = useState<'describe' | 'review'>('describe')
  const [rawDescription, setRawDescription] = useState('')
  const [url, setUrl] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [posting, setPosting] = useState(false)
  const [postError, setPostError] = useState('')
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

  const update = (field: keyof JobForm, value: string | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleContinue = async () => {
    if (!rawDescription.trim()) return
    setAnalyzing(true)
    try {
      const res = await fetch('/api/ai/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: rawDescription, url: url || undefined }),
      })
      if (res.ok) {
        const data = await res.json()
        setForm({
          title: data.title || '',
          description: data.description || rawDescription,
          location: data.location || '',
          jobType: data.jobType || 'FULL_TIME',
          workLocation: data.workLocation || 'ON_SITE',
          skills: data.skills || [],
          salaryMin: data.salaryMin ? String(data.salaryMin) : '',
          salaryMax: data.salaryMax ? String(data.salaryMax) : '',
        })
      } else {
        setForm(prev => ({ ...prev, description: rawDescription }))
      }
    } catch {
      setForm(prev => ({ ...prev, description: rawDescription }))
    } finally {
      setAnalyzing(false)
      setStep('review')
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
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/recruiter">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back')}
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      {/* Step indicator */}
      <div className="flex gap-2 text-sm">
        <span className={step === 'describe' ? 'font-semibold text-primary' : 'text-muted-foreground'}>
          1. {t('steps.describe')}
        </span>
        <span className="text-muted-foreground">/</span>
        <span className={step === 'review' ? 'font-semibold text-primary' : 'text-muted-foreground'}>
          2. {t('steps.review')}
        </span>
      </div>

      {step === 'describe' && (
        <Card>
          <CardHeader>
            <CardTitle>{t('input.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{t('input.description')}</Label>
              <Textarea
                value={rawDescription}
                onChange={e => setRawDescription(e.target.value)}
                placeholder={t('input.placeholder')}
                rows={8}
                className="mt-1"
              />
            </div>
            <div>
              <Label>{t('input.urlLabel')}</Label>
              <Input
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder={t('input.urlPlaceholder')}
                className="mt-1"
              />
            </div>
            <Button
              onClick={handleContinue}
              disabled={!rawDescription.trim() || analyzing}
              className="w-full"
            >
              {analyzing ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('input.processing')}</>
              ) : (
                t('input.continue')
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'review' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('review.title')}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setStep('describe')}>
              <ArrowLeft className="mr-1 h-4 w-4" />{t('backToEdit')}
            </Button>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label>{t('review.jobTitle')}</Label>
              <Input
                value={form.title}
                onChange={e => update('title', e.target.value)}
                placeholder={t('review.jobTitlePlaceholder')}
                className="mt-1"
              />
            </div>

            <div>
              <Label>{t('review.description')}</Label>
              <Textarea
                value={form.description}
                onChange={e => update('description', e.target.value)}
                rows={6}
                className="mt-1"
              />
            </div>

            <div>
              <Label>{t('review.location')}</Label>
              <Input
                value={form.location}
                onChange={e => update('location', e.target.value)}
                placeholder={t('review.locationPlaceholder')}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <Label>{t('review.workLocation')}</Label>
                <Select value={form.workLocation} onValueChange={v => update('workLocation', v)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {WORK_LOCATIONS.map(wl => (
                      <SelectItem key={wl} value={wl}>{t(`review.locations.${wl}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                <Input
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder={t('review.addSkill')}
                  className="flex-1"
                />
                <Button variant="outline" size="icon" onClick={addSkill} disabled={!newSkill.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>{t('review.salary')}</Label>
              <div className="grid grid-cols-2 gap-4 mt-1">
                <Input
                  type="number"
                  value={form.salaryMin}
                  onChange={e => update('salaryMin', e.target.value)}
                  placeholder={t('review.salaryMin')}
                />
                <Input
                  type="number"
                  value={form.salaryMax}
                  onChange={e => update('salaryMax', e.target.value)}
                  placeholder={t('review.salaryMax')}
                />
              </div>
            </div>

            {postError && (
              <p className="text-sm text-destructive">{postError}</p>
            )}

            <Button
              onClick={handlePost}
              disabled={!form.title.trim() || !form.description.trim() || posting}
              className="w-full"
            >
              {posting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('review.posting')}</>
              ) : (
                t('review.post')
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
