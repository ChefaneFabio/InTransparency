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
import { BookOpen, Loader2, CheckCircle, Award, Users, Star } from 'lucide-react'

export default function ProfessorRegisterPage() {
  const t = useTranslations('auth')
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'PROFESSOR'
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
        router.push('/dashboard/professor')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const benefits = [
    { icon: Award, text: t('register.roles.professor.benefits.0') },
    { icon: Users, text: t('register.roles.professor.benefits.1') },
    { icon: Star, text: t('register.roles.professor.benefits.2') },
    { icon: CheckCircle, text: t('register.roles.professor.benefits.3') },
  ]

  return (
    <div className="min-h-screen hero-bg">
      <main className="pt-24 pb-16">
        <div className="container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Benefits */}
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                  <BookOpen className="h-4 w-4" />
                  {t('register.roles.professor.name')}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {t('register.roles.professor.name')}
                </h1>
                <p className="text-gray-600">
                  {t('register.roles.professor.description')}
                </p>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, i) => {
                  const Icon = benefit.icon
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-gray-700">{benefit.text}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle>{t('register.createAccount')}</CardTitle>
                <CardDescription>{t('register.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">{t('register.firstName')}</Label>
                      <Input
                        id="firstName"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">{t('register.lastName')}</Label>
                      <Input
                        id="lastName"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">{t('register.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="professor@university.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">{t('register.password')}</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      minLength={8}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('register.signUpAs')} {t('register.roles.professor.name')}
                  </Button>
                  <p className="text-center text-sm text-gray-600">
                    {t('register.alreadyHaveAccount')}{' '}
                    <Link href="/auth/login" className="text-primary hover:underline font-semibold">
                      {t('register.signIn')}
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
