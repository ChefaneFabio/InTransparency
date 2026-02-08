'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Upload,
  UserPlus,
  Mail,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Download,
  Users,
  Loader2
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface StudentForm {
  firstName: string
  lastName: string
  email: string
  studentId: string
  department: string
  degree: string
  enrollmentYear: string
  expectedGraduation: string
}

interface ImportResult {
  success: number
  failed: number
  skipped: number
  total: number
  errors?: string[]
  message?: string
}

interface CsvPreviewRow {
  email: string
  first_name: string
  last_name: string
  course: string
  year: string
}

const departments = [
  'Ingegneria Informatica',
  'Ingegneria Gestionale',
  'Ingegneria Meccanica',
  'Architettura',
  'Design'
]

function parseCsv(text: string): CsvPreviewRow[] {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '')
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  const emailIdx = headers.indexOf('email')
  const firstNameIdx = headers.indexOf('first_name')
  const lastNameIdx = headers.indexOf('last_name')
  const courseIdx = headers.indexOf('course')
  const yearIdx = headers.indexOf('year')

  if (emailIdx === -1) return []

  const rows: CsvPreviewRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim())
    rows.push({
      email: cols[emailIdx] || '',
      first_name: firstNameIdx !== -1 ? cols[firstNameIdx] || '' : '',
      last_name: lastNameIdx !== -1 ? cols[lastNameIdx] || '' : '',
      course: courseIdx !== -1 ? cols[courseIdx] || '' : '',
      year: yearIdx !== -1 ? cols[yearIdx] || '' : '',
    })
  }
  return rows
}

export default function AddStudentsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('single')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Single student form
  const [form, setForm] = useState<StudentForm>({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    department: '',
    degree: '',
    enrollmentYear: '',
    expectedGraduation: ''
  })
  const [singleResult, setSingleResult] = useState<{ name: string; email: string } | null>(null)

  // Bulk import
  const [bulkFile, setBulkFile] = useState<File | null>(null)
  const [bulkPreview, setBulkPreview] = useState<CsvPreviewRow[]>([])
  const [parseError, setParseError] = useState('')
  const [importResult, setImportResult] = useState<ImportResult | null>(null)

  const handleDownloadTemplate = useCallback(() => {
    const csvContent = 'email,first_name,last_name,course,year\n'
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'studenti_template.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [])

  const handleSubmitSingle = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/dashboard/university/students/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          department: form.department,
          degree: form.degree,
          enrollmentYear: form.enrollmentYear,
          expectedGraduation: form.expectedGraduation,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Errore durante l\'aggiunta dello studente')
      }

      setSingleResult({ name: data.student?.name || '', email: data.student?.email || '' })
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard/university/students')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Errore durante l\'aggiunta dello studente')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setParseError('')
    setBulkPreview([])

    if (!file) {
      setBulkFile(null)
      return
    }

    setBulkFile(file)

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result
      if (typeof text !== 'string') {
        setParseError('Impossibile leggere il file')
        return
      }

      const rows = parseCsv(text)
      if (rows.length === 0) {
        setParseError(
          'Nessuno studente trovato nel file. Assicurati che il CSV contenga l\'intestazione "email" e almeno una riga di dati.'
        )
        return
      }

      setBulkPreview(rows)
    }
    reader.onerror = () => {
      setParseError('Errore durante la lettura del file')
    }
    reader.readAsText(file)
  }

  const handleBulkUpload = async () => {
    if (!bulkFile) return

    setIsLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', bulkFile)

      const res = await fetch('/api/dashboard/university/students/import', {
        method: 'POST',
        body: formData,
      })

      const data: ImportResult & { message?: string } = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Errore durante il caricamento del file')
      }

      setImportResult({
        success: data.success ?? 0,
        failed: data.failed ?? 0,
        skipped: data.skipped ?? 0,
        total: data.total ?? 0,
        errors: data.errors,
        message: data.message,
      })
      setSuccess(true)

      if (data.failed === 0 && data.skipped === 0) {
        setTimeout(() => {
          router.push('/dashboard/university/students')
        }, 2500)
      }
    } catch (err: any) {
      setError(err.message || 'Errore durante il caricamento del file')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
        <div className="container max-w-2xl mx-auto px-4">
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>

              {activeTab === 'single' ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Studente Aggiunto!
                  </h2>
                  <p className="text-gray-600">
                    {singleResult
                      ? `${singleResult.name} (${singleResult.email}) riceverà un'email di invito.`
                      : 'Lo studente riceverà un\'email di invito.'}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Importazione Completata!
                  </h2>
                  {importResult && (
                    <div className="space-y-3 mt-4">
                      <div className="flex items-center justify-center gap-4 text-sm">
                        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                          {importResult.success} importati
                        </Badge>
                        {importResult.skipped > 0 && (
                          <Badge variant="secondary">
                            {importResult.skipped} saltati
                          </Badge>
                        )}
                        {importResult.failed > 0 && (
                          <Badge variant="destructive">
                            {importResult.failed} falliti
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">
                        Totale elaborati: {importResult.total}
                      </p>
                      {importResult.errors && importResult.errors.length > 0 && (
                        <Alert variant="destructive" className="text-left mt-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            <ul className="list-disc list-inside space-y-1">
                              {importResult.errors.map((err, i) => (
                                <li key={i}>{err}</li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      )}
                      {(importResult.failed > 0 || importResult.skipped > 0) && (
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => router.push('/dashboard/university/students')}
                        >
                          Torna alla lista studenti
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
      <div className="container max-w-3xl mx-auto px-4">
        {/* Header */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Torna indietro
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Aggiungi Studenti</h1>
          <p className="text-gray-600">Invita studenti a unirsi alla piattaforma</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="single" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Singolo Studente
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Importa CSV
            </TabsTrigger>
          </TabsList>

          {/* Single Student Form */}
          <TabsContent value="single">
            <Card>
              <CardHeader>
                <CardTitle>Aggiungi Singolo Studente</CardTitle>
                <CardDescription>
                  Compila i dati dello studente da invitare
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitSingle} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nome *</Label>
                      <Input
                        id="firstName"
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Cognome *</Label>
                      <Input
                        id="lastName"
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Istituzionale *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="nome.cognome@polimi.it"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Matricola</Label>
                      <Input
                        id="studentId"
                        value={form.studentId}
                        onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                        placeholder="es. 123456"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Dipartimento *</Label>
                      <Select
                        value={form.department}
                        onValueChange={(value) => setForm({ ...form, department: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona..." />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map(dept => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="degree">Corso di Laurea</Label>
                      <Input
                        id="degree"
                        value={form.degree}
                        onChange={(e) => setForm({ ...form, degree: e.target.value })}
                        placeholder="es. Laurea Magistrale"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="enrollmentYear">Anno Iscrizione</Label>
                      <Input
                        id="enrollmentYear"
                        value={form.enrollmentYear}
                        onChange={(e) => setForm({ ...form, enrollmentYear: e.target.value })}
                        placeholder="es. 2022"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expectedGraduation">Laurea Prevista</Label>
                      <Input
                        id="expectedGraduation"
                        value={form.expectedGraduation}
                        onChange={(e) => setForm({ ...form, expectedGraduation: e.target.value })}
                        placeholder="es. 2025"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                      Annulla
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Invio in corso...
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Invia Invito
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bulk Import */}
          <TabsContent value="bulk">
            <Card>
              <CardHeader>
                <CardTitle>Importa da CSV</CardTitle>
                <CardDescription>
                  Carica un file CSV con i dati degli studenti
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Download Template */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-blue-900">Scarica il Template</h4>
                      <p className="text-sm text-blue-700">
                        Usa questo template per formattare correttamente i dati
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                      <Download className="h-4 w-4 mr-2" />
                      Download CSV
                    </Button>
                  </div>
                </div>

                {/* Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    bulkFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {bulkFile ? (
                    <div>
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <p className="font-medium text-gray-900">{bulkFile.name}</p>
                      <p className="text-sm text-gray-600">{bulkPreview.length} studenti trovati</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          setBulkFile(null)
                          setBulkPreview([])
                          setParseError('')
                        }}
                      >
                        Rimuovi file
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="font-medium text-gray-900 mb-2">
                        Trascina il file CSV qui
                      </p>
                      <p className="text-sm text-gray-600 mb-4">oppure</p>
                      <Button variant="outline" asChild>
                        <label>
                          <input
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          Seleziona File
                        </label>
                      </Button>
                    </div>
                  )}
                </div>

                {/* Parse Error */}
                {parseError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{parseError}</AlertDescription>
                  </Alert>
                )}

                {/* Preview */}
                {bulkPreview.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Anteprima ({bulkPreview.length} {bulkPreview.length === 1 ? 'studente' : 'studenti'})
                    </h4>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-3">Email</th>
                            <th className="text-left p-3">Nome</th>
                            <th className="text-left p-3">Cognome</th>
                            <th className="text-left p-3">Corso</th>
                            <th className="text-left p-3">Anno</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {bulkPreview.slice(0, 10).map((student, i) => (
                            <tr key={i}>
                              <td className="p-3">{student.email}</td>
                              <td className="p-3">{student.first_name}</td>
                              <td className="p-3">{student.last_name}</td>
                              <td className="p-3">{student.course}</td>
                              <td className="p-3">{student.year}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {bulkPreview.length > 10 && (
                        <div className="bg-gray-50 p-3 text-center text-sm text-gray-500">
                          ...e altri {bulkPreview.length - 10} studenti
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Annulla
                  </Button>
                  <Button onClick={handleBulkUpload} disabled={!bulkFile || bulkPreview.length === 0 || isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Importazione...
                      </>
                    ) : (
                      <>
                        <Users className="h-4 w-4 mr-2" />
                        Importa {bulkPreview.length} Studenti
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
