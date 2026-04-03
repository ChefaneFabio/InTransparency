'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'

interface Interview {
  id: string
  candidateName: string
  date: string
  time: string
  status: string
}

type TimeSlot = 'morning' | 'afternoon' | 'evening'
type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri'

const WEEKDAYS: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri']
const TIME_SLOTS: TimeSlot[] = ['morning', 'afternoon', 'evening']

export default function SchedulingPage() {
  const t = useTranslations('recruiterScheduling')
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [availability, setAvailability] = useState<Record<string, boolean>>({})

  const getKey = (day: Weekday, slot: TimeSlot) => `${day}-${slot}`

  const toggleSlot = useCallback((day: Weekday, slot: TimeSlot) => {
    const key = getKey(day, slot)
    setAvailability((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  useEffect(() => {
    const fetchScheduling = async () => {
      try {
        const res = await fetch('/api/dashboard/recruiter/scheduling')
        if (res.ok) {
          const data = await res.json()
          setInterviews(data.interviews || [])
          // Load saved availability slots
          if (data.availability) {
            const slots: Record<string, boolean> = {}
            const days = Object.keys(data.availability)
            for (let d = 0; d < days.length; d++) {
              const day = days[d]
              const times = Object.keys(data.availability[day])
              for (let t = 0; t < times.length; t++) {
                if (data.availability[day][times[t]]) {
                  slots[`${day}-${times[t]}`] = true
                }
              }
            }
            setAvailability(slots)
          }
        }
      } catch (err) {
        console.error('Failed to load scheduling:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchScheduling()
  }, [])

  // Auto-save availability when it changes
  const saveAvailability = useCallback(async () => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const
    const slots = ['morning', 'afternoon', 'evening'] as const
    const grid: Record<string, Record<string, boolean>> = {}
    for (let d = 0; d < days.length; d++) {
      grid[days[d]] = {}
      for (let s = 0; s < slots.length; s++) {
        grid[days[d]][slots[s]] = !!availability[`${days[d]}-${slots[s]}`]
      }
    }
    await fetch('/api/dashboard/recruiter/scheduling', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ availability: grid }),
    }).catch(() => {})
  }, [availability])

  useEffect(() => {
    if (!loading) saveAvailability()
  }, [availability, loading, saveAvailability])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/60" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto pb-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">{t('title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('subtitle')}</p>
      </div>

      {/* Section 1: Availability Grid */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">{t('availability.title')}</CardTitle>
          <p className="text-sm text-muted-foreground">{t('availability.description')}</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-xs text-muted-foreground font-medium pb-3 pr-4" />
                  {WEEKDAYS.map((day) => (
                    <th
                      key={day}
                      className="text-center text-xs text-muted-foreground font-medium pb-3 px-2"
                    >
                      {t(`availability.${day}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((slot) => (
                  <tr key={slot}>
                    <td className="text-sm text-muted-foreground py-2 pr-4 whitespace-nowrap">
                      {t(`availability.${slot}`)}
                    </td>
                    {WEEKDAYS.map((day) => {
                      const key = getKey(day, slot)
                      const isActive = availability[key] || false
                      return (
                        <td key={day} className="text-center py-2 px-2">
                          <button
                            onClick={() => toggleSlot(day, slot)}
                            className={`w-full h-10 rounded-md text-sm font-medium transition-colors ${
                              isActive
                                ? 'bg-primary text-white'
                                : 'bg-muted text-muted-foreground/60 hover:bg-muted'
                            }`}
                          >
                            {isActive ? '\u2713' : '\u2014'}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Upcoming Interviews */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">{t('upcoming.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {interviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm font-medium text-muted-foreground">{t('upcoming.empty')}</p>
              <p className="text-xs text-muted-foreground/60 mt-1">{t('upcoming.emptyDesc')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {interviews.map((interview) => (
                <div
                  key={interview.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {interview.candidateName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {interview.date} at {interview.time}
                    </p>
                  </div>
                  <Badge variant="secondary">{interview.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 3: Coming Soon */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base text-muted-foreground">
            {t('comingSoon.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-muted-foreground/40 mt-0.5">&#x2022;</span>
                {t(`comingSoon.items.${i}`)}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
