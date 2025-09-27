'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { InstitutionalVerification } from '@/components/auth/InstitutionalVerification'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  GraduationCap,
  AlertCircle,
  Loader2,
  ArrowRight,
  CheckCircle,
  ArrowLeft,
  Star,
  Calendar,
  Building as University,
  Trophy
} from 'lucide-react'

export default function StudentRegisterPage() {
  const router = useRouter()
  const { register } = useAuth()

  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Basic Info
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',

    // Student-specific
    role: 'student',
    university: '',
    major: '',
    graduationYear: new Date().getFullYear() + 1,
    currentYear: 'final',

    // Verification
    acceptTerms: false,
    acceptPrivacy: false,

    // University Verification
    isUniversityVerified: false,
    verificationData: null as any
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)
  const [registrationError, setRegistrationError] = useState('')
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const steps = [
    {
      title: 'Personal Information',
      description: 'Your basic details',
      icon: User
    },
    {
      title: 'Account Security',
      description: 'Create your password',
      icon: Lock
    },
    {
      title: 'Academic Information',
      description: 'Your university details',
      icon: GraduationCap
    },
    {
      title: 'University Verification',
      description: 'Verify your credentials',
      icon: University
    },
    {
      title: 'Complete Setup',
      description: 'Terms and completion',
      icon: Trophy
    }
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: null }))
    }
  }

  const validateStep = (step: number) => {
    const newErrors: any = {}

    switch (step) {
      case 0: // Personal Information
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
        if (!formData.email.trim()) newErrors.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
        break

      case 1: // Account Security
        if (!formData.password) newErrors.password = 'Password is required'
        else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
        break

      case 2: // Academic Information
        if (!formData.university) newErrors.university = 'University is required'
        if (!formData.major) newErrors.major = 'Major/Field of study is required'
        if (!formData.graduationYear) newErrors.graduationYear = 'Graduation year is required'
        break

      case 3: // University Verification
        if (!formData.isUniversityVerified) {
          newErrors.universityVerification = 'Please complete university verification'
        }
        break

      case 4: // Terms
        if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the Terms of Service'
        if (!formData.acceptPrivacy) newErrors.acceptPrivacy = 'You must accept the Privacy Policy'
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

  const handleVerificationComplete = (universityData: any, studentData: any) => {
    setFormData(prev => ({
      ...prev,
      isUniversityVerified: true,
      verificationData: { universityData, studentData }
    }))

    if (errors.universityVerification) {
      setErrors((prev: any) => ({ ...prev, universityVerification: null }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(currentStep)) return

    setIsLoading(true)
    setRegistrationError('')

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        university: formData.university,
        major: formData.major,
        graduationYear: formData.graduationYear,
        verificationData: formData.verificationData
      })

      setRegistrationSuccess(true)
      setTimeout(() => {
        router.push('/dashboard/student')
      }, 2000)

    } catch (error: any) {
      setRegistrationError(error.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to InTransparency!</h2>
            <p className="text-gray-600 mb-4">
              Your student account has been created successfully. You'll be redirected to your dashboard shortly.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-700">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Setting up your profile...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="email">University Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@university.edu"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              <p className="text-xs text-gray-700 mt-1">
                Use your university email for automatic verification
              </p>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={errors.password ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="university">University</Label>
              <Input
                id="university"
                placeholder="e.g. Stanford University"
                value={formData.university}
                onChange={(e) => handleInputChange('university', e.target.value)}
                className={errors.university ? 'border-red-500' : ''}
              />
              {errors.university && <p className="text-sm text-red-600 mt-1">{errors.university}</p>}
            </div>

            <div>
              <Label htmlFor="major">Major / Field of Study</Label>
              <Input
                id="major"
                placeholder="e.g. Computer Science"
                value={formData.major}
                onChange={(e) => handleInputChange('major', e.target.value)}
                className={errors.major ? 'border-red-500' : ''}
              />
              {errors.major && <p className="text-sm text-red-600 mt-1">{errors.major}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Graduation Year</Label>
                <Select
                  value={formData.graduationYear.toString()}
                  onValueChange={(value) => handleInputChange('graduationYear', parseInt(value))}
                >
                  <SelectTrigger className={errors.graduationYear ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i).map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.graduationYear && <p className="text-sm text-red-600 mt-1">{errors.graduationYear}</p>}
              </div>

              <div>
                <Label>Current Year</Label>
                <Select
                  value={formData.currentYear}
                  onValueChange={(value) => handleInputChange('currentYear', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first">First Year</SelectItem>
                    <SelectItem value="second">Second Year</SelectItem>
                    <SelectItem value="third">Third Year</SelectItem>
                    <SelectItem value="final">Final Year</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <InstitutionalVerification
              userEmail={formData.email}
              onVerificationComplete={handleVerificationComplete}
            />
            {errors.universityVerification && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.universityVerification}</AlertDescription>
              </Alert>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <Checkbox
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                  className={errors.acceptTerms ? 'border-red-500' : ''}
                />
                <div className="text-sm">
                  <span>I agree to the </span>
                  <Link href="/legal/terms" className="text-blue-600 hover:text-blue-500" target="_blank">
                    Terms of Service
                  </Link>
                </div>
              </label>
              {errors.acceptTerms && <p className="text-sm text-red-600">{errors.acceptTerms}</p>}

              <label className="flex items-start space-x-3 cursor-pointer">
                <Checkbox
                  checked={formData.acceptPrivacy}
                  onCheckedChange={(checked) => handleInputChange('acceptPrivacy', checked)}
                  className={errors.acceptPrivacy ? 'border-red-500' : ''}
                />
                <div className="text-sm">
                  <span>I agree to the </span>
                  <Link href="/legal/privacy" className="text-blue-600 hover:text-blue-500" target="_blank">
                    Privacy Policy
                  </Link>
                </div>
              </label>
              {errors.acceptPrivacy && <p className="text-sm text-red-600">{errors.acceptPrivacy}</p>}
            </div>

            <Alert className="border-green-200 bg-green-50">
              <Star className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                <strong>100% Free for Students!</strong> Your account will always be free.
                Companies pay to access our talent pool, which keeps the platform free for you.
              </AlertDescription>
            </Alert>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-blue-600">
              InTransparency
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Already have an account?</span>
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Create Student Account</h1>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/register/role-selection">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Change Role
              </Link>
            </Button>
          </div>
          <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className={`text-xs ${index <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                  {step.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                {React.createElement(steps[currentStep].icon, { className: "h-5 w-5 text-blue-600" })}
              </div>
              <div>
                <CardTitle>{steps[currentStep].title}</CardTitle>
                <CardDescription>{steps[currentStep].description}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={currentStep === steps.length - 1 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
              {renderStepContent()}

              {registrationError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{registrationError}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={currentStep === 0 ? 'invisible' : ''}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {currentStep === steps.length - 1 ? 'Create Account' : 'Continue'}
                  {currentStep < steps.length - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}