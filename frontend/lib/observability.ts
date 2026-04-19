/**
 * Observability — thin indirection layer.
 *
 * Currently wraps `console.*` with structured output. When Sentry (or any
 * other APM) is provisioned, wire it here and every existing caller is
 * upgraded automatically.
 *
 * Usage pattern:
 *   import { captureException, logInfo } from '@/lib/observability'
 *   try { ... } catch (e) { captureException(e, { userId, route: '...' }) }
 */

type Severity = 'fatal' | 'error' | 'warning' | 'info' | 'debug'

interface Tags {
  [key: string]: string | number | boolean | null | undefined
}

// Replace this stub when Sentry is wired:
//   import * as Sentry from '@sentry/nextjs'
//   Sentry.captureException(err, { tags })
function sinkException(err: unknown, tags?: Tags) {
  const msg = err instanceof Error ? err.stack ?? err.message : String(err)
  console.error('[OBS]', JSON.stringify({ severity: 'error', err: msg, tags }))
}

function sinkMessage(msg: string, severity: Severity, tags?: Tags) {
  const line = JSON.stringify({ severity, msg, tags, ts: new Date().toISOString() })
  if (severity === 'error' || severity === 'fatal') console.error('[OBS]', line)
  else if (severity === 'warning') console.warn('[OBS]', line)
  else console.log('[OBS]', line)
}

export function captureException(err: unknown, tags?: Tags): void {
  sinkException(err, tags)
}

export function logInfo(msg: string, tags?: Tags): void {
  sinkMessage(msg, 'info', tags)
}

export function logWarning(msg: string, tags?: Tags): void {
  sinkMessage(msg, 'warning', tags)
}

export function logError(msg: string, tags?: Tags): void {
  sinkMessage(msg, 'error', tags)
}

/**
 * Wraps a Next.js route handler — any thrown error is captured + re-thrown
 * so Next still returns 500.
 */
export function withObservability<Ctx, Res>(
  routeName: string,
  handler: (req: Request, ctx: Ctx) => Promise<Res>
): (req: Request, ctx: Ctx) => Promise<Res> {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx)
    } catch (err) {
      captureException(err, { route: routeName, url: req.url })
      throw err
    }
  }
}
