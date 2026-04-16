'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { ShieldCheck, Clock, XCircle, AlertTriangle, Send, Users } from 'lucide-react'

interface ConsentRecord {
  id: string
  studentId: string
  studentName: string
  parentEmail: string
  parentName: string | null
  consentType: string
  status: string
  token: string
  requestedAt: string
  respondedAt: string | null
  expiresAt: string
}

interface Student {
  id: string
  firstName: string | null
  lastName: string | null
}

interface Stats {
  total: number
  pending: number
  granted: number
  denied: number
  expired: number
}

export default function ParentalConsentPage() {
  const [consents, setConsents] = useState<ConsentRecord[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, granted: 0, denied: 0, expired: 0 })
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [formStudentId, setFormStudentId] = useState('')
  const [formParentEmail, setFormParentEmail] = useState('')
  const [formParentName, setFormParentName] = useState('')
  const [formConsentType, setFormConsentType] = useState('platform_usage')
  const [submitting, setSubmitting] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/dashboard/university/parental-consent')
      const data = await res.json()
      setConsents(data.consents || [])
      setStats(data.stats || { total: 0, pending: 0, granted: 0, denied: 0, expired: 0 })
      setStudents(data.students || [])
    } catch (err) {
      console.error('Failed to fetch consent data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSubmit = async () => {
    if (!formStudentId || !formParentEmail || !formConsentType) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/dashboard/university/parental-consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: formStudentId,
          parentEmail: formParentEmail,
          parentName: formParentName || undefined,
          consentType: formConsentType,
        }),
      })
      if (res.ok) {
        setShowForm(false)
        setFormStudentId('')
        setFormParentEmail('')
        setFormParentName('')
        setFormConsentType('platform_usage')
        await fetchData()
      }
    } catch (err) {
      console.error('Failed to send consent request:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    PENDING: { label: 'In Attesa', variant: 'secondary' },
    GRANTED: { label: 'Autorizzato', variant: 'default' },
    DENIED: { label: 'Negato', variant: 'destructive' },
    EXPIRED: { label: 'Scaduto', variant: 'outline' },
  }

  const consentTypeLabels: Record<string, string> = {
    data_sharing: 'Condivisione Dati',
    pcto_participation: 'Partecipazione PCTO',
    platform_usage: 'Utilizzo Piattaforma',
  }

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('it-IT')

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Consenso Genitoriale</h1>
          <p className="text-muted-foreground mt-1">
            Gestisci le richieste di consenso per studenti minorenni
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Send className="h-4 w-4 mr-2" /> Richiedi Consenso
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2"><Users className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Totali</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-100 p-2"><Clock className="h-5 w-5 text-amber-600" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">In Attesa</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2"><ShieldCheck className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.granted}</p>
                <p className="text-sm text-muted-foreground">Autorizzati</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-100 p-2"><XCircle className="h-5 w-5 text-red-600" /></div>
              <div>
                <p className="text-2xl font-bold">{stats.denied + stats.expired}</p>
                <p className="text-sm text-muted-foreground">Negati / Scaduti</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Request Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nuova Richiesta di Consenso</CardTitle>
            <CardDescription>Invia una richiesta di consenso ai genitori di uno studente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-1 block">Studente</label>
                <Select value={formStudentId} onValueChange={setFormStudentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona studente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {`${s.firstName || ''} ${s.lastName || ''}`.trim() || s.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Tipo Consenso</label>
                <Select value={formConsentType} onValueChange={setFormConsentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="platform_usage">Utilizzo Piattaforma</SelectItem>
                    <SelectItem value="data_sharing">Condivisione Dati</SelectItem>
                    <SelectItem value="pcto_participation">Partecipazione PCTO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email Genitore</label>
                <Input
                  type="email"
                  placeholder="genitore@email.com"
                  value={formParentEmail}
                  onChange={(e) => setFormParentEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Nome Genitore (opzionale)</label>
                <Input
                  placeholder="Nome e Cognome"
                  value={formParentName}
                  onChange={(e) => setFormParentName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Annulla</Button>
              <Button onClick={handleSubmit} disabled={submitting || !formStudentId || !formParentEmail}>
                {submitting ? 'Invio...' : 'Invia Richiesta'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consent Table */}
      <Card>
        <CardHeader>
          <CardTitle>Richieste di Consenso</CardTitle>
        </CardHeader>
        <CardContent>
          {consents.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nessuna richiesta di consenso.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium">Studente</th>
                    <th className="text-left py-3 px-2 font-medium">Email Genitore</th>
                    <th className="text-left py-3 px-2 font-medium">Tipo</th>
                    <th className="text-left py-3 px-2 font-medium">Stato</th>
                    <th className="text-left py-3 px-2 font-medium">Richiesto</th>
                    <th className="text-left py-3 px-2 font-medium">Scadenza</th>
                  </tr>
                </thead>
                <tbody>
                  {consents.map((c) => {
                    const cfg = statusConfig[c.status] || { label: c.status, variant: 'outline' as const }
                    return (
                      <tr key={c.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2 font-medium">{c.studentName}</td>
                        <td className="py-3 px-2">{c.parentEmail}</td>
                        <td className="py-3 px-2">{consentTypeLabels[c.consentType] || c.consentType}</td>
                        <td className="py-3 px-2">
                          <Badge variant={cfg.variant}>{cfg.label}</Badge>
                        </td>
                        <td className="py-3 px-2">{formatDate(c.requestedAt)}</td>
                        <td className="py-3 px-2">{formatDate(c.expiresAt)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
