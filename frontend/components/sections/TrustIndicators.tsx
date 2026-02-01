'use client'

import { motion } from 'framer-motion'
import { Shield, GraduationCap, Building2, CheckCircle, TrendingUp, Users } from 'lucide-react'

export function TrustIndicators() {
  const stats = [
    {
      value: '10,000+',
      label: 'Verified Students',
      icon: GraduationCap,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      value: '500+',
      label: 'Hiring Companies',
      icon: Building2,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      value: '50+',
      label: 'Partner Universities',
      icon: Shield,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      value: '87%',
      label: 'Avg Placement Rate',
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ]

  const partners = [
    'Politecnico di Milano',
    'Bocconi',
    'La Sapienza',
    'UniBO',
    'PoliTO',
    'UniPD',
    'UniNA',
    'UniMI'
  ]

  const companies = [
    'Accenture',
    'Deloitte',
    'McKinsey',
    'BCG',
    'Google',
    'Amazon',
    'Intesa Sanpaolo',
    'UniCredit'
  ]

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="container">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`inline-flex p-3 rounded-xl ${stat.bg} mb-3`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
            <CheckCircle className="h-4 w-4" />
            100% Free for Students
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
            <Shield className="h-4 w-4" />
            GDPR Compliant
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
            <Users className="h-4 w-4" />
            University Verified
          </div>
        </div>

        {/* Partner Logos */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500 mb-4">Trusted by leading institutions</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {partners.map((partner, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="text-gray-400 font-medium text-sm hover:text-gray-600 transition-colors"
              >
                {partner}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Company Logos */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">Companies hiring on our platform</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {companies.map((company, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="text-gray-400 font-medium text-sm hover:text-gray-600 transition-colors"
              >
                {company}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
