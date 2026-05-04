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

type EventType = 'page_view' | 'click' | 'scroll_depth' | 'form_focus' | 'form_submit'

interface QueuedEvent {
  type: EventType
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

const SCROLL_THRESHOLDS = [25, 50, 75, 100]

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

/**
 * Build a selector that pairs the field with its enclosing form, e.g.
 * `form#signup input[name="email"]`. Used for form_focus / form_submit
 * events — never captures field VALUES, only structural metadata.
 */
function buildFormSelector(el: Element): string | null {
  const form = el.closest('form')
  const formPart = form
    ? form.id
      ? `form#${form.id}`
      : form.getAttribute('name')
        ? `form[name="${form.getAttribute('name')}"]`
        : 'form'
    : ''
  const tag = el.tagName.toLowerCase()
  const name = el.getAttribute('name')
  const inputType = el.getAttribute('type')
  let fieldPart = tag
  if (name) fieldPart += `[name="${name.slice(0, 60)}"]`
  else if (inputType) fieldPart += `[type="${inputType}"]`
  if (!formPart && !name) return null
  return [formPart, fieldPart].filter(Boolean).join(' ').slice(0, 200)
}

function buildSubmitFormSelector(form: HTMLFormElement): string {
  if (form.id) return `form#${form.id}`
  const name = form.getAttribute('name')
  if (name) return `form[name="${name.slice(0, 60)}"]`
  const action = form.getAttribute('action')
  if (action) return `form[action="${action.slice(0, 80)}"]`
  return 'form'
}

export function BehaviorTracker() {
  const pathname = usePathname()
  const queueRef = useRef<QueuedEvent[]>([])
  const sessionIdRef = useRef<string>('')
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollFiredRef = useRef<Set<number>>(new Set())

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

  // page_view on every pathname change + reset scroll-depth tracking
  useEffect(() => {
    if (!pathname) return
    scrollFiredRef.current = new Set()
    enqueue({
      type: 'page_view',
      pagePath: pathname,
      referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Global event capture: clicks, scroll-depth, form focus/submit
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

    let scrollRafPending = false
    const onScroll = () => {
      if (scrollRafPending) return
      scrollRafPending = true
      requestAnimationFrame(() => {
        scrollRafPending = false
        const scrolled = window.scrollY + window.innerHeight
        const total = Math.max(document.documentElement.scrollHeight, 1)
        const pct = Math.min(100, Math.round((scrolled / total) * 100))
        for (const threshold of SCROLL_THRESHOLDS) {
          if (pct >= threshold && !scrollFiredRef.current.has(threshold)) {
            scrollFiredRef.current.add(threshold)
            enqueue({
              type: 'scroll_depth',
              pagePath: pathname || window.location.pathname,
              value: threshold,
            })
          }
        }
      })
    }

    const onFocusIn = (ev: FocusEvent) => {
      const target = ev.target as Element | null
      if (!target) return
      const tag = target.tagName.toLowerCase()
      if (tag !== 'input' && tag !== 'textarea' && tag !== 'select') return
      const selector = buildFormSelector(target)
      if (!selector) return
      enqueue({
        type: 'form_focus',
        pagePath: pathname || window.location.pathname,
        selector,
      })
    }

    const onSubmit = (ev: SubmitEvent) => {
      const form = ev.target as HTMLFormElement | null
      if (!form || form.tagName.toLowerCase() !== 'form') return
      enqueue({
        type: 'form_submit',
        pagePath: pathname || window.location.pathname,
        selector: buildSubmitFormSelector(form),
      })
    }

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush(true)
    }
    const onPageHide = () => flush(true)

    document.addEventListener('click', onClick, { capture: true, passive: true })
    document.addEventListener('focusin', onFocusIn, { capture: true })
    document.addEventListener('submit', onSubmit, { capture: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', onPageHide)

    return () => {
      document.removeEventListener('click', onClick, { capture: true })
      document.removeEventListener('focusin', onFocusIn, { capture: true })
      document.removeEventListener('submit', onSubmit, { capture: true })
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', onPageHide)
      if (flushTimerRef.current) clearTimeout(flushTimerRef.current)
      flush(true) // try to drain on unmount
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return null
}
