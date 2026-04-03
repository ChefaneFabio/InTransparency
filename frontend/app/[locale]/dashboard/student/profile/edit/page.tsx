'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, ArrowLeft, Plus, Trash2 } from 'lucide-react'

type Sections = 'links' | 'details' | 'languages' | 'thesis' | 'certifications' | 'workExperience' | 'careerPrefs'

interface LanguageEntry {
  language: string
  motherTongue: boolean
  reading: string
  writing: string
  listening: string
  speaking: string
  interaction: string
}

interface CertificationEntry {
  name: string
  issuer: string
  dateObtained: string
  expiryDate: string
  credentialId: string
  credentialUrl: string
}

interface WorkExperienceEntry {
  company: string
  role: string
  startDate: string
  endDate: string
  description: string
  current: boolean
  contractType: string
  companySector: string
  businessArea: string
}

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const CONTRACT_TYPES = ['permanent', 'fixedTerm', 'internship', 'freelance', 'apprenticeship']
const SECTORS = ['it', 'retail', 'logistics', 'manufacturing', 'finance', 'healthcare', 'education', 'media', 'consulting', 'other']
const AREAS = ['commercial', 'operations', 'customerService', 'rd', 'hr', 'marketing', 'management', 'logistics', 'other']
const STUDY_TYPES = ['master1', 'master2', 'phd', 'specialization']

const emptyLanguage = (): LanguageEntry => ({
  language: '', motherTongue: false, reading: '', writing: '', listening: '', speaking: '', interaction: '',
})
const emptyCert = (): CertificationEntry => ({
  name: '', issuer: '', dateObtained: '', expiryDate: '', credentialId: '', credentialUrl: '',
})
const emptyWork = (): WorkExperienceEntry => ({
  company: '', role: '', startDate: '', endDate: '', description: '', current: false,
  contractType: '', companySector: '', businessArea: '',
})

export default function EditProfilePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user as Record<string, string> | undefined
  const t = useTranslations('profileEdit')

  const [expanded, setExpanded] = useState<Record<Sections, boolean>>({
    links: false, details: false, languages: false, thesis: false,
    certifications: false, workExperience: false, careerPrefs: false,
  })
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle')

  // Basic fields
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', bio: '', university: '', major: '',
    graduationYear: String(new Date().getFullYear() + 1), location: '',
    linkedinUrl: '', githubUrl: '', portfolioUrl: '', availableFor: 'BOTH',
  })

  // Thesis
  const [thesis, setThesis] = useState({
    thesisTitle: '', thesisSubject: '', thesisSupervisor: '', thesisKeywords: '',
  })

  // Career Preferences
  const [career, setCareer] = useState({
    desiredOccupation: '', preferredSectors: '' as string, preferredAreas: '' as string,
    preferredLocations: '', willingToRelocate: false, willingToRelocateAbroad: false,
    willingToTravel: false, continuingStudies: false, continuingStudiesType: '',
  })

  // Dynamic arrays
  const [languages, setLanguages] = useState<LanguageEntry[]>([])
  const [certifications, setCertifications] = useState<CertificationEntry[]>([])
  const [workExperience, setWorkExperience] = useState<WorkExperienceEntry[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/dashboard/student/profile')
        if (!res.ok) return
        const { user: u } = await res.json()
        setFormData({
          firstName: u.firstName || '', lastName: u.lastName || '',
          bio: u.bio || '', university: u.university || '', major: u.degree || '',
          graduationYear: u.graduationYear ? String(u.graduationYear) : String(new Date().getFullYear() + 1),
          location: u.location || '',
          linkedinUrl: u.linkedinUrl || '', githubUrl: u.githubUrl || '',
          portfolioUrl: u.portfolioUrl || '', availableFor: u.availableFor || 'BOTH',
        })
        setThesis({
          thesisTitle: u.thesisTitle || '', thesisSubject: u.thesisSubject || '',
          thesisSupervisor: u.thesisSupervisor || '',
          thesisKeywords: (u.thesisKeywords || []).join(', '),
        })
        setCareer({
          desiredOccupation: u.desiredOccupation || '',
          preferredSectors: (u.preferredSectors || []).join(', '),
          preferredAreas: (u.preferredAreas || []).join(', '),
          preferredLocations: (u.preferredLocations || []).join(', '),
          willingToRelocate: u.willingToRelocate || false,
          willingToRelocateAbroad: u.willingToRelocateAbroad || false,
          willingToTravel: u.willingToTravel || false,
          continuingStudies: u.continuingStudies || false,
          continuingStudiesType: u.continuingStudiesType || '',
        })
        if (u.languageProficiencies && u.languageProficiencies.length > 0) {
          setLanguages(u.languageProficiencies.map((lp: any) => ({
            language: lp.language || '', motherTongue: lp.motherTongue || false,
            reading: lp.reading || '', writing: lp.writing || '',
            listening: lp.listening || '', speaking: lp.speaking || '',
            interaction: lp.interaction || '',
          })))
        }
        if (u.certifications && u.certifications.length > 0) {
          setCertifications(u.certifications.map((c: any) => ({
            name: c.name || '', issuer: c.issuer || '',
            dateObtained: c.dateObtained ? c.dateObtained.split('T')[0] : '',
            expiryDate: c.expiryDate ? c.expiryDate.split('T')[0] : '',
            credentialId: c.credentialId || '', credentialUrl: c.credentialUrl || '',
          })))
        }
        if (u.workExperience && Array.isArray(u.workExperience) && u.workExperience.length > 0) {
          setWorkExperience(u.workExperience.map((w: any) => ({
            company: w.company || '', role: w.role || '',
            startDate: w.startDate || '', endDate: w.endDate || '',
            description: w.description || '', current: w.current || false,
            contractType: w.contractType || '', companySector: w.companySector || '',
            businessArea: w.businessArea || '',
          })))
        }
      } catch {
        if (user) {
          setFormData(prev => ({
            ...prev,
            firstName: user.firstName || prev.firstName,
            lastName: user.lastName || prev.lastName,
          }))
        }
      }
    }
    load()
  }, [user])

  const set = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  const setThesisField = (field: string, value: string) =>
    setThesis(prev => ({ ...prev, [field]: value }))

  const setCareerField = (field: string, value: string | boolean) =>
    setCareer(prev => ({ ...prev, [field]: value }))

  const updateLanguage = (idx: number, field: string, value: string | boolean) =>
    setLanguages(prev => prev.map((l, i) => i === idx ? { ...l, [field]: value } : l))

  const updateCert = (idx: number, field: string, value: string) =>
    setCertifications(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c))

  const updateWork = (idx: number, field: string, value: string | boolean) =>
    setWorkExperience(prev => prev.map((w, i) => i === idx ? { ...w, [field]: value } : w))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.firstName.trim() || !formData.lastName.trim()) return
    setSaveState('saving')
    try {
      const keywordsArr = thesis.thesisKeywords
        .split(',').map(k => k.trim()).filter(Boolean)
      const sectorsArr = career.preferredSectors
        .split(',').map(s => s.trim()).filter(Boolean)
      const areasArr = career.preferredAreas
        .split(',').map(a => a.trim()).filter(Boolean)
      const locationsArr = career.preferredLocations
        .split(',').map(l => l.trim()).filter(Boolean)

      const res = await fetch('/api/dashboard/student/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName, lastName: formData.lastName,
          bio: formData.bio, tagline: formData.bio?.slice(0, 120),
          university: formData.university, degree: formData.major,
          graduationYear: formData.graduationYear,
          location: formData.location,
          linkedinUrl: formData.linkedinUrl, githubUrl: formData.githubUrl,
          portfolioUrl: formData.portfolioUrl, availableFor: formData.availableFor,
          // Thesis
          thesisTitle: thesis.thesisTitle, thesisSubject: thesis.thesisSubject,
          thesisSupervisor: thesis.thesisSupervisor, thesisKeywords: keywordsArr,
          // Career Preferences
          desiredOccupation: career.desiredOccupation,
          preferredSectors: sectorsArr, preferredAreas: areasArr,
          preferredLocations: locationsArr,
          willingToRelocate: career.willingToRelocate,
          willingToRelocateAbroad: career.willingToRelocateAbroad,
          willingToTravel: career.willingToTravel,
          continuingStudies: career.continuingStudies,
          continuingStudiesType: career.continuingStudiesType,
          // Relations
          languageProficiencies: languages.filter(l => l.language.trim()),
          certifications: certifications.filter(c => c.name.trim()),
          workExperience: workExperience.filter(w => w.company.trim() || w.role.trim()),
        }),
      })
      if (!res.ok) throw new Error()
      setSaveState('saved')
      setTimeout(() => router.push('/dashboard/student/profile'), 1500)
    } catch {
      setSaveState('idle')
    }
  }

  const toggle = (s: Sections) => setExpanded(prev => ({ ...prev, [s]: !prev[s] }))

  const linkCount = [formData.linkedinUrl, formData.githubUrl, formData.portfolioUrl]
    .filter(Boolean).length
  const linkNames = [
    formData.linkedinUrl && 'LinkedIn',
    formData.githubUrl && 'GitHub',
    formData.portfolioUrl && 'Portfolio',
  ].filter(Boolean)

  const detailSummary = [
    formData.graduationYear && formData.graduationYear,
    formData.location,
  ].filter(Boolean)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 16 }, (_, i) => String(currentYear - 5 + i))

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Section 1: Basic Info — always visible */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('basic.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">{t('basic.firstName')}</Label>
                <Input id="firstName" value={formData.firstName}
                  onChange={e => set('firstName', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">{t('basic.lastName')}</Label>
                <Input id="lastName" value={formData.lastName}
                  onChange={e => set('lastName', e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bio">{t('basic.bio')}</Label>
              <Textarea id="bio" rows={3} placeholder={t('basic.bioPlaceholder')}
                value={formData.bio} onChange={e => set('bio', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="university">{t('basic.university')}</Label>
                <Input id="university" value={formData.university}
                  onChange={e => set('university', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="major">{t('basic.degree')}</Label>
                <Input id="major" value={formData.major}
                  onChange={e => set('major', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Links — collapsible */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{t('links.title')}</CardTitle>
              <Button type="button" variant="ghost" size="sm" onClick={() => toggle('links')}>
                {expanded.links ? t('save') : linkCount > 0
                  ? `${linkNames.join(', ')} — ${t('links.summary', { count: linkCount })}`
                  : t('links.summary', { count: 0 })}
              </Button>
            </div>
          </CardHeader>
          {expanded.links && (
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="linkedinUrl">{t('links.linkedin')}</Label>
                <Input id="linkedinUrl" placeholder="https://linkedin.com/in/..."
                  value={formData.linkedinUrl} onChange={e => set('linkedinUrl', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="githubUrl">{t('links.github')}</Label>
                <Input id="githubUrl" placeholder="https://github.com/..."
                  value={formData.githubUrl} onChange={e => set('githubUrl', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="portfolioUrl">{t('links.portfolio')}</Label>
                <Input id="portfolioUrl" placeholder="https://..."
                  value={formData.portfolioUrl} onChange={e => set('portfolioUrl', e.target.value)} />
              </div>
            </CardContent>
          )}
        </Card>

        {/* Section 3: Details — collapsible */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{t('details.title')}</CardTitle>
              <Button type="button" variant="ghost" size="sm" onClick={() => toggle('details')}>
                {expanded.details ? t('save') : detailSummary.length > 0
                  ? detailSummary.join(' / ')
                  : t('details.title')}
              </Button>
            </div>
          </CardHeader>
          {expanded.details && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="graduationYear">{t('details.graduationYear')}</Label>
                  <Select value={formData.graduationYear}
                    onValueChange={v => set('graduationYear', v)}>
                    <SelectTrigger id="graduationYear"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="location">{t('details.location')}</Label>
                  <Input id="location" value={formData.location}
                    onChange={e => set('location', e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="availableFor">{t('details.availability')}</Label>
                <Select value={formData.availableFor}
                  onValueChange={v => set('availableFor', v)}>
                  <SelectTrigger id="availableFor"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BOTH">{t('details.availabilityOptions.jobs')}</SelectItem>
                    <SelectItem value="HIRING">{t('details.availabilityOptions.internships')}</SelectItem>
                    <SelectItem value="PROJECTS">{t('details.availabilityOptions.freelance')}</SelectItem>
                    <SelectItem value="NONE">{t('details.availabilityOptions.notLooking')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Section 4: Languages (CEFR) — collapsible */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{t('languages.title')}</CardTitle>
              <Button type="button" variant="ghost" size="sm" onClick={() => toggle('languages')}>
                {expanded.languages ? t('save') : languages.length > 0
                  ? t('languages.summary', { count: languages.length })
                  : t('languages.title')}
              </Button>
            </div>
          </CardHeader>
          {expanded.languages && (
            <CardContent className="space-y-4">
              {languages.map((lang, idx) => (
                <div key={idx} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>{t('languages.language')}</Label>
                        <Input placeholder={t('languages.placeholder')} value={lang.language}
                          onChange={e => updateLanguage(idx, 'language', e.target.value)} />
                      </div>
                      <div className="flex items-end gap-2">
                        <label className="flex items-center gap-2 text-sm cursor-pointer pb-2">
                          <input type="checkbox" checked={lang.motherTongue}
                            onChange={e => updateLanguage(idx, 'motherTongue', e.target.checked)}
                            className="rounded border-gray-300" />
                          {t('languages.motherTongue')}
                        </label>
                      </div>
                    </div>
                    <Button type="button" variant="ghost" size="icon"
                      onClick={() => setLanguages(prev => prev.filter((_, i) => i !== idx))}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  {!lang.motherTongue && (
                    <div className="grid grid-cols-5 gap-2">
                      {(['reading', 'writing', 'listening', 'speaking', 'interaction'] as const).map(skill => (
                        <div key={skill} className="space-y-1">
                          <Label className="text-xs">{t(`languages.${skill}`)}</Label>
                          <Select value={lang[skill] || ''} onValueChange={v => updateLanguage(idx, skill, v)}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
                            <SelectContent>
                              {CEFR_LEVELS.map(lv => <SelectItem key={lv} value={lv}>{lv}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm"
                onClick={() => setLanguages(prev => prev.concat([emptyLanguage()]))}>
                <Plus className="h-4 w-4 mr-1" /> {t('languages.addLanguage')}
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Section 5: Thesis — collapsible */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{t('thesis.title')}</CardTitle>
              <Button type="button" variant="ghost" size="sm" onClick={() => toggle('thesis')}>
                {expanded.thesis ? t('save') : thesis.thesisTitle
                  ? t('thesis.summary')
                  : t('thesis.title')}
              </Button>
            </div>
          </CardHeader>
          {expanded.thesis && (
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>{t('thesis.thesisTitle')}</Label>
                <Input value={thesis.thesisTitle}
                  onChange={e => setThesisField('thesisTitle', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>{t('thesis.thesisSubject')}</Label>
                  <Input value={thesis.thesisSubject}
                    onChange={e => setThesisField('thesisSubject', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>{t('thesis.thesisSupervisor')}</Label>
                  <Input value={thesis.thesisSupervisor}
                    onChange={e => setThesisField('thesisSupervisor', e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>{t('thesis.thesisKeywords')}</Label>
                <Input placeholder={t('thesis.keywordsPlaceholder')} value={thesis.thesisKeywords}
                  onChange={e => setThesisField('thesisKeywords', e.target.value)} />
              </div>
            </CardContent>
          )}
        </Card>

        {/* Section 6: Certifications — collapsible */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{t('certifications.title')}</CardTitle>
              <Button type="button" variant="ghost" size="sm" onClick={() => toggle('certifications')}>
                {expanded.certifications ? t('save') : certifications.length > 0
                  ? t('certifications.summary', { count: certifications.length })
                  : t('certifications.title')}
              </Button>
            </div>
          </CardHeader>
          {expanded.certifications && (
            <CardContent className="space-y-4">
              {certifications.map((cert, idx) => (
                <div key={idx} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label>{t('certifications.name')}</Label>
                          <Input value={cert.name}
                            onChange={e => updateCert(idx, 'name', e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <Label>{t('certifications.issuer')}</Label>
                          <Input value={cert.issuer}
                            onChange={e => updateCert(idx, 'issuer', e.target.value)} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label>{t('certifications.dateObtained')}</Label>
                          <Input type="date" value={cert.dateObtained}
                            onChange={e => updateCert(idx, 'dateObtained', e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <Label>{t('certifications.expiryDate')}</Label>
                          <Input type="date" value={cert.expiryDate}
                            onChange={e => updateCert(idx, 'expiryDate', e.target.value)} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label>{t('certifications.credentialId')}</Label>
                          <Input value={cert.credentialId}
                            onChange={e => updateCert(idx, 'credentialId', e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <Label>{t('certifications.credentialUrl')}</Label>
                          <Input value={cert.credentialUrl} placeholder="https://..."
                            onChange={e => updateCert(idx, 'credentialUrl', e.target.value)} />
                        </div>
                      </div>
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="ml-2"
                      onClick={() => setCertifications(prev => prev.filter((_, i) => i !== idx))}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm"
                onClick={() => setCertifications(prev => prev.concat([emptyCert()]))}>
                <Plus className="h-4 w-4 mr-1" /> {t('certifications.addCertification')}
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Section 7: Work Experience — collapsible */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{t('workExperience.title')}</CardTitle>
              <Button type="button" variant="ghost" size="sm" onClick={() => toggle('workExperience')}>
                {expanded.workExperience ? t('save') : workExperience.length > 0
                  ? t('workExperience.summary', { count: workExperience.length })
                  : t('workExperience.title')}
              </Button>
            </div>
          </CardHeader>
          {expanded.workExperience && (
            <CardContent className="space-y-4">
              {workExperience.map((we, idx) => (
                <div key={idx} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label>{t('workExperience.role')}</Label>
                          <Input value={we.role}
                            onChange={e => updateWork(idx, 'role', e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <Label>{t('workExperience.company')}</Label>
                          <Input value={we.company}
                            onChange={e => updateWork(idx, 'company', e.target.value)} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label>{t('workExperience.startDate')}</Label>
                          <Input type="month" value={we.startDate}
                            onChange={e => updateWork(idx, 'startDate', e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <Label>{t('workExperience.endDate')}</Label>
                          <Input type="month" value={we.endDate} disabled={we.current}
                            onChange={e => updateWork(idx, 'endDate', e.target.value)} />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={we.current}
                          onChange={e => updateWork(idx, 'current', e.target.checked)}
                          className="rounded border-gray-300" />
                        {t('workExperience.current')}
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">{t('workExperience.contractType')}</Label>
                          <Select value={we.contractType || ''} onValueChange={v => updateWork(idx, 'contractType', v)}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
                            <SelectContent>
                              {CONTRACT_TYPES.map(ct => (
                                <SelectItem key={ct} value={ct}>{t(`workExperience.contractTypes.${ct}`)}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">{t('workExperience.companySector')}</Label>
                          <Select value={we.companySector || ''} onValueChange={v => updateWork(idx, 'companySector', v)}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
                            <SelectContent>
                              {SECTORS.map(s => (
                                <SelectItem key={s} value={s}>{t(`workExperience.sectors.${s}`)}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">{t('workExperience.businessArea')}</Label>
                          <Select value={we.businessArea || ''} onValueChange={v => updateWork(idx, 'businessArea', v)}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
                            <SelectContent>
                              {AREAS.map(a => (
                                <SelectItem key={a} value={a}>{t(`workExperience.areas.${a}`)}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label>{t('workExperience.description')}</Label>
                        <Textarea rows={2} value={we.description}
                          onChange={e => updateWork(idx, 'description', e.target.value)} />
                      </div>
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="ml-2"
                      onClick={() => setWorkExperience(prev => prev.filter((_, i) => i !== idx))}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm"
                onClick={() => setWorkExperience(prev => prev.concat([emptyWork()]))}>
                <Plus className="h-4 w-4 mr-1" /> {t('workExperience.addExperience')}
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Section 8: Career Preferences — collapsible */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{t('careerPreferences.title')}</CardTitle>
              <Button type="button" variant="ghost" size="sm" onClick={() => toggle('careerPrefs')}>
                {expanded.careerPrefs ? t('save') : career.desiredOccupation
                  ? t('careerPreferences.summary')
                  : t('careerPreferences.title')}
              </Button>
            </div>
          </CardHeader>
          {expanded.careerPrefs && (
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>{t('careerPreferences.desiredOccupation')}</Label>
                <Input placeholder={t('careerPreferences.desiredOccupationPlaceholder')}
                  value={career.desiredOccupation}
                  onChange={e => setCareerField('desiredOccupation', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('careerPreferences.preferredSectors')}</Label>
                <Input value={career.preferredSectors}
                  placeholder="IT, Education, Consulting"
                  onChange={e => setCareerField('preferredSectors', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('careerPreferences.preferredAreas')}</Label>
                <Input value={career.preferredAreas}
                  placeholder="R&D, Marketing, Operations"
                  onChange={e => setCareerField('preferredAreas', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('careerPreferences.preferredLocations')}</Label>
                <Input placeholder={t('careerPreferences.preferredLocationsPlaceholder')}
                  value={career.preferredLocations}
                  onChange={e => setCareerField('preferredLocations', e.target.value)} />
              </div>
              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={career.willingToRelocate}
                    onChange={e => setCareerField('willingToRelocate', e.target.checked)}
                    className="rounded border-gray-300" />
                  {t('careerPreferences.willingToRelocate')}
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={career.willingToRelocateAbroad}
                    onChange={e => setCareerField('willingToRelocateAbroad', e.target.checked)}
                    className="rounded border-gray-300" />
                  {t('careerPreferences.willingToRelocateAbroad')}
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={career.willingToTravel}
                    onChange={e => setCareerField('willingToTravel', e.target.checked)}
                    className="rounded border-gray-300" />
                  {t('careerPreferences.willingToTravel')}
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={career.continuingStudies}
                    onChange={e => setCareerField('continuingStudies', e.target.checked)}
                    className="rounded border-gray-300" />
                  {t('careerPreferences.continuingStudies')}
                </label>
                {career.continuingStudies && (
                  <div className="space-y-1.5 pl-6">
                    <Label>{t('careerPreferences.continuingStudiesType')}</Label>
                    <Select value={career.continuingStudiesType || ''}
                      onValueChange={v => setCareerField('continuingStudiesType', v)}>
                      <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                      <SelectContent>
                        {STUDY_TYPES.map(st => (
                          <SelectItem key={st} value={st}>{t(`careerPreferences.studyTypes.${st}`)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Actions */}
        <div className="flex justify-between pt-2">
          <Button type="button" variant="ghost" asChild>
            <Link href="/dashboard/student/profile">{t('back')}</Link>
          </Button>
          <Button type="submit" disabled={saveState === 'saving'}>
            {saveState === 'saving' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {saveState === 'idle' && t('save')}
            {saveState === 'saving' && t('saving')}
            {saveState === 'saved' && t('saved')}
          </Button>
        </div>
      </form>
    </div>
  )
}
