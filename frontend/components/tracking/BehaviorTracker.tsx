'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from '@/navigation'
import { getCookieConsent } from '@/components/legal/CookieConsent'

/**
 * Global behavior tracker.
 *
 * Captures page_view (on route change) + click (capture-phase) events
 * and POSTs them in batches to /api/track. Writes feed our own
 * TrackingEvent table — no third-party processor.
 *
 * Privacy:
 *   - Only emits anything if getCookieConsent().analytics === true.
 *     Re-checks consent on every event so toggling consent takes effect
 *     without a page reload.
 *   - Skips clicks inside <input>, <textarea>, contenteditable —
 *     never captures what users type or sensitive form regions.
 *   - Only the *visible text* of the clicked element is captured (first
 *     80 chars, trimmed).
 *   - Never reads localStorage / cookies of third-party origin.
 *
 * Performance:
 *   - Capture-phase listener does only synchronous DOM reads + push to
 *     in-memory queue.
 *   - Flush every 5 s OR when 20 events queued OR on page hide
 *     (sendBeacon, so it survives navigation).
 */

const SESSION_KEY = 'intransparency.behavior.sid'
const FLUSH_MS = 5000
const FLUSH_MAX_EVENTS = 20
const TRACK_ENDPOINT = '/api/track'

type EventType = 'page_view' | 'click'

interface QueuedEvent {
  type: EventType
  pagePath: string
  selector?: string
  text?: string
  x?: number
  y?: number
  vw?: number
  vh?: number
  referrer?: string
}

function getOrCreateSessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY)
    if (existing) return existing
    const fresh = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
    sessionStorage.setItem(SESSION_KEY, fresh)
    return fresh
  } catch {
    return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
  }
}

function consentAllowsAnalytics(): boolean {
  const consent = getCookieConsent()
  return consent?.analytics === true
}

function buildSelector(el: Element): string {
  // Prefer explicit data-track marker if present
  const dataTrack = el.getAttribute('data-track')
  if (dataTrack) return `[data-track="${dataTrack.slice(0, 80)}"]`

  // Walk up to find a meaningful interactive ancestor
  let target: Element | null = el
  for (let depth = 0; depth < 4 && target; depth++) {
    const tag = target.tagName.toLowerCase()
    if (target.id) {
      return `#${target.id}`.slice(0, 100)
    }
    const role = target.getAttribute('role')
    if (tag === 'button' || tag === 'a' || role === 'button' || role === 'link') {
      const cls = (target.getAttribute('class') || '').split(/\s+/).filter(Boolean)[0]
      const href = target.getAttribute('href')
      let sel = tag
      if (cls) sel += `.${cls}`
      if (href) sel += `[href="${href.slice(0, 60)}"]`
      return sel.slice(0, 100)
    }
    target = target.parentElement
  }

  // Fallback: original element tag + first class
  const cls = (el.getAttribute('class') || '').split(/\s+/).filter(Boolean)[0]
  return cls ? `${el.tagName.toLowerCase()}.${cls}` : el.tagName.toLowerCase()
}

function isPrivacySensitive(el: Element | null): boolean {
  if (!el) return false
  const tag = el.tagName.toLowerCase()
  if (tag === 'input' || tag === 'textarea' || tag === 'select' || tag === 'option') return true
  if (el.getAttribute('contenteditable') === 'true') return true
  // Walk up to spot a sensitive container
  let cursor: Element | null = el.parentElement
  for (let depth = 0; depth < 3 && cursor; depth++) {
    if (cursor.getAttribute('data-sensitive') === 'true') return true
    cursor = cursor.parentElement
  }
  return false
}

export function BehaviorTracker() {
  const pathname = usePathname()
  const queueRef = useRef<QueuedEvent[]>([])
  const sessionIdRef = useRef<string>('')
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Set up session id once
  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId()
  }, [])

  const flush = (useBeacon = false) => {
    if (queueRef.current.length === 0) return
    if (!consentAllowsAnalytics()) {
      // Drop the queue silently — consent was revoked between push and flush
      queueRef.current = []
      return
    }
    const events = queueRef.current.splice(0, queueRef.current.length)
    const body = JSON.stringify({
      sessionId: sessionIdRef.current,
      locale: typeof navigator !== 'undefined' ? navigator.language : null,
      events,
    })
    try {
      if (useBeacon && typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' })
        navigator.sendBeacon(TRACK_ENDPOINT, blob)
      } else {
        fetch(TRACK_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        }).catch(() => {
          // Re-queue on failure? No — drop, behavior data isn't critical
        })
      }
    } catch {
      // No-op
    }
  }

  const enqueue = (e: QueuedEvent) => {
    if (!consentAllowsAnalytics()) return
    queueRef.current.push(e)
    if (queueRef.current.length >= FLUSH_MAX_EVENTS) {
      flush()
      return
    }
    if (flushTimerRef.current) clearTimeout(flushTimerRef.current)
    flushTimerRef.current = setTimeout(() => flush(), FLUSH_MS)
  }

  // page_view on every pathname change
  useEffect(() => {
    if (!pathname) return
    enqueue({
      type: 'page_view',
      pagePath: pathname,
      referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Global click capture
  useEffect(() => {
    if (typeof window === 'undefined') return

    const onClick = (ev: MouseEvent) => {
      const target = ev.target as Element | null
      if (!target) return
      if (isPrivacySensitive(target)) return

      const selector = buildSelector(target)
      const rawText = (target as HTMLElement).innerText || target.textContent || ''
      const text = rawText.replace(/\s+/g, ' ').trim().slice(0, 80) || undefined

      enqueue({
        type: 'click',
        pagePath: pathname || window.location.pathname,
        selector,
        text,
        x: Math.round(ev.clientX),
        y: Math.round(ev.clientY),
        vw: window.innerWidth,
        vh: window.innerHeight,
      })
    }

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush(true)
    }

    document.addEventListener('click', onClick, { capture: true, passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', () => flush(true))

    return () => {
      document.removeEventListener('click', onClick, { capture: true })
      document.removeEventListener('visibilitychange', onVisibility)
      // pagehide listener is attached anonymously; replaced on next mount
      if (flushTimerRef.current) clearTimeout(flushTimerRef.current)
      flush(true) // try to drain on unmount
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return null
}
