'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Link } from '@/navigation'
import { Search, Plus, Loader2 } from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'

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

const stageBadgeVariants: Record<Stage, string> = {
  discovered: 'bg-slate-100 text-slate-700',
  contacted: 'bg-blue-100 text-blue-700',
  interviewing: 'bg-amber-100 text-amber-700',
  offered: 'bg-purple-100 text-purple-700',
  hired: 'bg-green-100 text-green-700',
}

export default function RecruiterPipelinePage() {
  const t = useTranslations('recruiterPipeline')
  const [candidates, setCandidates] = useState<PipelineCandidate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [movingIds, setMovingIds] = useState<Set<string>>(new Set())

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
          stage: (folderToStage(sc.folder)),
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

  const folderToStage = (folder: string): Stage => {
    const lower = folder.toLowerCase()
    if (STAGES.indexOf(lower as Stage) !== -1) return lower as Stage
    return 'discovered'
  }

  const moveCandidate = (candidateId: string, newStage: Stage) => {
    setMovingIds(prev => {
      const next = new Set(Array.from(prev))
      next.add(candidateId)
      return next
    })

    setCandidates(prev =>
      prev.map(c =>
        c.id === candidateId ? { ...c, stage: newStage } : c
      )
    )

    // Persist stage change via folder update
    fetch('/api/dashboard/recruiter/saved-candidates', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: candidateId, folder: newStage }),
    })
      .catch(() => {
        // Revert on failure
        fetchCandidates()
      })
      .finally(() => {
        setMovingIds(prev => {
          const next = new Set(Array.from(prev))
          next.delete(candidateId)
          return next
        })
      })
  }

  const filteredCandidates = candidates.filter(c => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    const fullName = `${c.candidate.firstName} ${c.candidate.lastName}`.toLowerCase()
    return (
      fullName.includes(q) ||
      c.candidate.university.toLowerCase().includes(q) ||
      c.candidate.degree.toLowerCase().includes(q)
    )
  })

  const getCandidatesForStage = (stage: Stage) =>
    filteredCandidates.filter(c => c.stage === stage)

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {STAGES.map(stage => (
            <div key={stage} className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
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
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive font-medium">{t('error')}</p>
            <Button variant="outline" className="mt-4" onClick={fetchCandidates}>
              {t('loading')}
            </Button>
          </CardContent>
        </Card>
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
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg font-medium mb-2">{t('emptyPipeline')}</p>
            <p className="text-muted-foreground mb-6">{t('emptyPipelineDesc')}</p>
            <Link href="/dashboard/recruiter/candidates">
              <Button>
                <Search className="mr-2 h-4 w-4" />
                {t('startSearching')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STAGES.map(stage => {
          const stageCandidates = getCandidatesForStage(stage)
          return (
            <div key={stage} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  {t(`stages.${stage}`)}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {stageCandidates.length}
                </Badge>
              </div>

              <div className="space-y-3 min-h-[200px] rounded-lg border border-dashed border-muted-foreground/25 p-2">
                {stageCandidates.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8">
                    {t('empty')}
                  </p>
                ) : (
                  stageCandidates.map(candidate => {
                    const isMoving = movingIds.has(candidate.id)
                    const otherStages = STAGES.filter(s => s !== stage)

                    return (
                      <Card key={candidate.id} className="relative">
                        <CardContent className="p-3 space-y-3">
                          <div className="flex items-start gap-2">
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarFallback className="text-xs">
                                {getInitials(
                                  candidate.candidate.firstName,
                                  candidate.candidate.lastName
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">
                                {candidate.candidate.firstName} {candidate.candidate.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {candidate.candidate.university}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {candidate.candidate.degree}
                              </p>
                            </div>
                          </div>

                          <Badge
                            variant="secondary"
                            className={`text-xs ${stageBadgeVariants[stage]}`}
                          >
                            {t(`stages.${stage}`)}
                          </Badge>

                          <Select
                            value=""
                            onValueChange={(value: string) =>
                              moveCandidate(candidate.id, value as Stage)
                            }
                            disabled={isMoving}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue
                                placeholder={
                                  isMoving ? (
                                    <span className="flex items-center gap-1">
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    </span>
                                  ) : (
                                    `${t('moveTo')}...`
                                  )
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {otherStages.map(s => (
                                <SelectItem key={s} value={s}>
                                  {t(`stages.${s}`)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
