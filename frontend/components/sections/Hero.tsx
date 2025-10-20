'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles, Users, Trophy, Star, CheckCircle2, GraduationCap, Building2, Briefcase, TrendingUp, Shield, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { IMAGES } from '@/lib/images'

type Segment = 'students' | 'universities' | 'companies'

const segmentContent = {
  students: {
    badge: 'For Students',
    badgeIcon: GraduationCap,
    headline: (
      <>
        Stop Applying.{' '}
        <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
          Start Getting Discovered.
        </span>
      </>
    ),
    description: (
      <>
        Turn your university projects into a portfolio that gets you hired.
        <br />
        <strong className="text-gray-900">1,247 students landed jobs in the last 30 days.</strong>
      </>
    ),
    primaryCTA: {
      text: 'Create Free Portfolio',
      href: '/auth/register/role-selection',
      icon: ArrowRight
    },
    secondaryCTA: {
      text: 'See Success Stories',
      href: '/blog'
    },
    benefits: [
      { icon: CheckCircle2, text: 'Free forever' },
      { icon: CheckCircle2, text: 'No credit card needed' },
      { icon: CheckCircle2, text: '2-minute setup' }
    ],
    features: [
      {
        icon: Sparkles,
        title: 'AI Project Analysis',
        description: 'Smart evaluation of your academic work and skills',
        color: 'teal'
      },
      {
        icon: Users,
        title: 'Get Discovered',
        description: 'Recruiters find you based on your projects',
        color: 'blue'
      },
      {
        icon: Trophy,
        title: 'Verified Portfolio',
        description: 'University-backed project verification',
        color: 'emerald'
      }
    ],
    stats: {
      label: 'Trusted by students from',
      value: '50+ universities worldwide'
    }
  },
  universities: {
    badge: 'For Universities',
    badgeIcon: Building2,
    headline: (
      <>
        Connect Students with{' '}
        <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Career Opportunities.
        </span>
      </>
    ),
    description: (
      <>
        Help your students showcase their work and track career outcomes.
        <br />
        <strong className="text-gray-900">87% placement rate for partner universities.</strong>
      </>
    ),
    primaryCTA: {
      text: 'Partner With Us',
      href: '/auth/register/role-selection',
      icon: ArrowRight
    },
    secondaryCTA: {
      text: 'View Case Studies',
      href: '/about'
    },
    benefits: [
      { icon: CheckCircle2, text: 'Free for universities' },
      { icon: CheckCircle2, text: 'Easy integration' },
      { icon: CheckCircle2, text: 'Track alumni success' }
    ],
    features: [
      {
        icon: TrendingUp,
        title: 'Career Analytics',
        description: 'Track student employment outcomes and salary data',
        color: 'purple'
      },
      {
        icon: Shield,
        title: 'Verified Credentials',
        description: 'Authenticate academic records and projects',
        color: 'blue'
      },
      {
        icon: Users,
        title: 'Industry Network',
        description: 'Connect students with 423+ hiring companies',
        color: 'indigo'
      }
    ],
    stats: {
      label: 'Trusted by',
      value: '50+ universities worldwide'
    }
  },
  companies: {
    badge: 'For Companies',
    badgeIcon: Briefcase,
    headline: (
      <>
        Hire{' '}
        <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Verified Talent,
        </span>{' '}
        Not Resumes.
      </>
    ),
    description: (
      <>
        Access university-verified portfolios and hire based on real skills.
        <br />
        <strong className="text-gray-900">423 companies finding talent 2x faster.</strong>
      </>
    ),
    primaryCTA: {
      text: 'Find Talent Now',
      href: '/auth/register/role-selection',
      icon: ArrowRight
    },
    secondaryCTA: {
      text: 'Compare to LinkedIn',
      href: '/pricing'
    },
    benefits: [
      { icon: CheckCircle2, text: 'Start at €49/month' },
      { icon: CheckCircle2, text: '7-day free trial' },
      { icon: CheckCircle2, text: 'No contracts' }
    ],
    features: [
      {
        icon: Zap,
        title: 'AI Matching',
        description: 'Find candidates based on verified project work',
        color: 'cyan'
      },
      {
        icon: Shield,
        title: 'Verified Skills',
        description: 'University-authenticated portfolios and grades',
        color: 'blue'
      },
      {
        icon: TrendingUp,
        title: 'Hire 2x Faster',
        description: 'Reduce time-to-hire with project-based assessment',
        color: 'teal'
      }
    ],
    stats: {
      label: 'Finding talent from',
      value: '50+ top universities'
    }
  }
}

export function Hero() {
  const [selectedSegment, setSelectedSegment] = useState<Segment>('students')
  const content = segmentContent[selectedSegment]
  const BadgeIcon = content.badgeIcon

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50 py-20 sm:py-32">
      {/* Background image with overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={IMAGES.hero.students}
          alt="InTransparency platform"
          fill
          className="object-cover opacity-5"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50/90 via-white/95 to-emerald-50/90"></div>
      </div>

      {/* Animated background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-emerald-300/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
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
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {segment === 'students' && 'Students'}
                    {segment === 'universities' && 'Universities'}
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
              {/* Badge */}
              <div className="mb-6 flex justify-center">
                <Badge className="bg-white/60 backdrop-blur-sm text-gray-700 px-4 py-1.5 text-sm shadow-sm">
                  <BadgeIcon className="inline h-4 w-4 mr-1.5" />
                  {content.badge}
                </Badge>
              </div>

              {/* Main heading */}
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                {content.headline}
              </h1>

              <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
                {content.description}
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Link href={content.primaryCTA.href}>
                    {content.primaryCTA.text}
                    <content.primaryCTA.icon className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button variant="outline" size="lg" asChild className="hover:bg-gray-50">
                  <Link href={content.secondaryCTA.href}>
                    {content.secondaryCTA.text}
                  </Link>
                </Button>
              </div>

              {/* Quick benefits */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
                {content.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm"
                  >
                    <benefit.icon className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Universities/Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 pt-8 border-t border-gray-200"
          >
            <p className="text-sm font-medium text-gray-700 mb-4 text-center flex items-center justify-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              {content.stats.label} {content.stats.value}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {['MIT', 'Stanford', 'Georgia Tech', 'UC Berkeley', 'TU Munich'].map((uni) => (
                <motion.span
                  key={uni}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  className="text-xl font-bold text-gray-600 cursor-default"
                >
                  {uni}
                </motion.span>
              ))}
            </div>
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
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center group"
                >
                  <div className={`rounded-full bg-${feature.color}-100 p-3 group-hover:bg-${feature.color}-200 transition-all duration-300 shadow-md group-hover:shadow-lg`}>
                    <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                  </div>
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
