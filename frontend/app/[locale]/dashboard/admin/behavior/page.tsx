'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
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
    </div>
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
