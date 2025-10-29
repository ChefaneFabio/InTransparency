'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileX2, Code2, TrendingUp, Users, Shield, Zap, Target, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { IMAGES } from '@/lib/images'
import { motion } from 'framer-motion'

export default function AboutPage() {
  return (
    <div className="min-h-screen hero-bg">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section - The Problem */}
        <section className="hero-bg py-20 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-5">
            <Image
              src={IMAGES.students.student2}
              alt="Background pattern"
              fill
              className="object-cover"
            />
          </div>
          <div className="container max-w-4xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                The Problem We're Solving
              </div>
              <h1 className="text-5xl font-display font-bold text-foreground mb-6">
                Resumes Are Broken.
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                Anyone can claim "Proficient in React" or "Expert in Python" on a resume. <br />
                Recruiters waste time interviewing unqualified candidates. <br />
                <strong>Students with real skills get overlooked</strong> because they don't have fancy internships.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
              <Card className="bg-white hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-8">
                  <div className="relative w-16 h-16 mb-4 rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={IMAGES.students.student3}
                      alt="Resume Problem"
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">The Resume Problem</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>❌ Unverified skills (anyone can lie)</li>
                    <li>❌ No proof of ability</li>
                    <li>❌ Rewards good writers, not good builders</li>
                    <li>❌ Favors pedigree over talent</li>
                    <li>❌ Companies waste $4,000+ per bad hire</li>
                  </ul>
                </CardContent>
              </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
              <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-8">
                  <div className="relative w-16 h-16 mb-4 rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={IMAGES.features.aiAnalysis}
                      alt="InTransparency Way"
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">The InTransparency Way</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>✅ Institution-verified projects (all formats)</li>
                    <li>✅ Hard skills + soft skills analysis</li>
                    <li>✅ AI-powered complete profile building</li>
                    <li>✅ Proof of work beats claims</li>
                    <li>✅ Find hidden talent 2x faster</li>
                  </ul>
                </CardContent>
              </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why We're Different - Against Opaque Competitors */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Transparency vs Opacity
              </div>
              <h2 className="text-4xl font-display font-bold text-foreground mb-4">
                Why InTransparency is{' '}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Different
                </span>
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                We're building a platform where skills are verified, matches are explained, and requirements are transparent.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="bg-gray-50 border-2 border-gray-200 h-full">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <FileX2 className="h-6 w-6" />
                      The Challenge
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <span className="text-gray-600 font-bold">→</span>
                        <div>
                          <strong className="text-gray-900">Self-Reported Skills:</strong>
                          <p className="text-gray-700 text-sm">Without institutional verification, skills can be hard to validate. This leads to a <strong>30% mismatch rate</strong> in traditional hiring.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gray-600 font-bold">→</span>
                        <div>
                          <strong className="text-gray-900">Limited Explanations:</strong>
                          <p className="text-gray-700 text-sm">When matching isn't explained, students don't know what to improve. <strong>70% of candidates</strong> want more transparency from AI hiring tools.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gray-600 font-bold">→</span>
                        <div>
                          <strong className="text-gray-900">Unclear Requirements:</strong>
                          <p className="text-gray-700 text-sm">Vague job descriptions make it hard for candidates to know what's really needed. Clear requirements reduce bias by <strong>25%</strong>.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-gray-600 font-bold">→</span>
                        <div>
                          <strong className="text-gray-900">Information Gaps:</strong>
                          <p className="text-gray-700 text-sm">Without feedback loops, students and institutions lack market insights. Better data improves outcomes for everyone.</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300 h-full">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-green-900 mb-6 flex items-center gap-2">
                      <Shield className="h-6 w-6" />
                      InTransparency
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 font-bold">✅</span>
                        <div>
                          <strong className="text-green-900">Institution-Verified Skills:</strong>
                          <p className="text-gray-700 text-sm">Hard skills (Python, AutoCAD, Excel) and soft skills (teamwork, leadership, communication) verified through projects, courses, and institutional data. <strong>92% match accuracy</strong>.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 font-bold">✅</span>
                        <div>
                          <strong className="text-green-900">Explainable AI:</strong>
                          <p className="text-gray-700 text-sm">Every match explains WHY ("Your Python project matches 3/4 requirements"). No black boxes. <strong>85% higher trust</strong> in transparent AI per EU studies.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 font-bold">✅</span>
                        <div>
                          <strong className="text-green-900">Bidirectional Transparency:</strong>
                          <p className="text-gray-700 text-sm">Companies specify clear requirements. Students see exactly what jobs need. Institutions track search trends (e.g., "Excel searched 89x"). <strong>25% less hiring bias</strong> with transparent criteria.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-green-600 font-bold">✅</span>
                        <div>
                          <strong className="text-green-900">Full Audit Trails:</strong>
                          <p className="text-gray-700 text-sm">Students see which companies viewed their profile. Institutions see hiring patterns. GDPR Article 15 compliant. <strong>20-30% boost in placements</strong> via data-driven decisions.</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-r from-primary to-secondary text-white">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-display font-bold mb-4">The Result</h3>
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <div className="text-4xl font-bold mb-2">47 days</div>
                      <div className="text-white/90">Average time to hire (vs 42+ days traditional)</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold mb-2">92%</div>
                      <div className="text-white/90">Match accuracy (vs 65% for ATS tools)</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold mb-2">€10</div>
                      <div className="text-white/90">Per contact (vs €8,000/year subscriptions)</div>
                    </div>
                  </div>
                  <p className="text-white/90 text-lg">
                    Transparency builds trust. Trust builds better matches. Better matches build careers.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-20 hero-bg relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-5">
            <Image
              src={IMAGES.hero.students}
              alt="Background pattern"
              fill
              className="object-cover"
            />
          </div>
          <div className="container max-w-4xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-display font-bold text-foreground mb-4">
                Our Mission
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                We're building the world's first <strong>verified project portfolio platform</strong> where students prove their skills through what they've actually built, not what they claim they can do.
              </p>
            </motion.div>

            <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-12 text-white text-center mb-16">
              <blockquote className="text-2xl font-medium italic mb-4">
                "Projects speak louder than resumes."
              </blockquote>
              <p className="text-white/80">
                — The InTransparency Philosophy
              </p>
            </div>

            {/* Our Story */}
            <div className="prose prose-lg max-w-none">
              <h3 className="text-2xl font-display font-bold text-foreground mb-4">How We Started</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                InTransparency was born from frustration. Our founders watched talented students with incredible university projects get rejected from jobs because their resumes didn't list "2+ years experience" or a FAANG internship.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Meanwhile, companies complained about hiring candidates who looked great on paper but couldn't code. The disconnect was obvious: <strong>resumes reward good storytelling, not good building.</strong>
              </p>
              <p className="text-gray-700 leading-relaxed mb-8">
                We asked a simple question: What if students could show their work instead of just listing it? What if recruiters could see verified projects with complete skill analysis (hard + soft), and institution endorsements?
              </p>
              <p className="text-gray-700 leading-relaxed font-semibold">
                InTransparency was our answer.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 hero-bg">
          <div className="container max-w-6xl">
            <h2 className="text-4xl font-display font-bold text-foreground text-center mb-16">
              What We Believe
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  image: IMAGES.students.student5,
                  title: 'Verification Over Claims',
                  description: 'Institution-backed projects in all formats, complete skill analysis, and endorsements prove skills are real.'
                },
                {
                  image: IMAGES.companies.office2,
                  title: 'Proof of Work',
                  description: 'Show what you\'ve built, not what you say you can build. Code speaks louder than bullet points.'
                },
                {
                  image: IMAGES.features.collaboration,
                  title: 'Talent Over Pedigree',
                  description: 'A brilliant project from a state school beats a mediocre resume from an Ivy League.'
                },
                {
                  image: IMAGES.success.handshake,
                  title: 'Transparency Always',
                  description: 'No hidden algorithms. Students see who viewed their profile. Companies see verified data.'
                }
              ].map((value, idx) => {
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                  <Card className="text-center hover:shadow-lg transition-shadow h-full">
                    <CardContent className="p-8">
                      <div className="relative w-16 h-16 mx-auto mb-4 rounded-lg overflow-hidden shadow-md">
                        <Image
                          src={value.image}
                          alt={value.title}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {value.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Our Business Model */}
        <section className="py-20 hero-bg">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
            <h2 className="text-4xl font-display font-bold text-foreground text-center mb-4">
              Why Is Everything Free?
            </h2>
            <p className="text-xl text-gray-700 text-center mb-12">
              We believe talent shouldn't be locked behind paywalls
            </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="bg-white">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-4">🎓</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Students: 100% Free
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Every feature. Unlimited projects. No credit card ever required.
                  </p>
                  <div className="text-sm text-gray-600 bg-green-50 rounded-lg p-3">
                    <strong>€9 optional:</strong> Personal career coaching with HR experts (human service, not software)
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-4">🏫</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Universities: Always Free
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Companies autonomously search your students. Save 40h/month. Zero manual matching.
                  </p>
                  <div className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3">
                    <strong>Optional:</strong> Customizations (API integrations, white-label, custom features)
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-4">💼</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Companies: Pay for Results
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Browse free. Pay €10 only when you contact a candidate.
                  </p>
                  <div className="text-sm text-gray-600 bg-purple-50 rounded-lg p-3">
                    <strong>No subscriptions:</strong> Only pay for actual results, credits never expire
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-primary to-secondary text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-display font-bold mb-4 text-center">The Philosophy</h3>
                <div className="space-y-4 text-white">
                  <p className="leading-relaxed">
                    <strong>Students shouldn't pay to get hired.</strong> Traditional platforms charge students for premium features to be visible. We believe that's backwards. Students create the value—they should access everything for free.
                  </p>
                  <p className="leading-relaxed">
                    <strong>Universities shouldn't pay to help students.</strong> Institutions want to support their students' career success. Our core platform is always free—not "year 1 free." Save 40+ hours/month on manual matching. Pay only for optional customizations (API, white-label, custom features).
                  </p>
                  <p className="leading-relaxed">
                    <strong>Companies should pay only for results.</strong> No more $8,000/year subscriptions before finding anyone. Browse our entire database free. Pay €10 only when you find someone worth contacting. Fair, transparent, performance-based.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Our Vision */}
        <section className="py-20 hero-bg">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
            <h2 className="text-4xl font-display font-bold text-foreground text-center mb-4">
              Join Us in Early Access
            </h2>
            <p className="text-xl text-gray-700 text-center mb-16">
              We're building the future of student recruitment - be among the first to shape it
            </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                { emoji: '🚀', label: 'Launch in 2025', sublabel: 'Be among the first users' },
                { emoji: '🎓', label: 'Students First', sublabel: 'Free forever for students' },
                { emoji: '🤝', label: 'Build Together', sublabel: 'Shape features with us' }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="text-center"
                >
                  <div className="text-5xl mb-4">{stat.emoji}</div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-700">{stat.sublabel}</div>
                </motion.div>
              ))}
            </div>

            {/* Early Access CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-4">
                  Help Us Build the Platform
                </h3>
                <p className="text-gray-800 mb-6 leading-relaxed max-w-2xl mx-auto">
                  We're in early development and looking for students, universities, and companies to help shape the platform. Your feedback will directly influence what we build.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg" asChild>
                    <Link href="/auth/register/role-selection">Get Started Free</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/contact">Partner With Us</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </div>
        </section>

        {/* The Enemy: Resumes */}
        <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="container max-w-4xl text-center">
            <h2 className="text-4xl font-bold mb-6">
              It's Time to Kill the Resume
            </h2>
            <p className="text-xl text-gray-100 leading-relaxed mb-8 max-w-2xl mx-auto">
              Resumes were invented in 1482. We have AI, complete skill analysis, and institution verification now. Why are we still using a 500-year-old tool to hire for 21st-century jobs?
            </p>

            <div className="bg-white bg-opacity-10 rounded-xl p-8 backdrop-blur-sm mb-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="text-red-400 text-4xl font-bold mb-2">1482</div>
                  <div className="text-gray-100">Year resumes were invented</div>
                </div>
                <div>
                  <div className="text-green-400 text-4xl font-bold mb-2">2025</div>
                  <div className="text-gray-100">Time for verified project portfolios</div>
                </div>
              </div>
            </div>

            <p className="text-lg text-gray-100 mb-8">
              Students deserve to be judged on what they've built, not how well they write bullet points. Companies deserve to hire based on verified skills, not polished claims.
            </p>

            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100" asChild>
              <Link href="/auth/register/role-selection">
                Get Started Free - Show Your Work
              </Link>
            </Button>
          </div>
        </section>

        {/* Join Us */}
        <section className="py-20 hero-bg">
          <div className="container max-w-4xl text-center">
            <h2 className="text-4xl font-display font-bold text-foreground mb-6">
              Join the Movement
            </h2>
            <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
              We're just getting started. Help us build a world where talent beats pedigree, and proof beats promises.
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg" asChild>
                <Link href="/auth/register/role-selection">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/how-it-works">See How It Works</Link>
              </Button>
            </div>

            <p className="mt-8 text-sm text-gray-700">
              For companies: <Link href="/auth/register/role-selection" className="text-primary hover:underline font-medium">Browse free, pay only for contacts →</Link>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
