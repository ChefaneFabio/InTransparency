'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Building2, Briefcase, ArrowRight, CheckCircle } from 'lucide-react'

export function TestimonialsSection() {
  const valueProps = [
    {
      icon: GraduationCap,
      title: 'For Students',
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      benefits: [
        'Build a verified portfolio from your projects',
        'Get discovered by companies looking for your skills',
        'No applications needed - companies contact you',
        'Always free, no hidden costs'
      ]
    },
    {
      icon: Building2,
      title: 'For Universities',
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      benefits: [
        'Verify student projects and achievements',
        'Track placement outcomes with analytics',
        'Connect students directly to employers',
        'Free for all partner institutions'
      ]
    },
    {
      icon: Briefcase,
      title: 'For Companies',
      color: 'text-green-600',
      bg: 'bg-green-100',
      benefits: [
        'Search verified talent by real skills',
        'See actual projects, not resume claims',
        'Pay only when you contact candidates',
        'No subscriptions, no commitments'
      ]
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Built for Everyone
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A marketplace that works for students, universities, and companies - with transparent value for each.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {valueProps.map((prop, index) => {
            const Icon = prop.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className={`inline-flex p-3 rounded-xl ${prop.bg} mb-4`}>
                  <Icon className={`h-6 w-6 ${prop.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{prop.title}</h3>
                <ul className="space-y-3">
                  {prop.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
