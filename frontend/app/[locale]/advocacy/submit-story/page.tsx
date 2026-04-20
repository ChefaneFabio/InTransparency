'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, Building2, Mail, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react'
import { Link } from '@/navigation'

interface CareerStep {
  role: string
  company: string
  duration: string
  year: number
}

export default function SubmitAlumniStoryPage() {
  const t = useTranslations('submitStory')
  const [step, setStep] = useState<'form' | 'verification' | 'success'>('form')
  const [submitting, setSubmitting] = useState(false)
  const [verificationToken, setVerificationToken] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    alumniName: '',
    graduationYear: new Date().getFullYear() - 1,
    degree: '',
    institution: '',
    currentRole: '',
    currentCompany: '',
    story: '',
    adviceForStudents: '',
    verificationEmail: '',
    anonymous: false
  })

  const [careerPath, setCareerPath] = useState<CareerStep[]>([
    { role: '', company: '', duration: '', year: new Date().getFullYear() }
  ])

  const [keySkills, setKeySkills] = useState<string[]>([''])

  const handleAddCareerStep = () => {
    setCareerPath([...careerPath, { role: '', company: '', duration: '', year: new Date().getFullYear() }])
  }

  const handleRemoveCareerStep = (index: number) => {
    setCareerPath(careerPath.filter((_, i) => i !== index))
  }

  const handleUpdateCareerStep = (index: number, field: keyof CareerStep, value: string | number) => {
    const updated = [...careerPath]
    updated[index] = { ...updated[index], [field]: value }
    setCareerPath(updated)
  }

  const handleAddSkill = () => {
    setKeySkills([...keySkills, ''])
  }

  const handleRemoveSkill = (index: number) => {
    setKeySkills(keySkills.filter((_, i) => i !== index))
  }

  const handleUpdateSkill = (index: number, value: string) => {
    const updated = [...keySkills]
    updated[index] = value
    setKeySkills(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Validate email
      if (!formData.verificationEmail.endsWith('.edu')) {
        alert(t('alertUseEdu'))
        setSubmitting(false)
        return
      }

      // Filter empty skills and career steps
      const validSkills = keySkills.filter(s => s.trim().length > 0)
      const validCareerPath = careerPath.filter(step => step.role && step.company)

      const response = await fetch('/api/advocacy/alumni-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          keySkills: validSkills,
          careerPath: validCareerPath
        })
      })

      const data = await response.json()

      if (data.success) {
        setVerificationToken(data.verificationToken)
        setStep('verification')
      } else {
        alert(data.error || t('alertSubmitFailed'))
      }
    } catch (error) {
      console.error('Error submitting story:', error)
      alert(t('alertError'))
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 'verification') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="border-2 border-primary">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-3 rounded-full">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{t('checkEmail')}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{t('checkEmailSub')}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-8">
              <div className="space-y-6">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">{t('emailSent')}</h3>
                      <p className="text-sm text-blue-800">
                        {t.rich('emailSentDesc', { email: formData.verificationEmail, strong: (chunks) => <strong>{chunks}</strong> })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">{t('nextSteps')}</h3>
                  <ol className="space-y-2">
                    <li className="flex items-start gap-3">
                      <div className="bg-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">1</span>
                      </div>
                      <div>
                        <p className="text-sm">{t('nextStep1', { email: formData.verificationEmail })}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">2</span>
                      </div>
                      <div>
                        <p className="text-sm">{t('nextStep2')}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">3</span>
                      </div>
                      <div>
                        <p className="text-sm">{t('nextStep3')}</p>
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="bg-gray-50 border rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2">{t('demoPurposes')}</h4>
                  <p className="text-xs text-gray-600 mb-2">{t('yourToken')}</p>
                  <code className="block bg-white border px-3 py-2 rounded text-xs break-all">
                    {verificationToken}
                  </code>
                  <p className="text-xs text-gray-500 mt-2">
                    {t('productionNote')}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Link href="/advocacy/alumni-stories" className="flex-1">
                    <Button variant="outline" className="w-full">
                      {t('viewAllStories')}
                    </Button>
                  </Link>
                  <Button
                    onClick={() => setStep('success')}
                    className="flex-1 bg-primary"
                  >
                    {t('gotIt')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="border-2 border-green-500">
            <CardContent className="py-12 text-center">
              <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-3">{t('thankYou')}</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {t('thankYouDesc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/advocacy/alumni-stories">
                  <Button size="lg">
                    {t('viewAlumniStories')}
                  </Button>
                </Link>
                <Link href="/">
                  <Button size="lg" variant="outline">
                    {t('backHome')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-primary text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <GraduationCap className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">
            {t('heroTitle')}
          </h1>
          <p className="text-xl text-white/90">
            {t('heroDesc')}
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  {t('alumniInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('fullName')} *</label>
                    <input
                      type="text"
                      required
                      value={formData.alumniName}
                      onChange={(e) => setFormData({ ...formData, alumniName: e.target.value })}
                      placeholder={t('fullNamePlaceholder')}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('graduationYear')} *</label>
                    <input
                      type="number"
                      required
                      min="1950"
                      max={new Date().getFullYear()}
                      value={formData.graduationYear}
                      onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('degreeLabel')} *</label>
                    <input
                      type="text"
                      required
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      placeholder={t('degreePlaceholder')}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('institutionLabel')} *</label>
                    <input
                      type="text"
                      required
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      placeholder={t('institutionPlaceholder')}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('institutionalEmail')} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.verificationEmail}
                    onChange={(e) => setFormData({ ...formData, verificationEmail: e.target.value })}
                    placeholder={t('emailPlaceholder')}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t('emailHint')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={formData.anonymous}
                    onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="anonymous" className="text-sm">
                    {t('anonymousLabel', { degree: formData.degree })}
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Current Position */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  {t('currentPosition')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('currentRole')} *</label>
                    <input
                      type="text"
                      required
                      value={formData.currentRole}
                      onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                      placeholder={t('currentRolePlaceholder')}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('currentCompany')} *</label>
                    <input
                      type="text"
                      required
                      value={formData.currentCompany}
                      onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                      placeholder={t('currentCompanyPlaceholder')}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Career Path */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t('careerJourneyOptional')}</CardTitle>
                  <Button type="button" size="sm" onClick={handleAddCareerStep}>
                    <Plus className="h-4 w-4 mr-1" />
                    {t('addStep')}
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {t('careerJourneyDesc')}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {careerPath.map((step, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700">{t('stepN', { n: index + 1 })}</span>
                      {careerPath.length > 1 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveCareerStep(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder={t('role')}
                        value={step.role}
                        onChange={(e) => handleUpdateCareerStep(index, 'role', e.target.value)}
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="text"
                        placeholder={t('company')}
                        value={step.company}
                        onChange={(e) => handleUpdateCareerStep(index, 'company', e.target.value)}
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="text"
                        placeholder={t('durationPlaceholder')}
                        value={step.duration}
                        onChange={(e) => handleUpdateCareerStep(index, 'duration', e.target.value)}
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="number"
                        placeholder={t('year')}
                        value={step.year}
                        onChange={(e) => handleUpdateCareerStep(index, 'year', parseInt(e.target.value))}
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Success Story */}
            <Card>
              <CardHeader>
                <CardTitle>{t('yourStory')} *</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {t('yourStoryDesc')}
                </p>
              </CardHeader>
              <CardContent>
                <textarea
                  required
                  minLength={200}
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  placeholder={t('storyPlaceholder')}
                  className="w-full h-48 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t('charCount', { count: formData.story.length })}
                </p>
              </CardContent>
            </Card>

            {/* Key Skills */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t('keySkillsTitle')}</CardTitle>
                  <Button type="button" size="sm" onClick={handleAddSkill}>
                    <Plus className="h-4 w-4 mr-1" />
                    {t('addSkill')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {keySkills.map((skill, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        placeholder={t('skillPlaceholder')}
                        value={skill}
                        onChange={(e) => handleUpdateSkill(index, e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                      />
                      {keySkills.length > 1 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveSkill(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Advice */}
            <Card>
              <CardHeader>
                <CardTitle>{t('adviceTitle')}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {t('adviceDesc')}
                </p>
              </CardHeader>
              <CardContent>
                <textarea
                  value={formData.adviceForStudents}
                  onChange={(e) => setFormData({ ...formData, adviceForStudents: e.target.value })}
                  placeholder={t('advicePlaceholder')}
                  className="w-full h-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-3">
              <Link href="/advocacy/alumni-stories" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  {t('cancel')}
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-primary"
              >
                {submitting ? t('submitting') : t('submit')}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
