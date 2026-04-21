'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Eye, Send, Sparkles, ChevronRight } from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from '@/navigation'

interface VisibilityData {
  watchingCount: number
  activeOutreachCount: number
  recentMatchCount: number
}

export function VisibilityWidget() {
  const t = useTranslations('studentVisibility')
  const [data, setData] = useState<VisibilityData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/student/visibility')
      .then(r => (r.ok ? r.json() : null))
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <Skeleton className="h-32 w-full rounded-2xl" />
  }

  if (!data) return null

  const total = data.watchingCount + data.activeOutreachCount + data.recentMatchCount
  if (total === 0) {
    return (
      <GlassCard delay={0.25} gradient="purple">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <h3 className="font-semibold text-foreground">{t('title')}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{t('empty')}</p>
        </div>
      </GlassCard>
    )
  }

  const metrics = [
    {
      icon: Eye,
      label: t('watching'),
      value: data.watchingCount,
      tone: 'text-blue-600 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-400',
    },
    {
      icon: Send,
      label: t('activeOutreach'),
      value: data.activeOutreachCount,
      tone: 'text-rose-600 bg-rose-100 dark:bg-rose-900/40 dark:text-rose-400',
    },
    {
      icon: Sparkles,
      label: t('recentMatches'),
      value: data.recentMatchCount,
      tone: 'text-purple-600 bg-purple-100 dark:bg-purple-900/40 dark:text-purple-400',
    },
  ]

  return (
    <GlassCard delay={0.25} gradient="purple">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <h3 className="font-semibold text-foreground">{t('title')}</h3>
            </div>
            <p className="text-xs text-muted-foreground">{t('subtitle')}</p>
          </div>
          <Link
            href="/dashboard/student/matches"
            className="text-xs text-primary hover:underline font-medium flex items-center gap-0.5"
          >
            {t('viewDetails')} <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="flex flex-col items-start gap-1.5 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40"
            >
              <div className={`p-1.5 rounded-lg ${m.tone}`}>
                <m.icon className="h-4 w-4" />
              </div>
              <AnimatedCounter value={m.value} className="text-2xl font-bold text-foreground" />
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground leading-tight">
                {m.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1">
          <span className="inline-block h-1 w-1 rounded-full bg-purple-500" />
          {t('rightsNote')}
        </p>
      </div>
    </GlassCard>
  )
}
