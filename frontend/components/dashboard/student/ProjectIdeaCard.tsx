'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Zap, ArrowRight } from 'lucide-react'
import { Link } from '@/navigation'
import type { ProjectIdea } from '@/lib/skill-path'

interface ProjectIdeaCardProps {
  idea: ProjectIdea
}

const difficultyConfig = {
  beginner: { color: 'bg-green-100 text-green-700', label: 'Beginner' },
  intermediate: { color: 'bg-yellow-100 text-yellow-700', label: 'Intermediate' },
  advanced: { color: 'bg-red-100 text-red-700', label: 'Advanced' },
}

export function ProjectIdeaCard({ idea }: ProjectIdeaCardProps) {
  const difficulty = difficultyConfig[idea.difficulty]

  return (
    <div className="p-4 bg-white border rounded-lg hover:border-gray-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 text-sm">{idea.title}</h4>
        <Badge className={`${difficulty.color} text-xs flex-shrink-0 ml-2`} variant="secondary">
          {difficulty.label}
        </Badge>
      </div>

      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{idea.description}</p>

      {/* Skills badges */}
      <div className="flex flex-wrap gap-1 mb-3">
        {idea.skills.map((skill) => (
          <Badge key={skill} variant="outline" className="text-xs px-1.5 py-0">
            {skill}
          </Badge>
        ))}
      </div>

      {/* Meta info and action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            ~{idea.estimatedHours}h
          </span>
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            {idea.type.replace('_', ' ')}
          </span>
        </div>
        <Button size="sm" variant="ghost" className="h-7 text-xs" asChild>
          <Link href="/dashboard/student/projects/new">
            Start
            <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
