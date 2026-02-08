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
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  BookOpen,
  Plus,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'

interface CourseForm {
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
}

export default function NewCoursePage() {
  const router = useRouter()

  const [form, setForm] = useState<CourseForm>({
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
  })

  const [competencies, setCompetencies] = useState<string[]>([])
  const [competencyInput, setCompetencyInput] = useState('')
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([])
  const [outcomeInput, setOutcomeInput] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const updateField = (field: keyof CourseForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddCompetency = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const value = competencyInput.trim()
      if (value && competencies.indexOf(value) === -1) {
        setCompetencies((prev) => [...prev, value])
        setCompetencyInput('')
      }
    }
  }

  const handleRemoveCompetency = (index: number) => {
    setCompetencies((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAddOutcome = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const value = outcomeInput.trim()
      if (value && learningOutcomes.indexOf(value) === -1) {
        setLearningOutcomes((prev) => [...prev, value])
        setOutcomeInput('')
      }
    }
  }

  const handleRemoveOutcome = (index: number) => {
    setLearningOutcomes((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const body: Record<string, unknown> = {
        courseName: form.courseName,
        courseCode: form.courseCode,
        semester: form.semester,
        academicYear: form.academicYear,
      }

      if (form.department) body.department = form.department
      if (form.professorName) body.professorName = form.professorName
      if (form.professorEmail) body.professorEmail = form.professorEmail
      if (form.description) body.description = form.description
      if (form.credits) body.credits = parseInt(form.credits, 10)
      if (form.level) body.level = form.level
      if (competencies.length > 0) body.competencies = competencies
      if (learningOutcomes.length > 0) body.learningOutcomes = learningOutcomes

      const res = await fetch('/api/dashboard/university/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          throw new Error(data.error || 'Un corso con questo codice esiste già.')
        }
        throw new Error(data.error || 'Errore durante la creazione del corso.')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard/university/courses')
      }, 2000)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Errore durante la creazione del corso.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Corso Creato!
              </h2>
              <p className="text-gray-600">
                Il corso <span className="font-medium">{form.courseName}</span> ({form.courseCode}) è stato aggiunto al catalogo.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Reindirizzamento alla lista corsi...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <Link href="/dashboard/university/courses">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Torna ai corsi
          </Button>
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Nuovo Corso</h1>
              <p className="text-gray-600">Aggiungi un nuovo corso al catalogo</p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informazioni Base */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informazioni Base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="courseName">Nome del Corso *</Label>
                  <Input
                    id="courseName"
                    value={form.courseName}
                    onChange={(e) => updateField('courseName', e.target.value)}
                    placeholder="es. Ingegneria del Software"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courseCode">Codice Corso *</Label>
                  <Input
                    id="courseCode"
                    value={form.courseCode}
                    onChange={(e) => updateField('courseCode', e.target.value)}
                    placeholder="es. INF-301"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Dipartimento</Label>
                  <Input
                    id="department"
                    value={form.department}
                    onChange={(e) => updateField('department', e.target.value)}
                    placeholder="es. Informatica"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Semestre *</Label>
                  <Select
                    value={form.semester}
                    onValueChange={(value) => updateField('semester', value)}
                    required
                  >
                    <SelectTrigger id="semester">
                      <SelectValue placeholder="Seleziona..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1° Semestre">1° Semestre</SelectItem>
                      <SelectItem value="2° Semestre">2° Semestre</SelectItem>
                      <SelectItem value="Annuale">Annuale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Anno Accademico *</Label>
                  <Input
                    id="academicYear"
                    value={form.academicYear}
                    onChange={(e) => updateField('academicYear', e.target.value)}
                    placeholder="2024/2025"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Docente */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Docente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="professorName">Nome Docente</Label>
                  <Input
                    id="professorName"
                    value={form.professorName}
                    onChange={(e) => updateField('professorName', e.target.value)}
                    placeholder="es. Prof. Mario Rossi"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="professorEmail">Email Docente</Label>
                  <Input
                    id="professorEmail"
                    type="email"
                    value={form.professorEmail}
                    onChange={(e) => updateField('professorEmail', e.target.value)}
                    placeholder="es. mario.rossi@university.it"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dettagli */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dettagli</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Descrizione</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Descrivi il contenuto e gli obiettivi del corso..."
                  rows={4}
                  className="resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="credits">Crediti (CFU)</Label>
                  <Input
                    id="credits"
                    type="number"
                    min="1"
                    max="30"
                    value={form.credits}
                    onChange={(e) => updateField('credits', e.target.value)}
                    placeholder="es. 6"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Livello</Label>
                  <Select
                    value={form.level}
                    onValueChange={(value) => updateField('level', value)}
                  >
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Seleziona..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Triennale">Triennale</SelectItem>
                      <SelectItem value="Magistrale">Magistrale</SelectItem>
                      <SelectItem value="Dottorato">Dottorato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Competenze */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Competenze</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="competencyInput">
                  Aggiungi competenze (premi Invio per aggiungere)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="competencyInput"
                    value={competencyInput}
                    onChange={(e) => setCompetencyInput(e.target.value)}
                    onKeyDown={handleAddCompetency}
                    placeholder="es. Problem Solving, Python, Machine Learning..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const value = competencyInput.trim()
                      if (value && competencies.indexOf(value) === -1) {
                        setCompetencies((prev) => [...prev, value])
                        setCompetencyInput('')
                      }
                    }}
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {competencies.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {competencies.map((comp, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="pl-3 pr-1.5 py-1.5 text-sm flex items-center gap-1.5"
                    >
                      {comp}
                      <button
                        type="button"
                        onClick={() => handleRemoveCompetency(index)}
                        className="ml-0.5 rounded-full p-0.5 hover:bg-gray-300/50 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              {competencies.length === 0 && (
                <p className="text-sm text-gray-500">
                  Nessuna competenza aggiunta. Digita una competenza e premi Invio.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Risultati di Apprendimento */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Risultati di Apprendimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="outcomeInput">
                  Aggiungi risultati di apprendimento (premi Invio per aggiungere)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="outcomeInput"
                    value={outcomeInput}
                    onChange={(e) => setOutcomeInput(e.target.value)}
                    onKeyDown={handleAddOutcome}
                    placeholder="es. Progettare architetture software scalabili..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const value = outcomeInput.trim()
                      if (value && learningOutcomes.indexOf(value) === -1) {
                        setLearningOutcomes((prev) => [...prev, value])
                        setOutcomeInput('')
                      }
                    }}
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {learningOutcomes.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {learningOutcomes.map((outcome, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="pl-3 pr-1.5 py-1.5 text-sm flex items-center gap-1.5"
                    >
                      {outcome}
                      <button
                        type="button"
                        onClick={() => handleRemoveOutcome(index)}
                        className="ml-0.5 rounded-full p-0.5 hover:bg-gray-300/50 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              {learningOutcomes.length === 0 && (
                <p className="text-sm text-gray-500">
                  Nessun risultato aggiunto. Digita un risultato di apprendimento e premi Invio.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4 pb-8">
            <Link href="/dashboard/university/courses">
              <Button type="button" variant="outline">
                Annulla
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creazione in corso...
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Crea Corso
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
