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
  ExternalLink,
  GraduationCap,
  Award,
  Shield,
  FolderGit2,
} from 'lucide-react'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'

interface CandidateCard {
  id: string
  name: string
  username: string | null
  university: string | null
  degree: string | null
  graduationYear: number | null
  gpa: string | null
  bio: string | null
  verifiedProjectCount: number
  topProjects: Array<{
    title: string
    discipline: string | null
    innovationScore: number | null
    verified: boolean
  }>
  jobSearchStatus: string | null
  availableFrom: string | null
  profileUrl: string | null
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  cards?: Array<{ type: 'candidates'; data: CandidateCard[] }>
}

const QUICK_PROMPTS = [
  "Ingegneri meccanici al Politecnico di Milano con progetti CFD",
  'Studenti di computer science con almeno 2 progetti verificati e cerca lavoro attiva',
  'Laureandi in data science nel 2026',
  'Profili con tesi su machine learning in inglese',
]

interface SearchPanelProps { embedded?: boolean }

export default function SearchPanel({ embedded = false }: SearchPanelProps = {}) {
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

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: payload },
    ]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/dashboard/recruiter/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })
      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply || '',
          cards: data.cards || [],
        },
      ])
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Mi dispiace, si è verificato un errore. Riprova tra qualche secondo.',
        },
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

  const hasStarted = messages.length > 0

  return (
    <div className={`space-y-5 pb-6 max-w-4xl mx-auto flex flex-col ${embedded ? 'h-[calc(100vh-240px)] min-h-[500px]' : 'h-[calc(100vh-100px)]'}`}>
      {!embedded && (
        <MetricHero gradient="primary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                Talent Assistant
                <Badge variant="secondary" className="text-[10px]">BETA</Badge>
              </h1>
              <p className="text-sm text-muted-foreground">
                Cerca talenti in linguaggio naturale. Ogni query è tracciata per la
                conformità AI Act.
              </p>
            </div>
          </div>
        </MetricHero>
      )}

      {/* Chat log */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-xl border bg-background/60 p-4 space-y-4"
      >
        {!hasStarted && (
          <div className="h-full flex flex-col items-center justify-center text-center py-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Bot className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-lg font-semibold mb-1">
              Descrivi chi stai cercando
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mb-5">
              Ti presento candidati verificati dal database InTransparency. Ogni
              match cita progetti specifici e punteggi di innovazione.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-2xl">
              {QUICK_PROMPTS.map(q => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-left text-sm p-3 rounded-lg border hover:border-primary/40 hover:bg-primary/5 transition-colors"
                >
                  {q}
                </button>
              ))}
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
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {m.content}
                </p>
              </div>
              {m.cards?.map((card, ci) =>
                card.type === 'candidates' ? (
                  <div key={ci} className="mt-3 space-y-2">
                    {card.data.map(c => (
                      <CandidateResult key={c.id} c={c} />
                    ))}
                  </div>
                ) : null,
              )}
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

      {/* Input */}
      <GlassCard hover={false}>
        <div className="p-3 flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Descrivi chi cerchi… (es. 'studenti di ingegneria meccanica al Politecnico con progetti CFD')"
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
        Ogni query è loggata e può essere richiesta come revisione umana dallo studente (AI Act art. 86).
      </p>
    </div>
  )
}

function CandidateResult({ c }: { c: CandidateCard }) {
  return (
    <Card className="hover:shadow-md hover:border-primary/30 transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-sm truncate">{c.name}</h4>
            {c.university && (
              <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                <GraduationCap className="h-3 w-3 shrink-0" />
                {c.university}
                {c.graduationYear ? ` · ${c.graduationYear}` : ''}
              </p>
            )}
            {c.degree && (
              <p className="text-xs text-muted-foreground truncate">{c.degree}</p>
            )}
          </div>
          <div className="shrink-0 flex flex-col items-end gap-1">
            {c.verifiedProjectCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                <Shield className="h-3 w-3" />
                {c.verifiedProjectCount} verificat{c.verifiedProjectCount === 1 ? 'o' : 'i'}
              </span>
            )}
            {c.gpa && (
              <span className="inline-flex items-center gap-1 text-[11px] text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
                <Award className="h-3 w-3" />
                {c.gpa}
              </span>
            )}
          </div>
        </div>

        {c.topProjects.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t">
            {c.topProjects.map((p, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <FolderGit2 className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="font-medium truncate block">{p.title}</span>
                  <span className="text-muted-foreground">
                    {p.discipline}
                    {p.innovationScore !== null && ` · score ${p.innovationScore}`}
                    {p.verified && ' · ✓'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-3 mt-2 border-t">
          <span className="text-[11px] text-muted-foreground">
            {c.jobSearchStatus === 'ACTIVELY_LOOKING' && '🟢 In cerca attiva'}
            {c.jobSearchStatus === 'OPEN' && '🟡 Aperto a offerte'}
            {c.jobSearchStatus === 'NOT_LOOKING' && '⚪ Non in cerca'}
          </span>
          {c.profileUrl ? (
            <a
              href={c.profileUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              Profilo
            </a>
          ) : (
            <Link
              href={`/dashboard/recruiter/candidates/${c.id}`}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              Dettagli
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
