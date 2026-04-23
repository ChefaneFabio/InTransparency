'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Sparkles, X, Target } from 'lucide-react'
import {
  type RoleOffering,
  CAREER_TRACKS,
  POSITION_TYPES,
  CULTURE_TAGS,
  MOTIVATIONS,
} from '@/lib/fit-profile'

interface Props {
  jobId: string
  initial?: RoleOffering | null
  onSaved?: (value: RoleOffering) => void
}

const emptyOffering = (): RoleOffering => ({
  careerTrack: 'ic-path',
  positionLevel: 'junior-ic',
  environment: [],
  growthFocus: '',
  motivations: [],
  cultureTags: [],
  teamSize: '',
  companyStage: undefined,
  industry: '',
  nonNegotiables: [],
  perks: [],
})

export default function RoleOfferingEditor({ jobId, initial, onSaved }: Props) {
  const [value, setValue] = useState<RoleOffering>(initial ?? emptyOffering())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [nonNegInput, setNonNegInput] = useState('')
  const [perkInput, setPerkInput] = useState('')

  useEffect(() => {
    if (initial) setValue(initial)
  }, [initial])

  const toggleIn = (key: 'environment' | 'cultureTags' | 'motivations', tag: string) => {
    setValue(v => {
      const list = v[key]
      return {
        ...v,
        [key]: list.includes(tag) ? list.filter(t => t !== tag) : [...list, tag],
      }
    })
  }

  const addChip = (key: 'nonNegotiables' | 'perks', text: string) => {
    const t = text.trim()
    if (!t) return
    setValue(v => ({ ...v, [key]: Array.from(new Set([...v[key], t])) }))
  }

  const removeChip = (key: 'nonNegotiables' | 'perks', idx: number) => {
    setValue(v => ({ ...v, [key]: v[key].filter((_, i) => i !== idx) }))
  }

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleOffering: value }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to save role offering')
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      onSaved?.(value)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4" />
            Who thrives in this role
          </CardTitle>
          <div className="flex items-center gap-2">
            {saved && <span className="text-xs text-emerald-600">✓ Saved</span>}
            <Button size="sm" onClick={save} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Used alongside skills to rank applicants by fit — motivation, culture, position, company dimension.
          Students who match well see this role first; mismatches are filtered down.
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Track + Level */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Career track</Label>
            <Select
              value={value.careerTrack}
              onValueChange={v => setValue(s => ({ ...s, careerTrack: v as RoleOffering['careerTrack'] }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CAREER_TRACKS.map(t => (
                  <SelectItem key={t} value={t}>
                    {t.replace(/-/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Position level</Label>
            <Select
              value={value.positionLevel}
              onValueChange={v => setValue(s => ({ ...s, positionLevel: v as RoleOffering['positionLevel'] }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POSITION_TYPES.map(t => (
                  <SelectItem key={t} value={t}>
                    {t.replace(/-/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Growth focus */}
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
            Growth focus — what will a junior learn in 6 months?
          </Label>
          <Textarea
            rows={3}
            placeholder="e.g. Own a production service end-to-end, contribute to system design reviews, mentor interns."
            value={value.growthFocus}
            onChange={e => setValue(s => ({ ...s, growthFocus: e.target.value }))}
            className="mt-1 resize-none"
          />
        </div>

        {/* Environment / Culture */}
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Environment & culture</Label>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {CULTURE_TAGS.map(tag => {
              const active = value.cultureTags.includes(tag)
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleIn('cultureTags', tag)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:border-primary/40'
                  }`}
                >
                  {tag.replace(/-/g, ' ')}
                </button>
              )
            })}
          </div>
        </div>

        {/* Motivations */}
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
            What drives the team here
          </Label>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {MOTIVATIONS.map(m => {
              const active = value.motivations.includes(m)
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleIn('motivations', m)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    active
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'hover:border-emerald-400'
                  }`}
                >
                  {m}
                </button>
              )
            })}
          </div>
        </div>

        {/* Team + Stage + Industry */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Team size</Label>
            <Input
              placeholder="e.g. 5-8"
              value={value.teamSize || ''}
              onChange={e => setValue(s => ({ ...s, teamSize: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Company stage</Label>
            <Select
              value={value.companyStage || ''}
              onValueChange={v =>
                setValue(s => ({ ...s, companyStage: (v || undefined) as RoleOffering['companyStage'] }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Pick one" />
              </SelectTrigger>
              <SelectContent>
                {['seed', 'series-a', 'growth', 'public', 'established'].map(t => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Industry</Label>
            <Input
              placeholder="e.g. Fintech, Automotive"
              value={value.industry || ''}
              onChange={e => setValue(s => ({ ...s, industry: e.target.value }))}
              className="mt-1"
            />
          </div>
        </div>

        {/* Non-negotiables */}
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
            Non-negotiables <span className="text-[10px] normal-case text-red-600">(dealbreakers — applicants with these hard no's score 0)</span>
          </Label>
          <div className="flex gap-2 mt-1">
            <Input
              placeholder="e.g. On-site Milano, German fluent"
              value={nonNegInput}
              onChange={e => setNonNegInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addChip('nonNegotiables', nonNegInput)
                  setNonNegInput('')
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                addChip('nonNegotiables', nonNegInput)
                setNonNegInput('')
              }}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {value.nonNegotiables.map((n, i) => (
              <Badge
                key={`${n}-${i}`}
                variant="outline"
                className="text-xs bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900"
              >
                {n}
                <button
                  onClick={() => removeChip('nonNegotiables', i)}
                  className="ml-1"
                  aria-label="remove"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Perks */}
        <div>
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Perks & benefits</Label>
          <div className="flex gap-2 mt-1">
            <Input
              placeholder="e.g. Stock options, mentorship, 4-day week"
              value={perkInput}
              onChange={e => setPerkInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addChip('perks', perkInput)
                  setPerkInput('')
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                addChip('perks', perkInput)
                setPerkInput('')
              }}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {value.perks.map((p, i) => (
              <Badge key={`${p}-${i}`} variant="secondary" className="text-xs">
                {p}
                <button onClick={() => removeChip('perks', i)} className="ml-1" aria-label="remove">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</p>
        )}

        <p className="text-[11px] text-muted-foreground flex items-start gap-1.5 border-t pt-3">
          <Sparkles className="h-3 w-3 mt-0.5 shrink-0" />
          This layer is what makes the PoliMi pitch: students match on motivation and culture, not just CV keywords.
        </p>
      </CardContent>
    </Card>
  )
}
