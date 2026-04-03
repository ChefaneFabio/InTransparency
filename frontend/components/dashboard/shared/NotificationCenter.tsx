'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Bell, Check, CheckCheck, X, Filter } from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { AnimatedSection } from '@/components/ui/animated-card'

type NotificationType = 'VERIFICATION_UPDATE' | 'MESSAGE_RECEIVED' | 'BADGE_ISSUED' | 'MENTORSHIP_REQUEST' | 'EVENT_RSVP' | 'REVIEW_POSTED' | 'SCORE_UPDATE' | 'GENERAL'

interface Notification {
  id: string
  type: NotificationType
  title: string
  body: string | null
  link: string | null
  read: boolean
  createdAt: string
}

const typeIcons: Record<string, string> = {
  VERIFICATION_UPDATE: '\u2713', MESSAGE_RECEIVED: '\u2709', BADGE_ISSUED: '\uD83D\uDEE1',
  MENTORSHIP_REQUEST: '\uD83D\uDC65', EVENT_RSVP: '\uD83D\uDCC5', REVIEW_POSTED: '\u2B50',
  SCORE_UPDATE: '\uD83D\uDCCA', GENERAL: '\uD83D\uDD14',
}

const typeColors: Record<string, string> = {
  VERIFICATION_UPDATE: 'bg-green-100 text-green-700',
  MESSAGE_RECEIVED: 'bg-blue-100 text-blue-700',
  BADGE_ISSUED: 'bg-purple-100 text-purple-700',
  MENTORSHIP_REQUEST: 'bg-amber-100 text-amber-700',
  EVENT_RSVP: 'bg-indigo-100 text-indigo-700',
  REVIEW_POSTED: 'bg-rose-100 text-rose-700',
  SCORE_UPDATE: 'bg-teal-100 text-teal-700',
  GENERAL: 'bg-slate-100 text-slate-700',
}

function timeAgo(dateStr: string, t: (key: string, params?: Record<string, any>) => string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return t('time.justNow')
  if (seconds < 3600) return t('time.minutesAgo', { count: Math.floor(seconds / 60) })
  if (seconds < 86400) return t('time.hoursAgo', { count: Math.floor(seconds / 3600) })
  if (seconds < 604800) return t('time.daysAgo', { count: Math.floor(seconds / 86400) })
  return new Date(dateStr).toLocaleDateString()
}

function groupByDate(items: Notification[], t: (key: string) => string): { label: string; items: Notification[] }[] {
  const groups = new Map<string, Notification[]>()
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()

  for (let i = 0; i < items.length; i++) {
    const d = new Date(items[i].createdAt).toDateString()
    const label = d === today ? t('date.today') : d === yesterday ? t('date.yesterday') : new Date(items[i].createdAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })
    const existing = groups.get(label)
    if (existing) existing.push(items[i])
    else groups.set(label, [items[i]])
  }

  return Array.from(groups.entries()).map(([label, items]) => ({ label, items }))
}

export function NotificationCenter() {
  const t = useTranslations('shared')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const fetchNotifications = useCallback(async () => {
    try {
      const params = filter === 'unread' ? '?unreadOnly=true&limit=50' : '?limit=50'
      const res = await fetch(`/api/notifications${params}`)
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications || [])
      }
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [filter])

  useEffect(() => { fetchNotifications() }, [fetchNotifications])

  const markAllRead = async () => {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAllRead: true }),
    })
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markRead = async (id: string) => {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markRead: id }),
    })
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const dismiss = async (id: string) => {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dismiss: id }),
    })
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.read).length
  const groups = groupByDate(notifications, t)

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 px-4 py-6">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <AnimatedSection>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground">{t('notifications.title')}</h1>
            {unreadCount > 0 && <Badge variant="destructive" className="text-xs">{unreadCount}</Badge>}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border overflow-hidden text-xs">
              <button onClick={() => setFilter('all')}
                className={`px-3 py-1.5 transition-colors ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}>
                {t('notifications.all')}
              </button>
              <button onClick={() => setFilter('unread')}
                className={`px-3 py-1.5 transition-colors ${filter === 'unread' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}>
                {t('notifications.unread')}
              </button>
            </div>
            {unreadCount > 0 && (
              <Button size="sm" variant="outline" onClick={markAllRead}>
                <CheckCheck className="h-3.5 w-3.5 mr-1" /> {t('notifications.markAllRead')}
              </Button>
            )}
          </div>
        </div>
      </AnimatedSection>

      {groups.length > 0 ? (
        groups.map((group) => (
          <div key={group.label}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">{group.label}</p>
            <div className="space-y-2">
              {group.items.map((n) => (
                <GlassCard key={n.id} delay={0} hover={true}>
                  <div className={`p-4 flex items-start gap-3 ${!n.read ? 'border-l-2 border-l-primary' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${typeColors[n.type] || typeColors.GENERAL}`}>
                      {typeIcons[n.type] || typeIcons.GENERAL}
                    </div>
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => { if (!n.read) markRead(n.id) }}>
                      <p className={`text-sm ${!n.read ? 'font-semibold text-foreground' : 'text-foreground/80'}`}>{n.title}</p>
                      {n.body && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>}
                      <p className="text-[10px] text-muted-foreground/60 mt-1">{timeAgo(n.createdAt, t)}</p>
                    </div>
                    <button onClick={() => dismiss(n.id)} className="text-muted-foreground/40 hover:text-destructive transition-colors p-1">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-muted/50 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Bell className="h-7 w-7 text-muted-foreground/40" />
          </div>
          <p className="text-sm text-muted-foreground">
            {filter === 'unread' ? t('notifications.noUnread') : t('notifications.noNotifications')}
          </p>
        </div>
      )}
    </div>
  )
}
