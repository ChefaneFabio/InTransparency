'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { AdminSubNav } from '../_components/AdminSubNav'
import { Loader2, Plus, X, Search, AlertCircle } from 'lucide-react'

type Institution = {
  id: string
  name: string
  slug: string
  type: string
  country: string | null
}
type CompanyOption = {
  name: string
  profileId: string | null
  slug: string | null
  logoUrl: string | null
  recruiterCount: number
}
type Grant = {
  id: string
  companyDisplayName: string
  companyNameKey: string
  programs: string[]
  cohortYears: number[]
  allowSearch: boolean
  allowProfile: boolean
  allowContact: boolean
  grantedAt: string
  expiresAt: string | null
  revokedAt: string | null
  notes: string | null
  institution: { id: string; name: string; slug: string; type: string }
  companyProfile: { id: string; companyName: string; logoUrl: string | null } | null
}

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
  { value: 'revoked', label: 'Revoked' },
  { value: 'all', label: 'All' },
]

export default function AccessGrantsPage() {
  const { data: session, status } = useSession()
  const [grants, setGrants] = useState<Grant[]>([])
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [companies, setCompanies] = useState<CompanyOption[]>([])
  const [statusFilter, setStatusFilter] = useState('active')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)

  const isAdmin =
    session?.user?.role === 'ADMIN' ||
    session?.user?.email?.toLowerCase() === 'chefane.fabio@gmail.com'

  async function loadGrants() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/access-grants?status=${statusFilter}`)
      if (res.ok) {
        const data = await res.json()
        setGrants(data.grants ?? [])
      }
    } finally {
      setLoading(false)
    }
  }

  async function loadLookups() {
    const res = await fetch('/api/admin/access-grants/lookups')
    if (res.ok) {
      const data = await res.json()
      setInstitutions(data.institutions ?? [])
      setCompanies(data.companies ?? [])
    }
  }

  useEffect(() => {
    if (status !== 'authenticated' || !isAdmin) return
    loadGrants()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, isAdmin, statusFilter])

  useEffect(() => {
    if (status !== 'authenticated' || !isAdmin) return
    loadLookups()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, isAdmin])

  async function handleRevoke(id: string) {
    if (!confirm('Revoke this access grant? The company will lose access to this institution immediately.')) return
    const res = await fetch(`/api/admin/access-grants/${id}`, { method: 'DELETE' })
    if (res.ok) {
      loadGrants()
    } else {
      const data = await res.json().catch(() => ({}))
      alert(data.error ?? 'Failed to revoke')
    }
  }

  const filteredGrants = useMemo(() => {
    if (!search.trim()) return grants
    const q = search.toLowerCase()
    return grants.filter(
      g =>
        g.companyDisplayName.toLowerCase().includes(q) ||
        g.institution.name.toLowerCase().includes(q)
    )
  }, [grants, search])

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
          <h1 className="text-2xl font-bold">Access Grants</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Authorise specific companies to browse, view, and contact students of
            specific academic partners. When a company has zero active grants the
            default behaviour applies (recruiters can search the full pool). Add
            even one grant and the company is restricted to the granted institutions
            only.
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              New grant
            </Button>
          </DialogTrigger>
          <CreateGrantDialog
            institutions={institutions}
            companies={companies}
            onCreated={() => {
              setCreateOpen(false)
              loadGrants()
            }}
          />
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search company or institution…"
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(o => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredGrants.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No grants {statusFilter !== 'all' ? `(${statusFilter})` : ''}.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Filters</TableHead>
                  <TableHead>Granted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGrants.map(g => (
                  <TableRow key={g.id}>
                    <TableCell>
                      <div className="font-medium">{g.companyDisplayName}</div>
                      <div className="text-xs text-muted-foreground font-mono">{g.companyNameKey}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{g.institution.name}</div>
                      <div className="text-xs text-muted-foreground">{g.institution.type.replace(/_/g, ' ')}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {g.allowSearch && <Badge variant="secondary" className="text-xs">search</Badge>}
                        {g.allowProfile && <Badge variant="secondary" className="text-xs">profile</Badge>}
                        {g.allowContact && <Badge variant="secondary" className="text-xs">contact</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {g.programs.length === 0 && g.cohortYears.length === 0 ? (
                        <span className="text-muted-foreground">All students</span>
                      ) : (
                        <div className="space-y-0.5">
                          {g.programs.length > 0 && (
                            <div>
                              <span className="text-muted-foreground">Programs:</span> {g.programs.join(', ')}
                            </div>
                          )}
                          {g.cohortYears.length > 0 && (
                            <div>
                              <span className="text-muted-foreground">Cohorts:</span> {g.cohortYears.join(', ')}
                            </div>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(g.grantedAt).toLocaleDateString()}
                      {g.expiresAt && (
                        <div>expires {new Date(g.expiresAt).toLocaleDateString()}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <GrantStatusBadge grant={g} />
                    </TableCell>
                    <TableCell className="text-right">
                      {g.revokedAt ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => handleRevoke(g.id)}>
                          <X className="h-3.5 w-3.5 mr-1" />
                          Revoke
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function GrantStatusBadge({ grant }: { grant: Grant }) {
  if (grant.revokedAt) {
    return <Badge variant="outline" className="text-xs">Revoked</Badge>
  }
  if (grant.expiresAt && new Date(grant.expiresAt) <= new Date()) {
    return <Badge variant="outline" className="text-xs">Expired</Badge>
  }
  return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 text-xs">Active</Badge>
}

function CreateGrantDialog({
  institutions,
  companies,
  onCreated,
}: {
  institutions: Institution[]
  companies: CompanyOption[]
  onCreated: () => void
}) {
  const [companyName, setCompanyName] = useState('')
  const [companyProfileId, setCompanyProfileId] = useState<string | null>(null)
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>([])
  const [expiresAt, setExpiresAt] = useState('')
  const [allowSearch, setAllowSearch] = useState(true)
  const [allowProfile, setAllowProfile] = useState(true)
  const [allowContact, setAllowContact] = useState(true)
  const [programsRaw, setProgramsRaw] = useState('')
  const [cohortYearsRaw, setCohortYearsRaw] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [companyQuery, setCompanyQuery] = useState('')

  const matchingCompanies = useMemo(() => {
    const q = companyQuery.trim().toLowerCase()
    if (!q) return companies.slice(0, 8)
    return companies
      .filter(c => c.name.toLowerCase().includes(q))
      .slice(0, 8)
  }, [companies, companyQuery])

  function pickCompany(c: CompanyOption) {
    setCompanyName(c.name)
    setCompanyQuery(c.name)
    setCompanyProfileId(c.profileId)
  }

  async function handleSubmit() {
    setError('')
    if (!companyName.trim()) {
      setError('Pick or type a company name.')
      return
    }
    if (selectedInstitutions.length === 0) {
      setError('Select at least one institution.')
      return
    }
    setSubmitting(true)
    try {
      const programs = programsRaw
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
      const cohortYears = cohortYearsRaw
        .split(',')
        .map(s => parseInt(s.trim(), 10))
        .filter(n => Number.isFinite(n))
      const body = {
        companyDisplayName: companyName.trim(),
        companyProfileId: companyProfileId ?? undefined,
        institutionIds: selectedInstitutions,
        programs,
        cohortYears,
        allowSearch,
        allowProfile,
        allowContact,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        notes: notes.trim() || undefined,
      }
      const res = await fetch('/api/admin/access-grants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to create grant')
        return
      }
      onCreated()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Grant access</DialogTitle>
        <DialogDescription>
          Allow a company to browse students of one or more academic partners.
          The grant takes effect immediately and can be revoked at any time.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md flex items-start gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-2">
          <Label>Company</Label>
          <Input
            value={companyQuery}
            onChange={e => {
              setCompanyQuery(e.target.value)
              setCompanyName(e.target.value)
              setCompanyProfileId(null)
            }}
            placeholder="Type or pick a company…"
          />
          {matchingCompanies.length > 0 && (
            <div className="border rounded-md max-h-40 overflow-y-auto">
              {matchingCompanies.map(c => (
                <button
                  key={c.name + (c.profileId ?? '')}
                  type="button"
                  onClick={() => pickCompany(c)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-muted ${
                    companyName === c.name ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {c.profileId && 'profile · '}
                      {c.recruiterCount} recruiter{c.recruiterCount === 1 ? '' : 's'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Match is case-insensitive against recruiters' company field. Typos
            silently fail — pick from the list when possible.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Academic partners</Label>
          <div className="border rounded-md max-h-56 overflow-y-auto">
            {institutions.map(i => (
              <label
                key={i.id}
                className="flex items-center gap-2 px-3 py-2 hover:bg-muted cursor-pointer text-sm"
              >
                <Checkbox
                  checked={selectedInstitutions.includes(i.id)}
                  onCheckedChange={checked => {
                    setSelectedInstitutions(prev =>
                      checked ? [...prev, i.id] : prev.filter(id => id !== i.id)
                    )
                  }}
                />
                <span className="flex-1">{i.name}</span>
                <span className="text-xs text-muted-foreground">
                  {i.type.replace(/_/g, ' ')} · {i.country ?? '—'}
                </span>
              </label>
            ))}
            {institutions.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No institutions registered yet.
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            One grant row will be created per selected institution.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiresAt">Expires (optional)</Label>
          <Input
            id="expiresAt"
            type="date"
            value={expiresAt}
            onChange={e => setExpiresAt(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Leave blank for indefinite. Set to end-of-recruiting-season for
            seasonal partnerships.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(s => !s)}
            className="text-sm text-primary hover:underline"
          >
            {showAdvanced ? '− Hide' : '+ Show'} advanced (scope, programs, cohorts)
          </button>
        </div>

        {showAdvanced && (
          <div className="space-y-4 border-l-2 border-muted pl-4">
            <div className="space-y-3">
              <Label>What this grant unlocks</Label>
              {[
                {
                  key: 'allowSearch',
                  label: 'Search & browse',
                  desc: 'Recruiters can find these students in talent search results.',
                  value: allowSearch,
                  set: setAllowSearch,
                },
                {
                  key: 'allowProfile',
                  label: 'View profile',
                  desc: 'Open the full profile page incl. projects and decision pack.',
                  value: allowProfile,
                  set: setAllowProfile,
                },
                {
                  key: 'allowContact',
                  label: 'Send messages',
                  desc: 'Direct outreach to the student via the platform inbox.',
                  value: allowContact,
                  set: setAllowContact,
                },
              ].map(s => (
                <div key={s.key} className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{s.label}</div>
                    <div className="text-xs text-muted-foreground">{s.desc}</div>
                  </div>
                  <Switch checked={s.value} onCheckedChange={s.set} />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="programs">Programs (optional, comma-separated)</Label>
              <Input
                id="programs"
                value={programsRaw}
                onChange={e => setProgramsRaw(e.target.value)}
                placeholder="MSc Computer Engineering, BSc Industrial Design"
              />
              <p className="text-xs text-muted-foreground">
                Empty = all programs at the institution. Match is case-insensitive
                against the student's program field on their affiliation row.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cohortYears">Graduating cohorts (optional)</Label>
              <Input
                id="cohortYears"
                value={cohortYearsRaw}
                onChange={e => setCohortYearsRaw(e.target.value)}
                placeholder="2026, 2027"
              />
              <p className="text-xs text-muted-foreground">
                Empty = all cohorts. Comma-separated graduation years.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Internal notes (optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Why this grant exists — partnership reference, MoU date, etc."
                rows={3}
              />
            </div>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
          Create grant
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
