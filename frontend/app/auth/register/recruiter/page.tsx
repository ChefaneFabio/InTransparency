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
import { Badge } from '@/components/ui/badge'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Building2,
  AlertCircle,
  Loader2,
  ArrowRight,
  CheckCircle,
  ArrowLeft,
  Star,
  CreditCard,
  Users,
  Search,
  MessageCircle,
  Trophy
} from 'lucide-react'

export default function RecruiterRegisterPage() {
  const router = useRouter()
  const { register } = useAuth()

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedPlan, setSelectedPlan] = useState('basic')
  const [formData, setFormData] = useState({
    // Basic Info
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',

    // Company Info
    role: 'recruiter',
    company: '',
    jobTitle: '',
    companySize: '',
    industry: '',
    website: '',

    // Plan Selection
    plan: 'basic',
    billingCycle: 'monthly',

    // Verification
    acceptTerms: false,
    acceptPrivacy: false,
    agreeToTrial: true
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)
  const [registrationError, setRegistrationError] = useState('')
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const plans = [
    {
      id: 'basic',
      name: 'Recruiter Basic',
      price: 97,
      features: [
        'Search 500k+ verified students',
        'Send 50 messages per month',
        'Basic search filters',
        'Contact information access',
        'Standard analytics'
      ],
      limitations: ['Limited messaging', 'Basic filters only']
    },
    {
      id: 'pro',
      name: 'Recruiter Pro',
      price: 297,
      popular: true,
      features: [
        'Everything in Basic',
        'Unlimited messaging',
        'Advanced AI matching',
        'Detailed project analysis',
        'Priority InMail delivery',
        'Advanced analytics'
      ],
      limitations: []
    }
  ]

  const steps = [
    {
      title: 'Personal Information',
      description: 'Your contact details',
      icon: User
    },
    {
      title: 'Account Security',
      description: 'Create your password',
      icon: Lock
    },
    {
      title: 'Company Information',
      description: 'About your company',
      icon: Building2
    },
    {
      title: 'Choose Your Plan',
      description: 'Select features that fit',
      icon: Star
    },
    {
      title: 'Complete Setup',
      description: 'Start your free trial',
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

      case 2: // Company Information
        if (!formData.company) newErrors.company = 'Company name is required'
        if (!formData.jobTitle) newErrors.jobTitle = 'Job title is required'
        if (!formData.companySize) newErrors.companySize = 'Company size is required'
        if (!formData.industry) newErrors.industry = 'Industry is required'
        break

      case 3: // Plan Selection
        if (!formData.plan) newErrors.plan = 'Please select a plan'
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
        company: formData.company,
        jobTitle: formData.jobTitle,
        companySize: formData.companySize,
        industry: formData.industry,
        website: formData.website,
        plan: formData.plan
      })

      setRegistrationSuccess(true)
      setTimeout(() => {
        router.push('/dashboard/recruiter')
      }, 2000)

    } catch (error: any) {
      setRegistrationError(error.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to InTransparency!</h2>
            <p className="text-gray-600 mb-4">
              Your recruiter account has been created. Your 7-day free trial starts now!
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-700">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Setting up your dashboard...</span>
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
              <Label htmlFor="email">Work Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@company.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
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
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                placeholder="Acme Corporation"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className={errors.company ? 'border-red-500' : ''}
              />
              {errors.company && <p className="text-sm text-red-600 mt-1">{errors.company}</p>}
            </div>

            <div>
              <Label htmlFor="jobTitle">Your Job Title</Label>
              <Input
                id="jobTitle"
                placeholder="Senior Recruiter"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                className={errors.jobTitle ? 'border-red-500' : ''}
              />
              {errors.jobTitle && <p className="text-sm text-red-600 mt-1">{errors.jobTitle}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Company Size</Label>
                <Select
                  value={formData.companySize}
                  onValueChange={(value) => handleInputChange('companySize', value)}
                >
                  <SelectTrigger className={errors.companySize ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-1000">201-1000 employees</SelectItem>
                    <SelectItem value="1000+">1000+ employees</SelectItem>
                  </SelectContent>
                </Select>
                {errors.companySize && <p className="text-sm text-red-600 mt-1">{errors.companySize}</p>}
              </div>

              <div>
                <Label>Industry</Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => handleInputChange('industry', value)}
                >
                  <SelectTrigger className={errors.industry ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.industry && <p className="text-sm text-red-600 mt-1">{errors.industry}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="website">Company Website (Optional)</Label>
              <Input
                id="website"
                placeholder="https://company.com"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Choose Your Plan</h3>
              <p className="text-gray-600">Start with a 7-day free trial, no credit card required</p>
            </div>

            <div className="space-y-4">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`cursor-pointer transition-all ${
                    formData.plan === plan.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${plan.popular ? 'border-2' : ''}`}
                  onClick={() => handleInputChange('plan', plan.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={formData.plan === plan.id}
                          onChange={() => handleInputChange('plan', plan.id)}
                        />
                        <div>
                          <h4 className="font-semibold">{plan.name}</h4>
                          <p className="text-2xl font-bold">€{plan.price}<span className="text-base font-normal">/month</span></p>
                        </div>
                      </div>
                      {plan.popular && (
                        <Badge className="bg-blue-500">
                          <Star className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <Star className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                <strong>7-day free trial included!</strong> No credit card required.
                Cancel anytime during your trial period.
              </AlertDescription>
            </Alert>
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
              <Trophy className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                <strong>Ready to start your free trial!</strong> You'll get full access to all features
                for 7 days. No commitment required.
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Your Trial Includes:</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center">
                  <Search className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Full search access</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Unlimited messaging</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-purple-500" />
                  <span>Premium support</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-yellow-500" />
                  <span>All Pro features</span>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
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
            <h1 className="text-2xl font-bold text-gray-900">Create Recruiter Account</h1>
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
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {currentStep === steps.length - 1 ? 'Start Free Trial' : 'Continue'}
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