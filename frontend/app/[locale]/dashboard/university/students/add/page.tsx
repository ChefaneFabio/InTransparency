'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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

const departments = [
  'Ingegneria Informatica',
  'Ingegneria Gestionale',
  'Ingegneria Meccanica',
  'Architettura',
  'Design'
]

export default function AddStudentsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('single')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

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

  const [bulkFile, setBulkFile] = useState<File | null>(null)
  const [bulkPreview, setBulkPreview] = useState<any[]>([])

  const handleSubmitSingle = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard/university/students')
      }, 2000)
    } catch (err) {
      setError('Errore durante l\'aggiunta dello studente')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBulkFile(file)
      // Simulate parsing CSV
      setBulkPreview([
        { firstName: 'Marco', lastName: 'Rossi', email: 'marco.rossi@polimi.it', department: 'Ingegneria Informatica' },
        { firstName: 'Sofia', lastName: 'Bianchi', email: 'sofia.bianchi@polimi.it', department: 'Design' },
        { firstName: 'Luca', lastName: 'Verdi', email: 'luca.verdi@polimi.it', department: 'Architettura' }
      ])
    }
  }

  const handleBulkUpload = async () => {
    if (!bulkFile) return

    setIsLoading(true)
    setError('')

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard/university/students')
      }, 2000)
    } catch (err) {
      setError('Errore durante il caricamento del file')
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {activeTab === 'single' ? 'Studente Aggiunto!' : 'Studenti Importati!'}
              </h2>
              <p className="text-gray-600">
                {activeTab === 'single'
                  ? 'Lo studente riceverà un\'email di invito.'
                  : `${bulkPreview.length} studenti sono stati importati con successo.`}
              </p>
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
                    <Button variant="outline" size="sm">
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

                {/* Preview */}
                {bulkPreview.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Anteprima</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-3">Nome</th>
                            <th className="text-left p-3">Cognome</th>
                            <th className="text-left p-3">Email</th>
                            <th className="text-left p-3">Dipartimento</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {bulkPreview.map((student, i) => (
                            <tr key={i}>
                              <td className="p-3">{student.firstName}</td>
                              <td className="p-3">{student.lastName}</td>
                              <td className="p-3">{student.email}</td>
                              <td className="p-3">{student.department}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Annulla
                  </Button>
                  <Button onClick={handleBulkUpload} disabled={!bulkFile || isLoading}>
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
