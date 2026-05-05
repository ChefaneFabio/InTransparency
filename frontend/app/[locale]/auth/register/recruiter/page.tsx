'use client'

import { useState, useEffect } from 'react'
import { useRouter, Link } from '@/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2, Loader2, CheckCircle, Sparkles, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ConfettiEffect } from '@/components/engagement/ConfettiEffect'
import { CountrySelect } from '@/components/forms/CountrySelect'
import { TurnstileWidget } from '@/components/security/TurnstileWidget'

interface DomainEnrichment {
  skipped?: boolean
  reason?: string
  message?: string
  companyName?: string
  companyWebsite?: string
  companyLogo?: string
  domain?: string
}

const PENDING_ENRICHMENT_KEY = 'intransparency_pending_recruiter_enrichment'

export default function RecruiterRegisterPage() {
  const t = useTranslations('auth')
  const locale = useLocale()
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'RECRUITER',
    country: 'IT',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [enrichment, setEnrichment] = useState<DomainEnrichment | null>(null)
  const [isEnriching, setIsEnriching] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')

  // Debounced domain enrichment as the recruiter types their email
  useEffect(() => {
    const email = formData.email
    if (!email || !email.includes('@') || !email.includes('.')) {
      setEnrichment(null)
      return
    }
    const handle = setTimeout(async () => {
      setIsEnriching(true)
      try {
        const res = await fetch(`/api/recruiter/enrich-domain?email=${encodeURIComponent(email)}`)
        if (res.ok) {
          const data: DomainEnrichment = await res.json()
          setEnrichment(data)
        }
      } catch {
        // silent — enrichment is opportunistic
      } finally {
        setIsEnriching(false)
      }
    }, 600)
    return () => clearTimeout(handle)
  }, [formData.email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, locale, turnstileToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.code === 'EMAIL_EXISTS') {
          router.push(`/auth/login?email=${encodeURIComponent(formData.email)}&existing=1` as any)
          return
        }
        throw new Error(data.error || 'Registration failed')
      }

      // Stash the enrichment so the dashboard can write it to RecruiterSettings
      // on first load (the user is now authenticated post-signin).
      if (enrichment && !enrichment.skipped && enrichment.companyName) {
        try {
          sessionStorage.setItem(
            PENDING_ENRICHMENT_KEY,
            JSON.stringify({
              companyName: enrichment.companyName,
              companyWebsite: enrichment.companyWebsite,
              companyLogo: enrichment.companyLogo,
              domain: enrichment.domain,
            })
          )
        } catch {
          // sessionStorage may be unavailable (private mode); skip silently
        }
      }

      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (signInResult?.error) {
        // Auto-sign-in failed — user has to log in manually. No celebration.
        router.push('/auth/login?registered=true')
      } else {
        setShowConfetti(true)
        router.push('/dashboard/recruiter')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="segment-recruiter min-h-screen flex items-center justify-center bg-primary/10 py-12 px-4">
      <ConfettiEffect trigger={showConfetti} />
      <div className="max-w-4xl w-full">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Value Proposition */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                {t('recruiter.browseBadge')}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('recruiter.heroTitle')}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {t('recruiter.heroSubtitle')}
              </p>

              <div className="space-y-4 mb-8">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex-shrink-0 w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t(`recruiter.benefits.${index}.title`)}</h3>
                      <p className="text-sm text-gray-600">{t(`recruiter.benefits.${index}.description`)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">{t('recruiter.pricing.title')}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('recruiter.pricing.browse')}</span>
                    <span className="font-medium text-primary">{t('recruiter.pricing.browseCost')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('recruiter.pricing.contact')}</span>
                    <span className="font-medium text-gray-900">{t('recruiter.pricing.contactCost')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('recruiter.pricing.postJobs')}</span>
                    <span className="font-medium text-primary">{t('recruiter.pricing.postJobsCost')}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <div className="text-center mb-6 lg:text-left">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-4">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{t('recruiter.createTitle')}</h1>
              <p className="text-gray-600 mt-1">{t('recruiter.createSubtitle')}</p>
            </div>

            {/* Mobile Benefits */}
            <div className="lg:hidden mb-6 p-4 bg-white rounded-xl shadow-sm">
              <div className="flex items-center gap-2 text-primary mb-2">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium text-sm">{t('recruiter.mobileBenefitsTitle')}</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>{t('recruiter.mobileBenefits.0')}</li>
                <li>{t('recruiter.mobileBenefits.1')}</li>
                <li>{t('recruiter.mobileBenefits.2')}</li>
              </ul>
            </div>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{t('recruiter.formTitle')}</CardTitle>
                <CardDescription>{t('recruiter.formDescription')}</CardDescription>
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
                    <Label htmlFor="email">{t('recruiter.workEmail')}</Label>
                    <Input
                      id="email"
                      type="email" autoComplete="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      aria-required="true"
                      disabled={isLoading}
                    />

                    {/* Live domain enrichment preview — shows what we'll auto-fill */}
                    <AnimatePresence mode="wait">
                      {isEnriching && (
                        <motion.div
                          key="enriching"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <Loader2 className="h-3 w-3 animate-spin" />
                          {t('recruiter.enrichment.lookingUp')}
                        </motion.div>
                      )}
                      {!isEnriching && enrichment && enrichment.skipped && enrichment.reason === 'free_provider' && (
                        <motion.div
                          key="free-provider"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-2.5 text-xs text-amber-900 dark:text-amber-200"
                        >
                          <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                          <span>{enrichment.message}</span>
                        </motion.div>
                      )}
                      {!isEnriching && enrichment && !enrichment.skipped && enrichment.companyName && (
                        <motion.div
                          key="enriched"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 flex items-center gap-2.5 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800 p-2.5"
                        >
                          {enrichment.companyLogo && (
                            <img
                              src={enrichment.companyLogo}
                              alt={enrichment.companyName}
                              className="h-7 w-7 rounded bg-white object-contain"
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              {t('recruiter.enrichment.willSetUp')}
                            </p>
                            <p className="text-[11px] text-blue-700 dark:text-blue-300 truncate">
                              {enrichment.companyName} · {enrichment.domain}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div>
                    <Label htmlFor="password">{t('fields.password')}</Label>
                    <Input
                      id="password"
                      type="password" autoComplete="new-password"
                      placeholder={t('recruiter.passwordPlaceholder')}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      aria-required="true"
                      minLength={12}
                      disabled={isLoading}
                    />
                  </div>

                  <CountrySelect
                    value={formData.country}
                    onChange={value => setFormData(prev => ({ ...prev, country: value }))}
                    disabled={isLoading}
                  />

                  <TurnstileWidget onToken={setTurnstileToken} />

                  <Button
                    type="submit"
                    className="w-full bg-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('recruiter.submittingButton')}
                      </>
                    ) : (
                      t('recruiter.submitButton')
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    {t('recruiter.noCreditCard')}
                  </p>
                </form>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    {t('recruiter.alreadyHaveAccount')}{' '}
                    <Link href="/auth/login" className="text-primary hover:text-primary">
                      {t('recruiter.signIn')}
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
