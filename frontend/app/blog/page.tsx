'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  BookOpen,
  Mail,
  Bell,
  Sparkles,
  Rocket,
  PenTool
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function BlogPage() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Store in localStorage for now
      const subscribers = JSON.parse(localStorage.getItem('blog_subscribers') || '[]')
      subscribers.push({ email, timestamp: new Date().toISOString() })
      localStorage.setItem('blog_subscribers', JSON.stringify(subscribers))
      setSubscribed(true)
    }
  }

  const upcomingTopics = [
    {
      icon: Sparkles,
      title: 'AI-Powered Portfolio Analysis',
      description: 'How machine learning evaluates your projects'
    },
    {
      icon: Rocket,
      title: 'Success Stories',
      description: 'Real students landing dream jobs'
    },
    {
      icon: PenTool,
      title: 'Career Development Tips',
      description: 'Expert advice for students and professionals'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section with Animation */}
        <section className="py-24 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-20 -left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute top-40 -right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
              animate={{
                x: [0, -100, 0],
                y: [0, 100, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
              animate={{
                x: [0, -50, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <div className="container max-w-4xl mx-auto px-4 text-center relative z-10">
            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-6"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg px-6 py-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    <span className="font-semibold">Coming Soon</span>
                  </div>
                </Card>
              </motion.div>
            </motion.div>

            {/* Main Heading with Gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              Our Blog is Launching Soon
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto"
            >
              Get ready for insights, success stories, and expert advice on career development, AI-powered portfolios, and the future of talent discovery.
            </motion.p>

            {/* Animated Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-12"
            >
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                  <BookOpen className="h-16 w-16 text-white" />
                </div>
              </motion.div>
            </motion.div>

            {/* Email Signup Form */}
            {!subscribed ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="max-w-md mx-auto shadow-xl border-2 border-gray-200">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-center mb-4">
                      <Bell className="h-6 w-6 text-blue-600 mr-2" />
                      <h3 className="text-xl font-bold text-gray-900">Get Notified</h3>
                    </div>
                    <p className="text-gray-600 mb-6">
                      Be the first to know when we publish our first articles
                    </p>
                    <form onSubmit={handleSubscribe} className="space-y-4">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pl-10 py-6"
                        />
                      </div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg"
                        >
                          Subscribe for Updates
                        </Button>
                      </motion.div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="max-w-md mx-auto shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.6 }}
                      className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <motion.svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <motion.path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">You're Subscribed!</h3>
                    <p className="text-gray-700">
                      We'll email you at <span className="font-semibold">{email}</span> when our blog launches.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </section>

        {/* What to Expect Section */}
        <section className="py-20 bg-white">
          <div className="container max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                What to Expect
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Valuable content crafted to help you succeed
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {upcomingTopics.map((topic, index) => {
                const Icon = topic.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  >
                    <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 border-gray-100">
                      <CardContent className="p-8 text-center">
                        <motion.div
                          className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Icon className="h-10 w-10 text-white" />
                        </motion.div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {topic.title}
                        </h3>
                        <p className="text-gray-600">
                          {topic.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}