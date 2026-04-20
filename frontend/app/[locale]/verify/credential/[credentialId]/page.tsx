'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertTriangle, Loader2, Award, Building2, User, Calendar } from 'lucide-react'

interface VerifyData {
  valid: boolean
  credentialId: string
  title: string
  description: string | null
  issueDate: string
  expiryDate: string | null
  status: string
  revokedAt: string | null
  revokedReason: string | null
  institutionName: string
  studentName: string
}

export default function VerifyCredentialPage() {
  const params = useParams()
  const locale = useLocale()
  const t = useTranslations('verifyCredential')
  const credentialId = params.credentialId as string
  const [data, setData] = useState<VerifyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const verify = useCallback(async () => {
    try {
      const res = await fetch(`/api/verify/${credentialId}`)
      if (!res.ok) {
        const json = await res.json()
        setError(json.error || t('notFound'))
        return
      }
      const json = await res.json()
      setData(json)
    } catch {
      setError(t('verifyError'))
    } finally {
      setLoading(false)
    }
  }, [credentialId, t])

  useEffect(() => {
    verify()
  }, [verify])

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-GB', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardContent className="py-12 text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700">{t('certificateNotFound')}</h2>
          <p className="text-muted-foreground mt-2">{error || t('certificateNotFoundDesc')}</p>
          <p className="text-xs text-muted-foreground mt-4 font-mono">ID: {credentialId}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Verification Status */}
      <Card className={data.valid ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}>
        <CardContent className="py-8 text-center">
          {data.valid ? (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-green-700">{t('validTitle')}</h2>
              <p className="text-sm text-green-600 mt-1">{t('validDesc')}</p>
            </>
          ) : data.status === 'REVOKED' ? (
            <>
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-700">{t('revokedTitle')}</h2>
              <p className="text-sm text-red-600 mt-1">{t('revokedDesc')}</p>
              {data.revokedReason && (
                <p className="text-xs text-muted-foreground mt-2">{t('reason')}: {data.revokedReason}</p>
              )}
            </>
          ) : (
            <>
              <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-amber-700">{t('expiredTitle')}</h2>
              <p className="text-sm text-amber-600 mt-1">{t('expiredDesc')}</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Certificate Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" /> {t('detailsTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{data.title}</h3>
            {data.description && (
              <p className="text-sm text-muted-foreground mt-1">{data.description}</p>
            )}
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">{t('holder')}</p>
                <p className="font-medium">{data.studentName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">{t('issuedBy')}</p>
                <p className="font-medium">{data.institutionName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">{t('issueDate')}</p>
                <p className="font-medium">{formatDate(data.issueDate)}</p>
              </div>
            </div>
            {data.expiryDate && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">{t('expiryDate')}</p>
                  <p className="font-medium">{formatDate(data.expiryDate)}</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground font-mono">
              {t('credentialIdLabel')}: {data.credentialId}
            </p>
            <Badge variant={data.valid ? 'default' : 'destructive'} className="mt-2">
              {data.status}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
