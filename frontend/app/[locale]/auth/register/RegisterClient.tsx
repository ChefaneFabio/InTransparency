'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/navigation'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { BRAND_IMAGES } from '@/lib/brand-images'

/**
 * Client UI for the role selector. Rendered when no `?role=` param is
 * present in the URL (otherwise the server page.tsx redirects).
 *
 * Layout: 3 main cards (student / recruiter / university) + a slim
 * "Tech Park manager?" link below — the tech-park audience is real but
 * niche, doesn't deserve 25% of the visual real estate.
 */

const MAIN_ROLES = [
  {
    id: 'student' as const,
    image: '/images/brand/students.jpg',
    imageAlt: 'Students studying together',
    href: '/auth/register/student',
  },
  {
    id: 'recruiter' as const,
    image: '/images/brand/handshake.jpg',
    imageAlt: 'Professional handshake between recruiter and candidate',
    href: '/auth/register/recruiter',
  },
  {
    id: 'university' as const,
    image: '/images/brand/campus.jpg',
    imageAlt: 'University campus building',
    href: '/auth/register/academic-partner',
  },
]

export default function RegisterClient() {
  const t = useTranslations('auth')

  return (
    <div className="min-h-screen hero-bg relative">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={BRAND_IMAGES.hero.students}
          alt=""
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/95" />
      </div>

      <div className="relative z-10 pt-8 pb-16">
        <div className="container max-w-6xl">
          {/* Hero */}
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

          {/* 3-card main grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {MAIN_ROLES.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all border-2 hover:border-primary overflow-hidden flex flex-col">
                  <div className="relative h-36 overflow-hidden">
                    <img src={role.image} alt={role.imageAlt} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <CardHeader className="pt-4">
                    <CardTitle className="text-2xl text-center">
                      {t(`register.roles.${role.id}.name`)}
                    </CardTitle>
                    <CardDescription className="text-center">
                      {t(`register.roles.${role.id}.description`)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-3 mb-6 flex-1">
                      {[0, 1, 2, 3].map(i => (
                        <li key={i} className="flex items-start text-sm text-gray-700">
                          <span className="text-primary font-bold mr-2 flex-shrink-0">✓</span>
                          <span>{t(`register.roles.${role.id}.benefits.${i}`)}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full bg-primary">
                      <Link href={role.href}>
                        {t(`register.roles.${role.id}.name`)}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Tech Park demoted to inline link */}
          <div className="text-center mb-10">
            <p className="text-gray-600 text-sm">
              {t('register.techParkLink')}{' '}
              <Link
                href="/auth/register/techpark"
                className="text-primary hover:underline font-semibold"
              >
                {t('register.techParkLinkCta')} →
              </Link>
            </p>
          </div>

          {/* Already have an account */}
          <div className="text-center">
            <p className="text-gray-600">
              {t('register.alreadyHaveAccount')}{' '}
              <Link href="/auth/login" className="text-primary hover:underline font-semibold">
                {t('register.signIn')}
              </Link>
            </p>
          </div>

          {/* Trust strip — 4 inline phrases, not 8 fragments */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-700">
              {[0, 1, 2, 3].map(i => (
                <span key={i} className="inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden />
                  {t(`register.trust.${i}`)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
