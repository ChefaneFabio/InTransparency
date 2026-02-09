'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Link } from '@/navigation'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GraduationCap, Loader2, CheckCircle, Sparkles, Eye, MessageSquare, Briefcase, Star } from 'lucide-react'

export default function StudentRegisterPage() {
  const t = useTranslations('auth')
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'STUDENT'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // First, register the user via API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // If registration successful, sign in automatically
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (signInResult?.error) {
        // Registration succeeded but sign-in failed - redirect to login
        router.push('/auth/login?registered=true')
      } else {
        // Both succeeded - go to dashboard
        router.push('/dashboard/student')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const benefitIcons = [Eye, MessageSquare, Sparkles, Briefcase]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl w-full">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Value Proposition */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <CheckCircle className="h-4 w-4" />
                {t('student.freeBadge')}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('student.heroTitle')}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {t('student.heroSubtitle')}
              </p>

              <div className="space-y-4 mb-8">
                {[0, 1, 2, 3].map((i) => {
                  const Icon = benefitIcons[i]
                  return (
                    <div key={i} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
                      <div className="flex-shrink-0 p-2 bg-teal-100 rounded-lg">
                        <Icon className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{t(`student.benefits.${i}.title`)}</h3>
                        <p className="text-sm text-gray-600">{t(`student.benefits.${i}.description`)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <div className="text-center mb-6 lg:text-left">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl mb-4">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{t('student.createTitle')}</h1>
              <p className="text-gray-600 mt-1">{t('student.createSubtitle')}</p>
            </div>

            {/* Mobile Benefits */}
            <div className="lg:hidden mb-6 p-4 bg-white rounded-xl shadow-sm">
              <div className="flex items-center gap-2 text-teal-600 mb-2">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium text-sm">{t('student.mobileBenefitsTitle')}</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                {[0, 1, 2].map((i) => (
                  <li key={i}>{t(`student.mobileBenefits.${i}`)}</li>
                ))}
              </ul>
            </div>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{t('student.formTitle')}</CardTitle>
                <CardDescription>{t('student.formDescription')}</CardDescription>
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
                  placeholder={t('student.passwordPlaceholder')}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  minLength={8}
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('student.submittingButton')}
                  </>
                ) : (
                  t('student.submitButton')
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {t('student.alreadyHaveAccount')}{' '}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-500">
                  {t('student.signIn')}
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
