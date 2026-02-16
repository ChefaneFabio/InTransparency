'use client'

import { Link } from '@/navigation'
import { ArrowRight, GraduationCap, Building2, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

const segments = [
  { key: 'students', icon: GraduationCap, color: 'from-blue-500 to-blue-600', href: '/auth/register' },
  { key: 'universities', icon: Building2, color: 'from-purple-500 to-purple-600', href: '/contact' },
  { key: 'companies', icon: Briefcase, color: 'from-primary to-secondary', href: '/auth/register' },
] as const

export function CTA() {
  const t = useTranslations('home.cta')

  return (
    <section className="relative py-14 overflow-hidden hero-bg">
      <div className="container relative z-10 max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold tracking-tight text-foreground sm:text-4xl mb-3">
            {t('title')}{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('titleHighlight')}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {segments.map((seg, index) => {
            const Icon = seg.icon
            return (
              <motion.div
                key={seg.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl shadow-sm border border-border p-6 flex flex-col hover:shadow-md transition-shadow"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${seg.color} mb-4 self-start`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {t(`segments.${seg.key}.title`)}
                </h3>
                <p className="text-muted-foreground mb-4 flex-1">
                  {t(`segments.${seg.key}.description`)}
                </p>
                <Button
                  asChild
                  className={`bg-gradient-to-r ${seg.color} hover:opacity-90 w-full`}
                >
                  <Link href={seg.href}>
                    {t(`segments.${seg.key}.cta`)}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
