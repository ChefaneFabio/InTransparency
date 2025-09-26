'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle,
  AlertCircle,
  Search,
  School,
  Globe,
  Shield,
  Database,
  Loader2,
  ExternalLink,
  BookOpen,
  GraduationCap,
  MapPin,
  Calendar,
  Users,
  Award
} from 'lucide-react'

interface University {
  id: string
  name: string
  fullName: string
  country: string
  city: string
  website: string
  domain: string
  logoUrl?: string
  isConnected: boolean
  hasDirectIntegration: boolean
  studentCount: number
  establishedYear: number
  ranking?: {
    national: number
    global: number
  }
  departments: string[]
  apiStatus: 'active' | 'maintenance' | 'limited'
}

interface Student {
  studentId: string
  firstName: string
  lastName: string
  email: string
  major: string
  year: number
  gpa: number
  enrollmentDate: string
  status: 'active' | 'graduated' | 'suspended'
  courses: Array<{
    courseCode: string
    courseName: string
    credits: number
    grade: string
    semester: string
    year: number
  }>
}

interface InstitutionalVerificationProps {
  onVerificationComplete?: (universityData: University, studentData: Student) => void
  userEmail?: string
}

export function InstitutionalVerification({
  onVerificationComplete,
  userEmail
}: InstitutionalVerificationProps) {
  const [step, setStep] = useState<'search' | 'select' | 'verify' | 'complete'>('search')
  const [searchQuery, setSearchQuery] = useState('')
  const [universities, setUniversities] = useState<University[]>([])
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null)
  const [verificationData, setVerificationData] = useState({
    studentId: '',
    password: '',
    useEmailVerification: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [verificationProgress, setVerificationProgress] = useState(0)
  const [verifiedStudent, setVerifiedStudent] = useState<Student | null>(null)

  useEffect(() => {
    // Auto-detect university from email domain
    if (userEmail) {
      const domain = userEmail.split('@')[1]
      searchUniversitiesByDomain(domain)
    }
  }, [userEmail])

  const searchUniversitiesByDomain = async (domain: string) => {
    setLoading(true)

    // Mock university data with database integration status
    const mockUniversities: University[] = [
      {
        id: 'bocconi',
        name: 'Bocconi',
        fullName: 'Università Commerciale Luigi Bocconi',
        country: 'Italy',
        city: 'Milano',
        website: 'https://www.unibocconi.it',
        domain: 'unibocconi.it',
        logoUrl: '/api/placeholder/60/60',
        isConnected: true,
        hasDirectIntegration: true,
        studentCount: 14000,
        establishedYear: 1902,
        ranking: { national: 1, global: 7 },
        departments: ['Economics', 'Management', 'Finance', 'Data Science', 'Law'],
        apiStatus: 'active'
      },
      {
        id: 'polimi',
        name: 'Politecnico Milano',
        fullName: 'Politecnico di Milano',
        country: 'Italy',
        city: 'Milano',
        website: 'https://www.polimi.it',
        domain: 'polimi.it',
        logoUrl: '/api/placeholder/60/60',
        isConnected: true,
        hasDirectIntegration: true,
        studentCount: 47000,
        establishedYear: 1863,
        ranking: { national: 1, global: 20 },
        departments: ['Engineering', 'Architecture', 'Design', 'Computer Science'],
        apiStatus: 'active'
      },
      {
        id: 'unimi',
        name: 'Statale Milano',
        fullName: 'Università Statale di Milano',
        country: 'Italy',
        city: 'Milano',
        website: 'https://www.unimi.it',
        domain: 'unimi.it',
        logoUrl: '/api/placeholder/60/60',
        isConnected: true,
        hasDirectIntegration: false,
        studentCount: 64000,
        establishedYear: 1924,
        ranking: { national: 4, global: 150 },
        departments: ['Medicine', 'Sciences', 'Humanities', 'Law', 'Agriculture'],
        apiStatus: 'limited'
      },
      {
        id: 'sapienza',
        name: 'Sapienza',
        fullName: 'Sapienza Università di Roma',
        country: 'Italy',
        city: 'Roma',
        website: 'https://www.uniroma1.it',
        domain: 'uniroma1.it',
        logoUrl: '/api/placeholder/60/60',
        isConnected: true,
        hasDirectIntegration: true,
        studentCount: 115000,
        establishedYear: 1303,
        ranking: { national: 2, global: 100 },
        departments: ['All Majors Available'],
        apiStatus: 'active'
      }
    ]

    // Filter by domain or search query
    let filtered = mockUniversities
    if (domain) {
      filtered = mockUniversities.filter(uni =>
        uni.domain.includes(domain) || domain.includes(uni.domain)
      )
    }
    if (searchQuery) {
      filtered = mockUniversities.filter(uni =>
        uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setTimeout(() => {
      setUniversities(filtered)
      setLoading(false)
      if (filtered.length === 1) {
        setSelectedUniversity(filtered[0])
        setStep('verify')
      } else if (filtered.length > 0) {
        setStep('select')
      }
    }, 1000)
  }

  const searchUniversities = () => {
    searchUniversitiesByDomain('')
  }

  const selectUniversity = (university: University) => {
    setSelectedUniversity(university)
    setStep('verify')
  }

  const verifyStudent = async () => {
    if (!selectedUniversity) return

    setLoading(true)
    setError('')
    setVerificationProgress(0)

    try {
      // Simulate verification steps
      const steps = [
        'Connecting to university database...',
        'Verifying student credentials...',
        'Fetching academic records...',
        'Importing course data...',
        'Finalizing verification...'
      ]

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800))
        setVerificationProgress(((i + 1) / steps.length) * 100)
      }

      // Mock verified student data
      const mockStudent: Student = {
        studentId: verificationData.studentId || 'STU123456',
        firstName: 'Marco',
        lastName: 'Rossi',
        email: userEmail || 'marco.rossi@unibocconi.it',
        major: 'Computer Science',
        year: 3,
        gpa: 28.5,
        enrollmentDate: '2022-09-01',
        status: 'active',
        courses: [
          {
            courseCode: 'CS101',
            courseName: 'Introduction to Programming',
            credits: 6,
            grade: '30',
            semester: 'Fall',
            year: 2022
          },
          {
            courseCode: 'MATH201',
            courseName: 'Linear Algebra',
            credits: 6,
            grade: '29',
            semester: 'Spring',
            year: 2023
          },
          {
            courseCode: 'CS301',
            courseName: 'Machine Learning',
            credits: 8,
            grade: '30L',
            semester: 'Fall',
            year: 2024
          }
        ]
      }

      setVerifiedStudent(mockStudent)
      setStep('complete')
      onVerificationComplete?.(selectedUniversity, mockStudent)

    } catch (error) {
      setError('Verification failed. Please check your credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  const getApiStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'maintenance': return 'text-yellow-600 bg-yellow-100'
      case 'limited': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getApiStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Full Integration'
      case 'maintenance': return 'Maintenance Mode'
      case 'limited': return 'Limited Access'
      default: return 'No Integration'
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Institutional Verification
        </CardTitle>
        <CardDescription>
          Connect with your university's database to verify your academic credentials and import your transcripts
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'search' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Database Integration</span>
              </div>
              <p className="text-sm text-blue-800">
                InTransparency connects with universities worldwide. We'll help verify your
                academic credentials and showcase your achievements.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="university-search">Search Your University</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="university-search"
                    placeholder="Enter university name or city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={searchUniversities} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Search
                </Button>
              </div>
            </div>

            {userEmail && (
              <Alert>
                <School className="h-4 w-4" />
                <AlertDescription>
                  We detected you're using an email from a university domain. We'll automatically search for your institution.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {step === 'select' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Select Your University</h3>
              <Badge variant="outline">{universities.length} institutions found</Badge>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {(universities || []).map((university) => (
                <Card
                  key={university.id}
                  className="cursor-pointer hover:shadow-md transition-shadow border"
                  onClick={() => selectUniversity(university)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {university.logoUrl ? (
                          <img src={university.logoUrl} alt={university.name} className="w-10 h-10 object-contain" />
                        ) : (
                          <School className="h-6 w-6 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 truncate">{university.fullName}</h4>
                          {university.hasDirectIntegration && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {university.city}, {university.country}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {university.studentCount.toLocaleString()} students
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Est. {university.establishedYear}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getApiStatusColor(university.apiStatus)}>
                            {getApiStatusText(university.apiStatus)}
                          </Badge>
                          {university.ranking && (
                            <Badge variant="outline" className="text-purple-600 bg-purple-100">
                              #{university.ranking.national} National
                            </Badge>
                          )}
                          <Button variant="ghost" size="sm" asChild>
                            <a href={university.website} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Website
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 'verify' && selectedUniversity && (
          <div className="space-y-6">
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  {selectedUniversity.logoUrl ? (
                    <img src={selectedUniversity.logoUrl} alt={selectedUniversity.name} className="w-10 h-10 object-contain" />
                  ) : (
                    <School className="h-6 w-6 text-gray-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedUniversity.fullName}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Badge variant="outline" className={getApiStatusColor(selectedUniversity.apiStatus)}>
                      {getApiStatusText(selectedUniversity.apiStatus)}
                    </Badge>
                    <span>Direct database integration available</span>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student-id">Student ID</Label>
                <Input
                  id="student-id"
                  placeholder="Enter your student ID"
                  value={verificationData.studentId}
                  onChange={(e) => setVerificationData(prev => ({ ...prev, studentId: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">University Portal Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your university portal password"
                  value={verificationData.password}
                  onChange={(e) => setVerificationData(prev => ({ ...prev, password: e.target.value }))}
                />
                <p className="text-xs text-gray-600">
                  Your credentials are encrypted and only used for one-time verification
                </p>
              </div>
            </div>

            {loading && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Verifying with university database...</span>
                </div>
                <Progress value={verificationProgress} className="w-full" />
                <p className="text-xs text-gray-600">{verificationProgress.toFixed(0)}% complete</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('select')}>
                Back
              </Button>
              <Button
                onClick={verifyStudent}
                disabled={!verificationData.studentId || !verificationData.password || loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Verify & Import Records
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'complete' && verifiedStudent && selectedUniversity && (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verification Successful!</h3>
              <p className="text-gray-600">
                Your academic credentials have been verified and your transcripts imported.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-3">Imported Data Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-700 font-medium">Student ID:</span>
                  <span className="ml-2 text-green-800">{verifiedStudent.studentId}</span>
                </div>
                <div>
                  <span className="text-green-700 font-medium">Major:</span>
                  <span className="ml-2 text-green-800">{verifiedStudent.major}</span>
                </div>
                <div>
                  <span className="text-green-700 font-medium">Year:</span>
                  <span className="ml-2 text-green-800">{verifiedStudent.year}</span>
                </div>
                <div>
                  <span className="text-green-700 font-medium">GPA:</span>
                  <span className="ml-2 text-green-800">{verifiedStudent.gpa}/30</span>
                </div>
                <div>
                  <span className="text-green-700 font-medium">Courses:</span>
                  <span className="ml-2 text-green-800">{verifiedStudent.courses.length} imported</span>
                </div>
                <div>
                  <span className="text-green-700 font-medium">Status:</span>
                  <span className="ml-2 text-green-800 capitalize">{verifiedStudent.status}</span>
                </div>
              </div>
            </div>

            <Alert>
              <Award className="h-4 w-4" />
              <AlertDescription>
                Your verified academic profile will be visible to recruiters with the
                <Badge variant="outline" className="mx-1 text-green-600 bg-green-100">Verified</Badge>
                badge, increasing your credibility and match rates.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  )
}