'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from '@/navigation'
import { Sparkles, ArrowRight } from 'lucide-react'
import type { PremiumEntitlement } from '@/lib/entitlements'

/**
 * Shows only when the student's Premium is sponsored by their institution.
 * Renders nothing for personal Premium or no entitlement — SponsoredPremium
 * is the interesting story worth surfacing.
 */
export default function SponsoredPremiumBanner() {
  const [data, setData] = useState<PremiumEntitlement | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/student/entitlement')
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (!cancelled && d) setData(d)
      })
      .finally(() => {
        if (!cancelled) setLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (!loaded || !data || data.source !== 'institution' || !data.sponsoringInstitution) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl border border-amber-200/60 dark:border-amber-900/40 p-4 sm:p-5 flex items-center gap-4 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-amber-950/20 dark:via-slate-950 dark:to-orange-950/20"
    >
      <div
        aria-hidden
        className="absolute -top-16 -right-8 w-40 h-40 rounded-full bg-gradient-to-br from-amber-400/20 to-transparent blur-3xl"
      />
      <div className="relative shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-[0_6px_20px_-6px_rgba(245,158,11,0.6)]">
        <Sparkles className="h-5 w-5 text-white" />
      </div>
      <div className="relative min-w-0 flex-1">
        <h3 className="font-semibold text-sm">
          Premium is free for you
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
          <span className="font-medium text-foreground">{data.sponsoringInstitution.name}</span>{' '}
          sponsors Premium for every active student. All advanced tools
          unlocked — skill path, analytics, unlimited AI, custom portfolio URL.
        </p>
      </div>
      <Link
        href={'/dashboard/student/profile?tab=fit' as any}
        className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
      >
        Explore Premium
        <ArrowRight className="h-3 w-3" />
      </Link>
    </motion.div>
  )
}
