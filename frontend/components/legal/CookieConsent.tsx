'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Cookie, X } from 'lucide-react'

/**
 * GDPR / ePrivacy cookie consent banner with categories.
 *
 * Garante italiano-compliant: users can accept all, reject all, or customize
 * per category. Choice persisted in localStorage. No tracking cookies loaded
 * until the user consents.
 *
 * The actual category gating (analytics, marketing) should read from
 * `getCookieConsent()` before initializing those scripts.
 */

const STORAGE_KEY = 'intransparency.cookie-consent.v1'

export interface CookieConsent {
  necessary: true // always true — these are strictly required
  analytics: boolean
  marketing: boolean
  timestamp: string
}

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as CookieConsent
  } catch {
    return null
  }
}

function saveConsent(consent: CookieConsent) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent))
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const existing = getCookieConsent()
    if (!existing) setVisible(true)
  }, [])

  const submit = (all: boolean | null) => {
    const consent: CookieConsent = {
      necessary: true,
      analytics: all === true ? true : all === false ? false : analytics,
      marketing: all === true ? true : all === false ? false : marketing,
      timestamp: new Date().toISOString(),
    }
    saveConsent(consent)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <Card className="max-w-3xl mx-auto pointer-events-auto shadow-2xl border-primary/30">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start gap-3">
            <Cookie className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">We use cookies</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Strictly necessary cookies keep the platform secure and logged in. Optional
                cookies help us understand usage and show relevant content. You control what you
                accept — you can change your choice any time in settings.
              </p>

              {showDetails && (
                <div className="space-y-3 mb-4 p-3 bg-muted/40 rounded">
                  <CategoryRow
                    title="Strictly necessary"
                    description="Session, authentication, security. Always on — we can't run the platform without them."
                    checked
                    disabled
                  />
                  <CategoryRow
                    title="Analytics"
                    description="Anonymous page views and feature usage. Helps us fix bugs and improve what matters to you."
                    checked={analytics}
                    onChange={setAnalytics}
                  />
                  <CategoryRow
                    title="Marketing"
                    description="Measuring which channels brought you here. Only used with your explicit consent."
                    checked={marketing}
                    onChange={setMarketing}
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-2 items-center">
                <Button size="sm" onClick={() => submit(true)}>
                  Accept all
                </Button>
                <Button size="sm" variant="outline" onClick={() => submit(false)}>
                  Reject optional
                </Button>
                {showDetails ? (
                  <Button size="sm" variant="secondary" onClick={() => submit(null)}>
                    Save my choice
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => setShowDetails(true)}>
                    Customize
                  </Button>
                )}
                <a
                  href="/privacy"
                  className="text-xs text-muted-foreground hover:text-primary ml-auto"
                >
                  Privacy policy
                </a>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => submit(false)}
              aria-label="Reject optional cookies"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CategoryRow({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange?: (v: boolean) => void
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={e => onChange?.(e.target.checked)}
        className="mt-1"
      />
      <div className="flex-1">
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </label>
  )
}
