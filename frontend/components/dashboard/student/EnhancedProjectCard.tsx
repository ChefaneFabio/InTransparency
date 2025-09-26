'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ExternalLink,
  Github,
  Play,
  Code,
  BarChart3,
  Users,
  Star,
  Eye,
  MessageCircle,
  Share2,
  Download,
  Zap,
  TrendingUp,
  ChevronRight,
  Lightbulb,
  Target,
  Award
} from 'lucide-react'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  category: string
  githubUrl?: string
  liveUrl?: string
  imageUrl?: string
  aiAnalysis?: {
    complexityScore: number
    skillsDetected: string[]
    industryRelevance: string[]
    improvementSuggestions: string[]
    careerImpact: string
  }
  metrics?: {
    views: number
    likes: number
    recruiterInterest: number
    similarityToJobs: number
  }
  collaborators?: string[]
  featured?: boolean
}

interface EnhancedProjectCardProps {
  project: Project
  interactive?: boolean
  onViewProject?: (id: string) => void
}

export function EnhancedProjectCard({
  project,
  interactive = true,
  onViewProject
}: EnhancedProjectCardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleViewProject = () => {
    if (onViewProject) {
      onViewProject(project.id)
    }
  }

  const getComplexityColor = (score: number) => {
    if (score >= 80) return 'from-red-500 to-red-600'
    if (score >= 60) return 'from-orange-500 to-orange-600'
    if (score >= 40) return 'from-yellow-500 to-yellow-600'
    return 'from-green-500 to-green-600'
  }

  const getComplexityLabel = (score: number) => {
    if (score >= 80) return 'Expert'
    if (score >= 60) return 'Advanced'
    if (score >= 40) return 'Intermediate'
    return 'Beginner'
  }

  return (
    <Card className={`group hover:shadow-2xl transition-all duration-500 overflow-hidden ${
      project.featured ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
    } ${isExpanded ? 'transform scale-[1.02]' : ''}`}>
      {/* Project Header */}
      <div className="relative">
        {project.imageUrl && (
          <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>
        )}

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}

        {/* Live Demo Button */}
        {project.liveUrl && (
          <div className="absolute top-4 right-4">
            <Button
              size="sm"
              className="bg-blue-600/90 hover:bg-blue-700 backdrop-blur-sm text-white shadow-lg"
              asChild
            >
              <Link href={project.liveUrl} target="_blank">
                <Play className="w-4 h-4 mr-1" />
                Live Demo
              </Link>
            </Button>
          </div>
        )}

        {/* AI Analysis Overlay */}
        {project.aiAnalysis && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${getComplexityColor(project.aiAnalysis.complexityScore)}`}>
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-800">
                      {getComplexityLabel(project.aiAnalysis.complexityScore)} Level
                    </div>
                    <div className="text-xs text-gray-600">
                      AI Complexity Score: {project.aiAnalysis.complexityScore}%
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-blue-600">
                    {project.aiAnalysis.industryRelevance.length} Industries
                  </div>
                  <div className="text-xs text-gray-600">
                    {project.aiAnalysis.skillsDetected.length} Skills Detected
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Project Title and Category */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {project.title}
              </h3>
              <Badge variant="outline" className="mt-1">
                {project.category}
              </Badge>
            </div>

            {project.metrics && (
              <div className="flex items-center space-x-3 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{project.metrics.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{project.metrics.recruiterInterest}</span>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed">
            {project.description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {(project.technologies || []).slice(0, 4).map((tech, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200"
              >
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 4 && (
              <Badge variant="outline" className="text-gray-500">
                +{project.technologies.length - 4} more
              </Badge>
            )}
          </div>

          {interactive && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                <TabsTrigger value="analysis" className="text-xs">AI Analysis</TabsTrigger>
                <TabsTrigger value="impact" className="text-xs">Career Impact</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {project.githubUrl && (
                    <Button variant="outline" size="sm" className="justify-start" asChild>
                      <Link href={project.githubUrl} target="_blank">
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </Link>
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button variant="outline" size="sm" className="justify-start" asChild>
                      <Link href={project.liveUrl} target="_blank">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Demo
                      </Link>
                    </Button>
                  )}
                </div>

                {project.collaborators && project.collaborators.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-800 mb-2">Collaborators</h4>
                    <div className="flex flex-wrap gap-1">
                      {(project.collaborators || []).map((collaborator, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {collaborator}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="analysis" className="space-y-3">
                {project.aiAnalysis && (
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                        <Lightbulb className="w-4 h-4 mr-1 text-yellow-500" />
                        Skills Detected
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {(project.aiAnalysis?.skillsDetected || []).slice(0, 6).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                        <Target className="w-4 h-4 mr-1 text-blue-500" />
                        Industry Relevance
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {(project.aiAnalysis?.industryRelevance || []).map((industry, index) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800 text-xs">
                            {industry}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="impact" className="space-y-3">
                {project.aiAnalysis && (
                  <div className="space-y-3">
                    <div className="bg-green-50 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                        <Award className="w-4 h-4 mr-1 text-green-500" />
                        Career Impact
                      </h4>
                      <p className="text-sm text-gray-700">{project.aiAnalysis.careerImpact}</p>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1 text-orange-500" />
                        Improvement Suggestions
                      </h4>
                      <ul className="space-y-1">
                        {(project.aiAnalysis?.improvementSuggestions || []).slice(0, 2).map((suggestion, index) => (
                          <li key={index} className="text-xs text-gray-700 flex items-start">
                            <ChevronRight className="w-3 h-3 mr-1 mt-0.5 text-orange-500 flex-shrink-0" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {project.metrics && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-purple-50 rounded-lg p-2 text-center">
                          <div className="text-lg font-bold text-purple-600">
                            {project.metrics.similarityToJobs}%
                          </div>
                          <div className="text-xs text-purple-700">Job Match</div>
                        </div>
                        <div className="bg-indigo-50 rounded-lg p-2 text-center">
                          <div className="text-lg font-bold text-indigo-600">
                            {project.metrics.recruiterInterest}
                          </div>
                          <div className="text-xs text-indigo-700">Recruiter Interest</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-blue-600"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                Comment
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-green-600"
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>

            <Button
              onClick={handleViewProject}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              size="sm"
            >
              View Details
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}