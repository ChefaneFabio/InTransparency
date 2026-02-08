'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Link } from '@/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Save,
  X,
  BookOpen,
  Users,
  Calendar,
  GraduationCap,
  CheckCircle,
  Clock,
  Loader2,
  FileText,
  Plus,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ProjectInCourse {
  id: string
  title: string
  description: string | null
  skills: string[]
  user: { firstName: string | null; lastName: string | null }
  verificationStatus: string | null
  createdAt: string
}

interface CourseDetail {
  id: string
  courseName: string
  courseCode: string
  department: string | null
  semester: string
  academicYear: string
  professorName: string | null
  professorEmail: string | null
  description: string | null
  credits: number | null
  level: string | null
  competencies: string[]
  learningOutcomes: string[]
  universityVerified: boolean
  projects: ProjectInCourse[]
  _count: { projects: number }
}

interface FormData {
  courseName: string
  courseCode: string
  department: string
  semester: string
  academicYear: string
  professorName: string
  professorEmail: string
  description: string
  credits: string
  level: string
  competencies: string[]
  learningOutcomes: string[]
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function UniversityCourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [error, setError] = useState('')

  // Edit form state
  const [form, setForm] = useState<FormData>({
    courseName: '',
    courseCode: '',
    department: '',
    semester: '',
    academicYear: '',
    professorName: '',
    professorEmail: '',
    description: '',
    credits: '',
    level: '',
    competencies: [],
    learningOutcomes: [],
  })

  // Tag input helpers
  const [competencyInput, setCompetencyInput] = useState('')
  const [outcomeInput, setOutcomeInput] = useState('')

  /* ----- Fetch --------------------------------------------------- */

  useEffect(() => {
    if (courseId) fetchCourse()
  }, [courseId])

  const fetchCourse = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/dashboard/university/courses/${courseId}`)
      if (!res.ok) {
        if (res.status === 404) {
          setError('Corso non trovato.')
        } else {
          setError('Errore nel caricamento del corso.')
        }
        setCourse(null)
        return
      }
      const data = await res.json()
      setCourse(data.course)
      populateForm(data.course)
    } catch {
      setError('Errore di connessione al server.')
      setCourse(null)
    } finally {
      setLoading(false)
    }
  }

  const populateForm = (c: CourseDetail) => {
    setForm({
      courseName: c.courseName,
      courseCode: c.courseCode,
      department: c.department || '',
      semester: c.semester,
      academicYear: c.academicYear,
      professorName: c.professorName || '',
      professorEmail: c.professorEmail || '',
      description: c.description || '',
      credits: c.credits !== null ? String(c.credits) : '',
      level: c.level || '',
      competencies: Array.from(c.competencies),
      learningOutcomes: Array.from(c.learningOutcomes),
    })
  }

  /* ----- Save ---------------------------------------------------- */

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/dashboard/university/courses/${courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseName: form.courseName,
          courseCode: form.courseCode,
          department: form.department || null,
          semester: form.semester,
          academicYear: form.academicYear,
          professorName: form.professorName || null,
          professorEmail: form.professorEmail || null,
          description: form.description || null,
          credits: form.credits || null,
          level: form.level || null,
          competencies: form.competencies,
          learningOutcomes: form.learningOutcomes,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Errore nel salvataggio.')
        return
      }
      await fetchCourse()
      setEditMode(false)
    } catch {
      setError('Errore di connessione.')
    } finally {
      setSaving(false)
    }
  }

  /* ----- Delete -------------------------------------------------- */

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/dashboard/university/courses/${courseId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.push('/dashboard/university/courses')
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Errore durante l\'eliminazione.')
        setDeleteDialogOpen(false)
      }
    } catch {
      setError('Errore di connessione.')
      setDeleteDialogOpen(false)
    } finally {
      setDeleting(false)
    }
  }

  /* ----- Cancel edit --------------------------------------------- */

  const handleCancelEdit = () => {
    if (course) populateForm(course)
    setEditMode(false)
    setError('')
  }

  /* ----- Tag helpers --------------------------------------------- */

  const addCompetency = () => {
    const val = competencyInput.trim()
    if (val && !form.competencies.includes(val)) {
      setForm({ ...form, competencies: [...form.competencies, val] })
    }
    setCompetencyInput('')
  }

  const removeCompetency = (c: string) => {
    setForm({ ...form, competencies: form.competencies.filter((x) => x !== c) })
  }

  const addOutcome = () => {
    const val = outcomeInput.trim()
    if (val && !form.learningOutcomes.includes(val)) {
      setForm({ ...form, learningOutcomes: [...form.learningOutcomes, val] })
    }
    setOutcomeInput('')
  }

  const removeOutcome = (o: string) => {
    setForm({ ...form, learningOutcomes: form.learningOutcomes.filter((x) => x !== o) })
  }

  /* ----- Status badge helper ------------------------------------- */

  const getVerificationBadge = (status: string | null) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <Badge className="bg-green-100 text-green-700 text-xs gap-1">
            <CheckCircle className="h-3 w-3" />
            Verificato
          </Badge>
        )
      case 'REJECTED':
        return (
          <Badge className="bg-red-100 text-red-700 text-xs gap-1">
            <X className="h-3 w-3" />
            Rifiutato
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-gray-500 text-xs gap-1">
            <Clock className="h-3 w-3" />
            In attesa
          </Badge>
        )
    }
  }

  /* ================================================================ */
  /*  Render: Loading                                                  */
  /* ================================================================ */

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back button skeleton */}
          <Skeleton className="h-9 w-32 mb-6" />

          {/* Title area */}
          <div className="flex items-center gap-3 mb-8">
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          {/* Info card */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="mb-6">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>

          {/* Competencies */}
          <Card className="mb-6">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-20 rounded-full" />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Projects */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-28 w-full rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  /* ================================================================ */
  /*  Render: Not found / error                                        */
  /* ================================================================ */

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl text-center py-20">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || 'Corso non trovato'}
          </h2>
          <p className="text-gray-600 mb-6">
            Il corso che cerchi non esiste o non hai i permessi per visualizzarlo.
          </p>
          <Button asChild>
            <Link href="/dashboard/university/courses">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna ai corsi
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  /* ================================================================ */
  /*  Render: Edit mode                                                */
  /* ================================================================ */

  if (editMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Modifica Corso</h1>
              <p className="text-gray-600 mt-1">{course.courseCode} &mdash; {course.courseName}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancelEdit} disabled={saving}>
                <X className="h-4 w-4 mr-2" />
                Annulla
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salva
              </Button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            {/* Basic info */}
            <Card>
              <CardHeader>
                <CardTitle>Informazioni Generali</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="courseName">Nome del Corso *</Label>
                    <Input
                      id="courseName"
                      value={form.courseName}
                      onChange={(e) => setForm({ ...form, courseName: e.target.value })}
                      placeholder="es. Analisi Matematica I"
                    />
                  </div>
                  <div>
                    <Label htmlFor="courseCode">Codice Corso *</Label>
                    <Input
                      id="courseCode"
                      value={form.courseCode}
                      onChange={(e) => setForm({ ...form, courseCode: e.target.value })}
                      placeholder="es. MAT-01"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="department">Dipartimento</Label>
                    <Input
                      id="department"
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      placeholder="es. Ingegneria"
                    />
                  </div>
                  <div>
                    <Label>Semestre *</Label>
                    <Select
                      value={form.semester}
                      onValueChange={(v) => setForm({ ...form, semester: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Semestre</SelectItem>
                        <SelectItem value="2">2 Semestre</SelectItem>
                        <SelectItem value="Annuale">Annuale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="academicYear">Anno Accademico *</Label>
                    <Input
                      id="academicYear"
                      value={form.academicYear}
                      onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                      placeholder="es. 2024/2025"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="credits">Crediti (CFU)</Label>
                    <Input
                      id="credits"
                      type="number"
                      value={form.credits}
                      onChange={(e) => setForm({ ...form, credits: e.target.value })}
                      placeholder="es. 6"
                    />
                  </div>
                  <div>
                    <Label>Livello</Label>
                    <Select
                      value={form.level}
                      onValueChange={(v) => setForm({ ...form, level: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona livello" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Triennale">Triennale</SelectItem>
                        <SelectItem value="Magistrale">Magistrale</SelectItem>
                        <SelectItem value="Dottorato">Dottorato</SelectItem>
                        <SelectItem value="Master">Master</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professor */}
            <Card>
              <CardHeader>
                <CardTitle>Docente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="professorName">Nome Docente</Label>
                    <Input
                      id="professorName"
                      value={form.professorName}
                      onChange={(e) => setForm({ ...form, professorName: e.target.value })}
                      placeholder="es. Prof. Mario Rossi"
                    />
                  </div>
                  <div>
                    <Label htmlFor="professorEmail">Email Docente</Label>
                    <Input
                      id="professorEmail"
                      type="email"
                      value={form.professorEmail}
                      onChange={(e) => setForm({ ...form, professorEmail: e.target.value })}
                      placeholder="es. m.rossi@universita.it"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Descrizione</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Descrizione del corso, obiettivi formativi, contenuti principali..."
                  rows={5}
                />
              </CardContent>
            </Card>

            {/* Competencies */}
            <Card>
              <CardHeader>
                <CardTitle>Competenze</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={competencyInput}
                    onChange={(e) => setCompetencyInput(e.target.value)}
                    placeholder="Aggiungi una competenza..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addCompetency()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addCompetency}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {form.competencies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.competencies.map((c) => (
                      <Badge key={c} variant="secondary" className="gap-1 pr-1">
                        {c}
                        <button
                          type="button"
                          onClick={() => removeCompetency(c)}
                          className="ml-1 rounded-full hover:bg-gray-300 p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Learning outcomes */}
            <Card>
              <CardHeader>
                <CardTitle>Risultati di Apprendimento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={outcomeInput}
                    onChange={(e) => setOutcomeInput(e.target.value)}
                    placeholder="Aggiungi un risultato di apprendimento..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addOutcome()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addOutcome}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {form.learningOutcomes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.learningOutcomes.map((o) => (
                      <Badge key={o} variant="secondary" className="gap-1 pr-1">
                        {o}
                        <button
                          type="button"
                          onClick={() => removeOutcome(o)}
                          className="ml-1 rounded-full hover:bg-gray-300 p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  /* ================================================================ */
  /*  Render: View mode (default)                                      */
  /* ================================================================ */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back + actions */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/university/courses">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna ai corsi
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Modifica
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Title area */}
        <div className="mb-8">
          <div className="flex items-center flex-wrap gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {course.courseName}
            </h1>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-mono text-xs">
              {course.courseCode}
            </Badge>
            {course.universityVerified && (
              <Badge className="bg-green-100 text-green-700 text-xs gap-1">
                <CheckCircle className="h-3 w-3" />
                Verificato
              </Badge>
            )}
          </div>
          {course.department && (
            <p className="text-gray-600">{course.department}</p>
          )}
        </div>

        {/* Info grid card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-6">
              {/* Semester */}
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Calendar className="h-4 w-4" />
                  Semestre
                </div>
                <p className="font-medium text-gray-900">{course.semester}</p>
              </div>

              {/* Academic year */}
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Calendar className="h-4 w-4" />
                  Anno Accademico
                </div>
                <p className="font-medium text-gray-900">{course.academicYear}</p>
              </div>

              {/* Credits */}
              {course.credits !== null && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <BookOpen className="h-4 w-4" />
                    Crediti (CFU)
                  </div>
                  <p className="font-medium text-gray-900">{course.credits}</p>
                </div>
              )}

              {/* Level */}
              {course.level && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <GraduationCap className="h-4 w-4" />
                    Livello
                  </div>
                  <p className="font-medium text-gray-900">{course.level}</p>
                </div>
              )}

              {/* Professor */}
              {course.professorName && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Users className="h-4 w-4" />
                    Docente
                  </div>
                  <p className="font-medium text-gray-900">{course.professorName}</p>
                  {course.professorEmail && (
                    <p className="text-sm text-gray-500">{course.professorEmail}</p>
                  )}
                </div>
              )}

              {/* Project count */}
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <FileText className="h-4 w-4" />
                  Progetti
                </div>
                <p className="font-medium text-gray-900">{course._count.projects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        {course.description && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Descrizione</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {course.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Competencies */}
        {course.competencies.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Competenze</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {course.competencies.map((comp, i) => (
                  <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700">
                    {comp}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Learning Outcomes */}
        {course.learningOutcomes.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Risultati di Apprendimento</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2">
                {course.learningOutcomes.map((outcome, i) => (
                  <li key={i} className="text-gray-700 leading-relaxed">
                    {outcome}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}

        {/* Projects section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-500" />
              Progetti collegati
              <Badge variant="outline" className="ml-1 text-xs font-normal">
                {course._count.projects}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {course.projects.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  Nessun progetto collegato a questo corso.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {course.projects.map((project) => {
                  const studentName = [project.user.firstName, project.user.lastName]
                    .filter(Boolean)
                    .join(' ') || 'Studente'
                  return (
                    <Link
                      key={project.id}
                      href={`/dashboard/university/projects/${project.id}`}
                      className="block"
                    >
                      <div className="p-4 border rounded-lg hover:shadow-md hover:border-blue-200 transition-all duration-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 truncate">
                              {project.title}
                            </h4>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {studentName}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                            {getVerificationBadge(project.verificationStatus)}
                          </div>
                        </div>

                        {project.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {project.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1.5">
                            {project.skills.slice(0, 4).map((skill) => (
                              <Badge
                                key={skill}
                                variant="outline"
                                className="text-xs font-normal bg-slate-50"
                              >
                                {skill}
                              </Badge>
                            ))}
                            {project.skills.length > 4 && (
                              <Badge
                                variant="outline"
                                className="text-xs font-normal text-gray-400"
                              >
                                +{project.skills.length - 4}
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 ml-3 flex-shrink-0">
                            {new Date(project.createdAt).toLocaleDateString('it-IT', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Elimina Corso</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Questa azione e irreversibile. Il corso verra rimosso dal sistema.
                </p>
              </div>
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Elimina
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Delete confirmation dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Conferma eliminazione</DialogTitle>
              <DialogDescription>
                Sei sicuro di voler eliminare il corso <strong>{course.courseName}</strong> ({course.courseCode})?
                Questa azione non puo essere annullata. I progetti collegati non verranno eliminati,
                ma perderanno il riferimento a questo corso.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleting}
              >
                Annulla
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Elimina corso
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
