'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Calendar, MapPin, Users, Clock, Plus } from 'lucide-react'

interface ParkEvent {
  id: string
  title: string
  type: 'career-day' | 'networking' | 'workshop' | 'hackathon'
  date: string
  time: string
  location: string
  attendees: number
  maxAttendees: number
  status: 'upcoming' | 'ongoing' | 'completed'
}

const MOCK_EVENTS: ParkEvent[] = [
  { id: '1', title: 'Spring Career Day 2026', type: 'career-day', date: '2026-04-15', time: '09:00 - 17:00', location: 'Main Hall', attendees: 120, maxAttendees: 200, status: 'upcoming' },
  { id: '2', title: 'AI & Data Networking Mixer', type: 'networking', date: '2026-04-08', time: '18:00 - 20:30', location: 'Innovation Lab', attendees: 45, maxAttendees: 60, status: 'upcoming' },
  { id: '3', title: 'Cloud Architecture Workshop', type: 'workshop', date: '2026-04-22', time: '14:00 - 17:00', location: 'Room B2', attendees: 18, maxAttendees: 30, status: 'upcoming' },
  { id: '4', title: 'Green Tech Hackathon', type: 'hackathon', date: '2026-05-10', time: '09:00 - 21:00', location: 'Co-working Space', attendees: 0, maxAttendees: 80, status: 'upcoming' },
  { id: '5', title: 'Winter Networking Event', type: 'networking', date: '2026-02-20', time: '18:00 - 20:00', location: 'Main Hall', attendees: 55, maxAttendees: 60, status: 'completed' },
  { id: '6', title: 'Startup Pitch Night', type: 'networking', date: '2026-03-12', time: '19:00 - 21:00', location: 'Auditorium', attendees: 90, maxAttendees: 100, status: 'completed' },
]

const typeLabels: Record<string, string> = {
  'career-day': 'Career Day',
  networking: 'Networking',
  workshop: 'Workshop',
  hackathon: 'Hackathon',
}

export default function TechParkEventsPage() {
  const [events, setEvents] = useState<ParkEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/dashboard/techpark/events')
        if (res.ok) {
          const data = await res.json()
          setEvents(data.events ?? [])
        } else {
          setEvents(MOCK_EVENTS)
        }
      } catch {
        setEvents(MOCK_EVENTS)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    typeLabels[e.type]?.toLowerCase().includes(search.toLowerCase())
  )

  const upcoming = filtered.filter(e => e.status === 'upcoming')
  const past = filtered.filter(e => e.status === 'completed')

  const renderEvent = (event: ParkEvent) => (
    <Card key={event.id} className="hover:shadow-md transition-shadow">
      <CardContent className="py-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{event.title}</h3>
              <Badge variant="secondary">{typeLabels[event.type]}</Badge>
              {event.status === 'completed' && <Badge variant="outline">Completed</Badge>}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(event.date).toLocaleDateString()}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {event.time}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {event.location}</span>
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {event.attendees}/{event.maxAttendees}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/techpark">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Events</h1>
            <p className="text-sm text-muted-foreground">Manage career days, networking events, and workshops</p>
          </div>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" /> New Event
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="py-4"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-medium">Upcoming Events</h2>
              {upcoming.map(renderEvent)}
            </div>
          )}
          {past.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-medium text-muted-foreground">Past Events</h2>
              {past.map(renderEvent)}
            </div>
          )}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No events found</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
