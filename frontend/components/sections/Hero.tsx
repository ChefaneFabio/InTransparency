'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Star, CheckCircle2, GraduationCap, Building2, Briefcase } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { IMAGES } from '@/lib/images'

type Segment = 'students' | 'universities' | 'companies'

const segmentContent = {
  students: {
    badge: 'For Students - All Disciplines',
    badgeIcon: GraduationCap,
    headline: (
      <>
        Your Institution Verifies.{' '}
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Companies Trust You.
        </span>
      </>
    ),
    description: (
      <>
        Upload projects (theses, stage curriculare, portfolios). Your institution authenticates them. Companies discover 100% verified competencies - no resume inflation.
        <br />
        <strong className="text-gray-900">🎓 Institution-stamped skills for Tech, Business, Law, Engineering, Design & more.</strong>
      </>
    ),
    primaryCTA: {
      text: 'Get Started Free',
      href: '/auth/register/role-selection',
      icon: ArrowRight
    },
    secondaryCTA: {
      text: 'See How It Works',
      href: '/how-it-works'
    },
    benefits: [
      { icon: CheckCircle2, text: 'Institution-verified skills' },
      { icon: CheckCircle2, text: '100% traceable competencies' },
      { icon: CheckCircle2, text: 'Companies discover verified YOU' }
    ],
    features: [
      {
        image: IMAGES.features.aiAnalysis,
        title: 'Institution-Authenticated Skills',
        description: 'Your university/ITS verifies your competencies (grades, projects, stage curriculare) - companies see 100% authentic proof'
      },
      {
        image: IMAGES.students.student4,
        title: 'All Disciplines Verified',
        description: 'Tech, Business, Law, Engineering, Design - every field gets institutional authentication (30/30 thesis? ITS project? All stamped)'
      },
      {
        image: IMAGES.universityCampuses.graduation,
        title: 'Traceable to Source',
        description: 'Every competency shows institution badge: "Verified by Politecnico" or "Endorsed by ITS G. Natta" - no fake credentials'
      }
    ],
    stats: {
      label: 'Join students building verified portfolios',
      value: 'across all disciplines and fields'
    }
  },
  universities: {
    badge: 'For Institutes - Universities & ITS',
    badgeIcon: Building2,
    headline: (
      <>
        Be the{' '}
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Verification Authority.
        </span>
      </>
    ),
    description: (
      <>
        Free integration with Esse3/Moodle/your CRM. You authenticate student competencies (grades, projects, tirocini) - companies trust your stamp. Track placement analytics.
        <br />
        <strong className="text-gray-900">🎓 100% Free verification layer - no fees, no subscriptions.</strong>
      </>
    ),
    primaryCTA: {
      text: 'Become a Partner',
      href: '/auth/register/role-selection',
      icon: ArrowRight
    },
    secondaryCTA: {
      text: 'View Pricing',
      href: '/pricing'
    },
    benefits: [
      { icon: CheckCircle2, text: 'Free Esse3/Moodle integration' },
      { icon: CheckCircle2, text: 'You authenticate competencies' },
      { icon: CheckCircle2, text: 'Track placement from your stamp' }
    ],
    features: [
      {
        image: IMAGES.features.dataAnalytics,
        title: 'Auto-Import & Verify',
        description: 'Connect Esse3/Moodle → We import grades/projects → You click "Verify" → Student profile activates with YOUR institutional badge'
      },
      {
        image: IMAGES.recruiters.recruiter2,
        title: 'Your Credibility = Student Success',
        description: 'Companies trust "Verified by Politecnico" or "ITS G. Natta endorsed" - your stamp increases placement by 25%'
      },
      {
        image: IMAGES.universityCampuses.campus,
        title: 'Placement Analytics Dashboard',
        description: 'Track: "47 ITS students contacted by companies → 23 hired via your verification" - prove your impact to MIUR'
      }
    ],
    stats: {
      label: 'Seamless integration with',
      value: 'university data systems (Esse3, Moodle, etc.)'
    }
  },
  companies: {
    badge: 'For Companies - All Talent',
    badgeIcon: Briefcase,
    headline: (
      <>
        Hire{' '}
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Institution-Verified Talent,
        </span>{' '}
        Not Resumes.
      </>
    ),
    description: (
      <>
        Search verified competencies (100% authentic, stamped by universities/ITS). See projects, 30/30 grades, stage curriculare - all institution-authenticated. Pay €10 per contact.
        <br />
        <strong className="text-gray-900">🎓 Every skill traceable to educational source - zero resume inflation.</strong>
      </>
    ),
    primaryCTA: {
      text: 'Start Exploring Free',
      href: '/auth/register/role-selection',
      icon: ArrowRight
    },
    secondaryCTA: {
      text: 'View Pricing',
      href: '/pricing'
    },
    benefits: [
      { icon: CheckCircle2, text: '100% institution-verified' },
      { icon: CheckCircle2, text: 'Traceable to educational source' },
      { icon: CheckCircle2, text: 'Zero resume inflation' }
    ],
    features: [
      {
        image: IMAGES.features.search,
        title: 'Search Verified Talent Pools',
        description: 'Query by skill → See "AutoCAD: Verified by ITS Rizzoli, 28/30 project grade" - every competency stamped by institution'
      },
      {
        image: IMAGES.universityCampuses.library,
        title: 'Institution Authentication Badges',
        description: 'Every profile shows: "Verified by Politecnico Milano" or "ITS G. Natta endorsed" - trust the source, not the student claim'
      },
      {
        image: IMAGES.success.handshake,
        title: '92% Match Accuracy',
        description: 'Institution-verified competencies = 30-40% fewer mismatches vs. self-reported Indeed CVs - hire confidently'
      }
    ],
    stats: {
      label: 'Access verified talent from',
      value: 'universities, ITS academies, and vocational schools'
    }
  }
}

export function Hero() {
  const [selectedSegment, setSelectedSegment] = useState<Segment>('students')
  const content = segmentContent[selectedSegment]
  const BadgeIcon = content.badgeIcon

  return (
    <section className="relative overflow-hidden hero-bg py-20 sm:py-32">
      {/* Atmospheric orbs - teal and amber */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Segment Selector */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <div className="inline-flex bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-lg border border-gray-200">
              {(['students', 'universities', 'companies'] as Segment[]).map((segment) => {
                const Icon = segmentContent[segment].badgeIcon
                return (
                  <button
                    key={segment}
                    onClick={() => setSelectedSegment(segment)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedSegment === segment
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {segment === 'students' && 'Students'}
                    {segment === 'universities' && 'Institutes'}
                    {segment === 'companies' && 'Companies'}
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
                  {content.badge}
                </Badge>
              </motion.div>

              {/* Main heading with display font */}
              <h1 className="text-4xl font-display font-bold tracking-tight text-foreground sm:text-6xl animate-fade-in">
                {content.headline}
              </h1>

              <p className="mt-6 text-lg leading-8 text-foreground/80 max-w-3xl mx-auto animate-fade-in animate-delay-200">
                {content.description}
              </p>

              {/* CTA Buttons - teal/amber theme */}
              <div className="mt-10 flex items-center justify-center gap-x-6 animate-fade-in animate-delay-400">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Link href={content.primaryCTA.href}>
                    {content.primaryCTA.text}
                    <content.primaryCTA.icon className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button variant="outline" size="lg" asChild className="border-2">
                  <Link href={content.secondaryCTA.href}>
                    {content.secondaryCTA.text}
                  </Link>
                </Button>
              </div>

              {/* Quick benefits */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm animate-fade-in animate-delay-500">
                {content.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-card/60 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-border"
                  >
                    <benefit.icon className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">{benefit.text}</span>
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
            <p className="text-sm font-medium text-gray-700 text-center flex items-center justify-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              {content.stats.label} {content.stats.value}
            </p>
          </motion.div>

          {/* Feature cards - Dynamic based on segment */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <AnimatePresence mode="wait">
              {content.features.map((feature, index) => (
                <motion.div
                  key={`${selectedSegment}-${feature.title}`}
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
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600 text-center">
                    {feature.description}
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
