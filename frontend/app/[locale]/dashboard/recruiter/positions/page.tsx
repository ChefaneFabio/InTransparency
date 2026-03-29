'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Briefcase, Plus, Zap, Shield, Clock } from 'lucide-react'
import PositionListingCard from '@/components/dashboard/recruiter/PositionListingCard'

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

export default function PositionsPage() {
  const t = useTranslations('dashboard.recruiter.positions')
  const [listings, setListings] = useState<PositionListing[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const fetchListings = useCallback(async () => {
    try {
      const res = await fetch('/api/position-listing')
      if (res.ok) {
        const data = await res.json()
        setListings(data.listings)
      }
    } catch (error) {
      console.error('Failed to fetch position listings:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setCreating(true)
    try {
      const res = await fetch('/api/position-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          price: 4900, // €49
          durationDays: 30,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.url) {
          window.location.href = data.url
        }
      }
    } catch (error) {
      console.error('Failed to create position listing:', error)
    } finally {
      setCreating(false)
    }
  }

  const handleCancel = async (id: string) => {
    try {
      const res = await fetch(`/api/position-listing/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      })

      if (res.ok) {
        setListings((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: 'CANCELLED' as const } : l))
        )
      }
    } catch (error) {
      console.error('Failed to cancel position listing:', error)
    }
  }

  const activeListings = listings.filter((l) => l.status === 'ACTIVE')
  const pastListings = listings.filter((l) => l.status !== 'ACTIVE')

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
        </div>
        <Button onClick={() => setShowForm(true)} disabled={showForm}>
          <Plus className="h-4 w-4 mr-2" />
          {t('openPosition')}
        </Button>
      </div>

      {/* Value proposition */}
      <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/[0.03] to-transparent">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">{t('valueProp.title')}</h3>
              <p className="text-muted-foreground text-sm mb-3">{t('valueProp.description')}</p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5 text-sm">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>{t('valueProp.unlimitedContacts')}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{t('valueProp.thirtyDays')}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <span>{t('valueProp.noSubscription')}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create new position form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('createForm.title')}</CardTitle>
            <CardDescription>{t('createForm.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label htmlFor="position-title" className="block text-sm font-medium mb-1.5">
                  {t('createForm.positionTitle')}
                </label>
                <input
                  id="position-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('createForm.titlePlaceholder')}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="position-description" className="block text-sm font-medium mb-1.5">
                  {t('createForm.positionDescription')}
                </label>
                <textarea
                  id="position-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('createForm.descriptionPlaceholder')}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-base font-semibold py-1 px-3">
                    &euro;49
                  </Badge>
                  <span className="text-sm text-muted-foreground">{t('createForm.perPosition')}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowForm(false)
                      setTitle('')
                      setDescription('')
                    }}
                  >
                    {t('createForm.cancel')}
                  </Button>
                  <Button type="submit" disabled={creating || !title.trim()}>
                    {creating ? t('createForm.processing') : t('createForm.payAndActivate')}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Active positions */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <>
          {activeListings.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                {t('activePositions')}
                <Badge variant="secondary" className="ml-1">{activeListings.length}</Badge>
              </h2>
              <div className="space-y-4">
                {activeListings.map((listing) => (
                  <PositionListingCard
                    key={listing.id}
                    listing={listing}
                    onCancel={handleCancel}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Past / other positions */}
          {pastListings.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">{t('pastPositions')}</h2>
              <div className="space-y-4">
                {pastListings.map((listing) => (
                  <PositionListingCard
                    key={listing.id}
                    listing={listing}
                  />
                ))}
              </div>
            </div>
          )}

          {listings.length === 0 && !showForm && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Briefcase className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="font-medium text-lg mb-1">{t('empty.title')}</h3>
                <p className="text-muted-foreground text-sm text-center max-w-sm mb-4">
                  {t('empty.description')}
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('openPosition')}
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
