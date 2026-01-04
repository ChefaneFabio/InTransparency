'use client'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ShareButtons } from '@/components/social/ShareButtons'
import {
  ArrowRight,
  CheckCircle,
  Github,
  ExternalLink,
  Award,
  Code,
  GraduationCap,
  Shield
} from 'lucide-react'
import Link from 'next/link'

interface PublicPortfolioProps {
  user: {
    id: string
    username: string
    firstName: string
    lastName: string
    photo?: string
    bio?: string
    university: string
    degree: string
    graduationYear: number
    projects: any[]
    stats: {
      projectsCount: number
      verifiedProjectsCount: number
      verificationScore: number
      skillsCount: number
    }
  }
}

export function PublicPortfolio({ user }: PublicPortfolioProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://intransparency.com'
  const portfolioUrl = `${appUrl}/students/${user.username}/public`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-white shadow-lg">
            <AvatarImage src={user.photo} alt={`${user.firstName} ${user.lastName}`} />
            <AvatarFallback className="text-3xl">{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
          </Avatar>

          <h1 className="text-4xl font-bold mb-2">{user.firstName} {user.lastName}</h1>

          <div className="flex items-center justify-center gap-2 text-lg text-gray-700 mb-4">
            <GraduationCap className="h-5 w-5" />
            <span>{user.degree} @ {user.university}</span>
            <span>"</span>
            <span>Class of {user.graduationYear}</span>
          </div>

          {user.bio && (
            <p className="text-gray-600 max-w-2xl mx-auto mb-6 text-lg leading-relaxed">
              {user.bio}
            </p>
          )}

          {/* CTA for Recruiters */}
          <div className="flex items-center justify-center gap-3">
            <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
              <Link href="/auth/register?role=company">
                Contact {user.firstName}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={`mailto:?subject=Check out ${user.firstName}'s portfolio&body=I found this verified portfolio on InTransparency: ${portfolioUrl}`}>
                Share Profile
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Stats Section */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center border-2 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Code className="h-12 w-12 mx-auto mb-3 text-primary" />
                <div className="text-4xl font-bold text-primary mb-2">{user.stats.projectsCount}</div>
                <div className="text-gray-600">Verified Projects</div>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 mx-auto mb-3 text-green-600" />
                <div className="text-4xl font-bold text-green-600 mb-2">{user.stats.verificationScore}%</div>
                <div className="text-gray-600">Verification Score</div>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Award className="h-12 w-12 mx-auto mb-3 text-blue-600" />
                <div className="text-4xl font-bold text-blue-600 mb-2">{user.stats.skillsCount}</div>
                <div className="text-gray-600">Skills Mastered</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-2">Featured Projects</h2>
          <p className="text-gray-600 mb-8">
            All projects are university-verified and authenticated by institutional systems
          </p>

          {user.projects.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <Code className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>No public projects yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.projects.map((project: any) => (
                <Card key={project.id} className="hover:shadow-xl transition-all border-2 border-gray-100 hover:border-primary/30 overflow-hidden">
                  {/* Project Video Thumbnail */}
                  {project.videos && project.videos.length > 0 && (
                    <div className="relative aspect-video bg-gray-900">
                      <video
                        className="w-full h-full object-cover"
                        controls
                        preload="metadata"
                      >
                        <source src={project.videos[0]} type="video/mp4" />
                      </video>
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                      {project.grade && (
                        <Badge className="ml-2 bg-green-500 text-white flex-shrink-0">
                          {project.grade}
                        </Badge>
                      )}
                    </div>
                    {project.courseName && (
                      <div className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                        <GraduationCap className="h-4 w-4" />
                        {project.courseName}
                        {project.courseCode && ` (${project.courseCode})`}
                      </div>
                    )}
                    <CardDescription className="line-clamp-3">
                      {project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    {/* Verification Badges */}
                    {(project.universityVerified || (project.endorsements && project.endorsements.length > 0)) && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.universityVerified && (
                          <Badge
                            variant="outline"
                            className="border-green-500 text-green-700 bg-green-50"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            University Verified
                          </Badge>
                        )}
                        {project.endorsements && project.endorsements.length > 0 && (
                          <Badge
                            variant="outline"
                            className="border-blue-500 text-blue-700 bg-blue-50"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {project.endorsements.length} Endorsement{project.endorsements.length > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Technologies */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.slice(0, 5).map((tech: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{project.technologies.length - 5} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Project Links */}
                    <div className="flex gap-2">
                      {project.githubUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4 mr-1" />
                            Code
                          </a>
                        </Button>
                      )}
                      {project.liveUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Live
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Skills Section - Aggregated from Projects */}
        {user.stats.skillsCount > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8">Technical Skills</h2>
            <div className="flex flex-wrap gap-2">
              {(() => {
                const allSkills = new Set<string>()
                user.projects.forEach((project: any) => {
                  if (project.skills && Array.isArray(project.skills)) {
                    project.skills.forEach((skill: string) => allSkills.add(skill))
                  }
                  if (project.technologies && Array.isArray(project.technologies)) {
                    project.technologies.forEach((tech: string) => allSkills.add(tech))
                  }
                })
                return Array.from(allSkills).map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="text-sm px-3 py-1">
                    {skill}
                  </Badge>
                ))
              })()}
            </div>
          </section>
        )}

        {/* Viral CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-secondary rounded-2xl text-white text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">
            Build Your Own Verified Portfolio
          </h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join {user.firstName} with an institution-verified portfolio on InTransparency
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100" asChild>
            <Link href="/auth/register?role=student">
              Create Free Portfolio
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="text-sm mt-4 opacity-80">
            Powered by{' '}
            <a href="/" className="underline hover:opacity-100">
              InTransparency
            </a>
          </p>
        </section>
      </div>

      {/* Fixed Share Buttons */}
      <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl p-4 border-2 border-gray-200 z-50">
        <p className="text-sm font-medium mb-2 text-gray-700">Share this portfolio:</p>
        <ShareButtons
          url={portfolioUrl}
          title={`Check out ${user.firstName} ${user.lastName}'s verified portfolio`}
          description={`${user.degree} @ ${user.university} - ${user.stats.projectsCount} verified projects`}
        />
      </div>
    </div>
  )
}
