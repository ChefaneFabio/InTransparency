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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add-on marketplace</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Your core workspace is free — forever. Pick add-on modules à la carte when you need to scale,
            integrate, or customize. No bundles, no lock-in.
          </p>
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
