'use client'

import { motion } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

const HUBSPOT_MEETING_URL = 'https://meetings-eu1.hubspot.com/fabio-chefane'

export function BookingSection() {
  const t = useTranslations('home.booking')

  return (
    <section className="py-14 hero-bg">
      <div className="container max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-10 text-center"
        >
          <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-display font-bold text-foreground mb-3">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            {t('subtitle')}
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <a href={HUBSPOT_MEETING_URL} target="_blank" rel="noopener noreferrer">
              {t('cta')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            {t('note')}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
