'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
  Briefcase,
  PartyPopper,
} from 'lucide-react'

interface HiringConfirmation {
  id: string
  companyName: string
  contactDate: string
  status: string
  promptSentAt: string | null
}

export function HiringConfirmationBanner() {
  const t = useTranslations('dashboard.student.hiringConfirmation')
  const [confirmations, setConfirmations] = useState<HiringConfirmation[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState<string | null>(null)
  const [jobTitle, setJobTitle] = useState('')
  const [startDate, setStartDate] = useState('')
  const [feedback, setFeedback] = useState('')
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  // Track hires just-confirmed (this session) to show the celebration + follow-up nudges
  const [justHired, setJustHired] = useState<Array<{ id: string; companyName: string; jobTitle: string | null }>>([])

  useEffect(() => {
    const fetchConfirmations = async () => {
      try {
        const res = await fetch('/api/hiring-confirmation')
        if (res.ok) {
          const data = await res.json()
          setConfirmations(data.confirmations || [])
        }
      } catch (err) {
        console.error('Failed to fetch hiring confirmations:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchConfirmations()
  }, [])

  const handleRespond = async (confirmationId: string, confirmedHired: boolean) => {
    setSubmitting(confirmationId)
    try {
      const res = await fetch('/api/hiring-confirmation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmationId,
          confirmedHired,
          jobTitle: confirmedHired ? jobTitle : undefined,
          startDate: confirmedHired && startDate ? startDate : undefined,
          feedback: feedback || undefined,
        }),
      })

      if (res.ok) {
        const newCompleted = new Set(completed)
        newCompleted.add(confirmationId)
        setCompleted(newCompleted)
        if (confirmedHired) {
          const conf = confirmations.find(c => c.id === confirmationId)
          if (conf) {
            setJustHired(prev => [
              ...prev,
              { id: confirmationId, companyName: conf.companyName, jobTitle: jobTitle || null },
            ])
          }
        }
        setExpandedId(null)
        setJobTitle('')
        setStartDate('')
        setFeedback('')
      }
    } catch (err) {
      console.error('Failed to respond to hiring confirmation:', err)
    } finally {
      setSubmitting(null)
    }
  }

  if (loading) {
    return null
  }

  const pending = confirmations.filter((c) => !completed.has(c.id))

  if (pending.length === 0 && justHired.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {justHired.map(h => (
        <Card key={h.id} className="border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                <PartyPopper className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">
                  Congratulations on the hire{h.jobTitle ? ` — ${h.jobTitle}` : ''} at {h.companyName}!
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  A few quick steps to make this placement count fully:
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href="/dashboard/student/credentials">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Issue stage-completion credential
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href="/dashboard/student/projects">
                      <Briefcase className="h-3 w-3 mr-1" />
                      Thank your professor
                    </a>
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setJustHired(prev => prev.filter(x => x.id !== h.id))}>
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {pending.map((confirmation) => {
        const isExpanded = expandedId === confirmation.id
        const isSubmitting = submitting === confirmation.id
        const contactDate = new Date(confirmation.contactDate)

        return (
          <Card key={confirmation.id} className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm">
                      {t('title')}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {confirmation.companyName}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mt-1">
                    {t('description', { company: confirmation.companyName })}
                  </p>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {t('contactedOn', {
                        date: contactDate.toLocaleDateString(),
                      })}
                    </span>
                  </div>

                  {!isExpanded && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => setExpandedId(confirmation.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        {t('yesHired')}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRespond(confirmation.id, false)}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-1" />
                        )}
                        {t('notHired')}
                      </Button>
                    </div>
                  )}

                  {isExpanded && (
                    <div className="mt-3 space-y-3 rounded-lg border bg-white dark:bg-gray-900 p-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
                        <PartyPopper className="h-4 w-4" />
                        {t('congratulations')}
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">
                          <Briefcase className="h-3 w-3 inline mr-1" />
                          {t('jobTitleLabel')}
                        </label>
                        <input
                          type="text"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          placeholder={t('jobTitlePlaceholder')}
                          className="w-full rounded-md border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {t('startDateLabel')}
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full rounded-md border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleRespond(confirmation.id, true)}
                          disabled={isSubmitting}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {isSubmitting ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                          )}
                          {t('confirm')}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setExpandedId(null)
                            setJobTitle('')
                            setStartDate('')
                          }}
                          disabled={isSubmitting}
                        >
                          {t('cancel')}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
