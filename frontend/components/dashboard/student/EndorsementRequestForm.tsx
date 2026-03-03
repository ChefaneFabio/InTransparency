'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Award,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react'

interface Endorsement {
  id: string
  professorName: string
  professorEmail: string
  status: string
  createdAt: string
}

interface EndorsementRequestFormProps {
  projectId: string
  projectTitle: string
  courseName?: string | null
  professor?: string | null
  university?: string | null
  existingEndorsements?: Endorsement[]
}

export default function EndorsementRequestForm({
  projectId,
  projectTitle,
  courseName,
  professor,
  university,
  existingEndorsements = [],
}: EndorsementRequestFormProps) {
  const [expanded, setExpanded] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    professorName: professor || '',
    professorEmail: '',
    professorTitle: '',
    department: '',
    university: university || '',
    courseName: courseName || '',
    courseCode: '',
    semester: '',
    message: '',
  })

  const hasPending = existingEndorsements.some((e) => e.status === 'PENDING')
  const hasVerified = existingEndorsements.some((e) => e.status === 'VERIFIED')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.professorName || !form.professorEmail) return

    setSending(true)
    setError(null)

    try {
      const res = await fetch('/api/endorsements/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          ...form,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to send request')
        return
      }

      setSent(true)
      setExpanded(false)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'PENDING':
        return <Clock className="h-4 w-4 text-amber-500" />
      case 'DECLINED':
      case 'EXPIRED':
        return <XCircle className="h-4 w-4 text-gray-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <Award className="h-5 w-5 text-green-500" />
            Professor Endorsement
          </span>
          {hasVerified && (
            <Badge className="bg-green-100 text-green-700 text-xs">Endorsed</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Existing endorsements */}
        {existingEndorsements.length > 0 && (
          <div className="space-y-2">
            {existingEndorsements.map((e) => (
              <div
                key={e.id}
                className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded"
              >
                {statusIcon(e.status)}
                <span className="flex-1 truncate">{e.professorName}</span>
                <Badge variant="outline" className="text-xs">
                  {e.status.toLowerCase()}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {/* Success state */}
        {sent && (
          <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
            <CheckCircle2 className="h-4 w-4" />
            Request sent! Your professor will receive an email to verify.
          </div>
        )}

        {/* Request button or form */}
        {!sent && !expanded && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setExpanded(true)}
            disabled={hasPending}
          >
            {hasPending ? (
              <>
                <Clock className="h-4 w-4 mr-2" />
                Endorsement pending
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Request endorsement
              </>
            )}
          </Button>
        )}

        {expanded && !sent && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <p className="text-xs text-gray-500">
              Your professor will receive a link to verify and endorse this project.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Professor name *</label>
                <input
                  type="text"
                  required
                  value={form.professorName}
                  onChange={(e) => setForm({ ...form, professorName: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-sm border rounded-md"
                  placeholder="Prof. Rossi"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Email *</label>
                <input
                  type="email"
                  required
                  value={form.professorEmail}
                  onChange={(e) => setForm({ ...form, professorEmail: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-sm border rounded-md"
                  placeholder="rossi@polimi.it"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Title</label>
                <input
                  type="text"
                  value={form.professorTitle}
                  onChange={(e) => setForm({ ...form, professorTitle: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-sm border rounded-md"
                  placeholder="Associate Professor"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">University</label>
                <input
                  type="text"
                  value={form.university}
                  onChange={(e) => setForm({ ...form, university: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-sm border rounded-md"
                  placeholder="Politecnico di Milano"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1 block">Personal message (optional)</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-2.5 py-1.5 text-sm border rounded-md resize-none"
                rows={2}
                placeholder="Hi Professor, I'd appreciate your endorsement for this project..."
              />
            </div>

            {error && (
              <p className="text-xs text-red-600">{error}</p>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={sending} className="flex-1">
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send request
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
