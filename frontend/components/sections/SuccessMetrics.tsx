'use client'

import { CheckCircle2, Star, Award, Zap } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function SuccessMetrics() {
  const metrics = [
    {
      icon: CheckCircle2,
      title: 'Portfolio > Resume',
      description: 'Show what you\'ve built, not just what you claim you can do',
      stat: '🚀',
      statLabel: 'Early Access: Build your portfolio first, get discovered faster'
    },
    {
      icon: Zap,
      title: 'Get Discovered',
      description: 'Recruiters find you based on your verified projects, not keywords',
      stat: '✨',
      statLabel: 'Be among the first to showcase real academic work'
    },
    {
      icon: Star,
      title: 'Stand Out',
      description: 'AI analyzes your projects and highlights your unique skills',
      stat: '🎯',
      statLabel: 'Turn your university projects into career opportunities'
    },
    {
      icon: Award,
      title: 'Verified Skills',
      description: 'University-backed projects prove your abilities are real',
      stat: '🔒',
      statLabel: 'Authentic portfolios that build recruiter trust'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Students Choose InTransparency
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your projects tell a better story than any resume. Here's the proof.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-2xl transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 p-3 flex-shrink-0">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {metric.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {metric.description}
                    </p>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {metric.stat}
                      </div>
                      <div className="text-sm text-gray-600">
                        {metric.statLabel}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA with Pulse Animation */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-2xl transition-all relative">
              <Link href="/auth/register/student" className="relative">
                <motion.span
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 opacity-0"
                  animate={{
                    opacity: [0, 0.5, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <span className="relative z-10">Create Your Free Portfolio Now</span>
              </Link>
            </Button>
          </motion.div>
          <p className="mt-4 text-sm text-gray-600">
            No credit card required
          </p>
        </motion.div>
      </div>
    </section>
  )
}
