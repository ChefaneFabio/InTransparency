'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  ArrowLeft, Shield, CheckCircle2, XCircle, Clock, Edit3, MessageSquare,
  Loader2, Send, Mail, AlertCircle, User, Building2, FileText,
} from 'lucide-react'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

interface StudentSide {
  id: string; direction: string; body: string; status: string; createdAt: string;
  deliveredAt?: string | null
}
interface CompanySide {
  id: string; direction: string; body: string; bodyAsDelivered?: string; status: string;
  rejectionReason?: string | null; createdAt: string; deliveredAt?: string | null; readAt?: string | null
}
interface StaffSide {
  id: string; direction: string; bodyOriginal: string; bodyApproved: string | null;
  status: string; reviewedByStaffId: string | null; reviewedAt: string | null;
  rejectionReason: string | null; deliveredAt: string | null; readAt: string | null;
  createdAt: string;
  staffNotes: Array<{ id: string; note: string; staff: { id: string; name: string }; createdAt: string }>
}

type Message = StudentSide | CompanySide | StaffSide

interface Detail {
  thread: {
    id: string; subject: string; status: string;
    student: { id: string; firstName: string | null; lastName: string | null; email: string; photo: string | null } | null
    company: { id: string; firstName: string | null; lastName: string | null; email: string; company: string | null } | null
    institutionId: string
    createdAt: string
    updatedAt: string
  }
  messages: Message[]
  viewerRole: 'STUDENT' | 'COMPANY' | 'STAFF' | 'ADMIN'
}

function name(u: { firstName: string | null; lastName: string | null } | null, fallback = '?'): string {
  if (!u) return fallback
  return [u.firstName, u.lastName].filter(Boolean).join(' ') || fallback
}

function initials(s: string): string {
  return s.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase()
}

const STATUS_COLORS: Record<string, string> = {
  PENDING_REVIEW: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-green-100 text-green-700',
  EDITED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-blue-100 text-blue-700',
  READ: 'bg-blue-100 text-blue-700',
  REPLIED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
}

export default function MediationThreadPage() {
  const params = useParams()
  const threadId = params?.id as string

  const [data, setData] = useState<Detail | null>(null)
  const [loading, setLoading] = useState(true)

  // Reply
  const [reply, setReply] = useState('')
  const [replying, setReplying] = useState(false)

  // Staff-only actions
  const [noteDialog, setNoteDialog] = useState<null | string>(null)
  const [noteText, setNoteText] = useState('')
  const [noteSaving, setNoteSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/mediation/threads/${threadId}`)
      if (res.ok) setData(await res.json())
    } finally {
      setLoading(false)
    }
  }, [threadId])

  useEffect(() => { load() }, [load])

  const sendReply = async () => {
    if (!reply.trim()) return
    setReplying(true)
    try {
      const res = await fetch(`/api/mediation/threads/${threadId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: reply.trim() }),
      })
      if (res.ok) {
        setReply('')
        load()
      }
    } finally {
      setReplying(false)
    }
  }

  const addNote = async () => {
    if (!noteDialog || !noteText.trim()) return
    setNoteSaving(true)
    try {
      const res = await fetch(`/api/mediation/messages/${noteDialog}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: noteText.trim() }),
      })
      if (res.ok) {
        setNoteDialog(null)
        setNoteText('')
        load()
      }
    } finally {
      setNoteSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 p-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center">
        <p className="text-muted-foreground">Thread non trovato o non autorizzato.</p>
      </div>
    )
  }

  const { thread, messages, viewerRole } = data
  const isStaff = viewerRole === 'STAFF' || viewerRole === 'ADMIN'
  const isStudent = viewerRole === 'STUDENT'
  const isCompany = viewerRole === 'COMPANY'
  const canReply = (isStudent || isCompany) && thread.status !== 'CLOSED'

  const backHref = isStaff ? '/dashboard/university/inbox' : isStudent ? '/dashboard/student/messages' : '/dashboard/recruiter/messages'

  const studentName = name(thread.student, 'Studente')
  const companyName = thread.company?.company || name(thread.company, 'Azienda')

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4 pb-12">
      <Button variant="ghost" size="sm" asChild>
        <Link href={backHref}><ArrowLeft className="h-4 w-4 mr-1.5" /> Indietro</Link>
      </Button>

      <MetricHero gradient="primary">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold">{thread.subject}</h1>
            {thread.status === 'CLOSED' && <Badge variant="outline">Chiuso</Badge>}
            {isStudent && (
              <Badge className="bg-blue-100 text-blue-700 border-0 text-[10px]">
                <Shield className="h-2.5 w-2.5 mr-0.5" /> Validato dal Career Service
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {isStudent && <>Da <strong>{companyName}</strong>. Messaggio mediato dalla tua istituzione.</>}
            {isCompany && <>A <strong>{studentName}</strong>. Validazione dell'istituzione richiesta prima della consegna.</>}
            {isStaff && <>{companyName} → {studentName}</>}
          </p>
        </div>
      </MetricHero>

      <div className="space-y-3">
        {messages.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground text-sm">
              Nessun messaggio consegnato.
            </CardContent>
          </Card>
        ) : (
          messages.map((m: any) => {
            const isFromCompany = m.direction === 'COMPANY_TO_STUDENT'
            const senderName = isFromCompany ? companyName : studentName
            const bodyToShow = isStaff
              ? (m.bodyApproved || m.bodyOriginal)
              : (m.body || m.bodyAsDelivered)
            const statusColor = STATUS_COLORS[m.status] || 'bg-slate-100 text-slate-700'
            const sideClass = isFromCompany ? 'bg-muted/30' : 'bg-primary/5 ml-6'

            return (
              <div key={m.id} className={`rounded-lg border p-4 ${sideClass}`}>
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    {isFromCompany && !thread.company ? null : (
                      <>
                        <AvatarImage src={isFromCompany ? undefined : thread.student?.photo || undefined} />
                        <AvatarFallback className={`text-[10px] ${isFromCompany ? 'bg-amber-100 text-amber-700' : 'bg-primary/10 text-primary'}`}>
                          {initials(senderName)}
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-sm">{senderName}</span>
                      {isFromCompany && (
                        <Badge className={`text-[10px] border-0 ${statusColor}`}>{m.status}</Badge>
                      )}
                      <span className="text-[11px] text-muted-foreground ml-auto">
                        {new Date(m.createdAt).toLocaleString('it-IT')}
                      </span>
                    </div>

                    {/* Staff view: side-by-side if edited */}
                    {isStaff && m.bodyApproved && m.bodyApproved !== m.bodyOriginal ? (
                      <div className="space-y-2">
                        <div>
                          <Label className="text-[10px] text-muted-foreground">Originale</Label>
                          <div className="text-sm whitespace-pre-wrap text-muted-foreground p-2 bg-background/60 rounded border">
                            {m.bodyOriginal}
                          </div>
                        </div>
                        <div>
                          <Label className="text-[10px] text-indigo-600">Consegnato (editato)</Label>
                          <div className="text-sm whitespace-pre-wrap p-2 bg-indigo-50 rounded border border-indigo-200">
                            {m.bodyApproved}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{bodyToShow}</p>
                    )}

                    {m.rejectionReason && isStaff && (
                      <div className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
                        <strong>Rifiutato:</strong> {m.rejectionReason}
                      </div>
                    )}

                    {/* Delivery markers */}
                    {(m.deliveredAt || m.readAt) && isCompany && (
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-2">
                        {m.deliveredAt && <><CheckCircle2 className="h-2.5 w-2.5" /> Consegnato {new Date(m.deliveredAt).toLocaleDateString('it-IT')}</>}
                        {m.readAt && <><Mail className="h-2.5 w-2.5 ml-2" /> Letto</>}
                      </div>
                    )}

                    {/* Staff notes */}
                    {isStaff && m.staffNotes?.length > 0 && (
                      <div className="mt-3 pt-3 border-t space-y-1.5">
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <FileText className="h-3 w-3" /> Note interne ({m.staffNotes.length})
                        </div>
                        {m.staffNotes.map((n: any) => (
                          <div key={n.id} className="text-xs bg-amber-50 dark:bg-amber-950/20 border border-amber-200 rounded p-2">
                            <div className="flex items-center gap-1 mb-0.5">
                              <span className="font-medium">{n.staff.name}</span>
                              <span className="text-muted-foreground text-[10px] ml-auto">
                                {new Date(n.createdAt).toLocaleString('it-IT')}
                              </span>
                            </div>
                            <p className="text-muted-foreground">{n.note}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {isStaff && (
                      <div className="mt-2 pt-2 border-t">
                        <Button size="sm" variant="ghost" onClick={() => setNoteDialog(m.id)} className="h-6 text-xs">
                          <FileText className="h-3 w-3 mr-1" /> Aggiungi nota interna
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Reply */}
      {canReply && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" /> Rispondi
            </CardTitle>
            {isCompany && (
              <p className="text-[11px] text-muted-foreground flex items-start gap-1">
                <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                La tua risposta sarà inviata all'istituzione per l'approvazione prima di raggiungere lo studente.
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-2">
            <Textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              rows={4}
              placeholder={isStudent ? 'Scrivi la tua risposta…' : 'Aggiungi dettagli, orari di chiamata, link al colloquio…'}
            />
            <div className="flex justify-end">
              <Button onClick={sendReply} disabled={replying || !reply.trim()}>
                {replying ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-1.5" /> Invia</>}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Staff note dialog */}
      <Dialog open={!!noteDialog} onOpenChange={v => !v && setNoteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nota interna</DialogTitle>
            <DialogDescription>
              Visibile solo agli altri membri dello staff. Tracciata nell'audit log.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            rows={4}
            placeholder="Contesto per i colleghi, decisioni prese, prossimi step…"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteDialog(null)} disabled={noteSaving}>Annulla</Button>
            <Button onClick={addNote} disabled={noteSaving || !noteText.trim()}>
              {noteSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salva'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
