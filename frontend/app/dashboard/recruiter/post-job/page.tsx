'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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

export default function PostJobPage() {
  const router = useRouter()
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
      title: 'Basic Information',
      description: 'Job title, location, and employment type',
      icon: Briefcase
    },
    {
      title: 'Job Description',
      description: 'Detailed job description and requirements',
      icon: BookOpen
    },
    {
      title: 'Compensation',
      description: 'Salary range and benefits',
      icon: DollarSign
    },
    {
      title: 'Candidate Targeting',
      description: 'Target universities and qualifications',
      icon: Target
    },
    {
      title: 'Application Process',
      description: 'How candidates should apply',
      icon: Users
    },
    {
      title: 'Review & Publish',
      description: 'Review and publish your job posting',
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
      [field]: (prev as any)[field].map((item: any, i: number) => i === index ? value : item)
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
      const jobData = {
        ...formData,
        status,
        // Filter out empty array items
        responsibilities: formData.responsibilities.filter(r => r.trim()),
        requirements: formData.requirements.filter(r => r.trim()),
        preferredQualifications: formData.preferredQualifications.filter(r => r.trim())
      }

      // Mock API call
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
              <Label htmlFor="title">Job Title *</Label>
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
                <Label htmlFor="department">Department *</Label>
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
                <Label htmlFor="location">Location *</Label>
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
                <Label>Work Type *</Label>
                <Select value={formData.workType} onValueChange={(value) => updateFormData('workType', value)}>
                  <SelectTrigger className={errors.workType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select work type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                  </SelectContent>
                </Select>
                {errors.workType && <p className="text-sm text-red-600 mt-1">{errors.workType}</p>}
              </div>

              <div>
                <Label>Employment Type *</Label>
                <Select value={formData.employmentType} onValueChange={(value) => updateFormData('employmentType', value)}>
                  <SelectTrigger className={errors.employmentType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
                {errors.employmentType && <p className="text-sm text-red-600 mt-1">{errors.employmentType}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="numberOfPositions">Number of Positions</Label>
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
              <Label htmlFor="description">Job Description *</Label>
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
              <Label>Key Responsibilities *</Label>
              {errors.responsibilities && <p className="text-sm text-red-600 mb-2">{errors.responsibilities}</p>}
              {formData.responsibilities.map((responsibility, index) => (
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
                Add Responsibility
              </Button>
            </div>

            <div>
              <Label>Required Qualifications *</Label>
              {errors.requirements && <p className="text-sm text-red-600 mb-2">{errors.requirements}</p>}
              {formData.requirements.map((requirement, index) => (
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
                Add Requirement
              </Button>
            </div>

            <div>
              <Label>Preferred Qualifications</Label>
              {formData.preferredQualifications.map((qualification, index) => (
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
                Add Preferred Qualification
              </Button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="salaryMin">Minimum Salary *</Label>
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
                <Label htmlFor="salaryMax">Maximum Salary *</Label>
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
                <Label>Salary Type</Label>
                <Select value={formData.salaryType} onValueChange={(value) => updateFormData('salaryType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Benefits & Perks</Label>
              <p className="text-sm text-gray-500 mb-3">Select all benefits that apply</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {benefits.map((benefit) => (
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
                <Label>Company Size</Label>
                <Select value={formData.companySize} onValueChange={(value) => updateFormData('companySize', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
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
                <Label>Industry</Label>
                <Select value={formData.industry} onValueChange={(value) => updateFormData('industry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
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
              <Label htmlFor="companyDescription">Company Description</Label>
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
              <Label>Target Universities *</Label>
              {errors.targetUniversities && <p className="text-sm text-red-600 mb-2">{errors.targetUniversities}</p>}
              <p className="text-sm text-gray-500 mb-3">Select universities you want to target for this role</p>
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
              <Label>Target Majors *</Label>
              {errors.targetMajors && <p className="text-sm text-red-600 mb-2">{errors.targetMajors}</p>}
              <p className="text-sm text-gray-500 mb-3">Select relevant academic majors</p>
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
              <Label>Required Skills</Label>
              <p className="text-sm text-gray-500 mb-3">Select technical skills that are important for this role</p>
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
                <Label>Experience Level *</Label>
                <Select value={formData.experienceLevel} onValueChange={(value) => updateFormData('experienceLevel', value)}>
                  <SelectTrigger className={errors.experienceLevel ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                    <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                    <SelectItem value="senior">Senior Level (5+ years)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.experienceLevel && <p className="text-sm text-red-600 mt-1">{errors.experienceLevel}</p>}
              </div>

              <div>
                <Label htmlFor="gpaRequirement">Minimum GPA</Label>
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
              <Label>Target Graduation Years</Label>
              <p className="text-sm text-gray-500 mb-3">Select graduation years for candidates</p>
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
              <Label htmlFor="applicationProcess">Application Process *</Label>
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
              <Label htmlFor="interviewProcess">Interview Process</Label>
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
                <Label htmlFor="applicationDeadline">Application Deadline *</Label>
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
                <Label htmlFor="startDate">Expected Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateFormData('startDate', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="hiringManagerContact">Hiring Manager Contact</Label>
              <Input
                id="hiringManagerContact"
                placeholder="hiring.manager@company.com"
                value={formData.hiringManagerContact}
                onChange={(e) => updateFormData('hiringManagerContact', e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>Additional Options</Label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={formData.isUrgent}
                  onCheckedChange={(checked) => updateFormData('isUrgent', checked)}
                />
                <span className="text-sm">Mark as urgent hiring</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={formData.requiresSponsorship}
                  onCheckedChange={(checked) => updateFormData('requiresSponsorship', checked)}
                />
                <span className="text-sm">Open to visa sponsorship</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={formData.allowsInternational}
                  onCheckedChange={(checked) => updateFormData('allowsInternational', checked)}
                />
                <span className="text-sm">Allow international candidates</span>
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
                Review your job posting below. You can save as draft or publish immediately.
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
                    <h4 className="font-medium text-gray-900 mb-2">Job Description</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{formData.description}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Key Responsibilities</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {formData.responsibilities?.filter(r => r.trim()).map((responsibility, index) => (
                        <li key={index} className="text-gray-700">{responsibility}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Required Qualifications</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {formData.requirements?.filter(r => r.trim()).map((requirement, index) => (
                        <li key={index} className="text-gray-700">{requirement}</li>
                      ))}
                    </ul>
                  </div>

                  {formData.preferredQualifications?.filter(q => q.trim()).length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Preferred Qualifications</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {formData.preferredQualifications?.filter(q => q.trim()).map((qualification, index) => (
                          <li key={index} className="text-gray-700">{qualification}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {formData.benefits.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Benefits & Perks</h4>
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
                      <h4 className="font-medium text-gray-900 mb-2">Target Universities</h4>
                      <div className="space-y-1">
                        {formData.targetUniversities.slice(0, 3).map((university) => (
                          <p key={university} className="text-sm text-gray-600">{university}</p>
                        ))}
                        {formData.targetUniversities.length > 3 && (
                          <p className="text-sm text-gray-500">+{formData.targetUniversities.length - 3} more</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Target Majors</h4>
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
            Back to Dashboard
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Post New Job</h1>
          <p className="text-gray-600 mt-1">
            Create a job posting to attract top university talent
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
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-500'
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="text-center mt-2">
                  <p className={`text-sm font-medium ${
                    index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className={`text-xs ${
                    index <= currentStep ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-16 mt-5 ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
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
              Previous
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
                Save as Draft
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
                Publish Job
              </Button>
            </>
          ) : (
            <Button onClick={nextStep}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}