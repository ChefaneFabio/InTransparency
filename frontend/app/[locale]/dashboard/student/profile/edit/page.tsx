'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Save,
  Upload,
  X,
  Plus,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  User,
  GraduationCap,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Link as LinkIcon
} from 'lucide-react'

export default function EditProfilePage() {
  const router = useRouter()
  const { user, updateUser } = useAuth()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    university: '',
    major: '',
    graduationYear: new Date().getFullYear() + 1,
    location: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    skills: [] as string[],
    interests: [] as string[]
  })

  const [newSkill, setNewSkill] = useState('')
  const [newInterest, setNewInterest] = useState('')
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<any>({})
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        bio: user.bio || '',
        university: user.university || '',
        major: user.major || '',
        graduationYear: user.graduationYear || new Date().getFullYear() + 1,
        location: user.location || '',
        linkedinUrl: user.linkedinUrl || '',
        githubUrl: user.githubUrl || '',
        portfolioUrl: user.portfolioUrl || '',
        skills: user.skills || [],
        interests: user.interests || []
      })
      setPreviewUrl(user.avatarUrl || '')
    }
  }, [user])

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: null }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({ ...errors, image: 'Image size must be less than 5MB' })
        return
      }

      setProfileImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)

      if (errors.image) {
        setErrors({ ...errors, image: null })
      }
    }
  }

  const addSkill = () => {
    const skill = newSkill.trim()
    if (skill && !formData.skills.includes(skill) && formData.skills.length < 20) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const addInterest = () => {
    const interest = newInterest.trim()
    if (interest && !formData.interests.includes(interest) && formData.interests.length < 10) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }))
      setNewInterest('')
    }
  }

  const removeInterest = (interestToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }))
  }

  const validateForm = () => {
    const newErrors: any = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.graduationYear < new Date().getFullYear() - 10 || formData.graduationYear > new Date().getFullYear() + 10) {
      newErrors.graduationYear = 'Please enter a valid graduation year'
    }

    // URL validations
    if (formData.linkedinUrl && !formData.linkedinUrl.includes('linkedin.com')) {
      newErrors.linkedinUrl = 'Please enter a valid LinkedIn URL'
    }

    if (formData.githubUrl && !formData.githubUrl.includes('github.com')) {
      newErrors.githubUrl = 'Please enter a valid GitHub URL'
    }

    if (formData.portfolioUrl && !/^https?:\/\/.+\..+/.test(formData.portfolioUrl)) {
      newErrors.portfolioUrl = 'Please enter a valid URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setSuccessMessage('')

    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update user context
      updateUser(formData)

      setSuccessMessage('Profile updated successfully!')

      // Redirect back to profile after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/student/profile')
      }, 2000)

    } catch (error) {
      setErrors({ general: 'Failed to update profile. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const currentYear = new Date().getFullYear()
  const graduationYears = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-1">
            Update your information to help recruiters find you
          </p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* General Error */}
      {errors.general && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.general}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Your basic profile information that will be visible to recruiters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Image */}
                <div className="flex items-start gap-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-16 w-16 text-gray-600" />
                      )}
                    </div>
                    <div className="text-center">
                      <Label htmlFor="profile-image" className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Photo
                          </span>
                        </Button>
                      </Label>
                      <Input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <p className="text-xs text-gray-700 mt-2">
                        Max 5MB, JPG or PNG
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className={errors.firstName ? 'border-red-500' : ''}
                        />
                        {errors.firstName && (
                          <p className="text-sm text-red-600">{errors.firstName}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className={errors.lastName ? 'border-red-500' : ''}
                        />
                        {errors.lastName && (
                          <p className="text-sm text-red-600">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
                        <Input
                          id="location"
                          placeholder="e.g. Milano, Italy"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell recruiters about yourself, your interests, and career goals..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-700 text-right">
                    {formData.bio.length}/500 characters
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Academic Information */}
          <TabsContent value="academic">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Academic Information
                </CardTitle>
                <CardDescription>
                  Your educational background and academic details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="university">University</Label>
                  <Input
                    id="university"
                    placeholder="e.g. Università Bocconi"
                    value={formData.university}
                    onChange={(e) => handleInputChange('university', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="major">Major/Field of Study</Label>
                  <Input
                    id="major"
                    placeholder="e.g. Computer Science, Business Administration"
                    value={formData.major}
                    onChange={(e) => handleInputChange('major', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Expected Graduation Year</Label>
                  <Select
                    value={formData.graduationYear.toString()}
                    onValueChange={(value) => handleInputChange('graduationYear', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {graduationYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.graduationYear && (
                    <p className="text-sm text-red-600">{errors.graduationYear}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills and Interests */}
          <TabsContent value="skills">
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                  <CardDescription>
                    Add your technical and professional skills (max 20)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a skill..."
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        disabled={formData.skills.length >= 20}
                      />
                      <Button
                        type="button"
                        onClick={addSkill}
                        disabled={!newSkill.trim() || formData.skills.length >= 20}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-1 hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>

                    <p className="text-xs text-gray-700">
                      {formData.skills.length}/20 skills added
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Interests</CardTitle>
                  <CardDescription>
                    Add your professional interests and areas of focus (max 10)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add an interest..."
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                        disabled={formData.interests.length >= 10}
                      />
                      <Button
                        type="button"
                        onClick={addInterest}
                        disabled={!newInterest.trim() || formData.interests.length >= 10}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {formData.interests.map((interest, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {interest}
                          <button
                            type="button"
                            onClick={() => removeInterest(interest)}
                            className="ml-1 hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>

                    <p className="text-xs text-gray-700">
                      {formData.interests.length}/10 interests added
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Links */}
          <TabsContent value="links">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Professional Links
                </CardTitle>
                <CardDescription>
                  Add links to your professional profiles and portfolio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
                    <Input
                      id="linkedinUrl"
                      placeholder="https://linkedin.com/in/yourname"
                      value={formData.linkedinUrl}
                      onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                      className={`pl-10 ${errors.linkedinUrl ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.linkedinUrl && (
                    <p className="text-sm text-red-600">{errors.linkedinUrl}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="githubUrl">GitHub Profile</Label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
                    <Input
                      id="githubUrl"
                      placeholder="https://github.com/yourusername"
                      value={formData.githubUrl}
                      onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                      className={`pl-10 ${errors.githubUrl ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.githubUrl && (
                    <p className="text-sm text-red-600">{errors.githubUrl}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolioUrl">Portfolio Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
                    <Input
                      id="portfolioUrl"
                      placeholder="https://yourportfolio.com"
                      value={formData.portfolioUrl}
                      onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                      className={`pl-10 ${errors.portfolioUrl ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.portfolioUrl && (
                    <p className="text-sm text-red-600">{errors.portfolioUrl}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}