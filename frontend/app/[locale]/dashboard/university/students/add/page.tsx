'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Link } from '@/navigation'
import { UserPlus, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { GlassCard } from '@/components/dashboard/shared/GlassCard'
import { MetricHero } from '@/components/dashboard/shared/MetricHero'

interface FormData {
  firstName: string
  lastName: string
  email: string
  department: string
  degree: string
  enrollmentYear: string
  expectedGraduation: string
}

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 8 }, (_, i) => String(currentYear - 3 + i))

export default function AddStudentPage() {
  const t = useTranslations('universityAddStudent')
  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    degree: '',
    enrollmentYear: '',
    expectedGraduation: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<{ name: string; email: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const updateField = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.firstName || !form.lastName || !form.email) {
      setError(t('validation.required'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/dashboard/university/students/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || t('error'))
        return
      }

      setSuccess({ name: data.student.name, email: data.student.email })
    } catch {
      setError(t('error'))
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      degree: '',
      enrollmentYear: '',
      expectedGraduation: '',
    })
    setSuccess(null)
    setError(null)
  }

  return (
    <div className="min-h-screen space-y-6">
      <MetricHero gradient="primary">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
            <p className="text-muted-foreground">{t('subtitle')}</p>
          </div>
          <Link href="./"><Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" />{t('backToStudents')}</Button></Link>
        </div>
      </MetricHero>

      {success ? (
        <GlassCard delay={0.1}>
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{t('successTitle')}</h3>
              <p className="text-muted-foreground mt-1">
                {t('successMessage', { name: success.name, email: success.email })}
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={resetForm}><UserPlus className="h-4 w-4 mr-2" />{t('addAnother')}</Button>
              <Link href="./">
                <Button variant="outline">{t('backToStudents')}</Button>
              </Link>
            </div>
          </div>
        </GlassCard>
      ) : (
        <GlassCard delay={0.1}>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t('form.firstName')} *</Label>
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={e => updateField('firstName', e.target.value)}
                  placeholder={t('form.firstNamePlaceholder')}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t('form.lastName')} *</Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={e => updateField('lastName', e.target.value)}
                  placeholder={t('form.lastNamePlaceholder')}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('form.email')} *</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={e => updateField('email', e.target.value)}
                placeholder={t('form.emailPlaceholder')}
                required
              />
              <p className="text-xs text-muted-foreground">{t('form.emailHint')}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="department">{t('form.department')}</Label>
                <Input
                  id="department"
                  value={form.department}
                  onChange={e => updateField('department', e.target.value)}
                  placeholder={t('form.departmentPlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="degree">{t('form.degree')}</Label>
                <Input
                  id="degree"
                  value={form.degree}
                  onChange={e => updateField('degree', e.target.value)}
                  placeholder={t('form.degreePlaceholder')}
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('form.enrollmentYear')}</Label>
                <Select value={form.enrollmentYear} onValueChange={v => updateField('enrollmentYear', v)}>
                  <SelectTrigger><SelectValue placeholder={t('form.selectYear')} /></SelectTrigger>
                  <SelectContent>
                    {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('form.expectedGraduation')}</Label>
                <Select value={form.expectedGraduation} onValueChange={v => updateField('expectedGraduation', v)}>
                  <SelectTrigger><SelectValue placeholder={t('form.selectYear')} /></SelectTrigger>
                  <SelectContent>
                    {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
                {loading ? t('form.adding') : t('form.submit')}
              </Button>
              <Link href="./">
                <Button type="button" variant="outline">{t('form.cancel')}</Button>
              </Link>
            </div>
          </form>
        </GlassCard>
      )}
    </div>
  )
}
