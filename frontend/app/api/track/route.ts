import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import prisma from '@/lib/prisma'
import { createRateLimit, getClientIp } from '@/lib/rate-limit'

/**
 * POST /api/track
 *
 * Behavior tracking ingestion. Receives batched page_view + click events
 * from <BehaviorTracker /> and writes to TrackingEvent.
 *
 * Privacy:
 *   - Only called when the user has granted analytics consent
 *     (gated client-side via getCookieConsent().analytics).
 *   - IP is recorded as the trailing-octet-zeroed prefix for IPv4 to
 *     reduce identifiability while keeping geographic / abuse-detection
 *     value.
 *   - Auth is optional — anon visitors get null userId.
 *
 * Performance:
 *   - Fire-and-forget for the caller; we never block a request on this.
 *   - Rate-limited per IP to prevent log flooding.
 *   - Uses createMany for batch insert.
 */

const trackLimiter = createRateLimit('track', 200, 60 * 1000) // 200 events/min/IP (batched)

const MAX_BATCH = 50
const MAX_STR = 200
const MAX_TEXT = 80
const MAX_PATH = 300

type IncomingEventType =
  | 'page_view'
  | 'click'
  | 'scroll_depth'
  | 'form_focus'
  | 'form_submit'

interface IncomingEvent {
  type: IncomingEventType
  pagePath: string
  selector?: string
  text?: string
  x?: number
  y?: number
  vw?: number
  vh?: number
  value?: number
  referrer?: string
}

const VALID_TYPES: IncomingEventType[] = [
  'page_view',
  'click',
  'scroll_depth',
  'form_focus',
  'form_submit',
]

function clip(s: unknown, n: number): string | null {
  if (typeof s !== 'string') return null
  return s.slice(0, n)
}

function clipInt(n: unknown, max = 100000): number | null {
  if (typeof n !== 'number' || !Number.isFinite(n)) return null
  return Math.max(0, Math.min(Math.round(n), max))
}

function anonymizeIp(ip: string | null): string | null {
  if (!ip) return null
  // IPv4: zero trailing octet (a.b.c.d → a.b.c.0)
  const m = /^(\d+)\.(\d+)\.(\d+)\.\d+$/.exec(ip)
  if (m) return `${m[1]}.${m[2]}.${m[3]}.0`
  // IPv6: keep first 4 hextets
  if (ip.includes(':')) {
    const parts = ip.split(':')
    return parts.slice(0, 4).join(':') + '::'
  }
  return ip
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const result = trackLimiter.check(ip)
  if (!result.success) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  let body: { sessionId?: string; locale?: string; events?: IncomingEvent[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const sessionId = clip(body.sessionId, 64)
  const events = Array.isArray(body.events) ? body.events.slice(0, MAX_BATCH) : []
  if (!sessionId || events.length === 0) {
    return NextResponse.json({ ok: true, accepted: 0 })
  }

  const session = await getServerSession(authOptions).catch(() => null)
  const userId = session?.user?.id ?? null

  const userAgent = clip(req.headers.get('user-agent'), MAX_STR)
  const anonIp = anonymizeIp(ip)
  const locale = clip(body.locale, 8)

  const rows = events
    .map(e => {
      if (!e || !VALID_TYPES.includes(e.type)) return null
      const pagePath = clip(e.pagePath, MAX_PATH)
      if (!pagePath) return null
      return {
        userId,
        sessionId,
        type: e.type,
        pagePath,
        selector: clip(e.selector, MAX_STR),
        text: clip(e.text, MAX_TEXT),
        x: clipInt(e.x),
        y: clipInt(e.y),
        vw: clipInt(e.vw, 10000),
        vh: clipInt(e.vh, 10000),
        value: clipInt(e.value, 100000),
        referrer: clip(e.referrer, MAX_STR),
        userAgent,
        ip: anonIp,
        locale,
      }
    })
    .filter((r): r is NonNullable<typeof r> => r !== null)

  if (rows.length === 0) {
    return NextResponse.json({ ok: true, accepted: 0 })
  }

  // Fire-and-forget — we don't want to block the client on a write error
  prisma.trackingEvent
    .createMany({ data: rows })
    .catch(err => console.error('[track] insert failed:', err))

  return NextResponse.json({ ok: true, accepted: rows.length })
}
