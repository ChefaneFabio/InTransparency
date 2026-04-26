'use client'

import { useState } from 'react'
import { useRouter, Link } from '@/navigation'
import { useTranslations } from 'next-intl'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { School, Loader2, CheckCircle } from 'lucide-react'
import { ConfettiEffect } from '@/components/engagement/ConfettiEffect'

export default function UniversityRegisterPage() {
  const t = useTranslations('auth')
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    institutionName: '',
    institutionType: 'UNIVERSITY_PUBLIC' as 'UNIVERSITY_PUBLIC' | 'UNIVERSITY_PRIVATE' | 'ITS' | 'SCHOOL',
    country: 'IT',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register/academic-partner', {
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
        // Registration succeeded but auto-login failed — redirect to login
        router.push('/auth/login?registered=true')
      } else {
        setShowConfetti(true)
        router.push('/onboarding')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="segment-university min-h-screen flex items-center justify-center bg-primary/10 py-12 px-4">
      <ConfettiEffect trigger={showConfetti} />
      <div className="max-w-4xl w-full">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Value Proposition */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                <CheckCircle className="h-4 w-4" />
                {t('university.freeBadge')}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('university.heroTitle')}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {t('university.heroSubtitle')}
              </p>

              <div className="space-y-4 mb-8">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex-shrink-0 w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {t(`university.benefits.${index}.title`)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t(`university.benefits.${index}.description`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-800">
                  {t('university.freemiumNote')}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <div className="text-center mb-6 lg:text-left">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-4">
                <School className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{t('university.createTitle')}</h1>
              <p className="text-gray-600 mt-1">{t('university.createSubtitle')}</p>
            </div>

            {/* Mobile Benefits */}
            <div className="lg:hidden mb-6 p-4 bg-white rounded-xl shadow-sm">
              <div className="flex items-center gap-2 text-primary mb-2">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium text-sm">{t('university.mobileBenefitsTitle')}</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>{t('university.mobileBenefits.0')}</li>
                <li>{t('university.mobileBenefits.1')}</li>
                <li>{t('university.mobileBenefits.2')}</li>
                <li>{t('university.mobileBenefits.3')}</li>
              </ul>
            </div>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{t('university.formTitle')}</CardTitle>
                <CardDescription>{t('university.formDescription')}</CardDescription>
              </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div id="form-error" role="alert" className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
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
                    aria-required="true"
                    aria-invalid={!!error}
                    aria-describedby={error ? 'form-error' : undefined}
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
                    aria-required="true"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="institutionName">{t('university.institutionName', { defaultValue: 'Institution name' })}</Label>
                <Input
                  id="institutionName"
                  value={formData.institutionName}
                  onChange={(e) => setFormData(prev => ({ ...prev, institutionName: e.target.value }))}
                  required
                  aria-required="true"
                  placeholder="Università degli Studi di…"
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="institutionType">{t('university.institutionType', { defaultValue: 'Type' })}</Label>
                  <select
                    id="institutionType"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.institutionType}
                    onChange={(e) => setFormData(prev => ({ ...prev, institutionType: e.target.value as typeof prev.institutionType }))}
                    disabled={isLoading}
                  >
                    <option value="UNIVERSITY_PUBLIC">{t('university.types.publicUniversity', { defaultValue: 'Public University' })}</option>
                    <option value="UNIVERSITY_PRIVATE">{t('university.types.privateUniversity', { defaultValue: 'Private University' })}</option>
                    <option value="ITS">{t('university.types.its', { defaultValue: 'ITS Academy' })}</option>
                    <option value="SCHOOL">{t('university.types.school', { defaultValue: 'High School' })}</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="country">{t('university.country', { defaultValue: 'Country' })}</Label>
                  <select
                    id="country"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    disabled={isLoading}
                  >
                    <option value="IT">Italia</option>
                    <option value="DE">Deutschland</option>
                    <option value="FR">France</option>
                    <option value="ES">España</option>
                    <option value="NL">Nederland</option>
                    <option value="PT">Portugal</option>
                    <option value="PL">Polska</option>
                    <option value="RO">România</option>
                    <option value="SE">Sverige</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="email">{t('university.institutionalEmail')}</Label>
                <Input
                  id="email"
                  type="email" autoComplete="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  aria-required="true"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="password">{t('fields.password')}</Label>
                <Input
                  id="password"
                  type="password" autoComplete="new-password"
                  placeholder={t('university.passwordPlaceholder')}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  aria-required="true"
                  minLength={8}
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('university.submittingButton')}
                  </>
                ) : (
                  t('university.submitButton')
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {t('university.alreadyHaveAccount')}{' '}
                <Link href="/auth/login" className="text-primary hover:text-primary">
                  {t('university.signIn')}
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
