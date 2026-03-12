'use client'

import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import {
  Building2,
  Users,
  BookOpen,
  Euro,
  ArrowRight,
  CheckCircle,
  Landmark,
  Factory,
  HeartHandshake,
  BarChart3,
  Brain,
  Shield,
  Zap,
  TrendingUp,
  Clock,
  Globe,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
}

const STEPS = [
  {
    icon: Building2,
    title: 'Register your park',
    description:
      'Create a free tech park account. Add your member companies or invite them directly. Setup takes under 10 minutes.',
  },
  {
    icon: Users,
    title: 'Member companies browse talent',
    description:
      'Your companies get access to AI-verified student profiles with normalized grades, skill maps, and project portfolios.',
  },
  {
    icon: Euro,
    title: 'Pay only \u20AC10 per contact',
    description:
      'Companies pay per contact\u2014not per seat, not per year. The park pays nothing. You deliver value, they cover the cost.',
  },
]

const BENEFITS = [
  {
    icon: Shield,
    title: 'Zero cost for the park',
    description:
      'You add value to your member companies at no expense. Companies pay only when they contact a candidate\u2014\u20AC10 each.',
  },
  {
    icon: Brain,
    title: 'AI-verified talent pipeline',
    description:
      'Every student profile includes AI-analyzed grades, project work, and competency maps. No unverified CVs.',
  },
  {
    icon: BarChart3,
    title: 'Placement analytics',
    description:
      'Track which companies hire, how fast, and from which disciplines. Prove your park\u2019s impact with real data.',
  },
  {
    icon: Zap,
    title: 'Skill matching',
    description:
      'AI maps student competencies to company needs. Member companies find the right talent without keyword guessing.',
  },
  {
    icon: Globe,
    title: 'Works for all park types',
    description:
      'Private, public, or mixed governance\u2014the platform adapts. No procurement overhead for public entities.',
  },
  {
    icon: HeartHandshake,
    title: 'Strengthen member retention',
    description:
      'Offer a concrete recruiting benefit that keeps companies engaged with the park ecosystem year-round.',
  },
]

const PARK_TYPES = [
  {
    icon: Factory,
    name: 'Kilometro Rosso',
    type: 'Private',
    location: 'Bergamo, Italy',
    description:
      'Fast decision-making, direct company engagement. Private parks can onboard in days and start matching talent immediately.',
    color: 'bg-emerald-100 text-emerald-700',
    borderColor: 'border-emerald-200',
  },
  {
    icon: HeartHandshake,
    name: 'Servitec',
    type: 'Mixed',
    location: 'Bergamo, Italy',
    description:
      'Public-private partnerships that bridge institutional credibility with startup agility. Hybrid governance, flexible onboarding.',
    color: 'bg-amber-100 text-amber-700',
    borderColor: 'border-amber-200',
  },
  {
    icon: Landmark,
    name: 'NOI Techpark',
    type: 'Public',
    location: 'Bolzano, Italy',
    description:
      'Institutional scale with longer timelines. Public parks get the same platform\u2014no procurement friction, no license fees.',
    color: 'bg-blue-100 text-blue-700',
    borderColor: 'border-blue-200',
  },
]

const COMPARISON = [
  {
    dimension: 'Decision speed',
    private: 'Fast\u2014days to weeks',
    public: 'Longer\u20144\u201312 weeks',
  },
  {
    dimension: 'Onboarding',
    private: 'Self-serve, immediate',
    public: 'Guided, with stakeholder alignment',
  },
  {
    dimension: 'Cost to park',
    private: 'Free',
    public: 'Free',
  },
  {
    dimension: 'Company engagement',
    private: 'Direct invites',
    public: 'Institutional rollout',
  },
  {
    dimension: 'Impact measurement',
    private: 'Company-level analytics',
    public: 'Aggregate institutional reports',
  },
  {
    dimension: 'Typical timeline to first hire',
    private: '2\u20134 weeks',
    public: '6\u201312 weeks',
  },
]

export default function ForTechParksPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-emerald-900 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative container max-w-6xl mx-auto px-4 py-20 lg:py-28">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-white/20">
              <Building2 className="h-3 w-3 mr-1" />
              For Tech Parks
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Give your member companies a recruiting advantage
            </h1>
            <p className="text-lg text-emerald-200 mb-8 max-w-2xl mx-auto">
              Offer an AI-verified talent pipeline as a park benefit. Your companies get access to
              pre-screened students with normalized grades and skill maps — at zero cost to the park.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register/techpark">
                <Button
                  size="lg"
                  className="bg-white text-emerald-900 hover:bg-emerald-50 w-full sm:w-auto"
                >
                  <Building2 className="h-5 w-5 mr-2" />
                  Register your tech park — it&apos;s free
                </Button>
              </Link>
              <Link href="/contact?subject=techpark-demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  Request a demo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
          >
            {[
              { icon: Users, value: '2,400+', label: 'Students' },
              { icon: Building2, value: '180+', label: 'Companies' },
              { icon: BookOpen, value: '15', label: 'Disciplines' },
              { icon: Euro, value: '\u20AC10', label: 'Per contact' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <stat.icon className="h-6 w-6 mx-auto mb-2 text-emerald-300" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-emerald-300">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <Badge variant="outline" className="mb-4 border-emerald-200 text-emerald-700">
              <Zap className="h-3 w-3 mr-1" />
              Simple setup
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Three steps to give your member companies access to verified student talent.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
              >
                <Card className="h-full border-emerald-100 hover:border-emerald-300 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold text-lg">
                        {i + 1}
                      </div>
                      <step.icon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Benefits for tech parks</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Add a tangible recruiting benefit to your park ecosystem without spending a cent.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="p-2 rounded-lg bg-emerald-50 w-fit mb-4">
                      <benefit.icon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Park Types */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Built for every type of tech park
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Whether your park is privately run, publicly funded, or a hybrid
              — the platform fits your governance model.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {PARK_TYPES.map((park, i) => (
              <motion.div
                key={park.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
              >
                <Card className={`h-full ${park.borderColor}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg ${park.color}`}>
                        <park.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{park.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {park.type}
                          </Badge>
                          <span className="text-xs text-gray-500">{park.location}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{park.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Private vs. public parks
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Different governance, same platform. Here is how the experience differs.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
          >
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-4 font-semibold text-gray-700" />
                        <th className="text-left p-4 font-semibold text-emerald-700">
                          <div className="flex items-center gap-2">
                            <Factory className="h-4 w-4" />
                            Private parks
                          </div>
                        </th>
                        <th className="text-left p-4 font-semibold text-blue-700">
                          <div className="flex items-center gap-2">
                            <Landmark className="h-4 w-4" />
                            Public parks
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARISON.map((row, i) => (
                        <tr
                          key={row.dimension}
                          className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                        >
                          <td className="p-4 font-medium text-gray-900">{row.dimension}</td>
                          <td className="p-4 text-gray-700">{row.private}</td>
                          <td className="p-4 text-gray-700">{row.public}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-emerald-700 text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="text-3xl font-bold mb-4">
              Register your tech park — it&apos;s free
            </h2>
            <p className="text-emerald-200 mb-8 max-w-xl mx-auto">
              Give your member companies a direct line to AI-verified student talent.
              No license fees, no procurement, no risk.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register/techpark">
                <Button
                  size="lg"
                  className="bg-white text-emerald-900 hover:bg-emerald-50 w-full sm:w-auto"
                >
                  <Building2 className="h-5 w-5 mr-2" />
                  Register your tech park
                </Button>
              </Link>
              <Link href="/contact?subject=techpark-demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  Talk to our team
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-emerald-200">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> Free for parks
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> GDPR compliant
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> Live in 10 minutes
              </span>
            </div>
            <div className="mt-6">
              <Link
                href="/auth/login"
                className="text-emerald-300 hover:text-white text-sm underline underline-offset-4 transition-colors"
              >
                Already a recruiter? Sign in
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
