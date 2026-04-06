'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  Clock,
  Video,
  Building2,
  ChevronRight,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { useTranslations } from 'next-intl'

interface EventData {
  id: string
  title: string
  description: string | null
  eventType: string
  location: string | null
  isOnline: boolean
  startDate: string
  endDate: string
  status: string
  maxAttendees: number | null
  maxRecruiters: number | null
  rsvpCount: number
  slotCount: number
  createdAt: string
}

const statusConfig: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Draft', color: 'bg-muted text-muted-foreground' },
  PUBLISHED: { label: 'Published', color: 'bg-primary/10 text-primary' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
  COMPLETED: { label: 'Completed', color: 'bg-primary/10 text-primary' },
}

const eventTypeLabels: Record<string, string> = {
  CAREER_DAY: 'Career Day',
  WORKSHOP: 'Workshop',
  WEBINAR: 'Webinar',
  NETWORKING: 'Networking',
  INFO_SESSION: 'Info Session',
}

export default function EventsPage() {
  const t = useTranslations('universityDashboard.events')
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [eventType, setEventType] = useState('CAREER_DAY')
  const [location, setLocation] = useState('')
  const [isOnline, setIsOnline] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [maxAttendees, setMaxAttendees] = useState('')

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/dashboard/university/events')
      if (res.ok) {
        const data = await res.json()
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEvents() }, [])

  const handleCreate = async () => {
    if (!title || !startDate || !endDate) return
    setCreating(true)
    try {
      const res = await fetch('/api/dashboard/university/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || undefined,
          eventType,
          location: location || undefined,
          isOnline,
          startDate,
          endDate,
          maxAttendees: maxAttendees ? parseInt(maxAttendees) : undefined,
        }),
      })
      if (res.ok) {
        setShowCreate(false)
        setTitle('')
        setDescription('')
        setLocation('')
        setStartDate('')
        setEndDate('')
        setMaxAttendees('')
        await fetchEvents()
      }
    } catch (err) {
      console.error('Failed to create event:', err)
      alert('Failed to create event. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  const upcomingEvents = events.filter(
    (e) => e.status !== 'COMPLETED' && e.status !== 'CANCELLED' && new Date(e.startDate) >= new Date()
  )
  const pastEvents = events.filter(
    (e) => e.status === 'COMPLETED' || new Date(e.endDate) < new Date()
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Calendar className="h-10 w-10 mx-auto text-blue-300 animate-pulse mb-4" />
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <MetricHero gradient="primary">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Career Events</h1>
            <p className="text-muted-foreground mt-1">
              Organize career days, workshops, and networking events
            </p>
          </div>
          <Button onClick={() => setShowCreate(!showCreate)}>
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Button>
        </div>
      </MetricHero>

      {/* Create Event Form */}
      {showCreate && (
        <GlassCard delay={0.1}>
          <div className="p-5">
            <h3 className="text-lg font-semibold mb-4">Create New Event</h3>
            <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground/80 mb-1 block">Event Title *</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Spring Career Day 2026" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground/80 mb-1 block">Description</label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Event details..." rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground/80 mb-1 block">Event Type</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  {Object.entries(eventTypeLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground/80 mb-1 block">Max Attendees</label>
                <Input type="number" value={maxAttendees} onChange={(e) => setMaxAttendees(e.target.value)} placeholder="No limit" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground/80 mb-1 block">Start Date/Time *</label>
                <Input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground/80 mb-1 block">End Date/Time *</label>
                <Input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isOnline} onChange={(e) => setIsOnline(e.target.checked)} className="rounded" />
                <span className="text-sm font-medium text-foreground/80">Online event</span>
              </label>
            </div>
            {!isOnline && (
              <div>
                <label className="text-sm font-medium text-foreground/80 mb-1 block">Location</label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Aula Magna, Building A" />
              </div>
            )}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={creating || !title || !startDate || !endDate}>
                  {creating ? 'Creating...' : 'Create Event'}
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Upcoming Events */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Upcoming Events ({upcomingEvents.length})
        </h2>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-3">
            {upcomingEvents.map((event) => {
              const status = statusConfig[event.status] || statusConfig.DRAFT
              return (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/5 rounded-lg">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{event.title}</h3>
                            <Badge className={status.color}>{status.label}</Badge>
                            <Badge variant="outline" className="text-xs">
                              {eventTypeLabels[event.eventType] || event.eventType}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {new Date(event.startDate).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {event.location}
                              </span>
                            )}
                            {event.isOnline && (
                              <span className="flex items-center gap-1">
                                <Video className="h-3.5 w-3.5" />
                                Online
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {event.rsvpCount} RSVPs
                            </span>
                            <span>{event.slotCount} time slots</span>
                            {event.maxAttendees && (
                              <span>Max {event.maxAttendees} attendees</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground/60 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <GlassCard delay={0.1}>
            <div className="py-8 text-center">
              <Calendar className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground">No upcoming events.</p>
              <p className="text-sm text-muted-foreground">Create your first career event to get started.</p>
            </div>
          </GlassCard>
        )}
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-muted-foreground mb-3">
            Past Events ({pastEvents.length})
          </h2>
          <div className="space-y-2">
            {pastEvents.map((event) => (
              <Card key={event.id} className="opacity-60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground/60" />
                      <span className="font-medium text-sm">{event.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{event.rsvpCount} attended</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
