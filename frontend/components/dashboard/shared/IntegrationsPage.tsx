'use client'

import { useMemo, useState } from 'react'
import { useLocale } from 'next-intl'
import { Link } from '@/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  ArrowRight,
  Check,
  Clock,
  ExternalLink,
  Mail,
  Plug,
  Search,
  Shield,
  Sparkles,
} from 'lucide-react'
import {
  type Integration,
  type IntegrationRole,
  type IntegrationStatus,
  integrationsForRole,
  CATEGORY_LABELS_IT,
  CATEGORY_LABELS_EN,
} from '@/lib/integrations-catalog'
import { IntegrationIcon } from './IntegrationIcon'

interface Props {
  role: IntegrationRole
  headline?: string
  subhead?: string
}

const STATUS_META: Record<
  IntegrationStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  live:         { label: 'Disponibile',       dot: 'bg-emerald-500', bg: 'bg-emerald-50 border-emerald-200',  text: 'text-emerald-700' },
  beta:         { label: 'Beta',              dot: 'bg-blue-500',    bg: 'bg-blue-50 border-blue-200',         text: 'text-blue-700' },
  coming_soon:  { label: 'Prossimamente',     dot: 'bg-amber-500',   bg: 'bg-amber-50 border-amber-200',       text: 'text-amber-700' },
  enterprise:   { label: 'Enterprise',        dot: 'bg-purple-500',  bg: 'bg-purple-50 border-purple-200',     text: 'text-purple-700' },
  premium:      { label: 'PREMIUM',           dot: 'bg-orange-500',  bg: 'bg-orange-50 border-orange-200',     text: 'text-orange-700' },
}

const STATUS_FILTERS: Array<{ value: IntegrationStatus | 'all'; label: string }> = [
  { value: 'all',         label: 'Tutte' },
  { value: 'live',        label: 'Disponibili' },
  { value: 'beta',        label: 'Beta' },
  { value: 'coming_soon', label: 'Prossimamente' },
  { value: 'premium',     label: 'PREMIUM' },
  { value: 'enterprise',  label: 'Enterprise' },
]

export function IntegrationsPage({ role, headline, subhead }: Props) {
  const locale = useLocale()
  const isIt = locale === 'it'
  const all = useMemo(() => integrationsForRole(role), [role])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<IntegrationStatus | 'all'>('all')

  const filtered = all.filter(i => {
    if (statusFilter !== 'all' && i.status !== statusFilter) return false
    if (!search) return true
    const q = search.toLowerCase()
    return (
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q)
    )
  })

  // Group by category
  const byCategory = useMemo(() => {
    const map = new Map<string, Integration[]>()
    for (const i of filtered) {
      if (!map.has(i.category)) map.set(i.category, [])
      map.get(i.category)!.push(i)
    }
    return Array.from(map.entries())
  }, [filtered])

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: all.length }
    for (const s of ['live', 'beta', 'coming_soon', 'premium', 'enterprise']) {
      counts[s] = all.filter(i => i.status === s).length
    }
    return counts
  }, [all])

  const catLabel = (c: string) => (isIt ? CATEGORY_LABELS_IT[c] : CATEGORY_LABELS_EN[c]) || c

  return (
    <div className="max-w-6xl mx-auto pb-12 space-y-6">
      {/* Hero */}
      <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 sm:p-8">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <Plug className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {headline || (isIt ? 'Integrazioni' : 'Integrations')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {subhead ||
                (isIt
                  ? 'Collega i tuoi strumenti preferiti. Importa dati, automatizza workflow, estendi InTransparency.'
                  : 'Connect your favorite tools. Import data, automate workflows, extend InTransparency.')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
          <div className="rounded-lg bg-white/70 border border-indigo-100 p-2.5 text-center">
            <div className="text-xl font-bold text-emerald-600">{statusCounts.live}</div>
            <div className="text-[11px] text-muted-foreground">{isIt ? 'Disponibili' : 'Available'}</div>
          </div>
          <div className="rounded-lg bg-white/70 border border-indigo-100 p-2.5 text-center">
            <div className="text-xl font-bold text-blue-600">{statusCounts.beta}</div>
            <div className="text-[11px] text-muted-foreground">Beta</div>
          </div>
          <div className="rounded-lg bg-white/70 border border-indigo-100 p-2.5 text-center">
            <div className="text-xl font-bold text-amber-600">{statusCounts.coming_soon}</div>
            <div className="text-[11px] text-muted-foreground">{isIt ? 'In arrivo' : 'Coming soon'}</div>
          </div>
          <div className="rounded-lg bg-white/70 border border-indigo-100 p-2.5 text-center">
            <div className="text-xl font-bold text-orange-600">{statusCounts.premium}</div>
            <div className="text-[11px] text-muted-foreground">PREMIUM</div>
          </div>
          <div className="rounded-lg bg-white/70 border border-indigo-100 p-2.5 text-center">
            <div className="text-xl font-bold text-purple-600">{statusCounts.enterprise}</div>
            <div className="text-[11px] text-muted-foreground">Enterprise</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={isIt ? 'Cerca integrazioni…' : 'Search integrations…'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto">
          {STATUS_FILTERS.map(s => {
            const count = statusCounts[s.value] ?? 0
            return (
              <button
                key={s.value}
                onClick={() => setStatusFilter(s.value)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  statusFilter === s.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {s.label}
                <span className="font-mono opacity-70">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid by category */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <Plug className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              {isIt ? 'Nessuna integrazione corrisponde ai filtri.' : 'No integrations match your filters.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        byCategory.map(([category, items]) => (
          <div key={category}>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              {catLabel(category)}{' '}
              <span className="text-muted-foreground/50 font-mono">({items.length})</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map(i => (
                <IntegrationCard key={i.id} integration={i} isIt={isIt} />
              ))}
            </div>
          </div>
        ))
      )}

      {/* Request integration */}
      <Card className="border-2 border-dashed border-primary/20 bg-primary/5">
        <CardContent className="p-5 flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold mb-1">
              {isIt ? "Non trovi l'integrazione che ti serve?" : "Don't see the integration you need?"}
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              {isIt
                ? "Scrivici: se ci sono abbastanza richieste, la costruiamo. Molte delle integrazioni live oggi sono nate da richieste dei clienti."
                : "Let us know: if enough customers ask, we'll build it. Many live integrations started as customer requests."}
            </p>
            <a
              href="mailto:info@in-transparency.com?subject=Richiesta%20integrazione"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <Mail className="h-3 w-3" /> info@in-transparency.com
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function IntegrationCard({ integration: i, isIt }: { integration: Integration; isIt: boolean }) {
  const meta = STATUS_META[i.status]

  const ctaLabel =
    i.status === 'live'
      ? isIt ? 'Collega' : 'Connect'
      : i.status === 'beta'
        ? isIt ? 'Prova la beta' : 'Try beta'
        : i.status === 'coming_soon'
          ? isIt ? 'Richiedi accesso' : 'Request access'
          : i.status === 'enterprise'
            ? isIt ? 'Contatta vendite' : 'Contact sales'
            : isIt ? 'Upgrade a PREMIUM' : 'Upgrade to PREMIUM'

  const ctaHref = i.href
    ? i.href
    : i.requestEmailSubject
      ? `mailto:info@in-transparency.com?subject=${encodeURIComponent(i.requestEmailSubject)}`
      : i.status === 'premium'
        ? '/pricing?for=institutions'
        : 'mailto:info@in-transparency.com'

  const isExternal = ctaHref.startsWith('http') || ctaHref.startsWith('mailto:')
  const IconComponent = ctaHref.startsWith('mailto:')
    ? Mail
    : isExternal
      ? ExternalLink
      : ArrowRight

  return (
    <div className="group rounded-xl border bg-card p-4 hover:shadow-md hover:border-primary/30 transition-all flex flex-col">
      <div className="flex items-start gap-3 mb-2">
        <IntegrationIcon iconKey={i.iconKey} size={22} className="shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-semibold text-sm truncate">{i.name}</h3>
          </div>
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide mt-0.5 ${meta.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1">
        {i.description}
      </p>

      {isExternal ? (
        <a
          href={ctaHref}
          target={ctaHref.startsWith('http') ? '_blank' : undefined}
          rel={ctaHref.startsWith('http') ? 'noopener' : undefined}
          className="inline-flex items-center justify-center gap-1 text-xs font-medium px-3 py-1.5 rounded border hover:bg-muted transition-colors"
        >
          <IconComponent className="h-3 w-3" />
          {ctaLabel}
        </a>
      ) : (
        <Link
          href={ctaHref as any}
          className="inline-flex items-center justify-center gap-1 text-xs font-medium px-3 py-1.5 rounded border hover:bg-muted transition-colors"
        >
          <IconComponent className="h-3 w-3" />
          {ctaLabel}
        </Link>
      )}
    </div>
  )
}
