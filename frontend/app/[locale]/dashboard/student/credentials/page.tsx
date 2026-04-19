'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ShieldCheck, Copy, ExternalLink, Award, Eye, Plus, CheckCircle } from 'lucide-react'

interface IssuedCredential {
  id: string
  credentialType: string
  issuerName: string
  issuerType: string
  status: string
  shareToken: string | null
  viewCount: number
  issuedAt: string
  expiresAt: string | null
  sourceType: string
}

interface IssuableItem {
  sourceType: 'ProfessorEndorsement' | 'StageExperience'
  sourceId: string
  label: string
  subLabel: string
  verifiedAt: string | null
}

interface ApiResponse {
  issued: IssuedCredential[]
  issuable: IssuableItem[]
}

export default function StudentCredentialsPage() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [issuing, setIssuing] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/student/credentials')
    if (res.ok) setData(await res.json())
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const issueOne = async (item: IssuableItem) => {
    setIssuing(`${item.sourceType}:${item.sourceId}`)
    const res = await fetch('/api/credentials/issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceType: item.sourceType, sourceId: item.sourceId }),
    })
    if (res.ok) {
      await load()
    }
    setIssuing(null)
  }

  const copyShareLink = async (credential: IssuedCredential) => {
    if (!credential.shareToken) return
    const url = `${window.location.origin}/credentials/verify/${credential.shareToken}`
    await navigator.clipboard.writeText(url)
    setCopiedId(credential.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
          <ShieldCheck className="h-7 w-7 text-primary" />
          Your verifiable credentials
        </h1>
        <p className="text-muted-foreground">
          Cryptographically signed proofs of your verified work — shareable with employers,
          verifiable without contacting us, compatible with the EU Digital Wallet.
        </p>
      </div>

      {data && data.issuable.length > 0 && (
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Ready to issue ({data.issuable.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              These verified items don&apos;t have credentials yet. Click to issue one.
            </p>
            <div className="space-y-2">
              {data.issuable.map(item => {
                const key = `${item.sourceType}:${item.sourceId}`
                const isIssuing = issuing === key
                return (
                  <div key={key} className="flex items-center gap-3 p-3 bg-background border rounded">
                    <Award className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.subLabel}</div>
                    </div>
                    <Button size="sm" onClick={() => issueOne(item)} disabled={isIssuing}>
                      {isIssuing ? 'Issuing…' : 'Issue'}
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <h2 className="text-xl font-semibold mb-4">Issued credentials</h2>
      {!data || data.issued.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-8">
            <Award className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              No credentials issued yet. Complete a stage or get a professor endorsement to unlock
              credential issuance.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {data.issued.map(c => (
            <Card key={c.id} className={c.status !== 'ISSUED' ? 'opacity-60' : ''}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{c.credentialType.replace(/_/g, ' ')}</h3>
                      <Badge
                        variant={
                          c.status === 'ISSUED' ? 'default' : c.status === 'REVOKED' ? 'destructive' : 'outline'
                        }
                        className="text-xs"
                      >
                        {c.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Issued by <strong>{c.issuerName}</strong> on{' '}
                      {new Date(c.issuedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {c.viewCount} verification{c.viewCount !== 1 ? 's' : ''}
                      </span>
                      {c.expiresAt && (
                        <span>Expires {new Date(c.expiresAt).toLocaleDateString()}</span>
                      )}
                    </div>
                    {c.shareToken && c.status === 'ISSUED' && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyShareLink(c)}
                        >
                          {copiedId === c.id ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 mr-1" />
                              Copy share link
                            </>
                          )}
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a href={`/credentials/verify/${c.shareToken}`} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-6 bg-muted/40">
        <CardContent className="pt-4 pb-4 text-sm text-muted-foreground">
          <p>
            <strong>How verification works:</strong> each share link resolves to a public page that
            verifies the credential&apos;s Ed25519 signature against our published public key at{' '}
            <code className="text-xs">/api/credentials/public-key</code>. An employer can verify
            offline with our public key — no login needed.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
