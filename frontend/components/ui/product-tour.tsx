'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  X,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  MousePointer,
  Sparkles,
  Target,
  CheckCircle
} from 'lucide-react'

interface TourStep {
  id: number
  title: string
  description: string
  target: string
  position: 'top' | 'bottom' | 'left' | 'right'
  highlight: boolean
  action?: {
    type: 'click' | 'hover' | 'focus'
    element: string
  }
}

interface ProductTourProps {
  isOpen: boolean
  onClose: () => void
  steps: TourStep[]
  autoPlay?: boolean
}

export function ProductTour({ isOpen, onClose, steps, autoPlay = false }: ProductTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const intervalRef = useRef<NodeJS.Timeout>()

  const step = steps[currentStep]

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || !isOpen) return

    intervalRef.current = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = prev + 1
        if (nextStep >= steps.length) {
          setIsPlaying(false)
          return prev
        }
        return nextStep
      })
    }, 3000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, isOpen, steps.length])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => [...prev, currentStep])
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex)
    setIsPlaying(false)
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setCompletedSteps([])
    setIsPlaying(true)
  }

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  if (!isOpen || !step) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      {/* Tour Overlay */}
      <div className="absolute inset-0">
        {/* Highlight Effect */}
        {step.highlight && (
          <div className="absolute inset-0">
            <div
              className="absolute bg-blue-500/20 border-2 border-blue-500 rounded-lg animate-pulse"
              style={{
                // Positioning would be calculated based on step.target in real implementation
                top: '20%',
                left: '30%',
                width: '300px',
                height: '200px'
              }}
            />
          </div>
        )}
      </div>

      {/* Tour Card */}
      <Card className="absolute z-10 w-96 shadow-2xl border-0 bg-white/95 backdrop-blur-sm"
        style={{
          // Position based on step.position - simplified for demo
          top: step.position === 'top' ? '10%' : step.position === 'bottom' ? '70%' : '40%',
          left: step.position === 'left' ? '5%' : step.position === 'right' ? '60%' : '35%'
        }}
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                Step {currentStep + 1} of {steps.length}
              </Badge>
              <Sparkles className="h-4 w-4 text-blue-500" />
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <Target className="h-5 w-5 text-blue-500 mr-2" />
              {step.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Action Hint */}
          {step.action && (
            <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center text-sm text-blue-700">
                <MousePointer className="h-4 w-4 mr-2" />
                <span className="capitalize">{step.action.type}</span> on {step.action.element}
              </div>
            </div>
          )}

          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
              <span>Progress</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center space-x-2 mb-6">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => handleStepClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-blue-500 scale-125'
                    : completedSteps.includes(index)
                    ? 'bg-green-500'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTogglePlay}
                disabled={currentStep === steps.length - 1}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={handleRestart}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button size="sm" onClick={handleNext}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button size="sm" onClick={onClose} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Complete
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Celebration */}
      {currentStep === steps.length - 1 && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Tour Complete!</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Predefined tour configurations
export const defaultTours = {
  dashboard: [
    {
      id: 1,
      title: 'Welcome to Your Dashboard',
      description: 'This is your central hub where you can see all your projects, applications, and important updates.',
      target: '.dashboard-overview',
      position: 'bottom' as const,
      highlight: true
    },
    {
      id: 2,
      title: 'Upload Your Projects',
      description: 'Click here to upload your academic projects, code repositories, and documentation.',
      target: '.upload-button',
      position: 'bottom' as const,
      highlight: true,
      action: { type: 'click' as const, element: 'Upload button' }
    },
    {
      id: 3,
      title: 'View Your Profile',
      description: 'Your AI-enhanced profile showcases your skills and projects to potential employers.',
      target: '.profile-link',
      position: 'left' as const,
      highlight: true
    },
    {
      id: 4,
      title: 'Check Applications',
      description: 'Monitor your job applications and see which companies have viewed your profile.',
      target: '.applications-section',
      position: 'top' as const,
      highlight: true
    }
  ],

  profile: [
    {
      id: 1,
      title: 'Your AI-Enhanced Profile',
      description: 'This is how employers see you. Our AI has analyzed your projects and created compelling descriptions.',
      target: '.profile-header',
      position: 'bottom' as const,
      highlight: true
    },
    {
      id: 2,
      title: 'Project Showcase',
      description: 'Your projects are presented with AI-generated professional summaries and skill analysis.',
      target: '.projects-section',
      position: 'top' as const,
      highlight: true
    },
    {
      id: 3,
      title: 'Skills Verification',
      description: 'These skills were automatically detected from your project code and documentation.',
      target: '.skills-section',
      position: 'left' as const,
      highlight: true
    }
  ],

  recruiter: [
    {
      id: 1,
      title: 'Candidate Discovery',
      description: 'Search for candidates based on real projects and verified skills, not just keywords.',
      target: '.search-candidates',
      position: 'bottom' as const,
      highlight: true
    },
    {
      id: 2,
      title: 'Project-Based Assessment',
      description: 'See actual code and projects instead of just resumes. Make better hiring decisions.',
      target: '.candidate-projects',
      position: 'top' as const,
      highlight: true
    },
    {
      id: 3,
      title: 'Direct Communication',
      description: 'Connect directly with candidates and manage your hiring pipeline efficiently.',
      target: '.messaging-center',
      position: 'left' as const,
      highlight: true
    }
  ]
}