'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import { signIn } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle, KeyRound, CheckCircle } from 'lucide-react'

function ClaimInner() {
  const router = useRouter()
  const params = useSearchParams()
  const locale = useLocale()
  const isIt = locale === 'it'
  const token = params?.get('token') ?? ''

  const [loading, setLoading] = useState(true)
  const [tokenError, setTokenError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setTokenError(isIt ? 'Link non valido.' : 'Invalid link.')
      setLoading(false)
      return
    }
    fetch(`/api/auth/claim?token=${encodeURIComponent(token)}`)
      .then(r => r.json())
      .then(data => {
        if (!data.ok) {
          const reason = data.reason as string
          if (reason === 'expired') {
            setTokenError(isIt
              ? 'Questo link è scaduto. Contatta il tuo ufficio placement per riceverne uno nuovo.'
              : 'This link has expired. Contact your placement office for a new one.')
          } else {
            setTokenError(isIt ? 'Link non valido o già usato.' : 'Invalid or already-used link.')
          }
        } else {
          setEmail(data.email ?? '')
          setFirstName(data.firstName ?? '')
        }
      })
      .catch(() => setTokenError(isIt ? 'Errore di rete.' : 'Network error.'))
      .finally(() => setLoading(false))
  }, [token, isIt])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    if (password !== confirm) {
      setSubmitError(isIt ? 'Le password non coincidono.' : 'Passwords do not match.')
      return
    }
    if (password.length < 12) {
      setSubmitError(isIt
        ? 'La password deve essere di almeno 12 caratteri.'
        : 'Password must be at least 12 characters.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setSubmitError(data.error ?? (isIt ? 'Si è verificato un errore.' : 'Something went wrong.'))
        return
      }
      // Auto-sign-in with the new password.
      const signInRes = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      if (signInRes?.error) {
        // Activation succeeded but auto-login failed — send them to the login page.
        router.push(`/${locale}/auth/login?activated=1`)
        return
      }
      router.push('/dashboard/student')
      router.refresh()
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (tokenError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary/5 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              {isIt ? 'Link non valido' : 'Invalid link'}
            </CardTitle>
            <CardDescription>{tokenError}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => router.push(`/${locale}/auth/login`)} className="w-full">
              {isIt ? 'Vai al login' : 'Go to login'}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary/5 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-3">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>{isIt ? 'Attiva il tuo profilo' : 'Activate your profile'}</CardTitle>
          <CardDescription>
            {isIt
              ? `Ciao ${firstName || ''}, scegli una password per accedere al tuo profilo InTransparency.`
              : `Hi ${firstName || ''}, choose a password to access your InTransparency profile.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>{isIt ? 'Email' : 'Email'}</Label>
              <Input value={email} disabled className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="password">{isIt ? 'Nuova password' : 'New password'}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                minLength={12}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={isIt ? 'Almeno 12 caratteri' : 'At least 12 characters'}
                required
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="confirm">{isIt ? 'Conferma password' : 'Confirm password'}</Label>
              <Input
                id="confirm"
                type="password"
                autoComplete="new-password"
                minLength={12}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                className="mt-1.5"
              />
            </div>
            {submitError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{isIt ? 'Attivazione…' : 'Activating…'}</>
              ) : (
                <><CheckCircle className="h-4 w-4 mr-2" />{isIt ? 'Attiva profilo' : 'Activate profile'}</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ClaimPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
      <ClaimInner />
    </Suspense>
  )
}
