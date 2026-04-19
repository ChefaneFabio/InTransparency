'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Download, Trash2, Shield, AlertTriangle, FileJson, CheckCircle } from 'lucide-react'
import { Link } from '@/navigation'

/**
 * Student-facing privacy center — GDPR rights self-service.
 *   Art. 20 (data portability): download all data as JSON
 *   Art. 17 (right to erasure): delete account with password + confirmation phrase
 *   Art. 15 (right to access): covered by existing profile pages + matches index
 *   Art. 16 (rectification): covered by profile editor
 */
export default function PrivacyCenter() {
  const [downloading, setDownloading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPhrase, setConfirmPhrase] = useState('')
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleteConfirmed, setDeleteConfirmed] = useState(false)

  const exportData = async () => {
    setDownloading(true)
    try {
      const res = await fetch('/api/user/data-export')
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `intransparency-data-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  const deleteAccount = async () => {
    setDeleteError(null)
    setDeleting(true)
    try {
      const res = await fetch('/api/user/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: password, confirmPhrase }),
      })
      const body = await res.json()
      if (!res.ok) {
        setDeleteError(body.error || 'Failed')
        return
      }
      setDeleteConfirmed(true)
      // Redirect shortly
      setTimeout(() => {
        window.location.href = '/'
      }, 2500)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
          <Shield className="h-7 w-7 text-primary" />
          Privacy center
        </h1>
        <p className="text-muted-foreground">
          Exercise your GDPR rights. Download everything we hold about you, or erase your account
          permanently. No approval needed — these are your rights, not our favors.
        </p>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileJson className="h-5 w-5" />
            Download your data <Badge variant="outline" className="text-xs">Art. 20</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            A single JSON file with everything: profile, projects, skill graph, endorsements,
            stages, exchanges, matches, credentials, notifications, applications. Machine-readable
            — you can import it into any compatible service.
          </p>
          <Button onClick={exportData} disabled={downloading}>
            <Download className="h-4 w-4 mr-2" />
            {downloading ? 'Generating…' : 'Download my data (JSON)'}
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Your rights — elsewhere on the platform</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span>
              <Badge variant="outline" className="text-xs mr-2">Art. 15</Badge>
              See all matches about you
            </span>
            <Link href="/dashboard/student/matches" className="text-primary hover:underline">
              /matches →
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <span>
              <Badge variant="outline" className="text-xs mr-2">Art. 16</Badge>
              Edit your profile
            </span>
            <Link href="/dashboard/student/profile" className="text-primary hover:underline">
              /profile →
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <span>
              <Badge variant="outline" className="text-xs mr-2">AI Act</Badge>
              Model cards and algorithm registry
            </span>
            <Link href="/algorithm-registry" className="text-primary hover:underline">
              /algorithm-registry →
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <span>Consent preferences (cookies)</span>
            <Link href="/consent" className="text-primary hover:underline">
              /consent →
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-red-700">
            <Trash2 className="h-5 w-5" />
            Delete my account <Badge variant="outline" className="text-xs">Art. 17</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {deleteConfirmed ? (
            <div className="flex gap-2 items-center text-sm text-emerald-700">
              <CheckCircle className="h-5 w-5" />
              Your account has been deleted. Redirecting home…
            </div>
          ) : (
            <>
              <div className="flex gap-2 items-start p-3 bg-amber-50 border border-amber-200 rounded mb-4">
                <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-900">
                  This is permanent. Projects, endorsements, stages, and matches about you will be
                  deleted or anonymized. Verifiable credentials already in third-party wallets
                  will be marked revoked. We can&apos;t recover your data after this.
                </p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                    Current password
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Re-enter your password"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                    Type <code className="bg-muted px-1">DELETE MY ACCOUNT</code> to confirm
                  </label>
                  <Input
                    value={confirmPhrase}
                    onChange={e => setConfirmPhrase(e.target.value)}
                    placeholder="DELETE MY ACCOUNT"
                  />
                </div>
                {deleteError && (
                  <div className="text-sm text-red-600">{deleteError}</div>
                )}
                <Button
                  variant="destructive"
                  onClick={deleteAccount}
                  disabled={
                    deleting ||
                    !password ||
                    confirmPhrase !== 'DELETE MY ACCOUNT'
                  }
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {deleting ? 'Deleting…' : 'Permanently delete my account'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
