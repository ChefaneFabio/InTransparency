'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AdminSubNav } from '../_components/AdminSubNav'
import { Loader2, Upload, AlertCircle, CheckCircle, GraduationCap, Building2 } from 'lucide-react'

type Institution = {
  id: string
  name: string
  slug: string
  type: string
  country: string | null
  isDemo?: boolean
}

type RowResult = {
  email?: string
  company?: string
  status: 'created' | 'updated' | 'skipped' | 'error'
  reason?: string
}

type ImportResponse = {
  institution: { id: string; name: string; slug: string }
  batchId: string
  dryRun: boolean
  totals: {
    processed: number
    created: number
    updated: number
    skipped: number
    errors: number
  }
  results: RowResult[]
}

const STUDENT_SAMPLE = `firstName,lastName,email,program,graduationYear
Mario,Rossi,mario.rossi@example.com,Tecnico Superiore Meccatronica,2026
Giulia,Bianchi,giulia.bianchi@example.com,Tecnico Superiore Meccatronica,2026
`

const COMPANY_SAMPLE = `companyName,website,industry
Acme S.p.A.,https://acme.it,Manufacturing
Brianza Industrie,https://brianzaindustrie.it,Engineering
`

export default function ImportsPage() {
  const { data: session, status } = useSession()
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [includeDemo, setIncludeDemo] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'students' | 'companies'>('students')

  const isAdmin =
    session?.user?.role === 'ADMIN' ||
    session?.user?.email?.toLowerCase() === 'chefane.fabio@gmail.com'

  useEffect(() => {
    if (status !== 'authenticated' || !isAdmin) return
    setLoading(true)
    fetch(`/api/admin/access-grants/lookups?includeDemo=${includeDemo}`)
      .then(res => res.json())
      .then(data => setInstitutions(data.institutions ?? []))
      .finally(() => setLoading(false))
  }, [status, isAdmin, includeDemo])

  if (status === 'loading') {
    return <div className="p-8"><Loader2 className="h-5 w-5 animate-spin" /></div>
  }
  if (!isAdmin) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="py-8 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Admins only.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <AdminSubNav />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Bulk imports</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Concierge tooling. Paste a CSV from a partner's spreadsheet and we
            create the records on their behalf — no welcome emails, no
            opt-in flows. Students land with <code>emailVerified=true</code>;
            companies land with an active access grant on the chosen institution.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Switch checked={includeDemo} onCheckedChange={setIncludeDemo} />
          <span className="text-muted-foreground">Include demo institutions</span>
        </div>
      </div>

      {loading ? (
        <Card><CardContent className="py-8 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></CardContent></Card>
      ) : (
        <Tabs value={tab} onValueChange={v => setTab(v as 'students' | 'companies')}>
          <TabsList>
            <TabsTrigger value="students" className="gap-1.5">
              <GraduationCap className="h-4 w-4" /> Students
            </TabsTrigger>
            <TabsTrigger value="companies" className="gap-1.5">
              <Building2 className="h-4 w-4" /> Companies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="mt-4">
            <StudentImportCard institutions={institutions} />
          </TabsContent>
          <TabsContent value="companies" className="mt-4">
            <CompanyImportCard institutions={institutions} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

function ResultsPanel({ res }: { res: ImportResponse }) {
  const errored = res.results.filter(r => r.status === 'error')
  const created = res.totals.created
  const updated = res.totals.updated
  const skipped = res.totals.skipped
  const errors = res.totals.errors
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
          <CheckCircle className="h-3.5 w-3.5 mr-1" />
          {res.dryRun ? `${created} would be created` : `${created} created`}
        </Badge>
        {updated > 0 && (
          <Badge variant="secondary">{updated} updated</Badge>
        )}
        {skipped > 0 && (
          <Badge variant="outline">{skipped} skipped</Badge>
        )}
        {errors > 0 && (
          <Badge variant="destructive">{errors} errors</Badge>
        )}
        <span className="text-xs text-muted-foreground">
          batch <code>{res.batchId}</code> · {res.institution.name}
        </span>
      </div>

      {errored.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-red-600">Errored rows ({errored.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Row</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {errored.slice(0, 50).map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-xs">{r.email ?? r.company ?? '—'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.reason ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {errored.length > 50 && (
              <div className="text-xs text-muted-foreground p-3">+{errored.length - 50} more</div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function StudentImportCard({ institutions }: { institutions: Institution[] }) {
  const [institutionId, setInstitutionId] = useState('')
  const [csv, setCsv] = useState('')
  const [defaultGradYear, setDefaultGradYear] = useState('')
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<ImportResponse | null>(null)

  async function run(dryRun: boolean) {
    setError('')
    setResult(null)
    if (!institutionId) {
      setError('Pick an institution.')
      return
    }
    if (!csv.trim()) {
      setError('Paste the CSV.')
      return
    }
    setRunning(true)
    try {
      const body = {
        institutionId,
        csv,
        dryRun,
        defaultGraduationYear: defaultGradYear ? parseInt(defaultGradYear, 10) : undefined,
      }
      const res = await fetch('/api/admin/imports/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Import failed')
        return
      }
      setResult(data)
    } finally {
      setRunning(false)
    }
  }

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = e => setCsv(String(e.target?.result ?? ''))
    reader.readAsText(file)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Students CSV import</CardTitle>
        <CardDescription>
          Required columns: <code>firstName, lastName, email</code>. Optional:
          <code> program, graduationYear</code>. Header autodetects comma or semicolon.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md flex items-start gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Target institution</Label>
            <Select value={institutionId} onValueChange={setInstitutionId}>
              <SelectTrigger>
                <SelectValue placeholder="Pick an institution…" />
              </SelectTrigger>
              <SelectContent>
                {institutions.map(i => (
                  <SelectItem key={i.id} value={i.id}>
                    {i.name} {i.isDemo && <span className="ml-2 text-xs text-muted-foreground">(demo)</span>}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="defaultGradYear">Default graduation year (optional)</Label>
            <Input
              id="defaultGradYear"
              type="number"
              min={2000}
              max={2100}
              value={defaultGradYear}
              onChange={e => setDefaultGradYear(e.target.value)}
              placeholder="2026"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentsCsvFile">Upload CSV file</Label>
          <Input
            id="studentsCsvFile"
            type="file"
            accept=".csv,text/csv,.txt"
            onChange={e => {
              const f = e.target.files?.[0]
              if (f) handleFile(f)
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentsCsv">…or paste CSV</Label>
          <Textarea
            id="studentsCsv"
            value={csv}
            onChange={e => setCsv(e.target.value)}
            placeholder={STUDENT_SAMPLE}
            rows={10}
            className="font-mono text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => run(true)} disabled={running}>
            {running && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
            Dry run
          </Button>
          <Button onClick={() => run(false)} disabled={running}>
            {running && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
            <Upload className="h-4 w-4 mr-1" />
            Import for real
          </Button>
        </div>

        {result && <ResultsPanel res={result} />}
      </CardContent>
    </Card>
  )
}

function CompanyImportCard({ institutions }: { institutions: Institution[] }) {
  const [institutionId, setInstitutionId] = useState('')
  const [csv, setCsv] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [allowSearch, setAllowSearch] = useState(true)
  const [allowProfile, setAllowProfile] = useState(true)
  const [allowContact, setAllowContact] = useState(true)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<ImportResponse | null>(null)

  async function run(dryRun: boolean) {
    setError('')
    setResult(null)
    if (!institutionId) {
      setError('Pick an institution to grant access to.')
      return
    }
    if (!csv.trim()) {
      setError('Paste the CSV.')
      return
    }
    setRunning(true)
    try {
      const body = {
        institutionId,
        csv,
        dryRun,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        allowSearch,
        allowProfile,
        allowContact,
      }
      const res = await fetch('/api/admin/imports/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Import failed')
        return
      }
      setResult(data)
    } finally {
      setRunning(false)
    }
  }

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = e => setCsv(String(e.target?.result ?? ''))
    reader.readAsText(file)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Companies CSV import</CardTitle>
        <CardDescription>
          Required column: <code>companyName</code>. Optional: <code>website, industry</code>.
          Each row creates (or refreshes) a CompanyProfile and grants the chosen
          institution access on the same trigger.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md flex items-start gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Grant access to institution</Label>
            <Select value={institutionId} onValueChange={setInstitutionId}>
              <SelectTrigger>
                <SelectValue placeholder="Pick an institution…" />
              </SelectTrigger>
              <SelectContent>
                {institutions.map(i => (
                  <SelectItem key={i.id} value={i.id}>
                    {i.name} {i.isDemo && <span className="ml-2 text-xs text-muted-foreground">(demo)</span>}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiresAt">Grants expire on (optional)</Label>
            <Input
              id="expiresAt"
              type="date"
              value={expiresAt}
              onChange={e => setExpiresAt(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3 border rounded-md p-3 bg-muted/30">
          <div className="text-sm font-medium">What each grant unlocks</div>
          {[
            { key: 'search', label: 'Search & browse', value: allowSearch, set: setAllowSearch },
            { key: 'profile', label: 'View profile', value: allowProfile, set: setAllowProfile },
            { key: 'contact', label: 'Send messages', value: allowContact, set: setAllowContact },
          ].map(s => (
            <div key={s.key} className="flex items-center justify-between text-sm">
              <span>{s.label}</span>
              <Switch checked={s.value} onCheckedChange={s.set} />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="companiesCsvFile">Upload CSV file</Label>
          <Input
            id="companiesCsvFile"
            type="file"
            accept=".csv,text/csv,.txt"
            onChange={e => {
              const f = e.target.files?.[0]
              if (f) handleFile(f)
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companiesCsv">…or paste CSV</Label>
          <Textarea
            id="companiesCsv"
            value={csv}
            onChange={e => setCsv(e.target.value)}
            placeholder={COMPANY_SAMPLE}
            rows={10}
            className="font-mono text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => run(true)} disabled={running}>
            {running && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
            Dry run
          </Button>
          <Button onClick={() => run(false)} disabled={running}>
            {running && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
            <Upload className="h-4 w-4 mr-1" />
            Import for real
          </Button>
        </div>

        {result && <ResultsPanel res={result} />}
      </CardContent>
    </Card>
  )
}
