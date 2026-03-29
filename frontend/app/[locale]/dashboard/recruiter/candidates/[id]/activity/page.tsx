'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Link } from '@/navigation'
import { Loader2, ArrowLeft } from 'lucide-react'

type ActivityType =
  | 'viewed'
  | 'saved'
  | 'message'
  | 'stageChange'
  | 'note'
  | 'decisionPack'
  | 'contacted'
  | 'interview'

interface ActivityEntry {
  id: string
  type: ActivityType
  timestamp: string
  preview?: string
  oldStage?: string
  newStage?: string
  noteText?: string
  decisionPackId?: string
}

const typeColors: Record<ActivityType, string> = {
  viewed: 'bg-slate-100 text-slate-700',
  saved: 'bg-blue-100 text-blue-700',
  message: 'bg-purple-100 text-purple-700',
  stageChange: 'bg-amber-100 text-amber-700',
  note: 'bg-green-100 text-green-700',
  decisionPack: 'bg-indigo-100 text-indigo-700',
  contacted: 'bg-cyan-100 text-cyan-700',
  interview: 'bg-rose-100 text-rose-700',
}

export default function CandidateActivityPage() {
  const t = useTranslations('candidateActivity')
  const params = useParams()
  const candidateId = params.id as string

  const [activities, setActivities] = useState<ActivityEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchActivity = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/dashboard/recruiter/candidates/${candidateId}/activity`)
      if (res.status === 404) {
        setActivities([])
        return
      }
      if (!res.ok) {
        throw new Error('Failed to fetch activity')
      }
      const data = await res.json()
      setActivities(data.activities || [])
    } catch {
      setError('Failed to load activity')
    } finally {
      setLoading(false)
    }
  }, [candidateId])

  useEffect(() => {
    fetchActivity()
  }, [fetchActivity])

  const handleAddNote = async () => {
    if (!noteText.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/dashboard/recruiter/candidates/${candidateId}/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'note', noteText: noteText.trim() }),
      })
      if (res.ok) {
        const newEntry: ActivityEntry = {
          id: Date.now().toString(),
          type: 'note',
          timestamp: new Date().toISOString(),
          noteText: noteText.trim(),
        }
        setActivities((prev) => [newEntry, ...prev])
        setNoteText('')
      }
    } catch {
      // Silently fail — user can retry
    } finally {
      setSubmitting(false)
    }
  }

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts)
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getDescription = (entry: ActivityEntry): string => {
    switch (entry.type) {
      case 'stageChange':
        return t('types.stageChange', { stage: entry.newStage || '' })
      case 'message':
        return t('types.message')
      default:
        return t(`types.${entry.type}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/recruiter/candidates/${candidateId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back')}
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('addNote')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Textarea
              placeholder={t('notePlaceholder')}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="flex-1"
              rows={2}
            />
            <Button onClick={handleAddNote} disabled={submitting || !noteText.trim()}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : t('submit')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">{t('loading')}</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : activities.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="font-medium">{t('empty')}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t('emptyDesc')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="relative ml-4 border-l-2 border-muted pl-6 space-y-6">
          {activities.map((entry) => (
            <div key={entry.id} className="relative">
              <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-background bg-muted-foreground" />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Badge className={typeColors[entry.type]} variant="secondary">
                    {getDescription(entry)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(entry.timestamp)}
                  </span>
                </div>
                {entry.type === 'message' && entry.preview && (
                  <p className="text-sm text-muted-foreground italic">&ldquo;{entry.preview}&rdquo;</p>
                )}
                {entry.type === 'stageChange' && entry.oldStage && (
                  <p className="text-sm text-muted-foreground">
                    {entry.oldStage} &rarr; {entry.newStage}
                  </p>
                )}
                {entry.type === 'note' && entry.noteText && (
                  <p className="text-sm text-muted-foreground">{entry.noteText}</p>
                )}
                {entry.type === 'decisionPack' && entry.decisionPackId && (
                  <Link
                    href={`/dashboard/recruiter/decision-pack/${entry.decisionPackId}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View Decision Pack
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
