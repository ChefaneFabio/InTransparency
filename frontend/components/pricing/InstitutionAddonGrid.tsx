'use client'

import { motion } from 'framer-motion'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Clock, Sparkles } from 'lucide-react'
import {
  INSTITUTION_ADDONS,
  formatAddonPrice,
  type InstitutionAddon,
} from '@/lib/config/institution-addons'

const TINT: Record<InstitutionAddon['tint'], { bg: string; border: string; icon: string; text: string }> = {
  violet: { bg: 'from-violet-50 to-violet-100/40 dark:from-violet-950/30 dark:to-violet-900/10', border: 'border-violet-200/70 dark:border-violet-900/50', icon: 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300', text: 'text-violet-700 dark:text-violet-300' },
  blue:   { bg: 'from-blue-50 to-blue-100/40 dark:from-blue-950/30 dark:to-blue-900/10',       border: 'border-blue-200/70 dark:border-blue-900/50',     icon: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300',       text: 'text-blue-700 dark:text-blue-300' },
  emerald:{ bg: 'from-emerald-50 to-emerald-100/40 dark:from-emerald-950/30 dark:to-emerald-900/10', border: 'border-emerald-200/70 dark:border-emerald-900/50', icon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300', text: 'text-emerald-700 dark:text-emerald-300' },
  amber:  { bg: 'from-amber-50 to-amber-100/40 dark:from-amber-950/30 dark:to-amber-900/10',   border: 'border-amber-200/70 dark:border-amber-900/50',   icon: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300',   text: 'text-amber-700 dark:text-amber-300' },
  rose:   { bg: 'from-rose-50 to-rose-100/40 dark:from-rose-950/30 dark:to-rose-900/10',       border: 'border-rose-200/70 dark:border-rose-900/50',     icon: 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300',       text: 'text-rose-700 dark:text-rose-300' },
  slate:  { bg: 'from-slate-50 to-slate-100/40 dark:from-slate-900 dark:to-slate-800/60',      border: 'border-slate-200/70 dark:border-slate-800',      icon: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',      text: 'text-slate-700 dark:text-slate-300' },
}

const STATUS_COPY: Record<InstitutionAddon['status'], { label: string; className: string }> = {
  available: { label: 'Available now', className: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' },
  beta:      { label: 'Beta — early access', className: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800' },
  roadmap:   { label: 'Coming soon', className: 'bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' },
}

interface Props {
  /** If true, uses the dashboard-style "Request add-on" CTA; otherwise public "Contact sales" CTA. */
  authenticated?: boolean
  locale?: string
  /** Optional filter by key. */
  only?: string[]
  /** Grid density — 2 cols on lg for pricing page, 3 cols for dashboard. */
  cols?: 2 | 3
}

export default function InstitutionAddonGrid({ authenticated, locale = 'en', only, cols = 2 }: Props) {
  const items = only ? INSTITUTION_ADDONS.filter(a => only.includes(a.key)) : INSTITUTION_ADDONS

  const contactHref = (a: InstitutionAddon) =>
    authenticated
      ? `/dashboard/university/billing?addon=${a.key}`
      : `/contact?subject=addon-${a.key}`

  return (
    <div className={`grid gap-4 ${cols === 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'}`}>
      {items.map((a, i) => {
        const tint = TINT[a.tint]
        const status = STATUS_COPY[a.status]
        const Icon = a.icon
        const isComingSoon = a.status === 'roadmap'
        return (
          <motion.div
            key={a.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            whileHover={!isComingSoon ? { y: -3 } : undefined}
            className={`relative rounded-2xl border ${tint.border} bg-gradient-to-br ${tint.bg} p-5 flex flex-col h-full shadow-sm transition-shadow ${
              isComingSoon ? 'opacity-75' : 'hover:shadow-md'
            }`}
          >
            {isComingSoon && (
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-300/40 dark:ring-slate-700/40" aria-hidden />
            )}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className={`w-11 h-11 rounded-xl ${tint.icon} flex items-center justify-center shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
              <Badge variant="outline" className={`text-[10px] ${status.className}`}>
                {isComingSoon && <Clock className="h-2.5 w-2.5 mr-1" />}
                {status.label}
              </Badge>
            </div>

            <h3 className="font-semibold text-base leading-tight">{a.title}</h3>
            <p className={`text-xs font-medium mt-1 ${tint.text}`}>{a.oneLine}</p>

            <p className="text-sm text-muted-foreground mt-3 flex-1 leading-relaxed">{a.description}</p>

            {/* Target audience chip */}
            <div className="mt-3 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-muted-foreground/60" />
              <span className="text-[11px] text-muted-foreground">{a.target}</span>
            </div>

            {/* Price + CTA */}
            <div className="mt-4 pt-4 border-t flex items-end justify-between gap-3">
              <div>
                <div className={`text-lg font-bold tracking-tight ${isComingSoon ? 'text-muted-foreground' : tint.text}`}>
                  {isComingSoon ? `Indicative · ${formatAddonPrice(a.pricing, locale)}` : formatAddonPrice(a.pricing, locale)}
                </div>
                {'note' in a.pricing && a.pricing.note && !isComingSoon && (
                  <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight max-w-[180px]">
                    {a.pricing.note}
                  </div>
                )}
                {isComingSoon && (
                  <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight max-w-[180px]">
                    Pricing finalized at GA · join the waitlist for early-bird discount
                  </div>
                )}
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href={contactHref(a) as any}>
                  {isComingSoon ? 'Join waitlist' : authenticated ? 'Request' : 'Talk to us'}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
