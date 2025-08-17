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
  CheckCircle
} from 'lucide-react'

// Simple temporary icon components
const Github = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const Google = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

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
      setErrors((prev: any) => ({ ...prev, [field]: null }))
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

      const response = await register(userData)
      setRegistrationSuccess(true)
      
      // Redirect based on user role after successful registration
      setTimeout(() => {
        if (response.data?.user?.role) {
          const role = response.data.user.role
          switch (role) {
            case 'student':
              router.push('/dashboard/student')
              break
            case 'recruiter':
              router.push('/dashboard/recruiter')
              break
            case 'university':
              router.push('/dashboard/university')
              break
            default:
              router.push('/dashboard')
              break
          }
        } else {
          // Fallback redirect
          router.push('/dashboard')
        }
      }, 2000) // Wait 2 seconds to show success message
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