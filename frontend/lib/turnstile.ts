/**
 * Cloudflare Turnstile — invisible CAPTCHA replacement.
 * https://developers.cloudflare.com/turnstile/
 *
 * Free, GDPR-friendly (no third-party cookies), no Google dependency.
 *
 * Env vars (set in Vercel for prod, leave unset locally):
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY  — public, embedded in the widget script
 *   TURNSTILE_SECRET_KEY            — server-only, used here for siteverify
 *
 * If either env var is missing, this helper reports {ok:true, skipped:true}
 * — the route handler still runs. This makes local dev painless and lets
 * us ship the wiring before the keys are provisioned in Vercel.
 *
 * For the widget component see components/security/TurnstileWidget.tsx.
 */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export interface TurnstileResult {
  ok: boolean
  skipped: boolean // true when keys aren't configured (local dev)
  errorCodes?: string[]
  hostname?: string
}

export async function verifyTurnstile(
  token: string | null | undefined,
  remoteIp?: string | null
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    // Not provisioned yet — fail-open. Callers can rely on rate-limit +
    // bcrypt + email verification as the existing safety net.
    return { ok: true, skipped: true }
  }
  if (!token) {
    // Soft-rollout: when the secret is set but a route hasn't yet wired the
    // client widget, log so we can spot it, but accept the request to avoid
    // breaking the form. Flip TURNSTILE_REQUIRED=true once every form sends
    // a token (search the codebase for `<TurnstileWidget` to enumerate).
    if (process.env.TURNSTILE_REQUIRED === 'true') {
      return { ok: false, skipped: false, errorCodes: ['missing-input-response'] }
    }
    console.warn('[turnstile] missing token — accepting in soft-rollout mode')
    return { ok: true, skipped: true, errorCodes: ['missing-input-response'] }
  }

  const body = new URLSearchParams()
  body.set('secret', secret)
  body.set('response', token)
  if (remoteIp) body.set('remoteip', remoteIp)

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      body,
      // Turnstile siteverify usually responds in <300ms; cap to avoid
      // hanging the route on a CF outage.
      signal: AbortSignal.timeout(5_000),
    })
    if (!res.ok) {
      return { ok: false, skipped: false, errorCodes: [`http-${res.status}`] }
    }
    const data = (await res.json()) as {
      success: boolean
      'error-codes'?: string[]
      hostname?: string
    }
    return {
      ok: data.success,
      skipped: false,
      errorCodes: data['error-codes'],
      hostname: data.hostname,
    }
  } catch (err) {
    console.error('[turnstile] siteverify failed:', err)
    // Fail-open on Turnstile outage — better degraded UX than DOS.
    // Audit log records the failure if the caller passes one.
    return { ok: true, skipped: true, errorCodes: ['siteverify-error'] }
  }
}
