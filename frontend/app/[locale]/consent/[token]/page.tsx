'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, ShieldX, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react'

interface ConsentInfo {
  consentType: string
  status: string
  studentName: string
  schoolName: string
  requestedAt: string
  expiresAt: string
  isExpired: boolean
  alreadyResponded: boolean
}

export default function PublicConsentPage() {
  const params = useParams()
  const locale = useLocale()
  const t = useTranslations('consentPage')
  const token = params.token as string
  const [consent, setConsent] = useState<ConsentInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [responded, setResponded] = useState(false)
  const [responseStatus, setResponseStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchConsent = useCallback(async () => {
    try {
      const res = await fetch(`/api/consent/${token}`)
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || t('requestNotFound'))
        return
      }
      const data = await res.json()
      setConsent(data)
      if (data.alreadyResponded) {
        setResponded(true)
        setResponseStatus(data.status)
      }
    } catch {
      setError(t('loadError'))
    } finally {
      setLoading(false)
    }
  }, [token, t])

  useEffect(() => {
    fetchConsent()
  }, [fetchConsent])

  const handleResponse = async (response: 'grant' | 'deny') => {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/consent/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response }),
      })
      const data = await res.json()
      if (res.ok) {
        setResponded(true)
        setResponseStatus(data.status)
      } else {
        setError(data.error || t('responseError'))
      }
    } catch {
      setError(t('connectionError'))
    } finally {
      setSubmitting(false)
    }
  }

  const consentTypeLabels: Record<string, string> = {
    data_sharing: t('type_data_sharing'),
    pcto_participation: t('type_pcto_participation'),
    platform_usage: t('type_platform_usage'),
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error && !consent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-lg w-full">
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <p className="text-lg font-medium">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!consent) return null

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold">IT</span>
          </div>
          <h1 className="text-xl font-semibold">InTransparency</h1>
          <p className="text-sm text-muted-foreground">{t('headerSubtitle')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('requestTitle')}</CardTitle>
            <CardDescription>
              {t('requestDesc', { school: consent.schoolName, purpose: consentTypeLabels[consent.consentType] || consent.consentType })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t('student')}</span>
                <span className="font-medium">{consent.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t('school')}</span>
                <span className="font-medium">{consent.schoolName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t('requestedAt')}</span>
                <span>{new Date(consent.requestedAt).toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-GB')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t('expiresAt')}</span>
                <span>{new Date(consent.expiresAt).toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-GB')}</span>
              </div>
            </div>

            {consent.isExpired && !responded ? (
              <div className="text-center py-4">
                <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-2" />
                <p className="font-medium">{t('expiredTitle')}</p>
                <p className="text-sm text-muted-foreground">{t('expiredDesc')}</p>
              </div>
            ) : responded ? (
              <div className="text-center py-6">
                {responseStatus === 'GRANTED' ? (
                  <>
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <p className="text-lg font-medium text-green-700">{t('grantedTitle')}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('grantedDesc')}
                    </p>
                  </>
                ) : (
                  <>
                    <XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                    <p className="text-lg font-medium text-red-700">{t('deniedTitle')}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('deniedDesc')}
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  variant="default"
                  size="lg"
                  onClick={() => handleResponse('grant')}
                  disabled={submitting}
                >
                  <ShieldCheck className="h-5 w-5 mr-2" />
                  {submitting ? t('submitting') : t('authorize')}
                </Button>
                <Button
                  className="flex-1"
                  variant="outline"
                  size="lg"
                  onClick={() => handleResponse('deny')}
                  disabled={submitting}
                >
                  <ShieldX className="h-5 w-5 mr-2" />
                  {submitting ? t('submitting') : t('deny')}
                </Button>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-center text-muted-foreground">
          {t('footerNote')}
        </p>
      </div>
    </div>
  )
}
