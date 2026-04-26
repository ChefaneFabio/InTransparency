'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Sparkles, Zap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type State =
  | { plan: 'PREMIUM'; unlimited: true }
  | {
      plan: 'FREE'
      unlimited: false
      limit: number
      totalProjects: number
      projectsAtCap: number
      projectsNearCap: number
      featured: { projectId: string; title: string; analysisCount: number; atCap: boolean } | null
      upgradeUrl: string
    }

/**
 * AI analysis quota nudge for students.
 *
 * Visibility rules:
 *   - Premium: never shown (no cap to nudge against).
 *   - Free + featured project at-cap: rose, "you've used all 3 — upgrade".
 *   - Free + featured project near-cap (2/3): amber, "1 left on this project".
 *   - Free + no project hits 2+: silent — no banner blindness.
 *
 * Strings live in messages/{en,it}.json under dashboard.student.aiAnalysisBanner.
 */
export function AIAnalysisQuotaBanner() {
  const t = useTranslations('dashboard.student.aiAnalysisBanner')
  const [state, setState] = useState<State | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/dashboard/student/ai-usage')
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (!cancelled && d) setState(d)
      })
      .catch(() => {/* silent */})
    return () => {
      cancelled = true
    }
  }, [])

  if (!state || state.plan === 'PREMIUM' || !state.featured) return null
  const { featured, limit, projectsAtCap, upgradeUrl } = state

  const tone = featured.atCap ? 'rose' : 'amber'
  const palette = tone === 'rose'
    ? 'from-rose-50 via-white to-rose-50 dark:from-rose-950/30 dark:via-slate-950 dark:to-rose-950/30 border-rose-200 dark:border-rose-900'
    : 'from-amber-50 via-white to-amber-50 dark:from-amber-950/30 dark:via-slate-950 dark:to-amber-950/30 border-amber-200 dark:border-amber-900'
  const textTone = tone === 'rose' ? 'text-rose-700 dark:text-rose-300' : 'text-amber-700 dark:text-amber-300'
  const iconTone = tone === 'rose' ? 'text-rose-600' : 'text-amber-600'
  const buttonTone = tone === 'rose'
    ? 'bg-gradient-to-br from-rose-600 to-violet-600 hover:from-rose-500 hover:to-violet-500'
    : 'bg-gradient-to-br from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90'

  const headline = featured.atCap
    ? t('headlineAtCap', { project: featured.title })
    : t('headlineNearCap', { remaining: limit - featured.analysisCount, project: featured.title })
  const sub = featured.atCap
    ? projectsAtCap > 1
      ? t('subAtCapMulti', { count: projectsAtCap, limit })
      : t('subAtCapSingle')
    : t('subNearCap', { limit })

  const pct = Math.min(100, Math.round((featured.analysisCount / limit) * 100))

  return (
    <div className={`relative rounded-xl border bg-gradient-to-r p-4 sm:p-5 ${palette}`}>
      <div className="flex items-start gap-4 flex-col sm:flex-row sm:items-center">
        <div className={`shrink-0 rounded-full bg-white dark:bg-slate-900 p-2.5 ${iconTone}`}>
          {featured.atCap ? <Zap className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-semibold ${textTone}`}>{headline}</div>
          <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{sub}</div>
          <div className="mt-2 h-1.5 rounded-full bg-white/60 dark:bg-slate-900/60 overflow-hidden">
            <div
              className={tone === 'rose' ? 'h-full bg-rose-500' : 'h-full bg-amber-500'}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <Button size="sm" className={`shrink-0 text-white shadow-md ${buttonTone}`} asChild>
          <Link href={upgradeUrl}>
            {t('cta')}
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
