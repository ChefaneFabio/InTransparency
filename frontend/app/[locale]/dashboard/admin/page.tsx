'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AdminSubNav } from './_components/AdminSubNav'

type AuditRow = {
  id: string
  actorId: string | null
  actorEmail: string | null
  actorRole: string | null
  action: string
  targetType: string | null
  targetId: string | null
  context: Record<string, unknown> | null
  createdAt: string
}

type Stats = {
  logins24h: number
  logins7d: number
  searches24h: number
  searches7d: number
  uniqueUsers7d: number
}

type ActionFacet = { action: string; count: number }
type RoleFacet = { role: string; count: number }

type TopQuery = { query: string; action: string; count: number; uniqueUsers: number }

const ACTION_BADGE: Record<string, string> = {
  LOGIN: 'bg-emerald-100 text-emerald-800',
  REGISTER: 'bg-teal-100 text-teal-800',
  SEARCH_CANDIDATES: 'bg-blue-100 text-blue-800',
  SEARCH_JOBS: 'bg-indigo-100 text-indigo-800',
  CONTACT_STUDENT: 'bg-purple-100 text-purple-800',
  VIEW_PROFILE: 'bg-slate-100 text-slate-700',
  PROJECT_CREATED: 'bg-cyan-100 text-cyan-800',
  JOB_POSTED: 'bg-fuchsia-100 text-fuchsia-800',
  APPLICATION_SUBMITTED: 'bg-pink-100 text-pink-800',
  ADMIN_LOGIN: 'bg-amber-100 text-amber-800',
  DELETE_USER: 'bg-rose-100 text-rose-800',
  EXPORT_USER_DATA: 'bg-orange-100 text-orange-800',
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const [rows, setRows] = useState<AuditRow[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [actionFacets, setActionFacets] = useState<ActionFacet[]>([])
  const [roleFacets, setRoleFacets] = useState<RoleFacet[]>([])
  const [topQueries, setTopQueries] = useState<TopQuery[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(50)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [emailFilter, setEmailFilter] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [includeDemo, setIncludeDemo] = useState(false)

  const totalPages = Math.max(1, Math.ceil(total / limit))

  const queryString = useMemo(() => {
    const p = new URLSearchParams()
    if (emailFilter) p.set('email', emailFilter)
    if (actionFilter && actionFilter !== 'all') p.set('action', actionFilter)
    if (roleFilter && roleFilter !== 'all') p.set('role', roleFilter)
    if (dateFrom) p.set('dateFrom', dateFrom)
    if (dateTo) p.set('dateTo', dateTo)
    if (includeDemo) p.set('includeDemo', 'true')
    p.set('page', String(page))
    p.set('limit', String(limit))
    return p.toString()
  }, [emailFilter, actionFilter, roleFilter, dateFrom, dateTo, includeDemo, page, limit])

  useEffect(() => {
    if (status !== 'authenticated') return
    let aborted = false
    setLoading(true)
    setError(null)
    fetch(`/api/admin/audit-logs?${queryString}`)
      .then(async r => {
        if (!r.ok) throw new Error((await r.json()).error || `HTTP ${r.status}`)
        return r.json()
      })
      .then(data => {
        if (aborted) return
        setRows(data.rows)
        setTotal(data.total)
        setActionFacets(data.actionFacets || [])
        setRoleFacets(data.roleFacets || [])
      })
      .catch(err => {
        if (!aborted) setError(String(err.message || err))
      })
      .finally(() => {
        if (!aborted) setLoading(false)
      })
    return () => {
      aborted = true
    }
  }, [queryString, status])

  useEffect(() => {
    if (status !== 'authenticated') return
    fetch(`/api/admin/audit-logs/stats${includeDemo ? '?includeDemo=true' : ''}`)
      .then(r => (r.ok ? r.json() : null))
      .then(d => d && setStats(d))
      .catch(() => {})
    fetch('/api/admin/audit-logs/top-queries?days=7')
      .then(r => (r.ok ? r.json() : null))
      .then(d => d && setTopQueries(d.top || []))
      .catch(() => {})
  }, [status, includeDemo])

  if (status === 'loading') {
    return <div className="p-8 text-muted-foreground">Loading…</div>
  }

  if (status !== 'authenticated') {
    return <div className="p-8">Not signed in.</div>
  }

  const isAuthorized =
    session?.user?.role === 'ADMIN' ||
    session?.user?.email?.toLowerCase() === 'chefane.fabio@gmail.com'

  if (!isAuthorized) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Forbidden</h1>
        <p className="text-muted-foreground">
          This page is restricted to platform admins.
        </p>
      </div>
    )
  }

  const resetFilters = () => {
    setEmailFilter('')
    setActionFilter('all')
    setRoleFilter('all')
    setDateFrom('')
    setDateTo('')
    setPage(1)
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Observability</h1>
        <p className="text-muted-foreground mt-1">
          Login + search activity across the platform. Read-only.
        </p>
      </div>

      <AdminSubNav />

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Logins (24h)" value={stats?.logins24h} />
        <StatCard label="Logins (7d)" value={stats?.logins7d} />
        <StatCard label="Unique users (7d)" value={stats?.uniqueUsers7d} />
        <StatCard label="Searches (24h)" value={stats?.searches24h} />
        <StatCard label="Searches (7d)" value={stats?.searches7d} />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground">Email contains</label>
              <Input
                value={emailFilter}
                placeholder="user@example.com"
                onChange={e => {
                  setEmailFilter(e.target.value)
                  setPage(1)
                }}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Segment</label>
              <Select
                value={roleFilter}
                onValueChange={v => {
                  setRoleFilter(v)
                  setPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All segments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All segments</SelectItem>
                  {roleFacets.map(f => (
                    <SelectItem key={f.role} value={f.role}>
                      {f.role} ({f.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Action</label>
              <Select
                value={actionFilter}
                onValueChange={v => {
                  setActionFilter(v)
                  setPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actions</SelectItem>
                  {actionFacets.map(f => (
                    <SelectItem key={f.action} value={f.action}>
                      {f.action} ({f.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">From</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={e => {
                  setDateFrom(e.target.value)
                  setPage(1)
                }}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">To</label>
              <Input
                type="date"
                value={dateTo}
                onChange={e => {
                  setDateTo(e.target.value)
                  setPage(1)
                }}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3 items-center">
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.location.href = `/api/admin/audit-logs/export?${queryString}`
              }}
            >
              Export CSV
            </Button>
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none ml-3">
              <input
                type="checkbox"
                checked={includeDemo}
                onChange={e => { setIncludeDemo(e.target.checked); setPage(1) }}
                className="h-3.5 w-3.5"
              />
              Include demo accounts
            </label>
            <span className="text-xs text-muted-foreground self-center ml-auto">
              {total.toLocaleString()} events
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Top queries (7d) */}
      {topQueries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top searches (last 7 days)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Query</TableHead>
                  <TableHead className="w-44">Action</TableHead>
                  <TableHead className="w-24 text-right">Count</TableHead>
                  <TableHead className="w-32 text-right">Unique users</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topQueries.map((q, i) => (
                  <TableRow key={`${q.action}-${i}`}>
                    <TableCell className="font-medium">{q.query}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                          ACTION_BADGE[q.action] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {q.action}
                      </span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{q.count}</TableCell>
                    <TableCell className="text-right tabular-nums">{q.uniqueUsers}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {error && (
            <div className="p-4 text-sm text-rose-700 bg-rose-50 border-b">
              {error}
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-44">Time</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-28">Role</TableHead>
                <TableHead className="w-44">Action</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Loading…
                  </TableCell>
                </TableRow>
              )}
              {!loading && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No events match these filters.
                  </TableCell>
                </TableRow>
              )}
              {rows.map(row => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-xs whitespace-nowrap">
                    {new Date(row.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {row.actorEmail ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          className="text-blue-700 hover:underline text-left"
                          onClick={() => {
                            setEmailFilter(row.actorEmail || '')
                            setPage(1)
                          }}
                          title="Filter to this user"
                        >
                          {row.actorEmail}
                        </button>
                        {row.actorId && (
                          <a
                            href={`/dashboard/admin/users/${row.actorId}`}
                            className="text-xs text-muted-foreground hover:text-foreground"
                            title="Open user profile"
                          >
                            ↗
                          </a>
                        )}
                      </div>
                    ) : (
                      <em className="text-muted-foreground">anon</em>
                    )}
                  </TableCell>
                  <TableCell>
                    {row.actorRole && (
                      <button
                        type="button"
                        onClick={() => {
                          setRoleFilter(row.actorRole as string)
                          setPage(1)
                        }}
                        title="Filter to this segment"
                      >
                        <Badge variant="outline" className="text-xs hover:bg-muted">
                          {row.actorRole}
                        </Badge>
                      </button>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                        ACTION_BADGE[row.action] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {row.action}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xl">
                    <ContextCell context={row.context} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || loading}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages || loading}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number | undefined }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-2xl font-bold">
          {value === undefined ? '—' : value.toLocaleString()}
        </div>
        <div className="text-sm text-muted-foreground mt-1">{label}</div>
      </CardContent>
    </Card>
  )
}

function ContextCell({ context }: { context: Record<string, unknown> | null }) {
  if (!context || Object.keys(context).length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>
  }
  // Friendly summary for known shapes
  const ctx = context as {
    endpoint?: string
    query?: Record<string, unknown>
    provider?: string
    naturalLanguage?: string
    ip?: string
  }
  const summary: string[] = []
  if (ctx.endpoint) summary.push(ctx.endpoint)
  if (ctx.provider) summary.push(`provider=${ctx.provider}`)
  if (ctx.query && typeof ctx.query === 'object') {
    const q = ctx.query as Record<string, unknown>
    if (q.naturalLanguage) summary.push(`q="${String(q.naturalLanguage).slice(0, 80)}"`)
    else {
      const compact = Object.entries(q)
        .filter(([, v]) => v !== '' && v !== null && v !== undefined)
        .map(([k, v]) => `${k}=${typeof v === 'object' ? JSON.stringify(v) : v}`)
        .slice(0, 4)
        .join(' · ')
      if (compact) summary.push(compact)
    }
  }
  return (
    <details className="cursor-pointer">
      <summary className="text-sm">
        {summary.length > 0 ? summary.join(' · ') : 'view'}
      </summary>
      <pre className="text-xs bg-muted/40 rounded p-2 mt-2 overflow-x-auto">
        {JSON.stringify(context, null, 2)}
      </pre>
    </details>
  )
}
