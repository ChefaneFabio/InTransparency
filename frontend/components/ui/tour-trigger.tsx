'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Play,
  HelpCircle,
  Navigation,
  X,
  Star,
  Clock,
  Users,
  Lightbulb
} from 'lucide-react'
import { useTour } from '@/components/providers/tour-provider'

interface TourOption {
  id: string
  title: string
  description: string
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  icon: any
  recommended?: boolean
}

const tourOptions: TourOption[] = [
  {
    id: 'dashboard',
    title: 'Dashboard Overview',
    description: 'Learn how to navigate your main dashboard and access key features',
    duration: '2 min',
    difficulty: 'Beginner',
    icon: Navigation,
    recommended: true
  },
  {
    id: 'profile',
    title: 'Profile & Projects',
    description: 'Understand how your AI-enhanced profile works and showcases your projects',
    duration: '3 min',
    difficulty: 'Beginner',
    icon: Users
  },
  {
    id: 'recruiter',
    title: 'Recruiter Tools',
    description: 'Discover advanced features for finding and connecting with candidates',
    duration: '4 min',
    difficulty: 'Intermediate',
    icon: Lightbulb
  }
]

interface TourTriggerProps {
  tourId?: string
  variant?: 'button' | 'icon' | 'card'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  autoStart?: boolean
}

export function TourTrigger({
  tourId,
  variant = 'button',
  size = 'md',
  showLabel = true,
  autoStart = false
}: TourTriggerProps) {
  const [showTourSelector, setShowTourSelector] = useState(false)
  const { startTour, shouldShowTour } = useTour()

  const handleStartTour = (id: string) => {
    startTour(id)
    setShowTourSelector(false)
  }

  const handleOpenSelector = () => {
    if (tourId) {
      handleStartTour(tourId)
    } else {
      setShowTourSelector(true)
    }
  }

  // Auto-start tour for new users
  if (autoStart && tourId && shouldShowTour(tourId)) {
    setTimeout(() => handleStartTour(tourId), 1000)
  }

  if (variant === 'icon') {
    return (
      <>
        <Button
          variant="ghost"
          size={size === 'md' ? undefined : size as 'sm' | 'lg'}
          onClick={handleOpenSelector}
          className="relative"
        >
          <HelpCircle className="h-5 w-5" />
          {showLabel && <span className="sr-only">Start Tour</span>}
          {tourId && shouldShowTour(tourId) && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          )}
        </Button>
        {showTourSelector && <TourSelector onSelect={handleStartTour} onClose={() => setShowTourSelector(false)} />}
      </>
    )
  }

  if (variant === 'card') {
    return (
      <>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleOpenSelector}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Play className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Take a Tour</h4>
                <p className="text-sm text-gray-600">Learn how to use the platform</p>
              </div>
              {tourId && shouldShowTour(tourId) && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  New
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
        {showTourSelector && <TourSelector onSelect={handleStartTour} onClose={() => setShowTourSelector(false)} />}
      </>
    )
  }

  return (
    <>
      <Button
        variant="outline"
        size={size === 'md' ? undefined : size as 'sm' | 'lg'}
        onClick={handleOpenSelector}
        className="relative"
      >
        <Play className="h-4 w-4 mr-2" />
        {showLabel && 'Take Tour'}
        {tourId && shouldShowTour(tourId) && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
        )}
      </Button>
      {showTourSelector && <TourSelector onSelect={handleStartTour} onClose={() => setShowTourSelector(false)} />}
    </>
  )
}

function TourSelector({ onSelect, onClose }: { onSelect: (id: string) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Choose Your Tour</h3>
              <p className="text-gray-600">Select a guided tour to learn more about the platform</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4">
            {(tourOptions || []).map((tour) => {
              const Icon = tour.icon
              return (
                <Card
                  key={tour.id}
                  className="cursor-pointer hover:shadow-md transition-all hover:border-blue-300"
                  onClick={() => onSelect(tour.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{tour.title}</h4>
                          {tour.recommended && (
                            <Badge className="bg-yellow-100 text-yellow-800 flex items-center">
                              <Star className="h-3 w-3 mr-1" />
                              Recommended
                            </Badge>
                          )}
                        </div>

                        <p className="text-gray-600 text-sm mb-3">{tour.description}</p>

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {tour.duration}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {tour.difficulty}
                          </Badge>
                        </div>
                      </div>

                      <Button size="sm" className="flex-shrink-0">
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Lightbulb className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h5 className="font-medium text-blue-900">Pro Tip</h5>
                <p className="text-sm text-blue-800">
                  You can restart any tour from the help menu. Tours adapt to your role and show relevant features.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}