'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/navigation'
import { motion } from 'framer-motion'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export default function CompanyProfilePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">

          {/* Cover */}
          <motion.div {...fadeIn} className="mb-20 text-center">
            <div className="mb-8">
              <img src="/images/logo-banner.png" alt="InTransparency" className="h-12 mx-auto" />
            </div>
            <div className="inline-block bg-primary text-white rounded-2xl px-10 py-8">
              <h1 className="text-4xl font-display font-bold mb-2">Company Profile</h1>
              <p className="text-white/80">March 2026</p>
            </div>
          </motion.div>

          {/* OVERVIEW */}
          <motion.section {...fadeIn} className="mb-16">
            <h2 className="text-primary font-bold text-lg uppercase tracking-wider mb-6">Overview</h2>
            <p className="text-gray-800 text-lg leading-relaxed mb-6">
              InTransparency is a <strong>verified talent intelligence platform</strong> that connects students, universities, and companies through <strong>institution-verified project portfolios</strong> — replacing resumes with proof of real skills across every discipline.
            </p>
            <p className="text-gray-800 text-lg leading-relaxed">
              Unlike job boards and professional networks that rely on self-reported claims, InTransparency ensures every skill is <strong>traceable to a verified academic project</strong>, analyzed by AI, and stamped by the student's institution. Companies hire on proof. Students get discovered for what they can actually do.
            </p>
          </motion.section>

          {/* THE INTRANSPARENCY REVOLUTION */}
          <motion.section {...fadeIn} className="mb-16">
            <h2 className="text-primary font-bold text-lg uppercase tracking-wider mb-6">The InTransparency Revolution</h2>
            <p className="text-gray-800 leading-relaxed mb-4">
              The company was founded in 2024 with the ambitious purpose of becoming the <strong>European standard for transparent hiring</strong> — reshaping how companies find, verify, and onboard talent across all white-collar sectors.
            </p>
            <p className="text-gray-800 leading-relaxed mb-4">
              InTransparency was recognized at <strong>Start Cup Bergamo 2025</strong>, winning <strong>2 prizes</strong>, and launched its pilot partnership with <strong>Università degli Studi di Bergamo</strong>.
            </p>
            <p className="text-gray-800 leading-relaxed mb-4">
              The platform serves <strong>three customer segments</strong> — students (all disciplines), companies and startups (all industries), and universities and schools — with a freemium model where core access is free for everyone.
            </p>
            <p className="text-gray-800 leading-relaxed">
              With headquarters in <strong>Bergamo, Italy</strong>, InTransparency is building the trust layer for European hiring — starting from Italy and expanding across the continent.
            </p>
          </motion.section>

          {/* THE PLATFORM */}
          <motion.section {...fadeIn} className="mb-16">
            <h2 className="text-primary font-bold text-lg uppercase tracking-wider mb-6">The Platform</h2>

            <h3 className="font-bold text-gray-900 text-lg mb-3">How does it work?</h3>
            <p className="text-gray-800 leading-relaxed mb-6">
              Students upload real academic projects — theses, lab work, business cases, engineering designs, code — in any format. The platform's AI analyzes each project, extracting technical skills, soft skills, complexity, and innovation scores. The student's university then verifies the work with a single click, adding institutional credibility that no resume can match.
            </p>
            <p className="text-gray-800 leading-relaxed mb-8">
              Companies search verified portfolios using AI-powered matching, semantic skill search, and advanced filters. When they find the right candidate, they connect directly — no agencies, no middlemen, no guesswork.
            </p>

            <h3 className="text-primary font-bold mb-4">For Students — Always Free</h3>
            <div className="space-y-3 mb-8 ml-4">
              <p className="text-gray-800"><strong>Verified Portfolio</strong> — upload unlimited projects in any format. AI extracts skills, your university verifies the work.</p>
              <p className="text-gray-800"><strong>Skills Intelligence</strong> — track your skill growth over time, see proficiency levels, discover transferable skills you didn't know you had.</p>
              <p className="text-gray-800"><strong>Career Tools</strong> — AI interview prep, job ad decoder, salary benchmarks for 43+ roles, contract transparency with CCNL verification, RAL-to-net calculator.</p>
              <p className="text-gray-800"><strong>Passive Discovery</strong> — companies find you based on verified skills. No applications, no cover letters.</p>
            </div>

            <h3 className="text-primary font-bold mb-4">For Companies & Startups — Full Access</h3>
            <div className="space-y-3 mb-8 ml-4">
              <p className="text-gray-800"><strong>Verified Talent Pool</strong> — browse institution-verified portfolios across tech, engineering, business, design, science, legal, and every other sector.</p>
              <p className="text-gray-800"><strong>AI-Powered Matching</strong> — semantic skill matching with synonym resolution (React.js = ReactJS = React), adjacency detection, and proficiency scoring.</p>
              <p className="text-gray-800"><strong>Readiness Briefs</strong> — for every candidate, see exactly what tasks they can handle on day one, a 30/60/90 onboarding path, team fit analysis, and growth areas.</p>
              <p className="text-gray-800"><strong>Hiring Intelligence</strong> — decision packs, candidate comparison with radar charts, hiring outcome tracking, market intelligence dashboards.</p>
            </div>

            <h3 className="text-primary font-bold mb-4">For Universities & Schools — Full Access</h3>
            <div className="space-y-3 mb-8 ml-4">
              <p className="text-gray-800"><strong>One-Click Verification</strong> — verify student projects and grades with institutional credibility. Batch approval for efficiency.</p>
              <p className="text-gray-800"><strong>Curriculum Alignment</strong> — see how your courses map to market demand. Know which skills companies search for vs. what your students demonstrate.</p>
              <p className="text-gray-800"><strong>Placement Reports</strong> — real-time placement data: who got contacted, interviewed, hired. Exportable reports for ANVUR accreditation.</p>
              <p className="text-gray-800"><strong>Company Engagement</strong> — which companies are actively engaging with your students, what roles they're hiring for, and which degrees they're interested in.</p>
            </div>
          </motion.section>

          {/* WHY INTRANSPARENCY */}
          <motion.section {...fadeIn} className="mb-16">
            <h2 className="text-primary font-bold text-lg uppercase tracking-wider mb-6">Why InTransparency</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <p className="font-bold text-gray-900">Verification at the core</p>
                <p className="text-gray-700">Every skill traced to a real project, verified by the student's institution. Not self-reported. Not a claim. Proof.</p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <p className="font-bold text-gray-900">Every sector, every discipline</p>
                <p className="text-gray-700">29 project categories across tech, engineering, business, design, science, legal, architecture, pharma. 43 salary benchmarks. Not just for coders.</p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <p className="font-bold text-gray-900">Skills Intelligence, not keyword matching</p>
                <p className="text-gray-700">Semantic matching with 60+ synonym groups, skill adjacency graphs, transferable skill detection, and four-level proficiency scoring (exposure → expert).</p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <p className="font-bold text-gray-900">Transparency for everyone</p>
                <p className="text-gray-700">Students see who views their work. Companies see verified data. Universities see real outcomes. No hidden algorithms, no black boxes.</p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <p className="font-bold text-gray-900">Built for the real problems</p>
                <p className="text-gray-700">Contract transparency with Italian labor law (CCNL, livelli, fake P.IVA detection). RAL-to-net calculator. Interview prep. Job ad decoder. The tools no one else gives young workers for free.</p>
              </div>
            </div>
          </motion.section>

          {/* AT A GLANCE */}
          <motion.section {...fadeIn}>
            <h2 className="text-primary font-bold text-lg uppercase tracking-wider mb-6">InTransparency at a Glance</h2>
            <Card className="bg-primary text-white border-0">
              <CardContent className="p-8 space-y-5">
                {[
                  { value: '29', label: 'project disciplines — from software to architecture to pharma' },
                  { value: '43', label: 'salary benchmarks across 14 sectors with city-level adjustments' },
                  { value: '60+', label: 'semantic skill synonym groups for intelligent matching' },
                  { value: '9', label: 'Italian contract types analyzed with CCNL verification' },
                  { value: '3', label: 'customer segments — students, companies, universities' },
                  { value: '€0', label: 'for everyone during launch — full access, no paywall' },
                  { value: 'IT/EN', label: 'bilingual platform, ready for European expansion' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-baseline gap-4">
                    <span className="text-3xl font-bold text-white min-w-[80px]">{stat.value}</span>
                    <span className="text-white/80">{stat.label}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="text-center mt-12">
              <Button size="lg" asChild>
                <Link href="/auth/register">
                  Join InTransparency
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                intransparency.com — Bergamo, Italy
              </p>
            </div>
          </motion.section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
