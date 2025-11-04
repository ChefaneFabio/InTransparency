'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle,
  HelpCircle,
  User,
  Building2
} from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { IMAGES } from '@/lib/images'
import { useTranslations } from 'next-intl'

export default function ContactPage() {
  const t = useTranslations('contact')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    subject: '',
    message: '',
    priority: 'medium'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen hero-bg">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary to-secondary text-white relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-10">
            <Image
              src={IMAGES.companies.team}
              alt="Background pattern"
              fill
              className="object-cover"
            />
          </div>
          <div className="container max-w-4xl mx-auto px-4 text-center relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-display font-bold mb-6"
            >
              {t('hero.title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-white max-w-2xl mx-auto"
            >
              {t('hero.subtitle')}
            </motion.p>
          </div>
        </section>

        {/* Contact Information & Form */}
        <section className="py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                    {t('section.title')}
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    {t('section.subtitle')}
                  </p>
                </div>

                {/* Contact Methods */}
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{t('methods.email.title')}</h3>
                          <p className="text-gray-600">in.transparency.job@gmail.com</p>
                          <p className="text-sm text-gray-700">{t('methods.email.subtitle')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Phone className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{t('methods.phone.title')}</h3>
                          <p className="text-gray-600">+39 348 170 1615</p>
                          <p className="text-sm text-gray-700">{t('methods.phone.subtitle')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <MapPin className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{t('methods.location.title')}</h3>
                          <p className="text-gray-600">{t('methods.location.value')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Support Resources */}
                <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <HelpCircle className="h-5 w-5 mr-2" />
                      {t('resources.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('resources.commonQuestions')}</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• {t('resources.questions.0')}</li>
                          <li>• {t('resources.questions.1')}</li>
                          <li>• {t('resources.questions.2')}</li>
                          <li>• {t('resources.questions.3')}</li>
                        </ul>
                      </div>
                      <div className="pt-4 border-t border-primary/20">
                        <p className="text-sm text-gray-700 mb-3">
                          <strong>{t('resources.students')}</strong>
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>{t('resources.recruiters')}</strong>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>{t('form.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isSubmitted ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('form.success.title')}</h3>
                        <p className="text-gray-600 mb-4">
                          {t('form.success.message')}
                        </p>
                        <Button onClick={() => setIsSubmitted(false)} variant="outline">
                          {t('form.success.button')}
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t('form.fullName')} *
                            </label>
                            <input
                              type="text"
                              name="name"
                              required
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder={t('form.placeholders.fullName')}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t('form.emailAddress')} *
                            </label>
                            <input
                              type="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder={t('form.placeholders.email')}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t('form.companyUniversity')}
                            </label>
                            <input
                              type="text"
                              name="company"
                              value={formData.company}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder={t('form.placeholders.company')}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t('form.role')}
                            </label>
                            <select
                              name="role"
                              value={formData.role}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">{t('form.roleOptions.select')}</option>
                              <option value="student">{t('form.roleOptions.student')}</option>
                              <option value="recruiter">{t('form.roleOptions.recruiter')}</option>
                              <option value="university-admin">{t('form.roleOptions.universityAdmin')}</option>
                              <option value="professor">{t('form.roleOptions.professor')}</option>
                              <option value="other">{t('form.roleOptions.other')}</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('form.subject')} *
                          </label>
                          <input
                            type="text"
                            name="subject"
                            required
                            value={formData.subject}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={t('form.subjectPlaceholder')}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('form.priority')}
                          </label>
                          <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="low">{t('form.priorityOptions.low')}</option>
                            <option value="medium">{t('form.priorityOptions.medium')}</option>
                            <option value="high">{t('form.priorityOptions.high')}</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('form.message')} *
                          </label>
                          <textarea
                            name="message"
                            required
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={5}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={t('form.messagePlaceholder')}
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                              {t('form.sending')}
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              {t('form.send')}
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* AI Conversational Search - How to Access */}
        <section className="py-16 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-foreground mb-4">
                {t('aiSearch.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('aiSearch.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* For Students */}
              <Card className="bg-white border-2 border-primary/20 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <User className="h-6 w-6 mr-2" />
                    {t('aiSearch.students.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    {t('aiSearch.students.description')}
                  </p>
                  <div className="bg-primary/10 rounded-lg p-4 space-y-2 text-sm">
                    <p className="font-mono text-gray-800">"Frontend developer React 2 years Milan startup"</p>
                    <p className="font-mono text-gray-800">"Data science Python remote entry-level"</p>
                    <p className="font-mono text-gray-800">"UX designer portfolio healthcare remote"</p>
                  </div>
                  <div className="pt-4 border-t border-primary/10">
                    <h4 className="font-semibold text-gray-900 mb-2">{t('aiSearch.students.howToAccess')}</h4>
                    <ol className="space-y-2 text-sm text-gray-700">
                      <li>1. {t('aiSearch.students.steps.0')}</li>
                      <li>2. {t('aiSearch.students.steps.1')}</li>
                      <li>3. {t('aiSearch.students.steps.2')}</li>
                      <li>4. {t('aiSearch.students.steps.3')}</li>
                    </ol>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg" asChild>
                    <a href="/dashboard/student/ai-job-search">
                      {t('aiSearch.students.button')}
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* For Recruiters */}
              <Card className="bg-white border-2 border-primary/20 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <Building2 className="h-6 w-6 mr-2" />
                    {t('aiSearch.recruiters.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    {t('aiSearch.recruiters.description')}
                  </p>
                  <div className="bg-primary/10 rounded-lg p-4 space-y-2 text-sm">
                    <p className="font-mono text-gray-800">"Cybersecurity Roma Network Security 30/30"</p>
                    <p className="font-mono text-gray-800">"Data engineer Python Spark 27+ GPA Milan"</p>
                    <p className="font-mono text-gray-800">"Frontend React TypeScript leadership Berlin"</p>
                  </div>
                  <div className="mt-4 bg-primary/20 rounded-lg p-3 text-sm">
                    <p className="text-primary">
                      <strong>{t('aiSearch.recruiters.result')}</strong>
                    </p>
                  </div>
                  <div className="pt-4 border-t border-primary/10">
                    <h4 className="font-semibold text-gray-900 mb-2">{t('aiSearch.recruiters.howToAccess')}</h4>
                    <ol className="space-y-2 text-sm text-gray-700">
                      <li>1. {t('aiSearch.recruiters.steps.0')}</li>
                      <li>2. {t('aiSearch.recruiters.steps.1')}</li>
                      <li>3. {t('aiSearch.recruiters.steps.2')}</li>
                      <li>4. {t('aiSearch.recruiters.steps.3')}</li>
                    </ol>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg" asChild>
                    <a href="/dashboard/recruiter/ai-search">
                      {t('aiSearch.recruiters.button')}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Card className="inline-block bg-gradient-to-r from-primary to-secondary text-white">
                <CardContent className="p-6">
                  <p className="text-lg">
                    {t('aiSearch.proTip')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Office Hours */}
        <section className="py-16 hero-bg">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-display font-bold text-foreground mb-8">{t('officeHours.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">{t('officeHours.support.title')}</h3>
                  <p className="text-gray-600">{t('officeHours.support.weekdays')}</p>
                  <p className="text-gray-600">{t('officeHours.support.saturday')}</p>
                  <p className="text-gray-600">{t('officeHours.support.sunday')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">{t('officeHours.responseTime.title')}</h3>
                  <p className="text-gray-600">{t('officeHours.responseTime.email')}</p>
                  <p className="text-gray-600">{t('officeHours.responseTime.phone')}</p>
                  <p className="text-gray-600">{t('officeHours.responseTime.chat')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}