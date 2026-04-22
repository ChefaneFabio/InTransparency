'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from '@/navigation'
import {
  Search,
  Plus,
  GripVertical,
  ExternalLink,
  Mail,
  GraduationCap,
  Star,
  FolderGit2,
  Award,
  Clock,
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

const STAGES = ['discovered', 'contacted', 'interviewing', 'offered', 'hired'] as const
type Stage = (typeof STAGES)[number]

interface PipelineCandidate {
  id: string
  candidateId: string
  stage: Stage
  savedAt: string
  stageEnteredAt: string
  rating: number | null
  tags: string[]
  candidate: {
    id: string
    firstName: string
    lastName: string
    university: string | null
    degree: string | null
    graduationYear: number | null
    photo: string | null
    gpa: number | null
    projectCount: number
  }
}

interface SavedCandidateResponse {
  id: string
  candidateId: string
  folder: string
  savedAt: string
  stageEnteredAt: string | null
  rating: number | null
  tags: string[] | null
  candidate: {
    id: string
    firstName: string
    lastName: string
    university: string | null
    degree: string | null
    graduationYear: number | null
    photo: string | null
    gpa: number | null
    projectCount: number
  }
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0) || ''}${lastName.charAt(0) || ''}`.toUpperCase() || 'U'
}

function folderToStage(folder: string): Stage {
  const lower = (folder || '').toLowerCase()
  if ((STAGES as readonly string[]).includes(lower)) return lower as Stage
  return 'discovered'
}

function daysAgo(iso: string): number {
  const diff = Date.now() - new Date(iso).getTime()
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
}

function formatAge(days: number): string {
  if (days < 1) return 'today'
  if (days === 1) return '1d'
  if (days < 7) return `${days}d`
  if (days < 30) return `${Math.floor(days / 7)}w`
  return `${Math.floor(days / 30)}mo`
}

// Per-stage accent: top border + subtle tint + dot — HubSpot deal-stage style.
const stageAccent: Record<Stage, { border: string; tint: string; dot: string; chip: string }> = {
  discovered:   { border: 'border-t-slate-400',  tint: 'bg-slate-50/70',  dot: 'bg-slate-400',  chip: 'bg-slate-100 text-slate-700' },
  contacted:    { border: 'border-t-blue-500',   tint: 'bg-blue-50/70',   dot: 'bg-blue-500',   chip: 'bg-blue-100 text-blue-700' },
  interviewing: { border: 'border-t-amber-500',  tint: 'bg-amber-50/70',  dot: 'bg-amber-500',  chip: 'bg-amber-100 text-amber-700' },
  offered:      { border: 'border-t-purple-500', tint: 'bg-purple-50/70', dot: 'bg-purple-500', chip: 'bg-purple-100 text-purple-700' },
  hired:        { border: 'border-t-green-600',  tint: 'bg-green-50/70',  dot: 'bg-green-600',  chip: 'bg-green-100 text-green-700' },
}

export default function RecruiterPipelinePage() {
  const t = useTranslations('recruiterPipeline')
  const [candidates, setCandidates] = useState<PipelineCandidate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [dragOver, setDragOver] = useState<Stage | null>(null)
  const draggedId = useRef<string | null>(null)

  const fetchCandidates = useCallback(() => {
    setLoading(true)
    setError(null)

    fetch('/api/dashboard/recruiter/saved-candidates')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load pipeline')
        return res.json()
      })
      .then(data => {
        const saved: SavedCandidateResponse[] = data.savedCandidates || []
        const mapped: PipelineCandidate[] = saved.map(sc => ({
          id: sc.id,
          candidateId: sc.candidateId,
          stage: folderToStage(sc.folder),
          savedAt: sc.savedAt,
          stageEnteredAt: sc.stageEnteredAt || sc.savedAt,
          rating: sc.rating,
          tags: sc.tags || [],
          candidate: sc.candidate,
        }))
        setCandidates(mapped)
        setLoading(false)
      })
      .catch(() => {
        setError(t('error'))
        setLoading(false)
      })
  }, [t])

  useEffect(() => {
    fetchCandidates()
  }, [fetchCandidates])

  const persistStage = async (rowId: string, newStage: Stage) => {
    try {
      const res = await fetch(`/api/dashboard/recruiter/saved-candidates/${rowId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: newStage }),
      })
      if (!res.ok) throw new Error()
    } catch {
      // Revert on failure by refetching
      fetchCandidates()
    }
  }

  const handleDragStart = (e: React.DragEvent, id: string) => {
    draggedId.current = id
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, stage: Stage) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOver !== stage) setDragOver(stage)
  }

  const handleDragLeave = () => setDragOver(null)

  const handleDrop = (e: React.DragEvent, toStage: Stage) => {
    e.preventDefault()
    setDragOver(null)
    const id = draggedId.current
    draggedId.current = null
    if (!id) return

    const row = candidates.find(c => c.id === id)
    if (!row || row.stage === toStage) return

    const now = new Date().toISOString()
    setCandidates(prev =>
      prev.map(c => (c.id === id ? { ...c, stage: toStage, stageEnteredAt: now } : c))
    )
    persistStage(id, toStage)
  }

  const filteredCandidates = useMemo(() => {
    if (!searchQuery) return candidates
    const q = searchQuery.toLowerCase()
    return candidates.filter(c => {
      const fullName = `${c.candidate.firstName} ${c.candidate.lastName}`.toLowerCase()
      return (
        fullName.includes(q) ||
        (c.candidate.university || '').toLowerCase().includes(q) ||
        (c.candidate.degree || '').toLowerCase().includes(q) ||
        (c.tags || []).some(tag => tag.toLowerCase().includes(q))
      )
    })
  }, [candidates, searchQuery])

  const getCandidatesForStage = (stage: Stage) =>
    filteredCandidates.filter(c => c.stage === stage)

  const conversionSummary = useMemo(() => {
    const byStage: Record<Stage, number> = {
      discovered: 0, contacted: 0, interviewing: 0, offered: 0, hired: 0,
    }
    for (const c of filteredCandidates) byStage[c.stage]++
    return byStage
  }, [filteredCandidates])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {STAGES.map(stage => (
            <div key={stage} className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <GlassCard hover={false}>
          <div className="py-12 text-center">
            <p className="text-destructive font-medium">{t('error')}</p>
            <Button variant="outline" className="mt-4" onClick={fetchCandidates}>
              {t('loading')}
            </Button>
          </div>
        </GlassCard>
      </div>
    )
  }

  if (candidates.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <GlassCard hover={false}>
          <div className="py-12 text-center px-5">
            <p className="text-lg font-medium mb-2">{t('emptyPipeline')}</p>
            <p className="text-muted-foreground mb-6">{t('emptyPipelineDesc')}</p>
            <Link href="/dashboard/recruiter/candidates">
              <Button>
                <Search className="mr-2 h-4 w-4" />
                {t('startSearching')}
              </Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    )
  }

  const totalInPipeline = filteredCandidates.length

  return (
    <div className="space-y-6">
      <MetricHero gradient="primary">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{t('title')}</h1>
            <p className="text-muted-foreground">
              {t('subtitle')} · <span className="font-medium">{totalInPipeline}</span>{' '}
              {t('inPipeline', { defaultValue: 'in pipeline' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchPlaceholder', { defaultValue: 'Search name, university, tag…' })}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 w-72"
              />
            </div>
            <Link href="/dashboard/recruiter/candidates">
              <Button variant="outline" size="sm">
                <Plus className="mr-1.5 h-4 w-4" />
                {t('startSearching')}
              </Button>
            </Link>
          </div>
        </div>
      </MetricHero>

      {/* Conversion strip — HubSpot-style funnel summary */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {STAGES.map((stage, i) => {
          const count = conversionSummary[stage]
          const accent = stageAccent[stage]
          return (
            <div key={stage} className="flex items-center gap-2 shrink-0">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${accent.chip}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
                <span>{t(`stages.${stage}`)}</span>
                <span className="font-mono tabular-nums">{count}</span>
              </div>
              {i < STAGES.length - 1 && (
                <span className="text-muted-foreground text-xs">→</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {STAGES.map(stage => {
          const stageCandidates = getCandidatesForStage(stage)
          const accent = stageAccent[stage]
          const isDropTarget = dragOver === stage
          const addedThisWeek = stageCandidates.filter(c => daysAgo(c.savedAt) <= 7).length

          return (
            <div
              key={stage}
              onDragOver={e => handleDragOver(e, stage)}
              onDragLeave={handleDragLeave}
              onDrop={e => handleDrop(e, stage)}
              className={`rounded-lg border-t-4 ${accent.border} ${accent.tint} transition-all ${
                isDropTarget ? 'ring-2 ring-primary ring-offset-2 scale-[1.01]' : ''
              }`}
            >
              {/* Column header */}
              <div className="flex items-center justify-between px-3 py-2.5 border-b bg-white/70 backdrop-blur-sm rounded-t-lg">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`h-2 w-2 rounded-full ${accent.dot} shrink-0`} />
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-700 truncate">
                    {t(`stages.${stage}`)}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {addedThisWeek > 0 && (
                    <span
                      className="text-[10px] font-medium text-green-700 bg-green-100 px-1.5 py-0.5 rounded"
                      title={t('addedThisWeek', { defaultValue: 'Added this week' })}
                    >
                      +{addedThisWeek}
                    </span>
                  )}
                  <Badge variant="secondary" className="text-xs font-mono tabular-nums">
                    {stageCandidates.length}
                  </Badge>
                </div>
              </div>

              {/* Cards */}
              <div className="p-2 space-y-2 min-h-[260px]">
                {stageCandidates.length === 0 ? (
                  <div className="h-[220px] flex items-center justify-center">
                    <p className="text-xs text-muted-foreground text-center px-2">
                      {isDropTarget
                        ? t('dropHere', { defaultValue: 'Drop here' })
                        : t('empty')}
                    </p>
                  </div>
                ) : (
                  stageCandidates.map(row => {
                    const age = daysAgo(row.stageEnteredAt)
                    const isStale = age > 14
                    const { candidate } = row
                    return (
                      <Card
                        key={row.id}
                        draggable
                        onDragStart={e => handleDragStart(e, row.id)}
                        className="group cursor-grab active:cursor-grabbing hover:shadow-md hover:border-primary/30 transition-all border bg-white"
                      >
                        <CardContent className="p-3 space-y-2">
                          {/* Header: grip + avatar + name + meta */}
                          <div className="flex items-start gap-2">
                            <GripVertical className="h-4 w-4 text-gray-300 shrink-0 mt-0.5 group-hover:text-gray-500 transition-colors" />
                            <Avatar className="h-9 w-9 shrink-0">
                              {candidate.photo ? (
                                <AvatarImage src={candidate.photo} alt={candidate.firstName} />
                              ) : null}
                              <AvatarFallback className="text-xs bg-gray-100 text-gray-700">
                                {getInitials(candidate.firstName, candidate.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm truncate text-gray-900">
                                {candidate.firstName} {candidate.lastName}
                              </p>
                              {candidate.university && (
                                <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                                  <GraduationCap className="h-3 w-3 shrink-0" />
                                  <span className="truncate">{candidate.university}</span>
                                </p>
                              )}
                              {candidate.degree && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {candidate.degree}
                                  {candidate.graduationYear ? ` · ${candidate.graduationYear}` : ''}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Metadata chips */}
                          {(candidate.projectCount > 0 || candidate.gpa || row.rating) && (
                            <div className="flex items-center gap-1.5 flex-wrap pl-6">
                              {candidate.projectCount > 0 && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
                                  <FolderGit2 className="h-3 w-3" />
                                  <span className="font-medium">{candidate.projectCount}</span>
                                </span>
                              )}
                              {candidate.gpa != null && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
                                  <Award className="h-3 w-3" />
                                  <span className="font-medium">{candidate.gpa.toFixed(1)}</span>
                                </span>
                              )}
                              {row.rating != null && row.rating > 0 && (
                                <span className="inline-flex items-center gap-0.5 text-[11px] text-amber-700">
                                  {Array.from({ length: Math.min(5, row.rating) }).map((_, i) => (
                                    <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                                  ))}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Tags */}
                          {row.tags && row.tags.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap pl-6">
                              {row.tags.slice(0, 3).map(tag => (
                                <span
                                  key={tag}
                                  className="text-[10px] text-gray-600 bg-gray-50 border px-1.5 py-0.5 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                              {row.tags.length > 3 && (
                                <span className="text-[10px] text-muted-foreground">
                                  +{row.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Footer: age + actions */}
                          <div className="flex items-center justify-between gap-1 pt-2 border-t">
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] ${
                                isStale ? 'text-red-600 font-medium' : 'text-muted-foreground'
                              }`}
                              title={
                                isStale
                                  ? t('staleWarning', { defaultValue: 'Over 2 weeks in this stage' })
                                  : ''
                              }
                            >
                              <Clock className="h-3 w-3" />
                              {formatAge(age)}
                            </span>
                            <div className="flex items-center gap-0.5">
                              <Link
                                href={`/dashboard/recruiter/candidates/${candidate.id}`}
                                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary px-1.5 py-1 rounded hover:bg-gray-50"
                                onMouseDown={e => e.stopPropagation()}
                              >
                                <ExternalLink className="h-3 w-3" />
                                <span>{t('view', { defaultValue: 'View' })}</span>
                              </Link>
                              <Link
                                href={`/dashboard/recruiter/messages?candidate=${candidate.id}`}
                                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary px-1.5 py-1 rounded hover:bg-gray-50"
                                onMouseDown={e => e.stopPropagation()}
                              >
                                <Mail className="h-3 w-3" />
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
