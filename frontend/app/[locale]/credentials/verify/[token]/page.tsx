'use client'

import { useEffect, useState, use } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ShieldCheck, ShieldAlert, XCircle, CheckCircle } from 'lucide-react'

interface VerificationResult {
  valid: boolean
  status: string
  type: string
  issuerName: string
  subjectName: string
  issuedAt: string
  expiresAt: string | null
  payload: any
}

export default function VerifyCredentialPage({
  params,
}: {
  params: Promise<{ token: string; locale: string }>
}) {
  const { token } = use(params)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/credentials/verify/${token}`)
      .then(r => {
        if (r.status === 404) {
          setNotFound(true)
          return null
        }
        return r.json()
      })
      .then(data => data && setResult(data))
      .finally(() => setLoading(false))
  }, [token])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-2xl mx-auto px-4 pt-32 pb-16">
        <div className="mb-6">
          <Badge variant="outline" className="mb-2">Verifiable Credential</Badge>
          <h1 className="text-3xl font-bold">Credential Verification</h1>
          <p className="text-muted-foreground">Cryptographically verified by InTransparency.</p>
        </div>

        {loading && <Skeleton className="h-80 w-full" />}

        {notFound && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6 flex gap-3">
              <XCircle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold">Credential not found</h3>
                <p className="text-sm text-muted-foreground">
                  The share link is invalid or the credential has been removed.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card className={result.valid ? 'border-green-200' : 'border-amber-200'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.valid ? (
                  <>
                    <ShieldCheck className="h-6 w-6 text-green-600" />
                    Valid credential
                  </>
                ) : (
                  <>
                    <ShieldAlert className="h-6 w-6 text-amber-600" />
                    {result.status === 'REVOKED' ? 'Revoked credential' : 'Verification failed'}
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Type</div>
                  <div className="font-medium">{result.type.replace('_', ' ')}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Status</div>
                  <Badge variant={result.valid ? 'default' : 'destructive'}>{result.status}</Badge>
                </div>
                <div>
                  <div className="text-muted-foreground">Subject</div>
                  <div className="font-medium">{result.subjectName}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Issuer</div>
                  <div className="font-medium">{result.issuerName}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Issued</div>
                  <div className="font-medium">{new Date(result.issuedAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Expires</div>
                  <div className="font-medium">
                    {result.expiresAt ? new Date(result.expiresAt).toLocaleDateString() : 'Never'}
                  </div>
                </div>
              </div>

              {result.payload?.credentialSubject && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" /> Claim details
                  </h3>
                  <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                    {JSON.stringify(result.payload.credentialSubject, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  )
}
