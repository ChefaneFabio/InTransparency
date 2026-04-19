'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, X, ArrowRight } from 'lucide-react'
import { Link } from '@/navigation'

interface SelfDiscoveryProfile {
  stepsCompleted: number
  completedAt: string | null
}

const DISMISS_KEY = 'intransparency.onboarding-gate.dismissed'

/**
 * A non-blocking onboarding prompt shown at the top of the student dashboard.
 * If self-discovery is incomplete, surface it. Student can dismiss per session
 * (stored in localStorage) or click through to /self-discovery.
 *
 * This is the "nudge" version — we don't hard-redirect. Hard-redirect would
 * frustrate students who bookmark their dashboard.
 */
export function OnboardingGate() {
  const [profile, setProfile] = useState<SelfDiscoveryProfile | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(DISMISS_KEY) === 'true') {
      setDismissed(true)
      setLoading(false)
      return
    }
    fetch('/api/student/self-discovery')
      .then(r => (r.ok ? r.json() : null))
      .then(data => data && setProfile(data.profile))
      .finally(() => setLoading(false))
  }, [])

  const dismiss = () => {
    if (typeof window !== 'undefined') localStorage.setItem(DISMISS_KEY, 'true')
    setDismissed(true)
  }

  if (loading || dismissed || !profile) return null
  if (profile.completedAt) return null // Fully completed — no prompt

  const stepsLeft = 6 - profile.stepsCompleted
  const isFresh = profile.stepsCompleted === 0

  return (
    <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {isFresh ? 'Start with self-discovery' : `Continue self-discovery (${stepsLeft} step${stepsLeft !== 1 ? 's' : ''} left)`}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={dismiss} aria-label="Dismiss">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          {isFresh
            ? "Before companies see your profile, spend 10 minutes understanding your values, strengths, and goals. We'll also reconcile your self-assessment with your verified skill record — the conversation with recruiters starts on stronger ground."
            : "Pick up where you left off. The final step compares your self-assessment with your verified skill graph — insights you won't get anywhere else."}
        </p>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/self-discovery">
              {isFresh ? 'Begin' : 'Continue'}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={dismiss}>
            Maybe later
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
