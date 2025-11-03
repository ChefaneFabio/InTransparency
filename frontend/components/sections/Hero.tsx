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
        Stop Applying.{' '}
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Start Getting Discovered.
        </span>
      </>
    ),
    description: (
      <>
        Turn your university projects into a verified portfolio that gets you hired. Companies message you first when they see your institution-authenticated work.
        <br />
        <strong className="text-gray-900">🎓 Watch videos of your work • See verified grades • All traceable to your university</strong>
      </>
    ),
    primaryCTA: {
      text: 'Get Started Free',
      href: '/auth/register',
      icon: ArrowRight
    },
    secondaryCTA: {
      text: 'See How It Works',
      href: '/how-it-works'
    },
    benefits: [
      { icon: CheckCircle2, text: 'Companies message you first' },
      { icon: CheckCircle2, text: 'Get hired 2x faster' },
      { icon: CheckCircle2, text: 'No fake credentials - 100% verified' }
    ],
    features: [
      {
        image: IMAGES.features.aiAnalysis,
        title: 'Watch Your Projects Come Alive',
        description: 'Record 2-minute videos explaining your work. Companies see your passion and skills in action - not just text on a page'
      },
      {
        image: IMAGES.students.student4,
        title: 'Show Verified Grades, Not Claims',
        description: '30/30 thesis? Your university stamps it. Companies see authentic proof directly from your institution - no resume lies'
      },
      {
        image: IMAGES.universityCampuses.graduation,
        title: '95% Cheaper Than LinkedIn',
        description: 'Companies pay €10 per contact vs €9,200/year on LinkedIn. You get discovered for free - they save thousands'
      }
    ],
    stats: {
      label: 'Join 125,000+ students who landed jobs through',
      value: 'verified portfolios - no resumes needed'
    }
  },
  universities: {
    badge: 'For Institutes - Universities & ITS',
    badgeIcon: Building2,
    headline: (
      <>
        Get Your Graduates{' '}
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Hired Through Verified Marketplace.
        </span>
      </>
    ),
    description: (
      <>
        Free three-sided marketplace connecting your students to 10K+ companies actively hiring. Your verification gives graduates a competitive edge. Track placement success with free analytics.
        <br />
        <strong className="text-gray-900">🎓 100% Free marketplace access - zero cost vs AlmaLaurea €2.500/year.</strong>
      </>
    ),
    primaryCTA: {
      text: 'Join Free Marketplace',
      href: '/auth/register',
      icon: ArrowRight
    },
    secondaryCTA: {
      text: 'See How It Works',
      href: '/how-it-works'
    },
    benefits: [
      { icon: CheckCircle2, text: 'Students discovered by companies' },
      { icon: CheckCircle2, text: '25% more placements vs traditional' },
      { icon: CheckCircle2, text: 'Track hiring success for MIUR' }
    ],
    features: [
      {
        image: IMAGES.features.search,
        title: 'Companies Discover Your Students',
        description: '10K+ companies browse verified graduates → Find matches → Contact directly. Your verification badge = trust signal that gets students noticed'
      },
      {
        image: IMAGES.recruiters.recruiter2,
        title: 'Your Verification = Competitive Edge',
        description: '"Verified by Politecnico" or "ITS G. Natta endorsed" increases student placement 25% vs unverified profiles - your stamp matters'
      },
      {
        image: IMAGES.universityCampuses.campus,
        title: 'Track Placement Impact',
        description: 'Free analytics: "47 students contacted by companies → 23 hired in 47 days avg" - prove 85% placement boost to MIUR with data'
      }
    ],
    stats: {
      label: 'Free marketplace connecting students to',
      value: '10K+ companies actively hiring verified talent'
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
      href: '/auth/register',
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
          {/* Service Model Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4 flex justify-center"
          >
            <div className="text-xs text-gray-600 bg-white/40 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200/50">
              Subscription-Free Service • Partner-Enabled
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
            <p className="text-sm font-medium text-gray-700 text-center flex items-center justify-center gap-2 mb-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              {content.stats.label} {content.stats.value}
            </p>
            <p className="text-xs text-gray-600 text-center">
              Four Services, Zero Subscriptions
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
