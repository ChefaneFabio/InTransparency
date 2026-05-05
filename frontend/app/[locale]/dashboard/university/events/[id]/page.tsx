'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Link } from '@/navigation'
import { useLocale } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Video,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Loader2,
} from 'lucide-react'

interface RSVP {
  id: string
  role: string
  status: string
  companyName: string | null
  notes: string | null
  createdAt: string
  user: {
    id: string
    firstName: string | null
    lastName: string | null
    email: string
    role: string
    company: string | null
  }
}

interface EventDetail {
  id: string
  title: string
  description: string | null
  eventType: string
  location: string | null
  isOnline: boolean
  meetingUrl: string | null
  startDate: string
  endDate: string
  status: string
  publishedAt: string | null
  maxAttendees: number | null
  maxRecruiters: number | null
  rsvps: RSVP[]
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  DRAFT: { label: 'Bozza', className: 'bg-amber-100 text-amber-700' },
  PUBLISHED: { label: 'Pubblicato', className: 'bg-emerald-100 text-emerald-700' },
  CANCELLED: { label: 'Annullato', className: 'bg-rose-100 text-rose-700' },
  COMPLETED: { label: 'Completato', className: 'bg-slate-200 text-slate-700' },
}

const RSVP_STATUS_LABEL: Record<string, string> = {
  PENDING: 'In attesa',
  CONFIRMED: 'Confermato / Presente',
  DECLINED: 'Rifiutato',
  WAITLISTED: 'In lista d\'attesa',
  CANCELLED: 'Annullato',
}

export default function EventDetailPage() {
  const params = useParams<{ id: string }>()
  const eventId = params?.id
  const locale = useLocale()
  const isIt = locale === 'it'

  const [event, setEvent] = useState<EventDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inviteEmails, setInviteEmails] = useState('')
  const [inviteNote, setInviteNote] = useState('')
  const [inviteLocale, setInviteLocale] = useState<'en' | 'it'>('it')
  const [inviting, setInviting] = useState(false)
  const [inviteResult, setInviteResult] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  const fetchEvent = useCallback(async () => {
    if (!eventId) return
    try {
      const res = await fetch(`/api/dashboard/university/events/${eventId}`)
      if (!res.ok) {
        setError(isIt ? 'Evento non trovato.' : 'Event not found.')
        return
      }
      const data = await res.json()
      setEvent(data.event)
    } catch (err) {
      console.error(err)
      setError(isIt ? 'Errore di rete.' : 'Network error.')
    } finally {
      setLoading(false)
    }
  }, [eventId, isIt])

  useEffect(() => {
    fetchEvent()
  }, [fetchEvent])

  async function setStatus(newStatus: string) {
    if (!event) return
    let cancellationReason: string | undefined
    if (newStatus === 'CANCELLED') {
      const confirmedRsvps = event.rsvps.filter((r) =>
        ['PENDING', 'CONFIRMED', 'WAITLISTED'].includes(r.status)
      ).length
      const reason = prompt(
        isIt
          ? `Annulla l'evento? ${confirmedRsvps} iscritti riceveranno una email di notifica. Inserisci una breve motivazione (opzionale):`
          : `Cancel the event? ${confirmedRsvps} registered attendees will be notified by email. Enter a short reason (optional):`
      )
      if (reason === null) return
      cancellationReason = reason || undefined
    }
    setUpdating(true)
    try {
      const res = await fetch(`/api/dashboard/university/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, cancellationReason }),
      })
      if (res.ok) {
        await fetchEvent()
      }
    } finally {
      setUpdating(false)
    }
  }

  async function setRsvpStatus(rsvpId: string, status: string) {
    if (!event) return
    const res = await fetch(`/api/dashboard/university/events/${event.id}/rsvps/${rsvpId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) await fetchEvent()
  }

  async function sendInvites() {
    if (!event) return
    const emails = inviteEmails
      .split(/[\s,;\n]+/)
      .map((e) => e.trim())
      .filter(Boolean)
    if (emails.length === 0) {
      setInviteResult(isIt ? 'Inserisci almeno un\'email.' : 'Enter at least one email.')
      return
    }
    setInviting(true)
    setInviteResult(null)
    try {
      const res = await fetch(`/api/dashboard/university/events/${event.id}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails, note: inviteNote || undefined, locale: inviteLocale }),
      })
      const data = await res.json()
      if (!res.ok) {
        setInviteResult(data.error ?? (isIt ? 'Errore.' : 'Error.'))
        return
      }
      setInviteResult(
        isIt
          ? `Invitati ${data.requested} contatti (${data.invitedExisting} già registrati, ${data.invitedExternal} esterni).`
          : `Invited ${data.requested} contacts (${data.invitedExisting} existing, ${data.invitedExternal} external).`
      )
      setInviteEmails('')
      setInviteNote('')
      await fetchEvent()
    } catch (err) {
      console.error(err)
      setInviteResult(isIt ? 'Errore di rete.' : 'Network error.')
    } finally {
      setInviting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/university/events">
            <ArrowLeft className="h-4 w-4 mr-1" /> {isIt ? 'Indietro' : 'Back'}
          </Link>
        </Button>
        <Alert variant="destructive">
          <AlertDescription>{error ?? (isIt ? 'Evento non trovato.' : 'Event not found.')}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const statusBadge = STATUS_BADGE[event.status] ?? STATUS_BADGE.DRAFT
  const startLabel = new Date(event.startDate).toLocaleString(isIt ? 'it-IT' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const recruiterRsvps = event.rsvps.filter((r) => r.role === 'RECRUITER')
  const studentRsvps = event.rsvps.filter((r) => r.role === 'STUDENT')
  const checkedInCount = event.rsvps.filter((r) => r.status === 'CONFIRMED').length

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/university/events">
          <ArrowLeft className="h-4 w-4 mr-1" /> {isIt ? 'Tutti gli eventi' : 'All events'}
        </Link>
      </Button>

      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-semibold">{event.title}</h1>
          <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {startLabel}
          </span>
          {event.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {event.location}
            </span>
          )}
          {event.isOnline && (
            <span className="flex items-center gap-1.5">
              <Video className="h-4 w-4" />
              Online
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {event.rsvps.length} RSVP · {checkedInCount} {isIt ? 'confermati' : 'confirmed'}
          </span>
        </div>
        {event.description && <p className="text-sm text-foreground/80 max-w-3xl">{event.description}</p>}
      </div>

      <div className="flex gap-2 flex-wrap">
        {event.status === 'DRAFT' && (
          <Button onClick={() => setStatus('PUBLISHED')} disabled={updating}>
            {isIt ? 'Pubblica evento' : 'Publish event'}
          </Button>
        )}
        {event.status === 'PUBLISHED' && (
          <>
            <Button variant="outline" onClick={() => setStatus('DRAFT')} disabled={updating}>
              {isIt ? 'Riporta in bozza' : 'Move to draft'}
            </Button>
            <Button variant="outline" onClick={() => setStatus('COMPLETED')} disabled={updating}>
              {isIt ? 'Segna come completato' : 'Mark completed'}
            </Button>
            <Button variant="outline" onClick={() => setStatus('CANCELLED')} disabled={updating}>
              {isIt ? 'Annulla evento' : 'Cancel event'}
            </Button>
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{isIt ? 'Invita aziende e studenti' : 'Invite companies and students'}</CardTitle>
          <CardDescription>
            {isIt
              ? "Inserisci una o più email separate da virgola, spazio o nuova riga. Invieremo l'invito e creeremo un RSVP in attesa per chi è già registrato."
              : 'Enter one or more emails separated by commas, spaces, or new lines. We send the invite and create a pending RSVP for anyone already on the platform.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={inviteEmails}
            onChange={(e) => setInviteEmails(e.target.value)}
            placeholder="recruiter1@azienda.it, hr@altraazienda.com, …"
            rows={3}
          />
          <Textarea
            value={inviteNote}
            onChange={(e) => setInviteNote(e.target.value)}
            placeholder={isIt ? 'Nota personale (opzionale)' : 'Personal note (optional)'}
            rows={2}
          />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{isIt ? 'Lingua email:' : 'Email language:'}</span>
            <button
              type="button"
              onClick={() => setInviteLocale('it')}
              className={`px-2 py-0.5 rounded ${inviteLocale === 'it' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Italiano
            </button>
            <button
              type="button"
              onClick={() => setInviteLocale('en')}
              className={`px-2 py-0.5 rounded ${inviteLocale === 'en' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              English
            </button>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={sendInvites} disabled={inviting}>
              {inviting ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{isIt ? 'Invio…' : 'Sending…'}</>
              ) : (
                <><Send className="h-4 w-4 mr-2" />{isIt ? 'Invia inviti' : 'Send invites'}</>
              )}
            </Button>
            {inviteResult && <span className="text-sm text-muted-foreground">{inviteResult}</span>}
          </div>
        </CardContent>
      </Card>

      <RsvpTable
        title={isIt ? 'Aziende / Recruiter' : 'Companies / Recruiters'}
        rsvps={recruiterRsvps}
        onSetStatus={setRsvpStatus}
        isIt={isIt}
        emptyMessage={isIt ? 'Nessuna azienda invitata.' : 'No companies invited yet.'}
      />

      <RsvpTable
        title={isIt ? 'Studenti' : 'Students'}
        rsvps={studentRsvps}
        onSetStatus={setRsvpStatus}
        isIt={isIt}
        emptyMessage={isIt ? 'Nessuno studente registrato.' : 'No students registered yet.'}
      />
    </div>
  )
}

function RsvpTable({
  title,
  rsvps,
  onSetStatus,
  isIt,
  emptyMessage,
}: {
  title: string
  rsvps: RSVP[]
  onSetStatus: (rsvpId: string, status: string) => void
  isIt: boolean
  emptyMessage: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {title} ({rsvps.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {rsvps.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">{emptyMessage}</p>
        ) : (
          <div className="space-y-2">
            {rsvps.map((r) => {
              const name = [r.user.firstName, r.user.lastName].filter(Boolean).join(' ') || r.user.email
              const company = r.companyName ?? r.user.company ?? ''
              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-3 border rounded-md px-3 py-2 text-sm flex-wrap"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{name}</span>
                      <RsvpStatusBadge status={r.status} />
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {r.user.email}
                      {company && <> · {company}</>}
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {r.status !== 'CONFIRMED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSetStatus(r.id, 'CONFIRMED')}
                        title={isIt ? 'Conferma / Check-in' : 'Confirm / Check in'}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {r.status !== 'DECLINED' && r.status !== 'CANCELLED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSetStatus(r.id, 'DECLINED')}
                        title={isIt ? 'Segna come rifiutato' : 'Mark declined'}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {r.status !== 'PENDING' && r.status !== 'CONFIRMED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSetStatus(r.id, 'PENDING')}
                        title={isIt ? 'Riporta in attesa' : 'Reset to pending'}
                      >
                        <Clock className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function RsvpStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700',
    CONFIRMED: 'bg-emerald-100 text-emerald-700',
    DECLINED: 'bg-rose-100 text-rose-700',
    WAITLISTED: 'bg-sky-100 text-sky-700',
    CANCELLED: 'bg-slate-200 text-slate-600',
  }
  return (
    <Badge variant="secondary" className={`text-[10px] font-normal ${colors[status] ?? ''}`}>
      {RSVP_STATUS_LABEL[status] ?? status}
    </Badge>
  )
}
