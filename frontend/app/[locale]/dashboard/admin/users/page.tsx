'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
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
import { Link } from '@/navigation'
import { AdminSubNav } from '../_components/AdminSubNav'

type UserRow = {
  id: string
  email: string
  name: string | null
  role: string
  affiliation: string | null
  jobTitle: string | null
  country: string
  subscriptionTier: string
  emailVerified: boolean
  profilePublic: boolean
  createdAt: string
  lastLoginAt: string | null
  projectsCount: number
  applicationsCount: number
  messagesCount: number
}

type RoleFacet = { role: string; count: number }

const ROLE_BADGE: Record<string, string> = {
  STUDENT: 'bg-blue-100 text-blue-800',
  RECRUITER: 'bg-emerald-100 text-emerald-800',
  UNIVERSITY: 'bg-purple-100 text-purple-800',
  PROFESSOR: 'bg-amber-100 text-amber-800',
  ADMIN: 'bg-rose-100 text-rose-800',
  TECHPARK: 'bg-cyan-100 text-cyan-800',
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession()
  const [rows, setRows] = useState<UserRow[]>([])
  const [total, setTotal] = useState(0)
  const [roleFacets, setRoleFacets] = useState<RoleFacet[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(50)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [verifiedFilter, setVerifiedFilter] = useState('all')
  const [sort, setSort] = useState<'createdAt' | 'lastLoginAt' | 'email'>('createdAt')
  const [dir, setDir] = useState<'asc' | 'desc'>('desc')

  const totalPages = Math.max(1, Math.ceil(total / limit))

  const queryString = useMemo(() => {
    const p = new URLSearchParams()
    if (search) p.set('search', search)
    if (roleFilter && roleFilter !== 'all') p.set('role', roleFilter)
    if (verifiedFilter && verifiedFilter !== 'all') p.set('verified', verifiedFilter)
    p.set('sort', sort)
    p.set('dir', dir)
    p.set('page', String(page))
    p.set('limit', String(limit))
    return p.toString()
  }, [search, roleFilter, verifiedFilter, sort, dir, page, limit])

  useEffect(() => {
    if (status !== 'authenticated') return
    let aborted = false
    setLoading(true)
    setError(null)
    fetch(`/api/admin/users?${queryString}`)
      .then(async r => {
        if (!r.ok) throw new Error((await r.json()).error || `HTTP ${r.status}`)
        return r.json()
      })
      .then(data => {
        if (aborted) return
        setRows(data.rows)
        setTotal(data.total)
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

  if (status === 'loading') return <div className="p-8 text-muted-foreground">Loading…</div>
  if (status !== 'authenticated') return <div className="p-8">Not signed in.</div>

  const isAuthorized =
    session?.user?.role === 'ADMIN' ||
    session?.user?.email?.toLowerCase() === 'chefane.fabio@gmail.com'

  if (!isAuthorized) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Forbidden</h1>
        <p className="text-muted-foreground">This page is restricted to platform admins.</p>
      </div>
    )
  }

  const toggleSort = (column: 'createdAt' | 'lastLoginAt' | 'email') => {
    if (sort === column) {
      setDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSort(column)
      setDir('desc')
    }
    setPage(1)
  }

  const SortHead = ({
    label,
    column,
    className,
  }: {
    label: string
    column: 'createdAt' | 'lastLoginAt' | 'email'
    className?: string
  }) => (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => toggleSort(column)}
        className="inline-flex items-center gap-1 hover:text-foreground"
      >
        {label}
        {sort === column && <span className="text-xs">{dir === 'asc' ? '↑' : '↓'}</span>}
      </button>
    </TableHead>
  )

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground mt-1">
          Every account on the platform. Read-only.
        </p>
      </div>

      <AdminSubNav />

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <StatCard label="Total" value={total} />
        {roleFacets.slice(0, 5).map(f => (
          <StatCard key={f.role} label={f.role} value={f.count} />
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground">
                Search (email · name · university · company)
              </label>
              <Input
                value={search}
                placeholder="anything…"
                onChange={e => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Role</label>
              <Select
                value={roleFilter}
                onValueChange={v => {
                  setRoleFilter(v)
                  setPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  {roleFacets.map(f => (
                    <SelectItem key={f.role} value={f.role}>
                      {f.role} ({f.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Email verified</label>
              <Select
                value={verifiedFilter}
                onValueChange={v => {
                  setVerifiedFilter(v)
                  setPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="true">Verified</SelectItem>
                  <SelectItem value="false">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center mt-3">
            <span className="text-xs text-muted-foreground ml-auto">
              {total.toLocaleString()} users
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {error && (
            <div className="p-4 text-sm text-rose-700 bg-rose-50 border-b">{error}</div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <SortHead label="Email" column="email" />
                <TableHead>Name</TableHead>
                <TableHead className="w-28">Role</TableHead>
                <TableHead>Affiliation</TableHead>
                <TableHead className="w-16 text-right">Proj</TableHead>
                <TableHead className="w-16 text-right">Apps</TableHead>
                <TableHead className="w-16 text-right">Msgs</TableHead>
                <TableHead className="w-16 text-center">✉</TableHead>
                <SortHead label="Registered" column="createdAt" className="w-36" />
                <SortHead label="Last login" column="lastLoginAt" className="w-36" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                    Loading…
                  </TableCell>
                </TableRow>
              )}
              {!loading && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                    No users match these filters.
                  </TableCell>
                </TableRow>
              )}
              {rows.map(u => (
                <TableRow key={u.id}>
                  <TableCell className="font-mono text-xs">
                    <Link
                      href={`/dashboard/admin/users/${u.id}`}
                      className="text-blue-700 hover:underline"
                    >
                      {u.email}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">
                    {u.name ? (
                      <Link
                        href={`/dashboard/admin/users/${u.id}`}
                        className="hover:underline"
                      >
                        {u.name}
                      </Link>
                    ) : (
                      <em className="text-muted-foreground">—</em>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                        ROLE_BADGE[u.role] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {u.affiliation || <em className="text-muted-foreground">—</em>}
                    {u.jobTitle && (
                      <div className="text-xs text-muted-foreground">{u.jobTitle}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{u.projectsCount}</TableCell>
                  <TableCell className="text-right tabular-nums">{u.applicationsCount}</TableCell>
                  <TableCell className="text-right tabular-nums">{u.messagesCount}</TableCell>
                  <TableCell className="text-center">
                    {u.emailVerified ? (
                      <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50">
                        ✓
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono text-xs whitespace-nowrap">
                    {u.lastLoginAt ? (
                      new Date(u.lastLoginAt).toLocaleString()
                    ) : (
                      <em className="text-muted-foreground">never</em>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
      <CardContent className="p-4">
        <div className="text-xl font-bold tabular-nums">
          {value === undefined ? '—' : value.toLocaleString()}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      </CardContent>
    </Card>
  )
}
