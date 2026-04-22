'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Link } from '@/navigation'
import {
  Search,
  Plus,
  GripVertical,
  ExternalLink,
  Mail,
  GraduationCap,
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

const STAGES = ['discovered', 'contacted', 'interviewing', 'offered', 'hired'] as const
type Stage = (typeof STAGES)[number]

interface PipelineCandidate {
  id: string
  candidateId: string
  stage: Stage
  candidate: {
    id: string
    firstName: string
    lastName: string
    university: string
    degree: string
  }
}

interface SavedCandidateResponse {
  id: string
  candidateId: string
  folder: string
  candidate: {
    id: string
    firstName: string
    lastName: string
    university: string
    degree: string
  }
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

function folderToStage(folder: string): Stage {
  const lower = folder.toLowerCase()
  if ((STAGES as readonly string[]).includes(lower)) return lower as Stage
  return 'discovered'
}

// Per-stage accent: top border + subtle tint — like HubSpot deal stages.
const stageAccent: Record<Stage, { border: string; tint: string; dot: string }> = {
  discovered:   { border: 'border-t-slate-400',  tint: 'bg-slate-50/60',  dot: 'bg-slate-400'  },
  contacted:    { border: 'border-t-blue-500',   tint: 'bg-blue-50/60',   dot: 'bg-blue-500'   },
  interviewing: { border: 'border-t-amber-500',  tint: 'bg-amber-50/60',  dot: 'bg-amber-500'  },
  offered:      { border: 'border-t-purple-500', tint: 'bg-purple-50/60', dot: 'bg-purple-500' },
  hired:        { border: 'border-t-green-600',  tint: 'bg-green-50/60',  dot: 'bg-green-600'  },
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
      const res = await fetch('/api/dashboard/recruiter/saved-candidates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: rowId, folder: newStage }),
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

    // Optimistic update
    setCandidates(prev => prev.map(c => (c.id === id ? { ...c, stage: toStage } : c)))
    persistStage(id, toStage)
  }

  const filteredCandidates = candidates.filter(c => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    const fullName = `${c.candidate.firstName} ${c.candidate.lastName}`.toLowerCase()
    return (
      fullName.includes(q) ||
      (c.candidate.university || '').toLowerCase().includes(q) ||
      (c.candidate.degree || '').toLowerCase().includes(q)
    )
  })

  const getCandidatesForStage = (stage: Stage) =>
    filteredCandidates.filter(c => c.stage === stage)

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {STAGES.map(stage => (
            <div key={stage} className="space-y-3">
              <Skeleton className="h-10 w-full" />
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
              {t('subtitle')} · <span className="font-medium">{totalInPipeline}</span> {t('inPipeline', { defaultValue: 'in pipeline' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
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

      {/* HubSpot-style kanban: horizontal scroll on small screens, 5 cols on xl */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {STAGES.map(stage => {
          const stageCandidates = getCandidatesForStage(stage)
          const accent = stageAccent[stage]
          const isDropTarget = dragOver === stage

          return (
            <div
              key={stage}
              onDragOver={e => handleDragOver(e, stage)}
              onDragLeave={handleDragLeave}
              onDrop={e => handleDrop(e, stage)}
              className={`rounded-lg border-t-4 ${accent.border} ${accent.tint} transition-colors ${
                isDropTarget ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
            >
              {/* Column header */}
              <div className="flex items-center justify-between px-3 py-2.5 border-b bg-white/60 backdrop-blur-sm rounded-t-lg">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${accent.dot}`} />
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-700">
                    {t(`stages.${stage}`)}
                  </h3>
                </div>
                <Badge variant="secondary" className="text-xs font-mono">
                  {stageCandidates.length}
                </Badge>
              </div>

              {/* Cards */}
              <div className="p-2 space-y-2 min-h-[260px]">
                {stageCandidates.length === 0 ? (
                  <div className="h-[220px] flex items-center justify-center">
                    <p className="text-xs text-muted-foreground text-center px-2">
                      {isDropTarget ? t('dropHere', { defaultValue: 'Drop here' }) : t('empty')}
                    </p>
                  </div>
                ) : (
                  stageCandidates.map(row => (
                    <Card
                      key={row.id}
                      draggable
                      onDragStart={e => handleDragStart(e, row.id)}
                      className="group cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow border bg-white"
                    >
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-start gap-2">
                          <GripVertical className="h-4 w-4 text-gray-300 shrink-0 mt-0.5 group-hover:text-gray-500 transition-colors" />
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className="text-xs bg-gray-100 text-gray-700">
                              {getInitials(row.candidate.firstName, row.candidate.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate text-gray-900">
                              {row.candidate.firstName} {row.candidate.lastName}
                            </p>
                            {row.candidate.university && (
                              <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                                <GraduationCap className="h-3 w-3 shrink-0" />
                                <span className="truncate">{row.candidate.university}</span>
                              </p>
                            )}
                            {row.candidate.degree && (
                              <p className="text-xs text-muted-foreground truncate mt-0.5">
                                {row.candidate.degree}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-1 pt-1 border-t">
                          <Link
                            href={`/dashboard/recruiter/candidates/${row.candidate.id}`}
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary px-2 py-1 rounded hover:bg-gray-50"
                            onMouseDown={e => e.stopPropagation()}
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>{t('view', { defaultValue: 'View' })}</span>
                          </Link>
                          <Link
                            href={`/dashboard/recruiter/messages?candidate=${row.candidate.id}`}
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary px-2 py-1 rounded hover:bg-gray-50"
                            onMouseDown={e => e.stopPropagation()}
                          >
                            <Mail className="h-3 w-3" />
                            <span>{t('contact', { defaultValue: 'Contact' })}</span>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
