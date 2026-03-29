'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'

interface Settings {
  companyName: string; companyWebsite: string; companyIndustry: string
  notifyNewApplications: boolean; companyLocation: string; hiringVolume: string
}

const defaults: Settings = {
  companyName: '', companyWebsite: '', companyIndustry: '',
  notifyNewApplications: true, companyLocation: '', hiringVolume: 'small',
}

export default function RecruiterSettingsPage() {
  const t = useTranslations('recruiterSettings')
  const [settings, setSettings] = useState<Settings>(defaults)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveState, setSaveState] = useState<'idle' | 'saved'>('idle')
  const [showPrefs, setShowPrefs] = useState(false)

  useEffect(() => {
    fetch('/api/dashboard/recruiter/settings')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        if (data.settings) setSettings({
          companyName: data.settings.companyName || '',
          companyWebsite: data.settings.companyWebsite || '',
          companyIndustry: data.settings.companyIndustry || '',
          notifyNewApplications: data.settings.notifyNewApplications ?? true,
          companyLocation: data.settings.companyLocation || '',
          hiringVolume: data.settings.hiringVolume || 'small',
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/dashboard/recruiter/settings', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error()
      setSaveState('saved'); setTimeout(() => setSaveState('idle'), 2000)
    } catch { /* silent */ }
    finally { setSaving(false) }
  }

  const u = (field: keyof Settings, value: string | boolean) => setSettings(prev => ({ ...prev, [field]: value }))

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-muted'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )

  if (loading) return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <Skeleton className="h-7 w-48" /><Skeleton className="h-5 w-72" />
      <Card><CardContent className="p-6 space-y-4">
        <Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" />
      </CardContent></Card>
    </div>
  )

  const industries = ['tech', 'finance', 'consulting', 'manufacturing', 'healthcare', 'education', 'other'] as const

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <Card>
        <CardHeader><CardTitle>{t('company.title')}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>{t('company.name')}</Label>
            <Input value={settings.companyName} onChange={e => u('companyName', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>{t('company.website')}</Label>
            <Input value={settings.companyWebsite} onChange={e => u('companyWebsite', e.target.value)} placeholder="https://" />
          </div>
          <div className="space-y-1">
            <Label>{t('company.industry')}</Label>
            <Select value={settings.companyIndustry} onValueChange={v => u('companyIndustry', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {industries.map(i => <SelectItem key={i} value={i}>{t(`company.industries.${i}`)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="cursor-pointer" onClick={() => setShowPrefs(!showPrefs)}>
          <CardTitle className="flex items-center justify-between">
            {t('preferences.title')}
            <span className="text-sm font-normal text-primary">{showPrefs ? '-' : '+'}</span>
          </CardTitle>
        </CardHeader>
        {showPrefs && (
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t('preferences.notifications')}</p>
                <p className="text-xs text-muted-foreground">{t('preferences.notificationsDesc')}</p>
              </div>
              <Toggle checked={settings.notifyNewApplications} onChange={v => u('notifyNewApplications', v)} />
            </div>
            <div className="space-y-1">
              <Label>{t('preferences.defaultLocation')}</Label>
              <Input value={settings.companyLocation} onChange={e => u('companyLocation', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>{t('preferences.hiringVolume')}</Label>
              <Select value={settings.hiringVolume} onValueChange={v => u('hiringVolume', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">{t('preferences.volumes.small')}</SelectItem>
                  <SelectItem value="medium">{t('preferences.volumes.medium')}</SelectItem>
                  <SelectItem value="large">{t('preferences.volumes.large')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {saving ? t('saving') : saveState === 'saved' ? t('saved') : t('save')}
        </Button>
      </div>
    </div>
  )
}
