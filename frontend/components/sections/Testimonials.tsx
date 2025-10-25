'use client'

import Image from 'next/image'
import { IMAGES } from '@/lib/images'
import { motion } from 'framer-motion'

export function Testimonials() {
  return (
    <section id="community" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <Image
          src={IMAGES.backgrounds.gradient1}
          alt="Background pattern"
          fill
          className="object-cover"
        />
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Building a transparent future
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Join the movement to create genuine connections between students and employers
            through authentic skill demonstration and transparent career development.
          </p>
        </div>

        {/* Platform Benefits with Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={IMAGES.hero.students}
                alt="Students collaborating on projects"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-semibold text-white mb-1">For Students</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                Showcase your real academic work and projects in a professional format that employers understand and value.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={IMAGES.companies.office1}
                alt="Professional business environment"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-semibold text-white mb-1">For Employers</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                Access verified academic performance and project portfolios to make informed hiring decisions based on real skills.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={IMAGES.universities.campus1}
                alt="University campus"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-semibold text-white mb-1">For Universities</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                Connect your students with career opportunities while tracking outcomes and building industry partnerships.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-8 text-white max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Ready to get started?
            </h3>
            <p className="text-white mb-6">
              Join the platform that values authenticity and transparency in career development.
            </p>
            <a href="/auth/register/role-selection" className="bg-white text-teal-700 px-8 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors inline-block">
              Get Started Free
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}