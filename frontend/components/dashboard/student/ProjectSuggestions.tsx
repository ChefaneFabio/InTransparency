'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Lightbulb,
  FileText,
  Eye,
  ShieldCheck,
  Code,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
} from 'lucide-react'

interface Suggestion {
  id: string
  category: 'content' | 'visibility' | 'credibility' | 'technical'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  actionLabel: string
  actionHref?: string
  completed: boolean
}

interface ProjectSuggestionsProps {
  projectId: string
  onAction?: (suggestion: Suggestion) => void
}

const categoryIcons: Record<string, typeof FileText> = {
  content: FileText,
  visibility: Eye,
  credibility: ShieldCheck,
  technical: Code,
}

const priorityConfig: Record<string, { color: string; icon: typeof AlertTriangle; label: string }> = {
  high: { color: 'bg-red-100 text-red-700', icon: AlertTriangle, label: 'High' },
  medium: { color: 'bg-yellow-100 text-yellow-700', icon: ArrowUp, label: 'Medium' },
  low: { color: 'bg-primary/10 text-green-700', icon: CheckCircle, label: 'Low' },
}

export function ProjectSuggestions({ projectId, onAction }: ProjectSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [projectTitle, setProjectTitle] = useState('')

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`/api/student/project-suggestions?projectId=${projectId}`)
        if (res.ok) {
          const data = await res.json()
          setSuggestions(data.suggestions)
          setProjectTitle(data.projectTitle)
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSuggestions()
  }, [projectId])

  if (loading) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto" />
        </CardContent>
      </Card>
    )
  }

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <CheckCircle className="h-12 w-12 text-primary mx-auto mb-3" />
          <p className="font-medium text-green-700">Your project looks great!</p>
          <p className="text-sm text-muted-foreground mt-1">No improvement suggestions at this time.</p>
        </CardContent>
      </Card>
    )
  }

  const completedCount = suggestions.filter((s) => s.completed).length
  const score = Math.round((completedCount / suggestions.length) * 100)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-5 w-5 text-secondary" />
              Improvement Suggestions
            </CardTitle>
            <CardDescription>
              {suggestions.length - completedCount} suggestion{suggestions.length - completedCount !== 1 ? 's' : ''} to strengthen this project
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary">{score}%</div>
            <div className="text-xs text-muted-foreground">optimized</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestions.map((suggestion) => {
            const CategoryIcon = categoryIcons[suggestion.category] || FileText
            const pConfig = priorityConfig[suggestion.priority]

            return (
              <div
                key={suggestion.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  suggestion.completed ? 'bg-primary/5 border-primary/20 opacity-60' : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <CategoryIcon className={`h-4 w-4 ${suggestion.completed ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-medium text-sm ${suggestion.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {suggestion.title}
                    </span>
                    <Badge className={`${pConfig.color} text-[10px] px-1.5 py-0`}>
                      {pConfig.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                </div>
                {!suggestion.completed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0"
                    onClick={() => onAction?.(suggestion)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
