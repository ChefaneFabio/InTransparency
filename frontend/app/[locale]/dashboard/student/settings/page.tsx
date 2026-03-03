'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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
} from 'lucide-react'

interface SettingsData {
  email: string
  firstName: string
  lastName: string
  profilePublic: boolean
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
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: settings.firstName,
          lastName: settings.lastName,
          profilePublic: settings.profilePublic,
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
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded" />
          <div className="h-48 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('account.title')}
          </CardTitle>
          <CardDescription>{t('account.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t('notifications.title')}
          </CardTitle>
          <CardDescription>{t('notifications.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {t('password.title')}
          </CardTitle>
          <CardDescription>{t('password.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Shield className="h-5 w-5" />
            {t('danger.title')}
          </CardTitle>
          <CardDescription>{t('danger.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>
    </div>
  )
}
