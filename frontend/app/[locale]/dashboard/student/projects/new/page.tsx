'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, ArrowLeft, Plus, X } from 'lucide-react'
import { Link } from '@/navigation'

type Step = 'input' | 'review'

interface AISuggestions {
  discipline: string
  projectType: string
  skills: string[]
  tools: string[]
  competencies: string[]
}

export default function NewProjectPage() {
  const t = useTranslations('newProject')
  const router = useRouter()

  // Step 1: Minimal input
  const [step, setStep] = useState<Step>('input')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [githubUrl, setGithubUrl] = useState('')

  // Step 2: AI suggestions + optional overrides
  const [suggestions, setSuggestions] = useState<AISuggestions | null>(null)
  const [skills, setSkills] = useState<string[]>([])
  const [tools, setTools] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [newTool, setNewTool] = useState('')

  // Optional academic context
  const [courseName, setCourseName] = useState('')
  const [grade, setGrade] = useState('')
  const [professor, setProfessor] = useState('')

  // Media
  const [imageUrl, setImageUrl] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  // State
  const [analyzing, setAnalyzing] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Step 1 → Step 2: AI analyzes the description
  const handleAnalyze = async () => {
    if (!title.trim() || !description.trim()) return
    setAnalyzing(true)

    try {
      const res = await fetch('/api/ai/analyze-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, githubUrl }),
      })

      if (res.ok) {
        const data = await res.json()
        setSuggestions(data)
        setSkills(data.skills || [])
        setTools(data.tools || [])
      } else {
        // Fallback: no AI, manual entry
        setSuggestions({
          discipline: 'TECHNOLOGY',
          projectType: 'Project',
          skills: [],
          tools: [],
          competencies: [],
        })
        setSkills([])
        setTools([])
      }
      setStep('review')
    } catch {
      // Fallback
      setSuggestions({
        discipline: 'TECHNOLOGY',
        projectType: 'Project',
        skills: [],
        tools: [],
        competencies: [],
      })
      setStep('review')
    } finally {
      setAnalyzing(false)
    }
  }

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

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          discipline: suggestions?.discipline || 'TECHNOLOGY',
          projectType: suggestions?.projectType || 'Project',
          skills,
          tools,
          competencies: suggestions?.competencies || [],
          githubUrl: githubUrl || undefined,
          imageUrl: imageUrl || undefined,
          courseName: courseName || undefined,
          grade: grade || undefined,
          professor: professor || undefined,
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

  const addItem = (value: string, list: string[], setter: (v: string[]) => void, inputSetter: (v: string) => void) => {
    if (value.trim() && !list.includes(value.trim())) {
      setter([...list, value.trim()])
      inputSetter('')
    }
  }

  const removeItem = (index: number, list: string[], setter: (v: string[]) => void) => {
    setter(list.filter((_, i) => i !== index))
  }

  return (
    <div className="max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="sm" onClick={() => step === 'review' ? setStep('input') : router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          {step === 'review' ? t('backToEdit') : t('back')}
        </Button>
      </div>

      <h1 className="text-2xl font-bold mb-1">{t('title')}</h1>
      <p className="text-muted-foreground mb-8">{t('subtitle')}</p>

      {/* Step indicator */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`flex items-center gap-2 text-sm font-medium ${step === 'input' ? 'text-primary' : 'text-muted-foreground'}`}>
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step === 'input' ? 'bg-primary text-white' : 'bg-muted'}`}>1</span>
          {t('steps.describe')}
        </div>
        <div className="h-px flex-1 bg-border" />
        <div className={`flex items-center gap-2 text-sm font-medium ${step === 'review' ? 'text-primary' : 'text-muted-foreground'}`}>
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step === 'review' ? 'bg-primary text-white' : 'bg-muted'}`}>2</span>
          {t('steps.review')}
        </div>
      </div>

      {/* ── STEP 1: Describe ── */}
      {step === 'input' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('input.title')}</CardTitle>
              <p className="text-sm text-muted-foreground">{t('input.description')}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">{t('input.projectTitle')}</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('input.titlePlaceholder')}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">{t('input.projectDescription')}</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('input.descriptionPlaceholder')}
                  rows={5}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">{t('input.descriptionHint')}</p>
              </div>

              <div>
                <Label htmlFor="github">{t('input.githubUrl')}</Label>
                <Input
                  id="github"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/you/project"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleAnalyze}
            disabled={!title.trim() || !description.trim() || analyzing}
            className="w-full"
            size="lg"
          >
            {analyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('input.analyzing')}
              </>
            ) : (
              t('input.analyzeButton')
            )}
          </Button>
        </div>
      )}

      {/* ── STEP 2: Review AI Suggestions ── */}
      {step === 'review' && suggestions && (
        <div className="space-y-6">
          {/* AI-detected category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('review.aiDetected')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Badge variant="secondary">{suggestions.discipline}</Badge>
                <Badge variant="outline">{suggestions.projectType}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Skills — AI suggested, editable */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('review.skills')}</CardTitle>
              <p className="text-sm text-muted-foreground">{t('review.skillsHint')}</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                {skills.map((skill, i) => (
                  <Badge key={skill} variant="secondary" className="gap-1">
                    {skill}
                    <button onClick={() => removeItem(i, skills, setSkills)} className="ml-1 hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(newSkill, skills, setSkills, setNewSkill))}
                  placeholder={t('review.addSkill')}
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={() => addItem(newSkill, skills, setSkills, setNewSkill)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tools — AI suggested, editable */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('review.tools')}</CardTitle>
              <p className="text-sm text-muted-foreground">{t('review.toolsHint')}</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                {tools.map((tool, i) => (
                  <Badge key={tool} variant="secondary" className="gap-1">
                    {tool}
                    <button onClick={() => removeItem(i, tools, setTools)} className="ml-1 hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTool}
                  onChange={(e) => setNewTool(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(newTool, tools, setTools, setNewTool))}
                  placeholder={t('review.addTool')}
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={() => addItem(newTool, tools, setTools, setNewTool)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Image — optional */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('review.image')}</CardTitle>
            </CardHeader>
            <CardContent>
              {imageUrl ? (
                <div className="relative">
                  <img src={imageUrl} alt="" className="rounded-lg max-h-48 object-cover w-full" />
                  <Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={() => setImageUrl('')}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer hover:border-primary/50 transition-colors">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <span className="text-sm text-muted-foreground">
                    {uploadingImage ? t('review.uploading') : t('review.uploadImage')}
                  </span>
                </label>
              )}
            </CardContent>
          </Card>

          {/* Academic context — optional, collapsed */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('review.academic')}</CardTitle>
              <p className="text-sm text-muted-foreground">{t('review.academicHint')}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{t('review.courseName')}</Label>
                  <Input value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder={t('review.courseNamePlaceholder')} className="mt-1" />
                </div>
                <div>
                  <Label>{t('review.grade')}</Label>
                  <Input value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="28/30" className="mt-1" />
                </div>
              </div>
              <div>
                <Label>{t('review.professor')}</Label>
                <Input value={professor} onChange={(e) => setProfessor(e.target.value)} placeholder={t('review.professorPlaceholder')} className="mt-1" />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full"
            size="lg"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('review.creating')}
              </>
            ) : (
              t('review.createButton')
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
