'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Award, Brain, Users, TrendingUp, Shield, Clock, Star, Sparkles, Target, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { trackFakeDoorClick, getABTestVariant, getVariantPricing } from '@/lib/analytics'

export default function CertificationPage() {
  const router = useRouter()
  const [variant, setVariant] = useState<'A' | 'B' | 'C' | 'D'>('A')
  const [pricing, setPricing] = useState({ price: 99, model: 'one-time', label: '€99 One-Time' })

  useEffect(() => {
    // Assign A/B test variant on client side
    const assignedVariant = getABTestVariant()
    setVariant(assignedVariant)
    setPricing(getVariantPricing(assignedVariant))
  }, [])

  const handleGetCertified = async () => {
    // Track fake door click with analytics
    trackFakeDoorClick('certification', pricing.price, variant)

    // Redirect to waitlist
    router.push('/certification-waitlist?variant=' + variant)
  }

  const softSkills = [
    {
      icon: Brain,
      title: 'Problem Solving',
      description: 'Critical thinking and analytical abilities'
    },
    {
      icon: Users,
      title: 'Teamwork',
      description: 'Collaboration and interpersonal skills'
    },
    {
      icon: TrendingUp,
      title: 'Leadership',
      description: 'Initiative and decision-making capacity'
    },
    {
      icon: Target,
      title: 'Adaptability',
      description: 'Flexibility and resilience under pressure'
    }
  ]

  const assessments = [
    {
      name: 'Big Five Personality',
      duration: '10 min',
      measures: 'Openness, Conscientiousness, Extraversion, Agreeableness, Emotional Stability'
    },
    {
      name: 'DISC Behavioral',
      duration: '8 min',
      measures: 'Dominance, Influence, Steadiness, Compliance'
    },
    {
      name: 'Core Competencies',
      duration: '12 min',
      measures: 'Communication, Leadership, Problem-solving, Emotional Intelligence'
    }
  ]

  const benefits = [
    'Validated by industrial-organizational psychologists',
    'Scientifically-backed assessments',
    'Percentile rankings vs. university peer group',
    'Shareable certificate with unique verification code',
    'Integrated into your InTransparency profile',
    'Helps recruiters find you for culture fit',
    'One-time fee, lifetime access to results',
    'Re-take annually to track growth'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <Header />

      <main className="pt-24 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm px-6 py-2 border-0">
              <Sparkles className="inline h-4 w-4 mr-2" />
              NEW: Soft Skills Certification
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Stand Out With{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Certified Soft Skills
              </span>
            </h1>

            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Beyond your projects and code. Prove your leadership, communication, and teamwork
              skills with psychometric testing trusted by recruiters.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button
                size="lg"
                onClick={handleGetCertified}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-xl text-lg px-8 py-6"
              >
                <Award className="mr-2 h-5 w-5" />
                Get Certified - {pricing.label}
              </Button>

              <Button size="lg" variant="outline" asChild>
                <Link href="#how-it-works">
                  See How It Works
                </Link>
              </Button>
            </div>

            <p className="text-sm text-gray-600">
              ✓ 30-minute assessment  ✓ Instant results  ✓ Lifetime certificate
            </p>
          </motion.div>

          {/* Soft Skills Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              What We Measure
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {softSkills.map((skill, index) => {
                const Icon = skill.icon
                return (
                  <motion.div
                    key={skill.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.03 }}
                  >
                    <Card className="h-full hover:shadow-2xl transition-all duration-300 border-gray-200 bg-white/90 backdrop-blur-sm">
                      <CardContent className="p-6 text-center">
                        <motion.div
                          className="mx-auto mb-4 rounded-full bg-purple-100 p-4 w-16 h-16 flex items-center justify-center"
                          whileHover={{ rotate: 360, scale: 1.15 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Icon className="h-8 w-8 text-purple-600" />
                        </motion.div>
                        <h3 className="font-bold text-lg mb-2">{skill.title}</h3>
                        <p className="text-sm text-gray-600">{skill.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Assessment Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
            id="how-it-works"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Three Validated Assessments
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Our certification combines industry-standard psychometric tests used by Fortune 500 companies.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {assessments.map((assessment, index) => (
                <motion.div
                  key={assessment.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full border-gray-200 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          <Clock className="h-3 w-3 mr-1" />
                          {assessment.duration}
                        </Badge>
                        <Shield className="h-6 w-6 text-green-600" />
                      </div>
                      <CardTitle className="text-xl">{assessment.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Measures:</span> {assessment.measures}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* What You Get */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-purple-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                  <div className="text-center">
                    <CardTitle className="text-3xl mb-4">What You Get</CardTitle>
                    <div className="text-5xl font-bold text-gray-900 mb-2">€{pricing.price}</div>
                    <p className="text-gray-600">{pricing.model === 'one-time' ? 'One-time payment, lifetime access' : 'Monthly subscription'}</p>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <ul className="grid md:grid-cols-2 gap-4">
                    {benefits.map((benefit, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="flex items-start"
                      >
                        <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <div className="mt-8 text-center">
                    <Button
                      size="lg"
                      onClick={handleGetCertified}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg text-lg px-8 py-6"
                    >
                      <Award className="mr-2 h-5 w-5" />
                      Get Certified Now
                    </Button>
                    <p className="text-sm text-gray-600 mt-4">
                      Be among the first to get certified
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>


          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {[
                {
                  question: "How long does the assessment take?",
                  answer: "Approximately 30 minutes total for all three assessments. You can pause and resume anytime."
                },
                {
                  question: "Is this scientifically validated?",
                  answer: "Yes. Our assessments are based on peer-reviewed research and validated by I-O psychologists."
                },
                {
                  question: "Will recruiters actually see this?",
                  answer: "Yes! Your certification displays prominently on your profile and in recruiter search results."
                },
                {
                  question: "What if I'm not happy with my results?",
                  answer: "You can retake the assessment once per year. Many students see improvement after gaining experience."
                },
                {
                  question: "Is this recognized internationally?",
                  answer: "Yes. We're partnered with 500+ companies across Europe and expanding globally."
                },
                {
                  question: "How is this different from LinkedIn assessments?",
                  answer: "Ours are psychometric (personality/behavior) not skill quizzes. Plus, we provide percentile rankings vs. peers."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{faq.answer}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white border-0 shadow-2xl">
              <CardContent className="p-12 text-center">
                <h2 className="text-4xl font-bold mb-4">
                  Ready to Stand Out?
                </h2>
                <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
                  Be among the first to certify your soft skills and stand out to recruiters.
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={handleGetCertified}
                  className="text-lg px-8 py-6"
                >
                  <Award className="mr-2 h-5 w-5" />
                  Get Certified - {pricing.label}
                </Button>
                <p className="text-sm text-white mt-6">
                  ✓ Complete in 30 minutes  ✓ Instant certification  ✓ Lifetime access
                </p>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
