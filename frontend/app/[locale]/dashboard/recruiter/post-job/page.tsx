'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  ArrowLeft, 
  Plus, 
  X, 
  Save, 
  Eye,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Building,
  Zap,
  Target,
  CheckCircle,
  AlertCircle,
  Calendar,
  BookOpen
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useTranslations } from 'next-intl'

export default function PostJobPage() {
  const router = useRouter()
  const t = useTranslations('recruiterDashboard.postJob')
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<any>({})
  
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    department: '',
    location: '',
    workType: '', // remote, hybrid, onsite
    employmentType: '', // full-time, part-time, contract, internship
    
    // Job Details
    description: '',
    responsibilities: [''],
    requirements: [''],
    preferredQualifications: [''],
    
    // Compensation & Benefits
    salaryMin: '',
    salaryMax: '',
    salaryType: 'yearly', // yearly, hourly
    currency: 'USD',
    benefits: [],
    
    // Company Information
    companySize: '',
    industry: '',
    companyDescription: '',
    
    // Application Settings
    applicationDeadline: '',
    startDate: '',
    numberOfPositions: '1',
    
    // Targeting & Matching
    targetUniversities: [],
    targetMajors: [],
    targetSkills: [],
    experienceLevel: '', // entry, mid, senior
    gpaRequirement: '',
    graduationYears: [],
    
    // Application Process
    applicationProcess: '',
    interviewProcess: '',
    hiringManagerContact: '',
    
    // Additional Settings
    isUrgent: false,
    isRemoteOk: false,
    requiresSponsorship: false,
    allowsInternational: false,
    status: 'draft' // draft, published, closed
  })

  const steps = [
    {
      title: t('steps.basicInfo'),
      description: t('steps.basicInfoDesc'),
      icon: Briefcase
    },
    {
      title: t('steps.jobDescription'),
      description: t('steps.jobDescriptionDesc'),
      icon: BookOpen
    },
    {
      title: t('steps.compensation'),
      description: t('steps.compensationDesc'),
      icon: DollarSign
    },
    {
      title: t('steps.targeting'),
      description: t('steps.targetingDesc'),
      icon: Target
    },
    {
      title: t('steps.applicationProcess'),
      description: t('steps.applicationProcessDesc'),
      icon: Users
    },
    {
      title: t('steps.review'),
      description: t('steps.reviewDesc'),
      icon: Eye
    }
  ]

  const universities = [
    'Stanford University', 'MIT', 'UC Berkeley', 'Carnegie Mellon', 'Caltech',
    'Harvard University', 'Princeton University', 'Yale University', 'Columbia University',
    'University of Washington', 'Georgia Tech', 'UT Austin', 'UCLA', 'USC'
  ]

  const majors = [
    'Computer Science', 'Software Engineering', 'Computer Engineering', 'Data Science',
    'Information Systems', 'Electrical Engineering', 'Mathematics', 'Physics',
    'Statistics', 'Business', 'Economics', 'Design'
  ]

  const skills = [
    'React', 'Node.js', 'Python', 'Java', 'TypeScript', 'JavaScript', 'Angular', 'Vue.js',
    'Django', 'Flask', 'Spring Boot', 'PostgreSQL', 'MongoDB', 'MySQL', 'Redis',
    'AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes', 'Git', 'REST APIs',
    'GraphQL', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch',
    'Data Analysis', 'Statistics', 'Pandas', 'NumPy', 'R', 'Scala', 'Go', 'Rust'
  ]

  const benefits = [
    'Health Insurance', 'Dental Insurance', 'Vision Insurance', '401(k) Matching',
    'Stock Options', 'Equity', 'Flexible PTO', 'Unlimited PTO', 'Parental Leave',
    'Learning Budget', 'Conference Budget', 'Gym Membership', 'Commuter Benefits',
    'Remote Work', 'Flexible Hours', 'Work From Home Stipend', 'Equipment Budget',
    'Catered Meals', 'Snacks', 'Team Events', 'Mentorship Program'
  ]

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: null }))
    }
  }

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev as any)[field], '']
    }))
  }

  const updateArrayItem = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: ((prev as any)[field] || []).map((item: any, i: number) => i === index ? value : item)
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev as any)[field].filter((_: any, i: number) => i !== index)
    }))
  }

  const toggleArrayValue = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev as any)[field].includes(value)
        ? (prev as any)[field].filter((item: any) => item !== value)
        : [...(prev as any)[field], value]
    }))
  }

  const validateStep = (step: number) => {
    const newErrors: any = {}

    switch (step) {
      case 0:
        if (!formData.title.trim()) newErrors.title = 'Job title is required'
        if (!formData.department.trim()) newErrors.department = 'Department is required'
        if (!formData.location.trim()) newErrors.location = 'Location is required'
        if (!formData.workType) newErrors.workType = 'Work type is required'
        if (!formData.employmentType) newErrors.employmentType = 'Employment type is required'
        break
      case 1:
        if (!formData.description.trim()) newErrors.description = 'Job description is required'
        if (formData.responsibilities.filter(r => r.trim()).length === 0) {
          newErrors.responsibilities = 'At least one responsibility is required'
        }
        if (formData.requirements.filter(r => r.trim()).length === 0) {
          newErrors.requirements = 'At least one requirement is required'
        }
        break
      case 2:
        if (!formData.salaryMin) newErrors.salaryMin = 'Minimum salary is required'
        if (!formData.salaryMax) newErrors.salaryMax = 'Maximum salary is required'
        if (parseInt(formData.salaryMin) >= parseInt(formData.salaryMax)) {
          newErrors.salaryMax = 'Maximum salary must be higher than minimum'
        }
        break
      case 3:
        if (formData.targetUniversities.length === 0) {
          newErrors.targetUniversities = 'Select at least one target university'
        }
        if (formData.targetMajors.length === 0) {
          newErrors.targetMajors = 'Select at least one target major'
        }
        if (!formData.experienceLevel) newErrors.experienceLevel = 'Experience level is required'
        break
      case 4:
        if (!formData.applicationProcess.trim()) {
          newErrors.applicationProcess = 'Application process is required'
        }
        if (!formData.applicationDeadline) {
          newErrors.applicationDeadline = 'Application deadline is required'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const submitJob = async (status: 'draft' | 'published') => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)
    try {
      // Map form fields to API schema
      const workLocationMap: Record<string, string> = {
        remote: 'REMOTE',
        hybrid: 'HYBRID',
        onsite: 'ON_SITE',
      }
      const jobTypeMap: Record<string, string> = {
        'full-time': 'FULL_TIME',
        'part-time': 'PART_TIME',
        contract: 'CONTRACT',
        internship: 'INTERNSHIP',
      }

      const jobData = {
        title: formData.title,
        description: formData.description,
        responsibilities: formData.responsibilities.filter(r => r.trim()).join('\n'),
        requirements: formData.requirements.filter(r => r.trim()).join('\n'),
        niceToHave: formData.preferredQualifications.filter(r => r.trim()).join('\n'),

        jobType: jobTypeMap[formData.employmentType] || 'FULL_TIME',
        workLocation: workLocationMap[formData.workType] || 'HYBRID',
        location: formData.location || null,
        remoteOk: formData.isRemoteOk || formData.workType === 'remote',

        companyName: formData.department || 'Company',
        companySize: formData.companySize || null,
        companyIndustry: formData.industry || null,

        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
        salaryCurrency: formData.currency === 'USD' ? 'EUR' : formData.currency,
        salaryPeriod: formData.salaryType || 'yearly',
        showSalary: !!(formData.salaryMin && formData.salaryMax),

        requiredSkills: Array.isArray(formData.targetSkills) ? formData.targetSkills : [],
        preferredSkills: [],
        education: formData.experienceLevel || null,
        experience: formData.experienceLevel || null,

        tags: [],
        expiresAt: formData.applicationDeadline ? new Date(formData.applicationDeadline).toISOString() : null,
        internalApply: true,

        status: status === 'published' ? 'ACTIVE' : 'DRAFT',
      }

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      })

      if (response.ok) {
        const result = await response.json()
        router.push(`/dashboard/recruiter/jobs/${result.id}`)
      }
    } catch (error) {
      console.error('Failed to submit job:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
            <div>
              <Label htmlFor="title">{t('form.jobTitle')} *</Label>
              <Input
                id="title"
                placeholder="e.g. Senior Software Engineer"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">{t('form.department')} *</Label>
                <Input
                  id="department"
                  placeholder="e.g. Engineering"
                  value={formData.department}
                  onChange={(e) => updateFormData('department', e.target.value)}
                  className={errors.department ? 'border-red-500' : ''}
                />
                {errors.department && <p className="text-sm text-red-600 mt-1">{errors.department}</p>}
              </div>

              <div>
                <Label htmlFor="location">{t('form.location')} *</Label>
                <Input
                  id="location"
                  placeholder="e.g. San Francisco, CA or Remote"
                  value={formData.location}
                  onChange={(e) => updateFormData('location', e.target.value)}
                  className={errors.location ? 'border-red-500' : ''}
                />
                {errors.location && <p className="text-sm text-red-600 mt-1">{errors.location}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{t('form.workType')} *</Label>
                <Select value={formData.workType} onValueChange={(value) => updateFormData('workType', value)}>
                  <SelectTrigger className={errors.workType ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('form.selectWorkType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">{t('form.remote')}</SelectItem>
                    <SelectItem value="hybrid">{t('form.hybrid')}</SelectItem>
                    <SelectItem value="onsite">{t('form.onsite')}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.workType && <p className="text-sm text-red-600 mt-1">{errors.workType}</p>}
              </div>

              <div>
                <Label>{t('form.employmentType')} *</Label>
                <Select value={formData.employmentType} onValueChange={(value) => updateFormData('employmentType', value)}>
                  <SelectTrigger className={errors.employmentType ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('form.selectEmploymentType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">{t('form.fullTime')}</SelectItem>
                    <SelectItem value="part-time">{t('form.partTime')}</SelectItem>
                    <SelectItem value="contract">{t('form.contract')}</SelectItem>
                    <SelectItem value="internship">{t('form.internship')}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.employmentType && <p className="text-sm text-red-600 mt-1">{errors.employmentType}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="numberOfPositions">{t('form.numberOfPositions')}</Label>
              <Input
                id="numberOfPositions"
                type="number"
                min="1"
                value={formData.numberOfPositions}
                onChange={(e) => updateFormData('numberOfPositions', e.target.value)}
              />
            </div>
          </div>
        )

      case 1:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
            <div>
              <Label htmlFor="description">{t('form.jobDescription')} *</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description of the role, team, and what the candidate will be working on..."
                rows={6}
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
            </div>

            <div>
              <Label>{t('form.keyResponsibilities')} *</Label>
              {errors.responsibilities && <p className="text-sm text-red-600 mb-2">{errors.responsibilities}</p>}
              {(formData.responsibilities || []).map((responsibility, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a key responsibility..."
                    value={responsibility}
                    onChange={(e) => updateArrayItem('responsibilities', index, e.target.value)}
                  />
                  {formData.responsibilities.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('responsibilities', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('responsibilities')}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('form.addResponsibility')}
              </Button>
            </div>

            <div>
              <Label>{t('form.requiredQualifications')} *</Label>
              {errors.requirements && <p className="text-sm text-red-600 mb-2">{errors.requirements}</p>}
              {(formData.requirements || []).map((requirement, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a required qualification..."
                    value={requirement}
                    onChange={(e) => updateArrayItem('requirements', index, e.target.value)}
                  />
                  {formData.requirements.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('requirements', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('requirements')}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('form.addRequirement')}
              </Button>
            </div>

            <div>
              <Label>{t('form.preferredQualifications')}</Label>
              {(formData.preferredQualifications || []).map((qualification, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a preferred qualification..."
                    value={qualification}
                    onChange={(e) => updateArrayItem('preferredQualifications', index, e.target.value)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('preferredQualifications', index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('preferredQualifications')}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('form.addPreferredQualification')}
              </Button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="salaryMin">{t('form.minimumSalary')} *</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  placeholder="80000"
                  value={formData.salaryMin}
                  onChange={(e) => updateFormData('salaryMin', e.target.value)}
                  className={errors.salaryMin ? 'border-red-500' : ''}
                />
                {errors.salaryMin && <p className="text-sm text-red-600 mt-1">{errors.salaryMin}</p>}
              </div>

              <div>
                <Label htmlFor="salaryMax">{t('form.maximumSalary')} *</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  placeholder="120000"
                  value={formData.salaryMax}
                  onChange={(e) => updateFormData('salaryMax', e.target.value)}
                  className={errors.salaryMax ? 'border-red-500' : ''}
                />
                {errors.salaryMax && <p className="text-sm text-red-600 mt-1">{errors.salaryMax}</p>}
              </div>

              <div>
                <Label>{t('form.salaryType')}</Label>
                <Select value={formData.salaryType} onValueChange={(value) => updateFormData('salaryType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yearly">{t('form.yearly')}</SelectItem>
                    <SelectItem value="hourly">{t('form.hourly')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>{t('form.benefitsPerks')}</Label>
              <p className="text-sm text-gray-700 mb-3">{t('form.selectBenefits')}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(benefits || []).map((benefit) => (
                  <label key={benefit} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={(formData as any).benefits.includes(benefit)}
                      onCheckedChange={() => toggleArrayValue('benefits', benefit)}
                    />
                    <span className="text-sm">{benefit}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{t('form.companySize')}</Label>
                <Select value={formData.companySize} onValueChange={(value) => updateFormData('companySize', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('form.selectCompanySize')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">Startup (1-50)</SelectItem>
                    <SelectItem value="small">Small (51-200)</SelectItem>
                    <SelectItem value="medium">Medium (201-1000)</SelectItem>
                    <SelectItem value="large">Large (1000+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{t('form.industry')}</Label>
                <Select value={formData.industry} onValueChange={(value) => updateFormData('industry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('form.selectIndustry')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="fintech">Fintech</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="media">Media & Entertainment</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="companyDescription">{t('form.companyDescription')}</Label>
              <Textarea
                id="companyDescription"
                placeholder="Tell candidates about your company, mission, and culture..."
                rows={4}
                value={formData.companyDescription}
                onChange={(e) => updateFormData('companyDescription', e.target.value)}
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
            <div>
              <Label>{t('form.targetUniversities')} *</Label>
              {errors.targetUniversities && <p className="text-sm text-red-600 mb-2">{errors.targetUniversities}</p>}
              <p className="text-sm text-gray-700 mb-3">{t('form.selectUniversities')}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {universities.map((university) => (
                  <label key={university} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={(formData as any).targetUniversities.includes(university)}
                      onCheckedChange={() => toggleArrayValue('targetUniversities', university)}
                    />
                    <span className="text-sm">{university}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>{t('form.targetMajors')} *</Label>
              {errors.targetMajors && <p className="text-sm text-red-600 mb-2">{errors.targetMajors}</p>}
              <p className="text-sm text-gray-700 mb-3">{t('form.selectMajors')}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {majors.map((major) => (
                  <label key={major} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={(formData as any).targetMajors.includes(major)}
                      onCheckedChange={() => toggleArrayValue('targetMajors', major)}
                    />
                    <span className="text-sm">{major}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>{t('form.requiredSkills')}</Label>
              <p className="text-sm text-gray-700 mb-3">{t('form.selectSkills')}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {skills.slice(0, 20).map((skill) => (
                  <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={(formData as any).targetSkills.includes(skill)}
                      onCheckedChange={() => toggleArrayValue('targetSkills', skill)}
                    />
                    <span className="text-sm">{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{t('form.experienceLevel')} *</Label>
                <Select value={formData.experienceLevel} onValueChange={(value) => updateFormData('experienceLevel', value)}>
                  <SelectTrigger className={errors.experienceLevel ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('form.selectExperienceLevel')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">{t('form.entryLevel')}</SelectItem>
                    <SelectItem value="mid">{t('form.midLevel')}</SelectItem>
                    <SelectItem value="senior">{t('form.seniorLevel')}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.experienceLevel && <p className="text-sm text-red-600 mt-1">{errors.experienceLevel}</p>}
              </div>

              <div>
                <Label htmlFor="gpaRequirement">{t('form.minimumGpa')}</Label>
                <Input
                  id="gpaRequirement"
                  type="number"
                  step="0.1"
                  min="0"
                  max="4.0"
                  placeholder="3.0"
                  value={formData.gpaRequirement}
                  onChange={(e) => updateFormData('gpaRequirement', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>{t('form.targetGraduationYears')}</Label>
              <p className="text-sm text-gray-700 mb-3">{t('form.selectGraduationYears')}</p>
              <div className="flex gap-2">
                {['2024', '2025', '2026', '2027'].map((year) => (
                  <label key={year} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={(formData as any).graduationYears.includes(year)}
                      onCheckedChange={() => toggleArrayValue('graduationYears', year)}
                    />
                    <span className="text-sm">{year}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
            <div>
              <Label htmlFor="applicationProcess">{t('form.applicationProcess')} *</Label>
              <Textarea
                id="applicationProcess"
                placeholder="Describe how candidates should apply and what to expect..."
                rows={4}
                value={formData.applicationProcess}
                onChange={(e) => updateFormData('applicationProcess', e.target.value)}
                className={errors.applicationProcess ? 'border-red-500' : ''}
              />
              {errors.applicationProcess && <p className="text-sm text-red-600 mt-1">{errors.applicationProcess}</p>}
            </div>

            <div>
              <Label htmlFor="interviewProcess">{t('form.interviewProcess')}</Label>
              <Textarea
                id="interviewProcess"
                placeholder="Describe your interview process (optional)..."
                rows={3}
                value={formData.interviewProcess}
                onChange={(e) => updateFormData('interviewProcess', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="applicationDeadline">{t('form.applicationDeadline')} *</Label>
                <Input
                  id="applicationDeadline"
                  type="date"
                  value={formData.applicationDeadline}
                  onChange={(e) => updateFormData('applicationDeadline', e.target.value)}
                  className={errors.applicationDeadline ? 'border-red-500' : ''}
                />
                {errors.applicationDeadline && <p className="text-sm text-red-600 mt-1">{errors.applicationDeadline}</p>}
              </div>

              <div>
                <Label htmlFor="startDate">{t('form.expectedStartDate')}</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateFormData('startDate', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="hiringManagerContact">{t('form.hiringManagerContact')}</Label>
              <Input
                id="hiringManagerContact"
                placeholder="hiring.manager@company.com"
                value={formData.hiringManagerContact}
                onChange={(e) => updateFormData('hiringManagerContact', e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>{t('form.additionalOptions')}</Label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={formData.isUrgent}
                  onCheckedChange={(checked) => updateFormData('isUrgent', checked)}
                />
                <span className="text-sm">{t('form.urgentHiring')}</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={formData.requiresSponsorship}
                  onCheckedChange={(checked) => updateFormData('requiresSponsorship', checked)}
                />
                <span className="text-sm">{t('form.visaSponsorship')}</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={formData.allowsInternational}
                  onCheckedChange={(checked) => updateFormData('allowsInternational', checked)}
                />
                <span className="text-sm">{t('form.internationalCandidates')}</span>
              </label>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                {t('review.reviewMessage')}
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{formData.title}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {formData.department} • {formData.location} • {formData.employmentType}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant="outline">
                      ${parseInt(formData.salaryMin).toLocaleString()} - ${parseInt(formData.salaryMax).toLocaleString()}
                    </Badge>
                    <Badge variant={formData.isUrgent ? "destructive" : "secondary"}>
                      {formData.isUrgent ? "Urgent" : formData.workType}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{t('form.jobDescription')}</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{formData.description}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{t('form.keyResponsibilities')}</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {formData.responsibilities?.filter(r => r.trim()).map((responsibility, index) => (
                        <li key={index} className="text-gray-700">{responsibility}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{t('form.requiredQualifications')}</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {formData.requirements?.filter(r => r.trim()).map((requirement, index) => (
                        <li key={index} className="text-gray-700">{requirement}</li>
                      ))}
                    </ul>
                  </div>

                  {formData.preferredQualifications?.filter(q => q.trim()).length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">{t('form.preferredQualifications')}</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {formData.preferredQualifications?.filter(q => q.trim()).map((qualification, index) => (
                          <li key={index} className="text-gray-700">{qualification}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {formData.benefits.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">{t('form.benefitsPerks')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.benefits.map((benefit) => (
                          <Badge key={benefit} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">{t('form.targetUniversities')}</h4>
                      <div className="space-y-1">
                        {formData.targetUniversities.slice(0, 3).map((university) => (
                          <p key={university} className="text-sm text-gray-600">{university}</p>
                        ))}
                        {formData.targetUniversities.length > 3 && (
                          <p className="text-sm text-gray-700">+{formData.targetUniversities.length - 3} more</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">{t('form.targetMajors')}</h4>
                      <div className="flex flex-wrap gap-1">
                        {formData.targetMajors.slice(0, 3).map((major) => (
                          <Badge key={major} variant="outline" className="text-xs">
                            {major}
                          </Badge>
                        ))}
                        {formData.targetMajors.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{formData.targetMajors.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/recruiter">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToDashboard')}
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-1">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    index <= currentStep
                      ? 'bg-primary border-blue-600 text-white'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="text-center mt-2">
                  <p className={`text-sm font-medium ${
                    index <= currentStep ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {step.title}
                  </p>
                  <p className={`text-xs ${
                    index <= currentStep ? 'text-gray-600' : 'text-gray-600'
                  }`}>
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-16 mt-5 ${
                    index < currentStep ? 'bg-primary' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div>
          {currentStep > 0 && (
            <Button variant="outline" onClick={prevStep}>
              {t('previous')}
            </Button>
          )}
        </div>

        <div className="flex space-x-3">
          {currentStep === steps.length - 1 ? (
            <>
              <Button
                variant="outline"
                onClick={() => submitJob('draft')}
                disabled={isSubmitting}
              >
                <Save className="mr-2 h-4 w-4" />
                {t('saveAsDraft')}
              </Button>
              <Button
                onClick={() => submitJob('published')}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                {t('publishJob')}
              </Button>
            </>
          ) : (
            <Button onClick={nextStep}>
              {t('next')}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}