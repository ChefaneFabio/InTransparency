'use client'

import { useState } from 'react'
import { Link } from '@/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Star, CheckCircle2, GraduationCap, Building2, Briefcase } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { IMAGES } from '@/lib/images'
import { useTranslations } from 'next-intl'

type Segment = 'students' | 'universities' | 'companies'

// Image mappings for each segment
const segmentImages = {
  students: {
    features: [
      IMAGES.features.aiAnalysis,
      IMAGES.students.student4,
      IMAGES.universityCampuses.graduation
    ]
  },
  universities: {
    features: [
      IMAGES.features.search,
      IMAGES.recruiters.recruiter2,
      IMAGES.universityCampuses.campus
    ]
  },
  companies: {
    features: [
      IMAGES.features.search,
      IMAGES.universityCampuses.library,
      IMAGES.success.handshake
    ]
  }
}

const segmentIcons = {
  students: GraduationCap,
  universities: Building2,
  companies: Briefcase
}

export function Hero() {
  const [selectedSegment, setSelectedSegment] = useState<Segment>('companies')
  const t = useTranslations('home.hero')

  // Get current segment translations
  const segment = selectedSegment
  const BadgeIcon = segmentIcons[segment]

  // Get segment-specific translations
  const tSegment = (key: string) => t(`${segment}.${key}`)
  const tFeatures = (index: number, key: string) => t(`${segment}.features.${index}.${key}`)
  const tBenefits = (index: number) => t(`${segment}.benefits.${index}`)

  return (
    <section className="relative overflow-hidden hero-bg py-20 sm:py-32">
      {/* Atmospheric orbs - teal and amber */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Service Model Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4 flex justify-center"
          >
            <div className="text-xs text-gray-600 bg-white/40 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200/50">
              {t('serviceBadge')}
            </div>
          </motion.div>

          {/* Segment Selector */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <div className="inline-flex bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-lg border border-gray-200">
              {(['companies', 'universities', 'students'] as Segment[]).map((seg) => {
                const Icon = segmentIcons[seg]
                return (
                  <button
                    key={seg}
                    onClick={() => setSelectedSegment(seg)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedSegment === seg
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {t(`segmentLabels.${seg === 'universities' ? 'institutes' : seg}`)}
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Dynamic Content with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSegment}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Floating Badge */}
              <motion.div
                className="mb-6 flex justify-center"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Badge className="bg-white/60 backdrop-blur-sm text-gray-700 px-4 py-1.5 text-sm shadow-lg border border-gray-200">
                  <BadgeIcon className="inline h-4 w-4 mr-1.5" />
                  {tSegment('badge')}
                </Badge>
              </motion.div>

              {/* Main heading with display font */}
              <h1 className="text-4xl font-display font-bold tracking-tight text-foreground sm:text-6xl animate-fade-in">
                {tSegment('headlinePart1')}{' '}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {tSegment('headlinePart2')}
                </span>
                {segment === 'companies' && ` ${tSegment('headlinePart3')}`}
              </h1>

              <p className="mt-6 text-lg leading-8 text-foreground/80 max-w-3xl mx-auto animate-fade-in animate-delay-200">
                {tSegment('description')}
                <br />
                <strong className="text-gray-900">{tSegment('descriptionStrong')}</strong>
              </p>

              {/* CTA Buttons - teal/amber theme */}
              <div className="mt-10 flex items-center justify-center gap-x-6 animate-fade-in animate-delay-400">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Link href="/auth/register">
                    {tSegment('primaryCTA')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button variant="outline" size="lg" asChild className="border-2">
                  <Link href={segment === 'companies' ? '/pricing' : '/how-it-works'}>
                    {tSegment('secondaryCTA')}
                  </Link>
                </Button>
              </div>

              {/* Pricing Badge for Companies */}
              {selectedSegment === 'companies' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 flex justify-center"
                >
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
                    <span className="text-2xl font-bold">€10</span>
                    <span className="text-sm opacity-90">per contact • No subscription</span>
                  </div>
                </motion.div>
              )}

              {/* Quick benefits */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm animate-fade-in animate-delay-500">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-card/60 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-border"
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">{tBenefits(index)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 pt-8 border-t border-gray-200"
          >
            <p className="text-sm font-medium text-gray-700 text-center flex items-center justify-center gap-2 mb-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              {tSegment('statsLabel')} {tSegment('statsValue')}
            </p>
            <p className="text-xs text-gray-600 text-center">
              {t('bottomText')}
            </p>
          </motion.div>

          {/* Feature cards - Dynamic based on segment */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <AnimatePresence mode="wait">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={`${selectedSegment}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex flex-col items-center group"
                >
                  <motion.div
                    className="relative rounded-full overflow-hidden w-16 h-16 shadow-md group-hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={segmentImages[segment].features[index]}
                      alt={tFeatures(index, 'title')}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">{tFeatures(index, 'title')}</h3>
                  <p className="text-sm text-gray-600 text-center">
                    {tFeatures(index, 'description')}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* CSS for blob animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  )
}
