'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2, Clock } from 'lucide-react'

/**
 * /auth/verify-email — landing page reached from the email link.
 *
 * Reads ?token=... from the URL, calls /api/auth/verify-email, and
 * renders one of four states:
 *   - verifying: spinner while the API call is in flight
 *   - success: green check + CTA to dashboard
 *   - expired: amber clock + suggestion to log in & resend
 *   - invalid: red X + suggestion to register again or contact support
 */

type VerifyState =
  | { kind: 'verifying' }
  | { kind: 'success'; email: string }
  | { kind: 'error'; reason: 'invalid' | 'expired' | 'user_not_found' | 'missing_token' | 'network' }

export default function VerifyEmailPage() {
  const t = useTranslations('auth.verifyEmail')
  const searchParams = useSearchParams()
  const [state, setState] = useState<VerifyState>({ kind: 'verifying' })

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setState({ kind: 'error', reason: 'missing_token' })
      return
    }

    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(async res => {
        const data = await res.json().catch(() => ({}))
        if (data.ok) {
          setState({ kind: 'success', email: data.email })
        } else {
          setState({
            kind: 'error',
            reason: (data.reason as VerifyState extends { reason: infer R } ? R : never) || 'invalid',
          })
        }
      })
      .catch(() => setState({ kind: 'error', reason: 'network' }))
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/20">
      <Card className="max-w-md w-full">
        <CardContent className="pt-12 pb-10 text-center space-y-5">
          {state.kind === 'verifying' && (
            <>
              <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin" />
              <h1 className="text-xl font-semibold text-foreground">{t('verifying.title')}</h1>
              <p className="text-sm text-muted-foreground">{t('verifying.subtitle')}</p>
            </>
          )}

          {state.kind === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 mx-auto text-emerald-600" />
              <h1 className="text-xl font-semibold text-foreground">{t('success.title')}</h1>
              <p className="text-sm text-muted-foreground">
                {t('success.subtitle', { email: state.email })}
              </p>
              <div className="pt-2">
                <Button asChild>
                  <Link href="/dashboard/student">{t('success.cta')}</Link>
                </Button>
              </div>
            </>
          )}

          {state.kind === 'error' && state.reason === 'expired' && (
            <>
              <Clock className="h-12 w-12 mx-auto text-amber-600" />
              <h1 className="text-xl font-semibold text-foreground">{t('expired.title')}</h1>
              <p className="text-sm text-muted-foreground">{t('expired.subtitle')}</p>
              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link href="/auth/login">{t('expired.signIn')}</Link>
                </Button>
              </div>
            </>
          )}

          {state.kind === 'error' &&
            (state.reason === 'invalid' ||
              state.reason === 'user_not_found' ||
              state.reason === 'missing_token') && (
              <>
                <XCircle className="h-12 w-12 mx-auto text-red-500" />
                <h1 className="text-xl font-semibold text-foreground">{t('invalid.title')}</h1>
                <p className="text-sm text-muted-foreground">{t('invalid.subtitle')}</p>
                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild variant="outline">
                    <Link href="/auth/login">{t('invalid.signIn')}</Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link href="/contact?subject=verify-email-issue">
                      {t('invalid.contact')}
                    </Link>
                  </Button>
                </div>
              </>
            )}

          {state.kind === 'error' && state.reason === 'network' && (
            <>
              <XCircle className="h-12 w-12 mx-auto text-red-500" />
              <h1 className="text-xl font-semibold text-foreground">{t('network.title')}</h1>
              <p className="text-sm text-muted-foreground">{t('network.subtitle')}</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
