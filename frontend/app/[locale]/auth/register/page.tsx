'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/navigation'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { BRAND_IMAGES } from '@/lib/brand-images'

const roles = [
  {
    id: 'student' as const,
    image: '/images/brand/students.jpg', imageAlt: 'Students studying together',
    color: 'bg-primary',
    borderHover: 'hover:border-primary',
    href: '/auth/register/student',
    benefitCount: 4
  },
  {
    id: 'recruiter' as const,
    image: '/images/brand/handshake.jpg', imageAlt: 'Professional handshake between recruiter and candidate',
    color: 'bg-primary',
    borderHover: 'hover:border-primary',
    href: '/auth/register/recruiter',
    benefitCount: 4
  },
  {
    id: 'university' as const,
    image: '/images/brand/campus.jpg', imageAlt: 'University campus building',
    color: 'bg-primary',
    borderHover: 'hover:border-primary',
    href: '/auth/register/academic-partner',
    benefitCount: 4
  },
  {
    id: 'techpark' as const,
    image: '/images/brand/office.jpg', imageAlt: 'Modern tech park office space',
    color: 'bg-primary',
    borderHover: 'hover:border-primary',
    href: '/auth/register/techpark',
    benefitCount: 4
  }
]

export default function RegisterPage() {
  const t = useTranslations('auth')
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get('role')

  // If role is specified in query params, redirect to specific registration
  useEffect(() => {
    if (role) {
      const roleMap: { [key: string]: string } = {
        'student': '/auth/register/student',
        'company': '/auth/register/recruiter',
        'recruiter': '/auth/register/recruiter',
        'university': '/auth/register/academic-partner',
        'institute': '/auth/register/academic-partner',
        'professor': '/auth/register/academic-partner',
        'techpark': '/auth/register/techpark',
        'tech-park': '/auth/register/techpark'
      }
      const targetPath = roleMap[role.toLowerCase()]
      if (targetPath) {
        router.push(targetPath)
      }
    }
  }, [role, router])

  return (
    <div className="min-h-screen hero-bg relative">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img src={BRAND_IMAGES.hero.students} alt="" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/95" />
      </div>
      <div className="relative z-10 pt-8 pb-16">
        <div className="container max-w-6xl">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-primary text-white">
              {t('register.badge')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('register.title')}
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              {t('register.subtitle')}
            </p>
          </motion.div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {roles.map((roleOption, index) => (
                <motion.div
                  key={roleOption.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={`h-full hover:shadow-lg transition-all border-2 ${roleOption.borderHover} overflow-hidden`}>
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={roleOption.image}
                        alt={roleOption.imageAlt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                    <CardHeader className="pt-4">
                      <CardTitle className="text-2xl text-center">
                        {t(`register.roles.${roleOption.id}.name`)}
                      </CardTitle>
                      <CardDescription className="text-center">
                        {t(`register.roles.${roleOption.id}.description`)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {Array.from({ length: roleOption.benefitCount }, (_, i) => (
                          <li key={i} className="flex items-start text-sm text-gray-700">
                            <span className="text-primary font-bold mr-2 flex-shrink-0">✓</span>
                            <span>{t(`register.roles.${roleOption.id}.benefits.${i}`)}</span>
                          </li>
                        ))}
                      </ul>
                      <Button asChild className={`w-full ${roleOption.color}`}>
                        <Link href={roleOption.href}>
                          {t('register.signUpAs')} {t(`register.roles.${roleOption.id}.name`)}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
            ))}
          </div>

          {/* Already Have Account */}
          <div className="text-center">
            <p className="text-gray-600">
              {t('register.alreadyHaveAccount')}{' '}
              <Link href="/auth/login" className="text-primary hover:underline font-semibold">
                {t('register.signIn')}
              </Link>
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-sm text-gray-600">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i}>
                  <div className="font-bold text-2xl text-primary mb-1">
                    {t(`register.trust.${i}.title`)}
                  </div>
                  <div>{t(`register.trust.${i}.subtitle`)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
