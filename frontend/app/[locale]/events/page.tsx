'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Search,
  Video,
  Building2,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Filter,
} from 'lucide-react'

interface PublicEvent {
  id: string
  title: string
  description: string
  eventType: string
  location: string | null
  isOnline: boolean
  startDate: string
  endDate: string
  timezone: string
  maxAttendees: number | null
  registrationDeadline: string | null
  organizer: string
  organizerLogo: string | null
  attendeeCount: number
  slotCount: number
  spotsLeft: number | null
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  CAREER_DAY: 'bg-primary/10 text-blue-700',
  WORKSHOP: 'bg-primary/10 text-purple-700',
  WEBINAR: 'bg-primary/10 text-green-700',
  NETWORKING: 'bg-amber-100 text-amber-700',
  INFO_SESSION: 'bg-pink-100 text-pink-700',
}

export default function EventsPage() {
  const t = useTranslations('eventsPage')
  const { data: session } = useSession()
  const [events, setEvents] = useState<PublicEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [rsvpStates, setRsvpStates] = useState<Record<string, string>>({})
  const [rsvpLoading, setRsvpLoading] = useState<string | null>(null)

  const EVENT_TYPES = [
    { value: '', label: t('types.all') },
    { value: 'CAREER_DAY', label: t('types.careerDay') },
    { value: 'WORKSHOP', label: t('types.workshop') },
    { value: 'WEBINAR', label: t('types.webinar') },
    { value: 'NETWORKING', label: t('types.networking') },
    { value: 'INFO_SESSION', label: t('types.infoSession') },
  ]

  useEffect(() => {
    fetchEvents()
  }, [typeFilter])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (typeFilter) params.set('type', typeFilter)
      if (search) params.set('search', search)

      const res = await fetch(`/api/events?${params}`)
      if (res.ok) {
        const data = await res.json()
        setEvents(data.events)
      }
    } catch (err) {
      console.error('Failed to fetch events:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchEvents()
  }

  const handleRSVP = async (eventId: string) => {
    if (!session?.user?.id) {
      window.location.href = '/auth/register'
      return
    }

    setRsvpLoading(eventId)
    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      if (res.ok) {
        const data = await res.json()
        setRsvpStates((prev) => ({ ...prev, [eventId]: data.rsvp.status }))
      } else {
        const data = await res.json()
        alert(data.error || t('rsvpFailed'))
      }
    } catch (err) {
      console.error('RSVP failed:', err)
    } finally {
      setRsvpLoading(null)
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  }

  const formatEventType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-white border-b py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{t('title')}</h1>
          <p className="text-gray-600 mb-6">
            {t('subtitle')}
          </p>

          {/* Search */}
          <div className="flex gap-2 max-w-lg mx-auto">
            <Input
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Type filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {EVENT_TYPES.map((tp) => (
            <button
              key={tp.value}
              onClick={() => setTypeFilter(tp.value)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                typeFilter === tp.value
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 border hover:bg-gray-50'
              }`}
            >
              {tp.label}
            </button>
          ))}
        </div>

        {/* Events list */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : events.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-10 w-10 mx-auto text-gray-300 mb-3" />
              <p className="font-medium text-gray-700">{t('empty.title')}</p>
              <p className="text-sm text-gray-500 mt-1">
                {search || typeFilter
                  ? t('empty.adjustFilters')
                  : t('empty.checkBackSoon')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {events.map((event) => {
              const rsvpStatus = rsvpStates[event.id]
              const isRsvpd = rsvpStatus === 'CONFIRMED' || rsvpStatus === 'PENDING'
              const isFull = event.spotsLeft !== null && event.spotsLeft <= 0
              const deadlinePassed = event.registrationDeadline
                ? new Date(event.registrationDeadline) < new Date()
                : false

              return (
                <Card key={event.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      {/* Date column */}
                      <div className="w-16 flex-shrink-0 text-center">
                        <div className="text-sm font-bold text-primary">
                          {new Date(event.startDate).toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()}
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {new Date(event.startDate).getDate()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(event.startDate).toLocaleDateString('en-GB', { weekday: 'short' })}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Link href={`/events/${event.id}`} className="font-semibold text-gray-900 hover:underline">
                                {event.title}
                              </Link>
                              <Badge className={`text-xs ${EVENT_TYPE_COLORS[event.eventType] || 'bg-gray-100 text-gray-600'}`}>
                                {formatEventType(event.eventType)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                              {event.description}
                            </p>
                          </div>
                        </div>

                        {/* Meta */}
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" />
                            {event.organizer}
                          </span>
                          <span className="flex items-center gap-1">
                            {event.isOnline ? (
                              <><Video className="h-3.5 w-3.5" /> {t('online')}</>
                            ) : (
                              <><MapPin className="h-3.5 w-3.5" /> {event.location || t('tba')}</>
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {formatTime(event.startDate)} - {formatTime(event.endDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {t('attending', { count: event.attendeeCount })}
                            {event.spotsLeft !== null && ` · ${t('spotsLeft', { count: event.spotsLeft })}`}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {isRsvpd ? (
                            <Badge className="bg-primary/10 text-green-700 text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {rsvpStatus === 'PENDING' ? t('pendingApproval') : t('registered')}
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleRSVP(event.id)}
                              disabled={rsvpLoading === event.id || isFull || deadlinePassed}
                            >
                              {rsvpLoading === event.id ? (
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              ) : null}
                              {isFull ? t('full') : deadlinePassed ? t('registrationClosed') : t('register')}
                            </Button>
                          )}
                          {event.slotCount > 0 && (
                            <span className="text-xs text-primary">
                              {t('interviewSlotsAvailable', { count: event.slotCount })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
