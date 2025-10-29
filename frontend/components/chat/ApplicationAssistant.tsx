'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bot, Lightbulb, TrendingUp, CheckCircle, AlertCircle, Sparkles } from 'lucide-react'

interface ApplicationAssistantProps {
  jobId: string
  jobTitle: string
  jobRequirements: string[]
  studentProfile: {
    projects: Array<{ id: string; title: string; skills: string[]; description: string }>
    skills: string[]
    courses: Array<{ name: string; grade: number }>
  }
  currentFormData?: any
  onSuggestionClick?: (suggestion: any) => void
}

interface Suggestion {
  type: string
  title: string
  description: string
  action?: string
  data?: any
}

export function ApplicationAssistant({
  jobId,
  jobTitle,
  jobRequirements,
  studentProfile,
  currentFormData,
  onSuggestionClick
}: ApplicationAssistantProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [activeAssistance, setActiveAssistance] = useState<'project' | 'skill' | 'cover' | 'validate'>('project')

  useEffect(() => {
    // Auto-fetch suggestions when component mounts
    fetchAssistance('project-suggestions')
  }, [])

  const fetchAssistance = async (type: 'project-suggestions' | 'skill-matching' | 'cover-letter-help' | 'form-validation') => {
    setLoading(true)

    try {
      const response = await fetch('/api/applications/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: 'student_123', // Replace with actual auth
          jobId,
          jobRequirements,
          studentProfile,
          currentFormData,
          assistanceType: type
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuggestions(data.assistance.suggestions || [])
      }
    } catch (error) {
      console.error('Error fetching assistance:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssistanceTypeChange = (type: 'project' | 'skill' | 'cover' | 'validate') => {
    setActiveAssistance(type)

    const apiType = {
      'project': 'project-suggestions',
      'skill': 'skill-matching',
      'cover': 'cover-letter-help',
      'validate': 'form-validation'
    }[type] as any

    fetchAssistance(apiType)
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'project-match':
      case 'skill-match':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'skill-gap':
      case 'missing-field':
      case 'insufficient-content':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      default:
        return <Lightbulb className="h-5 w-5 text-blue-600" />
    }
  }

  const getSuggestionColor = (type: string) => {
    if (type.includes('match')) return 'border-green-200 bg-green-50'
    if (type.includes('gap') || type.includes('missing') || type.includes('insufficient')) {
      return 'border-yellow-200 bg-yellow-50'
    }
    return 'border-blue-200 bg-blue-50'
  }

  return (
    <Card className="border-2 border-primary/30 shadow-lg sticky top-4">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-full">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">Smart Application Assistant</CardTitle>
            <p className="text-sm text-gray-600">AI-powered guidance based on your verified profile</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Assistance Type Selector */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={activeAssistance === 'project' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleAssistanceTypeChange('project')}
            className={activeAssistance === 'project' ? 'bg-primary' : ''}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Projects
          </Button>
          <Button
            variant={activeAssistance === 'skill' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleAssistanceTypeChange('skill')}
            className={activeAssistance === 'skill' ? 'bg-primary' : ''}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Skills
          </Button>
          <Button
            variant={activeAssistance === 'cover' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleAssistanceTypeChange('cover')}
            className={activeAssistance === 'cover' ? 'bg-primary' : ''}
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Cover Letter
          </Button>
          <Button
            variant={activeAssistance === 'validate' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleAssistanceTypeChange('validate')}
            className={activeAssistance === 'validate' ? 'bg-primary' : ''}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Validate
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Suggestions */}
        {!loading && (
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {suggestions.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <Bot className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No suggestions available</p>
              </div>
            ) : (
              suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-lg p-3 ${getSuggestionColor(suggestion.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getSuggestionIcon(suggestion.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{suggestion.title}</h4>
                      <p className="text-xs text-gray-700 mb-2">{suggestion.description}</p>

                      {suggestion.action && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onSuggestionClick?.(suggestion)}
                          className="text-xs h-7"
                        >
                          {suggestion.action === 'add-project' && '+ Add to Application'}
                          {suggestion.action === 'auto-add-skills' && '+ Add Skills'}
                          {suggestion.action === 'use-template' && 'Use Template'}
                          {suggestion.action === 'view-missing-skills' && 'View Details'}
                          {!['add-project', 'auto-add-skills', 'use-template', 'view-missing-skills'].includes(suggestion.action) && 'Apply Suggestion'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Help Text */}
        <div className="border-t pt-3 mt-3">
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
            <p>
              <strong>Smart Assistance:</strong> Suggestions based on your institution-verified projects and skills.
              Click any suggestion to apply it to your application.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
