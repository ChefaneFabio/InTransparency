'use client'

import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function SuccessMetrics() {
  const metrics = [
    {
      number: '1',
      title: 'Portfolio > Resume',
      description: 'Show what you\'ve built, not just what you claim you can do',
      stat: '\uD83D\uDE80',
      statLabel: 'Early Access: Build your portfolio first, get discovered faster'
    },
    {
      number: '2',
      title: 'Get Discovered',
      description: 'Recruiters find you based on your verified projects, not keywords',
      stat: '\u2728',
      statLabel: 'Be among the first to showcase real academic work'
    },
    {
      number: '3',
      title: 'Stand Out',
      description: 'AI analyzes your projects and highlights your unique skills',
      stat: '\uD83C\uDFAF',
      statLabel: 'Turn your university projects into career opportunities'
    },
    {
      number: '4',
      title: 'Verified Skills',
      description: 'University-backed projects prove your abilities are real',
      stat: '\uD83D\uDD12',
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
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-primary">{metric.number}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {metric.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {metric.description}
                    </p>
                    <div className="bg-primary/5 rounded-lg p-4">
                      <div className="text-3xl font-bold text-primary mb-1">
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
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-lg transition-all relative">
              <Link href="/auth/register/student" className="relative">
                Create Your Free Portfolio Now
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
