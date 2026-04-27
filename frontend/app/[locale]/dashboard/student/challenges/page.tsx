'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { ChallengeCard } from '@/components/challenges/ChallengeCard'
import { Search, Trophy, FileText, CheckCircle, Filter } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { StatCard } from '@/components/dashboard/shared/StatCard'
import { StaggerContainer, StaggerItem } from '@/components/ui/animated-card'

interface Challenge {
  id: string; title: string; description: string; companyName: string
  companyLogo?: string; companyIndustry?: string; discipline: string
  challengeType: string; requiredSkills: string[]; teamSizeMin: number; teamSizeMax: number
  estimatedDuration?: string; applicationDeadline?: string; mentorshipOffered: boolean
  compensation?: string; status: string; slug: string; maxSubmissions: number
  hasApplied?: boolean; mySubmission?: { id: string; status: string } | null
  spotsRemaining?: number; _count?: { submissions: number }
}

export default function StudentChallengesPage() {
  const t = useTranslations('studentChallenges')
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [disciplineFilter, setDisciplineFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    fetch('/api/student/challenges')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setChallenges(data.challenges || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = challenges.filter(c => {
    const matchesSearch = !searchTerm || c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDiscipline = disciplineFilter === 'all' || c.discipline === disciplineFilter
    const matchesType = typeFilter === 'all' || c.challengeType === typeFilter
    return matchesSearch && matchesDiscipline && matchesType
  })

  const applied = challenges.filter(c => c.hasApplied)
  const completed = applied.filter(c => c.mySubmission?.status === 'APPROVED').length
  const available = filtered.filter(c => !c.hasApplied)

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <Skeleton className="h-32 rounded-2xl" />
        <div className="grid grid-cols-3 gap-4">{Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
      <MetricHero gradient="student">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('subtitle')}</p>
      </MetricHero>

      <StaggerContainer className="grid grid-cols-3 gap-4">
        <StaggerItem><StatCard label={t('stats.available')} value={challenges.length} icon={<Trophy className="h-5 w-5" />} variant="slate" /></StaggerItem>
        <StaggerItem><StatCard label={t('stats.applied')} value={applied.length} icon={<FileText className="h-5 w-5" />} variant="slate" /></StaggerItem>
        <StaggerItem><StatCard label={t('stats.completed')} value={completed} icon={<CheckCircle className="h-5 w-5" />} variant="slate" /></StaggerItem>
      </StaggerContainer>

      {/* Filters */}
      <GlassCard delay={0.1}>
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={t('searchPlaceholder')} className="pl-9" />
            </div>
            <Select value={disciplineFilter} onValueChange={setDisciplineFilter}>
              <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder={t('filters.discipline')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.all')}</SelectItem>
                <SelectItem value="TECHNOLOGY">Technology</SelectItem>
                <SelectItem value="BUSINESS">Business</SelectItem>
                <SelectItem value="ENGINEERING">Engineering</SelectItem>
                <SelectItem value="DESIGN">Design</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder={t('filters.type')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.all')}</SelectItem>
                <SelectItem value="CAPSTONE">Capstone</SelectItem>
                <SelectItem value="INTERNSHIP">{t('filters.internship')}</SelectItem>
                <SelectItem value="HACKATHON">Hackathon</SelectItem>
                <SelectItem value="THESIS">{t('filters.thesis')}</SelectItem>
                <SelectItem value="RESEARCH">{t('filters.research')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </GlassCard>

      {/* My Applications */}
      {applied.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{t('myApplications')}</h2>
          {applied.map(c => <ChallengeCard key={c.id} challenge={c} variant="student" />)}
        </div>
      )}

      {/* Available */}
      <div className="space-y-3">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          {applied.length > 0 ? t('moreChallenges') : t('availableChallenges')}
        </h2>
        {available.length > 0 ? (
          available.map(c => <ChallengeCard key={c.id} challenge={c} variant="student" />)
        ) : (
          <GlassCard delay={0.2}>
            <div className="p-10 text-center">
              <Trophy className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-medium">
                {searchTerm || disciplineFilter !== 'all' || typeFilter !== 'all' ? t('empty.filtered') : t('empty.none')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {searchTerm || disciplineFilter !== 'all' || typeFilter !== 'all' ? t('empty.adjustFilters') : t('empty.checkBack')}
              </p>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  )
}
