'use client'

import { useTranslations } from 'next-intl'
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
  GraduationCap,
  Trophy
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { IMAGES } from '@/lib/images'

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
  const t = useTranslations('successStories')
  const tLabels = useTranslations('successStories.labels')
  const tStories = useTranslations('successStories.stories')

  // Load stories from translations
  const stories: SuccessStory[] = [0, 1, 2].map((index) => ({
    id: String(index + 1),
    studentName: tStories(`${index}.name`),
    studentUsername: tStories(`${index}.username`),
    university: tStories(`${index}.university`),
    degree: tStories(`${index}.degree`),
    graduationYear: parseInt(tStories(`${index}.graduationYear`)),
    companyName: tStories(`${index}.company`),
    position: tStories(`${index}.position`),
    salary: tStories(`${index}.salary`),
    timeToHire: tStories(`${index}.timeToHire`),
    projectsCount: parseInt(tStories(`${index}.projectsCount`)),
    verificationScore: parseInt(tStories(`${index}.verificationScore`)),
    quote: tStories(`${index}.quote`),
    story: tStories(`${index}.story`)
  }))

  return (
    <div className="min-h-screen hero-bg">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="hero-bg py-20 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-5">
            <Image
              src={IMAGES.students.student4}
              alt="Background pattern"
              fill
              className="object-cover"
            />
          </div>
          <div className="container max-w-5xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Trophy className="h-4 w-4" />
                {t('hero.badge')}
              </div>
              <h1 className="text-5xl font-display font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {t('hero.title')}
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-8">
                {t('hero.subtitle')}
              </p>

              {/* Stats */}
              <div className="flex justify-center space-x-8 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{t('hero.stats.0.value')}</div>
                  <div className="text-sm text-gray-700">{t('hero.stats.0.label')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{t('hero.stats.1.value')}</div>
                  <div className="text-sm text-gray-700">{t('hero.stats.1.label')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{t('hero.stats.2.value')}</div>
                  <div className="text-sm text-gray-700">{t('hero.stats.2.label')}</div>
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
                <Card className="bg-white overflow-hidden border-2 hover:border-primary/30 hover:shadow-xl transition-all duration-300">
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
                          <div>{tLabels('classOf')} {story.graduationYear}</div>
                        </div>

                        <div className="mb-6">
                          <Badge className="bg-green-500 text-white mb-2">
                            <Award className="h-3 w-3 mr-1" />
                            {story.verificationScore}% {tLabels('verified')}
                          </Badge>
                          <div className="text-sm text-gray-600">
                            {story.projectsCount} {tLabels('verifiedProjects')}
                          </div>
                        </div>

                        <Button variant="outline" className="w-full" asChild>
                          <Link href={`/students/${story.studentUsername}/public`}>
                            {tLabels('viewPortfolio')}
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
                              💰 {story.salary}{tLabels('perYear')}
                            </Badge>
                          )}
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {tLabels('hiredIn')} {story.timeToHire}
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
                        <h4 className="font-semibold text-gray-900 text-lg">{tLabels('howItHappened')}</h4>
                        <p className="text-gray-700 leading-relaxed">
                          {story.story}
                        </p>
                      </div>

                      {/* Key Metrics */}
                      <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-primary">{story.projectsCount}</div>
                          <div className="text-xs text-gray-600">{tLabels('projectsUploaded')}</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">{story.verificationScore}%</div>
                          <div className="text-xs text-gray-600">{tLabels('verificationScore')}</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{story.timeToHire}</div>
                          <div className="text-xs text-gray-600">{tLabels('timeToOffer')}</div>
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
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-display font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('whyItWorks.title')}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-white text-center p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('whyItWorks.0.title')}</h3>
                <p className="text-gray-600">
                  {t('whyItWorks.0.description')}
                </p>
              </Card>

              <Card className="bg-white text-center p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('whyItWorks.1.title')}</h3>
                <p className="text-gray-600">
                  {t('whyItWorks.1.description')}
                </p>
              </Card>

              <Card className="bg-white text-center p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('whyItWorks.2.title')}</h3>
                <p className="text-gray-600">
                  {t('whyItWorks.2.description')}
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              {t('cta.subtitle')}
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/register?role=student">
                  {t('cta.primaryButton')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 hover:bg-white/20 text-white" asChild>
                <Link href="/explore">
                  {t('cta.secondaryButton')}
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
