'use client'

import { useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { Sparkles, Info } from 'lucide-react'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import InstitutionAddonGrid from '@/components/pricing/InstitutionAddonGrid'

export default function InstitutionAddonsPage() {
  const locale = useLocale()

  return (
    <div className="space-y-6">
      <MetricHero gradient="institution">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/30 to-blue-500/20 border border-white/10"
          >
            <Sparkles className="h-8 w-8 text-violet-600 dark:text-violet-300" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add-on marketplace</h1>
            <p className="text-muted-foreground mt-1 max-w-2xl">
              Your core workspace is free — forever. Pick add-on modules à la carte when you need to scale,
              integrate, or customize. No bundles, no lock-in.
            </p>
          </div>
        </div>
      </MetricHero>

      {/* Sustainability note */}
      <div className="rounded-xl border bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 dark:border-slate-800 p-4 flex items-start gap-3">
        <Info className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
        <div className="text-sm">
          <p className="font-medium">
            Everything below is optional. The full M1–M4 workspace stays free.
          </p>
          <p className="text-muted-foreground text-xs mt-1">
            Add-ons are funded by institutions that want to scale beyond the core — not a tax on core usage.
            Every request lands on our team and we schedule a short call before any commitment.
          </p>
        </div>
      </div>

      <InstitutionAddonGrid authenticated locale={locale} cols={3} />
    </div>
  )
}
