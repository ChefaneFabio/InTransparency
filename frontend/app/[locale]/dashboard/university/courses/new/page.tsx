'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Link } from '@/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Loader2, ArrowLeft, Plus, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface AnalysisResult {
  skills: string[]
  competencies: string[]
  projectTypes: string[]
  marketRelevance: string
}

export default function NewCoursePage() {
  const router = useRouter()
  const t = useTranslations('newCourse')

  const [step, setStep] = useState<'describe' | 'review'>('describe')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [department, setDepartment] = useState('')
  const [credits, setCredits] = useState('')

  const [skills, setSkills] = useState<string[]>([])
  const [competencies, setCompetencies] = useState<string[]>([])
  const [projectTypes, setProjectTypes] = useState<string[]>([])
  const [marketRelevance, setMarketRelevance] = useState('')

  const [skillInput, setSkillInput] = useState('')
  const [compInput, setCompInput] = useState('')
  const [projInput, setProjInput] = useState('')

  const [analyzing, setAnalyzing] = useState(false)
  const [creating, setCreating] = useState(false)

  const handleContinue = async () => {
    setAnalyzing(true)
    try {
      const res = await fetch('/api/ai/analyze-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      })
      if (res.ok) {
        const data: AnalysisResult = await res.json()
        setSkills(data.skills || [])
        setCompetencies(data.competencies || [])
        setProjectTypes(data.projectTypes || [])
        setMarketRelevance(data.marketRelevance || t('review.marketRelevanceText'))
      } else {
        setMarketRelevance(t('review.marketRelevanceText'))
      }
    } catch {
      setMarketRelevance(t('review.marketRelevanceText'))
    } finally {
      setAnalyzing(false)
      setStep('review')
    }
  }

  const handleCreate = async () => {
    setCreating(true)
    try {
      const body: Record<string, unknown> = { courseName: name, description, skills, competencies, projectTypes }
      if (department) body.department = department
      if (credits) body.credits = parseInt(credits, 10)
      await fetch('/api/dashboard/university/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      router.push('/dashboard/university/courses')
    } catch {
      router.push('/dashboard/university/courses')
    }
  }

  const addTag = (list: string[], setList: (v: string[]) => void, input: string, setInput: (v: string) => void) => {
    const val = input.trim()
    if (val && list.indexOf(val) === -1) {
      setList([...list, val])
      setInput('')
    }
  }

  const removeTag = (list: string[], setList: (v: string[]) => void, idx: number) => {
    setList(list.filter((_, i) => i !== idx))
  }

  const TagInput = ({ list, setList, input, setInput, placeholder }: {
    list: string[]; setList: (v: string[]) => void; input: string; setInput: (v: string) => void; placeholder: string
  }) => (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(list, setList, input, setInput) } }}
          placeholder={placeholder}
        />
        <Button type="button" variant="outline" size="icon" className="shrink-0"
          onClick={() => addTag(list, setList, input, setInput)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {list.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {list.map((item, i) => (
            <Badge key={i} variant="secondary" className="pl-3 pr-1.5 py-1.5 text-sm flex items-center gap-1.5">
              {item}
              <button type="button" onClick={() => removeTag(list, setList, i)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted/50 transition-colors">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen space-y-6 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/dashboard/university/courses">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('back')}
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
          <div className="flex gap-4 mt-4">
            <span className={`text-sm font-medium ${step === 'describe' ? 'text-primary' : 'text-muted-foreground/60'}`}>
              1. {t('steps.describe')}
            </span>
            <span className={`text-sm font-medium ${step === 'review' ? 'text-primary' : 'text-muted-foreground/60'}`}>
              2. {t('steps.review')}
            </span>
          </div>
        </div>

        {step === 'describe' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('input.title')}</CardTitle>
              <p className="text-sm text-muted-foreground">{t('input.description')}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="courseName">{t('input.courseName')} *</Label>
                <Input id="courseName" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder={t('input.courseNamePlaceholder')} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">{t('input.courseDescription')}</Label>
                <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('input.descriptionPlaceholder')} rows={5} className="resize-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dept">{t('input.department')}</Label>
                  <Input id="dept" value={department} onChange={(e) => setDepartment(e.target.value)}
                    placeholder={t('input.departmentPlaceholder')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credits">{t('input.credits')}</Label>
                  <Input id="credits" type="number" min="1" max="30" value={credits}
                    onChange={(e) => setCredits(e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={handleContinue} disabled={!name || analyzing}>
                  {analyzing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t('input.processing')}</> : t('input.continue')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'review' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <button onClick={() => setStep('describe')} className="text-sm text-primary hover:underline">
                {t('backToEdit')}
              </button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('review.skills')}</CardTitle>
                <p className="text-sm text-muted-foreground">{t('review.skillsHint')}</p>
              </CardHeader>
              <CardContent>
                <TagInput list={skills} setList={setSkills} input={skillInput} setInput={setSkillInput}
                  placeholder={t('review.addSkill')} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('review.competencies')}</CardTitle>
              </CardHeader>
              <CardContent>
                <TagInput list={competencies} setList={setCompetencies} input={compInput} setInput={setCompInput}
                  placeholder={t('review.addCompetency')} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('review.projectTypes')}</CardTitle>
                <p className="text-sm text-muted-foreground">{t('review.projectTypesHint')}</p>
              </CardHeader>
              <CardContent>
                <TagInput list={projectTypes} setList={setProjectTypes} input={projInput} setInput={setProjInput}
                  placeholder={t('review.addProjectType')} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('review.marketRelevance')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{marketRelevance}</p>
              </CardContent>
            </Card>

            <div className="flex justify-end pb-8">
              <Button onClick={handleCreate} disabled={creating}>
                {creating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t('review.creating')}</> : t('review.create')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
