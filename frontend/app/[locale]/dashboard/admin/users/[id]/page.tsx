'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Link } from '@/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { ArrowLeft } from 'lucide-react'
import { AdminSubNav } from '../../_components/AdminSubNav'

type UserDetail = {
  id: string
  email: string
  name: string | null
  role: string
  affiliation: string | null
  jobTitle: string | null
  country: string
  photo: string | null
  subscriptionTier: string
  subscriptionStatus: string
  emailVerified: boolean
  emailVerifiedAt: string | null
  profilePublic: boolean
  createdAt: string
  lastLoginAt: string | null
  counts: {
    projects: number
    applications: number
    messages: number
    jobs: number
    referrals: number
  }
}

type Event = {
  id: string
  action: string
  targetType: string | null
  targetId: string | null
  context: Record<string, unknown> | null
  createdAt: string
}

type ActionFacet = { action: string; count: number }

const ROLE_BADGE: Record<string, string> = {
  STUDENT: 'bg-blue-100 text-blue-800',
  RECRUITER: 'bg-emerald-100 text-emerald-800',
  UNIVERSITY: 'bg-purple-100 text-purple-800',
  PROFESSOR: 'bg-amber-100 text-amber-800',
  ADMIN: 'bg-rose-100 text-rose-800',
  TECHPARK: 'bg-cyan-100 text-cyan-800',
}

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

export default function AdminUserDetailPage() {
  const { data: session, status } = useSession()
  const params = useParams<{ id: string }>()
  const userId = params.id
  const [user, setUser] = useState<UserDetail | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [eventTotal, setEventTotal] = useState(0)
  const [actionFacets, setActionFacets] = useState<ActionFacet[]>([])
  const [actionFilter, setActionFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status !== 'authenticated' || !userId) return
    let aborted = false
    setLoading(true)
    setError(null)
    const params = new URLSearchParams()
    if (actionFilter && actionFilter !== 'all') params.set('action', actionFilter)
    fetch(`/api/admin/users/${userId}?${params.toString()}`)
      .then(async r => {
        if (!r.ok) throw new Error((await r.json()).error || `HTTP ${r.status}`)
        return r.json()
      })
      .then(data => {
        if (aborted) return
        setUser(data.user)
        setEvents(data.events)
        setEventTotal(data.eventTotal)
        setActionFacets(data.actionFacets || [])
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
  }, [userId, status, actionFilter])

  if (status === 'loading') return <div className="p-8 text-muted-foreground">Loading…</div>
  if (status !== 'authenticated') return <div className="p-8">Not signed in.</div>

  const isAuthorized =
    session?.user?.role === 'ADMIN' ||
    session?.user?.email?.toLowerCase() === 'chefane.fabio@gmail.com'

  if (!isAuthorized) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Forbidden</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      <AdminSubNav />

      <Link
        href="/dashboard/admin/users"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All users
      </Link>

      {error && (
        <div className="p-4 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded">
          {error}
        </div>
      )}

      {!user && loading && <div className="text-muted-foreground">Loading…</div>}

      {user && (
        <>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {user.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.photo}
                    alt=""
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-xl font-semibold text-muted-foreground">
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold">
                      {user.name || <em className="text-muted-foreground">No name</em>}
                    </h1>
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                        ROLE_BADGE[user.role] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {user.role}
                    </span>
                    {user.emailVerified && (
                      <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50">
                        Email verified
                      </Badge>
                    )}
                    {user.subscriptionTier !== 'FREE' && (
                      <Badge variant="outline" className="text-amber-800 border-amber-200 bg-amber-50">
                        {user.subscriptionTier}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground font-mono mt-1">{user.email}</div>
                  {(user.affiliation || user.jobTitle) && (
                    <div className="text-sm mt-2">
                      {user.affiliation}
                      {user.jobTitle && (
                        <span className="text-muted-foreground"> · {user.jobTitle}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                <KV label="Registered" value={new Date(user.createdAt).toLocaleString()} />
                <KV
                  label="Last login"
                  value={
                    user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleString()
                      : 'Never'
                  }
                />
                <KV label="Country" value={user.country} />
                <KV
                  label="Profile"
                  value={user.profilePublic ? 'Public' : 'Private'}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 pt-4 border-t">
                <Stat label="Projects" value={user.counts.projects} />
                <Stat label="Applications" value={user.counts.applications} />
                <Stat label="Messages sent" value={user.counts.messages} />
                <Stat label="Jobs posted" value={user.counts.jobs} />
                <Stat label="Referrals" value={user.counts.referrals} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-end justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-sm font-semibold">Activity timeline</div>
                  <div className="text-xs text-muted-foreground">
                    {eventTotal.toLocaleString()} events total · showing latest {events.length}
                  </div>
                </div>
                <div className="w-full md:w-64">
                  <label className="text-xs text-muted-foreground">Action</label>
                  <Select value={actionFilter} onValueChange={setActionFilter}>
                    <SelectTrigger>
                      <SelectValue />
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
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-44">Time</TableHead>
                    <TableHead className="w-44">Action</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && events.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        Loading…
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && events.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        No events recorded for this user yet.
                      </TableCell>
                    </TableRow>
                  )}
                  {events.map(e => (
                    <TableRow key={e.id}>
                      <TableCell className="font-mono text-xs whitespace-nowrap">
                        {new Date(e.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                            ACTION_BADGE[e.action] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {e.action}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xl">
                        <ContextCell context={e.context} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-medium mt-0.5">{value}</div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-xl font-bold tabular-nums">{value.toLocaleString()}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  )
}

function ContextCell({ context }: { context: Record<string, unknown> | null }) {
  if (!context || Object.keys(context).length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>
  }
  const ctx = context as {
    endpoint?: string
    query?: Record<string, unknown>
    provider?: string
    title?: string
    backfilled?: boolean
    source?: string
  }
  const summary: string[] = []
  if (ctx.endpoint) summary.push(ctx.endpoint)
  if (ctx.provider) summary.push(`provider=${ctx.provider}`)
  if (ctx.title) summary.push(`"${ctx.title}"`)
  if (ctx.backfilled) summary.push(`backfilled · ${ctx.source ?? ''}`)
  if (ctx.query && typeof ctx.query === 'object') {
    const q = ctx.query as Record<string, unknown>
    if (q.naturalLanguage) summary.push(`q="${String(q.naturalLanguage).slice(0, 80)}"`)
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
