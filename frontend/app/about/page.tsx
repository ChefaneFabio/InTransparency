'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileX2, Code2, TrendingUp, Users, Shield, Zap, Target, Heart } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section - The Problem */}
        <section className="bg-gradient-to-br from-red-50 to-orange-50 py-20">
          <div className="container max-w-4xl">
            <div className="text-center mb-12">
              <div className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                The Problem We're Solving
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Resumes Are Broken.
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                Anyone can claim "Proficient in React" or "Expert in Python" on a resume. <br />
                Recruiters waste time interviewing unqualified candidates. <br />
                <strong>Students with real skills get overlooked</strong> because they don't have fancy internships.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-white">
                <CardContent className="p-8">
                  <FileX2 className="h-12 w-12 text-red-600 mb-4" />
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

              <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
                <CardContent className="p-8">
                  <Code2 className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">The InTransparency Way</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>✅ University-verified projects</li>
                    <li>✅ GitHub commit history validation</li>
                    <li>✅ AI-powered skill analysis</li>
                    <li>✅ Proof of work beats claims</li>
                    <li>✅ Find hidden talent 2x faster</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-20 bg-white">
          <div className="container max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                We're building the world's first <strong>verified project portfolio platform</strong> where students prove their skills through what they've actually built, not what they claim they can do.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white text-center mb-16">
              <blockquote className="text-2xl font-medium italic mb-4">
                "Projects speak louder than resumes."
              </blockquote>
              <p className="text-blue-50">
                — The InTransparency Philosophy
              </p>
            </div>

            {/* Our Story */}
            <div className="prose prose-lg max-w-none">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">How We Started</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                InTransparency was born from frustration. Our founders watched talented students with incredible university projects get rejected from jobs because their resumes didn't list "2+ years experience" or a FAANG internship.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Meanwhile, companies complained about hiring candidates who looked great on paper but couldn't code. The disconnect was obvious: <strong>resumes reward good storytelling, not good building.</strong>
              </p>
              <p className="text-gray-700 leading-relaxed mb-8">
                We asked a simple question: What if students could show their work instead of just listing it? What if recruiters could see verified projects with AI analysis, commit histories, and university endorsements?
              </p>
              <p className="text-gray-700 leading-relaxed font-semibold">
                InTransparency was our answer.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-gray-50">
          <div className="container max-w-6xl">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
              What We Believe
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Shield,
                  title: 'Verification Over Claims',
                  description: 'University-backed projects, GitHub validation, and professor endorsements prove skills are real.'
                },
                {
                  icon: Target,
                  title: 'Proof of Work',
                  description: 'Show what you\'ve built, not what you say you can build. Code speaks louder than bullet points.'
                },
                {
                  icon: Users,
                  title: 'Talent Over Pedigree',
                  description: 'A brilliant project from a state school beats a mediocre resume from an Ivy League.'
                },
                {
                  icon: Heart,
                  title: 'Transparency Always',
                  description: 'No hidden algorithms. Students see who viewed their profile. Companies see verified data.'
                }
              ].map((value, idx) => {
                const Icon = value.icon
                return (
                  <Card key={idx} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-8">
                      <div className="inline-block bg-blue-100 rounded-full p-4 mb-4">
                        <Icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {value.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Our Impact */}
        <section className="py-20 bg-white">
          <div className="container max-w-4xl">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">
              The Impact So Far
            </h2>
            <p className="text-xl text-gray-700 text-center mb-16">
              Real results from students who chose proof over polish
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                { value: '1,247', label: 'Students Hired', sublabel: 'In the last 30 days' },
                { value: '87%', label: 'Get Interviews', sublabel: 'Within 30 days of joining' },
                { value: '2x Faster', label: 'Time to Hire', sublabel: 'vs traditional applications' }
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-5xl font-bold text-blue-600 mb-2">{stat.value}</div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-700">{stat.sublabel}</div>
                </div>
              ))}
            </div>

            {/* Quote */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    AJ
                  </div>
                  <div>
                    <p className="text-gray-800 italic mb-4 leading-relaxed">
                      "I had a 3.2 GPA and no internships. My resume got auto-rejected everywhere. But when I uploaded my ML trading bot to InTransparency and got an 92 innovation score, recruiters started messaging me. Got hired by a fintech startup in 3 weeks."
                    </p>
                    <div className="font-semibold text-gray-900">Alex Johnson</div>
                    <div className="text-sm text-gray-800">MIT Computer Science → Hired at TechCorp</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* The Enemy: Resumes */}
        <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="container max-w-4xl text-center">
            <h2 className="text-4xl font-bold mb-6">
              It's Time to Kill the Resume
            </h2>
            <p className="text-xl text-gray-100 leading-relaxed mb-8 max-w-2xl mx-auto">
              Resumes were invented in 1482. We have GitHub, AI, and university verification now. Why are we still using a 500-year-old tool to hire for 21st-century jobs?
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
              <Link href="/auth/register/student">
                Show Your Work, Not Your Resume
              </Link>
            </Button>
          </div>
        </section>

        {/* Join Us */}
        <section className="py-20 bg-white">
          <div className="container max-w-4xl text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Join the Movement
            </h2>
            <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
              We're just getting started. Help us build a world where talent beats pedigree, and proof beats promises.
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                <Link href="/auth/register/student">Create Free Portfolio</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/how-it-works">See How It Works</Link>
              </Button>
            </div>

            <p className="mt-8 text-sm text-gray-700">
              For recruiters: <Link href="/auth/register/recruiter" className="text-blue-600 hover:underline font-medium">Start finding verified talent →</Link>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
