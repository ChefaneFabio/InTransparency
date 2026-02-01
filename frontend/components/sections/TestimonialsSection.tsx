'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, GraduationCap, Building2, Briefcase, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Testimonial {
  quote: string
  author: string
  role: string
  organization: string
  avatar: string
  type: 'student' | 'university' | 'company'
  rating?: number
  metric?: string
}

const testimonials: Testimonial[] = [
  {
    quote: "I went from sending 50+ applications with no response to getting 5 interview invites in my first month. Companies reached out to me based on my verified projects.",
    author: "Giulia Esposito",
    role: "Software Engineering Student",
    organization: "Politecnico di Milano",
    avatar: "GE",
    type: "student",
    rating: 5,
    metric: "5 interviews in 1 month"
  },
  {
    quote: "We increased our placement rate by 30% in the first semester. The analytics help us identify at-risk students early and provide targeted career support.",
    author: "Prof. Alessandro Romano",
    role: "Career Services Director",
    organization: "Politecnico di Milano",
    avatar: "AR",
    type: "university",
    metric: "30% higher placements"
  },
  {
    quote: "Finally, a platform where we can trust the skills listed. Every project is verified by the university - no more resume inflation. We hired 3 engineers in record time.",
    author: "Marco Bianchi",
    role: "Head of Talent Acquisition",
    organization: "TechCorp Solutions",
    avatar: "MB",
    type: "company",
    metric: "3 hires in 2 months"
  },
  {
    quote: "The company challenges feature let me work on a real fintech project during my capstone. It became my portfolio centerpiece and landed me my dream job.",
    author: "Francesco Greco",
    role: "Economics Graduate",
    organization: "Bocconi University",
    avatar: "FG",
    type: "student",
    rating: 5,
    metric: "Dream job secured"
  },
  {
    quote: "We save 40 hours per month on manual CV screening. The AI matching shows us candidates we would have missed, with skills verified by their professors.",
    author: "Laura Costa",
    role: "HR Director",
    organization: "FinancePlus SpA",
    avatar: "LC",
    type: "company",
    metric: "40 hrs/month saved"
  },
  {
    quote: "Our ITS placement rate went from 75% to 92% after joining. Companies now proactively reach out to our students instead of us chasing placements.",
    author: "Dr. Elena Martini",
    role: "Director",
    organization: "ITS Lombardia Meccatronica",
    avatar: "EM",
    type: "university",
    metric: "92% placement rate"
  }
]

const typeConfig = {
  student: {
    icon: GraduationCap,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    label: 'Student'
  },
  university: {
    icon: Building2,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    label: 'University'
  },
  company: {
    icon: Briefcase,
    color: 'text-green-600',
    bg: 'bg-green-100',
    label: 'Company'
  }
}

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [filter, setFilter] = useState<'all' | 'student' | 'university' | 'company'>('all')

  const filteredTestimonials = filter === 'all'
    ? testimonials
    : testimonials.filter(t => t.type === filter)

  const currentTestimonial = filteredTestimonials[activeIndex % filteredTestimonials.length]
  const config = typeConfig[currentTestimonial.type]
  const Icon = config.icon

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % filteredTestimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Real Results from Real Users
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how students, universities, and companies are transforming their outcomes with verified talent matching.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {(['all', 'student', 'university', 'company'] as const).map((type) => (
            <Button
              key={type}
              variant={filter === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setFilter(type)
                setActiveIndex(0)
              }}
              className={filter === type ? 'bg-gray-900' : ''}
            >
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
            </Button>
          ))}
        </div>

        {/* Testimonial Card */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex + filter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-8 md:p-10 relative"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 left-6 h-8 w-8 text-gray-200" />

              {/* Metric Badge */}
              {currentTestimonial.metric && (
                <div className="absolute top-6 right-6">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    {currentTestimonial.metric}
                  </span>
                </div>
              )}

              {/* Quote */}
              <blockquote className="text-xl text-gray-700 leading-relaxed mb-8 pt-8">
                "{currentTestimonial.quote}"
              </blockquote>

              {/* Rating */}
              {currentTestimonial.rating && (
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < currentTestimonial.rating!
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${config.bg} flex items-center justify-center`}>
                  <span className={`font-semibold ${config.color}`}>
                    {currentTestimonial.avatar}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{currentTestimonial.author}</div>
                  <div className="text-sm text-gray-600">
                    {currentTestimonial.role} at {currentTestimonial.organization}
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${config.bg}`}>
                  <Icon className={`h-4 w-4 ${config.color}`} />
                  <span className={`text-sm font-medium ${config.color}`}>
                    {config.label}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {filteredTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === activeIndex % filteredTestimonials.length
                      ? 'bg-gray-900'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-1">3x</div>
            <div className="text-gray-600">More interview offers for verified students</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-purple-600 mb-1">25%</div>
            <div className="text-gray-600">Higher placement rates for partner universities</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-1">50%</div>
            <div className="text-gray-600">Faster time-to-hire for companies</div>
          </div>
        </div>
      </div>
    </section>
  )
}
