'use client'

import { useEffect, useRef } from 'react'

/**
 * Cloudflare Turnstile widget.
 *
 * Renders the invisible/managed challenge and hands a token back to the
 * parent form via onToken. Token is single-use and expires after ~5 min,
 * so we re-issue if the parent calls reset().
 *
 * If NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset (local dev or pre-rollout),
 * renders nothing and immediately calls onToken('') so the parent form
 * can submit. The server side (lib/turnstile.ts) also fail-opens when
 * keys are missing, so the flow stays consistent.
 */

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
const SCRIPT_ID = 'cf-turnstile-script'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        opts: {
          sitekey: string
          callback?: (token: string) => void
          'error-callback'?: () => void
          'expired-callback'?: () => void
          theme?: 'light' | 'dark' | 'auto'
          size?: 'normal' | 'compact' | 'invisible'
          appearance?: 'always' | 'execute' | 'interaction-only'
        }
      ) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

interface Props {
  onToken: (token: string) => void
  onError?: () => void
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'compact'
}

export function TurnstileWidget({ onToken, onError, theme = 'auto', size = 'normal' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    if (!siteKey) {
      // Disabled — let parent submit immediately
      onToken('')
      return
    }

    let cancelled = false
    const ensureScript = (): Promise<void> =>
      new Promise(resolve => {
        if (typeof window === 'undefined') return resolve()
        if (window.turnstile) return resolve()
        const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
        if (existing) {
          existing.addEventListener('load', () => resolve(), { once: true })
          return
        }
        const s = document.createElement('script')
        s.id = SCRIPT_ID
        s.src = SCRIPT_URL
        s.async = true
        s.defer = true
        s.addEventListener('load', () => resolve(), { once: true })
        document.head.appendChild(s)
      })

    ensureScript().then(() => {
      if (cancelled || !ref.current || !window.turnstile) return
      try {
        widgetIdRef.current = window.turnstile.render(ref.current, {
          sitekey: siteKey,
          theme,
          size,
          callback: token => onToken(token),
          'error-callback': () => onError?.(),
          'expired-callback': () => onToken(''),
        })
      } catch (err) {
        console.error('[turnstile] render failed:', err)
        onError?.()
      }
    })

    return () => {
      cancelled = true
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch {
          /* no-op */
        }
        widgetIdRef.current = null
      }
    }
  // onToken/onError intentionally excluded — re-render would trash the widget.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey, theme, size])

  if (!siteKey) return null
  return <div ref={ref} className="my-3" />
}
