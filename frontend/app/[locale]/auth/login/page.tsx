'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Link } from '@/navigation'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion } from 'framer-motion'
import { useSegment } from '@/lib/segment-context'
import { BRAND_IMAGES } from '@/lib/brand-images'
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
  Users,
  Shield,
  Target,
  Briefcase,
} from 'lucide-react'

const segmentConfig = {
  students: {
    icon: GraduationCap,
    accentIcon: Shield,
    gradient: 'from-primary/10 to-primary/5',
  },
  institutions: {
    icon: Building2,
    accentIcon: Target,
    gradient: 'from-primary/10 to-primary/5',
  },
  companies: {
    icon: Briefcase,
    accentIcon: Users,
    gradient: 'from-primary/10 to-primary/5',
  },
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('auth')
  const { segment, setSegment } = useSegment()

  const prefilledEmail = searchParams?.get('email') ?? ''
  const existingAccount = searchParams?.get('existing') === '1'

  const [formData, setFormData] = useState({
    email: prefilledEmail,
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [mfaRequired, setMfaRequired] = useState(false)
  const [mfaUserId, setMfaUserId] = useState('')
  const [totpCode, setTotpCode] = useState('')

  const config = segmentConfig[segment]
  const SegmentIcon = config.icon
  const AccentIcon = config.accentIcon

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

    if (!mfaRequired && !validateForm()) return

    setIsLoading(true)
    setLoginError('')

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        totpCode: mfaRequired ? totpCode : undefined,
        redirect: false,
      })

      if (result?.error) {
        // Check if MFA is required
        if (result.error.includes('MFA_REQUIRED:')) {
          const userId = result.error.split('MFA_REQUIRED:')[1]
          setMfaUserId(userId)
          setMfaRequired(true)
          setTotpCode('')
        } else if (result.error === 'CredentialsSignin') {
          setLoginError(mfaRequired
            ? t('login.invalidMfaCode')
            : t('login.invalidCredentials'))
        } else {
          setLoginError(result.error)
        }
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
      segment: 'students' as const,
      icon: GraduationCap,
      href: '/auth/register/student' as const,
      color: 'text-primary bg-primary/10',
    },
    {
      id: 'university',
      segment: 'institutions' as const,
      icon: Building2,
      href: '/auth/register/academic-partner' as const,
      color: 'text-primary bg-primary/10',
    },
    {
      id: 'recruiter',
      segment: 'companies' as const,
      icon: Users,
      href: '/auth/register/recruiter' as const,
      color: 'text-primary bg-primary/10',
    },
  ]

  return (
    <div className={`min-h-screen flex bg-gradient-to-br ${config.gradient} to-background`}>
      {/* Left side — visual panel with real image (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden">
        <img
          src="/images/brand/team.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/70" />
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-md text-center"
        >
          {/* Animated segment icon */}
          <motion.div
            key={segment}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30"
          >
            <SegmentIcon className="h-12 w-12 text-white" />
          </motion.div>

          <h2 className="text-2xl font-bold text-white mb-3">
            {t('login.title')}
          </h2>
          <p className="text-white/80 mb-8">
            {t('login.subtitle')}
          </p>

          {/* Segment switcher */}
          <div className="inline-flex bg-card rounded-lg p-1 border border-border shadow-sm">
            {(['students', 'institutions', 'companies'] as const).map((seg) => {
              const SIcon = segmentConfig[seg].icon
              return (
                <button
                  key={seg}
                  onClick={() => setSegment(seg)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    segment === seg
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <SIcon className="h-3.5 w-3.5" />
                  {seg === 'students' ? t('login.roles.student') : seg === 'institutions' ? t('login.roles.university') : t('login.roles.recruiter')}
                </button>
              )
            })}
          </div>

          {/* Trust signals */}
          <div className="mt-10 space-y-3">
            {[
              { icon: Shield, text: segment === 'students' ? 'Free forever for students' : segment === 'institutions' ? 'Free for partner institutions' : 'Pay only per contact' },
              { icon: AccentIcon, text: segment === 'students' ? 'Get discovered by companies' : segment === 'institutions' ? 'Track placement outcomes' : 'Verified talent pool' },
            ].map((item, i) => {
              const ItemIcon = item.icon
              return (
                <motion.div
                  key={`${segment}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground justify-center"
                >
                  <ItemIcon className="h-4 w-4 text-primary" />
                  <span>{item.text}</span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Right side — login form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8"
        >
          {/* Mobile header */}
          <div className="text-center lg:hidden">
            <motion.div
              key={segment}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center"
            >
              <SegmentIcon className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold text-foreground">{t('login.title')}</h1>
            <p className="mt-2 text-muted-foreground">{t('login.subtitle')}</p>
          </div>

          {/* Login Form */}
          <Card className="border-border shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">{t('login.cardTitle')}</CardTitle>
              <CardDescription className="text-center">
                {t('login.cardDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Existing-account redirect from /auth/register */}
                {existingAccount && !loginError && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {t('login.existingAccountNotice', {
                        defaultValue:
                          'An account with this email already exists. Sign in below to continue.',
                      })}
                    </AlertDescription>
                  </Alert>
                )}

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
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      type="email" autoComplete="email"
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
                      className="text-sm text-primary hover:text-primary/80"
                    >
                      {t('login.forgotPassword')}
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder={t('login.passwordPlaceholder')}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* MFA Code Input */}
                {mfaRequired && (
                  <div className="space-y-2">
                    <Label htmlFor="totpCode">{t('login.mfaCode')}</Label>
                    <Input
                      id="totpCode"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder={t('login.mfaPlaceholder')}
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                      className="text-center text-lg tracking-widest"
                      autoFocus
                    />
                    <p className="text-xs text-muted-foreground">{t('login.mfaHint')}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || (mfaRequired && !totpCode)}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('login.submittingButton')}
                    </>
                  ) : mfaRequired ? (
                    <>
                      {t('login.verifyMfa')}
                      <ArrowRight className="ml-2 h-4 w-4" />
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
            <p className="text-sm text-muted-foreground">{t('login.noAccount')}</p>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((role) => (
                <Link
                  key={role.id}
                  href={role.href}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border bg-card hover:border-primary/30 hover:shadow-sm transition-all ${
                    segment === role.segment ? 'border-primary/30 ring-1 ring-primary/10' : 'border-border'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${role.color}`}>
                    <role.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {t(`login.roles.${role.id}`)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
