'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Quote,
  TrendingUp,
  Award,
  Briefcase,
  ExternalLink,
  Star,
  GraduationCap
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface SuccessStory {
  id: string
  studentName: string
  studentUsername: string
  studentPhoto?: string
  university: string
  degree: string
  graduationYear: number
  companyName: string
  position: string
  salary?: string
  story: string
  quote: string
  projectsCount: number
  verificationScore: number
  timeToHire: string
}

export default function SuccessStoriesPage() {
  // Mock data - replace with actual API call
  const stories: SuccessStory[] = [
    {
      id: '1',
      studentName: 'Marco Bianchi',
      studentUsername: 'marco-bianchi',
      university: 'Politecnico di Milano',
      degree: 'Computer Engineering',
      graduationYear: 2023,
      companyName: 'Amazon Web Services',
      position: 'Cloud Solutions Architect',
      salary: '€65,000',
      timeToHire: '2 weeks',
      projectsCount: 15,
      verificationScore: 100,
      quote: "InTransparency completely changed my job search. Instead of sending hundreds of applications, recruiters found ME through my verified projects. I had 3 job offers within 2 weeks!",
      story: 'Marco uploaded his university-verified cloud computing projects to InTransparency. Within days, AWS recruiters discovered his portfolio through AI search and reached out directly. He accepted an offer without ever submitting a traditional application.'
    },
    {
      id: '2',
      studentName: 'Sofia Romano',
      studentUsername: 'sofia-romano',
      university: 'Università di Bologna',
      degree: 'Data Science',
      graduationYear: 2024,
      companyName: 'Google',
      position: 'Data Analyst',
      salary: '€55,000',
      timeToHire: '3 weeks',
      projectsCount: 10,
      verificationScore: 95,
      quote: "The verification system was a game-changer. Recruiters could see my actual work from university courses, not just claims on a CV. It gave me so much credibility.",
      story: 'Sofia showcased her machine learning projects from her Master\'s thesis. Google recruiters used InTransparency\'s course-level search to find students with specific ML experience. Sofia\'s verified projects stood out, leading to interviews and an offer.'
    },
    {
      id: '3',
      studentName: 'Luca Ferrari',
      studentUsername: 'luca-ferrari',
      university: 'Sapienza Università di Roma',
      degree: 'Software Engineering',
      graduationYear: 2023,
      companyName: 'Microsoft',
      position: 'Software Engineer',
      salary: '€60,000',
      timeToHire: '1 week',
      projectsCount: 12,
      verificationScore: 100,
      quote: "I got hired based on my final year project! The recruiter saw it on InTransparency, loved the technical depth, and fast-tracked my interview. I started working just 2 weeks after graduating.",
      story: 'Luca\'s university-verified distributed systems project caught Microsoft\'s attention. The detailed project documentation and 30/30 grade gave recruiters confidence in his abilities. He received an offer before most of his classmates even started applying.'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Badge className="mb-4 bg-white/20 text-white border-white/30">
                <Star className="h-3 w-3 mr-1" />
                Success Stories
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Real Students. Real Success.
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
                Discover how university-verified portfolios are transforming student careers. These students got discovered by top companies without sending a single application.
              </p>
              <div className="flex items-center justify-center gap-6 text-white/90">
                <div className="text-center">
                  <div className="text-3xl font-bold">2,500+</div>
                  <div className="text-sm">Students Hired</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold">€52k</div>
                  <div className="text-sm">Avg. Starting Salary</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold">2 weeks</div>
                  <div className="text-sm">Avg. Time to Hire</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="space-y-12">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card className="overflow-hidden border-2 hover:border-primary/30 transition-all duration-300">
                  <div className="md:flex">
                    {/* Left Column - Student Info */}
                    <div className="md:w-1/3 bg-gradient-to-br from-primary/5 to-secondary/5 p-8 border-r">
                      <div className="text-center">
                        <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-white shadow-lg">
                          <AvatarImage src={story.studentPhoto} alt={story.studentName} />
                          <AvatarFallback className="text-3xl bg-primary text-white">
                            {story.studentName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>

                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {story.studentName}
                        </h3>

                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <div className="flex items-center justify-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            {story.university}
                          </div>
                          <div>{story.degree}</div>
                          <div>Class of {story.graduationYear}</div>
                        </div>

                        <div className="mb-6">
                          <Badge className="bg-green-500 text-white mb-2">
                            <Award className="h-3 w-3 mr-1" />
                            {story.verificationScore}% Verified
                          </Badge>
                          <div className="text-sm text-gray-600">
                            {story.projectsCount} Verified Projects
                          </div>
                        </div>

                        <Button variant="outline" className="w-full" asChild>
                          <Link href={`/students/${story.studentUsername}/public`}>
                            View Portfolio
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* Right Column - Story */}
                    <CardContent className="md:w-2/3 p-8">
                      {/* Company & Position */}
                      <div className="mb-6">
                        <div className="flex items-center gap-3 mb-3">
                          <Briefcase className="h-6 w-6 text-primary" />
                          <div>
                            <div className="text-2xl font-bold text-gray-900">
                              {story.position}
                            </div>
                            <div className="text-lg text-gray-600">
                              {story.companyName}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-4 text-sm">
                          {story.salary && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              💰 {story.salary}/year
                            </Badge>
                          )}
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Hired in {story.timeToHire}
                          </Badge>
                        </div>
                      </div>

                      {/* Quote */}
                      <div className="relative bg-primary/5 border-l-4 border-primary p-6 mb-6 rounded-r-lg">
                        <Quote className="absolute top-4 left-4 h-8 w-8 text-primary/20" />
                        <p className="text-lg italic text-gray-700 pl-8">
                          "{story.quote}"
                        </p>
                      </div>

                      {/* Story */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 text-lg">How It Happened</h4>
                        <p className="text-gray-700 leading-relaxed">
                          {story.story}
                        </p>
                      </div>

                      {/* Key Metrics */}
                      <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-primary">{story.projectsCount}</div>
                          <div className="text-xs text-gray-600">Projects Uploaded</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">{story.verificationScore}%</div>
                          <div className="text-xs text-gray-600">Verification Score</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{story.timeToHire}</div>
                          <div className="text-xs text-gray-600">Time to Offer</div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why It Works Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Why InTransparency Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">University Verification</h3>
                <p className="text-gray-600">
                  Your projects are verified by your institution, giving recruiters confidence in your work without lengthy screening.
                </p>
              </Card>

              <Card className="text-center p-6">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Passive Discovery</h3>
                <p className="text-gray-600">
                  Companies find YOU through AI search. No more sending hundreds of applications - let your work speak for itself.
                </p>
              </Card>

              <Card className="text-center p-6">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Higher Quality Matches</h3>
                <p className="text-gray-600">
                  Recruiters see your actual work upfront. This leads to better conversations, faster interviews, and higher offer rates.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join 125,000+ students who are getting discovered by top companies through verified portfolios
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register?role=student">
                  Create Your Free Portfolio
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 hover:bg-white/20 text-white" asChild>
                <Link href="/explore">
                  Explore Student Portfolios
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
