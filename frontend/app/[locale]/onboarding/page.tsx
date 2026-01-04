'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  GraduationCap,
  Building2,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  User,
  MapPin,
  Calendar,
  Loader2
} from 'lucide-react'

type UserRole = 'STUDENT' | 'RECRUITER' | 'UNIVERSITY'

interface OnboardingData {
  // Common
  firstName: string
  lastName: string
  bio: string
  photo: string

  // Student specific
  university: string
  degree: string
  graduationYear: string
  skills: string[]

  // Recruiter specific
  company: string
  jobTitle: string
  companySize: string

  // University specific
  institutionName: string
  department: string
  region: string
}

const steps = {
  STUDENT: ['Profilo Base', 'Università', 'Competenze', 'Completa'],
  RECRUITER: ['Profilo Base', 'Azienda', 'Preferenze', 'Completa'],
  UNIVERSITY: ['Profilo Base', 'Istituzione', 'Dettagli', 'Completa']
}

const skillOptions = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'React', 'Node.js',
  'SQL', 'Machine Learning', 'Data Science', 'AWS', 'Docker', 'Git',
  'Agile', 'Project Management', 'Communication', 'Leadership'
]

export default function OnboardingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    firstName: '',
    lastName: '',
    bio: '',
    photo: '',
    university: '',
    degree: '',
    graduationYear: '',
    skills: [],
    company: '',
    jobTitle: '',
    companySize: '',
    institutionName: '',
    department: '',
    region: ''
  })

  const userRole = (session?.user?.role as UserRole) || 'STUDENT'
  const currentSteps = steps[userRole]
  const progress = ((currentStep + 1) / currentSteps.length) * 100

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }

    // Pre-fill data from session
    if (session?.user) {
      setData(prev => ({
        ...prev,
        firstName: session.user.firstName || '',
        lastName: session.user.lastName || ''
      }))
    }
  }, [session, status, router])

  const handleNext = () => {
    if (currentStep < currentSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      // Save profile data
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          bio: data.bio,
          university: data.university,
          degree: data.degree,
          graduationYear: data.graduationYear,
          company: data.company,
          jobTitle: data.jobTitle
        })
      })

      if (response.ok) {
        // Redirect to appropriate dashboard
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSkill = (skill: string) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
      <div className="container max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Benvenuto su InTransparency!
          </h1>
          <p className="text-gray-600">
            Completa il tuo profilo per iniziare
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {currentSteps.map((step, index) => (
              <div
                key={step}
                className={`flex items-center ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index < currentStep ? 'bg-blue-600 text-white' :
                  index === currentStep ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                {index < currentSteps.length - 1 && (
                  <div className={`h-0.5 w-12 mx-2 ${index < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-600 text-center mt-2">
            Passo {currentStep + 1} di {currentSteps.length}: {currentSteps[currentStep]}
          </p>
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="p-8">
            {/* Step 0: Basic Profile */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    {data.photo ? (
                      <img src={data.photo} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Carica Foto
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input
                      id="firstName"
                      value={data.firstName}
                      onChange={(e) => setData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Mario"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Cognome</Label>
                    <Input
                      id="lastName"
                      value={data.lastName}
                      onChange={(e) => setData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Rossi"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Presentazione</Label>
                  <Textarea
                    id="bio"
                    value={data.bio}
                    onChange={(e) => setData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Raccontaci qualcosa di te..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Step 1: Role-specific info */}
            {currentStep === 1 && userRole === 'STUDENT' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <GraduationCap className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <h2 className="text-xl font-semibold">Informazioni Universitarie</h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="university">Università / ITS</Label>
                    <Input
                      id="university"
                      value={data.university}
                      onChange={(e) => setData(prev => ({ ...prev, university: e.target.value }))}
                      placeholder="es. Politecnico di Milano"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="degree">Corso di Laurea</Label>
                    <Input
                      id="degree"
                      value={data.degree}
                      onChange={(e) => setData(prev => ({ ...prev, degree: e.target.value }))}
                      placeholder="es. Ingegneria Informatica"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">Anno di Laurea Previsto</Label>
                    <Input
                      id="graduationYear"
                      value={data.graduationYear}
                      onChange={(e) => setData(prev => ({ ...prev, graduationYear: e.target.value }))}
                      placeholder="es. 2025"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && userRole === 'RECRUITER' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <h2 className="text-xl font-semibold">Informazioni Aziendali</h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Nome Azienda</Label>
                    <Input
                      id="company"
                      value={data.company}
                      onChange={(e) => setData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="es. BMW Italia"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Ruolo</Label>
                    <Input
                      id="jobTitle"
                      value={data.jobTitle}
                      onChange={(e) => setData(prev => ({ ...prev, jobTitle: e.target.value }))}
                      placeholder="es. HR Manager"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Dimensione Azienda</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['1-10', '11-50', '51-200', '201-500', '500+'].map(size => (
                        <Button
                          key={size}
                          variant={data.companySize === size ? 'default' : 'outline'}
                          onClick={() => setData(prev => ({ ...prev, companySize: size }))}
                          className="w-full"
                        >
                          {size} dipendenti
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && userRole === 'UNIVERSITY' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <h2 className="text-xl font-semibold">Informazioni Istituzione</h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="institutionName">Nome Istituzione</Label>
                    <Input
                      id="institutionName"
                      value={data.institutionName}
                      onChange={(e) => setData(prev => ({ ...prev, institutionName: e.target.value }))}
                      placeholder="es. Politecnico di Milano"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Dipartimento</Label>
                    <Input
                      id="department"
                      value={data.department}
                      onChange={(e) => setData(prev => ({ ...prev, department: e.target.value }))}
                      placeholder="es. Career Services"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region">Regione</Label>
                    <Input
                      id="region"
                      value={data.region}
                      onChange={(e) => setData(prev => ({ ...prev, region: e.target.value }))}
                      placeholder="es. Lombardia"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Skills/Preferences */}
            {currentStep === 2 && userRole === 'STUDENT' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Briefcase className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <h2 className="text-xl font-semibold">Le tue Competenze</h2>
                  <p className="text-gray-600 text-sm">Seleziona le competenze che possiedi</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skillOptions.map(skill => (
                    <Badge
                      key={skill}
                      variant={data.skills.includes(skill) ? 'default' : 'outline'}
                      className="cursor-pointer py-2 px-3"
                      onClick={() => toggleSkill(skill)}
                    >
                      {data.skills.includes(skill) && <Check className="h-3 w-3 mr-1" />}
                      {skill}
                    </Badge>
                  ))}
                </div>

                <p className="text-sm text-gray-500 text-center">
                  {data.skills.length} competenze selezionate
                </p>
              </div>
            )}

            {currentStep === 2 && userRole !== 'STUDENT' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Briefcase className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <h2 className="text-xl font-semibold">Preferenze</h2>
                </div>

                <p className="text-gray-600 text-center">
                  Potrai configurare le tue preferenze dettagliate dalla dashboard dopo il completamento.
                </p>
              </div>
            )}

            {/* Step 3: Complete */}
            {currentStep === 3 && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Profilo Quasi Pronto!
                </h2>
                <p className="text-gray-600">
                  Clicca "Completa" per accedere alla tua dashboard e iniziare a usare InTransparency.
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Indietro
              </Button>

              {currentStep < currentSteps.length - 1 ? (
                <Button onClick={handleNext}>
                  Avanti
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleComplete} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvataggio...
                    </>
                  ) : (
                    <>
                      Completa
                      <Check className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Skip Option */}
        <div className="text-center mt-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="text-gray-500"
          >
            Salta per ora
          </Button>
        </div>
      </div>
    </div>
  )
}
