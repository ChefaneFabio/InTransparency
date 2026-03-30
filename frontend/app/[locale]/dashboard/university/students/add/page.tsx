'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { Link } from '@/navigation'

export default function AddStudentPage() {
  const router = useRouter()
  const t = useTranslations('addStudent')

  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [degree, setDegree] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/dashboard/university/students/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, lastName, degree }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed')
      setSuccess(true)
      setTimeout(() => router.push('/dashboard/university/students'), 1500)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-2">
        <p className="text-lg font-medium text-primary">{t('success')}</p>
        <p className="text-sm text-muted-foreground">{t('note')}</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto space-y-4 py-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/dashboard/university/students">{t('back')}</Link>
        </Button>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground text-sm">{t('subtitle')}</p>
      </div>

      <Card>
        <CardContent className="pt-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>{t('email')} *</Label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                required
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{t('firstName')}</Label>
                <Input value={firstName} onChange={e => setFirstName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>{t('lastName')}</Label>
                <Input value={lastName} onChange={e => setLastName(e.target.value)} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>{t('degree')}</Label>
              <Input
                value={degree}
                onChange={e => setDegree(e.target.value)}
                placeholder={t('degreePlaceholder')}
                className="mt-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">{t('note')}</p>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={!email.includes('@') || loading} className="w-full">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('sending')}</> : t('send')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
