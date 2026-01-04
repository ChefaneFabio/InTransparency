'use client'

import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Clock,
  Trophy,
  Users,
  ArrowRight,
  Send
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function SuccessStoriesPage() {
  const t = useTranslations('successStories')

  return (
    <div className="min-h-screen hero-bg">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="hero-bg py-20 relative overflow-hidden">
          <div className="container max-w-4xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Clock className="h-4 w-4" />
                Coming Soon
              </div>

              <h1 className="text-5xl font-display font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Success Stories
              </h1>

              <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto mb-8">
                We're building a collection of real success stories from verified students
                who found opportunities through InTransparency. Check back soon!
              </p>

              {/* Placeholder Cards */}
              <div className="grid md:grid-cols-3 gap-6 mt-12 mb-12">
                <Card className="bg-white/60 backdrop-blur border-dashed border-2 border-gray-300">
                  <CardContent className="pt-8 pb-8 text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Trophy className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-500 mb-2">Your Story Here</h3>
                    <p className="text-sm text-gray-400">
                      Share how verified skills helped your career
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur border-dashed border-2 border-gray-300">
                  <CardContent className="pt-8 pb-8 text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-500 mb-2">Real Students</h3>
                    <p className="text-sm text-gray-400">
                      Verified journeys from graduation to employment
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur border-dashed border-2 border-gray-300">
                  <CardContent className="pt-8 pb-8 text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Send className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-500 mb-2">Coming Soon</h3>
                    <p className="text-sm text-gray-400">
                      We're collecting stories from early users
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Got a Success Story?</h2>
                <p className="text-gray-700 mb-6">
                  If InTransparency helped you land an opportunity, we'd love to hear about it.
                  Your verified story could inspire other students.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild>
                    <Link href="/advocacy/submit-story">
                      Share Your Story
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/auth/register?role=student">
                      Create Your Portfolio
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
