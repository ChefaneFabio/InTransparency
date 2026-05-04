'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AdminSubNav } from '../_components/AdminSubNav'

type Totals = {
  pageViews: number
  clicks: number
  uniqueSessions: number
  uniqueUsers: number
}
type TopPage = { pagePath: string; count: number }
type TopClick = { pagePath: string; selector: string | null; count: number }
type HeatmapPoint = {
  x: number | null
  y: number | null
  vw: number | null
  vh: number | null
  selector: string | null
  text: string | null
}
type ScrollDepth = {
  pagePath: string
  sessions: number
  p25: number
  p50: number
  p75: number
  p100: number
}
type FormStat = {
  pagePath: string
  formSelector: string
  focuses: number
  submits: number
  abandonRate: number
}
type FunnelStep = { path: string; sessions: number; pctOfStart: number; pctOfPrev: number }

const CANVAS_W = 1280
const CANVAS_H = 800

export default function AdminBehaviorPage() {
  const { data: session, status } = useSession()
  const [days, setDays] = useState(7)
  const [totals, setTotals] = useState<Totals | null>(null)
  const [topPages, setTopPages] = useState<TopPage[]>([])
  const [topClicks, setTopClicks] = useState<TopClick[]>([])
  const [heatmapPage, setHeatmapPage] = useState<string>('')
  const [heatmapPoints, setHeatmapPoints] = useState<HeatmapPoint[]>([])
  const [scrollDepth, setScrollDepth] = useState<ScrollDepth[]>([])
  const [forms, setForms] = useState<FormStat[]>([])
  const [funnelInput, setFunnelInput] = useState('')
  const [funnelSteps, setFunnelSteps] = useState<FunnelStep[]>([])
  const [funnelLoading, setFunnelLoading] = useState(false)
  const [funnelError, setFunnelError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Top-level fetch (totals + top lists)
  useEffect(() => {
    if (status !== 'authenticated') return
    let aborted = false
    setLoading(true)
    setError(null)
    fetch(`/api/admin/behavior?days=${days}`)
      .then(async r => {
        if (!r.ok) throw new Error((await r.json()).error || `HTTP ${r.status}`)
        return r.json()
      })
      .then(d => {
        if (aborted) return
        setTotals(d.totals)
        setTopPages(d.topPages || [])
        setTopClicks(d.topClicks || [])
        setScrollDepth(d.scrollDepth || [])
        setForms(d.forms || [])
        if (!heatmapPage && d.topPages?.[0]?.pagePath) {
          setHeatmapPage(d.topPages[0].pagePath)
        }
      })
      .catch(err => !aborted && setError(String(err.message || err)))
      .finally(() => !aborted && setLoading(false))
    return () => {
      aborted = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days, status])

  // Heatmap fetch when page selection or window changes
  useEffect(() => {
    if (status !== 'authenticated' || !heatmapPage) return
    let aborted = false
    fetch(`/api/admin/behavior?days=${days}&page=${encodeURIComponent(heatmapPage)}`)
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (aborted || !d) return
        setHeatmapPoints(d.heatmap?.points || [])
      })
      .catch(() => {})
    return () => {
      aborted = true
    }
  }, [heatmapPage, days, status])

  // Render heatmap
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)

    // Background grid
    ctx.fillStyle = '#fafafa'
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
    ctx.strokeStyle = '#e4e4e7'
    ctx.lineWidth = 1
    for (let i = 1; i < 8; i++) {
      ctx.beginPath()
      ctx.moveTo(0, (CANVAS_H / 8) * i)
      ctx.lineTo(CANVAS_W, (CANVAS_H / 8) * i)
      ctx.stroke()
    }
    for (let i = 1; i < 12; i++) {
      ctx.beginPath()
      ctx.moveTo((CANVAS_W / 12) * i, 0)
      ctx.lineTo((CANVAS_W / 12) * i, CANVAS_H)
      ctx.stroke()
    }

    // Plot each click as a translucent radial dot, normalized by viewport
    for (const p of heatmapPoints) {
      if (p.x == null || p.y == null) continue
      const vw = p.vw && p.vw > 0 ? p.vw : 1280
      const vh = p.vh && p.vh > 0 ? p.vh : 800
      const cx = (p.x / vw) * CANVAS_W
      const cy = (p.y / vh) * CANVAS_H
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 24)
      grad.addColorStop(0, 'rgba(220, 38, 38, 0.45)')
      grad.addColorStop(1, 'rgba(220, 38, 38, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(cx - 24, cy - 24, 48, 48)
    }
  }, [heatmapPoints])

  if (status === 'loading') return <div className="p-8 text-muted-foreground">Loading…</div>
  if (status !== 'authenticated') return <div className="p-8">Not signed in.</div>

  const isAuthorized =
    session?.user?.role === 'ADMIN' ||
    session?.user?.email?.toLowerCase() === 'chefane.fabio@gmail.com'

  if (!isAuthorized) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Forbidden</h1>
      </div>
    )
  }

  const heatmapPagesOptions = useMemo(() => {
    const set = new Set(topPages.map(p => p.pagePath))
    if (heatmapPage) set.add(heatmapPage)
    return Array.from(set)
  }, [topPages, heatmapPage])

  const runFunnel = () => {
    const steps = funnelInput
      .split(/[\n,]/)
      .map(s => s.trim())
      .filter(Boolean)
    if (steps.length < 2) {
      setFunnelError('Add at least 2 paths (one per line or comma-separated).')
      setFunnelSteps([])
      return
    }
    setFunnelError(null)
    setFunnelLoading(true)
    fetch(
      `/api/admin/behavior/funnel?days=${days}&steps=${encodeURIComponent(steps.join(','))}`
    )
      .then(async r => {
        if (!r.ok) throw new Error((await r.json()).error || `HTTP ${r.status}`)
        return r.json()
      })
      .then(d => setFunnelSteps(d.steps || []))
      .catch(err => setFunnelError(String(err.message || err)))
      .finally(() => setFunnelLoading(false))
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Behavior</h1>
        <p className="text-muted-foreground mt-1">
          Page views + clicks. Only consented visitors are tracked. Read-only.
        </p>
      </div>

      <AdminSubNav />

      {error && (
        <div className="p-4 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="text-xs text-muted-foreground">Window</label>
        <Select value={String(days)} onValueChange={v => setDays(parseInt(v, 10))}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Last 24h</SelectItem>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Page views" value={totals?.pageViews} />
        <StatCard label="Clicks" value={totals?.clicks} />
        <StatCard label="Unique sessions" value={totals?.uniqueSessions} />
        <StatCard label="Unique users" value={totals?.uniqueUsers} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-0">
            <div className="px-4 py-3 border-b text-sm font-semibold">Top pages</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Path</TableHead>
                  <TableHead className="w-24 text-right">Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPages.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-6">
                      {loading ? 'Loading…' : 'No page views yet — waiting for consented visitors.'}
                    </TableCell>
                  </TableRow>
                )}
                {topPages.map(p => (
                  <TableRow key={p.pagePath}>
                    <TableCell className="font-mono text-xs">
                      <button
                        type="button"
                        onClick={() => setHeatmapPage(p.pagePath)}
                        className="text-blue-700 hover:underline text-left"
                        title="View click heatmap for this page"
                      >
                        {p.pagePath}
                      </button>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{p.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="px-4 py-3 border-b text-sm font-semibold">Top clicks</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Path · selector</TableHead>
                  <TableHead className="w-24 text-right">Clicks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topClicks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-6">
                      {loading ? 'Loading…' : 'No clicks recorded yet.'}
                    </TableCell>
                  </TableRow>
                )}
                {topClicks.map((c, i) => (
                  <TableRow key={`${c.pagePath}-${c.selector}-${i}`}>
                    <TableCell className="font-mono text-xs">
                      <div className="text-muted-foreground">{c.pagePath}</div>
                      <div>{c.selector}</div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{c.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="text-sm font-semibold">Click density</div>
              <div className="text-xs text-muted-foreground">
                Clicks normalized by viewport, plotted on a 1280×800 canvas. Click any
                page in the table above to switch.
              </div>
            </div>
            <div className="w-full md:w-96">
              <Select value={heatmapPage} onValueChange={setHeatmapPage}>
                <SelectTrigger>
                  <SelectValue placeholder="Pick a page" />
                </SelectTrigger>
                <SelectContent>
                  {heatmapPagesOptions.map(p => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            {heatmapPoints.length} click{heatmapPoints.length === 1 ? '' : 's'} on{' '}
            <span className="font-mono">{heatmapPage || '—'}</span>
          </div>

          <div className="overflow-auto border rounded">
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              className="block"
              style={{ width: '100%', height: 'auto', maxWidth: CANVAS_W }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Scroll depth */}
      <Card>
        <CardContent className="p-0">
          <div className="px-4 py-3 border-b text-sm font-semibold">
            Scroll depth — % of sessions reaching each threshold
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Path</TableHead>
                <TableHead className="w-24 text-right">Sessions</TableHead>
                <TableHead className="w-20 text-right">25%</TableHead>
                <TableHead className="w-20 text-right">50%</TableHead>
                <TableHead className="w-20 text-right">75%</TableHead>
                <TableHead className="w-20 text-right">100%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scrollDepth.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                    {loading ? 'Loading…' : 'No scroll data yet.'}
                  </TableCell>
                </TableRow>
              )}
              {scrollDepth.map(s => (
                <TableRow key={s.pagePath}>
                  <TableCell className="font-mono text-xs">{s.pagePath}</TableCell>
                  <TableCell className="text-right tabular-nums">{s.sessions}</TableCell>
                  <DepthCell pct={s.p25} />
                  <DepthCell pct={s.p50} />
                  <DepthCell pct={s.p75} />
                  <DepthCell pct={s.p100} />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Form abandonment */}
      <Card>
        <CardContent className="p-0">
          <div className="px-4 py-3 border-b text-sm font-semibold">
            Form abandonment — focuses vs submits per form
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Path · form</TableHead>
                <TableHead className="w-24 text-right">Focuses</TableHead>
                <TableHead className="w-24 text-right">Submits</TableHead>
                <TableHead className="w-28 text-right">Abandon %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                    {loading ? 'Loading…' : 'No form interactions yet.'}
                  </TableCell>
                </TableRow>
              )}
              {forms.map((f, i) => (
                <TableRow key={`${f.pagePath}-${f.formSelector}-${i}`}>
                  <TableCell className="font-mono text-xs">
                    <div className="text-muted-foreground">{f.pagePath}</div>
                    <div>{f.formSelector || '(unnamed form)'}</div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{f.focuses}</TableCell>
                  <TableCell className="text-right tabular-nums">{f.submits}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    <span
                      className={
                        f.abandonRate >= 70
                          ? 'text-rose-700 font-medium'
                          : f.abandonRate >= 40
                            ? 'text-amber-700'
                            : 'text-emerald-700'
                      }
                    >
                      {f.abandonRate}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Funnel builder */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <div className="text-sm font-semibold">Funnel</div>
            <div className="text-xs text-muted-foreground">
              Enter 2–6 page paths (one per line, or comma-separated). Counts sessions
              that hit each step *in order* — a session that skips a step doesn&apos;t
              count for later ones.
            </div>
          </div>

          <textarea
            className="w-full min-h-[100px] rounded border bg-background px-3 py-2 text-sm font-mono"
            placeholder={`/it/auth/signup\n/it/onboarding\n/it/dashboard/student`}
            value={funnelInput}
            onChange={e => setFunnelInput(e.target.value)}
          />

          <div className="flex items-center gap-3">
            <Button onClick={runFunnel} disabled={funnelLoading} size="sm">
              {funnelLoading ? 'Running…' : 'Run funnel'}
            </Button>
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => {
                const sample = topPages.slice(0, 3).map(p => p.pagePath).join('\n')
                setFunnelInput(sample)
              }}
            >
              Use top 3 pages
            </button>
          </div>

          {funnelError && (
            <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded">
              {funnelError}
            </div>
          )}

          {funnelSteps.length > 0 && (
            <div className="space-y-2">
              {funnelSteps.map((step, i) => (
                <div key={`${step.path}-${i}`} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono text-xs">{i + 1}. {step.path}</span>
                    <span className="tabular-nums">
                      <span className="font-semibold">{step.sessions.toLocaleString()}</span>
                      <span className="text-muted-foreground">
                        {' · '}
                        {step.pctOfStart}% of start
                        {i > 0 && ` · ${step.pctOfPrev}% from prev`}
                      </span>
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${step.pctOfStart}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function DepthCell({ pct }: { pct: number }) {
  const color =
    pct >= 75 ? 'text-emerald-700' : pct >= 40 ? 'text-amber-700' : 'text-muted-foreground'
  return (
    <TableCell className="text-right tabular-nums">
      <span className={color}>{pct}%</span>
    </TableCell>
  )
}

function StatCard({ label, value }: { label: string; value: number | undefined }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-2xl font-bold tabular-nums">
          {value === undefined ? '—' : value.toLocaleString()}
        </div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </CardContent>
    </Card>
  )
}
