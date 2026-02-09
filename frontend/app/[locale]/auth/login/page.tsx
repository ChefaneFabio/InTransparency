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
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  ArrowRight,
  GraduationCap,
  Building2,
  Users
} from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const t = useTranslations('auth')

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: null }))
    }
    if (loginError) {
      setLoginError('')
    }
  }

  const validateForm = () => {
    const newErrors: any = {}

    if (!formData.email.trim()) {
      newErrors.email = t('login.emailRequired')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('login.invalidEmail')
    }

    if (!formData.password.trim()) {
      newErrors.password = t('login.passwordRequired')
    } else if (formData.password.length < 6) {
      newErrors.password = t('login.passwordTooShort')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setLoginError('')

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setLoginError(result.error === 'CredentialsSignin'
          ? t('login.invalidCredentials')
          : result.error)
      } else if (result?.ok) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error: any) {
      setLoginError(t('login.unexpectedError'))
    } finally {
      setIsLoading(false)
    }
  }

  const roles = [
    {
      id: 'student',
      icon: GraduationCap,
      href: '/auth/register/student' as const,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: 'university',
      icon: Building2,
      href: '/auth/register/university' as const,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      id: 'recruiter',
      icon: Users,
      href: '/auth/register/recruiter' as const,
      color: 'text-green-600 bg-green-50',
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{t('login.title')}</h1>
          <p className="mt-2 text-gray-600">
            {t('login.subtitle')}
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">{t('login.cardTitle')}</CardTitle>
            <CardDescription className="text-center">
              {t('login.cardDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Login Error */}
              {loginError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">{t('fields.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('login.emailPlaceholder')}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t('fields.password')}</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    {t('login.forgotPassword')}
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('login.passwordPlaceholder')}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
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
                    {t('login.submittingButton')}
                  </>
                ) : (
                  <>
                    {t('login.submitButton')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Registration Options */}
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">{t('login.noAccount')}</p>
          <div className="grid grid-cols-3 gap-3">
            {roles.map((role) => (
              <Link
                key={role.id}
                href={role.href}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-white hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${role.color}`}>
                  <role.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {t(`login.roles.${role.id}`)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
