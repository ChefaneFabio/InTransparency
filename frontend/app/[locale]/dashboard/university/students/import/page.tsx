'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { Link } from '@/navigation'

type Mode = null | 'paste' | 'csv' | 'single'

interface CsvRow {
  email: string
  first_name: string
  last_name: string
}

const parseCsv = (text: string): CsvRow[] => {
  const lines = text.split(/\r?\n/).filter(l => l.trim())
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  const ei = headers.indexOf('email')
  if (ei === -1) return []
  const fi = headers.indexOf('first_name')
  const li = headers.indexOf('last_name')
  const rows: CsvRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim())
    if (cols[ei]) rows.push({ email: cols[ei], first_name: fi !== -1 ? cols[fi] || '' : '', last_name: li !== -1 ? cols[li] || '' : '' })
  }
  return rows
}

export default function ImportStudentsPage() {
  const router = useRouter()
  const t = useTranslations('studentImport')

  const [mode, setMode] = useState<Mode>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Paste mode
  const [emailText, setEmailText] = useState('')
  const emails = emailText.split(/[\n,;]+/).map(e => e.trim()).filter(e => e.includes('@'))

  // CSV mode
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvRows, setCsvRows] = useState<CsvRow[]>([])

  // Single mode
  const [singleEmail, setSingleEmail] = useState('')
  const [singleFirst, setSingleFirst] = useState('')
  const [singleLast, setSingleLast] = useState('')
  const [singleDegree, setSingleDegree] = useState('')

  const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCsvFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result
      if (typeof text === 'string') setCsvRows(parseCsv(text))
    }
    reader.readAsText(file)
  }

  const handlePasteSubmit = async () => {
    if (emails.length === 0) return
    setLoading(true)
    setError('')
    try {
      const csvContent = 'email,first_name,last_name\n' + emails.map(e => `${e},,`).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const formData = new FormData()
      formData.append('file', blob, 'emails.csv')
      const res = await fetch('/api/dashboard/university/students/import', { method: 'POST', body: formData })
      if (!res.ok) throw new Error()
      setSuccess(t('success'))
      setTimeout(() => router.push('/dashboard/university/students'), 1500)
    } catch { setError('Import failed') } finally { setLoading(false) }
  }

  const handleCsvSubmit = async () => {
    if (!csvFile) return
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', csvFile)
      const res = await fetch('/api/dashboard/university/students/import', { method: 'POST', body: formData })
      if (!res.ok) throw new Error()
      setSuccess(t('success'))
      setTimeout(() => router.push('/dashboard/university/students'), 1500)
    } catch { setError('Import failed') } finally { setLoading(false) }
  }

  const handleSingleSubmit = async () => {
    if (!singleEmail.includes('@')) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/dashboard/university/students/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: singleEmail, firstName: singleFirst, lastName: singleLast, degree: singleDegree }),
      })
      if (!res.ok) throw new Error()
      setSuccess(t('success'))
      setTimeout(() => router.push('/dashboard/university/students'), 1500)
    } catch { setError('Failed to add student') } finally { setLoading(false) }
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-3">
        <p className="text-lg font-medium text-primary">{success}</p>
        <p className="text-sm text-muted-foreground">{t('note')}</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto space-y-4 py-6">
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground text-sm">{t('subtitle')}</p>
      </div>

      {/* System welcome bubble */}
      <div className="flex justify-start">
        <div className="bg-muted rounded-2xl px-4 py-2.5 text-sm max-w-[85%]">{t('welcome')}</div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Mode selection */}
      {!mode && (
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setMode('paste')}>{t('options.paste')}</Button>
          <Button variant="outline" onClick={() => setMode('csv')}>{t('options.csv')}</Button>
          <Button variant="outline" onClick={() => setMode('single')}>{t('options.single')}</Button>
        </div>
      )}

      {/* Paste emails */}
      {mode === 'paste' && (
        <Card>
          <CardContent className="space-y-3 pt-5">
            <Label>{t('paste.label')}</Label>
            <Textarea value={emailText} onChange={e => setEmailText(e.target.value)} placeholder={t('paste.placeholder')} rows={6} />
            {emails.length > 0 && (
              <p className="text-sm text-muted-foreground">{t('paste.count', { count: emails.length })}</p>
            )}
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setMode(null)}>{t('back')}</Button>
              <Button onClick={handlePasteSubmit} disabled={emails.length === 0 || loading} className="flex-1">
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('paste.sending')}</> : t('paste.send')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CSV upload */}
      {mode === 'csv' && (
        <Card>
          <CardContent className="space-y-3 pt-5">
            <Label>{t('csv.upload')}</Label>
            <Input type="file" accept=".csv" onChange={handleCsvChange} />
            {csvRows.length > 0 && (
              <>
                <p className="text-sm text-muted-foreground">{t('csv.preview', { count: csvRows.length })}</p>
                <div className="border rounded text-xs">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr><th className="p-2 text-left">Email</th><th className="p-2 text-left">Name</th></tr>
                    </thead>
                    <tbody>
                      {csvRows.slice(0, 3).map((r, i) => (
                        <tr key={i} className="border-t"><td className="p-2">{r.email}</td><td className="p-2">{r.first_name} {r.last_name}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setMode(null)}>{t('back')}</Button>
              <Button onClick={handleCsvSubmit} disabled={csvRows.length === 0 || loading} className="flex-1">
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('csv.importing')}</> : t('csv.import', { count: csvRows.length })}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Single student */}
      {mode === 'single' && (
        <Card>
          <CardContent className="space-y-3 pt-5">
            <div>
              <Label>{t('single.email')}</Label>
              <Input type="email" value={singleEmail} onChange={e => setSingleEmail(e.target.value)} placeholder="mario.rossi@studenti.unibg.it" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{t('single.firstName')}</Label>
                <Input value={singleFirst} onChange={e => setSingleFirst(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>{t('single.lastName')}</Label>
                <Input value={singleLast} onChange={e => setSingleLast(e.target.value)} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>{t('single.degree')}</Label>
              <Input value={singleDegree} onChange={e => setSingleDegree(e.target.value)} className="mt-1" />
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setMode(null)}>{t('back')}</Button>
              <Button onClick={handleSingleSubmit} disabled={!singleEmail.includes('@') || loading} className="flex-1">
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('paste.sending')}</> : t('single.send')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
