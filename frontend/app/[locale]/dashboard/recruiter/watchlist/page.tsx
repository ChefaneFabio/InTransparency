'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import {
  Bell,
  Bookmark,
  Users,
  Search,
  Star,
  Folder,
  ExternalLink,
  Trash2,
  RefreshCw,
  Plus,
} from 'lucide-react'

interface SavedCandidate {
  id: string
  candidateId: string
  folder: string | null
  notes: string | null
  rating: number | null
  tags: string[]
  savedAt: string
  candidate: {
    id: string
    firstName: string | null
    lastName: string | null
    university: string | null
    degree: string | null
    graduationYear: string | null
    photo: string | null
    gpa: number | null
    projectCount: number
  }
}

interface SavedSearch {
  id: string
  name: string
  description: string | null
  filters: Record<string, unknown>
  isActive: boolean
  alertsEnabled: boolean
  alertFrequency: string
  candidateCount: number
  newMatches: number
  lastRunAt: string | null
  createdAt: string
  updatedAt: string
}

function formatRelative(iso: string | null, t: (k: any, v?: any) => string): string {
  if (!iso) return t('never')
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diff = Math.max(0, now - then)
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return t('justNow')
  if (minutes < 60) return t('minutesAgo', { count: minutes })
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return t('hoursAgo', { count: hours })
  const days = Math.floor(hours / 24)
  if (days < 30) return t('daysAgo', { count: days })
  const months = Math.floor(days / 30)
  return t('monthsAgo', { count: months })
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return text.slice(0, max).trimEnd() + '…'
}

export default function RecruiterWatchlistPage() {
  const t = useTranslations('recruiterWatchlist')
  const [savedCandidates, setSavedCandidates] = useState<SavedCandidate[]>([])
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadAll = async () => {
    try {
      setError(null)
      const [candRes, searchRes] = await Promise.all([
        fetch('/api/dashboard/recruiter/saved-candidates'),
        fetch('/api/dashboard/recruiter/saved-searches'),
      ])
      if (!candRes.ok || !searchRes.ok) {
        throw new Error('Failed to load watchlist')
      }
      const candData = await candRes.json()
      const searchData = await searchRes.json()
      setSavedCandidates(candData.savedCandidates || [])
      setSavedSearches(searchData.savedSearches || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  const runAlerts = async () => {
    try {
      setRunning(true)
      const res = await fetch('/api/dashboard/recruiter/saved-searches/process-alerts', {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to run alerts')
      await loadAll()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setRunning(false)
    }
  }

  const removeCandidate = async (candidateId: string) => {
    try {
      const res = await fetch('/api/dashboard/recruiter/saved-candidates', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId }),
      })
      if (!res.ok) throw new Error('Failed to remove')
      setSavedCandidates((prev) => prev.filter((sc) => sc.candidateId !== candidateId))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  const alertsCount = useMemo(
    () => savedSearches.filter((s) => s.newMatches > 0).length,
    [savedSearches]
  )

  const totalNewMatches = useMemo(
    () => savedSearches.reduce((sum, s) => sum + (s.newMatches || 0), 0),
    [savedSearches]
  )

  const grouped = useMemo(() => {
    const map = new Map<string, SavedCandidate[]>()
    for (const sc of savedCandidates) {
      const key = sc.folder && sc.folder.trim().length > 0 ? sc.folder : t('defaultFolder')
      const list = map.get(key) || []
      list.push(sc)
      map.set(key, list)
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [savedCandidates, t])

  const initials = (first: string | null, last: string | null) =>
    `${(first?.[0] || '').toUpperCase()}${(last?.[0] || '').toUpperCase()}` || '?'

  return (
    <div className="space-y-6">
      <MetricHero>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Bookmark className="h-4 w-4" />
              {t('eyebrow')}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('title')}</h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">{t('subtitle')}</p>
          </div>
          <div className="flex gap-6">
            <div>
              <div className="text-xs text-muted-foreground">{t('savedCandidatesLabel')}</div>
              <div className="text-2xl font-bold text-foreground">{savedCandidates.length}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{t('savedSearchesLabel')}</div>
              <div className="text-2xl font-bold text-foreground">{savedSearches.length}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{t('newMatchesLabel')}</div>
              <div className="text-2xl font-bold text-primary">{totalNewMatches}</div>
            </div>
          </div>
        </div>
      </MetricHero>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 text-destructive text-sm px-4 py-3">
          {error}
        </div>
      )}

      {/* Alerts header row */}
      <GlassCard gradient="amber" className="p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
              <Bell className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <div className="font-semibold text-foreground">{t('alertsHeading')}</div>
              <div className="text-sm text-muted-foreground">
                {alertsCount > 0
                  ? t('alertsActive', { count: alertsCount })
                  : t('alertsNone')}
              </div>
            </div>
          </div>
          <Button onClick={runAlerts} disabled={running || savedSearches.length === 0}>
            <RefreshCw className={`h-4 w-4 mr-2 ${running ? 'animate-spin' : ''}`} />
            {running ? t('running') : t('runAlerts')}
          </Button>
        </div>
      </GlassCard>

      {/* Saved searches section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">{t('savedSearchesHeading')}</h2>
            <Badge variant="secondary">{savedSearches.length}</Badge>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/recruiter/candidates">
              <Plus className="h-4 w-4 mr-1" />
              {t('newSearch')}
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[0, 1].map((i) => (
              <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : savedSearches.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <EmptyState
                icon={Search}
                title={t('emptySearchesTitle')}
                description={t('emptySearchesDescription')}
                action={{
                  label: t('goToCandidates'),
                  href: '/dashboard/recruiter/candidates',
                }}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedSearches.map((s) => {
              const filtersStr = truncate(JSON.stringify(s.filters || {}), 120)
              return (
                <Card key={s.id} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base font-semibold flex-1">{s.name}</CardTitle>
                      {s.newMatches > 0 && (
                        <Badge className="bg-amber-500 text-white hover:bg-amber-600">
                          {t('newMatchesBadge', { count: s.newMatches })}
                        </Badge>
                      )}
                    </div>
                    {s.description && (
                      <p className="text-xs text-muted-foreground mt-1">{s.description}</p>
                    )}
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-3">
                    <code className="text-xs bg-muted rounded px-2 py-1.5 font-mono text-muted-foreground break-all">
                      {filtersStr}
                    </code>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {t('candidateCount', { count: s.candidateCount })}
                      </span>
                      <span>
                        {t('lastRun')}: {formatRelative(s.lastRunAt, t)}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-auto pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={runAlerts}
                        disabled={running}
                        className="flex-1"
                      >
                        <RefreshCw className={`h-4 w-4 mr-1 ${running ? 'animate-spin' : ''}`} />
                        {t('rerun')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      {/* Saved candidates section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">{t('savedCandidatesHeading')}</h2>
            <Badge variant="secondary">{savedCandidates.length}</Badge>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : savedCandidates.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <EmptyState
                icon={Bookmark}
                title={t('emptyCandidatesTitle')}
                description={t('emptyCandidatesDescription')}
                action={{
                  label: t('goToCandidates'),
                  href: '/dashboard/recruiter/candidates',
                }}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {grouped.map(([folder, items]) => (
              <div key={folder}>
                <div className="flex items-center gap-2 mb-3">
                  <Folder className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">{folder}</h3>
                  <Badge variant="outline" className="text-xs">
                    {items.length}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((sc) => {
                    const c = sc.candidate
                    const fullName = `${c.firstName || ''} ${c.lastName || ''}`.trim() || t('unnamed')
                    const profileHref = `/students/${c.id}/public`
                    return (
                      <Card key={sc.id} className="flex flex-col">
                        <CardContent className="pt-5 flex-1 flex flex-col gap-3">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-12 w-12">
                              {c.photo && <AvatarImage src={c.photo} alt={fullName} />}
                              <AvatarFallback>{initials(c.firstName, c.lastName)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-foreground truncate">{fullName}</div>
                              <div className="text-xs text-muted-foreground truncate">
                                {c.university || t('noUniversity')}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {c.degree || t('noDegree')}
                                {c.graduationYear ? ` · ${c.graduationYear}` : ''}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <Bookmark className="h-3 w-3" />
                              {t('projectsCount', { count: c.projectCount })}
                            </span>
                            {sc.rating && sc.rating > 0 && (
                              <span className="inline-flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <Star
                                    key={n}
                                    className={`h-3 w-3 ${
                                      n <= (sc.rating || 0)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-muted-foreground/30'
                                    }`}
                                  />
                                ))}
                              </span>
                            )}
                          </div>

                          {sc.tags && sc.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {sc.tags.slice(0, 4).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {sc.tags.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{sc.tags.length - 4}
                                </Badge>
                              )}
                            </div>
                          )}

                          {sc.notes && (
                            <p className="text-xs text-muted-foreground border-l-2 border-muted pl-2 italic">
                              {truncate(sc.notes, 120)}
                            </p>
                          )}

                          <div className="flex gap-2 mt-auto pt-2">
                            <Button variant="outline" size="sm" asChild className="flex-1">
                              <Link href={profileHref}>
                                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                                {t('openProfile')}
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCandidate(sc.candidateId)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              aria-label={t('remove')}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
