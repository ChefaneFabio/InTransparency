'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import {
  User,
  Bell,
  Shield,
  Trash2,
  Save,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
} from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

interface SettingsData {
  email: string
  firstName: string
  lastName: string
  profilePublic: boolean
  availableFor: 'HIRING' | 'PROJECTS' | 'BOTH'
  emailNotifications: boolean
  messageNotifications: boolean
  jobAlertNotifications: boolean
  mentorshipNotifications: boolean
  marketingEmails: boolean
}

export default function StudentSettingsPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const t = useTranslations('studentSettings')

  const [settings, setSettings] = useState<SettingsData>({
    email: '',
    firstName: '',
    lastName: '',
    profilePublic: true,
    availableFor: 'BOTH',
    emailNotifications: true,
    messageNotifications: true,
    jobAlertNotifications: true,
    mentorshipNotifications: true,
    marketingEmails: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Password change
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  // Delete account
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/dashboard/student/profile')
        if (res.ok) {
          const data = await res.json()
          const user = data.user || data
          setSettings({
            email: user.email || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            profilePublic: user.profilePublic ?? true,
            availableFor: user.availableFor || 'BOTH',
            emailNotifications: user.emailNotifications ?? true,
            messageNotifications: user.messageNotifications ?? true,
            jobAlertNotifications: user.jobAlertNotifications ?? true,
            mentorshipNotifications: user.mentorshipNotifications ?? true,
            marketingEmails: user.marketingEmails ?? false,
          })
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/dashboard/student/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: settings.firstName,
          lastName: settings.lastName,
          profilePublic: settings.profilePublic,
          availableFor: settings.availableFor,
          emailNotifications: settings.emailNotifications,
          messageNotifications: settings.messageNotifications,
          jobAlertNotifications: settings.jobAlertNotifications,
          mentorshipNotifications: settings.mentorshipNotifications,
          marketingEmails: settings.marketingEmails,
        }),
      })

      if (res.ok) {
        toast({ title: t('saved'), description: t('savedDescription') })
      } else {
        const data = await res.json()
        toast({ title: t('error'), description: data.error || t('saveFailed'), variant: 'destructive' })
      }
    } catch {
      toast({ title: t('error'), description: t('saveFailed'), variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: t('error'), description: t('passwordMismatch'), variant: 'destructive' })
      return
    }
    if (newPassword.length < 8) {
      toast({ title: t('error'), description: t('passwordTooShort'), variant: 'destructive' })
      return
    }

    setChangingPassword(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (res.ok) {
        toast({ title: t('passwordChanged'), description: t('passwordChangedDescription') })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        const data = await res.json()
        toast({ title: t('error'), description: data.error || t('passwordChangeFailed'), variant: 'destructive' })
      }
    } catch {
      toast({ title: t('error'), description: t('passwordChangeFailed'), variant: 'destructive' })
    } finally {
      setChangingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      toast({ title: t('error'), description: t('typeDeleteToConfirm'), variant: 'destructive' })
      return
    }

    setDeleting(true)
    try {
      const res = await fetch('/api/auth/delete-account', { method: 'DELETE' })
      if (res.ok) {
        window.location.href = '/'
      } else {
        const data = await res.json()
        toast({ title: t('error'), description: data.error || t('deleteFailed'), variant: 'destructive' })
      }
    } catch {
      toast({ title: t('error'), description: t('deleteFailed'), variant: 'destructive' })
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
          <div className="h-48 bg-muted rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <MetricHero gradient="primary">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('subtitle')}</p>
      </MetricHero>

      {/* Account Info */}
      <GlassCard hover={false}>
        <div className="p-5">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('account.title')}
          </h3>
          <p className="text-xs text-muted-foreground mb-4">{t('account.description')}</p>
          <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">{t('account.firstName')}</Label>
              <Input
                id="firstName"
                value={settings.firstName}
                onChange={(e) => setSettings({ ...settings, firstName: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lastName">{t('account.lastName')}</Label>
              <Input
                id="lastName"
                value={settings.lastName}
                onChange={(e) => setSettings({ ...settings, lastName: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">{t('account.email')}</Label>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Input id="email" value={settings.email} disabled className="bg-muted" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{t('account.emailHint')}</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>{t('account.publicProfile')}</Label>
              <p className="text-xs text-muted-foreground">{t('account.publicProfileHint')}</p>
            </div>
            <Switch
              checked={settings.profilePublic}
              onCheckedChange={(checked) => setSettings({ ...settings, profilePublic: checked })}
            />
          </div>

          <Button onClick={handleSaveSettings} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? t('saving') : t('saveChanges')}
          </Button>
          </div>
        </div>
      </GlassCard>

      {/* Availability Mode */}
      <GlassCard hover={false}>
        <div className="p-5">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            {t('availability.title')}
          </h3>
          <p className="text-xs text-muted-foreground mb-4">{t('availability.description')}</p>
          <div className="space-y-4">
          <div>
            <Label>{t('availability.label')}</Label>
            <p className="text-xs text-muted-foreground mb-2">{t('availability.hint')}</p>
            <Select
              value={settings.availableFor}
              onValueChange={(value: 'HIRING' | 'PROJECTS' | 'BOTH') =>
                setSettings({ ...settings, availableFor: value })
              }
            >
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HIRING">{t('availability.hiring')}</SelectItem>
                <SelectItem value="PROJECTS">{t('availability.projects')}</SelectItem>
                <SelectItem value="BOTH">{t('availability.both')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSaveSettings} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? t('saving') : t('saveChanges')}
          </Button>
          </div>
        </div>
      </GlassCard>

      {/* Notifications */}
      <GlassCard hover={false}>
        <div className="p-5">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t('notifications.title')}
          </h3>
          <p className="text-xs text-muted-foreground mb-4">{t('notifications.description')}</p>
          <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: t('notifications.email'), hint: t('notifications.emailHint') },
            { key: 'messageNotifications', label: t('notifications.messages'), hint: t('notifications.messagesHint') },
            { key: 'jobAlertNotifications', label: t('notifications.jobAlerts'), hint: t('notifications.jobAlertsHint') },
            { key: 'mentorshipNotifications', label: t('notifications.mentorship'), hint: t('notifications.mentorshipHint') },
            { key: 'marketingEmails', label: t('notifications.marketing'), hint: t('notifications.marketingHint') },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <Label>{item.label}</Label>
                <p className="text-xs text-muted-foreground">{item.hint}</p>
              </div>
              <Switch
                checked={(settings as any)[item.key]}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, [item.key]: checked })
                }
              />
            </div>
          ))}

          <Button onClick={handleSaveSettings} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? t('saving') : t('saveChanges')}
          </Button>
          </div>
        </div>
      </GlassCard>

      {/* Change Password */}
      <GlassCard hover={false}>
        <div className="p-5">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {t('password.title')}
          </h3>
          <p className="text-xs text-muted-foreground mb-4">{t('password.description')}</p>
          <div className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">{t('password.current')}</Label>
            <div className="relative mt-1">
              <Input
                id="currentPassword"
                type={showPasswords ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPasswords(!showPasswords)}
              >
                {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <Label htmlFor="newPassword">{t('password.new')}</Label>
            <Input
              id="newPassword"
              type={showPasswords ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">{t('password.confirm')}</Label>
            <Input
              id="confirmPassword"
              type={showPasswords ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button
            onClick={handleChangePassword}
            disabled={changingPassword || !currentPassword || !newPassword}
          >
            {changingPassword ? t('password.changing') : t('password.change')}
          </Button>
          </div>
        </div>
      </GlassCard>

      {/* MFA / Two-Factor Authentication */}
      <MfaSection />

      {/* Danger Zone */}
      <GlassCard hover={false}>
        <div className="p-5 border border-red-200 rounded-xl">
          <h3 className="text-sm font-medium flex items-center gap-2 text-red-600">
            <Shield className="h-5 w-5" />
            {t('danger.title')}
          </h3>
          <p className="text-xs text-muted-foreground mb-4">{t('danger.description')}</p>
          <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-800 mb-3">{t('danger.warning')}</p>
            <div>
              <Label htmlFor="deleteConfirm" className="text-red-700">
                {t('danger.typeDelete')}
              </Label>
              <Input
                id="deleteConfirm"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                className="mt-1 border-red-300"
              />
            </div>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleting || deleteConfirm !== 'DELETE'}
              className="mt-3"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleting ? t('danger.deleting') : t('danger.deleteAccount')}
            </Button>
          </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

function MfaSection() {
  const t = useTranslations('studentSettings')
  const { toast } = useToast()

  const [mfaEnabled, setMfaEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [setupStep, setSetupStep] = useState<'idle' | 'qr' | 'verify' | 'backup'>('idle')
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [disablePassword, setDisablePassword] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const checkMfa = async () => {
      try {
        const res = await fetch('/api/user/profile')
        if (res.ok) {
          const data = await res.json()
          setMfaEnabled(data?.totpEnabled || false)
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    checkMfa()
  }, [])

  const handleSetup = async () => {
    setProcessing(true)
    try {
      const res = await fetch('/api/auth/totp/setup', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setQrCode(data.qrCode)
        setSecret(data.secret)
        setSetupStep('qr')
      } else {
        toast({ title: t('error'), description: data.error, variant: 'destructive' })
      }
    } catch {
      toast({ title: t('error'), description: 'Failed to start MFA setup', variant: 'destructive' })
    } finally {
      setProcessing(false)
    }
  }

  const handleVerify = async () => {
    setProcessing(true)
    try {
      const res = await fetch('/api/auth/totp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verifyCode }),
      })
      const data = await res.json()
      if (res.ok) {
        setBackupCodes(data.backupCodes)
        setMfaEnabled(true)
        setSetupStep('backup')
        toast({ title: t('mfa.enabled') })
      } else {
        toast({ title: t('error'), description: data.error, variant: 'destructive' })
      }
    } catch {
      toast({ title: t('error'), description: 'Verification failed', variant: 'destructive' })
    } finally {
      setProcessing(false)
    }
  }

  const handleDisable = async () => {
    setProcessing(true)
    try {
      const res = await fetch('/api/auth/totp/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: disablePassword }),
      })
      const data = await res.json()
      if (res.ok) {
        setMfaEnabled(false)
        setDisablePassword('')
        setSetupStep('idle')
        toast({ title: t('mfa.disabled') })
      } else {
        toast({ title: t('error'), description: data.error, variant: 'destructive' })
      }
    } catch {
      toast({ title: t('error'), description: 'Failed to disable MFA', variant: 'destructive' })
    } finally {
      setProcessing(false)
    }
  }

  if (loading) return null

  return (
    <GlassCard hover={false}>
      <div className="p-5">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {t('mfa.title')}
        </h3>
        <p className="text-xs text-muted-foreground mb-4">{t('mfa.description')}</p>
        <div className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
          <div>
            <p className="text-sm font-medium">{t('mfa.status')}</p>
            <p className="text-xs text-muted-foreground">
              {mfaEnabled ? t('mfa.statusEnabled') : t('mfa.statusDisabled')}
            </p>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-medium ${mfaEnabled ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {mfaEnabled ? t('mfa.on') : t('mfa.off')}
          </div>
        </div>

        {/* Setup flow */}
        {!mfaEnabled && setupStep === 'idle' && (
          <Button onClick={handleSetup} disabled={processing}>
            <Lock className="h-4 w-4 mr-2" />
            {t('mfa.enable')}
          </Button>
        )}

        {setupStep === 'qr' && (
          <div className="space-y-4">
            <p className="text-sm">{t('mfa.scanQr')}</p>
            <div className="flex justify-center">
              {qrCode && <img src={qrCode} alt="QR Code" className="w-48 h-48" />}
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">{t('mfa.manualEntry')}</p>
              <code className="text-xs bg-muted px-2 py-1 rounded select-all">{secret}</code>
            </div>
            <div className="space-y-2">
              <Label>{t('mfa.enterCode')}</Label>
              <Input
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="text-center text-lg tracking-widest"
                inputMode="numeric"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSetupStep('idle')}>{t('mfa.cancel')}</Button>
              <Button onClick={handleVerify} disabled={processing || verifyCode.length < 6}>{t('mfa.verify')}</Button>
            </div>
          </div>
        )}

        {setupStep === 'backup' && (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-800 mb-2">{t('mfa.backupTitle')}</p>
              <p className="text-xs text-yellow-700 mb-3">{t('mfa.backupWarning')}</p>
              <div className="grid grid-cols-2 gap-1">
                {backupCodes.map((code, i) => (
                  <code key={i} className="text-xs bg-white px-2 py-1 rounded border text-center font-mono">
                    {code}
                  </code>
                ))}
              </div>
            </div>
            <Button onClick={() => setSetupStep('idle')}>{t('mfa.done')}</Button>
          </div>
        )}

        {/* Disable MFA */}
        {mfaEnabled && setupStep === 'idle' && (
          <div className="space-y-3 pt-2">
            <Separator />
            <div className="space-y-2">
              <Label>{t('mfa.disableLabel')}</Label>
              <Input
                type="password"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                placeholder={t('mfa.passwordPlaceholder')}
              />
            </div>
            <Button variant="outline" onClick={handleDisable} disabled={processing || !disablePassword}>
              {t('mfa.disable')}
            </Button>
          </div>
        )}
        </div>
      </div>
    </GlassCard>
  )
}
