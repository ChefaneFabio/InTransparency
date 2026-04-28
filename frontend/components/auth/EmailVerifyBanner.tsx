'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations, useLocale } from 'next-intl'
import { Mail, X, Loader2, CheckCircle } from 'lucide-react'

/**
 * Slim banner that appears when the logged-in user's email isn't yet verified.
 * Shows a "Resend" button that calls /api/auth/resend-verification.
 *
 * Drop into role dashboards:
 *   <EmailVerifyBanner />
 *
 * Renders nothing if:
 *   - session is loading
 *   - user is unauthenticated
 *   - user.emailVerified is true
 *   - user has manually dismissed it this session
 *
 * NOTE: dismissal is per-session (in-memory). Banner reappears on next
 * page load until verified. Intentional — verification matters enough
 * that we shouldn't let it disappear forever after one click.
 */
export function EmailVerifyBanner() {
  const { data: session, status } = useSession()
  const t = useTranslations('auth.verifyBanner')
  const locale = useLocale()
  const [dismissed, setDismissed] = useState(false)
  const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  if (status !== 'authenticated') return null
  // session.user.emailVerified is set in the JWT callback when present in the User row.
  if ((session.user as any).emailVerified) return null
  if (dismissed) return null

  const email = session.user.email || ''

  const handleResend = async () => {
    setResendState('sending')
    try {
      const res = await fetch(`/api/auth/resend-verification?locale=${locale}`, { method: 'POST' })
      setResendState(res.ok ? 'sent' : 'error')
    } catch {
      setResendState('error')
    }
  }

  return (
    <div className="border-b border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20">
      <div className="container max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3 text-sm">
        <Mail className="h-4 w-4 text-amber-700 dark:text-amber-400 flex-shrink-0" />

        <div className="flex-1 min-w-0">
          <span className="font-medium text-amber-900 dark:text-amber-200">
            {t('title')}
          </span>{' '}
          <span className="text-amber-800 dark:text-amber-300">
            {t('subtitle', { email })}
          </span>
        </div>

        {resendState === 'sent' ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <CheckCircle className="h-3.5 w-3.5" />
            {t('sent')}
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resendState === 'sending'}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-900 dark:text-amber-200 underline underline-offset-2 hover:no-underline disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {resendState === 'sending' && <Loader2 className="h-3 w-3 animate-spin" />}
            {resendState === 'error' ? t('retry') : t('resend')}
          </button>
        )}

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label={t('dismiss')}
          className="ml-1 text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
