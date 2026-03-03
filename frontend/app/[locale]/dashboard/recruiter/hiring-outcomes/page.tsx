'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2,
  Clock,
  XCircle,
  MessageCircle,
  TrendingUp,
  Users,
  UserCheck,
  AlertCircle,
  ChevronDown,
  Loader2,
} from 'lucide-react'

interface Recipient {
  id: string
  firstName: string | null
  lastName: string | null
  photo: string | null
  university: string | null
  degree: string | null
}

interface Contact {
  id: string
  recipient: Recipient
  firstContactAt: string
  outcome: string | null
  outcomeNote: string | null
  outcomeAt: string | null
  hiringPosition: string | null
  responseTimeHours: number | null
}

interface Stats {
  total: number
  withOutcome: number
  hired: number
  interviewed: number
  noResponse: number
  pendingFeedback: number
  hireRate: number
  responseRate: number
}

const OUTCOMES = [
  { value: 'hired', label: 'Hired', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  { value: 'interviewed', label: 'Interviewed', color: 'bg-blue-100 text-blue-700', icon: MessageCircle },
  { value: 'no_response', label: 'No Response', color: 'bg-gray-100 text-gray-600', icon: Clock },
  { value: 'rejected', label: 'Not a Fit', color: 'bg-red-100 text-red-700', icon: XCircle },
  { value: 'withdrawn', label: 'Withdrawn', color: 'bg-amber-100 text-amber-700', icon: AlertCircle },
] as const

export default function HiringOutcomesPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/dashboard/recruiter/hiring-outcomes')
      if (res.ok) {
        const data = await res.json()
        setContacts(data.contacts)
        setStats(data.stats)
      }
    } catch (err) {
      console.error('Failed to fetch hiring outcomes:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateOutcome = async (contactId: string, outcome: string, extras?: { outcomeNote?: string; hiringPosition?: string }) => {
    setUpdating(contactId)
    try {
      const res = await fetch('/api/dashboard/recruiter/hiring-outcomes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId, outcome, ...extras }),
      })
      if (res.ok) {
        await fetchData()
        setExpandedId(null)
      }
    } catch (err) {
      console.error('Failed to update outcome:', err)
    } finally {
      setUpdating(null)
    }
  }

  const filteredContacts = contacts.filter((c) => {
    if (filter === 'all') return true
    if (filter === 'pending') return !c.outcome
    return c.outcome === filter
  })

  const getOutcomeConfig = (outcome: string | null) => {
    return OUTCOMES.find((o) => o.value === outcome) || null
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded" />
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto pb-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Hiring Outcomes</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track what happened after you contacted students. This data helps improve matching.
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-gray-500">Total Contacts</span>
              </div>
              <p className="text-2xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <UserCheck className="h-4 w-4 text-green-500" />
                <span className="text-xs text-gray-500">Hired</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.hired}</p>
              <p className="text-xs text-gray-400">{stats.hireRate}% rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-gray-500">Response Rate</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{stats.responseRate}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span className="text-xs text-gray-500">Needs Feedback</span>
              </div>
              <p className="text-2xl font-bold text-amber-600">{stats.pendingFeedback}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {[
          { value: 'all', label: 'All' },
          { value: 'pending', label: 'Needs feedback' },
          ...OUTCOMES.map((o) => ({ value: o.value, label: o.label })),
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              filter === f.value
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
            {f.value === 'pending' && stats ? ` (${stats.pendingFeedback})` : ''}
          </button>
        ))}
      </div>

      {/* Contact list */}
      {filteredContacts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            <Users className="h-10 w-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No contacts found</p>
            <p className="text-sm mt-1">
              {filter === 'all'
                ? 'Start by contacting students through search.'
                : 'No contacts match this filter.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredContacts.map((contact) => {
            const config = getOutcomeConfig(contact.outcome)
            const isExpanded = expandedId === contact.id
            const name = [contact.recipient.firstName, contact.recipient.lastName]
              .filter(Boolean)
              .join(' ') || 'Unknown'
            const initials = (contact.recipient.firstName?.[0] || '') + (contact.recipient.lastName?.[0] || '')

            return (
              <Card key={contact.id} className={!contact.outcome ? 'border-amber-200' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    {contact.recipient.photo ? (
                      <img
                        src={contact.recipient.photo}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm flex-shrink-0">
                        {initials}
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {[contact.recipient.university, contact.recipient.degree]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    </div>

                    {/* Outcome badge or action */}
                    {contact.outcome && config ? (
                      <Badge className={`${config.color} text-xs`}>
                        <config.icon className="h-3 w-3 mr-1" />
                        {config.label}
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setExpandedId(isExpanded ? null : contact.id)}
                        className="text-amber-600 border-amber-200 hover:bg-amber-50"
                      >
                        Log outcome
                        <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </Button>
                    )}

                    {/* Date */}
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {new Date(contact.firstContactAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Outcome details */}
                  {contact.outcome && contact.outcomeNote && (
                    <p className="text-xs text-gray-500 mt-2 ml-13 pl-13">
                      {contact.outcomeNote}
                    </p>
                  )}

                  {/* Expanded outcome form */}
                  {isExpanded && !contact.outcome && (
                    <OutcomeForm
                      contactId={contact.id}
                      updating={updating === contact.id}
                      onSubmit={updateOutcome}
                      onCancel={() => setExpandedId(null)}
                    />
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

function OutcomeForm({
  contactId,
  updating,
  onSubmit,
  onCancel,
}: {
  contactId: string
  updating: boolean
  onSubmit: (id: string, outcome: string, extras?: { outcomeNote?: string; hiringPosition?: string }) => void
  onCancel: () => void
}) {
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [position, setPosition] = useState('')

  return (
    <div className="mt-3 pt-3 border-t space-y-3">
      <p className="text-sm font-medium text-gray-700">What happened?</p>
      <div className="flex flex-wrap gap-2">
        {OUTCOMES.map((o) => (
          <button
            key={o.value}
            onClick={() => setSelectedOutcome(o.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${
              selectedOutcome === o.value
                ? o.color + ' ring-2 ring-offset-1 ring-gray-300'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <o.icon className="h-3.5 w-3.5" />
            {o.label}
          </button>
        ))}
      </div>

      {selectedOutcome && (
        <>
          {(selectedOutcome === 'hired' || selectedOutcome === 'interviewed') && (
            <input
              type="text"
              placeholder="Position / role (optional)"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border rounded-md"
            />
          )}
          <textarea
            placeholder="Any notes? (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border rounded-md resize-none"
            rows={2}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() =>
                onSubmit(contactId, selectedOutcome, {
                  outcomeNote: note || undefined,
                  hiringPosition: position || undefined,
                })
              }
              disabled={updating}
            >
              {updating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : null}
              Save outcome
            </Button>
            <Button size="sm" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
