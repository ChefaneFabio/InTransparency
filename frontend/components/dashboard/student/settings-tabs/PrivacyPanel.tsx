'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
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
export default function PrivacyPanel({ embedded = false }: { embedded?: boolean } = {}) {
  const t = useTranslations('studentPrivacy')
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
        setDeleteError(body.error || t('failed'))
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
    <div className={embedded ? '' : 'container max-w-3xl mx-auto py-8 px-4'}>
      {!embedded && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            {t('title')}
          </h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
      )}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileJson className="h-5 w-5" />
            {t('downloadData')} <Badge variant="outline" className="text-xs">{t('art20')}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">{t('downloadDataDesc')}</p>
          <Button onClick={exportData} disabled={downloading}>
            <Download className="h-4 w-4 mr-2" />
            {downloading ? t('generating') : t('downloadMyDataJson')}
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">{t('yourRightsElsewhere')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span>
              <Badge variant="outline" className="text-xs mr-2">{t('art15')}</Badge>
              Chi ha visto i tuoi dati (audit trail)
            </span>
            <Link
              href="/dashboard/student/privacy/audit-log"
              className="text-primary hover:underline"
            >
              Apri il trail →
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <span>
              <Badge variant="outline" className="text-xs mr-2">{t('art15')}</Badge>
              {t('seeAllMatches')}
            </span>
            <Link href="/dashboard/student/matches" className="text-primary hover:underline">
              {t('matchesLink')}
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <span>
              <Badge variant="outline" className="text-xs mr-2">{t('art16')}</Badge>
              {t('editProfile')}
            </span>
            <Link href="/dashboard/student/profile" className="text-primary hover:underline">
              {t('profileLink')}
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <span>
              <Badge variant="outline" className="text-xs mr-2">{t('aiAct')}</Badge>
              {t('modelCardsAndRegistry')}
            </span>
            <Link href="/algorithm-registry" className="text-primary hover:underline">
              {t('algorithmRegistryLink')}
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <span>{t('consentPreferences')}</span>
            <Link href="/consent" className="text-primary hover:underline">
              {t('consentLink')}
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-red-700">
            <Trash2 className="h-5 w-5" />
            {t('deleteAccount')} <Badge variant="outline" className="text-xs">{t('art17')}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {deleteConfirmed ? (
            <div className="flex gap-2 items-center text-sm text-emerald-700">
              <CheckCircle className="h-5 w-5" />
              {t('accountDeleted')}
            </div>
          ) : (
            <>
              <div className="flex gap-2 items-start p-3 bg-amber-50 border border-amber-200 rounded mb-4">
                <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-900">{t('deleteWarning')}</p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                    {t('currentPassword')}
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={t('currentPasswordPlaceholder')}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                    {t('typeToConfirmBefore')} <code className="bg-muted px-1">DELETE MY ACCOUNT</code> {t('typeToConfirmAfter')}
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
                  {deleting ? t('deleting') : t('permanentlyDelete')}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
