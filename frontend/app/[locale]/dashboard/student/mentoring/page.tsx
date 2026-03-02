'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import {
  Users,
  UserPlus,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  GraduationCap,
  Star,
} from 'lucide-react'

interface Person {
  id: string
  firstName: string | null
  lastName: string | null
  photo: string | null
  university: string | null
  degree: string | null
  graduationYear: number | null
}

interface Mentorship {
  id: string
  role: 'mentor' | 'mentee'
  partner: Person
  status: string
  topics: string[]
  message: string | null
  startedAt: string | null
  createdAt: string
}

interface AvailableMentor extends Person {
  _count: { mentorshipsAsMentor: number }
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  ACTIVE: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  DECLINED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
}

export default function MentoringPage() {
  const [mentorships, setMentorships] = useState<Mentorship[]>([])
  const [availableMentors, setAvailableMentors] = useState<AvailableMentor[]>([])
  const [loading, setLoading] = useState(true)
  const [requestingId, setRequestingId] = useState<string | null>(null)
  const [requestMessage, setRequestMessage] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const res = await fetch('/api/dashboard/student/mentoring')
      if (res.ok) {
        const data = await res.json()
        setMentorships(data.mentorships || [])
        setAvailableMentors(data.availableMentors || [])
      }
    } catch (error) {
      console.error('Failed to fetch mentoring data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const requestMentor = async (mentorId: string) => {
    setActionLoading(mentorId)
    try {
      const res = await fetch('/api/dashboard/student/mentoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mentorId, message: requestMessage }),
      })
      if (res.ok) {
        setRequestingId(null)
        setRequestMessage('')
        await fetchData()
      }
    } catch {
      // ignore
    } finally {
      setActionLoading(null)
    }
  }

  const handleAction = async (connectionId: string, action: string) => {
    setActionLoading(connectionId)
    try {
      const res = await fetch('/api/dashboard/student/mentoring', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionId, action }),
      })
      if (res.ok) await fetchData()
    } catch {
      // ignore
    } finally {
      setActionLoading(null)
    }
  }

  const getInitials = (p: Person) =>
    `${p.firstName?.[0] || ''}${p.lastName?.[0] || ''}`

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Users className="h-10 w-10 mx-auto text-blue-300 animate-pulse mb-4" />
          <p className="text-gray-500">Loading mentoring...</p>
        </div>
      </div>
    )
  }

  const activeMentorships = mentorships.filter((m) => m.status === 'ACTIVE')
  const pendingMentorships = mentorships.filter((m) => m.status === 'PENDING')
  const pastMentorships = mentorships.filter((m) =>
    ['COMPLETED', 'DECLINED', 'CANCELLED'].includes(m.status)
  )

  // Filter out mentors already connected with
  const connectedIds = new Set(mentorships.map((m) => m.partner.id))
  const filteredMentors = availableMentors.filter((m) => !connectedIds.has(m.id))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mentoring</h1>
        <p className="text-gray-600 mt-1">
          Connect with senior students and alumni at your institution
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{activeMentorships.length}</p>
                <p className="text-sm text-gray-600">Active mentorships</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{pendingMentorships.length}</p>
                <p className="text-sm text-gray-600">Pending requests</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{filteredMentors.length}</p>
                <p className="text-sm text-gray-600">Available mentors</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserPlus className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests (action needed) */}
      {pendingMentorships.length > 0 && (
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingMentorships.map((m) => (
              <div key={m.id} className="flex items-center gap-4 p-4 rounded-lg border">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={m.partner.photo || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-sm">
                    {getInitials(m.partner)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{m.partner.firstName} {m.partner.lastName}</p>
                  <p className="text-sm text-gray-500">
                    {m.role === 'mentor' ? 'Wants you as mentor' : 'Request sent'}
                    {m.message && ` — "${m.message}"`}
                  </p>
                </div>
                {m.role === 'mentor' ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAction(m.id, 'accept')}
                      disabled={actionLoading === m.id}
                    >
                      <CheckCircle className="mr-1 h-3 w-3" /> Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(m.id, 'decline')}
                      disabled={actionLoading === m.id}
                    >
                      <XCircle className="mr-1 h-3 w-3" /> Decline
                    </Button>
                  </div>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Active Mentorships */}
      {activeMentorships.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Active Mentorships
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeMentorships.map((m) => (
              <div key={m.id} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={m.partner.photo || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-green-400 to-emerald-500 text-white text-sm">
                    {getInitials(m.partner)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{m.partner.firstName} {m.partner.lastName}</p>
                    <Badge variant="secondary" className="text-xs">
                      {m.role === 'mentor' ? 'You mentor' : 'Your mentor'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {m.partner.degree} · {m.partner.university}
                  </p>
                  {m.topics.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {m.topics.map((t) => (
                        <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <MessageSquare className="mr-1 h-3 w-3" /> Message
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAction(m.id, 'complete')}
                    disabled={actionLoading === m.id}
                  >
                    Complete
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Find a Mentor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            Find a Mentor
          </CardTitle>
          <CardDescription>
            Senior students and alumni from your institution available for mentoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredMentors.length > 0 ? (
            <div className="space-y-3">
              {filteredMentors.map((mentor) => (
                <div key={mentor.id} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={mentor.photo || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white text-sm">
                      {getInitials(mentor)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{mentor.firstName} {mentor.lastName}</p>
                    <p className="text-sm text-gray-500">
                      {mentor.degree}
                      {mentor.graduationYear && ` · Class of ${mentor.graduationYear}`}
                    </p>
                    {mentor._count.mentorshipsAsMentor > 0 && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs text-gray-500">
                          {mentor._count.mentorshipsAsMentor} mentee{mentor._count.mentorshipsAsMentor !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                  {requestingId === mentor.id ? (
                    <div className="flex flex-col gap-2 w-64">
                      <Textarea
                        placeholder="Introduce yourself and what you'd like help with..."
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                        rows={2}
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => requestMentor(mentor.id)}
                          disabled={actionLoading === mentor.id}
                        >
                          Send Request
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => { setRequestingId(null); setRequestMessage('') }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setRequestingId(mentor.id)}
                    >
                      <UserPlus className="mr-1 h-3 w-3" /> Request Mentor
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-600">No mentors available at your institution yet.</p>
              <p className="text-sm text-gray-500 mt-1">Check back later as more senior students join.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Mentorships */}
      {pastMentorships.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-500">Past Mentorships</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pastMentorships.map((m) => (
              <div key={m.id} className="flex items-center gap-4 p-3 rounded-lg opacity-60">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-200 text-gray-500 text-xs">
                    {getInitials(m.partner)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{m.partner.firstName} {m.partner.lastName}</p>
                </div>
                <Badge className={statusColors[m.status] || 'bg-gray-100 text-gray-600'}>
                  {m.status.toLowerCase()}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
