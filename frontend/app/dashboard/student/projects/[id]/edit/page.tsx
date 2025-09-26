'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ProjectForm } from '@/components/forms/project/ProjectForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Save, 
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react'

export default function EditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    fetchProject()
  }, [params.id])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const fetchProject = async () => {
    try {
      setLoading(true)
      // Mock project data - in real app, fetch from API
      const mockProject = {
        id: params.id,
        title: "AI-Powered Task Management System",
        description: "A comprehensive task management application built with React, Node.js, and OpenAI GPT-4. Features include intelligent task categorization, priority suggestions, and automated deadline estimates based on project complexity.",
        category: "web-development",
        technologies: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "OpenAI API", "Tailwind CSS", "Docker"],
        repositoryUrl: "https://github.com/username/ai-task-manager",
        liveUrl: "https://ai-task-manager.vercel.app",
        tags: ["productivity", "ai", "automation", "real-time"],
        isPublic: true,
        collaborators: ["john.doe@university.edu", "jane.smith@university.edu"],
        images: [
          "/api/placeholder/800/600",
          "/api/placeholder/800/600"
        ]
      }
      setProject(mockProject)
    } catch (error) {
      console.error('Failed to fetch project:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProjectUpdate = async (projectData: any) => {
    setIsSubmitting(true)
    setSaveStatus('saving')
    
    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      if (response.ok) {
        setSaveStatus('saved')
        setHasUnsavedChanges(false)
        
        // Show success message briefly, then redirect
        setTimeout(() => {
          router.push(`/dashboard/student/projects/${params.id}`)
        }, 2000)
      } else {
        throw new Error('Failed to update project')
      }
    } catch (error) {
      console.error('Project update error:', error)
      setSaveStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const regenerateAnalysis = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}/analyze`, {
        method: 'POST',
      })
      
      if (response.ok) {
        alert('AI analysis has been queued for regeneration. You will be notified when it\'s complete.')
      }
    } catch (error) {
      console.error('Failed to regenerate analysis:', error)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-6">
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
        <p className="text-gray-600 mb-6">The project you're trying to edit doesn't exist or you don't have permission to edit it.</p>
        <Button asChild>
          <Link href="/dashboard/student/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>
    )
  }

  if (saveStatus === 'saved') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Project Updated Successfully! 🎉
            </h1>
            <p className="text-gray-600 mb-6">
              Your changes have been saved and the project has been updated. 
              You'll be redirected to the project page shortly.
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-8">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Updating project analysis...</span>
            </div>

            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href={`/dashboard/student/projects/${params.id}`}>
                  View Project
                </Link>
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/student/projects/${params.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Project
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
            <p className="text-gray-600 mt-1">
              Update your project information and regenerate AI analysis
            </p>
          </div>
        </div>
        
        {/* Save Status */}
        {saveStatus !== 'idle' && (
          <div className="flex items-center space-x-2">
            {saveStatus === 'saving' && (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600">Saving...</span>
              </>
            )}
            {saveStatus === 'error' && (
              <span className="text-sm text-red-600">Save failed</span>
            )}
          </div>
        )}
      </div>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have unsaved changes. Make sure to save your work before leaving this page.
          </AlertDescription>
        </Alert>
      )}

      {/* AI Analysis Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <RefreshCw className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">AI Analysis Update</h3>
              <p className="text-sm text-gray-600 mb-4">
                When you save changes to your project, our AI system will automatically regenerate 
                the analysis, innovation score, skill identification, and job matches based on your 
                updated information.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={regenerateAnalysis}
                className="bg-white"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate Analysis Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>
            Update your project details below. All changes will trigger a new AI analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm 
            onSubmit={handleProjectUpdate}
            isSubmitting={isSubmitting}
            onStepChange={setCurrentStep}
            currentStep={currentStep}
            initialData={project}
          />
        </CardContent>
      </Card>

      {/* Tips for Better Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Tips for Better Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Project Description</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Include specific problems you solved</li>
                <li>• Mention measurable outcomes or results</li>
                <li>• Describe unique features or innovations</li>
                <li>• Explain your development process</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Technical Details</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• List all technologies and frameworks used</li>
                <li>• Include deployment and hosting platforms</li>
                <li>• Mention any APIs or integrations</li>
                <li>• Add testing frameworks and tools</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Documentation</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Ensure your repository has a clear README</li>
                <li>• Include setup and installation instructions</li>
                <li>• Add code comments for complex sections</li>
                <li>• Document any architectural decisions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Showcase Elements</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Upload high-quality screenshots</li>
                <li>• Show different features and use cases</li>
                <li>• Include mobile views if responsive</li>
                <li>• Consider adding demo videos</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History and Versions */}
      <Card>
        <CardHeader>
          <CardTitle>Project History</CardTitle>
          <CardDescription>
            Track changes and analysis updates over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Current Version</p>
                <p className="text-sm text-gray-500">Last updated today at 2:30 PM</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Previous Version</p>
                <p className="text-sm text-gray-500">Updated 3 days ago - Innovation Score: 82</p>
              </div>
              <Button variant="outline" size="sm">
                View Diff
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Initial Version</p>
                <p className="text-sm text-gray-500">Created 1 week ago - Innovation Score: 75</p>
              </div>
              <Button variant="outline" size="sm">
                View Original
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}