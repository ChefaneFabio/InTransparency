'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { EditorialHero } from '@/components/sections/editorial/EditorialHero'
import { EditorialSection } from '@/components/sections/editorial/EditorialSection'

/**
 * /contact — split layout in the editorial aesthetic.
 *
 * Right column: form (preserves all original state, validation, segment
 * detection from URL params + session, success/error states). Left
 * column: contact info, segment chips, response-time/office-hours
 * details (slimmed from separate sections into the same grid).
 *
 * Slim sweep: removed the AI Conversational Search how-to-access section
 * (it doesn't belong on /contact — it's a product tutorial; lives in
 * the dashboard onboarding instead).
 */

type Segment = 'student' | 'company' | 'university' | 'general'

export default function ContactPage() {
  const t = useTranslations('contact')
  const searchParams = useSearchParams()
  const { data: session } = useSession()

  const subjectParam = searchParams.get('subject') || ''
  const roleParam = searchParams.get('role') || ''
  const companyParam = searchParams.get('company') || ''
  const nameParam = searchParams.get('name') || ''
  const emailParam = searchParams.get('email') || ''
  const messageParam = searchParams.get('message') || ''
  const priorityParam = searchParams.get('priority') || ''
  const roleFromSession = (session?.user as any)?.role || ''

  const normalizedRoleParam = (() => {
    const r = roleParam.toLowerCase()
    if (['student', 'studente'].includes(r)) return 'student'
    if (['recruiter', 'hiring', 'company', 'hr'].includes(r)) return 'recruiter'
    if (['university', 'university-admin', 'institution', 'admin'].includes(r)) return 'university-admin'
    if (['professor', 'teacher', 'faculty'].includes(r)) return 'professor'
    if (r) return 'other'
    return ''
  })()

  const detectSegment = (): Segment => {
    if (roleParam) {
      if (['university', 'university-admin', 'institution', 'professor', 'teacher', 'faculty'].includes(roleParam.toLowerCase())) return 'university'
      if (['recruiter', 'hiring', 'company', 'hr'].includes(roleParam.toLowerCase())) return 'company'
      if (['student', 'studente'].includes(roleParam.toLowerCase())) return 'student'
    }
    if (subjectParam.includes('university') || subjectParam.includes('pilot') || subjectParam.includes('institution')) return 'university'
    if (subjectParam.includes('company') || subjectParam.includes('recruiter') || subjectParam.includes('hiring') || subjectParam.includes('api')) return 'company'
    if (subjectParam.includes('student')) return 'student'
    if (roleFromSession === 'RECRUITER') return 'company'
    if (roleFromSession === 'UNIVERSITY' || roleFromSession === 'TECHPARK') return 'university'
    if (roleFromSession === 'STUDENT') return 'student'
    return 'general'
  }

  const [segment, setSegment] = useState<Segment>('general')

  useEffect(() => {
    setSegment(detectSegment())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectParam, roleParam, roleFromSession])

  const [formData, setFormData] = useState({
    name: nameParam,
    email: emailParam,
    company: companyParam,
    role: normalizedRoleParam,
    subject: subjectParam,
    message: messageParam,
    priority: ['low', 'medium', 'high'].includes(priorityParam) ? priorityParam : 'medium',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send')
      }
      setIsSubmitted(true)
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const segments: Array<{ key: Segment; label: string }> = [
    { key: 'student',    label: t('segments.student') },
    { key: 'company',    label: t('segments.company') },
    { key: 'university', label: t('segments.university') },
    { key: 'general',    label: t('segments.general') },
  ]

  const fieldClass =
    'w-full px-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md text-[14px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-colors'

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />
      <main>
        <EditorialHero
          eyebrow={t('hero.eyebrow', { defaultValue: 'Contact' })}
          title={t('hero.title')}
          lede={t('hero.subtitle')}
          accent="slate"
        />

        {/* Segment chips + segment-specific message */}
        <section className="border-b border-slate-200 dark:border-slate-800">
          <div className="container max-w-5xl mx-auto px-6 py-10">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-2 mb-6">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500 mr-3">
                {t('iAm', { defaultValue: 'I am a' })}
              </span>
              {segments.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSegment(key)}
                  className={`inline-flex items-center h-8 px-3.5 rounded-md text-[13px] font-medium transition-colors ${
                    segment === key
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-transparent border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="text-[16px] text-slate-900 dark:text-white">
              {t(`segmentMessage.${segment}.title`)}
            </p>
            <p className="mt-1 text-[14px] text-slate-500">
              {t(`segmentMessage.${segment}.subtitle`)}
            </p>
          </div>
        </section>

        {/* Split layout: contact info (left) + form (right) */}
        <section className="border-b border-slate-200 dark:border-slate-800">
          <div className="container max-w-6xl mx-auto px-6 py-20 lg:py-24">
            <div className="grid lg:grid-cols-12 gap-12">
              {/* Left column — contact info, response times, FAQ pointers */}
              <aside className="lg:col-span-4 space-y-10">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500 mb-4">
                    {t('section.eyebrow', { defaultValue: 'Reach us' })}
                  </div>
                  <h2 className="text-[26px] leading-[1.2] font-semibold tracking-tight text-slate-900 dark:text-white">
                    {t('section.title')}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
                    {t('section.subtitle')}
                  </p>
                </div>

                <dl className="space-y-6 border-t border-slate-200 dark:border-slate-800 pt-6">
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
                      {t('methods.email.title')}
                    </dt>
                    <dd className="mt-1.5 text-[15px] text-slate-900 dark:text-white">
                      <a href="mailto:info@in-transparency.com" className="underline underline-offset-4 hover:no-underline">
                        info@in-transparency.com
                      </a>
                    </dd>
                    <dd className="mt-1 text-[13px] text-slate-500">
                      {t('methods.email.subtitle')}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
                      {t('methods.phone.title')}
                    </dt>
                    <dd className="mt-1.5 text-[15px] text-slate-900 dark:text-white">
                      +39 344 4942399
                    </dd>
                    <dd className="mt-1 text-[13px] text-slate-500">
                      {t('methods.phone.subtitle')}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
                      {t('methods.location.title')}
                    </dt>
                    <dd className="mt-1.5 text-[15px] text-slate-900 dark:text-white">
                      {t('methods.location.value')}
                    </dd>
                  </div>
                </dl>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                  <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-3">
                    {t('officeHours.responseTime.title')}
                  </div>
                  <ul className="space-y-1.5 text-[13px] text-slate-600 dark:text-slate-400">
                    <li>{t('officeHours.responseTime.email')}</li>
                    <li>{t('officeHours.responseTime.phone')}</li>
                    <li>{t('officeHours.responseTime.chat')}</li>
                  </ul>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                  <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-3">
                    {t('resources.commonQuestions')}
                  </div>
                  <ul className="space-y-2 text-[13px] text-slate-600 dark:text-slate-400">
                    {[0, 1, 2, 3].map(i => (
                      <li key={i}>{t(`resources.questions.${i}`)}</li>
                    ))}
                  </ul>
                </div>
              </aside>

              {/* Right column — form */}
              <div className="lg:col-span-8">
                {isSubmitted ? (
                  <div className="border border-slate-200 dark:border-slate-800 p-10 text-center">
                    <h3 className="text-[20px] font-semibold text-slate-900 dark:text-white mb-3">
                      {t('form.success.title')}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                      {t('form.success.message')}
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="inline-flex items-center justify-center h-10 px-5 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md text-[14px] font-medium transition-colors"
                    >
                      {t('form.success.button')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                      {t('form.title')}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          {t('form.fullName')} *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className={fieldClass}
                          placeholder={t('form.placeholders.fullName')}
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          {t('form.emailAddress')} *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className={fieldClass}
                          placeholder={t('form.placeholders.email')}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          {t('form.companyUniversity')}
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className={fieldClass}
                          placeholder={t('form.placeholders.company')}
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          {t('form.role')}
                        </label>
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className={fieldClass}
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
                      <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        {t('form.subject')} *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={fieldClass}
                        placeholder={t('form.subjectPlaceholder')}
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        {t('form.priority')}
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className={fieldClass}
                      >
                        <option value="low">{t('form.priorityOptions.low')}</option>
                        <option value="medium">{t('form.priorityOptions.medium')}</option>
                        <option value="high">{t('form.priorityOptions.high')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        {t('form.message')} *
                      </label>
                      <textarea
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className={fieldClass}
                        placeholder={t('form.messagePlaceholder')}
                      />
                    </div>

                    {submitError && (
                      <div className="text-[13px] text-red-600 dark:text-red-400 border-l-2 border-red-600 pl-3">
                        {submitError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center h-11 px-6 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-md text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? t('form.sending') : t('form.send')}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
