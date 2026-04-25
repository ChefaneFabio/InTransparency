'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Search, Plus, X, GraduationCap, Briefcase, FolderOpen,
  Star, CheckCircle, MapPin, ThumbsUp, Users, ArrowRight
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { Link } from '@/navigation'

interface Candidate {
  id: string
  firstName: string
  lastName: string
  photo: string | null
  university: string
  degree: string
  graduationYear: string
  gpa: string | null
  skills: string[]
  bio: string | null
  location: string | null
  projectCount: number
  verifiedProjectCount: number
  topProjects: Array<{ title: string; grade: string | null; verified: boolean; score: number | null }>
  internships: Array<{ company: string; role: string; rating: number | null; wouldHire: boolean | null }>
  pipelineStage: string | null
  rating: number | null
  notes: string | null
}

export default function CompareCandidatesPage() {
  const t = useTranslations('compareCandidate')
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [searchResults, setSearchResults] = useState<Array<{ id: string; name: string; university: string; degree: string; photo: string | null }>>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  const searchCandidates = async (query: string) => {
    if (query.length < 2) { setSearchResults([]); return }
    setSearching(true)
    try {
      const res = await fetch(`/api/dashboard/recruiter/search/students?search=${encodeURIComponent(query)}&limit=8`)
      if (res.ok) {
        const data = await res.json()
        setSearchResults((data.students || []).map((s: any) => ({
          id: s.id, name: `${s.firstName || ''} ${s.lastName || ''}`.trim(),
          university: s.university || '', degree: s.degree || '', photo: s.photo,
        })).filter((s: any) => !candidates.some(c => c.id === s.id)))
      }
    } catch {}
    finally { setSearching(false) }
  }

  const addCandidate = async (id: string) => {
    if (candidates.length >= 4 || candidates.some(c => c.id === id)) return
    setLoading(id)
    setSearchQuery('')
    setSearchResults([])
    try {
      // Fetch full candidate data using talent-match with broad criteria
      const res = await fetch(`/api/dashboard/recruiter/candidates/${id}`)
      if (res.ok) {
        const data = await res.json()
        const s = data.student || data
        const saved = data.savedCandidate

        // Also fetch projects and stages
        const [projRes, stageRes] = await Promise.all([
          fetch(`/api/projects?userId=${id}&limit=5`),
          fetch(`/api/dashboard/recruiter/candidates/${id}/notes`),
        ])
        const projData = projRes.ok ? await projRes.json() : { projects: [] }
        const noteData = stageRes.ok ? await stageRes.json() : {}

        setCandidates(prev => [...prev, {
          id: s.id,
          firstName: s.firstName || '',
          lastName: s.lastName || '',
          photo: s.photo || null,
          university: s.university || '',
          degree: s.degree || '',
          graduationYear: s.graduationYear || '',
          gpa: s.gpa || null,
          skills: s.skills || [],
          bio: s.bio?.substring(0, 150) || null,
          location: s.location || null,
          projectCount: s._count?.projects || projData.projects?.length || 0,
          verifiedProjectCount: (projData.projects || []).filter((p: any) => p.verificationStatus === 'VERIFIED').length,
          topProjects: (projData.projects || []).slice(0, 3).map((p: any) => ({
            title: p.title, grade: p.grade, verified: p.verificationStatus === 'VERIFIED', score: p.innovationScore,
          })),
          internships: (s.stageExperiences || []).map((st: any) => ({
            company: st.companyName, role: st.role, rating: st.supervisorRating, wouldHire: st.supervisorWouldHire,
          })),
          pipelineStage: noteData.folder || saved?.folder || null,
          rating: noteData.rating || saved?.rating || null,
          notes: noteData.notes || saved?.notes || null,
        }])
      }
    } catch {}
    finally { setLoading(null) }
  }

  const removeCandidate = (id: string) => {
    setCandidates(prev => prev.filter(c => c.id !== id))
  }

  // Find common and unique skills
  const allSkills = candidates.length >= 2
    ? Array.from(new Set(candidates.flatMap(c => c.skills)))
    : []
  const commonSkills = allSkills.filter(skill =>
    candidates.every(c => c.skills.some(s => s.toLowerCase() === skill.toLowerCase()))
  )

  return (
    <div className="min-h-screen space-y-6">
      <MetricHero gradient="companyDark">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{t('title')}</h1>
          <p className="text-white/60 mt-1">{t('subtitle')}</p>
        </div>
      </MetricHero>

      {/* Add candidates */}
      <GlassCard delay={0.1}>
        <div className="p-5">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); searchCandidates(e.target.value) }}
                className="pl-9"
                disabled={candidates.length >= 4}
              />
            </div>
            <Badge variant="outline">{candidates.length}/4 {t('selected')}</Badge>
          </div>

          {/* Search results dropdown */}
          {searchResults.length > 0 && (
            <div className="mt-2 border rounded-xl overflow-hidden">
              {searchResults.map(s => (
                <button
                  key={s.id}
                  onClick={() => addCandidate(s.id)}
                  className="flex items-center gap-3 w-full p-3 text-left hover:bg-muted/50 transition-colors border-b last:border-0"
                >
                  <Plus className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="font-medium text-sm">{s.name}</span>
                  <span className="text-xs text-muted-foreground">{s.university}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{s.degree}</span>
                </button>
              ))}
            </div>
          )}

          {loading && <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground"><Skeleton className="h-4 w-4 rounded" />{t('loading')}</div>}
        </div>
      </GlassCard>

      {/* Comparison table */}
      {candidates.length >= 2 && (
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            {/* Header row — candidate cards */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${candidates.length}, 1fr)` }}>
              <div /> {/* Empty corner */}
              {candidates.map(c => (
                <GlassCard key={c.id} delay={0.1}>
                  <div className="p-4 text-center relative">
                    <button onClick={() => removeCandidate(c.id)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive">
                      <X className="h-4 w-4" />
                    </button>
                    <Avatar className="h-14 w-14 mx-auto mb-2">
                      <AvatarImage src={c.photo || ''} />
                      <AvatarFallback>{c.firstName[0]}{c.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-sm">{c.firstName} {c.lastName}</h3>
                    <p className="text-xs text-muted-foreground">{c.university}</p>
                    <p className="text-xs text-muted-foreground">{c.degree}</p>
                    {c.pipelineStage && <Badge variant="outline" className="text-[10px] mt-2">{c.pipelineStage}</Badge>}
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Comparison rows */}
            {[
              { label: t('rows.graduation'), render: (c: Candidate) => c.graduationYear || '—' },
              { label: t('rows.gpa'), render: (c: Candidate) => c.gpa || '—' },
              { label: t('rows.location'), render: (c: Candidate) => c.location || '—' },
              { label: t('rows.projects'), render: (c: Candidate) => `${c.verifiedProjectCount} verified / ${c.projectCount} total` },
              { label: t('rows.internships'), render: (c: Candidate) => c.internships.length > 0 ? c.internships.map(i => `${i.role} @ ${i.company}`).join(', ') : '—' },
              { label: t('rows.supervisorRating'), render: (c: Candidate) => {
                const rated = c.internships.filter(i => i.rating)
                if (rated.length === 0) return '—'
                const avg = rated.reduce((sum, i) => sum + i.rating!, 0) / rated.length
                return `${avg.toFixed(1)}/5${rated.some(i => i.wouldHire) ? ' + would hire' : ''}`
              }},
              { label: t('rows.rating'), render: (c: Candidate) => c.rating ? `${c.rating}/5` : '—' },
            ].map((row, ri) => (
              <div key={row.label} className="grid gap-4 mt-2" style={{ gridTemplateColumns: `200px repeat(${candidates.length}, 1fr)` }}>
                <div className="flex items-center text-sm font-medium text-muted-foreground p-3">{row.label}</div>
                {candidates.map(c => (
                  <div key={c.id} className="p-3 rounded-lg bg-muted/30 text-sm">{row.render(c)}</div>
                ))}
              </div>
            ))}

            {/* Skills comparison */}
            <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: `200px repeat(${candidates.length}, 1fr)` }}>
              <div className="flex items-start text-sm font-medium text-muted-foreground p-3">{t('rows.skills')}</div>
              {candidates.map(c => (
                <div key={c.id} className="p-3">
                  <div className="flex gap-1 flex-wrap">
                    {c.skills.slice(0, 10).map(s => (
                      <Badge
                        key={s}
                        className={`text-[10px] ${commonSkills.some(cs => cs.toLowerCase() === s.toLowerCase()) ? 'bg-emerald-100 text-emerald-700 border-0' : ''}`}
                        variant={commonSkills.some(cs => cs.toLowerCase() === s.toLowerCase()) ? 'default' : 'outline'}
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Common skills highlight */}
            {commonSkills.length > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-2">{t('commonSkills', { count: commonSkills.length })}</p>
                <div className="flex gap-1.5 flex-wrap">
                  {commonSkills.map(s => <Badge key={s} className="bg-emerald-100 text-emerald-700 border-0 text-xs">{s}</Badge>)}
                </div>
              </div>
            )}

            {/* Top projects */}
            <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: `200px repeat(${candidates.length}, 1fr)` }}>
              <div className="flex items-start text-sm font-medium text-muted-foreground p-3">{t('rows.topProjects')}</div>
              {candidates.map(c => (
                <div key={c.id} className="p-3 space-y-2">
                  {c.topProjects.map((p, pi) => (
                    <div key={pi} className="flex items-start gap-2 text-sm">
                      {p.verified ? <CheckCircle className="h-3.5 w-3.5 text-emerald-600 mt-0.5 flex-shrink-0" /> : <FolderOpen className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />}
                      <div>
                        <p className="font-medium text-xs">{p.title}</p>
                        {p.grade && <span className="text-[10px] text-muted-foreground">{p.grade}</span>}
                      </div>
                    </div>
                  ))}
                  {c.topProjects.length === 0 && <p className="text-xs text-muted-foreground">—</p>}
                </div>
              ))}
            </div>

            {/* Recruiter notes */}
            <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: `200px repeat(${candidates.length}, 1fr)` }}>
              <div className="flex items-start text-sm font-medium text-muted-foreground p-3">{t('rows.notes')}</div>
              {candidates.map(c => (
                <div key={c.id} className="p-3 text-sm text-muted-foreground italic">
                  {c.notes || '—'}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Single candidate — prompt to add more */}
      {candidates.length === 1 && (
        <GlassCard delay={0.15}>
          <div className="p-8 text-center">
            <Users className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
            <p className="font-medium">{t('addMore')}</p>
            <p className="text-sm text-muted-foreground mt-1">{t('addMoreHint')}</p>
          </div>
        </GlassCard>
      )}

      {/* Empty state */}
      {candidates.length === 0 && (
        <GlassCard delay={0.15}>
          <div className="p-16 text-center">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/10 to-purple-100 dark:from-primary/20 dark:to-purple-900/30 flex items-center justify-center mb-6 border"
            >
              <Users className="h-10 w-10 text-primary" />
            </motion.div>
            <h3 className="text-xl font-bold">{t('emptyTitle')}</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto">{t('emptyDesc')}</p>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
