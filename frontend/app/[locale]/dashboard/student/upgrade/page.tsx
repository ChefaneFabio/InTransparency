'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Sparkles,
  ArrowRight,
  Check,
  Network,
  TrendingUp,
  Zap,
  Globe,
  Mic,
  BadgeCheck,
  UserCheck,
  Users,
  AlertTriangle,
} from 'lucide-react'
import type { PremiumEntitlement } from '@/lib/entitlements'

/**
 * Student Premium upgrade page.
 * - If the student is already Premium (personal or sponsored), confirms it.
 * - If sponsored by their institution, credits the sponsor.
 * - Otherwise, shows the €7.99/mo offer with the full feature list.
 */

const PREMIUM_FEATURES = [
  { icon: Network,    title: 'Deep Skill Path',            desc: 'Unlimited skill gaps, full 12-month roadmap, weekly challenges, refresh anytime.' },
  { icon: TrendingUp, title: 'Advanced analytics',         desc: 'Engagement, application funnel, recruiter interest, market benchmark, salary context — 8 dashboards.' },
  { icon: Zap,        title: 'Unlimited AI analyses',      desc: 'Analyze every project with Claude, no cap. Richer skill extraction, evidence packet generation.' },
  { icon: Globe,      title: 'Custom portfolio URL',       desc: 'yourname.intransparency.com — clean link for applications and LinkedIn.' },
  { icon: UserCheck,  title: 'Priority recruiter visibility', desc: "Surface higher in recruiter search when your fit profile matches their role." },
  { icon: Mic,        title: 'AI Interview Coach',         desc: 'Practice-session generator with role-specific questions and feedback.' },
  { icon: BadgeCheck, title: 'Europass signed credentials',desc: 'EDCI-compliant wallet-verifiable diploma and transcript export.' },
  { icon: Users,      title: 'Peer benchmarking',          desc: 'Compare yourself privately to others in your program and graduation year.' },
]

export default function StudentUpgradePage() {
  const [entitlement, setEntitlement] = useState<PremiumEntitlement | null>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const successFlag = searchParams?.get('success') === '1'
  const canceledFlag = searchParams?.get('canceled') === '1'
  const errorFlag = searchParams?.get('error')

  useEffect(() => {
    let cancelled = false
    fetch('/api/student/entitlement')
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (!cancelled && d) setEntitlement(d)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  // Already Premium via institution — celebrate, don't sell
  if (entitlement?.source === 'institution' && entitlement.sponsoringInstitution) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-amber-200/60 dark:border-amber-900/40 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-amber-950/20 dark:via-slate-950 dark:to-orange-950/20 p-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/40 mb-4">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold">You already have Premium</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            <span className="font-semibold text-foreground">{entitlement.sponsoringInstitution.name}</span>{' '}
            sponsors Premium for every active student. All tools below are already unlocked for you.
          </p>
          <Link href="/dashboard/student/profile?tab=fit" className="inline-block mt-4">
            <Button>
              Explore Premium features
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </Link>
        </motion.div>
        <FeatureList />
      </div>
    )
  }

  // Already Premium personally
  if (entitlement?.source === 'personal') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-950 p-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30 mb-4">
            <Check className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Premium active</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Thanks for supporting the work. Manage your subscription from your account settings.
          </p>
          <Link href="/dashboard/student/settings" className="inline-block mt-4">
            <Button variant="outline">
              Manage subscription
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </Link>
        </motion.div>
        <FeatureList />
      </div>
    )
  }

  // Upgrade offer
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Stripe return flow feedback */}
      {successFlag && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-900 p-4 flex items-start gap-3"
        >
          <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-emerald-800 dark:text-emerald-200">Subscription active</p>
            <p className="text-emerald-700/80 dark:text-emerald-300/80 text-xs mt-0.5">
              Premium features will unlock within a minute once the webhook confirms. Refresh any page.
            </p>
          </div>
        </motion.div>
      )}
      {canceledFlag && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900 p-4 flex items-start gap-3"
        >
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-800 dark:text-amber-200">Checkout canceled</p>
            <p className="text-amber-700/80 dark:text-amber-300/80 text-xs mt-0.5">
              No charge was made. You can restart the flow anytime from the buttons below.
            </p>
          </div>
        </motion.div>
      )}
      {errorFlag === 'stripe_not_configured' && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900 p-4 flex items-start gap-3"
        >
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-800 dark:text-amber-200">Checkout temporarily unavailable</p>
            <p className="text-amber-700/80 dark:text-amber-300/80 text-xs mt-0.5">
              Our team is finalizing payment setup. Premium features are coming very soon — thanks for your patience.
            </p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 via-violet-50/40 to-purple-50/40 dark:from-primary/10 dark:via-violet-950/20 dark:to-purple-950/20 p-8"
      >
        <div
          aria-hidden
          className="absolute -top-24 -right-12 w-64 h-64 rounded-full bg-gradient-to-br from-violet-400/25 to-transparent blur-3xl"
        />
        <div className="relative flex items-start justify-between gap-6 flex-wrap">
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white text-[10px] font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="h-3 w-3" />
              Premium
            </div>
            <h1 className="text-3xl font-bold">Accelerate your career</h1>
            <p className="text-muted-foreground mt-2 max-w-xl">
              One subscription, every growth tool unlocked. Deep skill path, advanced analytics,
              unlimited AI, priority visibility, interview coach, signed credentials.
            </p>
          </div>
          <div className="shrink-0 text-right">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight">€3.99</span>
              <span className="text-sm text-muted-foreground">/mo</span>
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mt-1">
              First month free · cancel anytime
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              or €29/yr · save 39%
            </p>
          </div>
        </div>
        <div className="relative mt-6 flex flex-col sm:flex-row gap-3">
          <a href="/api/checkout/student-premium?plan=monthly" className="flex-1">
            <Button className="w-full bg-gradient-to-br from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg shadow-primary/25" size="lg">
              Start free 30-day trial
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </a>
          <a href="/api/checkout/student-premium?plan=annual" className="flex-1">
            <Button variant="outline" className="w-full" size="lg">
              Pay annually · €29/yr
            </Button>
          </a>
        </div>
        <p className="relative text-xs text-muted-foreground mt-3 text-center">
          Wait — is your university a partner? If so, Premium is free for you. Ask your career office.
        </p>
      </motion.div>

      <FeatureList />
    </div>
  )
}

function FeatureList() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">What Premium unlocks</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {PREMIUM_FEATURES.map((f, i) => {
          const Icon = f.icon
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="h-full">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 text-primary flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm">{f.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
