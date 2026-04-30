'use client'

import { useEffect, useState, useCallback } from 'react'
import { useLocale } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft, Save, X, Plus, Upload, Loader2,
  BookOpen, Code, Wrench, GraduationCap, Globe, Lock,
} from 'lucide-react'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

type Discipline = 'TECHNOLOGY' | 'DESIGN' | 'BUSINESS' | 'ENGINEERING' | 'MEDIA' | 'SCIENCE' | 'HEALTHCARE' | 'EDUCATION' | 'HUMANITIES' | 'TRADES' | 'OTHER'

interface ProjectForm {
  title: string
  description: string
  discipline: Discipline
  projectType: string
  skills: string[]
  tools: string[]
  technologies: string[]
  competencies: string[]
  certifications: string[]
  githubUrl: string
  liveUrl: string
  duration: string
  teamSize: string
  role: string
  client: string
  outcome: string
  courseName: string
  courseCode: string
  semester: string
  academicYear: string
  grade: string
  professor: string
  isPublic: boolean
  imageUrl: string
}

const EMPTY: ProjectForm = {
  title: '', description: '', discipline: 'TECHNOLOGY', projectType: '',
  skills: [], tools: [], technologies: [], competencies: [], certifications: [],
  githubUrl: '', liveUrl: '', duration: '', teamSize: '', role: '', client: '', outcome: '',
  courseName: '', courseCode: '', semester: '', academicYear: '', grade: '', professor: '',
  isPublic: true, imageUrl: '',
}

const getDisciplines = (isIt: boolean): Array<{ value: Discipline; label: string }> => [
  { value: 'TECHNOLOGY', label: isIt ? 'Tecnologia / Software' : 'Technology / Software' },
  { value: 'DESIGN', label: isIt ? 'Design / UX' : 'Design / UX' },
  { value: 'BUSINESS', label: isIt ? 'Business / Marketing' : 'Business / Marketing' },
  { value: 'ENGINEERING', label: isIt ? 'Ingegneria' : 'Engineering' },
  { value: 'MEDIA', label: isIt ? 'Media / Comunicazione' : 'Media / Communication' },
  { value: 'SCIENCE', label: isIt ? 'Scienza / Ricerca' : 'Science / Research' },
  { value: 'HEALTHCARE', label: isIt ? 'Sanità' : 'Healthcare' },
  { value: 'EDUCATION', label: isIt ? 'Educazione' : 'Education' },
  { value: 'HUMANITIES', label: isIt ? 'Umanistica' : 'Humanities' },
  { value: 'TRADES', label: isIt ? 'Mestieri / Tecnico' : 'Trades / Technical' },
  { value: 'OTHER', label: isIt ? 'Altro' : 'Other' },
]

interface TagInputProps {
  label: string
  values: string[]
  placeholder: string
  onAdd: (v: string) => void
  onRemove: (v: string) => void
  icon?: React.ElementType
}

function TagInput({ label, values, placeholder, onAdd, onRemove, icon: Icon }: TagInputProps) {
  const [draft, setDraft] = useState('')
  const submit = () => {
    const t = draft.trim()
    if (!t) return
    if (values.some(v => v.toLowerCase() === t.toLowerCase())) { setDraft(''); return }
    onAdd(t); setDraft('')
  }
  return (
    <div>
      <Label className="flex items-center gap-1.5 mb-1.5">
        {Icon && <Icon className="h-3.5 w-3.5" />} {label}
      </Label>
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') { e.preventDefault(); submit() }
            if (e.key === ',' && draft.trim()) { e.preventDefault(); submit() }
          }}
          placeholder={placeholder}
        />
        <Button type="button" variant="outline" size="sm" onClick={submit} disabled={!draft.trim()}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {values.map(v => (
            <Badge key={v} variant="secondary" className="gap-1 pr-1">
              {v}
              <button
                type="button"
                onClick={() => onRemove(v)}
                className="ml-0.5 hover:bg-muted-foreground/20 rounded-sm p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProjectEditPage() {
  const params = useParams()
  const router = useRouter()
  const locale = useLocale()
  const isIt = locale === 'it'
  const DISCIPLINES = getDisciplines(isIt)
  const projectId = params?.id as string

  const [form, setForm] = useState<ProjectForm>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const patch = useCallback((p: Partial<ProjectForm>) => setForm(f => ({ ...f, ...p })), [])

  useEffect(() => {
    if (!projectId) return
    const load = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`)
        if (!res.ok) {
          setError(isIt ? 'Progetto non trovato o non autorizzato.' : 'Project not found or unauthorized.')
          return
        }
        const { project } = await res.json()
        setForm({
          title: project.title || '',
          description: project.description || '',
          discipline: (project.discipline as Discipline) || 'TECHNOLOGY',
          projectType: project.projectType || '',
          skills: project.skills || [],
          tools: project.tools || [],
          technologies: project.technologies || [],
          competencies: project.competencies || [],
          certifications: project.certifications || [],
          githubUrl: project.githubUrl || '',
          liveUrl: project.liveUrl || '',
          duration: project.duration || '',
          teamSize: project.teamSize?.toString() || '',
          role: project.role || '',
          client: project.client || '',
          outcome: project.outcome || '',
          courseName: project.courseName || '',
          courseCode: project.courseCode || '',
          semester: project.semester || '',
          academicYear: project.academicYear || '',
          grade: project.grade || '',
          professor: project.professor || '',
          isPublic: project.isPublic ?? true,
          imageUrl: project.imageUrl || '',
        })
      } catch {
        setError(isIt ? 'Errore nel caricamento del progetto.' : 'Failed to load project.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [projectId])

  const uploadImage = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      fd.append('folder', 'project-covers')
      const res = await fetch('/api/upload/image', { method: 'POST', body: fd })
      if (res.ok) {
        const { url } = await res.json()
        if (url) patch({ imageUrl: url })
      }
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      setError(isIt ? 'Titolo e descrizione sono obbligatori.' : 'Title and description are required.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const payload: any = {
        title: form.title.trim(),
        description: form.description.trim(),
        discipline: form.discipline,
        projectType: form.projectType.trim() || null,
        skills: form.skills,
        tools: form.tools,
        technologies: form.technologies,
        competencies: form.competencies,
        certifications: form.certifications,
        githubUrl: form.githubUrl.trim() || null,
        liveUrl: form.liveUrl.trim() || null,
        duration: form.duration.trim() || null,
        teamSize: form.teamSize ? Number(form.teamSize) : null,
        role: form.role.trim() || null,
        client: form.client.trim() || null,
        outcome: form.outcome.trim() || null,
        courseName: form.courseName.trim() || null,
        courseCode: form.courseCode.trim() || null,
        semester: form.semester.trim() || null,
        academicYear: form.academicYear.trim() || null,
        grade: form.grade.trim() || null,
        professor: form.professor.trim() || null,
        isPublic: form.isPublic,
        imageUrl: form.imageUrl || null,
      }
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        router.push(`/dashboard/student/projects/${projectId}`)
      } else {
        const body = await res.json().catch(() => ({}))
        setError(body?.error || (isIt ? 'Errore nel salvataggio.' : 'Failed to save.'))
      }
    } catch {
      setError(isIt ? 'Errore di rete nel salvataggio.' : 'Network error while saving.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  if (error && !form.title) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button asChild variant="outline">
          <Link href="/dashboard/student/projects"><ArrowLeft className="h-4 w-4 mr-2" /> {isIt ? 'Torna ai progetti' : 'Back to projects'}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5 pb-24">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/dashboard/student/projects/${projectId}`}>
          <ArrowLeft className="h-4 w-4 mr-1.5" /> {isIt ? 'Torna al progetto' : 'Back to project'}
        </Link>
      </Button>

      <MetricHero gradient="student">
        <div>
          <h1 className="text-2xl font-bold">{isIt ? 'Modifica progetto' : 'Edit project'}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isIt
              ? 'Aggiungi dettagli, competenze, contesto accademico e risultati. Ogni modifica rilancia l\'analisi AI e aggiorna il punteggio di match con le opportunità.'
              : 'Add details, skills, academic context and outcomes. Every change re-runs the AI analysis and updates your match score with opportunities.'}
          </p>
        </div>
      </MetricHero>

      {/* Basic info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> {isIt ? 'Informazioni di base' : 'Basic information'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">{isIt ? 'Titolo *' : 'Title *'}</Label>
            <Input
              id="title"
              value={form.title}
              onChange={e => patch({ title: e.target.value })}
              placeholder={isIt ? 'es. Campagna TikTok per sponsorship AC Monza' : 'e.g. TikTok campaign for AC Monza sponsorship'}
            />
          </div>
          <div>
            <Label htmlFor="desc">{isIt ? 'Descrizione *' : 'Description *'}</Label>
            <Textarea
              id="desc"
              value={form.description}
              onChange={e => patch({ description: e.target.value })}
              rows={5}
              placeholder={isIt ? 'Cosa hai fatto, contesto, problema affrontato, approccio, risultati…' : 'What you did, context, problem, approach, results…'}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>{isIt ? 'Disciplina' : 'Discipline'}</Label>
              <Select value={form.discipline} onValueChange={v => patch({ discipline: v as Discipline })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DISCIPLINES.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">{isIt ? 'Tipo progetto' : 'Project type'}</Label>
              <Input
                id="type"
                value={form.projectType}
                onChange={e => patch({ projectType: e.target.value })}
                placeholder={isIt ? 'Campagna social, Case study, UX design…' : 'Social campaign, Case study, UX design…'}
              />
            </div>
          </div>
          <div>
            <Label className="mb-1.5 block">{isIt ? 'Immagine di copertina' : 'Cover image'}</Label>
            <div className="flex items-center gap-3">
              {form.imageUrl ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.imageUrl} alt="cover" className="h-24 w-40 object-cover rounded-md border" />
                  <button
                    type="button"
                    onClick={() => patch({ imageUrl: '' })}
                    className="absolute -top-2 -right-2 bg-background border rounded-full p-1 shadow hover:bg-muted"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="h-24 w-40 rounded-md border border-dashed flex items-center justify-center text-xs text-muted-foreground">
                  {isIt ? 'Nessuna immagine' : 'No image'}
                </div>
              )}
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f) }}
                />
                <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
                  <span>{uploading ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Upload className="h-3.5 w-3.5 mr-1.5" />}{isIt ? 'Carica' : 'Upload'}</span>
                </Button>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills / Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Code className="h-4 w-4" /> {isIt ? 'Competenze e strumenti' : 'Skills and tools'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TagInput
            label={isIt ? 'Competenze (skills)' : 'Skills'}
            values={form.skills}
            placeholder={isIt ? 'es. Copywriting, React, Financial Modeling…' : 'e.g. Copywriting, React, Financial Modeling…'}
            onAdd={v => patch({ skills: [...form.skills, v] })}
            onRemove={v => patch({ skills: form.skills.filter(s => s !== v) })}
          />
          <TagInput
            label={isIt ? 'Strumenti' : 'Tools'}
            values={form.tools}
            placeholder={isIt ? 'es. Figma, Excel, HubSpot…' : 'e.g. Figma, Excel, HubSpot…'}
            icon={Wrench}
            onAdd={v => patch({ tools: [...form.tools, v] })}
            onRemove={v => patch({ tools: form.tools.filter(s => s !== v) })}
          />
          <TagInput
            label={isIt ? 'Tecnologie' : 'Technologies'}
            values={form.technologies}
            placeholder={isIt ? 'es. Next.js, Python, TensorFlow…' : 'e.g. Next.js, Python, TensorFlow…'}
            onAdd={v => patch({ technologies: [...form.technologies, v] })}
            onRemove={v => patch({ technologies: form.technologies.filter(s => s !== v) })}
          />
          <TagInput
            label={isIt ? 'Competenze dimostrate' : 'Demonstrated competencies'}
            values={form.competencies}
            placeholder={isIt ? 'es. Problem solving, Team leadership…' : 'e.g. Problem solving, Team leadership…'}
            onAdd={v => patch({ competencies: [...form.competencies, v] })}
            onRemove={v => patch({ competencies: form.competencies.filter(s => s !== v) })}
          />
          <TagInput
            label={isIt ? 'Certificazioni' : 'Certifications'}
            values={form.certifications}
            placeholder={isIt ? 'es. Google Analytics, HubSpot Inbound, AWS…' : 'e.g. Google Analytics, HubSpot Inbound, AWS…'}
            onAdd={v => patch({ certifications: [...form.certifications, v] })}
            onRemove={v => patch({ certifications: form.certifications.filter(s => s !== v) })}
          />
        </CardContent>
      </Card>

      {/* Context */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{isIt ? 'Contesto progetto' : 'Project context'}</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="duration">{isIt ? 'Durata' : 'Duration'}</Label>
            <Input id="duration" value={form.duration} onChange={e => patch({ duration: e.target.value })} placeholder={isIt ? '3 mesi, 1 semestre…' : '3 months, 1 semester…'} />
          </div>
          <div>
            <Label htmlFor="teamSize">{isIt ? 'Dimensione team' : 'Team size'}</Label>
            <Input id="teamSize" type="number" value={form.teamSize} onChange={e => patch({ teamSize: e.target.value })} placeholder="4" />
          </div>
          <div>
            <Label htmlFor="role">{isIt ? 'Il tuo ruolo' : 'Your role'}</Label>
            <Input id="role" value={form.role} onChange={e => patch({ role: e.target.value })} placeholder={isIt ? 'Content Lead, Developer…' : 'Content Lead, Developer…'} />
          </div>
          <div>
            <Label htmlFor="client">{isIt ? 'Cliente / Committente' : 'Client / Sponsor'}</Label>
            <Input id="client" value={form.client} onChange={e => patch({ client: e.target.value })} placeholder={isIt ? 'AC Monza, interno, personale…' : 'AC Monza, internal, personal…'} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="outcome">{isIt ? 'Risultati' : 'Outcomes'}</Label>
            <Textarea id="outcome" value={form.outcome} onChange={e => patch({ outcome: e.target.value })} rows={3} placeholder={isIt ? 'KPI raggiunti, feedback, numeri (reach, conversioni, efficienza)…' : 'KPIs achieved, feedback, numbers (reach, conversions, efficiency)…'} />
          </div>
          <div>
            <Label htmlFor="githubUrl">GitHub</Label>
            <Input id="githubUrl" value={form.githubUrl} onChange={e => patch({ githubUrl: e.target.value })} placeholder="https://github.com/…" />
          </div>
          <div>
            <Label htmlFor="liveUrl">{isIt ? 'Link pubblico' : 'Public link'}</Label>
            <Input id="liveUrl" value={form.liveUrl} onChange={e => patch({ liveUrl: e.target.value })} placeholder="https://…" />
          </div>
        </CardContent>
      </Card>

      {/* Academic */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <GraduationCap className="h-4 w-4" /> {isIt ? 'Contesto accademico' : 'Academic context'}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {isIt ? 'Compilando questi campi abiliti la verifica da parte del docente/tutor.' : 'Filling in these fields enables verification by your professor/tutor.'}
          </p>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="courseName">{isIt ? 'Nome corso' : 'Course name'}</Label>
            <Input id="courseName" value={form.courseName} onChange={e => patch({ courseName: e.target.value })} placeholder="Digital Marketing Communication" />
          </div>
          <div>
            <Label htmlFor="courseCode">{isIt ? 'Codice corso' : 'Course code'}</Label>
            <Input id="courseCode" value={form.courseCode} onChange={e => patch({ courseCode: e.target.value })} placeholder="DMC401" />
          </div>
          <div>
            <Label htmlFor="semester">{isIt ? 'Semestre' : 'Semester'}</Label>
            <Input id="semester" value={form.semester} onChange={e => patch({ semester: e.target.value })} placeholder={isIt ? 'Primo semestre, 2024/2025' : 'First semester, 2024/2025'} />
          </div>
          <div>
            <Label htmlFor="academicYear">{isIt ? 'Anno accademico' : 'Academic year'}</Label>
            <Input id="academicYear" value={form.academicYear} onChange={e => patch({ academicYear: e.target.value })} placeholder="2024-2025" />
          </div>
          <div>
            <Label htmlFor="grade">{isIt ? 'Voto' : 'Grade'}</Label>
            <Input id="grade" value={form.grade} onChange={e => patch({ grade: e.target.value })} placeholder="28/30, A, 95%…" />
          </div>
          <div>
            <Label htmlFor="professor">{isIt ? 'Docente / Tutor' : 'Professor / Tutor'}</Label>
            <Input id="professor" value={form.professor} onChange={e => patch({ professor: e.target.value })} placeholder="Prof. Mario Rossi" />
          </div>
        </CardContent>
      </Card>

      {/* Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{isIt ? 'Visibilità' : 'Visibility'}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {form.isPublic ? <Globe className="h-5 w-5 text-green-600" /> : <Lock className="h-5 w-5 text-muted-foreground" />}
            <div>
              <div className="font-medium text-sm">{form.isPublic ? (isIt ? 'Progetto pubblico' : 'Public project') : (isIt ? 'Progetto privato' : 'Private project')}</div>
              <div className="text-xs text-muted-foreground">
                {form.isPublic
                  ? (isIt ? 'I recruiter e chi ha il link possono vedere questo progetto.' : 'Recruiters and anyone with the link can see this project.')
                  : (isIt ? 'Solo tu puoi vedere questo progetto. Non apparirà in match.' : 'Only you can see this project. It will not appear in matches.')}
              </div>
            </div>
          </div>
          <Switch
            checked={form.isPublic}
            onCheckedChange={v => patch({ isPublic: v })}
          />
        </CardContent>
      </Card>

      {/* Sticky actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t p-4 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="text-xs text-red-600 flex-1">
            {error && <span>{error}</span>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.back()} disabled={saving}>{isIt ? 'Annulla' : 'Cancel'}</Button>
            <Button onClick={handleSubmit} disabled={saving || !form.title.trim() || !form.description.trim()}>
              {saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Save className="h-4 w-4 mr-1.5" />}
              {isIt ? 'Salva modifiche' : 'Save changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
