'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
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
  const credentialId = params.credentialId as string
  const [data, setData] = useState<VerifyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const verify = useCallback(async () => {
    try {
      const res = await fetch(`/api/verify/${credentialId}`)
      if (!res.ok) {
        const json = await res.json()
        setError(json.error || 'Certificato non trovato')
        return
      }
      const json = await res.json()
      setData(json)
    } catch {
      setError('Errore durante la verifica')
    } finally {
      setLoading(false)
    }
  }, [credentialId])

  useEffect(() => {
    verify()
  }, [verify])

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('it-IT', {
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
          <h2 className="text-xl font-semibold text-red-700">Certificato Non Trovato</h2>
          <p className="text-muted-foreground mt-2">{error || 'Il certificato richiesto non esiste o non è valido.'}</p>
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
              <h2 className="text-xl font-semibold text-green-700">Certificato Valido</h2>
              <p className="text-sm text-green-600 mt-1">Questo certificato è stato verificato con successo</p>
            </>
          ) : data.status === 'REVOKED' ? (
            <>
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-700">Certificato Revocato</h2>
              <p className="text-sm text-red-600 mt-1">Questo certificato è stato revocato dall&apos;istituto emittente</p>
              {data.revokedReason && (
                <p className="text-xs text-muted-foreground mt-2">Motivo: {data.revokedReason}</p>
              )}
            </>
          ) : (
            <>
              <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-amber-700">Certificato Scaduto</h2>
              <p className="text-sm text-amber-600 mt-1">Questo certificato ha superato la data di scadenza</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Certificate Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" /> Dettagli Certificato
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
                <p className="text-muted-foreground">Intestatario</p>
                <p className="font-medium">{data.studentName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Emesso da</p>
                <p className="font-medium">{data.institutionName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Data di emissione</p>
                <p className="font-medium">{formatDate(data.issueDate)}</p>
              </div>
            </div>
            {data.expiryDate && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Data di scadenza</p>
                  <p className="font-medium">{formatDate(data.expiryDate)}</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground font-mono">
              Credential ID: {data.credentialId}
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
