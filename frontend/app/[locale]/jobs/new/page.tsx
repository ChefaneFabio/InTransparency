'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Plus, X } from 'lucide-react'
import Link from 'next/link'

export default function NewJobPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    // Company Info
    companyName: session?.user?.company || '',
    companyLogo: '',
    companyWebsite: '',
    companySize: '',
    companyIndustry: '',

    // Job Details
    title: '',
    description: '',
    responsibilities: '',
    requirements: '',
    niceToHave: '',

    // Job Type & Location
    jobType: 'FULL_TIME',
    workLocation: 'HYBRID',
    location: '',
    remoteOk: false,

    // Compensation
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'EUR',
    salaryPeriod: 'yearly',
    showSalary: true,

    // Skills
    requiredSkills: [] as string[],
    preferredSkills: [] as string[],
    education: '',
    experience: '',
    languages: [] as string[],

    // Application Settings
    applicationUrl: '',
    applicationEmail: '',
    internalApply: true,
    requireCV: false,
    requireCoverLetter: false,

    // Status
    isPublic: false,
  })

  const [skillInput, setSkillInput] = useState('')
  const [preferredSkillInput, setPreferredSkillInput] = useState('')
  const [languageInput, setLanguageInput] = useState('')

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addSkill = () => {
    if (skillInput.trim() && !formData.requiredSkills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skillInput.trim()]
      }))
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(s => s !== skill)
    }))
  }

  const addPreferredSkill = () => {
    if (preferredSkillInput.trim() && !formData.preferredSkills.includes(preferredSkillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        preferredSkills: [...prev.preferredSkills, preferredSkillInput.trim()]
      }))
      setPreferredSkillInput('')
    }
  }

  const removePreferredSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      preferredSkills: prev.preferredSkills.filter(s => s !== skill)
    }))
  }

  const addLanguage = () => {
    if (languageInput.trim() && !formData.languages.includes(languageInput.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, languageInput.trim()]
      }))
      setLanguageInput('')
    }
  }

  const removeLanguage = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== lang)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session || session.user.role !== 'RECRUITER') {
      toast({
        title: 'Permission denied',
        description: 'Only recruiters can post jobs',
        variant: 'destructive'
      })
      return
    }

    // Validation
    if (!formData.title.trim()) {
      toast({
        title: 'Validation error',
        description: 'Job title is required',
        variant: 'destructive'
      })
      return
    }

    if (!formData.description.trim()) {
      toast({
        title: 'Validation error',
        description: 'Job description is required',
        variant: 'destructive'
      })
      return
    }

    if (!formData.companyName.trim()) {
      toast({
        title: 'Validation error',
        description: 'Company name is required',
        variant: 'destructive'
      })
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        ...formData,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
        applicationEmail: formData.applicationEmail || undefined,
        applicationUrl: formData.applicationUrl || undefined,
        companyLogo: formData.companyLogo || undefined,
        companyWebsite: formData.companyWebsite || undefined,
        companySize: formData.companySize || undefined,
        companyIndustry: formData.companyIndustry || undefined,
        location: formData.location || undefined,
        responsibilities: formData.responsibilities || undefined,
        requirements: formData.requirements || undefined,
        niceToHave: formData.niceToHave || undefined,
        education: formData.education || undefined,
        experience: formData.experience || undefined,
      }

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'Job created!',
          description: 'Your job posting has been created as a draft'
        })
        router.push(`/jobs/${data.job.id}`)
      } else {
        toast({
          title: 'Failed to create job',
          description: data.error || 'Something went wrong',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error creating job:', error)
      toast({
        title: 'Error',
        description: 'Failed to create job posting',
        variant: 'destructive'
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (session && session.user.role !== 'RECRUITER' && session.user.role !== 'ADMIN') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl text-center">
        <h1 className="text-2xl font-bold mb-4">Permission denied</h1>
        <p className="text-muted-foreground mb-4">Only recruiters can post jobs</p>
        <Link href="/jobs">
          <Button>Back to Jobs</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <Link href="/jobs">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Post a New Job</h1>
        <p className="text-muted-foreground">Fill out the form below to create your job posting</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Tell candidates about your company</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="companyLogo">Company Logo URL</Label>
                <Input
                  id="companyLogo"
                  type="url"
                  value={formData.companyLogo}
                  onChange={(e) => handleInputChange('companyLogo', e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div>
                <Label htmlFor="companyWebsite">Company Website</Label>
                <Input
                  id="companyWebsite"
                  type="url"
                  value={formData.companyWebsite}
                  onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                  placeholder="https://company.com"
                />
              </div>

              <div>
                <Label htmlFor="companySize">Company Size</Label>
                <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                  <SelectTrigger id="companySize">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="501-1000">501-1000 employees</SelectItem>
                    <SelectItem value="1000+">1000+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="companyIndustry">Industry</Label>
                <Input
                  id="companyIndustry"
                  value={formData.companyIndustry}
                  onChange={(e) => handleInputChange('companyIndustry', e.target.value)}
                  placeholder="e.g., Technology, Finance, Healthcare"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Details */}
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Describe the position</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
                placeholder="Describe the role, team, and what makes it exciting..."
                required
              />
            </div>

            <div>
              <Label htmlFor="responsibilities">Responsibilities</Label>
              <Textarea
                id="responsibilities"
                value={formData.responsibilities}
                onChange={(e) => handleInputChange('responsibilities', e.target.value)}
                rows={4}
                placeholder="List the key responsibilities..."
              />
            </div>

            <div>
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                rows={4}
                placeholder="List the required qualifications..."
              />
            </div>

            <div>
              <Label htmlFor="niceToHave">Nice to Have</Label>
              <Textarea
                id="niceToHave"
                value={formData.niceToHave}
                onChange={(e) => handleInputChange('niceToHave', e.target.value)}
                rows={3}
                placeholder="List preferred but not required qualifications..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Job Type & Location */}
        <Card>
          <CardHeader>
            <CardTitle>Job Type & Location</CardTitle>
            <CardDescription>Specify work arrangement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="jobType">Job Type</Label>
                <Select value={formData.jobType} onValueChange={(value) => handleInputChange('jobType', value)}>
                  <SelectTrigger id="jobType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Full-time</SelectItem>
                    <SelectItem value="PART_TIME">Part-time</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                    <SelectItem value="TEMPORARY">Temporary</SelectItem>
                    <SelectItem value="FREELANCE">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="workLocation">Work Location</Label>
                <Select value={formData.workLocation} onValueChange={(value) => handleInputChange('workLocation', value)}>
                  <SelectTrigger id="workLocation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REMOTE">Remote</SelectItem>
                    <SelectItem value="HYBRID">Hybrid</SelectItem>
                    <SelectItem value="ON_SITE">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Milan, Italy"
                />
              </div>

              <div className="md:col-span-2 flex items-center space-x-2">
                <Switch
                  id="remoteOk"
                  checked={formData.remoteOk}
                  onCheckedChange={(checked) => handleInputChange('remoteOk', checked)}
                />
                <Label htmlFor="remoteOk" className="cursor-pointer">
                  Remote work is acceptable
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compensation */}
        <Card>
          <CardHeader>
            <CardTitle>Compensation</CardTitle>
            <CardDescription>Salary information (optional)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salaryMin">Minimum Salary</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  value={formData.salaryMin}
                  onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                  placeholder="30000"
                />
              </div>

              <div>
                <Label htmlFor="salaryMax">Maximum Salary</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  value={formData.salaryMax}
                  onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                  placeholder="50000"
                />
              </div>

              <div>
                <Label htmlFor="salaryCurrency">Currency</Label>
                <Select value={formData.salaryCurrency} onValueChange={(value) => handleInputChange('salaryCurrency', value)}>
                  <SelectTrigger id="salaryCurrency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="salaryPeriod">Period</Label>
                <Select value={formData.salaryPeriod} onValueChange={(value) => handleInputChange('salaryPeriod', value)}>
                  <SelectTrigger id="salaryPeriod">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 flex items-center space-x-2">
                <Switch
                  id="showSalary"
                  checked={formData.showSalary}
                  onCheckedChange={(checked) => handleInputChange('showSalary', checked)}
                />
                <Label htmlFor="showSalary" className="cursor-pointer">
                  Show salary to applicants
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills & Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Skills & Requirements</CardTitle>
            <CardDescription>Technical and soft skills needed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="requiredSkills">Required Skills</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="requiredSkills"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="e.g., React, TypeScript"
                />
                <Button type="button" onClick={addSkill} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.requiredSkills.map((skill) => (
                  <Badge key={skill} variant="default" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                    {skill}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="preferredSkills">Preferred Skills</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="preferredSkills"
                  value={preferredSkillInput}
                  onChange={(e) => setPreferredSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPreferredSkill())}
                  placeholder="e.g., GraphQL, Docker"
                />
                <Button type="button" onClick={addPreferredSkill} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.preferredSkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => removePreferredSkill(skill)}>
                    {skill}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  value={formData.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  placeholder="e.g., Bachelor's in Computer Science"
                />
              </div>

              <div>
                <Label htmlFor="experience">Experience</Label>
                <Input
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  placeholder="e.g., 3-5 years"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="languages">Languages</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="languages"
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                  placeholder="e.g., English, Italian"
                />
                <Button type="button" onClick={addLanguage} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.languages.map((lang) => (
                  <Badge key={lang} variant="outline" className="cursor-pointer" onClick={() => removeLanguage(lang)}>
                    {lang}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
            <CardDescription>How candidates should apply</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="internalApply"
                checked={formData.internalApply}
                onCheckedChange={(checked) => handleInputChange('internalApply', checked)}
              />
              <Label htmlFor="internalApply" className="cursor-pointer">
                Accept applications through InTransparency
              </Label>
            </div>

            {!formData.internalApply && (
              <>
                <div>
                  <Label htmlFor="applicationUrl">External Application URL</Label>
                  <Input
                    id="applicationUrl"
                    type="url"
                    value={formData.applicationUrl}
                    onChange={(e) => handleInputChange('applicationUrl', e.target.value)}
                    placeholder="https://company.com/careers/apply"
                  />
                </div>

                <div>
                  <Label htmlFor="applicationEmail">Application Email</Label>
                  <Input
                    id="applicationEmail"
                    type="email"
                    value={formData.applicationEmail}
                    onChange={(e) => handleInputChange('applicationEmail', e.target.value)}
                    placeholder="careers@company.com"
                  />
                </div>
              </>
            )}

            {formData.internalApply && (
              <>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="requireCV"
                    checked={formData.requireCV}
                    onCheckedChange={(checked) => handleInputChange('requireCV', checked)}
                  />
                  <Label htmlFor="requireCV" className="cursor-pointer">
                    Require CV
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="requireCoverLetter"
                    checked={formData.requireCoverLetter}
                    onCheckedChange={(checked) => handleInputChange('requireCoverLetter', checked)}
                  />
                  <Label htmlFor="requireCoverLetter" className="cursor-pointer">
                    Require cover letter
                  </Label>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Visibility */}
        <Card>
          <CardHeader>
            <CardTitle>Visibility</CardTitle>
            <CardDescription>Control who can see this job</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
              />
              <Label htmlFor="isPublic" className="cursor-pointer">
                Make this job public immediately
              </Label>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              If unchecked, the job will be saved as a draft
            </p>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" size="lg" disabled={submitting} className="flex-1">
            {submitting ? 'Creating...' : formData.isPublic ? 'Publish Job' : 'Save as Draft'}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => router.back()} disabled={submitting}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
