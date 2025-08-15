'use client'

import { useState } from 'react'
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
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  Building,
  GraduationCap,
  AlertCircle,
  Loader2,
  ArrowRight,
  CheckCircle,
  Github,
  Google
} from 'lucide-react'

export default function RegisterPage() {
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
    
    // Role & Affiliation
    role: '',
    university: '',
    company: '',
    department: '',
    graduationYear: '',
    
    // Verification
    acceptTerms: false,
    acceptPrivacy: false,
    emailVerified: false
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)
  const [registrationError, setRegistrationError] = useState('')
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const steps = [
    {
      title: 'Basic Information',
      description: 'Your name and contact details',
      icon: User
    },
    {
      title: 'Account Security',
      description: 'Create a secure password',
      icon: Lock
    },
    {
      title: 'Role & Affiliation',
      description: 'Tell us about yourself',
      icon: Building
    },
    {
      title: 'Verification',
      description: 'Verify your information',
      icon: CheckCircle
    }
  ]

  const universities = [
    'Stanford University', 'MIT', 'UC Berkeley', 'Carnegie Mellon', 'Caltech',
    'Harvard University', 'Princeton University', 'Yale University', 'Columbia University',
    'University of Washington', 'Georgia Tech', 'UT Austin', 'UCLA', 'USC',
    'Cornell University', 'University of Michigan', 'Northwestern University'
  ]

  const companies = [
    'Google', 'Meta', 'Apple', 'Microsoft', 'Amazon', 'Netflix', 'Tesla',
    'Uber', 'Airbnb', 'Stripe', 'Figma', 'Notion', 'Discord', 'Zoom',
    'Salesforce', 'Adobe', 'Intel', 'NVIDIA', 'SpaceX', 'Other'
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
    if (registrationError) {
      setRegistrationError('')
    }
  }

  const validateStep = (step: number) => {
    const newErrors: any = {}

    switch (step) {
      case 0: // Basic Information
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
        break

      case 1: // Account Security
        if (!formData.password.trim()) {
          newErrors.password = 'Password is required'
        } else if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters'
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
          newErrors.password = 'Password must contain uppercase, lowercase, and number'
        }
        
        if (!formData.confirmPassword.trim()) {
          newErrors.confirmPassword = 'Please confirm your password'
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match'
        }
        break

      case 2: // Role & Affiliation
        if (!formData.role) {
          newErrors.role = 'Please select your role'
        }
        
        if (formData.role === 'student' && !formData.university) {
          newErrors.university = 'Please select your university'
        }
        
        if (formData.role === 'recruiter' && !formData.company) {
          newErrors.company = 'Please select your company'
        }
        
        if (formData.role === 'university' && !formData.department) {
          newErrors.department = 'Please specify your department'
        }
        break

      case 3: // Verification
        if (!formData.acceptTerms) {
          newErrors.acceptTerms = 'You must accept the terms of service'
        }
        if (!formData.acceptPrivacy) {
          newErrors.acceptPrivacy = 'You must accept the privacy policy'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(currentStep)) return

    setIsLoading(true)
    setRegistrationError('')

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        university: formData.university,
        company: formData.company,
        department: formData.department,
        graduationYear: formData.graduationYear
      }

      const result = await register(userData)
      
      if (result.success) {
        setRegistrationSuccess(true)
      } else {
        setRegistrationError(result.error || 'Registration failed')
      }
    } catch (error: any) {
      setRegistrationError(error.message || 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialRegister = (provider: string) => {
    // Redirect to OAuth provider
    window.location.href = `/api/auth/${provider}/redirect?action=register`
  }

  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Registration Successful!
            </h1>
            <p className="text-gray-600 mb-6">
              Please check your email to verify your account before signing in.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/auth/login">
                  Go to Sign In
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  Back to Home
                </Link>
              </Button>
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
                  disabled={isLoading}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={errors.lastName ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@university.edu"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Must be 8+ characters with uppercase, lowercase, and number
              </p>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label>I am a...</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">
                    <div className="flex items-center">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Student
                    </div>
                  </SelectItem>
                  <SelectItem value="recruiter">
                    <div className="flex items-center">
                      <Building className="mr-2 h-4 w-4" />
                      Recruiter
                    </div>
                  </SelectItem>
                  <SelectItem value="university">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      University Staff
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-600 mt-1">{errors.role}</p>
              )}
            </div>

            {formData.role === 'student' && (
              <>
                <div>
                  <Label>University</Label>
                  <Select value={formData.university} onValueChange={(value) => handleInputChange('university', value)}>
                    <SelectTrigger className={errors.university ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select your university" />
                    </SelectTrigger>
                    <SelectContent>
                      {universities.map((university) => (
                        <SelectItem key={university} value={university}>
                          {university}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.university && (
                    <p className="text-sm text-red-600 mt-1">{errors.university}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="graduationYear">Expected Graduation Year</Label>
                  <Select value={formData.graduationYear} onValueChange={(value) => handleInputChange('graduationYear', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2027">2027</SelectItem>
                      <SelectItem value="2028">2028</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {formData.role === 'recruiter' && (
              <div>
                <Label>Company</Label>
                <Select value={formData.company} onValueChange={(value) => handleInputChange('company', value)}>
                  <SelectTrigger className={errors.company ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select your company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.company && (
                  <p className="text-sm text-red-600 mt-1">{errors.company}</p>
                )}
              </div>
            )}

            {formData.role === 'university' && (
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  placeholder="e.g. Computer Science, Career Services"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className={errors.department ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.department && (
                  <p className="text-sm text-red-600 mt-1">{errors.department}</p>
                )}
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer">
                <Checkbox
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                  className={errors.acceptTerms ? 'border-red-500' : ''}
                />
                <div className="text-sm">
                  <span>I agree to the </span>
                  <Link href="/legal/terms" className="text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </Link>
                </div>
              </label>
              {errors.acceptTerms && (
                <p className="text-sm text-red-600">{errors.acceptTerms}</p>
              )}

              <label className="flex items-start space-x-3 cursor-pointer">
                <Checkbox
                  checked={formData.acceptPrivacy}
                  onCheckedChange={(checked) => handleInputChange('acceptPrivacy', checked)}
                  className={errors.acceptPrivacy ? 'border-red-500' : ''}
                />
                <div className="text-sm">
                  <span>I agree to the </span>
                  <Link href="/legal/privacy" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </Link>
                </div>
              </label>
              {errors.acceptPrivacy && (
                <p className="text-sm text-red-600">{errors.acceptPrivacy}</p>
              )}
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                After registration, you'll receive an email to verify your account. 
                Please check your inbox and spam folder.
              </AlertDescription>
            </Alert>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-2 text-gray-600">
            Join the InTransparency community
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                  index <= currentStep
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}
              >
                <step.icon className="h-4 w-4" />
              </div>
              <p className={`text-xs mt-1 ${
                index <= currentStep ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step.title}
              </p>
            </div>
          ))}
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription className="text-center">
              {steps[currentStep].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Registration Error */}
              {registrationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{registrationError}</AlertDescription>
                </Alert>
              )}

              {/* Step Content */}
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={isLoading}
                  >
                    Previous
                  </Button>
                )}

                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={isLoading}
                    className="ml-auto"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="ml-auto"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>

            {/* Social Registration - Only show on first step */}
            {currentStep === 0 && (
              <>
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or register with</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialRegister('google')}
                    disabled={isLoading}
                  >
                    <Google className="h-4 w-4 mr-2" />
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialRegister('github')}
                    disabled={isLoading}
                  >
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link 
              href="/auth/login" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}