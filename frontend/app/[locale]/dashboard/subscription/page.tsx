'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowRight, CreditCard, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react'

type State = {
  kind: 'user' | 'institution'
  name?: string
  role?: string
  tier: string
  tierLabel: string
  status: 'INACTIVE' | 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED'
  renewsOrEndsOn: string | null
  hasStripeCustomer: boolean
  hasActiveSubscription: boolean
  upgradeUrl: string
  portalUrl: string
}

const STATUS_LABEL: Record<State['status'], { label: string; tone: 'emerald' | 'blue' | 'amber' | 'rose' | 'slate' }> = {
  ACTIVE:   { label: 'Active',           tone: 'emerald' },
  TRIALING: { label: 'Trialing',         tone: 'blue' },
  PAST_DUE: { label: 'Payment failed',   tone: 'rose' },
  CANCELED: { label: 'Canceled',         tone: 'slate' },
  EXPIRED:  { label: 'Expired',          tone: 'slate' },
  INACTIVE: { label: 'No subscription',  tone: 'slate' },
}

const TONE: Record<'emerald' | 'blue' | 'amber' | 'rose' | 'slate', string> = {
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
  blue:    'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300',
  amber:   'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300',
  rose:    'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300',
  slate:   'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300',
}

export default function SubscriptionPage() {
  const [state, setState] = useState<State | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/billing/state')
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        setState(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!state) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Couldn't load billing information. Try refreshing.
          </CardContent>
        </Card>
      </div>
    )
  }

  const renews = state.renewsOrEndsOn
    ? new Date(state.renewsOrEndsOn).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
    : null
  const status = STATUS_LABEL[state.status]
  const isPaid = state.tier !== 'FREE' && state.tier !== 'RECRUITER_FREE' && state.tier !== 'CORE'
  const isPastDue = state.status === 'PAST_DUE'
  const isTrialing = state.status === 'TRIALING'

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6 pb-16">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Subscription</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {state.kind === 'institution'
            ? `Billing for ${state.name ?? 'your institution'}.`
            : 'Your personal subscription.'}
        </p>
      </div>

      {/* Status card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base">{state.tierLabel}</CardTitle>
            <Badge variant="outline" className={`text-xs ${TONE[status.tone]}`}>
              {status.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isTrialing && renews && (
            <div className="flex items-start gap-2 text-sm bg-blue-50 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/50 p-3 rounded-md">
              <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <div className="font-medium text-blue-900 dark:text-blue-200">Trial ends {renews}</div>
                <div className="text-xs text-blue-800/80 dark:text-blue-300/80 mt-0.5">
                  You'll be charged automatically on the trial end date. Cancel anytime before then with no charge.
                </div>
              </div>
            </div>
          )}
          {isPastDue && (
            <div className="flex items-start gap-2 text-sm bg-rose-50 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/50 p-3 rounded-md">
              <AlertTriangle className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
              <div>
                <div className="font-medium text-rose-900 dark:text-rose-200">Last payment failed</div>
                <div className="text-xs text-rose-800/80 dark:text-rose-300/80 mt-0.5">
                  We're retrying automatically. Please update your payment method to avoid losing access.
                </div>
              </div>
            </div>
          )}
          {state.status === 'ACTIVE' && renews && !isTrialing && (
            <div className="flex items-start gap-2 text-sm bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/50 p-3 rounded-md">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <div className="font-medium text-emerald-900 dark:text-emerald-200">Renews {renews}</div>
                <div className="text-xs text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">
                  Cancel anytime — you keep access until the end of the current period.
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {state.hasStripeCustomer ? (
              <Button asChild>
                <a href={state.portalUrl}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Manage in Stripe
                  <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </Button>
            ) : (
              <Button asChild>
                <a href={state.upgradeUrl}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Upgrade
                  <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </Button>
            )}
            {isPaid && state.hasStripeCustomer && (
              <Button variant="outline" asChild>
                <a href={state.portalUrl}>
                  Update payment method
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade nudge — only when on free/core */}
      {!isPaid && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ready to scale up?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {state.kind === 'institution'
                ? 'Institutional Premium unlocks unlimited AI Assistant, advanced analytics, audit log exports, reminder automation, and MIUR reports — €39/mo or €390/yr with a 30-day free trial.'
                : state.role === 'STUDENT'
                  ? 'Student Premium unlocks unlimited AI analyses, the AI Interview Coach, signed Europass credentials, and priority recruiter visibility — €5/mo or €45/yr with a 30-day free trial.'
                  : 'Subscribe to remove the 5-contact monthly cap, get team seats, and unlock the full Hiring Advisor — €89/mo with VAT-compliant invoicing.'}
            </p>
            <Button asChild>
              <Link href={state.upgradeUrl}>
                See plans
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-muted-foreground text-center pt-4">
        Need help? Email <a className="underline" href="mailto:billing@in-transparency.com">billing@in-transparency.com</a>
      </div>
    </div>
  )
}
