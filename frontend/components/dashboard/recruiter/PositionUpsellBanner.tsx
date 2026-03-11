'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { ArrowRight, TrendingUp, X } from 'lucide-react'

interface PositionUpsellProps {
  recentContacts: number
  spentRecently: number // in cents
  positionPrice: number // in cents
  savings: number // in cents (how much they'd have saved)
}

export function PositionUpsellBanner({
  recentContacts,
  spentRecently,
  positionPrice,
  savings,
}: PositionUpsellProps) {
  const t = useTranslations('dashboard.recruiter.positionUpsell')
  const [dismissed, setDismissed] = useState(false)
  const [loading, setLoading] = useState(false)

  if (dismissed) return null

  const spentEuros = spentRecently / 100
  const positionEuros = positionPrice / 100

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/position-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: t('defaultPositionTitle'),
          price: positionPrice,
          durationDays: 30,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="relative bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <TrendingUp className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">
            {t('title', { contacts: recentContacts, spent: spentEuros })}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {t('description', { price: positionEuros })}
          </p>
          {savings > 0 && (
            <p className="text-xs text-primary font-medium mt-1">
              {t('savings', { amount: savings / 100 })}
            </p>
          )}
          <Button
            size="sm"
            className="mt-3"
            onClick={handleUpgrade}
            disabled={loading}
          >
            {loading ? t('loading') : t('cta', { price: positionEuros })}
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
