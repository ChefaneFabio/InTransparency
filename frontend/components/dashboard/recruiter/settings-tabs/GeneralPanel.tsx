'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useTranslations } from 'next-intl'
import {
  Loader2,
  Sparkles,
  CheckCircle2,
  Building2,
  Globe,
  MapPin,
  Bell,
  Eye,
  RefreshCw,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'
import { AccountDangerZone } from '@/components/dashboard/shared/AccountDangerZone'

interface Settings {
  companyName: string
  companyWebsite: string
  companyIndustry: string
  companySize: string
  companyLocation: string
  companyDescription: string
  companyLogo: string
  notifyNewApplications: boolean
  notifyMessages: boolean
  notifySearchAlerts: boolean
}

const defaults: Settings = {
  companyName: '',
  companyWebsite: '',
  companyIndustry: '',
  companySize: '',
  companyLocation: '',
  companyDescription: '',
  companyLogo: '',
  notifyNewApplications: true,
  notifyMessages: true,
  notifySearchAlerts: true,
}

const INDUSTRIES = ['tech', 'finance', 'consulting', 'manufacturing', 'healthcare', 'education', 'other'] as const
const SIZES = [
  { value: '1-10', label: '1–10 employees' },
  { value: '11-50', label: '11–50 employees' },
  { value: '51-200', label: '51–200 employees' },
  { value: '201-500', label: '201–500 employees' },
  { value: '500+', label: '500+ employees' },
]

function extractDomain(input: string): string | null {
  if (!input) return null
  const cleaned = input.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '')
  return cleaned.includes('.') ? cleaned : null
}

/**
 * Branded section header — small caps, accent dot, consistent across sections.
 */
function SectionHeader({ icon: Icon, title, hint }: { icon: any; title: string; hint?: string }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md shrink-0">
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">{title}</h3>
        {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
      </div>
    </div>
  )
}

function Toggle({ checked, onChange, label, hint }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-4 py-3 group"
    >
      <div className="text-left flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
      </div>
      <span
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          checked ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-muted'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </span>
    </button>
  )
}

export default function RecruiterSettingsPanel({ embedded = false }: { embedded?: boolean } = {}) {
  const t = useTranslations('recruiterSettings')
  const [settings, setSettings] = useState<Settings>(defaults)
  const [original, setOriginal] = useState<Settings>(defaults)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveState, setSaveState] = useState<'idle' | 'saved'>('idle')
  const [enriching, setEnriching] = useState(false)
  const [enrichError, setEnrichError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/dashboard/recruiter/settings')
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(data => {
        if (data.settings) {
          const next: Settings = {
            companyName: data.settings.companyName || '',
            companyWebsite: data.settings.companyWebsite || '',
            companyIndustry: data.settings.companyIndustry || '',
            companySize: data.settings.companySize || '',
            companyLocation: data.settings.companyLocation || '',
            companyDescription: data.settings.companyDescription || '',
            companyLogo: data.settings.companyLogo || '',
            notifyNewApplications: data.settings.notifyNewApplications ?? true,
            notifyMessages: data.settings.notifyMessages ?? true,
            notifySearchAlerts: data.settings.notifySearchAlerts ?? true,
          }
          setSettings(next)
          setOriginal(next)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const u = (field: keyof Settings, value: string | boolean) =>
    setSettings(prev => ({ ...prev, [field]: value }))

  const isDirty = JSON.stringify(settings) !== JSON.stringify(original)

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/dashboard/recruiter/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error()
      setOriginal(settings)
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2400)
    } catch {
      // silent
    } finally {
      setSaving(false)
    }
  }

  const handleAutoFill = async () => {
    const domain = extractDomain(settings.companyWebsite)
    if (!domain) {
      setEnrichError('Add your company website above first (we use the domain to look up info).')
      return
    }
    setEnrichError(null)
    setEnriching(true)
    try {
      const res = await fetch(`/api/recruiter/enrich-domain?domain=${encodeURIComponent(domain)}&ai=1`)
      if (!res.ok) throw new Error('Lookup failed')
      const data = await res.json()
      if (data.skipped) {
        setEnrichError(data.message || 'Could not auto-fill from this domain.')
        return
      }
      setSettings(prev => ({
        ...prev,
        companyName: prev.companyName || data.companyName || '',
        companyWebsite: prev.companyWebsite || data.companyWebsite || '',
        companyLogo: data.companyLogo || prev.companyLogo,
        companyIndustry: prev.companyIndustry || data.companyIndustry || '',
        companySize: prev.companySize || data.companySize || '',
        companyDescription: prev.companyDescription || data.companyDescription || '',
      }))
    } catch (e: any) {
      setEnrichError(e.message || 'Lookup failed')
    } finally {
      setEnriching(false)
    }
  }

  const handleRefetchLogo = () => {
    const domain = extractDomain(settings.companyWebsite)
    if (!domain) return
    u('companyLogo', `/api/recruiter/logo-proxy?domain=${encodeURIComponent(domain)}`)
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className={embedded ? 'space-y-6 pb-32' : 'max-w-5xl mx-auto space-y-6 pb-32'}>
      {!embedded && (
        <MetricHero gradient="primary">
          <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </MetricHero>
      )}

      {/* ── Two-column layout: form on left, live preview on right ── */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="space-y-6 min-w-0">
          {/* ── BRAND IDENTITY ── */}
          <Card>
            <CardContent className="p-5 sm:p-6">
              <SectionHeader
                icon={Building2}
                title="Brand identity"
                hint="How your company shows up to candidates and partners."
              />

              {/* Auto-fill banner */}
              <div className="mb-5 rounded-xl border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 p-4 flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Auto-fill from your domain
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                    Add your website above and we'll fetch the logo, infer industry + a
                    short description from public info. You can edit anything after.
                  </p>
                  {enrichError && (
                    <p className="text-xs text-rose-700 dark:text-rose-300 mt-2">{enrichError}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={handleAutoFill}
                  disabled={enriching || !settings.companyWebsite}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-white shadow-md shrink-0"
                >
                  {enriching ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                      Auto-fill
                    </>
                  )}
                </Button>
              </div>

              <div className="grid sm:grid-cols-[120px_1fr] gap-5">
                {/* Logo */}
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                    Logo
                  </Label>
                  <div className="aspect-square rounded-xl border-2 border-dashed border-muted bg-muted/30 flex items-center justify-center overflow-hidden relative group">
                    {settings.companyLogo ? (
                      <img
                        src={settings.companyLogo}
                        alt={settings.companyName || 'Logo'}
                        className="w-full h-full object-contain p-2"
                        onError={e => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    ) : (
                      <Building2 className="h-10 w-10 text-muted-foreground/40" />
                    )}
                  </div>
                  {settings.companyWebsite && (
                    <button
                      type="button"
                      onClick={handleRefetchLogo}
                      className="mt-2 w-full inline-flex items-center justify-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Re-fetch
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Company name
                    </Label>
                    <Input
                      value={settings.companyName}
                      onChange={e => u('companyName', e.target.value)}
                      placeholder="Brembo S.p.A."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      Website
                    </Label>
                    <Input
                      value={settings.companyWebsite}
                      onChange={e => u('companyWebsite', e.target.value)}
                      placeholder="https://brembo.it"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                      About <span className="text-muted-foreground/60 normal-case">— shown to candidates</span>
                    </Label>
                    <Textarea
                      value={settings.companyDescription}
                      onChange={e => u('companyDescription', e.target.value)}
                      placeholder="Italian automotive brake systems leader. We hire engineers passionate about high-performance materials and motorsport."
                      rows={3}
                      className="resize-none"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      One short paragraph. Mention what you build and why people stay.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── COMPANY DETAILS ── */}
          <Card>
            <CardContent className="p-5 sm:p-6">
              <SectionHeader
                icon={MapPin}
                title="Company details"
                hint="Used for filtering, fit score, and your public profile."
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Industry</Label>
                  <Select value={settings.companyIndustry} onValueChange={v => u('companyIndustry', v)}>
                    <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map(i => (
                        <SelectItem key={i} value={i}>{t(`company.industries.${i}`, { defaultValue: i.charAt(0).toUpperCase() + i.slice(1) })}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Company size</Label>
                  <Select value={settings.companySize} onValueChange={v => u('companySize', v)}>
                    <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                    <SelectContent>
                      {SIZES.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Headquarters</Label>
                  <Input
                    value={settings.companyLocation}
                    onChange={e => u('companyLocation', e.target.value)}
                    placeholder="Milano, Italy"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── NOTIFICATIONS ── */}
          <Card>
            <CardContent className="p-5 sm:p-6">
              <SectionHeader
                icon={Bell}
                title="Communication preferences"
                hint="Email notifications. You can change these any time."
              />
              <div className="divide-y">
                <Toggle
                  checked={settings.notifyNewApplications}
                  onChange={v => u('notifyNewApplications', v)}
                  label="New applications"
                  hint="Get notified when a candidate applies to one of your jobs."
                />
                <Toggle
                  checked={settings.notifyMessages}
                  onChange={v => u('notifyMessages', v)}
                  label="Messages"
                  hint="Direct messages from candidates and platform updates."
                />
                <Toggle
                  checked={settings.notifySearchAlerts}
                  onChange={v => u('notifySearchAlerts', v)}
                  label="Search alerts"
                  hint="Weekly digest when new verified candidates match your saved searches."
                />
              </div>
            </CardContent>
          </Card>

          {!embedded && <AccountDangerZone />}
        </div>

        {/* ── LIVE PUBLIC-PROFILE PREVIEW ── */}
        <div className="lg:sticky lg:top-4">
          <Card className="overflow-hidden border-2 border-dashed">
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-900 dark:to-blue-950/20 p-3 border-b">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Public profile preview
              </p>
            </div>
            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  {settings.companyLogo ? (
                    <img
                      src={settings.companyLogo}
                      alt=""
                      className="w-full h-full object-contain"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  ) : (
                    <Building2 className="h-6 w-6 text-muted-foreground/50" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {settings.companyName || 'Your company name'}
                  </p>
                  {settings.companyLocation && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {settings.companyLocation}
                    </p>
                  )}
                </div>
              </div>
              {settings.companyIndustry && (
                <Badge variant="outline" className="text-[10px] mb-3">
                  {t(`company.industries.${settings.companyIndustry}`, {
                    defaultValue: settings.companyIndustry.charAt(0).toUpperCase() + settings.companyIndustry.slice(1)
                  })}
                </Badge>
              )}
              {settings.companyDescription ? (
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-5">
                  {settings.companyDescription}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground/50 italic">
                  Add a short description to attract better-fit candidates.
                </p>
              )}
              {settings.companyWebsite && (
                <a
                  href={settings.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline mt-3 inline-flex items-center gap-1"
                >
                  <Globe className="h-3 w-3" />
                  {extractDomain(settings.companyWebsite) || settings.companyWebsite}
                </a>
              )}
            </CardContent>
          </Card>
          <p className="text-[11px] text-muted-foreground mt-2 text-center">
            This is what candidates see on your profile and job postings.
          </p>
        </div>
      </div>

      {/* ── STICKY SAVE BAR — appears when there are unsaved changes ── */}
      <AnimatePresence>
        {(isDirty || saveState === 'saved') && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="fixed bottom-4 inset-x-4 sm:left-auto sm:right-4 sm:max-w-md z-40"
          >
            <div className="rounded-2xl border bg-white dark:bg-slate-900 shadow-2xl p-3 flex items-center gap-3">
              {saveState === 'saved' ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  <p className="text-sm font-medium text-foreground flex-1">All changes saved.</p>
                </>
              ) : (
                <>
                  <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0 ml-2" />
                  <p className="text-sm font-medium text-foreground flex-1">You have unsaved changes.</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSettings(original)}
                    disabled={saving}
                  >
                    Discard
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-white shadow-md"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      'Save changes'
                    )}
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
