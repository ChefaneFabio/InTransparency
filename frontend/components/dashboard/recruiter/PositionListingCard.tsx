'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Briefcase, Calendar, Users, XCircle } from 'lucide-react'

interface PositionListing {
  id: string
  title: string
  description?: string | null
  status: 'PENDING_PAYMENT' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED'
  activatedAt?: string | null
  expiresAt?: string | null
  durationDays: number
  contactsUsed: number
  price: number
  createdAt: string
}

interface Props {
  listing: PositionListing
  onCancel?: (id: string) => void
}

export default function PositionListingCard({ listing, onCancel }: Props) {
  const t = useTranslations('dashboard.recruiter.positions')
  const [cancelling, setCancelling] = useState(false)

  const isActive = listing.status === 'ACTIVE'
  const isExpired = listing.status === 'EXPIRED'
  const isPending = listing.status === 'PENDING_PAYMENT'
  const isCancelled = listing.status === 'CANCELLED'

  // Calculate days remaining
  let daysRemaining = 0
  let progressPercent = 0
  if (isActive && listing.expiresAt && listing.activatedAt) {
    const now = new Date()
    const expiresAt = new Date(listing.expiresAt)
    const activatedAt = new Date(listing.activatedAt)
    const totalMs = expiresAt.getTime() - activatedAt.getTime()
    const elapsedMs = now.getTime() - activatedAt.getTime()
    daysRemaining = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    progressPercent = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100))
  }

  const statusVariant = isActive ? 'default' : isExpired ? 'secondary' : isPending ? 'outline' : 'destructive'

  const handleCancel = async () => {
    if (!onCancel) return
    setCancelling(true)
    try {
      await onCancel(listing.id)
    } finally {
      setCancelling(false)
    }
  }

  return (
    <Card className={`transition-colors ${isActive ? 'border-primary/30 bg-primary/[0.02]' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isActive ? 'bg-primary/10' : 'bg-gray-100'}`}>
              <Briefcase className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
            </div>
            <div>
              <CardTitle className="text-base">{listing.title}</CardTitle>
              {listing.description && (
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{listing.description}</p>
              )}
            </div>
          </div>
          <Badge variant={statusVariant}>
            {t(`status.${listing.status}`)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isActive && (
          <>
            <div className="flex items-center justify-between text-sm mb-2">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>{t('daysRemaining', { days: daysRemaining })}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span>{t('contactsUsed', { count: listing.contactsUsed })}</span>
              </div>
            </div>
            <Progress value={progressPercent} className="h-1.5" />
            <p className="text-xs text-muted-foreground mt-1.5">
              {t('timeProgress', { percent: Math.round(progressPercent) })}
            </p>
          </>
        )}

        {isPending && (
          <p className="text-sm text-amber-600">
            {t('pendingPayment')}
          </p>
        )}

        {isExpired && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{t('expired')}</span>
            <span>{t('contactsUsed', { count: listing.contactsUsed })}</span>
          </div>
        )}

        {isCancelled && (
          <p className="text-sm text-muted-foreground">
            {t('cancelled')}
          </p>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <span className="text-sm font-medium">
            {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(listing.price / 100)}
          </span>
          {isActive && onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={cancelling}
              className="text-destructive hover:text-destructive"
            >
              <XCircle className="h-4 w-4 mr-1" />
              {cancelling ? t('cancelling') : t('cancel')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
