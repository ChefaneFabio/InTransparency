'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/navigation'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function CertificationPage() {
  const router = useRouter()
  const { data: session } = useSession()

  const handleGetCertified = () => {
    if (session?.user) {
      // Logged-in: go straight to the assessment dashboard
      router.push('/dashboard/student/certifications')
    } else {
      // Not logged in: send to register, then redirect after
      router.push('/auth/register?callbackUrl=/dashboard/student/certifications')
    }
  }

  const softSkills = [
    {
      number: '01',
      title: 'Problem Solving',
      description: 'Critical thinking and analytical abilities'
    },
    {
      number: '02',
      title: 'Teamwork',
      description: 'Collaboration and interpersonal skills'
    },
    {
      number: '03',
      title: 'Leadership',
      description: 'Initiative and decision-making capacity'
    },
    {
      number: '04',
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
    <div className="min-h-screen">
      <Header />

      <main className="pb-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-foreground text-white">
          <img src="/images/brand/students.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-primary/60" />
          <div className="relative container max-w-4xl mx-auto px-4 pt-32 pb-16 lg:pt-36 lg:pb-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-white/10 text-white text-sm px-6 py-2 border-white/20">
                NEW: Soft Skills Certification
              </Badge>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Stand Out With{' '}
                <span className="text-blue-200">
                  Certified Soft Skills
                </span>
              </h1>

              <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                Beyond your projects and code. Prove your leadership, communication, and teamwork
                skills with psychometric testing trusted by recruiters.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button
                  size="lg"
                  onClick={handleGetCertified}
                  className="bg-white text-blue-900 hover:bg-blue-50 shadow-lg text-lg px-8 py-6"
                >
                  Get Certified — Free
                </Button>

                <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10">
                  <Link href="#how-it-works">
                    See How It Works
                  </Link>
                </Button>
              </div>

              <p className="text-sm text-blue-200">
                30-minute assessment -- Instant results -- Lifetime certificate
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">

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
              {softSkills.map((skill, index) => (
                  <motion.div
                    key={skill.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 border-gray-200 bg-white/90 backdrop-blur-sm">
                      <CardContent className="p-6 text-center">
                        <div className="mx-auto mb-4 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center text-primary font-bold text-xl">
                          {skill.number}
                        </div>
                        <h3 className="font-bold text-lg mb-2">{skill.title}</h3>
                        <p className="text-sm text-gray-600">{skill.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
              ))}
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
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {assessment.duration}
                        </Badge>
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
              <Card className="border-2 border-primary/20 shadow-xl">
                <CardHeader className="bg-primary/5">
                  <div className="text-center">
                    <CardTitle className="text-3xl mb-4">What You Get</CardTitle>
                    <div className="text-5xl font-bold text-gray-900 mb-2">Free</div>
                    <p className="text-gray-600">Take assessments at no cost during early access</p>
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
                        <span className="text-primary mr-3 flex-shrink-0 mt-0.5 font-bold">✓</span>
                        <span className="text-gray-700">{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <div className="mt-8 text-center">
                    <Button
                      size="lg"
                      onClick={handleGetCertified}
                      className="bg-primary text-white shadow-lg text-lg px-8 py-6"
                    >
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
            <Card className="bg-primary text-white border-0 shadow-lg">
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
                  Get Certified — Free
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
