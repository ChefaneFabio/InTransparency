'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { Briefcase, ChevronDown, Check, Loader2, Zap, Eye, EyeOff, Calendar } from 'lucide-react'

type Status = 'NOT_LOOKING' | 'OPEN' | 'ACTIVELY_LOOKING'

const STATUS_META: Record<Status, { label: string; description: string; dot: string; badge: string }> = {
  NOT_LOOKING: {
    label: 'Non in cerca',
    description: 'Profilo non segnalato ai recruiter come attivo',
    dot: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
  OPEN: {
    label: 'Aperto a opportunità',
    description: 'Interessato se arriva qualcosa di giusto',
    dot: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  },
  ACTIVELY_LOOKING: {
    label: 'In cerca attiva',
    description: 'Stai cercando attivamente. I recruiter ti vedono per primo.',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  },
}

export function HireStatusWidget() {
  const [status, setStatus] = useState<Status>('NOT_LOOKING')
  const [availabilityFrom, setAvailabilityFrom] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/dashboard/student/hire-status')
        if (res.ok) {
          const data = await res.json()
          setStatus(data.jobSearchStatus || 'NOT_LOOKING')
          setAvailabilityFrom(data.availabilityFrom ? data.availabilityFrom.slice(0, 10) : '')
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const save = async (patch: { jobSearchStatus?: Status; availabilityFrom?: string | null }) => {
    setSaving(true)
    try {
      await fetch('/api/dashboard/student/hire-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
    } finally {
      setSaving(false)
    }
  }

  const onChangeStatus = async (next: Status) => {
    setStatus(next)
    await save({ jobSearchStatus: next })
  }

  const onChangeDate = async (value: string) => {
    setAvailabilityFrom(value)
    await save({ availabilityFrom: value || null })
  }

  if (loading) {
    return (
      <GlassCard hover={false}>
        <div className="p-4 animate-pulse h-20" />
      </GlassCard>
    )
  }

  const meta = STATUS_META[status]
  const isOff = status === 'NOT_LOOKING'

  return (
    <GlassCard hover={false}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isOff ? 'bg-slate-100 dark:bg-slate-800' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
              {isOff
                ? <EyeOff className="h-4 w-4 text-slate-500" />
                : status === 'ACTIVELY_LOOKING' ? <Zap className="h-4 w-4 text-emerald-600" /> : <Eye className="h-4 w-4 text-blue-600" />}
            </div>
            <div>
              <div className="font-semibold text-sm">Stato disponibilità</div>
              <div className="text-[11px] text-muted-foreground">Controlli tu cosa vedono i recruiter</div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" disabled={saving}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
                {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <ChevronDown className="h-3 w-3" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {(Object.keys(STATUS_META) as Status[]).map(key => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => onChangeStatus(key)}
                  className="flex items-start gap-2 py-2 cursor-pointer"
                >
                  <span className={`inline-block w-2 h-2 rounded-full mt-1.5 ${STATUS_META[key].dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium flex items-center gap-1.5">
                      {STATUS_META[key].label}
                      {status === key && <Check className="h-3 w-3 text-primary" />}
                    </div>
                    <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                      {STATUS_META[key].description}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-xs text-muted-foreground mb-2">{meta.description}</p>

        {!isOff && (
          <>
            <button
              onClick={() => setExpanded(v => !v)}
              className="text-[11px] text-primary hover:underline flex items-center gap-1"
            >
              <Calendar className="h-3 w-3" />
              {availabilityFrom
                ? `Disponibile dal ${new Date(availabilityFrom).toLocaleDateString('it-IT')}`
                : 'Imposta data di disponibilità'}
            </button>
            {expanded && (
              <div className="mt-2 flex items-center gap-2">
                <Label className="text-[11px] text-muted-foreground">Disponibile dal</Label>
                <Input
                  type="date"
                  value={availabilityFrom}
                  onChange={e => onChangeDate(e.target.value)}
                  className="h-7 text-xs flex-1"
                />
              </div>
            )}
          </>
        )}

        {status === 'ACTIVELY_LOOKING' && (
          <Badge className={`mt-2 text-[10px] ${STATUS_META.ACTIVELY_LOOKING.badge} border-0`}>
            I recruiter con stato "in cerca attiva" nel filtro ti vedono prima
          </Badge>
        )}
      </div>
    </GlassCard>
  )
}

export default HireStatusWidget
