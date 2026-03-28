'use client'

import { useState } from 'react'
import { useRouter, Link } from '@/navigation'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2, Loader2, CheckCircle, Users, TrendingUp, Target, Shield } from 'lucide-react'

const benefitIcons = [Users, TrendingUp, Target, Shield]

export default function TechParkRegisterPage() {
  const t = useTranslations('auth')
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'TECHPARK'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (signInResult?.error) {
        router.push('/auth/login?registered=true')
      } else {
        router.push('/dashboard/techpark')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 py-12 px-4">
      <div className="max-w-4xl w-full">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Value Proposition */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <CheckCircle className="h-4 w-4" />
                {t('techpark.freeBadge')}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('techpark.heroTitle')}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {t('techpark.heroSubtitle')}
              </p>

              <div className="space-y-4 mb-8">
                {[0, 1, 2, 3].map((i) => {
                  const Icon = benefitIcons[i]
                  return (
                    <div key={i} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
                      <div className="flex-shrink-0 p-2 bg-emerald-100 rounded-lg">
                        <Icon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{t(`techpark.benefits.${i}.title`)}</h3>
                        <p className="text-sm text-gray-600">{t(`techpark.benefits.${i}.description`)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-800">
                  {t('techpark.enterpriseNote')}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <div className="text-center mb-6 lg:text-left">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-600 rounded-2xl mb-4">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{t('techpark.createTitle')}</h1>
              <p className="text-gray-600 mt-1">{t('techpark.createSubtitle')}</p>
            </div>

            {/* Mobile Benefits */}
            <div className="lg:hidden mb-6 p-4 bg-white rounded-xl shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium text-sm">{t('techpark.mobileBenefitsTitle')}</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                {[0, 1, 2, 3].map((i) => (
                  <li key={i}>{t(`techpark.mobileBenefits.${i}`)}</li>
                ))}
              </ul>
            </div>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{t('techpark.formTitle')}</CardTitle>
                <CardDescription>{t('techpark.formDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">{t('fields.firstName')}</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">{t('fields.lastName')}</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">{t('fields.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">{t('fields.password')}</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder={t('techpark.passwordPlaceholder')}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      minLength={8}
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('techpark.submittingButton')}
                      </>
                    ) : (
                      t('techpark.submitButton')
                    )}
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    {t('techpark.alreadyHaveAccount')}{' '}
                    <Link href="/auth/login" className="text-emerald-600 hover:text-emerald-700">
                      {t('techpark.signIn')}
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
