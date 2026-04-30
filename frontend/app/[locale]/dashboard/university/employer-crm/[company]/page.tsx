'use client'

import { useEffect, useState, useCallback } from 'react'
import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import { Link } from '@/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ArrowLeft, Building2, Users, Eye, MessageSquare, Briefcase,
  Mail, Phone, Linkedin, Globe, MapPin, Send, Loader2, CheckCircle2,
  ExternalLink,
} from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

interface Contact {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
  jobTitle: string | null
  photo: string | null
  linkedinUrl: string | null
  location: string | null
  lastLoginAt: string | null
}

interface CompanyDetail {
  company: {
    name: string
    profile: null | {
      logoUrl: string | null
      coverUrl: string | null
      tagline: string | null
      description: string | null
      industries: string[]
      sizeCategory: string | null
      headquarters: string | null
      foundedYear: number | null
      websiteUrl: string | null
      linkedinUrl: string | null
      mission: string | null
      countries: string[]
      verified: boolean
      published: boolean
      slug: string
    }
  }
  contacts: Contact[]
  metrics: {
    totalViews: number
    recentViews: number
    totalContacts: number
    confirmedHires: number
    avgSalary: number | null
    engagedCount: number
    studentsTotal: number
  }
  engagedStudents: Array<{ id: string; firstName: string | null; lastName: string | null; degree: string | null; photo: string | null }>
  recentActivity: Array<{ type: string; at: string; studentName?: string; title?: string; status?: string; jobTitle?: string }>
  placements: Array<{ jobTitle: string | null; salaryAmount: number | null; salaryCurrency: string | null; startDate: string | null; status: string }>
}

function MessageComposer({ contact, onSent, isIt }: { contact: Contact; onSent?: () => void; isIt: boolean }) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<'ok' | 'err' | null>(null)
  const [error, setError] = useState('')

  const send = async () => {
    if (!body.trim()) return
    setSending(true); setResult(null)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: contact.id,
          recipientEmail: contact.email,
          subject: subject.trim() || null,
          content: body.trim(),
        }),
      })
      if (res.ok) {
        setResult('ok')
        setSubject(''); setBody('')
        onSent?.()
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data?.error || `HTTP ${res.status}`)
        setResult('err')
      }
    } catch (err: any) {
      setError(err?.message || 'Network error')
      setResult('err')
    } finally {
      setSending(false)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="default">
          <Send className="h-3.5 w-3.5 mr-1.5" /> {isIt ? 'Messaggia' : 'Message'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4" align="end">
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            {isIt ? 'A:' : 'To:'} <span className="font-medium text-foreground">{[contact.firstName, contact.lastName].filter(Boolean).join(' ')} ({contact.email})</span>
          </div>
          <Input placeholder={isIt ? 'Oggetto' : 'Subject'} value={subject} onChange={e => setSubject(e.target.value)} disabled={sending} />
          <Textarea placeholder={isIt ? 'Scrivi un messaggio…' : 'Write a message…'} value={body} onChange={e => setBody(e.target.value)} rows={5} disabled={sending} />
          <Button onClick={send} disabled={sending || !body.trim()} className="w-full">
            {sending ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Send className="h-4 w-4 mr-1.5" />}
            {isIt ? 'Invia' : 'Send'}
          </Button>
          {result === 'ok' && (
            <div className="text-xs text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> {isIt ? 'Messaggio inviato.' : 'Message sent.'}
            </div>
          )}
          {result === 'err' && <div className="text-xs text-red-700">{isIt ? 'Errore' : 'Error'}: {error}</div>}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default function EmployerCompanyDetailPage() {
  const params = useParams() as { company?: string }
  const locale = useLocale()
  const isIt = locale === 'it'
  const companyParam = params?.company || ''
  const [data, setData] = useState<CompanyDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/dashboard/university/employer-crm/${encodeURIComponent(companyParam)}`)
      if (res.ok) setData(await res.json())
    } catch { /* silent */ } finally { setLoading(false) }
  }, [companyParam])

  useEffect(() => { load() }, [load])

  const initials = (c: Contact) => `${c.firstName?.[0] || ''}${c.lastName?.[0] || ''}`.toUpperCase() || '?'

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full rounded-lg" />
        <div className="grid md:grid-cols-3 gap-4">
          {[0, 1, 2].map(i => <Skeleton key={i} className="h-32 rounded-lg" />)}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="max-w-6xl mx-auto py-8 text-center">
        <p className="text-muted-foreground">{isIt ? 'Azienda non trovata.' : 'Company not found.'}</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/university/employer-crm"><ArrowLeft className="h-4 w-4 mr-1.5" /> {isIt ? 'Torna alle aziende' : 'Back to companies'}</Link>
        </Button>
      </div>
    )
  }

  const { company, contacts, metrics, engagedStudents, recentActivity, placements } = data
  const p = company.profile

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-6">
      {/* Back */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/university/employer-crm">
          <ArrowLeft className="h-4 w-4 mr-1.5" /> {isIt ? 'Torna alle aziende convenzionate' : 'Back to partner companies'}
        </Link>
      </Button>

      {/* Hero */}
      <MetricHero gradient="primary">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {p?.logoUrl
                ? <img src={p.logoUrl} alt={company.name} className="h-full w-full object-contain" />
                : <Building2 className="h-8 w-8 text-primary" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{company.name}</h1>
                {p?.verified && <Badge variant="outline" className="text-xs">{isIt ? 'Verificata' : 'Verified'}</Badge>}
                {!p && <Badge variant="secondary" className="text-xs">{isIt ? 'Profilo non registrato' : 'Profile not registered'}</Badge>}
              </div>
              {p?.tagline && <p className="text-muted-foreground mt-1">{p.tagline}</p>}
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                {p?.headquarters && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{p.headquarters}</span>}
                {p?.sizeCategory && <span>{p.sizeCategory} {isIt ? 'dipendenti' : 'employees'}</span>}
                {p?.foundedYear && <span>{isIt ? `Fondata nel ${p.foundedYear}` : `Founded in ${p.foundedYear}`}</span>}
                {(p?.industries || []).slice(0, 3).map(i => (
                  <Badge key={i} variant="outline" className="text-[10px]">{i}</Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {p?.websiteUrl && (
              <Button size="sm" variant="outline" asChild>
                <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer"><Globe className="h-3.5 w-3.5 mr-1" /> {isIt ? 'Sito' : 'Website'}</a>
              </Button>
            )}
            {p?.linkedinUrl && (
              <Button size="sm" variant="outline" asChild>
                <a href={p.linkedinUrl} target="_blank" rel="noopener noreferrer"><Linkedin className="h-3.5 w-3.5 mr-1" /> LinkedIn</a>
              </Button>
            )}
            {p?.published && p?.slug && (
              <Button size="sm" variant="outline" asChild>
                <Link href={`/companies/${p.slug}`}><ExternalLink className="h-3.5 w-3.5 mr-1" /> {isIt ? 'Profilo pubblico' : 'Public profile'}</Link>
              </Button>
            )}
          </div>
        </div>
      </MetricHero>

      {/* Metrics row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <GlassCard hover={false}>
          <div className="p-4">
            <div className="text-xs text-muted-foreground">{isIt ? 'Visualizzazioni' : 'Views'}</div>
            <div className="text-xl font-bold">{metrics.totalViews}</div>
            <div className="text-[11px] text-muted-foreground">{metrics.recentViews} {isIt ? 'ultimi 30 gg' : 'last 30 days'}</div>
          </div>
        </GlassCard>
        <GlassCard hover={false}>
          <div className="p-4">
            <div className="text-xs text-muted-foreground">{isIt ? 'Contatti' : 'Contacts'}</div>
            <div className="text-xl font-bold">{metrics.totalContacts}</div>
          </div>
        </GlassCard>
        <GlassCard hover={false}>
          <div className="p-4">
            <div className="text-xs text-muted-foreground">{isIt ? 'Assunzioni' : 'Hires'}</div>
            <div className="text-xl font-bold">{metrics.confirmedHires}</div>
          </div>
        </GlassCard>
        <GlassCard hover={false}>
          <div className="p-4">
            <div className="text-xs text-muted-foreground">{isIt ? 'RAL media' : 'Avg salary'}</div>
            <div className="text-xl font-bold">{metrics.avgSalary ? `€${metrics.avgSalary.toLocaleString()}` : '—'}</div>
          </div>
        </GlassCard>
        <GlassCard hover={false}>
          <div className="p-4">
            <div className="text-xs text-muted-foreground">{isIt ? 'Studenti coinvolti' : 'Engaged students'}</div>
            <div className="text-xl font-bold">{metrics.engagedCount} <span className="text-sm text-muted-foreground font-normal">/ {metrics.studentsTotal}</span></div>
          </div>
        </GlassCard>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Contact persons */}
        <Card className="md:col-span-2">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{isIt ? 'Referenti' : 'Contacts'}</h2>
              <span className="text-xs text-muted-foreground">{contacts.length} {isIt ? (contacts.length === 1 ? 'referente' : 'referenti') : (contacts.length === 1 ? 'contact' : 'contacts')}</span>
            </div>
            {contacts.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                {isIt ? 'Nessun referente attivo su InTransparency per questa azienda.' : 'No active contacts on InTransparency for this company.'}
                <br />
                <span className="text-xs">{isIt ? `Quando un recruiter di ${company.name} crea un account, apparirà qui.` : `When a recruiter from ${company.name} creates an account, they'll appear here.`}</span>
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.map(c => (
                  <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={c.photo || undefined} />
                      <AvatarFallback>{initials(c)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {[c.firstName, c.lastName].filter(Boolean).join(' ') || c.email}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {c.jobTitle || (isIt ? 'Recruiter' : 'Recruiter')}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground flex-wrap">
                        <span className="inline-flex items-center gap-0.5"><Mail className="h-3 w-3" />{c.email}</span>
                        {c.linkedinUrl && (
                          <a href={c.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 hover:text-primary">
                            <Linkedin className="h-3 w-3" />LinkedIn
                          </a>
                        )}
                        {c.location && <span className="inline-flex items-center gap-0.5"><MapPin className="h-3 w-3" />{c.location}</span>}
                      </div>
                    </div>
                    <MessageComposer contact={c} isIt={isIt} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Engaged students */}
        <Card>
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold mb-4">{isIt ? 'Studenti coinvolti' : 'Engaged students'}</h2>
            {engagedStudents.length === 0 ? (
              <div className="text-sm text-muted-foreground">{isIt ? 'Nessuno studente coinvolto ancora.' : 'No engaged students yet.'}</div>
            ) : (
              <div className="space-y-2">
                {engagedStudents.map(s => (
                  <Link
                    key={s.id}
                    href={`/dashboard/recruiter/candidates/${s.id}`}
                    className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={s.photo || undefined} />
                      <AvatarFallback className="text-xs">
                        {`${s.firstName?.[0] || ''}${s.lastName?.[0] || ''}`.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {[s.firstName, s.lastName].filter(Boolean).join(' ')}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{s.degree}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardContent className="p-5">
          <h2 className="text-lg font-semibold mb-4">{isIt ? 'Attività recente' : 'Recent activity'}</h2>
          {recentActivity.length === 0 ? (
            <div className="text-sm text-muted-foreground">{isIt ? 'Nessuna attività recente con questa azienda.' : 'No recent activity with this company.'}</div>
          ) : (
            <div className="space-y-2">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-center gap-3 text-sm py-1.5 border-b last:border-b-0">
                  {a.type === 'view' && <Eye className="h-4 w-4 text-blue-600 flex-shrink-0" />}
                  {a.type === 'contact' && <MessageSquare className="h-4 w-4 text-amber-600 flex-shrink-0" />}
                  {a.type === 'placement' && <Briefcase className="h-4 w-4 text-emerald-600 flex-shrink-0" />}
                  {a.type === 'event_rsvp' && <Users className="h-4 w-4 text-purple-600 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    {a.type === 'view' && <span>{isIt ? 'Profilo visualizzato di' : 'Profile viewed of'} <span className="font-medium">{a.studentName}</span></span>}
                    {a.type === 'contact' && <span>{isIt ? 'Contatto inviato a' : 'Contact sent to'} <span className="font-medium">{a.studentName}</span></span>}
                    {a.type === 'placement' && <span>{isIt ? 'Assunzione:' : 'Hire:'} <span className="font-medium">{a.studentName}</span> {isIt ? 'come' : 'as'} <span className="font-medium">{a.jobTitle}</span></span>}
                    {a.type === 'event_rsvp' && <span>RSVP <span className="font-medium">{a.status}</span> {isIt ? 'a' : 'to'} "{a.title}"</span>}
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{new Date(a.at).toLocaleDateString(locale)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
