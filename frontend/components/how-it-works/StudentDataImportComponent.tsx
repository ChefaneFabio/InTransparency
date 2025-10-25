'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Database,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
  User,
  GraduationCap,
  Award,
  Code,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Star,
  Link,
  Loader,
  RefreshCw,
  Eye,
  Settings,
  Lock,
  Unlock,
  Globe
} from 'lucide-react'

interface UniversityProfile {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    dateOfBirth: string
  }
  academic: {
    university: string
    degree: string
    major: string
    gpa: number
    graduationDate: string
    semester: string
    studentId: string
  }
  courses: {
    name: string
    code: string
    credits: number
    grade: string
    semester: string
  }[]
  projects: {
    title: string
    description: string
    technologies: string[]
    startDate: string
    endDate: string
    status: string
  }[]
  skills: {
    name: string
    level: string
    category: string
    verified: boolean
  }[]
  achievements: {
    title: string
    issuer: string
    date: string
    description: string
  }[]
}

const mockUniversityData: UniversityProfile = {
  personalInfo: {
    firstName: 'Marco',
    lastName: 'Rossi',
    email: 'marco.rossi@polimi.it',
    phone: '+39 02 1234 5678',
    address: 'Via Leonardo da Vinci 32, 20133 Milano, Italia',
    dateOfBirth: '2001-03-15'
  },
  academic: {
    university: 'Politecnico di Milano',
    degree: 'Laurea Magistrale',
    major: 'Ingegneria Informatica',
    gpa: 28.5,
    graduationDate: '2024-07-15',
    semester: 'Secondo Semestre 2024',
    studentId: 'S123456'
  },
  courses: [
    { name: 'Algoritmi e Strutture Dati', code: 'INFO-01', credits: 10, grade: '30/30', semester: '1° Sem 2023' },
    { name: 'Machine Learning', code: 'INFO-ML', credits: 8, grade: '28/30', semester: '2° Sem 2023' },
    { name: 'Basi di Dati', code: 'INFO-02', credits: 8, grade: '27/30', semester: '1° Sem 2023' },
    { name: 'Ingegneria del Software', code: 'INFO-SE', credits: 10, grade: '30/30 e Lode', semester: '1° Sem 2022' }
  ],
  projects: [
    {
      title: 'AI-Powered Job Matching Platform',
      description: 'Built a machine learning platform that matches students with internship opportunities based on skills and preferences.',
      technologies: ['Python', 'TensorFlow', 'React', 'Node.js', 'PostgreSQL'],
      startDate: '2023-09-01',
      endDate: '2023-12-15',
      status: 'Completed'
    },
    {
      title: 'Blockchain Voting System',
      description: 'Developed a secure voting application using blockchain technology for student government elections.',
      technologies: ['Solidity', 'Web3.js', 'React', 'Ethereum', 'IPFS'],
      startDate: '2023-01-15',
      endDate: '2023-05-30',
      status: 'Completed'
    }
  ],
  skills: [
    { name: 'Python', level: 'Advanced', category: 'Programming', verified: true },
    { name: 'JavaScript', level: 'Advanced', category: 'Programming', verified: true },
    { name: 'React', level: 'Intermediate', category: 'Frontend', verified: true },
    { name: 'Machine Learning', level: 'Intermediate', category: 'AI/ML', verified: true },
    { name: 'SQL', level: 'Intermediate', category: 'Database', verified: false }
  ],
  achievements: [
    {
      title: 'Borsa di Studio per Merito',
      issuer: 'Politecnico di Milano',
      date: '2023-12-15',
      description: 'Scholarship awarded for academic excellence with average grade above 28/30'
    },
    {
      title: 'Miglior Progetto - Machine Learning',
      issuer: 'Dipartimento di Informatica',
      date: '2023-06-10',
      description: 'Best machine learning project award for predictive analytics application'
    }
  ]
}

const supportedUniversities = [
  { name: 'Politecnico di Milano', logo: '🏛️', status: 'active' },
  { name: 'Università di Bologna', logo: '📚', status: 'active' },
  { name: 'Sapienza Università di Roma', logo: '🎓', status: 'active' },
  { name: 'Università degli Studi di Milano', logo: '🏫', status: 'coming_soon' },
  { name: 'Politecnico di Torino', logo: '⚙️', status: 'active' },
  { name: 'Università di Padova', logo: '🇮🇹', status: 'coming_soon' }
]

export function StudentDataImportComponent() {
  const [importStep, setImportStep] = useState<'select' | 'connect' | 'preview' | 'import' | 'complete'>('select')
  const [selectedUniversity, setSelectedUniversity] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [importedData, setImportedData] = useState<UniversityProfile | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected')

  const handleUniversitySelect = (universityName: string) => {
    setSelectedUniversity(universityName)
    setImportStep('connect')
  }

  const simulateConnection = async () => {
    setConnectionStatus('connecting')
    setIsLoading(true)

    // Simulate API connection delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    setConnectionStatus('connected')
    setIsLoading(false)
    setImportStep('preview')
    setImportedData(mockUniversityData)
  }

  const handleImportData = async () => {
    setImportStep('import')
    setIsLoading(true)

    // Simulate import process
    await new Promise(resolve => setTimeout(resolve, 3000))

    setIsLoading(false)
    setImportStep('complete')
  }

  const resetDemo = () => {
    setImportStep('select')
    setSelectedUniversity('')
    setImportedData(null)
    setConnectionStatus('disconnected')
    setIsLoading(false)
  }

  const renderSelectUniversity = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="h-5 w-5 mr-2" />
          Select Your University
        </CardTitle>
        <p className="text-gray-600">Choose your university to import your academic profile data</p>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {supportedUniversities.map((uni) => (
            <button
              key={uni.name}
              onClick={() => uni.status === 'active' ? handleUniversitySelect(uni.name) : null}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                uni.status === 'active'
                  ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  : 'border-gray-100 bg-gray-50 cursor-not-allowed'
              }`}
              disabled={uni.status !== 'active'}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{uni.logo}</span>
                  <span className="font-medium text-gray-900">{uni.name}</span>
                </div>
                {uni.status === 'active' ? (
                  <Badge className="bg-green-100 text-green-700">Available</Badge>
                ) : (
                  <Badge variant="secondary">Coming Soon</Badge>
                )}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  const renderConnection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Connect to {selectedUniversity}
        </CardTitle>
        <p className="text-gray-600">Securely connect to your university's student information system</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Secure Connection</h4>
              <p className="text-sm text-blue-700 mt-1">
                Your credentials are encrypted and never stored. We only access the data you authorize.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
            <input
              type="text"
              placeholder="Enter your student ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">University Password</label>
            <input
              type="password"
              placeholder="Enter your university portal password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span>Two-factor authentication supported</span>
        </div>

        <div className="flex space-x-3">
          <Button onClick={simulateConnection} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
            {isLoading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Connect Securely
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => setImportStep('select')}>
            Back
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderPreview = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Preview Your Data
          </CardTitle>
          <p className="text-gray-600">Review the information we found in your university profile</p>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-medium text-green-900">Connection Successful</h4>
                <p className="text-sm text-green-700">Found complete profile data for {importedData?.personalInfo.firstName} {importedData?.personalInfo.lastName}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Personal Information
              </h4>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-600">Name:</span> {importedData?.personalInfo.firstName} {importedData?.personalInfo.lastName}</div>
                <div><span className="text-gray-600">Email:</span> {importedData?.personalInfo.email}</div>
                <div><span className="text-gray-600">Phone:</span> {importedData?.personalInfo.phone}</div>
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <GraduationCap className="h-4 w-4 mr-2" />
                Academic Information
              </h4>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-600">Degree:</span> {importedData?.academic.degree}</div>
                <div><span className="text-gray-600">Major:</span> {importedData?.academic.major}</div>
                <div><span className="text-gray-600">GPA:</span> {importedData?.academic.gpa}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Courses ({importedData?.courses?.length || 0})
                </h4>
                <div className="space-y-2">
                  {importedData?.courses?.slice(0, 3).map((course, index) => (
                    <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                      <div className="font-medium">{course.name}</div>
                      <div className="text-gray-600">{course.code} - Grade: {course.grade}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Code className="h-4 w-4 mr-2" />
                  Skills ({importedData?.skills?.length || 0})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {importedData?.skills?.slice(0, 6).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill.name}
                      {skill.verified && <CheckCircle className="h-3 w-3 ml-1 text-green-600" />}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <Button onClick={handleImportData} className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Import This Data
            </Button>
            <Button variant="outline" onClick={() => setImportStep('connect')}>
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderImporting = () => (
    <Card>
      <CardContent className="py-12 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Importing Your Data</h3>
        <p className="text-gray-600 mb-6">Creating your profile and CV from university data...</p>
        <div className="space-y-2 max-w-md mx-auto">
          <div className="flex justify-between text-sm">
            <span>Personal information</span>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          <div className="flex justify-between text-sm">
            <span>Academic records</span>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          <div className="flex justify-between text-sm">
            <span>Course history</span>
            <Loader className="h-4 w-4 animate-spin text-blue-600" />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Projects & achievements</span>
            <div className="h-4 w-4 border border-gray-300 rounded"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderComplete = () => (
    <Card>
      <CardContent className="py-12 text-center">
        <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Import Complete!</h3>
        <p className="text-gray-600 mb-6">Your profile has been created successfully with all your university data.</p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
          <h4 className="font-medium text-blue-900 mb-2">What was imported:</h4>
          <div className="space-y-1 text-sm text-blue-800">
            <div>✓ Personal & contact information</div>
            <div>✓ Academic records & GPA</div>
            <div>✓ {importedData?.courses.length} courses with grades</div>
            <div>✓ {importedData?.projects.length} projects with details</div>
            <div>✓ {importedData?.skills.length} verified skills</div>
            <div>✓ {importedData?.achievements.length} achievements & awards</div>
          </div>
        </div>

        <div className="flex justify-center space-x-3">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Eye className="h-4 w-4 mr-2" />
            View My Profile
          </Button>
          <Button variant="outline" onClick={resetDemo}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Student Data Import Demo</h3>
        <p className="text-gray-600">
          See how easy it is to create your complete profile by importing data from your university
        </p>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-6">
          <div className="flex space-x-8">
            {[
              { key: 'select', label: 'Select', icon: Globe },
              { key: 'connect', label: 'Connect', icon: Database },
              { key: 'preview', label: 'Preview', icon: Eye },
              { key: 'import', label: 'Import', icon: Download },
              { key: 'complete', label: 'Complete', icon: CheckCircle }
            ].map((step, index) => {
              const Icon = step.icon
              const isActive = step.key === importStep
              const isCompleted = ['select', 'connect', 'preview', 'import'].indexOf(importStep) > index

              return (
                <div key={step.key} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    isActive ? 'bg-blue-600 text-white' :
                    isCompleted ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={`ml-2 text-sm ${isActive ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {importStep === 'select' && renderSelectUniversity()}
      {importStep === 'connect' && renderConnection()}
      {importStep === 'preview' && renderPreview()}
      {importStep === 'import' && renderImporting()}
      {importStep === 'complete' && renderComplete()}
    </div>
  )
}