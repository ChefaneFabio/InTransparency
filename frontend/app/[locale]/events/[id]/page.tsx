'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'
import { useLocale } from 'next-intl'
import { Link } from '@/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Video,
  Users,
  Building2,
  CheckCircle2,
  Loader2,
  ExternalLink,
} from 'lucide-react'

interface PublicEventDetail {
  id: string
  title: string
  description: string | null
  eventType: string
  location: string | null
  isOnline: boolean
  meetingUrl: string | null
  startDate: string
  endDate: string
  timezone: string
  status: string
  maxAttendees: number | null
  maxRecruiters: number | null
  registrationDeadline: string | null
  requiresApproval: boolean
  organizer: string
  organizerLogo: string | null
  organizerWebsite: string | null
  attendeeCount: number
  slotCount: number
  spotsLeft: number | null
}

const EVENT_TYPE_LABEL: Record<string, { en: string; it: string }> = {
  CAREER_DAY: { en: 'Career Day', it: 'Career Day' },
  WORKSHOP: { en: 'Workshop', it: 'Workshop' },
  WEBINAR: { en: 'Webinar', it: 'Webinar' },
  NETWORKING: { en: 'Networking', it: 'Networking' },
  INFO_SESSION: { en: 'Info Session', it: 'Sessione informativa' },
}

export default function PublicEventDetailPage() {
  const params = useParams<{ id: string }>()
  const eventId = params?.id
  const locale = useLocale()
  const isIt = locale === 'it'
  const { data: session, status: sessionStatus } = useSession()

  const [event, setEvent] = useState<PublicEventDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rsvpStatus, setRsvpStatus] = useState<string | null>(null)
  const [rsvpLoading, setRsvpLoading] = useState(false)
  const [rsvpError, setRsvpError] = useState<string | null>(null)

  const fetchEvent = useCallback(async () => {
    if (!eventId) return
    try {
      const res = await fetch(`/api/events/${eventId}`)
      if (!res.ok) {
        setError(isIt ? 'Evento non trovato.' : 'Event not found.')
        return
      }
      const data = await res.json()
      setEvent(data.event)
      if (session?.user?.id) {
        const rsvpRes = await fetch(`/api/events/${eventId}/rsvp`)
        if (rsvpRes.ok) {
          const rsvpData = await rsvpRes.json()
          setRsvpStatus(rsvpData.rsvp?.status ?? null)
        }
      }
    } catch (err) {
      console.error(err)
      setError(isIt ? 'Errore di rete.' : 'Network error.')
    } finally {
      setLoading(false)
    }
  }, [eventId, isIt, session?.user?.id])

  useEffect(() => {
    fetchEvent()
  }, [fetchEvent])

  async function handleRsvp() {
    if (!event) return
    if (!session?.user?.id) {
      signIn(undefined, { callbackUrl: typeof window !== 'undefined' ? window.location.pathname : '/' })
      return
    }
    setRsvpLoading(true)
    setRsvpError(null)
    try {
      const res = await fetch(`/api/events/${event.id}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      if (!res.ok) {
        setRsvpError(data.error ?? (isIt ? 'Errore.' : 'Error.'))
        return
      }
      setRsvpStatus(data.rsvp?.status ?? 'CONFIRMED')
    } finally {
      setRsvpLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/events">
            <ArrowLeft className="h-4 w-4 mr-1" /> {isIt ? 'Tutti gli eventi' : 'All events'}
          </Link>
        </Button>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const startDate = new Date(event.startDate)
  const endDate = new Date(event.endDate)
  const dateLabel = startDate.toLocaleDateString(isIt ? 'it-IT' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const timeLabel = `${startDate.toLocaleTimeString(isIt ? 'it-IT' : 'en-GB', { hour: '2-digit', minute: '2-digit' })} – ${endDate.toLocaleTimeString(isIt ? 'it-IT' : 'en-GB', { hour: '2-digit', minute: '2-digit' })}`
  const eventTypeLabel = EVENT_TYPE_LABEL[event.eventType]?.[isIt ? 'it' : 'en'] ?? event.eventType
  const isPublished = event.status === 'PUBLISHED'
  const isPast = endDate < new Date()
  const deadlinePassed = event.registrationDeadline ? new Date(event.registrationDeadline) < new Date() : false
  const isFull = event.spotsLeft === 0
  const canRsvp = isPublished && !isPast && !deadlinePassed && !isFull
  const alreadyRsvped = rsvpStatus && rsvpStatus !== 'CANCELLED'

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/events">
          <ArrowLeft className="h-4 w-4 mr-1" /> {isIt ? 'Tutti gli eventi' : 'All events'}
        </Link>
      </Button>

      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary">{eventTypeLabel}</Badge>
          {!isPublished && (
            <Badge className="bg-amber-100 text-amber-700">{isIt ? 'Anteprima' : 'Preview'}</Badge>
          )}
          {isPast && <Badge className="bg-slate-200 text-slate-600">{isIt ? 'Passato' : 'Past'}</Badge>}
        </div>
        <h1 className="text-3xl font-semibold">{event.title}</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {event.organizerLogo && (
            <Image
              src={event.organizerLogo}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 rounded object-contain bg-muted"
            />
          )}
          <span className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4" />
            {event.organizerWebsite ? (
              <a href={event.organizerWebsite} target="_blank" rel="noreferrer" className="hover:underline inline-flex items-center gap-1">
                {event.organizer}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              event.organizer
            )}
          </span>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{dateLabel}</span>
            <span className="text-muted-foreground">· {timeLabel}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {event.location}
            </div>
          )}
          {event.isOnline && (
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-muted-foreground" />
              {isIt ? 'Online' : 'Online'}
              {event.meetingUrl && alreadyRsvped && (
                <a href={event.meetingUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                  {isIt ? 'apri link' : 'open link'}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {event.attendeeCount} {isIt ? 'iscritti' : 'registered'}
              {event.maxAttendees && (
                <>
                  {' '}/ {event.maxAttendees}
                  {event.spotsLeft !== null && event.spotsLeft > 0 && (
                    <span className="text-muted-foreground">
                      {' '}({event.spotsLeft} {isIt ? 'posti rimasti' : 'spots left'})
                    </span>
                  )}
                </>
              )}
            </span>
          </div>
          {event.registrationDeadline && (
            <div className="text-xs text-muted-foreground">
              {isIt ? 'Iscrizioni entro' : 'Register by'}{' '}
              {new Date(event.registrationDeadline).toLocaleDateString(isIt ? 'it-IT' : 'en-GB')}
            </div>
          )}
        </CardContent>
      </Card>

      {event.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{isIt ? 'Dettagli' : 'About this event'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap text-foreground/90">{event.description}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        {alreadyRsvped ? (
          <Badge className="bg-emerald-100 text-emerald-700 px-3 py-1.5 text-sm">
            <CheckCircle2 className="h-4 w-4 mr-1.5" />
            {isIt ? 'Sei iscritto' : "You're registered"}
            {rsvpStatus === 'PENDING' && ` (${isIt ? 'in attesa' : 'pending'})`}
          </Badge>
        ) : (
          <Button
            onClick={handleRsvp}
            disabled={!canRsvp || rsvpLoading || sessionStatus === 'loading'}
            size="lg"
          >
            {rsvpLoading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{isIt ? 'Iscrizione…' : 'Registering…'}</>
            ) : !session?.user?.id ? (
              isIt ? 'Accedi per iscriverti' : 'Sign in to register'
            ) : !isPublished ? (
              isIt ? 'Non ancora aperto' : 'Not yet open'
            ) : isPast ? (
              isIt ? 'Evento concluso' : 'Event ended'
            ) : deadlinePassed ? (
              isIt ? 'Iscrizioni chiuse' : 'Registration closed'
            ) : isFull ? (
              isIt ? 'Posti esauriti' : 'Sold out'
            ) : (
              isIt ? 'Iscriviti' : 'Register'
            )}
          </Button>
        )}
        {rsvpError && <span className="text-sm text-red-600">{rsvpError}</span>}
      </div>
    </div>
  )
}
