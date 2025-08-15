'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProjectForm } from '@/components/forms/project/ProjectForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Steps, Step } from '@/components/ui/steps'
import { 
  ArrowLeft, 
  Upload, 
  Brain, 
  Trophy, 
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

export default function NewProjectPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const steps = [
    {
      title: 'Project Details',
      description: 'Basic information about your project',
      icon: Upload
    },
    {
      title: 'Technologies & Files', 
      description: 'Tech stack and project files',
      icon: Brain
    },
    {
      title: 'Review & Submit',
      description: 'Review and publish your project',
      icon: Trophy
    }
  ]

  const handleProjectSubmit = async (projectData: any) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      if (response.ok) {
        const result = await response.json()
        setSubmitStatus('success')
        
        // Redirect to project page after a short delay
        setTimeout(() => {
          router.push(`/dashboard/student/projects/${result.project.id}`)
        }, 2000)
      } else {
        throw new Error('Failed to create project')
      }
    } catch (error) {
      console.error('Project submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitStatus === 'success') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Project Created Successfully! 🎉
            </h1>
            <p className="text-gray-600 mb-6">
              Your project has been uploaded and is now being analyzed by our AI system. 
              You'll be redirected to your project page shortly.
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-8">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Analyzing your project...</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Project uploaded successfully</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span>AI analysis in progress</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-500">
                <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>
                <span>Generating insights and recommendations</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-500">
                <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>
                <span>Finding relevant job matches</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (submitStatus === 'error') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-8">
              We couldn't create your project. Please try again or contact support if the problem persists.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => setSubmitStatus('idle')}>
                Try Again
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/student/projects">
                  Back to Projects
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/student/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
          <p className="text-gray-600 mt-1">
            Upload your project to get AI-powered analysis and find opportunities
          </p>
        </div>
      </div>

      {/* Benefits Banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">What happens after you upload?</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">AI Analysis</div>
                <div className="text-xs text-gray-600">Get detailed insights on complexity, innovation, and skills demonstrated</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Trophy className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Professional Story</div>
                <div className="text-xs text-gray-600">Generate compelling narratives for recruiters and applications</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Job Matching</div>
                <div className="text-xs text-gray-600">Find relevant opportunities based on your demonstrated skills</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Progress</CardTitle>
          <CardDescription>
            Follow these steps to create your project showcase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Steps currentStep={currentStep}>
            {steps.map((step, index) => (
              <Step
                key={index}
                title={step.title}
                description={step.description}
                icon={step.icon}
                isActive={index === currentStep}
                isCompleted={index < currentStep}
              />
            ))}
          </Steps>
        </CardContent>
      </Card>

      {/* Project Form */}
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>
            Tell us about your project so we can provide the best analysis and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm 
            onSubmit={handleProjectSubmit}
            isSubmitting={isSubmitting}
            onStepChange={setCurrentStep}
            currentStep={currentStep}
          />
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Tips for Better Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Project Description</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Explain the problem you solved</li>
                <li>• Mention key challenges faced</li>
                <li>• Highlight innovative solutions</li>
                <li>• Include impact or results</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Technical Details</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• List all technologies used</li>
                <li>• Include both frontend and backend</li>
                <li>• Mention databases and tools</li>
                <li>• Add any special integrations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Repository & Demo</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Provide clean, commented code</li>
                <li>• Include comprehensive README</li>
                <li>• Add live demo if possible</li>
                <li>• Document setup instructions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Visuals & Media</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Upload high-quality screenshots</li>
                <li>• Show different features/pages</li>
                <li>• Include mobile views if responsive</li>
                <li>• Consider adding demo videos</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}