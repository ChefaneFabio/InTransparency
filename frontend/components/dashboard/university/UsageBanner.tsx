'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Sparkles, Zap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Usage = {
  plan: 'CORE' | 'PREMIUM'
  aiAssistant: { used: number; limit: number; remaining: number; resetsOn: string }
}

/**
 * Quota nudge surfaced on the institution dashboard.
 *
 * Visibility rules:
 *   - PREMIUM plan: never shown (no limit to nudge against).
 *   - CORE plan: shown only when AI Assistant usage hits 70% of monthly cap.
 *
 * Strings live in messages/{en,it}.json under dashboard.university.usageBanner.
 */
export function UsageBanner() {
  const t = useTranslations('dashboard.university.usageBanner')
  const [usage, setUsage] = useState<Usage | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/dashboard/university/usage')
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (!cancelled && d) setUsage(d)
      })
      .catch(() => {/* silent */})
    return () => {
      cancelled = true
    }
  }, [])

  if (!usage || usage.plan === 'PREMIUM') return null

  const { used, limit, resetsOn } = usage.aiAssistant
  if (limit < 0 || used / limit < 0.7) return null

  const pct = Math.min(100, Math.round((used / limit) * 100))
  const exhausted = used >= limit
  const tone = exhausted || pct >= 90 ? 'rose' : 'amber'

  const palette = tone === 'rose'
    ? 'from-rose-50 via-white to-rose-50 dark:from-rose-950/30 dark:via-slate-950 dark:to-rose-950/30 border-rose-200 dark:border-rose-900'
    : 'from-amber-50 via-white to-amber-50 dark:from-amber-950/30 dark:via-slate-950 dark:to-amber-950/30 border-amber-200 dark:border-amber-900'
  const textTone = tone === 'rose' ? 'text-rose-700 dark:text-rose-300' : 'text-amber-700 dark:text-amber-300'
  const iconTone = tone === 'rose' ? 'text-rose-600' : 'text-amber-600'
  const buttonTone = tone === 'rose'
    ? 'bg-gradient-to-br from-rose-600 to-violet-600 hover:from-rose-500 hover:to-violet-500'
    : 'bg-gradient-to-br from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500'

  const resetsDate = new Date(resetsOn).toLocaleDateString(undefined, { day: 'numeric', month: 'long' })
  const headline = exhausted ? t('headlineAtCap') : t('headlineNearCap', { used, limit })
  const sub = exhausted
    ? t('subAtCap', { date: resetsDate })
    : t('subNearCap', { percent: pct, date: resetsDate })

  return (
    <div className={`relative rounded-xl border bg-gradient-to-r p-4 sm:p-5 ${palette}`}>
      <div className="flex items-start gap-4 flex-col sm:flex-row sm:items-center">
        <div className={`shrink-0 rounded-full bg-white dark:bg-slate-900 p-2.5 ${iconTone}`}>
          {exhausted ? <Zap className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
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
          <Link href="/api/checkout/institutional-premium?plan=monthly">
            {t('cta')}
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
