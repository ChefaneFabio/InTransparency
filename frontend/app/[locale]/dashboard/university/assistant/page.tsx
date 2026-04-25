'use client'

import { useState, useRef, useEffect } from 'react'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Send,
  Loader2,
  Sparkles,
  Bot,
  User,
  AlertTriangle,
  Users,
  Building2,
  TrendingUp,
  ExternalLink,
  Shield,
  GraduationCap,
  BarChart3,
} from 'lucide-react'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import PremiumBadge from '@/components/shared/PremiumBadge'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { useMyInstitution } from '@/lib/hooks/use-my-institution'

interface AtRiskCard {
  id: string
  student: string
  company: string
  stage: string | null
  risks: string[]
  daysSinceHours: number | null
  overdueDeadlines: number
  detailUrl: string
}

interface StudentCard {
  id: string
  name: string
  email: string
  program: string
  graduationYear: number | null
}

interface StatsCard {
  total: number
  byStage: Array<{ stage: string; count: number }>
  byOfferType: Array<{ offerType: string; count: number }>
  byOutcome: Array<{ outcome: string; count: number }>
}

interface LeadCard {
  id: string
  name: string
  sector: string | null
  stage: string | null
  lastActivityAt: string
  daysSinceContact: number
  detailUrl: string
}

type CardPayload =
  | { type: 'at-risk-placements'; data: AtRiskCard[] }
  | { type: 'students'; data: StudentCard[] }
  | { type: 'stats'; data: StatsCard }
  | { type: 'stale-leads'; data: LeadCard[] }

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  cards?: CardPayload[]
}

// Categorized onboarding — each category maps to one tool the assistant
// can call. Showing the connection teaches staff what the assistant is
// capable of without requiring them to read docs.
const PROMPT_CATEGORIES: Array<{
  icon: typeof AlertTriangle
  iconColor: string
  iconBg: string
  label: string
  tool: string
  examples: string[]
}> = [
  {
    icon: AlertTriangle,
    iconColor: 'text-red-600',
    iconBg: 'bg-red-50',
    label: 'Placement a rischio',
    tool: 'list_at_risk_placements',
    examples: [
      'Quali placement sono a rischio questa settimana?',
      'Mostra tirocini senza ore loggate da oltre 7 giorni',
      'Chi ha scadenze scadute?',
    ],
  },
  {
    icon: GraduationCap,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    label: 'Studenti senza tirocinio',
    tool: 'list_students_without_placement',
    examples: [
      'Chi non ha ancora un tirocinio tra gli iscritti attivi?',
      'Studenti di Ingegneria Informatica senza placement',
      'Laureandi 2026 senza stage curriculare',
    ],
  },
  {
    icon: BarChart3,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    label: 'Statistiche e report',
    tool: 'summarize_placement_stats',
    examples: [
      'Quanti tirocini per tipologia nell\'anno accademico?',
      'Distribuzione placement per fase',
      'Esiti occupazionali dell\'ultimo semestre',
    ],
  },
  {
    icon: Building2,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    label: 'Aziende in silenzio',
    tool: 'list_stale_company_leads',
    examples: [
      'Aziende non contattate da oltre 45 giorni',
      'Lead senza attività nell\'ultimo mese',
      'Partner storici da riattivare',
    ],
  },
]

const RISK_LABEL: Record<string, string> = {
  noHours: 'ore non loggate',
  overdueDeadline: 'scadenze scadute',
  noTutor: 'tutor mancante',
}

export default function InstitutionAssistantPage() {
  const { institution } = useMyInstitution()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, loading])

  const send = async (text?: string) => {
    const payload = (text ?? input).trim()
    if (!payload || loading) return
    const next: ChatMessage[] = [...messages, { role: 'user', content: payload }]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/dashboard/university/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map(m => ({ role: m.role, content: m.content })),
        }),
      })
      if (res.status === 402) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content:
              'L\'assistente è una funzionalità PREMIUM. Passa al piano PREMIUM per sbloccare le query conversazionali sulla workspace.',
          },
        ])
        return
      }
      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.reply || '', cards: data.cards || [] },
      ])
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Errore di connessione, riprova.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="space-y-5 pb-6 max-w-4xl mx-auto flex flex-col h-[calc(100vh-100px)]">

      <MetricHero gradient="institution">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2 flex-wrap">
              Staff Assistant
              <Badge variant="secondary" className="text-[10px]">BETA</Badge>
              <PremiumBadge audience="institution" variant="chip" label="Premium · unlimited" />
            </h1>
            <p className="text-sm text-muted-foreground">
              Chiedi in linguaggio naturale — placement a rischio, studenti senza
              tirocinio, aziende in silenzio. Ogni query è loggata per AI Act.
              <span className="block mt-1 text-xs">
                Free Core: 50 query/mese · Premium: illimitato.
              </span>
            </p>
          </div>
        </div>
      </MetricHero>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-xl border bg-background/60 p-4 space-y-4"
      >
        {messages.length === 0 && (
          <div className="space-y-5 py-2">
            {/* Hero */}
            <div className="text-center pt-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center mb-3 mx-auto shadow-lg">
                <Bot className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-semibold mb-1">
                Cosa vuoi sapere sulla tua workspace?
              </h2>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                Scrivi in italiano. Io traduco la tua domanda in una query sui tuoi
                dati e torno con una lista cliccabile.
              </p>
            </div>

            {/* Categorized prompts — shows what the assistant can actually do */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto w-full">
              {PROMPT_CATEGORIES.map(cat => {
                const Icon = cat.icon
                return (
                <div
                  key={cat.tool}
                  className="rounded-lg border bg-card overflow-hidden"
                >
                  <div className="px-3 py-2 bg-muted/50 border-b flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-md ${cat.iconBg} ${cat.iconColor} flex items-center justify-center`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-medium">{cat.label}</span>
                  </div>
                  <div className="p-2 space-y-1">
                    {cat.examples.map(ex => (
                      <button
                        key={ex}
                        onClick={() => send(ex)}
                        className="w-full text-left text-xs p-2 rounded hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        → {ex}
                      </button>
                    ))}
                  </div>
                </div>
                )
              })}
            </div>

            {/* How it works */}
            <div className="max-w-3xl mx-auto w-full rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3">
              <div className="flex items-start gap-2">
                <Bot className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground">
                    Come funziona:
                  </span>{' '}
                  io chiamo strumenti di ricerca sul tuo database (solo letture, mai
                  scritture), ogni query è loggata per AI Act compliance. Non invento
                  dati — se non trovo nulla, te lo dico.
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
            {m.role === 'assistant' && (
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            )}
            <div className={`max-w-[85%] ${m.role === 'user' ? 'order-2' : ''}`}>
              <div
                className={`rounded-xl px-4 py-3 ${
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</p>
              </div>
              {m.cards?.map((card, ci) => (
                <div key={ci} className="mt-3">
                  <RenderCard card={card} />
                </div>
              ))}
            </div>
            {m.role === 'user' && (
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center order-3">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="bg-muted rounded-xl px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      <GlassCard hover={false}>
        <div className="p-3 flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Chiedi qualcosa… (es. 'placement a rischio', 'aziende stagnanti')"
            rows={2}
            className="flex-1 resize-none bg-background/50 border-0 focus-visible:ring-1"
            disabled={loading}
          />
          <Button onClick={() => send()} disabled={loading || !input.trim()} size="icon">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </GlassCard>

      <p className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1.5">
        <Shield className="h-3 w-3" />
        Query loggate con institutionId + tuo userId per AI Act compliance.
      </p>
    </div>
  )
}

function RenderCard({ card }: { card: CardPayload }) {
  switch (card.type) {
    case 'at-risk-placements':
      return (
        <div className="space-y-2">
          {card.data.map(r => (
            <Card key={r.id}>
              <CardContent className="p-3 flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium truncate">{r.student}</span>
                    <span className="text-muted-foreground text-xs">→</span>
                    <span className="text-xs text-muted-foreground truncate">{r.company}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {r.risks.map(risk => (
                      <Badge key={risk} variant="outline" className="text-[10px] border-amber-300 text-amber-700">
                        {RISK_LABEL[risk] || risk}
                      </Badge>
                    ))}
                    {r.daysSinceHours !== null && r.daysSinceHours > 7 && (
                      <Badge variant="outline" className="text-[10px]">
                        {r.daysSinceHours}g senza ore
                      </Badge>
                    )}
                    {r.overdueDeadlines > 0 && (
                      <Badge variant="outline" className="text-[10px] border-red-300 text-red-700">
                        {r.overdueDeadlines} scadenze
                      </Badge>
                    )}
                  </div>
                </div>
                <Link
                  href={r.detailUrl as any}
                  className="text-xs text-primary inline-flex items-center gap-1 hover:underline shrink-0"
                >
                  <ExternalLink className="h-3 w-3" />
                  Apri
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )

    case 'students':
      return (
        <div className="space-y-1.5">
          {card.data.map(s => (
            <div
              key={s.id}
              className="flex items-center gap-2 p-2.5 rounded-lg border bg-card text-sm"
            >
              <Users className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{s.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {s.program}
                  {s.graduationYear ? ` · ${s.graduationYear}` : ''}
                </p>
              </div>
              <a
                href={`mailto:${s.email}`}
                className="text-xs text-primary hover:underline truncate"
              >
                {s.email}
              </a>
            </div>
          ))}
        </div>
      )

    case 'stats':
      return (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                Totale placement: <span className="font-bold">{card.data.total}</span>
              </span>
            </div>
            {card.data.byStage.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1.5">
                  Per stage
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {card.data.byStage.map(s => (
                    <Badge key={s.stage} variant="secondary" className="text-[11px]">
                      {s.stage}: {s.count}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {card.data.byOfferType.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1.5">
                  Per tipologia
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {card.data.byOfferType.map(o => (
                    <Badge key={o.offerType} variant="outline" className="text-[11px]">
                      {o.offerType}: {o.count}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )

    case 'stale-leads':
      return (
        <div className="space-y-1.5">
          {card.data.map(l => (
            <div
              key={l.id}
              className="flex items-center gap-2 p-2.5 rounded-lg border bg-card text-sm"
            >
              <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{l.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {l.stage}
                  {l.sector ? ` · ${l.sector}` : ''}
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] shrink-0">
                {l.daysSinceContact}g fa
              </Badge>
              <Link
                href={l.detailUrl as any}
                className="text-xs text-primary inline-flex items-center gap-1 hover:underline shrink-0"
              >
                <ExternalLink className="h-3 w-3" />
                Apri
              </Link>
            </div>
          ))}
        </div>
      )

    default:
      return null
  }
}
