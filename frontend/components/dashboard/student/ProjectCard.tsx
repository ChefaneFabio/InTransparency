'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Heart, Share, ExternalLink, Github, Calendar, TrendingUp } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    technologies: string[]
    category: string
    repositoryUrl?: string
    liveUrl?: string
    images: string[]
    innovationScore: number
    complexityLevel: string
    stats?: {
      views: number
      likes: number
      shares: number
    }
    createdAt: string
    updatedAt: string
  }
  variant?: 'default' | 'compact'
}

export function ProjectCard({ project, variant = 'default' }: ProjectCardProps) {
  const {
    id,
    title,
    description,
    technologies,
    category,
    repositoryUrl,
    liveUrl,
    images,
    innovationScore,
    complexityLevel,
    stats = { views: 0, likes: 0, shares: 0 },
    createdAt,
    updatedAt
  } = project

  const getComplexityColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'intermediate':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'advanced':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'expert':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getInnovationColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-gray-600'
  }

  if (variant === 'compact') {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <Link href={`/dashboard/student/projects/${id}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
                <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {stats.views}
                  </span>
                  <span className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    {stats.likes}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0">
                <Badge variant="outline" className={getComplexityColor(complexityLevel)}>
                  {complexityLevel}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <div className="relative">
        {/* Project Image/Thumbnail */}
        <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg relative overflow-hidden">
          {images.length > 0 ? (
            <img
              src={images[0]}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🚀</div>
                <div className="text-sm text-gray-600 font-medium">{category}</div>
              </div>
            </div>
          )}
          
          {/* Innovation Score Badge */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-white text-gray-900 shadow-sm">
              <TrendingUp className="h-3 w-3 mr-1" />
              {innovationScore}/100
            </Badge>
          </div>
          
          {/* Quick Actions */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex space-x-2">
              {repositoryUrl && (
                <Button size="sm" variant="secondary" asChild>
                  <a href={repositoryUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {liveUrl && (
                <Button size="sm" variant="secondary" asChild>
                  <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="line-clamp-1 group-hover:text-blue-600 transition-colors">
                <Link href={`/dashboard/student/projects/${id}`}>
                  {title}
                </Link>
              </CardTitle>
              <CardDescription className="line-clamp-2 mt-1">
                {description}
              </CardDescription>
            </div>
            <Badge variant="outline" className={getComplexityColor(complexityLevel)}>
              {complexityLevel}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Technologies */}
          <div className="flex flex-wrap gap-1 mb-4">
            {technologies.slice(0, 4).map((tech, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {technologies.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{technologies.length - 4} more
              </Badge>
            )}
          </div>

          {/* Stats and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {stats.views}
              </span>
              <span className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                {stats.likes}
              </span>
              <span className="flex items-center">
                <Share className="h-4 w-4 mr-1" />
                {stats.shares}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Innovation Score Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">Innovation Score</span>
              <span className={`font-medium ${getInnovationColor(innovationScore)}`}>
                {innovationScore}/100
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${innovationScore}%` }}
              />
            </div>
          </div>

          {/* Last Updated */}
          <div className="mt-3 text-xs text-gray-500">
            Updated {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}