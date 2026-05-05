'use client'

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { Link } from '@/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Briefcase, Search, ChevronRight, FileSpreadsheet, BarChart3 } from 'lucide-react'

interface PlacementRow {
  id: string
  studentName: string
  studentId: string
  department: string
  company: string
  position: string
  salary: number
  salaryCurrency: string
  salaryPeriod: string
  startDate: string
  endDate: string | null
  status: string
  type: string
}

const STATUS_BADGE: Record<string, { it: string; en: string; className: string }> = {
  confirmed: { it: 'Confermato', en: 'Confirmed', className: 'bg-emerald-100 text-emerald-700' },
  pending: { it: 'In attesa', en: 'Pending', className: 'bg-amber-100 text-amber-700' },
  declined: { it: 'Rifiutato', en: 'Declined', className: 'bg-rose-100 text-rose-700' },
}

export default function PlacementsListPage() {
  const locale = useLocale()
  const isIt = locale === 'it'
  const [rows, setRows] = useState<PlacementRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const params = new URLSearchParams({ view: 'list' })
    if (search.trim()) params.set('search', search.trim())
    if (status !== 'all') params.set('status', status)
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/dashboard/university/placements?${params.toString()}`)
        if (res.ok) {
          const data = await res.json()
          if (!cancelled) setRows(data.placements ?? [])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 200)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [search, status])

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">{isIt ? 'Tirocini' : 'Placements'}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isIt
              ? 'Tutti i tirocini dei tuoi studenti. Apri un record per vedere la timeline completa, cambiare fase e gestire valutazioni.'
              : 'Every placement for your students. Open one to see the full timeline, change stage, and manage evaluations.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/university/analytics?tab=placement">
              <BarChart3 className="h-4 w-4 mr-1.5" />
              {isIt ? 'Analytics' : 'Analytics'}
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/api/dashboard/university/placements/export?format=csv" download>
              <FileSpreadsheet className="h-4 w-4 mr-1.5" />
              {isIt ? 'Esporta CSV (MIUR)' : 'Export CSV (MIUR)'}
            </a>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={isIt ? 'Cerca per studente, azienda, ruolo…' : 'Search by student, company, role…'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isIt ? 'Tutti gli stati' : 'All statuses'}</SelectItem>
            <SelectItem value="confirmed">{isIt ? 'Confermati' : 'Confirmed'}</SelectItem>
            <SelectItem value="pending">{isIt ? 'In attesa' : 'Pending'}</SelectItem>
            <SelectItem value="declined">{isIt ? 'Rifiutati' : 'Declined'}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Briefcase className="mx-auto mb-3 h-8 w-8 opacity-50" />
            <p>{isIt ? 'Nessun tirocinio trovato.' : 'No placements found.'}</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {rows.length} {isIt ? 'tirocini' : 'placements'}
            </CardTitle>
            <CardDescription>
              {isIt ? 'Clicca su un record per aprire la timeline.' : 'Click a row to open its timeline.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {rows.map((r) => {
              const badge = STATUS_BADGE[r.status] ?? { it: r.status, en: r.status, className: '' }
              return (
                <Link
                  key={r.id}
                  href={`/dashboard/university/placements/${r.id}`}
                  className="flex items-center justify-between gap-3 border rounded-md p-3 text-sm hover:bg-muted/40 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{r.studentName || '—'}</span>
                      <Badge variant="outline" className="text-xs font-normal">
                        {r.department || (isIt ? 'N/D' : 'n/a')}
                      </Badge>
                      <Badge className={`text-xs font-normal ${badge.className}`}>
                        {badge[isIt ? 'it' : 'en']}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">
                      {r.position} · {r.company}
                      {' · '}
                      {new Date(r.startDate).toLocaleDateString(isIt ? 'it-IT' : 'en-GB')}
                      {r.endDate && (
                        <> → {new Date(r.endDate).toLocaleDateString(isIt ? 'it-IT' : 'en-GB')}</>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/60 flex-shrink-0" />
                </Link>
              )
            })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
