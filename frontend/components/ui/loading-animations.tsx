'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Brain,
  Code,
  Sparkles,
  Target,
  FileText,
  Zap,
  CheckCircle,
  Upload,
  Search,
  MessageSquare
} from 'lucide-react'

interface LoadingAnimationProps {
  type?: 'upload' | 'analysis' | 'generation' | 'matching' | 'processing'
  message?: string
  progress?: number
  steps?: string[]
  duration?: number
  onComplete?: () => void
  className?: string
}

export function LoadingAnimation({
  type = 'processing',
  message,
  progress,
  steps = [],
  duration = 3000,
  onComplete,
  className = ""
}: LoadingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const animations = {
    upload: {
      icon: Upload,
      color: 'from-blue-500 to-blue-600',
      defaultMessage: 'Uploading your projects...',
      defaultSteps: [
        'Scanning files...',
        'Analyzing structure...',
        'Extracting metadata...',
        'Organizing content...',
        'Finalizing upload...'
      ]
    },
    analysis: {
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      defaultMessage: 'AI analyzing your code...',
      defaultSteps: [
        'Reading code structure...',
        'Evaluating complexity...',
        'Identifying patterns...',
        'Scoring innovation...',
        'Generating insights...'
      ]
    },
    generation: {
      icon: FileText,
      color: 'from-green-500 to-green-600',
      defaultMessage: 'Generating professional story...',
      defaultSteps: [
        'Understanding context...',
        'Crafting narrative...',
        'Optimizing keywords...',
        'Enhancing readability...',
        'Finalizing content...'
      ]
    },
    matching: {
      icon: Target,
      color: 'from-orange-500 to-orange-600',
      defaultMessage: 'Finding perfect matches...',
      defaultSteps: [
        'Analyzing preferences...',
        'Scanning opportunities...',
        'Calculating compatibility...',
        'Ranking results...',
        'Preparing recommendations...'
      ]
    },
    processing: {
      icon: Zap,
      color: 'from-indigo-500 to-indigo-600',
      defaultMessage: 'Processing request...',
      defaultSteps: [
        'Initializing...',
        'Processing data...',
        'Applying algorithms...',
        'Generating results...',
        'Completing...'
      ]
    }
  }

  const config = animations[type]
  const displaySteps = steps.length > 0 ? steps : config.defaultSteps
  const displayMessage = message || config.defaultMessage

  useEffect(() => {
    const stepDuration = duration / displaySteps.length
    const progressIncrement = 100 / displaySteps.length

    const timer = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = prev + 1
        if (nextStep >= displaySteps.length) {
          setIsComplete(true)
          setAnimatedProgress(100)
          clearInterval(timer)
          setTimeout(() => onComplete?.(), 500)
          return prev
        }
        return nextStep
      })

      setAnimatedProgress(prev => Math.min(prev + progressIncrement, 100))
    }, stepDuration)

    return () => clearInterval(timer)
  }, [duration, displaySteps.length, onComplete])

  const Icon = config.icon

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          {/* Animated Icon */}
          <div className="relative">
            <div className={`w-20 h-20 bg-gradient-to-r ${config.color} rounded-full flex items-center justify-center mx-auto shadow-lg`}>
              <Icon className="h-10 w-10 text-white" />
            </div>

            {/* Spinning Ring */}
            <div className="absolute inset-0 w-20 h-20 mx-auto">
              <div className="w-full h-full rounded-full border-4 border-gray-200"></div>
              <div className={`absolute inset-0 w-full h-full rounded-full border-4 border-transparent border-t-current bg-gradient-to-r ${config.color} bg-clip-border animate-spin`}></div>
            </div>

            {/* Success Indicator */}
            {isComplete && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            )}
          </div>

          {/* Main Message */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isComplete ? 'Complete!' : displayMessage}
            </h3>

            {/* Current Step */}
            <p className="text-sm text-gray-600">
              {isComplete ? 'All done!' : displaySteps[currentStep]}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-700">
              <span>Progress</span>
              <span>{Math.round(progress ?? animatedProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${config.color} transition-all duration-500 ease-out`}
                style={{ width: `${progress ?? animatedProgress}%` }}
              />
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center space-x-2">
            {displaySteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index <= currentStep
                    ? 'bg-current bg-gradient-to-r ' + config.color
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Additional Info */}
          {type === 'analysis' && (
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-700">
              <div className="text-center">
                <div className="font-medium">Files</div>
                <div>{Math.floor(Math.random() * 20) + 5}</div>
              </div>
              <div className="text-center">
                <div className="font-medium">Lines</div>
                <div>{Math.floor(Math.random() * 5000) + 1000}</div>
              </div>
              <div className="text-center">
                <div className="font-medium">Skills</div>
                <div>{Math.floor(Math.random() * 15) + 5}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Skeleton Loading Components
export function SkeletonCard() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </CardContent>
    </Card>
  )
}

export function SkeletonProfile() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function SkeletonList({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="animate-pulse flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Floating Elements Animation
export function FloatingElements() {
  const elements = [
    { icon: Code, delay: 0, x: '10%', y: '20%' },
    { icon: Sparkles, delay: 1000, x: '80%', y: '15%' },
    { icon: Brain, delay: 2000, x: '15%', y: '70%' },
    { icon: Target, delay: 1500, x: '85%', y: '75%' },
    { icon: MessageSquare, delay: 500, x: '50%', y: '10%' },
    { icon: Search, delay: 2500, x: '60%', y: '80%' }
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((element, index) => {
        const Icon = element.icon
        return (
          <div
            key={index}
            className="absolute animate-float"
            style={{
              left: element.x,
              top: element.y,
              animationDelay: `${element.delay}ms`,
              animationDuration: '6s'
            }}
          >
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shadow-lg">
              <Icon className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        )
      })}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(5deg); }
          66% { transform: translateY(-10px) rotate(-5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

// Pulse Animation for CTAs
export function PulseButton({ children, className = "", ...props }: any) {
  return (
    <button
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-75"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 animate-ping opacity-20"></div>
    </button>
  )
}