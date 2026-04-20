'use client'

import { useState } from 'react'
import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Mail,
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'

export default function ForgotPasswordPage() {
  const t = useTranslations('authForgotPassword')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError(t('errorEmailRequired'))
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t('errorEmailInvalid'))
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 2000))

      // For now, just show success message
      setIsEmailSent(true)
    } catch (error) {
      setError(t('errorSendFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    setIsLoading(true)

    try {
      // Simulate resend API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Show success message or handle as needed
    } catch (error) {
      setError(t('errorResendFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Back Link */}
          <div className="flex items-center">
            <Link
              href="/auth/login"
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToSignIn')}
            </Link>
          </div>

          {/* Success Card */}
          <Card>
            <CardContent className="pt-8 pb-6">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {t('checkEmailTitle')}
                  </h1>
                  <p className="text-gray-600">
                    {t('checkEmailDescription')}
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {email}
                  </p>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-foreground mb-2">
                    {t('whatToDoNext')}
                  </h3>
                  <ol className="text-sm text-foreground/80 space-y-1 list-decimal list-inside">
                    <li>{t('step1')}</li>
                    <li>{t('step2')}</li>
                    <li>{t('step3')}</li>
                    <li>{t('step4')}</li>
                  </ol>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    {t('didntReceive')}
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleResendEmail}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('resending')}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {t('resendEmail')}
                      </>
                    )}
                  </Button>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Link
                    href="/auth/login"
                    className="text-sm text-primary hover:text-primary font-medium"
                  >
                    {t('returnToSignIn')}
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back Link */}
        <div className="flex items-center">
          <Link
            href="/auth/login"
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToSignIn')}
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{t('heroTitle')}</h1>
          <p className="mt-2 text-gray-600">
            {t('heroSubtitle')}
          </p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">{t('cardTitle')}</CardTitle>
            <CardDescription className="text-center">
              {t('cardDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">{t('emailLabel')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
                  <Input
                    id="email"
                    type="email" autoComplete="email"
                    placeholder={t('emailPlaceholder')}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError('')
                    }}
                    className={`pl-10 ${error ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('sendingResetLink')}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {t('sendResetLink')}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Additional Help */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <h3 className="text-sm font-medium text-gray-900">
                {t('stillTrouble')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('stillTroubleDescription')}
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="mailto:info@in-transparency.com">
                  {t('contactSupport')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {t('noAccount')}{' '}
            <Link
              href="/auth/register"
              className="font-medium text-primary hover:text-primary"
            >
              {t('signUpHere')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
