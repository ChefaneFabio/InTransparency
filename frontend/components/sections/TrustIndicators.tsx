'use client'

import { motion } from 'framer-motion'
import { Shield, GraduationCap, Building2, CheckCircle, Zap, Users } from 'lucide-react'

export function TrustIndicators() {
  const features = [
    {
      title: 'Verified Skills',
      description: 'Every project authenticated by institutions',
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'Direct Contact',
      description: 'Companies reach out to you first',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Free Forever',
      description: 'No cost for students and universities',
      icon: GraduationCap,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      title: 'Pay Per Contact',
      description: 'Companies pay only when they reach out',
      icon: Zap,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ]

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="container">
        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`inline-flex p-3 rounded-xl ${feature.bg} mb-3`}>
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <div className="text-lg font-semibold text-gray-900">{feature.title}</div>
                <div className="text-sm text-gray-600">{feature.description}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
            <CheckCircle className="h-4 w-4" />
            100% Free for Students
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
            <Shield className="h-4 w-4" />
            GDPR Compliant
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
            <Building2 className="h-4 w-4" />
            Institution Verified
          </div>
        </div>
      </div>
    </section>
  )
}
