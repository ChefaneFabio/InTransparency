'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Users, Trophy, Star, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { IMAGES } from '@/lib/images'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50 py-20 sm:py-32">
      {/* Background image with overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={IMAGES.hero.students}
          alt="Students collaborating"
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
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <div className="relative rounded-full px-4 py-1.5 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 bg-white/60 backdrop-blur-sm shadow-sm">
              <Sparkles className="inline h-4 w-4 mr-1 text-blue-600" />
              AI-powered academic matching platform{' '}
              <Link href="#features" className="font-semibold text-blue-600 hover:text-blue-700">
                <span className="absolute inset-0" aria-hidden="true" />
                Learn more <ArrowRight className="inline h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* Main heading with stagger animation */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
          >
            Stop Applying.{' '}
            <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Start Getting Discovered.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto"
          >
            Turn your university projects into a portfolio that gets you hired.
            <br />
            <strong className="text-gray-900">1,247 students landed jobs in the last 30 days.</strong>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Button asChild size="lg" className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Link href="/auth/register/role-selection">
                Create Free Portfolio
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button variant="outline" size="lg" asChild className="hover:bg-gray-50">
              <Link href="/blog">
                See Success Stories
              </Link>
            </Button>
          </motion.div>

          {/* Quick benefits */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm"
          >
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-gray-700">Free forever</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-gray-700">No credit card needed</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-gray-700">2-minute setup</span>
            </div>
          </motion.div>

          {/* Universities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 pt-8 border-t border-gray-200"
          >
            <p className="text-sm font-medium text-gray-700 mb-4 text-center flex items-center justify-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              Trusted by students from 50+ universities worldwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <motion.span
                whileHover={{ scale: 1.1, opacity: 1 }}
                className="text-xl font-bold text-gray-600 cursor-default"
              >
                MIT
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.1, opacity: 1 }}
                className="text-xl font-bold text-gray-600 cursor-default"
              >
                Stanford
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.1, opacity: 1 }}
                className="text-xl font-bold text-gray-600 cursor-default"
              >
                Georgia Tech
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.1, opacity: 1 }}
                className="text-xl font-bold text-gray-600 cursor-default"
              >
                UC Berkeley
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.1, opacity: 1 }}
                className="text-xl font-bold text-gray-600 cursor-default"
              >
                TU Munich
              </motion.span>
            </div>
          </motion.div>

          {/* Feature cards */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: 'AI Analysis',
                description: 'Smart project evaluation and skill assessment',
                color: 'teal',
                delay: 0.6
              },
              {
                icon: Users,
                title: 'Smart Matching',
                description: 'Connect with relevant opportunities and people',
                color: 'blue',
                delay: 0.7
              },
              {
                icon: Trophy,
                title: 'Professional Stories',
                description: 'Transform projects into compelling narratives',
                color: 'emerald',
                delay: 0.8
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: feature.delay }}
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
