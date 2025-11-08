'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Star, GraduationCap, Award, TrendingUp, ExternalLink, Filter } from 'lucide-react'
import { Link } from '@/navigation'
import { motion } from 'framer-motion'

interface FeaturedStudent {
  id: string
  username: string
  firstName: string
  lastName: string
  photo?: string
  university: string
  degree: string
  graduationYear: number
  projectsCount: number
  verificationScore: number
  skillsCount: number
  bio?: string
}

export default function FeaturedPortfoliosPage() {
  const t = useTranslations('studentsFeatured')
  const [students, setStudents] = useState<FeaturedStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'top-verified' | 'recent'>('all')

  useEffect(() => {
    // TODO: Replace with actual API call
    // For now, using mock data
    const mockStudents: FeaturedStudent[] = [
      {
        id: '1',
        username: 'john-doe',
        firstName: 'John',
        lastName: 'Doe',
        university: 'Politecnico di Milano',
        degree: 'Computer Science',
        graduationYear: 2024,
        projectsCount: 12,
        verificationScore: 100,
        skillsCount: 15,
        bio: 'Full-stack developer passionate about AI and web technologies'
      },
      {
        id: '2',
        username: 'maria-rossi',
        firstName: 'Maria',
        lastName: 'Rossi',
        university: 'Università di Bologna',
        degree: 'Data Science',
        graduationYear: 2024,
        projectsCount: 8,
        verificationScore: 95,
        skillsCount: 12,
        bio: 'Data scientist specializing in machine learning and analytics'
      }
    ]

    setStudents(mockStudents)
    setLoading(false)
  }, [filter])

  return (
    <div className="min-h-screen flex flex-col hero-bg">
      <Header />

      <main className="flex-1 pt-20">
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
                {t('hero.badge')}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                {t('hero.title')}
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
                {t('hero.description')}
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/auth/register?role=student">
                    {t('hero.ctaStudent')}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 border-white/30 hover:bg-white/20 text-white" asChild>
                  <Link href="/auth/register?role=company">
                    {t('hero.ctaRecruiter')}
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="bg-white border-b sticky top-20 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-700">{t('filters.label')}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  {t('filters.all')}
                </Button>
                <Button
                  variant={filter === 'top-verified' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('top-verified')}
                >
                  <Award className="h-4 w-4 mr-1" />
                  {t('filters.topVerified')}
                </Button>
                <Button
                  variant={filter === 'recent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('recent')}
                >
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {t('filters.recent')}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Students Grid */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">{t('loading')}</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('empty.title')}</h3>
              <p className="text-gray-600 mb-6">{t('empty.description')}</p>
              <Button asChild>
                <Link href="/auth/register?role=student">{t('empty.cta')}</Link>
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 h-full">
                    <CardHeader className="text-center pb-4">
                      <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow-lg">
                        <AvatarImage src={student.photo} alt={`${student.firstName} ${student.lastName}`} />
                        <AvatarFallback className="text-2xl bg-primary text-white">
                          {student.firstName[0]}{student.lastName[0]}
                        </AvatarFallback>
                      </Avatar>

                      <CardTitle className="text-xl mb-2">
                        {student.firstName} {student.lastName}
                      </CardTitle>

                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
                        <GraduationCap className="h-4 w-4" />
                        <span>{student.university}</span>
                      </div>

                      <p className="text-sm text-gray-600">{student.degree}</p>
                      <p className="text-xs text-gray-500">Class of {student.graduationYear}</p>

                      {student.bio && (
                        <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                          {student.bio}
                        </p>
                      )}
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 text-center py-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-2xl font-bold text-primary">{student.projectsCount}</div>
                          <div className="text-xs text-gray-600">{t('card.projects')}</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">{student.verificationScore}%</div>
                          <div className="text-xs text-gray-600">{t('card.verified')}</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{student.skillsCount}</div>
                          <div className="text-xs text-gray-600">{t('card.skills')}</div>
                        </div>
                      </div>

                      {/* Verification Badge */}
                      {student.verificationScore === 100 && (
                        <Badge className="w-full justify-center bg-green-500 hover:bg-green-600 text-white">
                          <Award className="h-3 w-3 mr-1" />
                          {t('card.fullyVerified')}
                        </Badge>
                      )}

                      {/* View Portfolio Button */}
                      <Button className="w-full" variant="outline" asChild>
                        <Link href={`/students/${student.username}/public`}>
                          {t('card.viewPortfolio')}
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-display font-bold mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              {t('cta.description')}
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/register?role=student">
                  {t('cta.primaryButton')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 hover:bg-white/20 text-white" asChild>
                <Link href="/how-it-works">
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
