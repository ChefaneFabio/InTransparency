'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
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
        setError(data.error || 'Richiesta non trovata')
        return
      }
      const data = await res.json()
      setConsent(data)
      if (data.alreadyResponded) {
        setResponded(true)
        setResponseStatus(data.status)
      }
    } catch {
      setError('Errore nel caricamento della richiesta')
    } finally {
      setLoading(false)
    }
  }, [token])

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
        setError(data.error || 'Errore durante la risposta')
      }
    } catch {
      setError('Errore di connessione')
    } finally {
      setSubmitting(false)
    }
  }

  const consentTypeLabels: Record<string, string> = {
    data_sharing: 'la condivisione dei dati personali',
    pcto_participation: 'la partecipazione alle attività PCTO',
    platform_usage: "l'utilizzo della piattaforma InTransparency",
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
          <p className="text-sm text-muted-foreground">Richiesta di Consenso Genitoriale</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Richiesta di Autorizzazione</CardTitle>
            <CardDescription>
              {consent.schoolName} richiede il consenso per {consentTypeLabels[consent.consentType] || consent.consentType} per lo/la studente/essa:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Studente</span>
                <span className="font-medium">{consent.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Scuola</span>
                <span className="font-medium">{consent.schoolName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Richiesto il</span>
                <span>{new Date(consent.requestedAt).toLocaleDateString('it-IT')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Scade il</span>
                <span>{new Date(consent.expiresAt).toLocaleDateString('it-IT')}</span>
              </div>
            </div>

            {consent.isExpired && !responded ? (
              <div className="text-center py-4">
                <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-2" />
                <p className="font-medium">Questa richiesta è scaduta</p>
                <p className="text-sm text-muted-foreground">Contattare la scuola per una nuova richiesta.</p>
              </div>
            ) : responded ? (
              <div className="text-center py-6">
                {responseStatus === 'GRANTED' ? (
                  <>
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <p className="text-lg font-medium text-green-700">Consenso Autorizzato</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Grazie. Il consenso è stato registrato con successo.
                    </p>
                  </>
                ) : (
                  <>
                    <XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                    <p className="text-lg font-medium text-red-700">Consenso Negato</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      La risposta è stata registrata. Lo studente non sarà autorizzato.
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
                  {submitting ? 'Invio...' : 'Autorizzo'}
                </Button>
                <Button
                  className="flex-1"
                  variant="outline"
                  size="lg"
                  onClick={() => handleResponse('deny')}
                  disabled={submitting}
                >
                  <ShieldX className="h-5 w-5 mr-2" />
                  {submitting ? 'Invio...' : 'Non autorizzo'}
                </Button>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-center text-muted-foreground">
          Questa pagina è protetta e accessibile solo tramite il link inviato via email.
          In caso di dubbi, contattare direttamente la scuola.
        </p>
      </div>
    </div>
  )
}
